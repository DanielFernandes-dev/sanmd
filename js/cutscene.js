/** Sequências por instância. Timers, input e cancelamento nunca entram no estado salvo. */
function criarCutsceneController({ document, window, config, services, sequences, visual }) {
  const schedule = window.setTimeout.bind(window);
  const cancel = window.clearTimeout?.bind(window) ?? clearTimeout;
  let current = null;
  let timer = null;
  let generation = 0;
  let firstInput = null;
  let swallowClick = false;
  let ready = false;
  let skipping = false;
  let complete;

  function finalizar() {
    if (!current) return;
    generation++;
    cancel(timer);
    timer = null;
    firstInput = null;
    visual.finalizar();
    current = null;
    skipping = false;
    complete();
  }
  function skip() {
    if (!current || skipping) return;
    skipping = true;
    cancel(timer);
    timer = null;
    if (ready) finalizar();
  }
  function input(event) {
    // Consumir também click/dblclick sintetizados DEPOIS do pointerup que pulou.
    if (!current) {
      if (event.type === 'pointerdown' || event.type === 'keydown') swallowClick = false;
      if (!swallowClick || !['click', 'dblclick', 'touchend', 'mouseup', 'keyup'].includes(event.type)) return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    if (!current) return;
    if (event.type === 'pointerdown' || event.type === 'keydown') swallowClick = true;
    if (event.type === 'pointercancel') firstInput = null;
    if (event.type !== 'pointerup' || event.isPrimary === false || event.button > 0) return;
    swallowClick = true;
    const now = event.timeStamp;
    if (firstInput !== null && now - firstInput <= config.cutscene.skipDoubleInputWindow) skip();
    else firstInput = now;
  }
  for (const type of ['pointerdown', 'pointerup', 'pointermove', 'pointercancel', 'mousedown', 'mouseup',
    'click', 'dblclick', 'touchstart', 'touchend', 'touchmove', 'keydown', 'keyup', 'submit', 'contextmenu', 'wheel']) {
    document.addEventListener(type, input, { capture: true, passive: false });
  }
  function iniciar(id, onComplete = () => {}) {
    if (current) return false;
    const sequence = sequences[id];
    if (!sequence) throw new Error(`Cutscene desconhecida: ${id}`);
    current = id;
    skipping = ready = false;
    firstInput = null;
    complete = onComplete;
    const token = ++generation;
    visual.iniciar(sequence);
    let index = 0;
    function next() {
      if (token !== generation || !current) return;
      if (index === sequence.steps.length) { finalizar(); return; }
      const step = sequence.steps[index++];
      const reduced = services.movimentoReduzido();
      const duration = config.cutscene[reduced && step.reduced ? step.reduced : step.duration];
      visual.apresentar(step, duration, reduced);
      // A apresentação pode permanecer no último estado até o Skip.
      if (step.hold) { timer = null; return; }
      timer = schedule(next, duration);
    }
    // O carregador global compartilha cache, decode e limite de espera.
    Promise.resolve().then(() => services.prepareSceneImages(sequence.assets || []))
      .catch(error => console.error('Asset da cutscene indisponível', error))
      .then(() => {
        if (token !== generation) return;
        ready = true;
        if (skipping) finalizar(); else next();
      });
    return true;
  }
  return Object.freeze({ iniciarCutscene: iniciar, pularCutscene: skip, isCutsceneActive: () => current !== null,
    getCurrent: () => current, isSkipping: () => skipping });
}
