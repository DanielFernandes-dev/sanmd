const CONFIG = Object.freeze({
  velocidadeDigitacao: 22,
  intervaloMensagemDono: 1200,
  cooldownPrimeiraResposta: 60 * 1000,
  transicaoCelular: 280,
  esperaAntesReset: 60 * 1000,
  duracaoReset: 2800
});

const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const RESET_STATUS = Object.freeze({
  INATIVO: "inativo",
  AGENDADO: "agendado",
  EXECUTANDO: "executando",
  CONCLUIDO: "concluido"
});

const state = {
  modo: "livre",
  dialogo: {
    linha: 0,
    digitando: false,
    timer: null,
    falas: [],
    faseMonologo: "inicial",
    rotaMonologoArquivo: null
  },
  celular: {
    tela: "inicio",
    relogio: null,
    transicao: null,
    resetTimer: null,
    resetInterval: null,
    resetAte: null,
    resetStatus: RESET_STATUS.INATIVO
  },
  arquivos: {
    vistos: new Set(),
    vistosAntesReset: [],
    enigmaIdentidadeResolvido: false,
    enigmaIdentidadeResolvidoAntesReset: false
  },
  mensagens: {
    etapa: null,
    historico: [],
    donoRespondendo: false,
    donoDigitando: false,
    fila: [],
    proximaEtapa: null,
    cooldownAte: null,
    timer: null,
    historicoAntesReset: []
  }
};

const el = {
  hint: document.getElementById("hint"),
  dialogueBox: document.getElementById("dialogue-box"),
  namePlate: document.getElementById("name-plate"),
  dialogueText: document.getElementById("dialogue-text"),
  continueArrow: document.getElementById("continue-arrow"),
  btnConversar: document.getElementById("btn-conversar"),
  btnCelular: document.getElementById("btn-celular"),
  phoneOverlay: document.getElementById("phone-overlay"),
  phoneHome: document.getElementById("phone-home"),
  phoneMessages: document.getElementById("phone-messages"),
  phoneFiles: document.getElementById("phone-files"),
  phoneReset: document.getElementById("phone-reset"),
  messagesList: document.getElementById("messages-list"),
  messagesChoices: document.getElementById("messages-choices"),
  messagesHeader: document.getElementById("messages-header"),
  btnMensagens: document.getElementById("btn-mensagens"),
  btnArquivos: document.getElementById("btn-arquivos"),
  filesList: document.getElementById("files-list"),
  fileViewer: document.getElementById("file-viewer"),
  fileType: document.getElementById("file-type"),
  fileName: document.getElementById("file-name"),
  fileContent: document.getElementById("file-content"),
  identityPuzzle: document.getElementById("identity-puzzle"),
  identityAnswer: document.getElementById("identity-answer"),
  identityFeedback: document.getElementById("identity-feedback"),
  resetStatus: document.getElementById("reset-status"),
  resetCountdown: document.getElementById("reset-countdown"),
  phoneSignal: document.getElementById("phone-signal"),
  clock: document.getElementById("clock"),
  phoneDate: document.getElementById("phone-date"),
  btnVoltar: document.getElementById("btn-voltar")
};

function definirBotoes() {
  const livre = state.modo === "livre";
  el.btnConversar.disabled = !livre;
  el.btnCelular.disabled = !livre;
}

function iniciarConversa() {
  if (state.modo !== "livre") return;

  const personagemPresente = DATA.cena.personagensPresentes[0];
  const monologosDaCena = DATA.monologos[DATA.cena.id];
  const faseMonologo = obterFaseMonologo();
  state.dialogo.falas = personagemPresente
    ? DATA.conversas.presenciais[personagemPresente]
    : obterFalasMonologo(monologosDaCena, faseMonologo);

  if (!state.dialogo.falas?.length) return;

  state.modo = "dialogo";
  state.dialogo.linha = 0;
  el.hint.classList.add("oculto");
  el.dialogueBox.classList.remove("oculto");
  definirBotoes();
  mostrarLinha();
}

