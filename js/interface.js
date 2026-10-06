/**
 * Cria o sistema de controles da interface com dependências da instância.
 * @param {GameContext} context
 * @returns {Object} Operações do componente, usadas pelos demais sistemas e pelos testes.
 */
function criarSistemaInterface(context) {
  const { state, el, services } = context;

  /** Definir botoes.
   */
  function definirBotoes() {
    services.renderizarAparelho();
    const depoisDaCasa = ["cena_crime", "delegacia", "beco"].includes(state.localizacao.local);
    el.scene.btnIrPara.hidden = !(state.sceneState.casa_quarto_mj?.introSeen ?? depoisDaCasa);
    el.dialogue.btnConversar.hidden = !(state.sceneState.casa_cozinha?.jamesIntroConversationComplete ?? depoisDaCasa);
    el.bag.btnBolsa.hidden = !(state.sceneState.casa_quarto_mj?.mjBagCollected ?? depoisDaCasa);
    if (state.modo !== "livre") services.fecharMenuIrPara();
    const livre = state.modo === "livre" && !services.isSceneTransitioning();
    el.dialogue.btnConversar.disabled = !livre || el.dialogue.btnConversar.hidden;
    el.scene.btnIrPara.disabled = !livre || el.scene.btnIrPara.hidden || !services.temDestinos();
    el.phone.btnCelular.disabled = !livre || el.phone.btnCelular.hidden;
    el.bag.btnBolsa.disabled = !livre || el.bag.btnBolsa.hidden;
    const visiveis = [el.dialogue.btnConversar, el.scene.btnIrPara, el.phone.btnCelular, el.bag.btnBolsa]
      .filter(botao => !botao.hidden);
    visiveis.forEach((botao, indice) => botao.setAttribute("style", `grid-row: ${indice + 2}`));
    context.document.getElementById("app").setAttribute("style",
      `grid-template-rows: minmax(0, 1fr) ${visiveis.map(() => "minmax(44px, 60px)").join(" ")} minmax(0, 1fr)`);
    el.scene.hotspotLayer.inert = !livre;
  }

  return Object.freeze({
    definirBotoes
  });
}
