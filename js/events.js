/**
 * Cria a ligação entre eventos do DOM e serviços da instância.
 * @param {GameContext} context
 * @returns {{inicializarEventos: function(): void}}
 */
function criarSistemaEventos(context) {
  const { state, el, services, document } = context;
  function inicializarEventos() {
    if (inicializarEventos.inicializado) return;
    inicializarEventos.inicializado = true;
    const inputRoot = document.getElementById("app");
    inputRoot.dataset.inputMode = "pointer";
    document.addEventListener("pointerdown", () => { inputRoot.dataset.inputMode = "pointer"; }, { capture: true });
    document.addEventListener("touchstart", () => { inputRoot.dataset.inputMode = "pointer"; }, { capture: true, passive: true });
    document.addEventListener("keydown", event => {
      if (["Tab", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) {
        inputRoot.dataset.inputMode = "keyboard";
      }
    }, { capture: true });
    el.bag.btnBolsa.addEventListener("click", () => {
      if (state.modo !== "livre") return;
      services.fecharMenuIrPara();
      state.bolsa.pagina = 1;
      state.bolsa.pesquisa = "";
      if (el.bag.bagSearch) el.bag.bagSearch.value = "";
      services.renderizarBolsa();
      if (typeof el.bag.bagDialog.showModal === "function") el.bag.bagDialog.showModal();
    });
    el.bag.bagClose.addEventListener("click", () => {
      if (typeof el.bag.bagDialog.close === "function") el.bag.bagDialog.close();
    });
    el.bag.bagDialog.addEventListener("close", () => el.bag.btnBolsa.focus());
    el.bag.bagSearch.addEventListener("input", () => {
      state.bolsa.pesquisa = el.bag.bagSearch.value;
      state.bolsa.pagina = 1;
      services.renderizarBolsa();
    });
    el.bag.bagSearchClear.addEventListener("click", () => {
      el.bag.bagSearch.value = "";
      state.bolsa.pesquisa = "";
      state.bolsa.pagina = 1;
      if (typeof el.bag.bagSearch.focus === "function") el.bag.bagSearch.focus();
      services.renderizarBolsa();
    });
    el.bag.bagSearch.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && el.bag.bagSearch.value) {
        event.stopPropagation();
        el.bag.bagSearch.value = "";
        state.bolsa.pesquisa = "";
        state.bolsa.pagina = 1;
        services.renderizarBolsa();
      }
    });
    el.dialogue.btnConversar.addEventListener("click", services.iniciarConversa);
    el.scene.btnIrPara.addEventListener("click", services.alternarMenuIrPara);
    el.phone.btnCelular.addEventListener("click", services.abrirCelular);
    el.phone.btnMensagens.addEventListener("click", services.abrirMensagens);
    el.phone.btnGaleria.addEventListener("click", services.abrirGaleria);
    el.phone.btnArquivos.addEventListener("click", services.abrirArquivos);
    el.phone.btnVoltar.addEventListener("click", services.voltarCelular);
    el.phone.filesList.addEventListener("click", (event) => {
      const botao = event.target.closest("button[data-file-id]");
      if (botao) services.visualizarArquivo(botao.dataset.fileId);
    });
    el.phone.identityAnswer.addEventListener("click", services.abrirEditorIdentidade);
    el.phone.messagesChoices.addEventListener("click", (event) => {
      const botao = event.target.closest("button[data-option-id]");
      if (botao) services.escolherResposta(botao.dataset.optionId);
    });
    el.gallery.btnTirarFoto.addEventListener("click", services.tirarFoto);
    el.gallery.galleryPhotoName.addEventListener("click", services.abrirEditorNomeFoto);
    el.gallery.btnCancelarFoto.addEventListener("click", services.cancelarFoto);
    el.gallery.btnVoltarGaleria.addEventListener("click", () => services.mostrarGradeGaleria(true));
    el.gallery.btnCarregarFoto.addEventListener("click", services.carregarFotoSelecionada);
    el.gallery.btnExcluirFoto.addEventListener("click", services.excluirFotoSelecionada);
    el.gallery.galleryGrid.addEventListener("click", (event) => {
      const botao = event.target.closest("button[data-save-id]");
      if (botao) services.selecionarFoto(botao.dataset.saveId);
    });
    el.phone.textEntrySend.addEventListener("click", services.confirmarEntradaTexto);
    el.phone.textEntryCancel.addEventListener("click", services.cancelarEntradaTexto);
    el.phone.gameKeyboard.addEventListener("click", (event) => {
      const tecla = event.target.closest("button[data-key]");
      if (tecla) services.pressionarTecla(tecla.dataset.key);
    });
    el.phone.textEntryAccents.addEventListener("click", (event) => {
      const tecla = event.target.closest("button[data-key]");
      if (tecla) services.pressionarTecla(tecla.dataset.key);
    });
    el.dialogue.dialogueBox.addEventListener("click", services.avancarDialogo);

    document.addEventListener("keydown", (event) => {
      if (event.defaultPrevented) return;
      if (services.entradaTextoAberta() && services.tratarTecladoFisico(event)) return;
      if (event.key === "Escape" && state.modo === "livre" && services.menuIrParaAberto()) {
        services.fecharMenuIrPara();
        el.scene.btnIrPara.focus();
        return;
      }
      if (event.key === "Escape" && state.modo === "celular") {
        services.voltarCelular();
        return;
      }
      if ((event.key === " " || event.key === "Enter") && state.modo === "dialogo") {
        event.preventDefault();
        services.avancarDialogo();
      }
    });
  }
  return Object.freeze({ inicializarEventos });
}
