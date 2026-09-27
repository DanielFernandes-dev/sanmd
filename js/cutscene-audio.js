/** Pool de SFX transitórios. Preload limitado; nenhuma reprodução tardia após Skip. */
function criarAudioCutscene({ window, services }, timing, sounds) {
  const pool = new Map();
  let active = true;
  let current = null;
  let ambience = null;
  let fadeTimer = null;
  const pause = audio => { if (audio) { audio.pause(); audio.currentTime = 0; } };
  async function preparar() {
    if (!window.Audio) return;
    await Promise.all(Object.entries(sounds).map(([id, sound]) => new Promise(resolve => {
      let audio, timeout, settled = false;
      const finish = ok => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        if (audio) {
          audio.oncanplaythrough = audio.onerror = null;
          if (ok && active) pool.set(id, audio);
          else { audio.removeAttribute('src'); audio.load(); }
        }
        resolve();
      };
      try {
        audio = new window.Audio();
        audio.preload = 'auto';
        audio.volume = sound.volume;
        audio.loop = Boolean(sound.loop);
        audio.oncanplaythrough = () => finish(true);
        audio.onerror = () => { console.warn(`SFX indisponível: ${id}`); finish(false); };
        timeout = window.setTimeout(() => { console.warn(`Preload de SFX expirou: ${id}`); finish(false); }, timing.audioTimeout);
        audio.src = sound.src;
        audio.load();
      } catch { finish(false); }
    })));
  }
  function play(id, weight = 1) {
    if (!active) return null;
    const audio = pool.get(id);
    if (!audio) return null;
    audio.volume = Math.min(1, sounds[id].volume * weight);
    try { audio.play()?.catch(() => pause(audio)); } catch { pause(audio); }
    return audio;
  }
  function stopStep() { pause(current); current = null; }
  return {
    preparar,
    apresentar(id, weight) {
      stopStep();
      if (!ambience) ambience = play('room_ambience');
      if (id) current = play(id, weight);
    },
    async encerrar() {
      active = false;
      stopStep();
      if (ambience) {
        const volume = ambience.volume;
        const start = Date.now();
        fadeTimer = window.setInterval(() => {
          ambience.volume = volume * Math.max(0, 1 - (Date.now() - start) / timing.audioFade);
        }, timing.audioFadeTick);
        await services.esperarAnimacao(timing.audioFade);
      }
      this.finalizar();
    },
    finalizar() {
      active = false;
      window.clearInterval?.(fadeTimer);
      fadeTimer = null;
      for (const audio of pool.values()) {
        pause(audio); audio.removeAttribute('src'); audio.load();
      }
      pool.clear(); current = ambience = null;
    }
  };
}
