/** PC é uma interface da cena; disponibilidade e navegação pertencem ao mundo. */
function criarSistemaEstacaoTrabalho({ state, el, document, services, window, config: CONFIG }) {
  const ui = el.workstation;
  const app = document.getElementById("app");
  let initialized = false;
  let rotationTimer = null;
  let transitionTimer = null;
  let generation = 0;
  let reducedMotion = null;
  function estacaoAberta() { return !ui.overlay.hidden; }

  function pararAtividadeEstacao() {
    generation++;
    clearTimeout(rotationTimer);
    clearTimeout(transitionTimer);
    rotationTimer = transitionTimer = null;
    ui.recentList.classList.remove("workstation-recent--moving");
  }

  function atualizarHomeEstacao() {
    pararAtividadeEstacao();
    if (!estacaoAberta() || !el.worldMap.mapOverlay.hidden || document.hidden) return;
    const activity = services.obterAtividadeInventario();
    const { linhas, intervalo, transicao } = CONFIG.atividadePc;
    const currentGeneration = generation;
    let offset = 0;
    ui.recentEmpty.hidden = activity.length > 0;
    ui.recentList.style = `--recent-duration: ${transicao}ms; --recent-row: ${100 / linhas}%;`;
    const render = () => {
      ui.recentList.replaceChildren(...Array.from({ length: Math.min(activity.length, linhas + 1) }, (_, index) => {
        const entry = activity[(offset + index) % activity.length];
        const row = document.createElement("li");
        row.dataset.itemId = entry.itemId;
        row.dataset.status = entry.status;
        if (index === linhas) row.setAttribute("aria-hidden", "true");
        const name = document.createElement("span");
        name.textContent = entry.label;
        const status = document.createElement("small");
        status.textContent = entry.status === "in_bag" ? "NA BOLSA" : "DESCARTADO";
        row.appendChild(name);
        row.appendChild(status);
        return row;
      }));
    };
    const active = () => generation === currentGeneration && estacaoAberta()
      && el.worldMap.mapOverlay.hidden && !document.hidden && !reducedMotion?.matches;
    const schedule = () => {
      if (activity.length <= linhas || !active()) return;
      rotationTimer = setTimeout(() => {
        if (!active()) return;
        ui.recentList.classList.add("workstation-recent--moving");
        transitionTimer = setTimeout(() => {
          if (!active()) return;
          offset = (offset + 1) % activity.length;
          ui.recentList.classList.remove("workstation-recent--moving");
          render();
          schedule();
        }, transicao);
      }, intervalo);
    };
    render();
    schedule();
  }
  function abrirEstacaoTrabalho() {
    if (state.modo !== "livre" || services.isSceneTransitioning() || services.isCutsceneActive()
      || state.localizacao.cena !== "delegacia_mesa_mj" || el.bag.bagDialog.open) return false;
    ui.overlay.hidden = false;
    ui.overlay.inert = false;
    state.modo = "interface";
    app.inert = true;
    services.fecharMenuIrPara();
    services.definirBotoes();
    atualizarHomeEstacao();
    ui.map.focus();
    return true;
  }
  function fecharEstacaoTrabalho({ restoreFocus = true } = {}) {
    if (!estacaoAberta() || !el.worldMap.mapOverlay.hidden) return false;
    pararAtividadeEstacao();
    ui.overlay.hidden = true;
    ui.overlay.inert = false;
    state.modo = "livre";
    app.inert = false;
    services.definirBotoes();
    if (restoreFocus) {
      for (const button of el.scene.hotspotLayer.children) {
        if (button.dataset.hotspot !== "mj_computer") continue;
        button.focus();
        break;
      }
    }
    return true;
  }
  function inicializarEstacaoTrabalho() {
    if (initialized) return;
    initialized = true;
    reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    reducedMotion?.addEventListener?.("change", atualizarHomeEstacao);
    document.addEventListener("visibilitychange", atualizarHomeEstacao);
    ui.overlay.hidden = true;
    ui.map.addEventListener("click", () => services.abrirMapaGlobal({ source: "delegacia_computer" }));
    ui.close.addEventListener("click", () => fecharEstacaoTrabalho());
    document.addEventListener("keydown", event => {
      if (event.key !== "Escape" || event.defaultPrevented) return;
      if (fecharEstacaoTrabalho()) event.preventDefault();
    });
  }
  return Object.freeze({ estacaoAberta, abrirEstacaoTrabalho, fecharEstacaoTrabalho,
    atualizarHomeEstacao, pararAtividadeEstacao, inicializarEstacaoTrabalho });
}
