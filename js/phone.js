/**
 * Cria o sistema de celular com dependências da instância.
 * @param {GameContext} context
 * @returns {Object} Operações do componente, usadas pelos demais sistemas e pelos testes.
 */
function criarSistemaCelular(context) {
  const { state, el, document, data: DATA, config: CONFIG, services } = context;

  /** Renderizar aparelho.
   */
  function renderizarAparelho() {
    el.phone.btnCelular.hidden = state.aparelho.activePhone === null;
    el.phone.phoneScreen.dataset.phoneTheme = state.aparelho.phoneTheme;
  }

  /** Normaliza um reset vencido sem reiniciar sua animação.
   */
  function concluirResetRestaurado() {
    if (state.celular.resetStatus !== RESET_STATUS.CONCLUIDO) arquivarDadosAntesReset();
    state.celular.resetStatus = RESET_STATUS.CONCLUIDO;
    state.celular.resetAte = null;
    state.mensagens.etapa = null;
    state.mensagens.historico = [];
    state.mensagens.fila = [];
    state.mensagens.proximaEtapa = null;
    state.mensagens.donoRespondendo = false;
    state.mensagens.donoDigitando = false;
    state.mensagens.cooldownAte = null;
    state.dialogo.faseMonologo = "conversaConcluida";
  }

  /** Atualizar relogio.
   */
  function atualizarRelogio() {
    const agora = new Date();
    const hora = String(agora.getHours()).padStart(2, "0");
    const minuto = String(agora.getMinutes()).padStart(2, "0");
    el.phone.clock.textContent = `${hora}:${minuto}`;
    el.phone.phoneDate.textContent = `${DIAS[agora.getDay()]}, ${agora.getDate()} de ${MESES[agora.getMonth()]}`;
  }

  /** Abrir celular.
   */
  function abrirCelular() {
    if (services.isSceneTransitioning()) return false;
    if (state.modo !== "livre" || state.aparelho.activePhone === null || el.bag.bagDialog.open) return;
    renderizarAparelho();

    clearTimeout(state.celular.transicao);
    state.celular.transicao = null;
    state.modo = "celular";
    mostrarTelaInicial(false);
    el.phone.phoneOverlay.classList.remove("oculto");
    requestAnimationFrame(() => {
      el.phone.phoneOverlay.classList.add("aberto");
      el.phone.btnMensagens.focus();
    });
    atualizarRelogio();
    state.celular.relogio = setInterval(atualizarRelogio, CONFIG.intervaloRelogio);
    if (state.celular.resetStatus === RESET_STATUS.AGENDADO) iniciarCronometroReset();
    services.definirBotoes();
  }

  /** Fechar celular.
   */
  function fecharCelular() {
    if (state.modo !== "celular") return;

    services.fecharEntradaTexto();
    state.modo = "livre";
    el.phone.phoneOverlay.classList.remove("aberto");
    clearInterval(state.celular.relogio);
    state.celular.relogio = null;
    cancelarEnvioDono();
    clearTimeout(state.celular.transicao);
    state.celular.transicao = setTimeout(() => {
      el.phone.phoneOverlay.classList.add("oculto");
      state.celular.transicao = null;
      el.phone.btnCelular.focus();
    }, services.duracaoVisual(CONFIG.transicaoCelular));
    services.definirBotoes();
  }

  /** Obter etapa mensagem.
   * @param {string} [etapaId]
   */
  function obterEtapaMensagem(etapaId = state.mensagens.etapa) {
    return etapaId ? DATA.mensagens.dono.etapas[etapaId] : null;
  }

  /** Atualizar cabecalho mensagens.
   */
  function atualizarCabecalhoMensagens() {
    el.phone.messagesHeader.textContent = state.celular.resetStatus === RESET_STATUS.CONCLUIDO ? "Mensagens" : "???";
  }

  /** Adicionar mensagem.
   * @param {Object} autor
   * @param {string} texto
   */
  function adicionarMensagem(autor, texto) {
    state.mensagens.historico.push({ autor, texto });
  }

  /** Preparar envio dono.
   * @param {Object} mensagens
   * @param {string} proximaEtapa
   * @param {number} [cooldown]
   */
  function prepararEnvioDono(mensagens, proximaEtapa, cooldown = 0) {
    state.mensagens.donoRespondendo = true;
    state.mensagens.donoDigitando = cooldown === 0;
    state.mensagens.fila = [...mensagens];
    state.mensagens.proximaEtapa = proximaEtapa;
    state.mensagens.cooldownAte = cooldown > 0 ? Date.now() + cooldown : null;
  }

  /** Iniciar mensagens.
   */
  function iniciarMensagens() {
    if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO) return;
    if (state.mensagens.etapa !== null || state.mensagens.historico.length > 0) return;

    state.mensagens.etapa = DATA.mensagens.dono.inicio;
    const etapa = obterEtapaMensagem();
    if (etapa.recebidas.length > 0) {
      prepararEnvioDono(etapa.recebidas, state.mensagens.etapa);
    }
  }

  /** Rolar mensagens.
   */
  function rolarMensagens() {
    requestAnimationFrame(() => {
      el.phone.messagesList.scrollTop = el.phone.messagesList.scrollHeight;
    });
  }

  /** Criar balao mensagem.
   * @param {Object} mensagem
   */
  function criarBalaoMensagem(mensagem) {
    const balao = document.createElement("p");
    const enviada = mensagem.autor === "protagonista";
    balao.className = enviada ? "mensagem mensagem-enviada" : "mensagem mensagem-recebida";
    balao.textContent = mensagem.texto;
    return balao;
  }

  /** Renderizar mensagens.
   * @param {boolean} [moverFoco]
   */
  function renderizarMensagens(moverFoco = false) {
    el.phone.messagesList.replaceChildren(...state.mensagens.historico.map(criarBalaoMensagem));

    if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO && state.mensagens.historico.length === 0) {
      const vazio = document.createElement("p");
      vazio.className = "messages-empty";
      vazio.textContent = "Nenhuma conversa encontrada.";
      el.phone.messagesList.appendChild(vazio);
    }

    if (state.mensagens.donoDigitando) {
      const indicador = criarBalaoMensagem({ autor: "dono", texto: "digitando..." });
      indicador.classList.add("mensagem-digitando");
      el.phone.messagesList.appendChild(indicador);
    }

    renderizarEscolhas(moverFoco);
    if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO) {
      el.phone.messagesComposer.classList.add("oculto");
    } else {
      el.phone.messagesComposer.classList.remove("oculto");
    }
    rolarMensagens();
  }

  /** Renderizar escolhas.
   * @param {boolean} moverFoco
   */
  function renderizarEscolhas(moverFoco) {
    el.phone.messagesChoices.replaceChildren();
    const etapa = obterEtapaMensagem();

    if (!etapa || state.mensagens.donoRespondendo) {
      el.phone.messagesChoices.classList.add("oculto");
      if (!etapa && moverFoco) el.phone.btnVoltar.focus();
      return;
    }

    etapa.opcoes
      .filter(opcaoEstaDisponivel)
      .forEach((opcao) => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "message-choice";
        botao.dataset.optionId = opcao.id;
        botao.textContent = opcao.texto;
        el.phone.messagesChoices.appendChild(botao);
      });
    el.phone.messagesChoices.classList.remove("oculto");

    if (moverFoco) el.phone.messagesChoices.firstElementChild?.focus();
  }

  /** Opcao esta disponivel.
   * @param {Object} opcao
   */
  function opcaoEstaDisponivel(opcao) {
    return !opcao.requerArquivoVisto || state.arquivos.vistos.has(opcao.requerArquivoVisto);
  }

  /** Finalizar envio dono.
   */
  function finalizarEnvioDono() {
    const conversaConcluida = state.mensagens.proximaEtapa === null;
    state.mensagens.etapa = state.mensagens.proximaEtapa;
    state.mensagens.proximaEtapa = null;
    state.mensagens.donoRespondendo = false;
    state.mensagens.donoDigitando = false;
    state.mensagens.cooldownAte = null;

    if (conversaConcluida) {
      agendarResetRemoto();
    }

    renderizarMensagens(state.celular.tela === "mensagens");
  }

  /** Enviar proxima mensagem dono.
   */
  function enviarProximaMensagemDono() {
    const texto = state.mensagens.fila.shift();
    state.mensagens.timer = null;

    if (!texto) {
      finalizarEnvioDono();
      return;
    }

    adicionarMensagem("dono", texto);
    if (state.mensagens.fila.length === 0) {
      finalizarEnvioDono();
      return;
    }

    renderizarMensagens();
    agendarEnvioDono();
  }

  /** Iniciar digitacao dono.
   */
  function iniciarDigitacaoDono() {
    state.mensagens.timer = null;
    state.mensagens.cooldownAte = null;
    state.mensagens.donoDigitando = true;
    renderizarMensagens();
    agendarEnvioDono();
  }

  /** Agendar envio dono.
   */
  function agendarEnvioDono() {
    if (!state.mensagens.donoRespondendo || state.mensagens.fila.length === 0 || state.mensagens.timer !== null) return;

    if (state.mensagens.cooldownAte !== null) {
      const tempoRestante = Math.max(0, state.mensagens.cooldownAte - Date.now());
      state.mensagens.timer = setTimeout(iniciarDigitacaoDono, tempoRestante);
      return;
    }

    state.mensagens.timer = setTimeout(enviarProximaMensagemDono, CONFIG.intervaloMensagemDono);
  }

  /** Cancelar envio dono.
   */
  function cancelarEnvioDono() {
    clearTimeout(state.mensagens.timer);
    state.mensagens.timer = null;
  }

  /** Escolher resposta.
   * @param {string} opcaoId
   */
  function escolherResposta(opcaoId) {
    if (state.mensagens.donoRespondendo || state.mensagens.etapa === null) return;

    const opcao = obterEtapaMensagem().opcoes.find((item) => item.id === opcaoId && opcaoEstaDisponivel(item));
    if (!opcao) return;

    const primeiraMensagem = state.mensagens.historico.length === 0;
    adicionarMensagem("protagonista", opcao.texto);

    if (opcao.rotaMonologo && state.dialogo.rotaMonologoArquivo === null) {
      state.dialogo.rotaMonologoArquivo = opcao.rotaMonologo;
    }

    if (primeiraMensagem) {
      state.dialogo.faseMonologo = "aposPrimeiroEnvio";
    }

    const recebidasDaProximaEtapa = obterEtapaMensagem(opcao.proxima)?.recebidas ?? [];
    const abertura = primeiraMensagem ? DATA.mensagens.dono.abertura : [];
    const cooldown = primeiraMensagem ? CONFIG.cooldownPrimeiraResposta : 0;
    prepararEnvioDono([...abertura, ...opcao.resposta, ...recebidasDaProximaEtapa], opcao.proxima, cooldown);
    renderizarMensagens();
    agendarEnvioDono();
  }

  /** Abrir mensagens.
   */
  function abrirMensagens() {
    if (state.modo !== "celular" || state.celular.tela !== "inicio") return;

    state.celular.tela = "mensagens";
    ocultarTelasCelular();
    el.phone.phoneMessages.classList.remove("oculto");
    atualizarCabecalhoMensagens();
    iniciarMensagens();
    renderizarMensagens(!state.mensagens.donoRespondendo);
    agendarEnvioDono();
  }

  /** Enviar mensagem do jogador.
   * @param {string} texto
   */
  function enviarMensagemJogador(texto) {
    if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO) return;
    adicionarMensagem("protagonista", texto);
    renderizarMensagens();
    el.phone.messagesComposerField.textContent = "Toque para escrever…";
    el.phone.messagesComposerField.focus();
  }

  /** Abrir editor de mensagem.
   */
  function abrirEditorMensagem() {
    if (state.modo !== "celular" || state.celular.tela !== "mensagens") return false;
    if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO) return false;
    return services.abrirEntradaTexto({
      confirmLabel: "Enviar",
      maxLength: CONFIG.tamanhoMensagem,
      allowEmpty: false,
      aoConfirmar: enviarMensagemJogador,
      aoCancelar: () => {
        el.phone.messagesComposerField.textContent = "Toque para escrever…";
      },
      aoAlterar: (valor) => {
        el.phone.messagesComposerField.textContent = valor || "Toque para escrever…";
      }
    });
  }

  /** Renderizar arquivos.
   */
  function renderizarArquivos() {
    el.phone.filesList.replaceChildren();

    if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO) {
      const vazio = document.createElement("p");
      vazio.className = "files-empty";
      vazio.textContent = "Nenhum arquivo encontrado.";
      el.phone.filesList.appendChild(vazio);
      return;
    }

    DATA.celular.arquivosAntesReset.forEach((arquivo) => {
      if (arquivo.enigma && state.celular.resetStatus !== RESET_STATUS.AGENDADO) return;

      const botao = document.createElement("button");
      botao.type = "button";
      botao.className = "file-entry";
      botao.dataset.fileId = arquivo.id;
      botao.textContent = arquivo.nome;
      if (state.arquivos.vistos.has(arquivo.id)) {
        botao.classList.add("arquivo-visto");
        botao.setAttribute("aria-label", `${arquivo.nome}, arquivo já examinado`);
      }
      el.phone.filesList.appendChild(botao);
    });
  }

  /** Visualizar arquivo.
   * @param {string} arquivoId
   */
  function visualizarArquivo(arquivoId) {
    if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO) return;

    const arquivo = DATA.celular.arquivosAntesReset.find((item) => item.id === arquivoId);
    if (!arquivo || (arquivo.enigma && state.celular.resetStatus !== RESET_STATUS.AGENDADO)) return;

    state.arquivos.vistos.add(arquivo.id);
    el.phone.fileType.textContent = arquivo.tipo;
    el.phone.fileName.textContent = arquivo.nome;
    el.phone.fileContent.textContent = arquivo.conteudo;
    el.phone.fileViewer.classList.remove("oculto");
    el.phone.identityPuzzle.classList[arquivo.enigma ? "remove" : "add"]("oculto");
    if (arquivo.enigma) {
      const enigmaBloqueado = state.arquivos.enigmaIdentidadeResolvido;
      el.phone.identityAnswer.disabled = enigmaBloqueado;
      el.phone.identityPuzzle.querySelector('button[type="submit"]').disabled = enigmaBloqueado;
      el.phone.identityFeedback.textContent = state.arquivos.enigmaIdentidadeResolvido
        ? "DECODIFICADO: ELA"
        : "Você tem 1 minuto antes do reset.";
    }
    renderizarArquivos();
    el.phone.filesList.querySelector(`[data-file-id="${arquivo.id}"]`)?.focus();
  }

  /** Resolver enigma identidade.
   * @param {string} resposta
   */
  function resolverEnigmaIdentidade(resposta) {
    if (
      state.celular.resetStatus !== RESET_STATUS.AGENDADO
      || state.arquivos.enigmaIdentidadeResolvido
    ) return;

    const tentativa = resposta.trim().toLocaleLowerCase("pt-BR");
    if (tentativa !== "ela") {
      el.phone.identityFeedback.textContent = "Sequência inválida.";
      el.phone.identityAnswer.select();
      return;
    }

    state.arquivos.enigmaIdentidadeResolvido = true;
    state.dialogo.faseMonologo = "identidadeResolvida";
    el.phone.identityFeedback.textContent = "DECODIFICADO: ELA";
    el.phone.identityAnswer.disabled = true;
    el.phone.identityPuzzle.querySelector('button[type="submit"]').disabled = true;
  }

  /** Abrir arquivos.
   */
  function abrirArquivos() {
    if (state.modo !== "celular" || state.celular.tela !== "inicio") return;

    state.celular.tela = "arquivos";
    ocultarTelasCelular();
    el.phone.phoneFiles.classList.remove("oculto");
    el.phone.fileViewer.classList.add("oculto");
    el.phone.identityPuzzle.classList.add("oculto");
    renderizarArquivos();
    el.phone.filesList.firstElementChild?.focus();
  }

  /** Arquivar dados antes reset.
   */
  function arquivarDadosAntesReset() {
    state.arquivos.vistosAntesReset = [...state.arquivos.vistos];
    state.arquivos.enigmaIdentidadeResolvidoAntesReset = state.arquivos.enigmaIdentidadeResolvido;
    state.mensagens.historicoAntesReset = [...state.mensagens.historico];
  }

  /** Atualizar cronometro reset.
   */
  function atualizarCronometroReset() {
    if (state.celular.resetAte === null) return;

    const segundosRestantes = Math.max(0, Math.ceil((state.celular.resetAte - Date.now()) / 1000));
    el.phone.resetCountdown.textContent = formatarDuracao(segundosRestantes);
  }

  /** Formatar duracao.
   * @param {number} segundosTotais
   */
  function formatarDuracao(segundosTotais) {
    const minutos = String(Math.floor(segundosTotais / 60)).padStart(2, "0");
    const segundos = String(segundosTotais % 60).padStart(2, "0");
    return `${minutos}:${segundos}`;
  }

  /** Iniciar cronometro reset.
   */
  function iniciarCronometroReset() {
    clearInterval(state.celular.resetInterval);
    el.phone.phoneSignal.classList.add("oculto");
    el.phone.resetCountdown.classList.remove("oculto");
    atualizarCronometroReset();
    state.celular.resetInterval = setInterval(atualizarCronometroReset, CONFIG.intervaloCronometroReset);
  }

  /** Ocultar cronometro reset.
   */
  function ocultarCronometroReset() {
    clearInterval(state.celular.resetInterval);
    state.celular.resetInterval = null;
    state.celular.resetAte = null;
    el.phone.resetCountdown.classList.add("oculto");
    el.phone.phoneSignal.classList.remove("oculto");
  }

  /** Concluir reset remoto.
   */
  function concluirResetRemoto() {
    clearTimeout(state.celular.resetTimer);
    state.celular.resetTimer = null;
    state.celular.resetStatus = RESET_STATUS.CONCLUIDO;
    ocultarCronometroReset();
    state.mensagens.etapa = null;
    state.mensagens.historico = [];
    state.mensagens.fila = [];
    state.dialogo.faseMonologo = "conversaConcluida";
    atualizarCabecalhoMensagens();
    services.registrarAutosave();

    if (state.modo === "celular") {
      el.phone.btnVoltar.disabled = false;
      mostrarTelaInicial();
    }
  }

  /** Iniciar reset remoto.
   */
  function iniciarResetRemoto() {
    state.celular.resetTimer = null;
    clearInterval(state.celular.resetInterval);
    state.celular.resetInterval = null;
    el.phone.resetCountdown.textContent = "00:00";
    arquivarDadosAntesReset();
    state.celular.resetStatus = RESET_STATUS.EXECUTANDO;

    if (state.modo !== "celular") {
      concluirResetRemoto();
      return;
    }

    state.celular.tela = "reset";
    cancelarEnvioDono();
    ocultarTelasCelular();
    el.phone.phoneReset.classList.remove("oculto");
    el.phone.resetStatus.textContent = "Apagando dados locais, exceto a galeria...";
    el.phone.btnVoltar.disabled = true;
    state.celular.resetTimer = setTimeout(concluirResetRemoto, CONFIG.duracaoReset);
  }

  /** Agendar reset remoto.
   */
  function agendarResetRemoto() {
    if (state.celular.resetStatus !== RESET_STATUS.INATIVO) return;

    state.celular.resetStatus = RESET_STATUS.AGENDADO;
    state.celular.resetAte = Date.now() + CONFIG.esperaAntesReset;
    iniciarCronometroReset();
    state.celular.resetTimer = setTimeout(iniciarResetRemoto, CONFIG.esperaAntesReset);
    if (state.celular.tela === "arquivos") renderizarArquivos();
  }

  /** Ocultar telas celular.
   */
  function ocultarTelasCelular() {
    el.phone.phoneHome.classList.add("oculto");
    el.phone.phoneMessages.classList.add("oculto");
    el.phone.phoneFiles.classList.add("oculto");
    el.phone.phoneGallery.classList.add("oculto");
    el.phone.phoneReset.classList.add("oculto");
    services.fecharEntradaTexto();
  }

  /** Mostrar tela inicial.
   * @param {boolean} [moverFoco]
   */
  function mostrarTelaInicial(moverFoco = true) {
    state.celular.tela = "inicio";
    ocultarTelasCelular();
    el.phone.phoneHome.classList.remove("oculto");
    if (moverFoco) el.phone.btnMensagens.focus();
  }

  /** Voltar celular.
   */
  function voltarCelular() {
    if (state.modo !== "celular") return;
    if (state.celular.resetStatus === RESET_STATUS.EXECUTANDO) return;
    if (services.entradaTextoAberta()) {
      services.cancelarEntradaTexto();
      return;
    }
    if (state.celular.tela === "galeria" && state.galeria.visualizacao !== "grade") {
      services.mostrarGradeGaleria(true);
      return;
    }
    if (["mensagens", "arquivos", "galeria"].includes(state.celular.tela)) {
      mostrarTelaInicial();
      return;
    }
    fecharCelular();
  }

  return Object.freeze({
    renderizarAparelho,
    concluirResetRestaurado,
    atualizarRelogio,
    abrirCelular,
    fecharCelular,
    obterEtapaMensagem,
    atualizarCabecalhoMensagens,
    adicionarMensagem,
    prepararEnvioDono,
    iniciarMensagens,
    rolarMensagens,
    criarBalaoMensagem,
    renderizarMensagens,
    renderizarEscolhas,
    opcaoEstaDisponivel,
    finalizarEnvioDono,
    enviarProximaMensagemDono,
    iniciarDigitacaoDono,
    agendarEnvioDono,
    cancelarEnvioDono,
    escolherResposta,
    abrirMensagens,
    enviarMensagemJogador,
    abrirEditorMensagem,
    renderizarArquivos,
    visualizarArquivo,
    resolverEnigmaIdentidade,
    abrirArquivos,
    arquivarDadosAntesReset,
    atualizarCronometroReset,
    formatarDuracao,
    iniciarCronometroReset,
    ocultarCronometroReset,
    concluirResetRemoto,
    iniciarResetRemoto,
    agendarResetRemoto,
    ocultarTelasCelular,
    mostrarTelaInicial,
    voltarCelular
  });
}
