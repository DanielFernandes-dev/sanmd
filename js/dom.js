/**
 * Resolve e valida as referências DOM agrupadas por componente.
 * @param {Document} document Documento que contém a interface do jogo.
 * @returns {GameElements}
 */
function criarElementos(document) {
  const buscar = (id) => {
    const elemento = document.getElementById(id);
    if (!elemento) throw new Error(`Elemento obrigatório ausente: ${id}`);
    return elemento;
  };
  return {
    workstation: {
      overlay: buscar("workstation-overlay"), map: buscar("workstation-map"), close: buscar("workstation-close"),
      recentList: buscar("workstation-recent-list"), recentEmpty: buscar("workstation-recent-empty")
    },
    worldMap: {
      noteOverlay: buscar("note-overlay"), noteLatitude: buscar("note-latitude"),
      noteLongitude: buscar("note-longitude"), noteClose: buscar("note-close"),
      mapOverlay: buscar("world-map-overlay"), mapLocations: buscar("world-map-locations"),
      mapLatitude: buscar("map-latitude"), mapLongitude: buscar("map-longitude"),
      mapSearch: buscar("map-search"), mapFeedback: buscar("map-feedback"),
      mapClose: buscar("map-close")
    },
    scene: {
      transitionOverlay: buscar("scene-transition-overlay"),
      objectLayer: buscar("object-layer"),
      hotspotLayer: buscar("hotspot-layer"),
      interactionStatus: buscar("interaction-status"),
      cenario: buscar("cenario"),
      personagem: buscar("personagem"),
      btnIrPara: buscar("btn-ir-para"),
      irParaMenu: buscar("ir-para-menu")
    },
    bag: {
      btnBolsa: buscar("btn-bolsa"),
      bagDialog: buscar("bag-dialog"),
      bagClose: buscar("bag-close"),
      bagSearchWrapper: buscar("bag-search-wrapper"),
      bagSearch: buscar("bag-search"),
      bagSearchClear: buscar("bag-search-clear"),
      bagBody: buscar("bag-body"),
      bagGrid: buscar("bag-grid"),
      bagPagination: buscar("bag-pagination"),
      bagDetails: buscar("bag-details"),
      bagEmpty: buscar("bag-empty"),
      bagNoResults: buscar("bag-no-results")
    },
    dialogue: {
      dialogueBox: buscar("dialogue-box"),
      namePlate: buscar("name-plate"),
      dialogueText: buscar("dialogue-text"),
      continueArrow: buscar("continue-arrow"),
      btnConversar: buscar("btn-conversar")
    },
    phone: {
      btnCelular: buscar("btn-celular"),
      phoneScreen: buscar("phone-screen"),
      phoneOverlay: buscar("phone-overlay"),
      phoneHome: buscar("phone-home"),
      phoneMessages: buscar("phone-messages"),
      phoneFiles: buscar("phone-files"),
      phoneGallery: buscar("phone-gallery"),
      phoneReset: buscar("phone-reset"),
      messagesList: buscar("messages-list"),
      messagesChoices: buscar("messages-choices"),
      messagesHeader: buscar("messages-header"),
      btnMensagens: buscar("btn-mensagens"),
      btnGaleria: buscar("btn-galeria"),
      btnArquivos: buscar("btn-arquivos"),
      filesList: buscar("files-list"),
      fileViewer: buscar("file-viewer"),
      fileType: buscar("file-type"),
      fileName: buscar("file-name"),
      fileContent: buscar("file-content"),
      identityPuzzle: buscar("identity-puzzle"),
      identityAnswer: buscar("identity-answer"),
      identityFeedback: buscar("identity-feedback"),
      resetStatus: buscar("reset-status"),
      resetCountdown: buscar("reset-countdown"),
      phoneSignal: buscar("phone-signal"),
      clock: buscar("clock"),
      phoneDate: buscar("phone-date"),
      btnVoltar: buscar("btn-voltar"),
      textEntryDock: buscar("text-entry"),
      textEntryField: buscar("text-entry-field"),
      textEntryCount: buscar("text-entry-count"),
      textEntrySend: buscar("text-entry-send"),
      textEntryCancel: buscar("text-entry-cancel"),
      textEntryAccents: buscar("text-entry-accents"),
      gameKeyboard: buscar("game-keyboard")
    },
    gallery: {
      galleryGrid: buscar("gallery-grid"),
      galleryToolbar: buscar("gallery-toolbar"),
      galleryCount: buscar("gallery-count"),
      galleryStatus: buscar("gallery-status"),
      btnTirarFoto: buscar("btn-tirar-foto"),
      galleryPhotoForm: buscar("gallery-photo-form"),
      galleryPreview: buscar("gallery-preview"),
      galleryPhotoName: buscar("gallery-photo-name"),
      btnCancelarFoto: buscar("btn-cancelar-foto"),
      galleryDetail: buscar("gallery-detail"),
      galleryDetailPhoto: buscar("gallery-detail-photo"),
      galleryDetailName: buscar("gallery-detail-name"),
      galleryDetailDate: buscar("gallery-detail-date"),
      btnCarregarFoto: buscar("btn-carregar-foto"),
      btnExcluirFoto: buscar("btn-excluir-foto"),
      btnVoltarGaleria: buscar("btn-voltar-galeria"),
      galleryFlash: buscar("gallery-flash")
    }
  };
}
