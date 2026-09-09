/**
 * Consulta a aquisição mesmo depois de o aparelho sair da bolsa para uso.
 * @param {Object} sceneState Estado persistido das cenas.
 * @param {string[]} inventory IDs dos itens carregados.
 * @returns {boolean}
 */
function foiCelularColetado(sceneState = {}, inventory = []) {
  return inventory.includes("lulith_phone") || Boolean(sceneState.beco_fundo?.lulithPhoneCollected);
}

/**
 * Resolve falas sem acessar o estado global ou alterar os dados narrativos.
 * @param {Object} monologos Variantes estáticas da cena.
 * @param {string} fase Fase narrativa atual.
 * @param {Object} contexto Estado de exploração, aparelho e arquivos.
 * @returns {Array<{autor: string, texto: string}>|undefined}
 */
function resolverFalasMonologo(monologos, fase, contexto) {
  const monologo = monologos?.[fase];
  if (Array.isArray(monologo)) return monologo;
  if (fase === "inicial") {
    if (foiCelularColetado(contexto.sceneState, contexto.inventory)) {
      return (contexto.aparelho?.activePhone === "lulith" && monologo?.ativo) || monologo?.coletado;
    }
    return (contexto.sceneState?.beco_fundo?.safeOpened && monologo?.aberto) || monologo?.pendente;
  }
  return monologo?.[contexto.arquivos?.enigmaIdentidadeResolvido ? "feminino" : "masculino"];
}
