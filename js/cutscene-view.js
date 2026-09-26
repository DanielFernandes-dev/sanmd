/** Apresentação da abertura; o controlador não conhece seus elementos ou fases. */
function criarVisualAbertura({ document, services }) {
  const get = id => document.getElementById(id);
  const overlay = get('cutscene-overlay');
  const stage = get('cutscene-stage');
  const menu = get('title-menu');
  let stopAudio = () => {};
  let sequence;
  return Object.freeze({
    iniciar(data) {
      sequence = data;
      menu.inert = true;
      document.activeElement?.blur?.();
      overlay.hidden = false;
      stage.dataset.phase = 'preto';
      get('cutscene-title').textContent = data.title;
      get('cutscene-subtitle').textContent = data.subtitle;
    },
    apresentar(step, duration, reduced) {
      stage.style.setProperty('--cutscene-duration', `${duration}ms`);
      stage.dataset.reduced = String(reduced);
      stage.dataset.phase = step.phase;
      if (step.sound) stopAudio = services.tocarEfeitoTransitorio(sequence.lampAudio);
    },
    finalizar() {
      stopAudio();
      stopAudio = () => {};
      for (const animation of overlay.getAnimations?.({ subtree: true }) || []) animation.cancel();
      stage.dataset.phase = 'fim';
      overlay.hidden = true;
      menu.inert = false;
      get('notebook-new').focus();
    }
  });
}
