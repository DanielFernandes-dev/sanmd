/** Ponto único para pedidos de viagem global; uma camada visual futura entra antes de irParaLocal. */
function criarSistemaViagemGlobal({ state, el, services }) {
  let traveling = false;
  async function travelToWorldLocation(localId) {
    if (traveling || el.bag.bagDialog.open || services.isSceneTransitioning() || services.isCutsceneActive()
      || !["livre", "interface"].includes(state.modo)
      || !services.localDisponivel(localId) || localId === state.localizacao.local) return false;
    traveling = true;
    try {
      services.bloquearMapaGlobal();
      services.fecharInterfacesMapa();
      if (state.modo === "celular") services.fecharCelular();
      // Futuro fast travel visual entra aqui, antes da navegação real.
      const success = await services.irParaLocal(localId);
      if (success) services.registrarAutosave();
      if (state.modo === "livre") el.scene.btnIrPara.focus();
      return Boolean(success);
    } finally { traveling = false; }
  }
  return Object.freeze({ travelToWorldLocation, isWorldTraveling: () => traveling });
}
