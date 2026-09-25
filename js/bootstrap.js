// O navegador cria uma instância; testes podem criar outras com dependências próprias.
const game = criarJogo({ document, storage: obterStorageDisponivel() });
const titleMenu = criarTelaInicial({ game, document, window });
titleMenu.iniciar();

/** @returns {Storage|null} Alguns navegadores bloqueiam até o acesso a localStorage. */
function obterStorageDisponivel() {
  try {
    return typeof localStorage === "undefined" ? null : localStorage;
  } catch {
    return null;
  }
}
