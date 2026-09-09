/**
 * Cria o sistema de entrada de texto (campo e buffer) com dependências da instância.
 * @param {GameContext} context
 * @returns {Object} Operações do componente, usadas pelos demais sistemas e pelos testes.
 */
function criarSistemaEntradaTexto(context) {
  const { state, el, document, config: CONFIG, services } = context;

  function ehLetra(caractere) {
    return /^[a-zÀ-ÖØ-öø-ÿ]$/iu.test(caractere);
  }

  function podeConfirmarEntradaTexto() {
    if (!state.texto.aberto) return false;
    if (state.texto.config.allowEmpty) return true;
    return state.texto.buffer.trim().length > 0;
  }

  function notificarAlteracao() {
    const aoAlterar = state.texto.config?.aoAlterar;
    if (typeof aoAlterar === "function") aoAlterar(state.texto.buffer);
  }

  function renderizarCampo() {
    const antes = document.createElement("span");
    antes.id = "text-entry-before";
    antes.textContent = state.texto.buffer.slice(0, state.texto.cursor);
    const caret = document.createElement("span");
    caret.id = "text-entry-caret";
    const depois = document.createElement("span");
    depois.id = "text-entry-after";
    depois.textContent = state.texto.buffer.slice(state.texto.cursor);
    el.phone.textEntryField.replaceChildren(antes, caret, depois);
    el.phone.textEntryCount.textContent = `${state.texto.buffer.length}/${state.texto.config.maxLength}`;
    if (state.texto.buffer.length >= state.texto.config.maxLength) {
      el.phone.textEntryCount.classList.add("limite");
    } else {
      el.phone.textEntryCount.classList.remove("limite");
    }
    el.phone.textEntrySend.textContent = state.texto.config.confirmLabel;
    el.phone.textEntrySend.disabled = !podeConfirmarEntradaTexto();
  }

  function renderizarDock() {
    renderizarCampo();
    services.renderizarTeclado();
  }

  /** Abrir editor de texto.
   * @param {Object} [configuracao]
   * @param {string} [configuracao.confirmLabel] Rótulo do botão de confirmação.
   * @param {number} [configuracao.maxLength] Limite de caracteres.
   * @param {boolean} [configuracao.allowEmpty] Permite confirmar em branco.
   * @param {Function|null} [configuracao.aoConfirmar] Recebe o valor confirmado.
   * @param {Function|null} [configuracao.aoCancelar] Executado ao cancelar a edição.
   * @param {Function|null} [configuracao.aoAlterar] Recebe o buffer a cada mudança.
   */
  function abrirEntradaTexto(configuracao = {}) {
    if (state.texto.aberto) return false;
    state.texto = criarEstadoTexto();
    state.texto.aberto = true;
    state.texto.config = {
      confirmLabel: configuracao.confirmLabel ?? "OK",
      maxLength: configuracao.maxLength ?? CONFIG.tamanhoNomeFoto,
      allowEmpty: configuracao.allowEmpty ?? false,
      aoConfirmar: configuracao.aoConfirmar ?? null,
      aoCancelar: configuracao.aoCancelar ?? null,
      aoAlterar: configuracao.aoAlterar ?? null
    };
    el.phone.textEntryDock.classList.remove("oculto");
    el.phone.phoneScreen.classList.add("texto-aberto");
    notificarAlteracao();
    renderizarDock();
    el.phone.textEntrySend.focus();
    return true;
  }

  function fecharEntradaTexto() {
    state.texto = criarEstadoTexto();
    el.phone.textEntryDock.classList.add("oculto");
    el.phone.textEntryAccents.classList.add("oculto");
    el.phone.gameKeyboard.replaceChildren();
    el.phone.phoneScreen.classList.remove("texto-aberto");
    el.phone.textEntrySend.disabled = false;
  }

  function confirmarEntradaTexto() {
    if (!podeConfirmarEntradaTexto()) return false;
    const configuracao = state.texto.config;
    const valor = state.texto.buffer.trim();
    fecharEntradaTexto();
    if (typeof configuracao.aoConfirmar === "function") configuracao.aoConfirmar(valor);
    return true;
  }

  function cancelarEntradaTexto() {
    if (!state.texto.aberto) return false;
    const aoCancelar = state.texto.config?.aoCancelar;
    fecharEntradaTexto();
    if (typeof aoCancelar === "function") aoCancelar();
    return true;
  }

  function entradaTextoAberta() {
    return state.texto.aberto;
  }

  function moverCursor(delta) {
    state.texto.cursor = Math.max(0, Math.min(state.texto.buffer.length, state.texto.cursor + delta));
    renderizarDock();
  }

  function inserirCaractere(caractere) {
    if (state.texto.buffer.length >= state.texto.config.maxLength) return;
    const letra = ehLetra(caractere);
    const inserido = letra && state.texto.shift ? caractere.toUpperCase() : caractere;
    state.texto.buffer = state.texto.buffer.slice(0, state.texto.cursor)
      + inserido + state.texto.buffer.slice(state.texto.cursor);
    state.texto.cursor += inserido.length;
    if (letra && state.texto.shift) state.texto.shift = false;
    state.texto.painelAcentos = false;
    notificarAlteracao();
    renderizarDock();
  }

  function apagarCaractere() {
    if (state.texto.cursor <= 0) return;
    state.texto.buffer = state.texto.buffer.slice(0, state.texto.cursor - 1)
      + state.texto.buffer.slice(state.texto.cursor);
    state.texto.cursor -= 1;
    notificarAlteracao();
    renderizarDock();
  }

  /** Pressionar tecla do teclado virtual ou física.
   * @param {string} codigo
   */
  function pressionarTecla(codigo) {
    if (!state.texto.aberto) return;
    if (codigo === "ok") {
      confirmarEntradaTexto();
      return;
    }
    if (codigo === "shift") {
      state.texto.shift = !state.texto.shift;
      renderizarDock();
      return;
    }
    if (codigo === "backspace") {
      apagarCaractere();
      return;
    }
    if (codigo === "espaco") {
      inserirCaractere(" ");
      return;
    }
    if (codigo === "layoutLetras") {
      state.texto.layout = "qwerty";
      state.texto.painelAcentos = false;
      renderizarDock();
      return;
    }
    if (codigo === "layoutNumeros") {
      state.texto.layout = "numeros";
      state.texto.painelAcentos = false;
      renderizarDock();
      return;
    }
    if (codigo === "acentos") {
      state.texto.painelAcentos = !state.texto.painelAcentos;
      renderizarDock();
      return;
    }
    if (typeof codigo === "string" && codigo.length === 1) inserirCaractere(codigo);
  }

  /** Tratar teclado físico enquanto a edição está aberta.
   * @param {KeyboardEvent|Object} evento
   */
  function tratarTecladoFisico(evento) {
    if (!state.texto.aberto) return false;
    if (evento.key === "Enter") {
      evento.preventDefault();
      confirmarEntradaTexto();
      return true;
    }
    if (evento.key === "Escape") {
      evento.preventDefault();
      cancelarEntradaTexto();
      return true;
    }
    if (evento.key === "Backspace") {
      evento.preventDefault();
      apagarCaractere();
      return true;
    }
    if (evento.key === "ArrowLeft") {
      evento.preventDefault();
      moverCursor(-1);
      return true;
    }
    if (evento.key === "ArrowRight") {
      evento.preventDefault();
      moverCursor(1);
      return true;
    }
    if (evento.key === "Shift" || evento.key === "Alt" || evento.key === "CapsLock") return false;
    if (typeof evento.key === "string" && evento.key.length === 1) {
      evento.preventDefault();
      pressionarTecla(evento.key);
      return true;
    }
    return false;
  }

  return Object.freeze({
    podeConfirmarEntradaTexto,
    abrirEntradaTexto,
    fecharEntradaTexto,
    confirmarEntradaTexto,
    cancelarEntradaTexto,
    entradaTextoAberta,
    moverCursor,
    pressionarTecla,
    tratarTecladoFisico
  });
}