function selecionarFaseMonologo({ arquivos, arquivosVistos, identidadeResolvida, rota, fase }) {
  const todosArquivosVistos = arquivos.every((arquivo) => arquivosVistos.has(arquivo.id));

  if (todosArquivosVistos && identidadeResolvida) return "todosArquivos";
  return rota ?? fase;
}

function obterFaseMonologo() {
  return selecionarFaseMonologo({
    arquivos: DATA.celular.arquivosAntesReset,
    arquivosVistos: state.arquivos.vistos,
    identidadeResolvida: state.arquivos.enigmaIdentidadeResolvido,
    rota: state.dialogo.rotaMonologoArquivo,
    fase: state.dialogo.faseMonologo
  });
}

function obterFalasMonologo(monologosDaCena, fase) {
  const monologo = monologosDaCena[fase];
  if (Array.isArray(monologo)) return monologo;
  return monologo?.[state.arquivos.enigmaIdentidadeResolvido ? "feminino" : "masculino"];
}

function mostrarLinha() {
  const fala = state.dialogo.falas[state.dialogo.linha];
  el.namePlate.textContent = fala.autor;
  el.continueArrow.classList.add("oculto");
  digitarTexto(fala.texto);
}

function digitarTexto(texto) {
  clearInterval(state.dialogo.timer);
  state.dialogo.digitando = true;
  el.dialogueText.textContent = "";
  let indice = 0;

  state.dialogo.timer = setInterval(() => {
    el.dialogueText.textContent += texto[indice];
    indice++;
    if (indice >= texto.length) finalizarDigitacao();
  }, CONFIG.velocidadeDigitacao);
}

function finalizarDigitacao() {
  clearInterval(state.dialogo.timer);
  state.dialogo.timer = null;
  state.dialogo.digitando = false;
  el.dialogueText.textContent = state.dialogo.falas[state.dialogo.linha].texto;
  el.continueArrow.classList.remove("oculto");
}

function avancarDialogo() {
  if (state.modo !== "dialogo") return;
  if (state.dialogo.digitando) {
    finalizarDigitacao();
    return;
  }

  if (state.dialogo.linha < state.dialogo.falas.length - 1) {
    state.dialogo.linha++;
    mostrarLinha();
    return;
  }

  encerrarConversa();
}

function encerrarConversa() {
  clearInterval(state.dialogo.timer);
  state.dialogo.timer = null;
  state.dialogo.digitando = false;
  state.dialogo.falas = [];
  state.modo = "livre";
  el.dialogueBox.classList.add("oculto");
  el.hint.classList.remove("oculto");
  definirBotoes();
}

function atualizarRelogio() {
  const agora = new Date();
  const hora = String(agora.getHours()).padStart(2, "0");
  const minuto = String(agora.getMinutes()).padStart(2, "0");
  el.clock.textContent = `${hora}:${minuto}`;
  el.phoneDate.textContent = `${DIAS[agora.getDay()]}, ${agora.getDate()} de ${MESES[agora.getMonth()]}`;
}

function abrirCelular() {
  if (state.modo !== "livre") return;

  clearTimeout(state.celular.transicao);
  state.celular.transicao = null;
  state.modo = "celular";
  mostrarTelaInicial(false);
  el.phoneOverlay.classList.remove("oculto");
  requestAnimationFrame(() => {
    el.phoneOverlay.classList.add("aberto");
    el.btnMensagens.focus();
  });
  atualizarRelogio();
  state.celular.relogio = setInterval(atualizarRelogio, 1000);
  definirBotoes();
}

function fecharCelular() {
  if (state.modo !== "celular") return;

  state.modo = "livre";
  el.phoneOverlay.classList.remove("aberto");
  clearInterval(state.celular.relogio);
  state.celular.relogio = null;
  cancelarEnvioDono();
  clearTimeout(state.celular.transicao);
  state.celular.transicao = setTimeout(() => {
    el.phoneOverlay.classList.add("oculto");
    state.celular.transicao = null;
    el.btnCelular.focus();
  }, CONFIG.transicaoCelular);
  definirBotoes();
}

