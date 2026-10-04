/** PC é uma interface da cena; disponibilidade e navegação pertencem ao mundo. */
function criarSistemaEstacaoTrabalho({ state, el, document, services }) {
  const ui = el.workstation;
  const app = document.getElementById("app");
  let initialized = false;
  function estacaoAberta() { return !ui.overlay.hidden; }
  function abrirEstacaoTrabalho() {
    if (state.modo !== "livre" || services.isSceneTransitioning() || services.isCutsceneActive()
      || state.localizacao.cena !== "delegacia_mesa_mj" || el.bag.bagDialog.open) return false;
    ui.overlay.hidden = false;
    ui.overlay.inert = false;
    state.modo = "interface";
    app.inert = true;
    services.fecharMenuIrPara();
    services.definirBotoes();
    ui.map.focus();
    return true;
  }
  function fecharEstacaoTrabalho({ restoreFocus = true } = {}) {
    if (!estacaoAberta() || !el.worldMap.mapOverlay.hidden) return false;
    ui.overlay.hidden = true;
    ui.overlay.inert = false;
    state.modo = "livre";
    app.inert = false;
    services.definirBotoes();
    if (restoreFocus) Array.from(el.scene.hotspotLayer.children)
      .find(button => button.dataset.hotspot === "mj_computer")?.focus();
    return true;
  }
  function inicializarEstacaoTrabalho() {
    if (initialized) return;
    initialized = true;
    ui.overlay.hidden = true;
    ui.map.addEventListener("click", () => services.abrirMapaGlobal({ source: "delegacia_computer" }));
    ui.close.addEventListener("click", () => fecharEstacaoTrabalho());
    document.addEventListener("keydown", event => {
      if (event.defaultPrevented || !estacaoAberta() || !el.worldMap.mapOverlay.hidden) return;
      if (event.key === "Escape") { event.preventDefault(); fecharEstacaoTrabalho(); }
    });
  }
  return Object.freeze({ estacaoAberta, abrirEstacaoTrabalho, fecharEstacaoTrabalho, inicializarEstacaoTrabalho });
}
