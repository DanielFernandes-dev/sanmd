/** Mapa global: disponibilidade por local, sem conhecer cenas internas. */
function criarSistemaMapaGlobal({ state, el, document, data: DATA, services }) {
  const ui = el.worldMap;
  const app = document.getElementById("app");
  let opener = null;
  let returnHotspotId = null;
  let traveling = false;
  let initialized = false;

  function normalizarCoordenada(value) {
    return String(value ?? "").normalize("NFKD").toUpperCase()
      .replace(/[º°'’‘′"“”″,.;:\s-]/g, "");
  }

  function modalAberto() {
    return !ui.noteOverlay.hidden || !ui.mapOverlay.hidden;
  }

  function focusOpener() {
    const hotspot = Array.from(el.scene.hotspotLayer.children)
      .find(button => button.dataset.hotspot === returnHotspotId);
    (hotspot ?? (opener?.isConnected ? opener : el.scene.hotspotLayer.firstElementChild)
      ?? el.bag.btnBolsa)?.focus?.();
  }

  function abrirBilhete({ returnHotspotId: hotspotId } = {}) {
    if (state.modo !== "livre" || modalAberto() || services.isSceneTransitioning()
      || services.isCutsceneActive()) return false;
    if (state.localizacao.cena !== "delegacia_mesa_mj") return false;
    opener = document.activeElement;
    returnHotspotId = hotspotId ?? null;
    ui.noteLatitude.textContent = DATA.prototypeAlleyCoordinates.latitude;
    ui.noteLongitude.textContent = DATA.prototypeAlleyCoordinates.longitude;
    state.sceneState.delegacia_mesa_mj = {
      computerOn: false, ...state.sceneState.delegacia_mesa_mj, noteRead: true
    };
    ui.noteOverlay.hidden = false;
    state.modo = "interface";
    app.inert = true;
    services.fecharMenuIrPara();
    services.definirBotoes();
    ui.noteClose.focus();
    return true;
  }

  function fecharBilhete({ restoreFocus = true } = {}) {
    if (ui.noteOverlay.hidden) return false;
    ui.noteOverlay.hidden = true;
    state.modo = "livre";
    app.inert = false;
    services.definirBotoes();
    if (restoreFocus) focusOpener();
    opener = null;
    returnHotspotId = null;
    return true;
  }

  function localDisponivel(localId) {
    return state.worldMap.availableLocations[localId] === true
      && Object.hasOwn(DATA.locais, localId);
  }

  function renderizarMapaGlobal() {
    ui.mapLocations.replaceChildren(...Object.values(DATA.worldMapLocations).map(location => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.localId = location.localId;
      button.textContent = location.label;
      const current = state.localizacao.local === location.localId;
      const available = localDisponivel(location.localId);
      button.className = `map-location ${current ? "map-location--current" : available
        ? "map-location--available" : "map-location--locked"}`;
      button.disabled = traveling || current || !available;
      button.ariaLabel = `${location.label} — ${current ? "local atual" : available ? "disponível" : "indisponível"}`;
      button.addEventListener("click", () => viajarPeloMapa(location.localId));
      return button;
    }));
  }

  function abrirMapaGlobal({ source, returnHotspotId: hotspotId } = {}) {
    if (state.modo !== "livre" || modalAberto() || services.isSceneTransitioning()
      || services.isCutsceneActive() || el.bag.bagDialog.open) return false;
    opener = document.activeElement;
    returnHotspotId = hotspotId ?? null;
    traveling = false;
    ui.mapFeedback.textContent = "";
    ui.mapLatitude.value = "";
    ui.mapLongitude.value = "";
    ui.mapOverlay.dataset.source = source ?? "";
    ui.mapOverlay.hidden = false;
    state.modo = "interface";
    app.inert = true;
    services.fecharMenuIrPara();
    renderizarMapaGlobal();
    services.definirBotoes();
    (state.worldMap.availableLocations.beco ? ui.mapClose : ui.mapLatitude).focus();
    return true;
  }

  function fecharMapaGlobal({ restoreFocus = true } = {}) {
    if (ui.mapOverlay.hidden) return false;
    ui.mapOverlay.hidden = true;
    state.modo = "livre";
    app.inert = false;
    services.definirBotoes();
    if (restoreFocus) focusOpener();
    opener = null;
    returnHotspotId = null;
    return true;
  }

  function localizarCoordenadas() {
    if (ui.mapOverlay.hidden || traveling || state.modo !== "interface") return false;
    const expected = DATA.prototypeAlleyCoordinates;
    if (normalizarCoordenada(ui.mapLatitude.value) !== normalizarCoordenada(expected.latitude)
      || normalizarCoordenada(ui.mapLongitude.value) !== normalizarCoordenada(expected.longitude)) {
      ui.mapFeedback.textContent = "Não encontrei nada nessas coordenadas.";
      return false;
    }
    if (!state.worldMap.availableLocations.beco) {
      state.worldMap.availableLocations.beco = true;
      services.registrarAutosave();
    }
    ui.mapFeedback.textContent = "Beco localizado. Selecione o destino no mapa.";
    renderizarMapaGlobal();
    return true;
  }

  function viajarPeloMapa(localId) {
    if (ui.mapOverlay.hidden || traveling || state.modo !== "interface"
      || services.isSceneTransitioning() || services.isCutsceneActive()
      || !Object.values(DATA.worldMapLocations).some(location => location.localId === localId)
      || !localDisponivel(localId) || localId === state.localizacao.local) return false;
    traveling = true;
    renderizarMapaGlobal();
    fecharMapaGlobal({ restoreFocus: false });
    const trip = services.irParaLocal(localId);
    if (!trip) { traveling = false; return false; }
    return Promise.resolve(trip).then(success => {
      traveling = false;
      if (success) services.registrarAutosave();
      return success;
    }, error => { traveling = false; throw error; });
  }

  function fecharInterfacesMapa() {
    fecharBilhete({ restoreFocus: false });
    fecharMapaGlobal({ restoreFocus: false });
    traveling = false;
  }

  function inicializarMapaGlobal() {
    if (initialized) return;
    initialized = true;
    ui.noteOverlay.hidden = true;
    ui.mapOverlay.hidden = true;
    ui.noteClose.addEventListener("click", () => fecharBilhete());
    ui.mapClose.addEventListener("click", () => fecharMapaGlobal());
    ui.mapSearch.addEventListener("click", localizarCoordenadas);
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape") return;
      if (!ui.noteOverlay.hidden) { event.preventDefault(); fecharBilhete(); }
      else if (!ui.mapOverlay.hidden && !traveling) { event.preventDefault(); fecharMapaGlobal(); }
    });
  }

  return Object.freeze({ abrirBilhete, fecharBilhete, abrirMapaGlobal, fecharMapaGlobal,
    fecharInterfacesMapa, renderizarMapaGlobal, localizarCoordenadas, viajarPeloMapa,
    normalizarCoordenada, inicializarMapaGlobal });
}