function obterEtapaMensagem(etapaId = state.mensagens.etapa) {
  return etapaId ? DATA.mensagens.dono.etapas[etapaId] : null;
}

function atualizarCabecalhoMensagens() {
  el.messagesHeader.textContent = state.celular.resetStatus === RESET_STATUS.CONCLUIDO ? "Mensagens" : "???";
}

function adicionarMensagem(autor, texto) {
  state.mensagens.historico.push({ autor, texto });
}

function prepararEnvioDono(mensagens, proximaEtapa, cooldown = 0) {
  state.mensagens.donoRespondendo = true;
  state.mensagens.donoDigitando = cooldown === 0;
  state.mensagens.fila = [...mensagens];
  state.mensagens.proximaEtapa = proximaEtapa;
  state.mensagens.cooldownAte = cooldown > 0 ? Date.now() + cooldown : null;
}

function iniciarMensagens() {
  if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO) return;
  if (state.mensagens.etapa !== null || state.mensagens.historico.length > 0) return;

  state.mensagens.etapa = DATA.mensagens.dono.inicio;
  const etapa = obterEtapaMensagem();
  if (etapa.recebidas.length > 0) {
    prepararEnvioDono(etapa.recebidas, state.mensagens.etapa);
  }
}

function rolarMensagens() {
  requestAnimationFrame(() => {
    el.messagesList.scrollTop = el.messagesList.scrollHeight;
  });
}

function criarBalaoMensagem(mensagem) {
  const balao = document.createElement("p");
  const enviada = mensagem.autor === "protagonista";
  balao.className = enviada ? "mensagem mensagem-enviada" : "mensagem mensagem-recebida";
  balao.textContent = mensagem.texto;
  return balao;
}

function renderizarMensagens(moverFoco = false) {
  el.messagesList.replaceChildren(...state.mensagens.historico.map(criarBalaoMensagem));

  if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO && state.mensagens.historico.length === 0) {
    const vazio = document.createElement("p");
    vazio.className = "messages-empty";
    vazio.textContent = "Nenhuma conversa encontrada.";
    el.messagesList.appendChild(vazio);
  }

  if (state.mensagens.donoDigitando) {
    const indicador = criarBalaoMensagem({ autor: "dono", texto: "digitando..." });
    indicador.classList.add("mensagem-digitando");
    el.messagesList.appendChild(indicador);
  }

  renderizarEscolhas(moverFoco);
  rolarMensagens();
}

function renderizarEscolhas(moverFoco) {
  el.messagesChoices.replaceChildren();
  const etapa = obterEtapaMensagem();

  if (!etapa || state.mensagens.donoRespondendo) {
    el.messagesChoices.classList.add("oculto");
    if (!etapa && moverFoco) el.btnVoltar.focus();
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
      el.messagesChoices.appendChild(botao);
    });
  el.messagesChoices.classList.remove("oculto");

  if (moverFoco) el.messagesChoices.firstElementChild?.focus();
}

function opcaoEstaDisponivel(opcao) {
  return !opcao.requerArquivoVisto || state.arquivos.vistos.has(opcao.requerArquivoVisto);
}

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

function iniciarDigitacaoDono() {
  state.mensagens.timer = null;
  state.mensagens.cooldownAte = null;
  state.mensagens.donoDigitando = true;
  renderizarMensagens();
  agendarEnvioDono();
}

function agendarEnvioDono() {
  if (!state.mensagens.donoRespondendo || state.mensagens.fila.length === 0 || state.mensagens.timer !== null) return;

  if (state.mensagens.cooldownAte !== null) {
    const tempoRestante = Math.max(0, state.mensagens.cooldownAte - Date.now());
    state.mensagens.timer = setTimeout(iniciarDigitacaoDono, tempoRestante);
    return;
  }

  state.mensagens.timer = setTimeout(enviarProximaMensagemDono, CONFIG.intervaloMensagemDono);
}

