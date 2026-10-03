/** Pool por execução. Preload, fade e descarte compartilham o mesmo ciclo de vida. */
function criarAudioCutscene({ window, services }, timing, sounds, ambienceId = 'room_ambience') {
  const pool = new Map();
  const pending = new Set();
  const playback = new WeakMap();
  let active = true;
  let current = null;
  let ambience = null;
  let fadeTimer = null;
  let stepFadeTimer = null;
  let preparation = null;
  let closing = null;
  const pause = audio => {
    if (!audio) return;
    playback.delete(audio);
    audio.pause(); audio.currentTime = 0;
  };
  const dispose = audio => { pause(audio); audio.removeAttribute('src'); audio.load(); };

  function carregar(id, sound) {
    return new Promise(resolve => {
      let audio, timeout, settled = false;
      const cancelLoad = () => finish(false);
      function finish(ok) {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        pending.delete(cancelLoad);
        if (audio) {
          audio.oncanplaythrough = audio.onerror = null;
          if (ok && active) pool.set(id, audio);
          else dispose(audio);
        }
        resolve();
      }
      pending.add(cancelLoad);
      try {
        audio = new window.Audio();
        audio.preload = 'auto';
        audio.volume = sound.volume;
        audio.loop = Boolean(sound.loop);
        audio.oncanplaythrough = () => finish(true);
        audio.onerror = () => { console.warn(`SFX indisponível: ${id}`); finish(false); };
        timeout = window.setTimeout(() => {
          console.warn(`Preload de SFX expirou: ${id}`); finish(false);
        }, timing.audioTimeout);
        audio.src = sound.src;
        audio.load();
      } catch { finish(false); }
    });
  }
  function preparar() {
    if (!preparation) preparation = !active || !window.Audio
      ? Promise.resolve()
      : Promise.all(Object.entries(sounds).map(([id, sound]) => carregar(id, sound)));
    return preparation;
  }
  function play(id, weight = 1) {
    if (!active) return null;
    const audio = pool.get(id);
    if (!audio) return null;
    audio.volume = Math.min(1, sounds[id].volume * weight);
    const request = {};
    playback.set(audio, request);
    const failed = () => {
      // O mesmo WAV pode voltar no quadro seguinte antes da rejeição anterior.
      if (playback.get(audio) === request) pause(audio);
    };
    try { audio.play()?.catch(failed); } catch { failed(); }
    return audio;
  }
  function stopStep() {
    window.clearInterval?.(stepFadeTimer); stepFadeTimer = null;
    pause(current); current = null;
  }
  function cancelarPreload() { for (const cancel of [...pending]) cancel(); }
  function finalizar() {
    active = false;
    stopStep();
    cancelarPreload();
    window.clearInterval?.(fadeTimer);
    fadeTimer = null;
    for (const audio of pool.values()) dispose(audio);
    pool.clear(); current = ambience = null;
  }
  async function fadeOut() {
    active = false;
    cancelarPreload();
    stopStep();
    const background = ambience;
    try {
      if (background) {
        const volume = background.volume;
        const start = Date.now();
        fadeTimer = window.setInterval(() => {
          if (ambience !== background) return;
          background.volume = volume * Math.max(0, 1 - (Date.now() - start) / timing.audioFade);
        }, timing.audioFadeTick);
        await services.esperarAnimacao(timing.audioFade);
      }
    } finally { finalizar(); }
  }
  return Object.freeze({
    preparar,
    apresentar(id, weight = 1, fadeTo, duration) {
      if (!active) return;
      stopStep();
      if (!ambience) ambience = play(ambienceId);
      if (id) current = play(id, weight);
      if (current && Number.isFinite(fadeTo) && duration > 0) {
        const sound = current, start = Date.now(), from = sound.volume;
        const to = sounds[id].volume * fadeTo;
        const request = playback.get(sound);
        stepFadeTimer = window.setInterval(() => {
          if (!active || playback.get(sound) !== request) return;
          sound.volume = from + (to - from) * Math.min(1, (Date.now() - start) / duration);
        }, timing.audioFadeTick);
      }
    },
    encerrar() { if (!closing) closing = fadeOut(); return closing; },
    finalizar
  });
}
