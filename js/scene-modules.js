/** Registro pequeno de lógica exclusiva de locais. Os arquivos de cena são
 * scripts clássicos independentes para manter a WebView e os testes sem build.
 * Eles só são baixados quando um local é aberto; a fábrica recebe a instância.
 */
const SANMD_CENAS = Object.create(null);

function criarSistemaModulosCena({ document, state, el, services, data, eventosInteracao }) {
  const paths = Object.freeze({
    casa: "js/scenes/casa/events.js",
    cena_crime: "js/scenes/cena-crime/events.js",
    delegacia: "js/scenes/delegacia/events.js"
  });
  const pending = new Map();
  let active = null;
  let dispose = null;

  function prepararModuloCena(localId) {
    if (!Object.hasOwn(paths, localId) || Object.hasOwn(SANMD_CENAS, localId)) return true;
    if (pending.has(localId)) return pending.get(localId);
    const script = document.createElement("script");
    script.src = paths[localId];
    script.async = true;
    const load = new Promise((resolve, reject) => {
      script.onload = () => {
        if (!Object.hasOwn(SANMD_CENAS, localId)) {
          reject(new Error(`Módulo da cena ${localId} não se registrou.`));
          return;
        }
        pending.delete(localId);
        resolve();
      };
      script.onerror = () => reject(new Error(`Não foi possível carregar a cena ${localId}.`));
      document.head.appendChild(script);
    }).catch(error => {
      pending.delete(localId);
      script.remove();
      throw error;
    });
    pending.set(localId, load);
    return load;
  }

  function ativarModuloCena(localId) {
    if (active === localId) return true;
    if (Object.hasOwn(paths, localId) && !Object.hasOwn(SANMD_CENAS, localId)) return false;
    dispose?.();
    dispose = null;
    active = localId;
    if (Object.hasOwn(SANMD_CENAS, localId)) {
      dispose = SANMD_CENAS[localId]({ state, el, services, data, eventosInteracao });
    }
    return true;
  }

  function desativarModuloCena() {
    dispose?.();
    dispose = null;
    active = null;
  }

  return Object.freeze({ prepararModuloCena, ativarModuloCena, desativarModuloCena });
}
