/** Ponto único para pedidos de viagem global; uma camada visual futura entra antes de irParaLocal. */
function criarSistemaViagemGlobal({ state, services }) {
  let traveling = false;
  async function travelToWorldLocation(localId) {
    if (traveling || services.isSceneTransitioning() || services.isCutsceneActive()
      || !["livre", "interface"].includes(state.modo)
      || !services.localDisponivel(localId) || localId === state.localizacao.local) return false;
    traveling = true;
    try {
      services.bloquearMapaGlobal();
      services.fecharInterfacesMapa();
      const success = await services.irParaLocal(localId);
      if (success) services.registrarAutosave();
      return Boolean(success);
    } finally { traveling = false; }
  }
  return Object.freeze({ travelToWorldLocation, isWorldTraveling: () => traveling });
}
