const SAVE_STORAGE_VERSION = 1;
const SAVE_STORAGE_KEY = "sanmd:saves";
const MAX_MANUAL_SAVES = 9;

function criarSaveRepository(storage) {
  let memoria = null;

  function lerColecao() {
    try {
      const bruto = storage ? storage.getItem(SAVE_STORAGE_KEY) : memoria;
      if (!bruto) return { storageVersion: SAVE_STORAGE_VERSION, manualSaves: [], autosave: null };

      const colecao = JSON.parse(bruto);
      if (
        !colecao
        || colecao.storageVersion !== SAVE_STORAGE_VERSION
        || !Array.isArray(colecao.manualSaves)
      ) throw new Error("Formato de armazenamento incompatível.");

      return {
        storageVersion: SAVE_STORAGE_VERSION,
        manualSaves: colecao.manualSaves.filter((save) => save && typeof save.id === "string"),
        autosave: colecao.autosave ?? null
      };
    } catch {
      return { storageVersion: SAVE_STORAGE_VERSION, manualSaves: [], autosave: null };
    }
  }

  function gravarColecao(colecao) {
    const bruto = JSON.stringify(colecao);
    if (storage) storage.setItem(SAVE_STORAGE_KEY, bruto);
    else memoria = bruto;
  }

  return Object.freeze({
    listarManuais() {
      return lerColecao().manualSaves;
    },

    obterAutosave() {
      return lerColecao().autosave;
    },

    criarManual(save) {
      const colecao = lerColecao();
      if (colecao.manualSaves.length >= MAX_MANUAL_SAVES) {
        throw new Error("A galeria está cheia.");
      }
      colecao.manualSaves.push(save);
      gravarColecao(colecao);
      return save;
    },

    excluirManual(id) {
      const colecao = lerColecao();
      const restantes = colecao.manualSaves.filter((save) => save?.id !== id);
      if (restantes.length === colecao.manualSaves.length) return false;
      colecao.manualSaves = restantes;
      gravarColecao(colecao);
      return true;
    },

    salvarAutosave(autosave) {
      const colecao = lerColecao();
      colecao.autosave = autosave;
      gravarColecao(colecao);
      return autosave;
    }
  });
}