function cancelarEnvioDono() {
  clearTimeout(state.mensagens.timer);
  state.mensagens.timer = null;
}

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

function abrirMensagens() {
  if (state.modo !== "celular" || state.celular.tela !== "inicio") return;

  state.celular.tela = "mensagens";
  ocultarTelasCelular();
  el.phoneMessages.classList.remove("oculto");
  atualizarCabecalhoMensagens();
  iniciarMensagens();
  renderizarMensagens(!state.mensagens.donoRespondendo);
  agendarEnvioDono();
}

function renderizarArquivos() {
  el.filesList.replaceChildren();

  if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO) {
    const vazio = document.createElement("p");
    vazio.className = "files-empty";
    vazio.textContent = "Nenhum arquivo encontrado.";
    el.filesList.appendChild(vazio);
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
    el.filesList.appendChild(botao);
  });
}

function visualizarArquivo(arquivoId) {
  if (state.celular.resetStatus === RESET_STATUS.CONCLUIDO) return;

  const arquivo = DATA.celular.arquivosAntesReset.find((item) => item.id === arquivoId);
  if (!arquivo || (arquivo.enigma && state.celular.resetStatus !== RESET_STATUS.AGENDADO)) return;

  state.arquivos.vistos.add(arquivo.id);
  el.fileType.textContent = arquivo.tipo;
  el.fileName.textContent = arquivo.nome;
  el.fileContent.textContent = arquivo.conteudo;
  el.fileViewer.classList.remove("oculto");
  el.identityPuzzle.classList[arquivo.enigma ? "remove" : "add"]("oculto");
  if (arquivo.enigma) {
    const enigmaBloqueado = state.arquivos.enigmaIdentidadeResolvido;
    el.identityAnswer.disabled = enigmaBloqueado;
    el.identityPuzzle.querySelector('button[type="submit"]').disabled = enigmaBloqueado;
    el.identityFeedback.textContent = state.arquivos.enigmaIdentidadeResolvido
      ? "DECODIFICADO: ELA"
      : "Você tem 1 minuto antes do reset.";
  }
  renderizarArquivos();
  el.filesList.querySelector(`[data-file-id="${arquivo.id}"]`)?.focus();
}

function resolverEnigmaIdentidade(resposta) {
  if (
    state.celular.resetStatus !== RESET_STATUS.AGENDADO
    || state.arquivos.enigmaIdentidadeResolvido
  ) return;

  const tentativa = resposta.trim().toLocaleLowerCase("pt-BR");
  if (tentativa !== "ela") {
    el.identityFeedback.textContent = "Sequência inválida.";
    el.identityAnswer.select();
    return;
  }

  state.arquivos.enigmaIdentidadeResolvido = true;
  state.dialogo.faseMonologo = "identidadeResolvida";
  el.identityFeedback.textContent = "DECODIFICADO: ELA";
  el.identityAnswer.disabled = true;
  el.identityPuzzle.querySelector('button[type="submit"]').disabled = true;
}

function abrirArquivos() {
  if (state.modo !== "celular" || state.celular.tela !== "inicio") return;

  state.celular.tela = "arquivos";
  ocultarTelasCelular();
  el.phoneFiles.classList.remove("oculto");
  el.fileViewer.classList.add("oculto");
  el.identityPuzzle.classList.add("oculto");
  renderizarArquivos();
  el.filesList.firstElementChild?.focus();
}

function arquivarDadosAntesReset() {
  state.arquivos.vistosAntesReset = [...state.arquivos.vistos];
  state.arquivos.enigmaIdentidadeResolvidoAntesReset = state.arquivos.enigmaIdentidadeResolvido;
  state.mensagens.historicoAntesReset = [...state.mensagens.historico];
}

function atualizarCronometroReset() {
  if (state.celular.resetAte === null) return;

  const segundosRestantes = Math.max(0, Math.ceil((state.celular.resetAte - Date.now()) / 1000));
  el.resetCountdown.textContent = formatarDuracao(segundosRestantes);
}

