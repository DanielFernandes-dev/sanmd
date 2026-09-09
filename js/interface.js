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
    if (state.modo !== "livre") services.fecharMenuIrPara();
    const livre = state.modo === "livre";
    el.dialogue.btnConversar.disabled = !livre;
    el.scene.btnIrPara.disabled = !livre || !services.temDestinos();
    el.phone.btnCelular.disabled = !livre;
    el.bag.btnBolsa.disabled = !livre;
    el.scene.hotspotLayer.inert = !livre;
  }

  return Object.freeze({
    definirBotoes
  });
}
