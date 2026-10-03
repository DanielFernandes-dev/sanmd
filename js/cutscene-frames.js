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
  function ocultarTitulo() {
    title.hidden = true;
    for (const animation of title.getAnimations?.() || []) animation.cancel();
    title.dataset.phase = '';
    delete title.dataset.reduced;
    title.style.animationDuration = '';
  }
  function apresentarPreto() {
    clear(true);
    ocultarTitulo();
    fade.style.opacity = '1';
    frame.style.visibility = 'hidden';
  }
  const presenters = {
    frame(step, duration, reduced) {
      const source = sequence.frames[step.frame];
      if (!source) throw new Error(`Quadro desconhecido: ${step.frame}`);
      ocultarTitulo();
      transicionar(step, reduced);
      audio.apresentar(step.sfx, step.weight, step.fadeTo, duration);
      frame.src = source;
      frame.dataset.frame = step.frame;
      frame.style.visibility = 'visible';
      aplicarCamera(step.camera, duration, reduced);
      if (step.effect === 'computer-error') computerErrorFlash(step.flashRegion, reduced);
      if (!reduced && step.shake) shake(step.shake);
    },
    'fade-black'(step, duration) {
      clear(true);
      ocultarTitulo();
      fade.style.opacity = '1';
      animate(fade, [{ opacity: 0 }, { opacity: 1 }], duration);
      audio.encerrar().catch(error => console.error('Falha no fade de áudio', error));
    },
    black: apresentarPreto,
    title(step, duration, reduced) {
      if (!['reveal', 'hold', 'exit'].includes(step.phase)) throw new Error(`Fase de título inválida: ${step.phase}`);
      apresentarPreto();
      title.hidden = false;
      title.dataset.phase = step.phase;
      title.style.animationDuration = `${duration}ms`;
      title.dataset.reduced = String(reduced);
    }
  };
  return Object.freeze({
    iniciar(data) {
      sequence = data;
      timing = config.cutscene[data.timing];
      audio = criarAudioCutscene({ window, services }, timing, data.sounds || {}, data.ambience);
      document.activeElement?.blur?.();
      overlay.hidden = false;
      ocultarTitulo();
      title.textContent = data.title || '';
      fade.style.opacity = '1';
      frame.style.visibility = 'hidden';
    },
    preparar() { return audio.preparar(); },
    apresentar(step, duration, reduced) {
      const type = step.type || 'frame';
      if (!Object.hasOwn(presenters, type)) throw new Error(`Tipo de passo inválido: ${type}`);
      presenters[type](step, duration, reduced);
    },
    async encerrar() {
      clear(true);
      ocultarTitulo();
      await Promise.all([Number(fade.style.opacity) === 1 ? Promise.resolve()
        : services.animarFade(fade, Number(fade.style.opacity), 1, timing.exitFade),
        audio.encerrar()]);
    },
    finalizar() {
      clear();
      audio.finalizar();
      ocultarTitulo();
      title.textContent = '';
      frame.style.visibility = 'hidden';
      frame.style.transformOrigin = '';
      previous.style.transform = 'none';
      effects.style.clipPath = '';
      fade.style.opacity = '1';
      overlay.hidden = true;
      frame.removeAttribute('src');
      previous.removeAttribute('src');
      delete frame.dataset.frame;
    }
  });
}
