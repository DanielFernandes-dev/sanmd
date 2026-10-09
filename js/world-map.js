/** Mapa global: disponibilidade por local, sem conhecer cenas internas. */
function criarSistemaMapaGlobal({ state, el, document, data: DATA, services }) {
  const ui = el.worldMap;
  const app = document.getElementById("app");
  let opener = null;
  let returnHotspotId = null;
  let traveling = false;
  let initialized = false;
  let returnToWorkstation = false;
  let returnToPhone = false;
  let keyboardHome = null;
  const marcadores = new Map();

  function normalizarCoordenada(value) {
    return String(value ?? "").replace(/º/g, "°").normalize("NFKD").toUpperCase()
      .replace(/[º°'’‘′"“”″,.;:\s]/g, "");
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
    if (state.modo !== "livre" || modalAberto() || el.bag.bagDialog.open || services.isSceneTransitioning()
      || services.isCutsceneActive()) return false;
    if (state.localizacao.cena !== "delegacia_mesa_mj") return false;
    opener = document.activeElement;
    returnHotspotId = hotspotId ?? null;
    ui.noteLatitude.textContent = DATA.prototypeAlleyCoordinates.latitude;
    ui.noteLongitude.textContent = DATA.prototypeAlleyCoordinates.longitude;
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
    return typeof localId === "string" && Object.hasOwn(DATA.worldMapLocations, localId)
      && state.worldMap.availableLocations[localId] === true
      && Object.hasOwn(DATA.locais, localId);
  }

  function criarMarcadoresMapa() {
    ui.mapLocations.replaceChildren(...Object.values(DATA.worldMapLocations).map(location => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.localId = location.localId;
      button.dataset.label = location.label;
      button.textContent = location.label;
      button.style = `left:${location.mapPosition.x}%;top:${location.mapPosition.y}%;`;
      button.addEventListener("click", () => viajarPeloMapa(location.localId));
      marcadores.set(location.localId, button);
      return button;
    }));
  }

  function renderizarMapaGlobal() {
    for (const [localId, button] of marcadores) {
      const current = state.localizacao.local === localId;
      const available = localDisponivel(localId);
      button.hidden = localId === "beco" && !available;
      button.className = `map-location ${current ? "map-location--current" : available
        ? "map-location--available" : "map-location--locked"}`;
      button.disabled = traveling || current || !available;
      button.ariaLabel = `${button.dataset.label} — ${current ? "local atual" : available ? "disponível" : "indisponível"}`;
    }
  }

  function abrirMapaGlobal({ source, returnHotspotId: hotspotId } = {}) {
    const fromWorkstation = services.estacaoAberta();
    const fromPhone = source === "lulith_phone" && state.modo === "celular"
      && state.aparelho.activePhone === "lulith";
    if ((!fromWorkstation && !fromPhone && state.modo !== "livre") || modalAberto() || services.isSceneTransitioning()
      || services.isWorldTraveling() || services.isCutsceneActive() || el.bag.bagDialog.open) return false;
    const art = document.getElementById("world-map-art");
    if (art && !art.src) art.src = art.dataset.src || "assets/sprites/mapa-sem-beco.png";
    returnToWorkstation = fromWorkstation;
    returnToPhone = fromPhone;
    if (fromWorkstation) {
      services.pararAtividadeEstacao();
      el.workstation.overlay.inert = true;
    }
    opener = document.activeElement;
    returnHotspotId = hotspotId ?? null;
    traveling = false;
    ui.mapLatitude.disabled = ui.mapLongitude.disabled = ui.mapSearch.disabled = false;
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
    fecharEditorCoordenada();
    ui.mapOverlay.hidden = true;
    const back = returnToWorkstation && services.estacaoAberta();
    const phone = returnToPhone && state.aparelho.activePhone === "lulith";
    returnToWorkstation = false;
    returnToPhone = false;
    state.modo = back ? "interface" : phone ? "celular" : "livre";
    app.inert = back;
    el.workstation.overlay.inert = false;
    if (back) services.atualizarHomeEstacao();
    if (phone) {
      services.mostrarTelaInicial(false);
    }
    services.definirBotoes();
    if (restoreFocus) {
      if (back) el.workstation.map.focus();
      else if (phone) el.phone.btnMapas.focus();
      else focusOpener();
    }
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
      || !marcadores.has(localId)) return false;
    if (localId === state.localizacao.local) {
      ui.mapFeedback.textContent = `Você já está em ${DATA.worldMapLocations[localId].label}. Use Voltar para retornar.`;
      return false;
    }
    if (!localDisponivel(localId)) {
      ui.mapFeedback.textContent = localId === "beco"
        ? "Para localizar o beco, digite a latitude e a longitude do bilhete da mesa e toque em Localizar coordenadas."
        : "Este destino ainda não está disponível na investigação.";
      if (localId === "beco") {
        ui.mapLatitude.focus();
        ui.mapFeedback.scrollIntoView?.({ block: "nearest" });
      }
      return false;
    }
    return services.travelToWorldLocation(localId);
  }

  function bloquearMapaGlobal() {
    traveling = true;
    ui.mapLatitude.disabled = ui.mapLongitude.disabled = ui.mapSearch.disabled = true;
    renderizarMapaGlobal();
  }

  function fecharEditorCoordenada() {
    if (!keyboardHome) return;
    services.fecharEntradaTexto();
    keyboardHome.appendChild(el.phone.textEntryDock);
    keyboardHome = null;
  }

  function editarCoordenada(input) {
    if (traveling || ui.mapOverlay.hidden || services.entradaTextoAberta()) return false;
    keyboardHome = el.phone.textEntryDock.parentNode;
    ui.mapOverlay.querySelector(".prototype-panel").appendChild(el.phone.textEntryDock);
    const opened = services.abrirEntradaTexto({ initialValue: input.value, maxLength: 48, allowEmpty: true,
      layout: "coordenadas",
      aoConfirmar: value => { input.value = value; fecharEditorCoordenada(); input.focus(); },
      aoCancelar: () => { fecharEditorCoordenada(); input.focus(); } });
    // O mapa compartilha o teclado do celular, mas precisa revelar todas as
    // linhas dentro do painel rolável, especialmente em telas horizontais.
    if (opened) el.phone.textEntryDock.scrollIntoView?.({ block: "nearest" });
    return opened;
  }

  function fecharInterfacesMapa() {
    fecharBilhete({ restoreFocus: false });
    fecharMapaGlobal({ restoreFocus: false });
    services.fecharEstacaoTrabalho({ restoreFocus: false });
    traveling = false;
  }

  function inicializarMapaGlobal() {
    if (initialized) return;
    initialized = true;
    ui.noteOverlay.hidden = true;
    ui.mapOverlay.hidden = true;
    criarMarcadoresMapa();
    renderizarMapaGlobal();
    const art = document.getElementById("world-map-art");
    const artUnavailable = () => {
      console.warn("Arte do mapa indisponível; exibindo controles sem a imagem.");
      ui.mapOverlay.classList.add("map-art-unavailable");
    };
    art.addEventListener("error", artUnavailable);
    if (art.src && art.complete && !art.naturalWidth) artUnavailable();
    ui.noteClose.addEventListener("click", () => fecharBilhete());
    ui.mapClose.addEventListener("click", () => fecharMapaGlobal());
    for (const input of [ui.mapLatitude, ui.mapLongitude]) {
      input.addEventListener("click", () => editarCoordenada(input));
      input.addEventListener("keydown", event => {
        if (!event.defaultPrevented && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          editarCoordenada(input);
        }
      });
    }
    ui.mapSearch.addEventListener("click", localizarCoordenadas);
    document.addEventListener("keydown", event => {
      if (event.defaultPrevented) return;
      const overlay = !ui.mapOverlay.hidden ? ui.mapOverlay : !ui.noteOverlay.hidden
        ? ui.noteOverlay : services.estacaoAberta() ? el.workstation.overlay : null;
      if (event.key === "Tab" && overlay) {
        const controls = Array.from(overlay.querySelectorAll("button:not(:disabled), input:not(:disabled), [tabindex='0']"))
          .filter(control => control.getClientRects().length);
        const first = controls[0], last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
      if (event.key !== "Escape") return;
      if (!ui.noteOverlay.hidden) { event.preventDefault(); fecharBilhete(); }
      else if (!ui.mapOverlay.hidden && !traveling) { event.preventDefault(); fecharMapaGlobal(); }
    });
  }

  return Object.freeze({ abrirBilhete, fecharBilhete, abrirMapaGlobal, fecharMapaGlobal,
    fecharInterfacesMapa, renderizarMapaGlobal, localizarCoordenadas, viajarPeloMapa,
    localDisponivel, bloquearMapaGlobal, inicializarMapaGlobal });
}
