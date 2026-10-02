/** Uma imagem ativa, palco de proporção fixa e cobertura preta para entrada/saída. */
function criarVisualQuadros({ document, window, config, services }) {
  const get = id => document.getElementById(id);
  const overlay = get('frame-cutscene-overlay');
  const stage = get('frame-cutscene-stage');
  const frame = get('cutscene-frame');
  const previous = get('cutscene-previous-frame');
  const fade = get('frame-cutscene-fade');
  const title = get('frame-cutscene-title');
  const effects = get('cutscene-effects');
  const cameras = {
    'slow-push': { scale: 1.02, origin: '50% 50%' },
    'small-push': { scale: 1.025, origin: '40% 55%' }
  };
  let sequence, timing, audio;
  let animations = [];
  function clear(holdFrame = false) {
    const transform = holdFrame ? (window.getComputedStyle?.(frame).transform || frame.style.transform) : 'none';
    animations.forEach(animation => animation.cancel());
    animations = [];
    frame.style.transform = transform;
    stage.style.transform = 'none';
    effects.style.opacity = '0';
    previous.style.opacity = '0';
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
  function transicionar(step, reduced) {
    const source = frame.dataset.frame && frame.src;
    const transform = window.getComputedStyle?.(frame).transform || frame.style.transform;
    clear();
    if (step.transition === 'soft-cut' && source && !reduced) {
      previous.src = source;
      previous.style.transform = transform;
      previous.style.transformOrigin = frame.style.transformOrigin;
      animate(previous, [{ opacity: 1 }, { opacity: 0 }], timing.frameBlend);
    }
    if (step.transition === 'fade-in') {
      fade.style.opacity = '0';
      animate(fade, [{ opacity: 1 }, { opacity: 0 }], timing.entryFade);
    }
  }
  function aplicarCamera(name, duration, reduced) {
    const camera = timing.cameras?.[name] || cameras[name];
    if (reduced || !camera) return;
    frame.style.transformOrigin = camera.origin;
    frame.style.transform = `scale(${camera.scale}) translateX(${camera.x || 0}%)`;
    animate(frame, [{ transform: 'scale(1)' }, { transform: frame.style.transform }], duration);
  }
  return Object.freeze({
    iniciar(data) {
      sequence = data;
      timing = config.cutscene[data.timing];
      audio = criarAudioCutscene({ window, services }, timing, data.sounds || {});
      document.activeElement?.blur?.();
      overlay.hidden = false;
      title.hidden = true;
      title.textContent = data.title || '';
      title.dataset.phase = '';
      fade.style.opacity = '1';
      frame.style.visibility = 'hidden';
    },
    preparar() { return audio.preparar(); },
    apresentar(step, duration, reduced) {
      if (step.type) {
        clear(true);
        title.hidden = step.type !== 'title';
        if (step.type === 'fade-black') {
          fade.style.opacity = '1';
          animate(fade, [{ opacity: 0 }, { opacity: 1 }], duration);
          audio.encerrar().catch(error => console.error('Falha no fade de áudio', error));
        } else {
          fade.style.opacity = '1';
          frame.style.visibility = 'hidden';
        }
        if (step.type === 'title') {
          title.dataset.phase = step.phase;
          title.style.animationDuration = `${duration}ms`;
          title.dataset.reduced = String(reduced);
        }
        return;
      }
      transicionar(step, reduced);
      audio.apresentar(step.sfx, step.weight, step.fadeTo, duration);
      frame.src = sequence.frames[step.frame];
      frame.dataset.frame = step.frame;
      frame.style.visibility = 'visible';
      aplicarCamera(step.camera, duration, reduced);
      if (step.effect === 'computer-error') computerErrorFlash(step.flashRegion, reduced);
      if (!reduced && step.shake) shake(step.shake);
    },
    async encerrar() {
      clear(true);
      await Promise.all([Number(fade.style.opacity) === 1 ? Promise.resolve()
        : services.animarFade(fade, Number(fade.style.opacity), 1, timing.exitFade),
        audio.encerrar()]);
    },
    finalizar() {
      clear();
      audio.finalizar();
      title.hidden = true;
      for (const animation of title.getAnimations?.() || []) animation.cancel();
      overlay.hidden = true;
      frame.removeAttribute('src');
      previous.removeAttribute('src');
      delete frame.dataset.frame;
    }
  });
}
