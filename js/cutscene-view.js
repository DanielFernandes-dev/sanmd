/** Um título: cada inicial permanece no mesmo nó enquanto seu complemento se abre. */
function criarVisualAbertura({ document, window = {}, config, services }) {
  const get = id => document.getElementById(id);
  const overlay = get('cutscene-overlay');
  const stage = get('cutscene-stage');
  const title = get('cutscene-title');
  const menu = get('title-menu');
  let stopAudio = () => {};
  let sequence, words = [], laugh, observer;
  let animations = [];
  let layout;
  let phase = 'preto';
  const cancelAnimations = () => { animations.forEach(animation => animation.cancel()); animations = []; };
  function animate(element, from, to, duration, reduced) {
    Object.assign(element.style, to);
    if (!reduced && element.animate) animations.push(element.animate([from, to],
      { duration, easing: 'steps(40, end)' }));
  }
  function measure() {
    const widths = words.map(word => word.element.offsetWidth || 0);
    const initials = words.map(word => word.initial.offsetWidth || 0);
    const full = widths.reduce((a, b) => a + b, 0);
    const short = initials.reduce((a, b) => a + b, 0);
    const laughWidth = laugh.offsetWidth || 0;
    const positions = sizes => {
      let x = -sizes.reduce((a, b) => a + b, 0) / 2;
      return sizes.map(width => { const position = x; x += width; return position; });
    };
    layout = { full, short, laughWidth, contracted: positions(initials), expanded: positions(widths) };
  }
  const translate = x => `translateX(${x}px)`;
  function place(expanded, withLaugh) {
    title.style.width = `${expanded ? layout.full + (withLaugh ? layout.laughWidth : 0) : layout.short}px`;
    title.style.transform = expanded ? 'scale(1)' : 'scale(var(--cutscene-contracted-scale))';
    words.forEach((word, index) => {
      word.element.style.transform = translate((expanded ? layout.expanded : layout.contracted)[index]
        - (withLaugh ? layout.laughWidth / 2 : 0));
      word.suffix.style.clipPath = expanded ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)';
    });
    laugh.style.transform = translate(layout.full / 2 - (withLaugh ? layout.laughWidth / 2 : 0));
    laugh.style.clipPath = withLaugh ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)';
  }
  return Object.freeze({
    iniciar(data) {
      sequence = data;
      menu.inert = true;
      document.activeElement?.blur?.();
      overlay.hidden = false;
      phase = stage.dataset.phase = 'preto';
      words = data.significado.map((text, index) => {
        const element = document.createElement('span');
        element.className = 'cutscene-word';
        const initial = document.createElement('span');
        initial.textContent = text[0];
        const suffix = document.createElement('span');
        suffix.className = 'cutscene-suffix';
        suffix.textContent = text.slice(1) + (index < data.significado.length - 1 ? '\u00a0' : '');
        element.appendChild(initial); element.appendChild(suffix);
        return { element, initial, suffix };
      });
      laugh = document.createElement('span');
      laugh.className = 'cutscene-laugh';
      laugh.textContent = '\u00a0' + data.risada;
      title.replaceChildren(...words.map(word => word.element), laugh);
      measure(); place(false, false);
      if (window.ResizeObserver) {
        observer = new window.ResizeObserver(() => {
          cancelAnimations(); measure();
          place(!['preto', 'siglas', 'pausa-siglas'].includes(phase),
            ['risada', 'pausa-completa', 'subida', 'preto-final', 'luz'].includes(phase));
        });
        observer.observe(stage);
      }
    },
    apresentar(step, duration, reduced) {
      cancelAnimations();
      phase = step.phase;
      stage.style.setProperty('--cutscene-duration', `${duration}ms`);
      stage.style.setProperty('--cutscene-lamp-delay', `${reduced ? 0 : config.cutscene.lampLightDelay}ms`);
      stage.dataset.reduced = String(reduced);
      stage.dataset.phase = phase;
      if (phase === 'significado' || phase === 'risada') {
        const expanding = phase === 'significado';
        place(true, !expanding);
        words.forEach((word, index) => {
          animate(word.element,
            { transform: translate(expanding ? layout.contracted[index] : layout.expanded[index]) },
            { transform: word.element.style.transform }, duration, reduced);
          if (expanding) animate(word.suffix,
            { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)' }, duration, reduced);
        });
        if (expanding) animate(title, { transform: 'scale(var(--cutscene-contracted-scale))' },
          { transform: 'scale(1)' }, duration, reduced);
        else animate(laugh, { clipPath: 'inset(0 100% 0 0)' },
          { clipPath: 'inset(0 0% 0 0)' }, duration, reduced);
      }
      if (step.sound) stopAudio = services.tocarEfeitoTransitorio(sequence.lampAudio);
    },
    finalizar() {
      stopAudio(); stopAudio = () => {};
      observer?.disconnect();
      cancelAnimations();
      for (const animation of overlay.getAnimations?.({ subtree: true }) || []) animation.cancel();
      phase = stage.dataset.phase = 'fim';
      overlay.hidden = true;
      menu.inert = false;
      get('notebook-new').focus();
    }
  });
}