function formatarDuracao(segundosTotais) {
  const minutos = String(Math.floor(segundosTotais / 60)).padStart(2, "0");
  const segundos = String(segundosTotais % 60).padStart(2, "0");
  return `${minutos}:${segundos}`;
}

function iniciarCronometroReset() {
  clearInterval(state.celular.resetInterval);
  el.phoneSignal.classList.add("oculto");
  el.resetCountdown.classList.remove("oculto");
  atualizarCronometroReset();
  state.celular.resetInterval = setInterval(atualizarCronometroReset, 250);
}

function ocultarCronometroReset() {
  clearInterval(state.celular.resetInterval);
  state.celular.resetInterval = null;
  state.celular.resetAte = null;
  el.resetCountdown.classList.add("oculto");
  el.phoneSignal.classList.remove("oculto");
}

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

  if (state.modo === "celular") {
    el.btnVoltar.disabled = false;
    mostrarTelaInicial();
  }
}

function iniciarResetRemoto() {
  state.celular.resetTimer = null;
  clearInterval(state.celular.resetInterval);
  state.celular.resetInterval = null;
  el.resetCountdown.textContent = "00:00";
  arquivarDadosAntesReset();
  state.celular.resetStatus = RESET_STATUS.EXECUTANDO;

  if (state.modo !== "celular") {
    concluirResetRemoto();
    return;
  }

  state.celular.tela = "reset";
  cancelarEnvioDono();
  ocultarTelasCelular();
  el.phoneReset.classList.remove("oculto");
  el.resetStatus.textContent = "Apagando dados locais...";
  el.btnVoltar.disabled = true;
  state.celular.resetTimer = setTimeout(concluirResetRemoto, CONFIG.duracaoReset);
}

function agendarResetRemoto() {
  if (state.celular.resetStatus !== RESET_STATUS.INATIVO) return;

  state.celular.resetStatus = RESET_STATUS.AGENDADO;
  state.celular.resetAte = Date.now() + CONFIG.esperaAntesReset;
  iniciarCronometroReset();
  state.celular.resetTimer = setTimeout(iniciarResetRemoto, CONFIG.esperaAntesReset);
  if (state.celular.tela === "arquivos") renderizarArquivos();
}

function ocultarTelasCelular() {
  el.phoneHome.classList.add("oculto");
  el.phoneMessages.classList.add("oculto");
  el.phoneFiles.classList.add("oculto");
  el.phoneReset.classList.add("oculto");
}

function mostrarTelaInicial(moverFoco = true) {
  state.celular.tela = "inicio";
  ocultarTelasCelular();
  el.phoneHome.classList.remove("oculto");
  if (moverFoco) el.btnMensagens.focus();
}

function voltarCelular() {
  if (state.modo !== "celular") return;
  if (state.celular.resetStatus === RESET_STATUS.EXECUTANDO) return;
  if (state.celular.tela === "mensagens" || state.celular.tela === "arquivos") {
    mostrarTelaInicial();
    return;
  }
  fecharCelular();
}

el.btnConversar.addEventListener("click", iniciarConversa);
el.btnCelular.addEventListener("click", abrirCelular);
el.btnMensagens.addEventListener("click", abrirMensagens);
el.btnArquivos.addEventListener("click", abrirArquivos);
el.btnVoltar.addEventListener("click", voltarCelular);
el.filesList.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-file-id]");
  if (botao) visualizarArquivo(botao.dataset.fileId);
});
el.identityPuzzle.addEventListener("submit", (event) => {
  event.preventDefault();
  resolverEnigmaIdentidade(el.identityAnswer.value);
});
el.messagesChoices.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-option-id]");
  if (botao) escolherResposta(botao.dataset.optionId);
});
el.dialogueBox.addEventListener("click", avancarDialogo);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.modo === "celular") {
    voltarCelular();
    return;
  }
  if ((event.key === " " || event.key === "Enter") && state.modo === "dialogo") {
    event.preventDefault();
    avancarDialogo();
  }
});

atualizarCabecalhoMensagens();
definirBotoes();
