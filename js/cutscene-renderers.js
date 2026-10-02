/** Seleção de apresentação; ordem, input e Skip pertencem ao único controlador. */
function criarVisualCutscenes(context) {
  const opening = criarVisualAbertura(context);
  const frames = criarVisualQuadros(context);
  let active = opening;
  return Object.freeze({
    iniciar(sequence) { active = sequence.frames ? frames : opening; active.iniciar(sequence); },
    preparar() { return active.preparar?.(); },
    apresentar(...args) { active.apresentar(...args); },
    encerrar() { return active.encerrar?.(); },
    finalizar() { active.finalizar(); }
  });
}

