/** Seleção de apresentação; ordem, input e Skip pertencem ao único controlador. */
function criarVisualCutscenes(context) {
  const opening = criarVisualAbertura(context);
  const frames = criarVisualQuadros(context);
  let active = opening;
  return {
    iniciar(sequence) { active = sequence.frames ? frames : opening; active.iniciar(sequence); },
    preparar() { return active.preparar?.(); },
    apresentar(...args) { active.apresentar(...args); },
    encerrar() { return active.encerrar?.(); },
    finalizar() { active.finalizar(); }
  };
}

/** Uma imagem ativa, palco de proporção fixa e cobertura preta para entrada/saída. */
function criarVisualQuadros({ document, window, config, services }) {
  const get = id => document.getElementById(id);
  const overlay = get('frame-cutscene-overlay');
  const stage = get('frame-cutscene-stage');
  const frame = get('cutscene-frame');
  const fade = get('frame-cutscene-fade');
  const effects = get('cutscene-effects');
  let sequence, timing, audio;
  let animations = [];
  function clear(holdFrame = false) {
    const transform = holdFrame ? (window.getComputedStyle?.(frame).transform || frame.style.transform) : 'none';
    animations.forEach(animation => animation.cancel());
    animations = [];
    frame.style.transform = transform;
    stage.style.transform = 'none';
    effects.style.opacity = '0';
  }
  function animate(element, keys, duration) {
    if (element.animate) animations.push(element.animate(keys, { duration, easing: 'linear' }));
  }
  function shake(kind) {
    const pixels = kind === 'impact' ? 3 : 1;
    animate(stage, [0, -1, 1, -.5, .5, 0].map(x => ({
      transform: `translate(${x * pixels}px, ${-x * pixels / 2}px)`
    })), kind === 'impact' ? timing.impactShake : timing.errorShake);
  }
  function computerErrorFlash(region, reduced) {
    const [x, y, width, height] = region;
    effects.style.clipPath = `polygon(${x}% ${y}%, ${x + width}% ${y}%, ${x + width}% ${y + height}%, ${x}% ${y + height}%)`;
    animate(effects, [{ opacity: reduced ? .08 : .2 }, { opacity: 0 }], timing.errorFlash);
  }
  return {
    iniciar(data) {
      sequence = data;
      timing = config.cutscene[data.timing];
      audio = criarAudioCutscene({ window, services }, timing, data.sounds || {});
      document.activeElement?.blur?.();
      overlay.hidden = false;
      fade.style.opacity = '1';
      frame.style.visibility = 'hidden';
    },
    preparar() { return audio.preparar(); },
    apresentar(step, duration, reduced) {
      clear();
      audio.apresentar(step.sfx, step.weight);
      frame.src = sequence.frames[step.frame];
      frame.dataset.frame = step.frame;
      frame.style.visibility = 'visible';
      if (!reduced && step.camera) {
        const scale = step.camera === 'small-push' ? 1.025 : 1.02;
        frame.style.transformOrigin = step.camera === 'small-push' ? '40% 55%' : '50% 50%';
        frame.style.transform = `scale(${scale})`;
        animate(frame, [{ transform: 'scale(1)' }, { transform: `scale(${scale})` }], duration);
      }
      if (step.effect === 'computer-error') computerErrorFlash(step.flashRegion, reduced);
      if (!reduced && step.shake) shake(step.shake);
      if (step.transition === 'fade-in') {
        fade.style.opacity = '0';
        animate(fade, [{ opacity: 1 }, { opacity: 0 }], timing.entryFade);
      }
    },
    async encerrar() {
      clear(true);
      await Promise.all([services.animarFade(fade, Number(fade.style.opacity), 1, timing.exitFade),
        audio.encerrar()]);
    },
    finalizar() {
      clear();
      audio.finalizar();
      overlay.hidden = true;
      frame.removeAttribute('src');
      delete frame.dataset.frame;
    }
  };
}
