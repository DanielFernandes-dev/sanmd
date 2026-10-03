/** @returns {{pagina: number, pesquisa: string, itemSelecionadoId: string|null}} */
function criarEstadoBolsa() {
  return { pagina: 1, pesquisa: "", itemSelecionadoId: null, itemEmUsoId: null };
}

/** @returns {DialogueState} Estado transitório e progresso narrativo do diálogo. */
function criarEstadoDialogo() {
  return { linha: 0, digitando: false, timer: null, falas: [],
    faseMonologo: "inicial", rotaMonologoArquivo: null, audio: null };
}

/** @returns {PhoneState} Tela, prazos persistentes e timers transitórios. */
function criarEstadoCelular() {
  return { tela: "inicio", relogio: null, transicao: null, resetTimer: null,
    resetInterval: null, resetAte: null, resetStatus: RESET_STATUS.INATIVO };
}

/** @returns {FilesState} Conjuntos novos por instância, sem referências compartilhadas. */
function criarEstadoArquivos() {
  return { vistos: new Set(), vistosAntesReset: [], enigmaIdentidadeResolvido: false,
    enigmaIdentidadeResolvidoAntesReset: false };
}

/** @returns {MessagesState} Fila e histórico de mensagens da instância. */
function criarEstadoMensagens() {
  return { etapa: null, historico: [], donoRespondendo: false, donoDigitando: false,
    fila: [], proximaEtapa: null, cooldownAte: null, timer: null, historicoAntesReset: [] };
}

/** @returns {GalleryState} Seleção e captura transitórias, fora do snapshot. */
function criarEstadoGaleria() {
  return { saves: [], visualizacao: "grade", capturaPendente: null,
    selecionadoId: null, flashTimer: null };
}

/** @returns {TextInputState} Estado transitório do editor de texto e do teclado. */
function criarEstadoTexto() {
  return { aberto: false, layout: "qwerty", shift: false, buffer: "", cursor: 0,
    painelAcentos: false, config: null };
}

/** @returns {GameState} Uma instância independente do estado de todos os componentes. */
function criarEstadoJogo() {
  return {
    aparelho: { originalPhoneStatus: "broken", activePhone: null, phoneTheme: "lulith" },
    act1Complete: false,
    inventoryActionPending: null,
    inventory: [],
    sceneState: {},
    modo: "livre",
    localizacao: { local: "beco", cena: "beco_entrada" },
    cena: { personagemSaidaTimer: null },
    bolsa: criarEstadoBolsa(),
    dialogo: criarEstadoDialogo(),
    celular: criarEstadoCelular(),
    arquivos: criarEstadoArquivos(),
    mensagens: criarEstadoMensagens(),
    galeria: criarEstadoGaleria(),
    texto: criarEstadoTexto()
  };
}
