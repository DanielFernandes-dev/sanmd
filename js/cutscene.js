/** Uma sessão por execução: apresentação nunca entra no estado salvo. */
function criarCutsceneController({ document, window, config, services, sequences, visual }) {
  const schedule = window.setTimeout.bind(window);
  const cancel = window.clearTimeout?.bind(window) ?? clearTimeout;
  let session = null;
  let firstInput = null;
  let lastPointerUp = null;
  let lastTouchEnd = null;

  function cancelarAvanco(run) {
    cancel(run.timer);
    run.timer = null;
  }

  function finalizar(run) {
    if (session !== run || run.status === 'finishing') return;
    run.status = 'finishing';
    cancelarAvanco(run);
    firstInput = null;
    lastPointerUp = null;
    lastTouchEnd = null;
    const done = () => {
      if (session !== run) return;
      try { visual.finalizar(); }
      catch (error) { console.error('Falha na limpeza da cutscene', error); }
      session = null;
      run.onComplete();
    };
    try {
      const closing = visual.encerrar?.();
      if (closing) Promise.resolve(closing).then(done, error => {
        console.error('Falha ao encerrar cutscene', error); done();
      });
      else done();
    } catch (error) {
      console.error('Falha ao encerrar cutscene', error);
      done();
    }
  }

  function skip(defer = false) {
    const run = session;
    if (!run || run.skipRequested || run.status === 'finishing') return;
    run.skipRequested = true;
    cancelarAvanco(run);
    if (run.status !== 'preparing') {
      if (defer) run.timer = schedule(() => finalizar(run), 0);
      else finalizar(run);
    }
  }
  function input(event) {
    const run = session;
    if (!run) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.type === 'pointercancel') {
      firstInput = null;
      lastPointerUp = null;
      lastTouchEnd = null;
    }
    if (run.skipRequested) return;
    if (event.type === 'pointerup') {
      if (event.isPrimary === false || event.button > 0) return;
      if (event.pointerType === 'touch' && lastTouchEnd !== null
        && event.timeStamp - lastTouchEnd < 80) return;
      lastPointerUp = event.timeStamp;
    } else if (event.type === 'touchend') {
      if (event.touches?.length || (event.changedTouches && event.changedTouches.length !== 1)
        || (lastPointerUp !== null && event.timeStamp - lastPointerUp < 80)) return;
      lastTouchEnd = event.timeStamp;
    } else return;
    const now = event.timeStamp;
    if (firstInput !== null && now - firstInput <= config.cutscene.skipDoubleInputWindow) skip(true);
    else firstInput = now;
  }
  for (const type of ['pointerdown', 'pointerup', 'pointermove', 'pointercancel', 'mousedown', 'mouseup',
    'click', 'dblclick', 'touchstart', 'touchend', 'touchmove', 'keydown', 'keyup', 'submit', 'contextmenu', 'wheel']) {
    document.addEventListener(type, input, { capture: true, passive: false });
  }
  function avancar(run) {
    if (session !== run || run.status !== 'playing') return;
    run.timer = null;
    const step = run.sequence.steps[run.index++];
    if (!step) { finalizar(run); return; }
    try {
      const reduced = services.movimentoReduzido();
      const duration = run.timing[reduced && step.reduced ? step.reduced : step.duration];
      if (!Number.isFinite(duration) || duration < 0) throw new Error(`Duração inválida: ${step.duration}`);
      visual.apresentar(step, duration, reduced);
      if (session !== run || run.status !== 'playing' || step.hold) return;
      run.timer = schedule(() => avancar(run), duration);
    } catch (error) {
      console.error('Falha ao apresentar cutscene', error);
      finalizar(run);
    }
  }

  function iniciar(id, onComplete = () => {}) {
    if (session) return false;
    const sequence = Object.hasOwn(sequences, id) && sequences[id];
    if (!sequence) throw new Error(`Cutscene desconhecida: ${id}`);
    const run = session = { id, sequence, onComplete, index: 0, timer: null,
      status: 'preparing', skipRequested: false,
      timing: sequence.timing ? config.cutscene[sequence.timing] : config.cutscene };
    firstInput = null;
    lastPointerUp = null;
    lastTouchEnd = null;
    try { visual.iniciar(sequence); }
    catch (error) {
      console.error('Falha ao iniciar cutscene', error);
      finalizar(run);
      return true;
    }
    // Identidade da sessão impede qualquer callback antigo de afetar outra execução.
    Promise.resolve().then(() => Promise.all([
      services.prepareSceneImages(sequence.assets || []), visual.preparar?.()
    ])).catch(error => {
      if (session !== run) return;
      console.error('Asset da cutscene indisponível', error);
      if (sequence.frames) run.skipRequested = true;
    }).then(() => {
      if (session !== run || run.status !== 'preparing') return;
      run.status = 'playing';
      if (run.skipRequested) finalizar(run); else avancar(run);
    });
    return true;
  }
  return Object.freeze({ iniciarCutscene: iniciar, pularCutscene: skip,
    isCutsceneActive: () => session !== null, getCurrent: () => session?.id ?? null,
    isSkipping: () => session?.skipRequested ?? false });
}
