const CONFIG = Object.freeze({
  velocidadeDigitacao: 22,
  intervaloMensagemDono: 1200,
  cooldownPrimeiraResposta: 60 * 1000,
  transicaoCelular: 280
});

const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const state = {
  modo: "livre",
  dialogo: {
    linha: 0,
    digitando: false,
    timer: null,
    falas: [],
    faseMonologo: "inicial"
  },
  celular: {
    tela: "inicio",
    relogio: null,
    transicao: null
  },
  mensagens: {
    etapa: null,
    historico: [],
    donoRespondendo: false,
    donoDigitando: false,
    fila: [],
    proximaEtapa: null,
    cooldownAte: null,
    timer: null
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
  messagesList: document.getElementById("messages-list"),
  messagesChoices: document.getElementById("messages-choices"),
  btnMensagens: document.getElementById("btn-mensagens"),
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
  state.dialogo.falas = personagemPresente
    ? DATA.conversas.presenciais[personagemPresente]
    : monologosDaCena[state.dialogo.faseMonologo];

  if (!state.dialogo.falas?.length) return;

  state.modo = "dialogo";
  state.dialogo.linha = 0;
  el.hint.classList.add("oculto");
  el.dialogueBox.classList.remove("oculto");
  definirBotoes();
  mostrarLinha();
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

  etapa.opcoes.forEach((opcao) => {
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

function finalizarEnvioDono() {
  const conversaConcluida = state.mensagens.proximaEtapa === null;
  state.mensagens.etapa = state.mensagens.proximaEtapa;
  state.mensagens.proximaEtapa = null;
  state.mensagens.donoRespondendo = false;
  state.mensagens.donoDigitando = false;
  state.mensagens.cooldownAte = null;

  if (conversaConcluida) {
    state.dialogo.faseMonologo = "conversaConcluida";
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

  const opcao = obterEtapaMensagem().opcoes.find((item) => item.id === opcaoId);
  if (!opcao) return;

  const primeiraMensagem = state.mensagens.historico.length === 0;
  adicionarMensagem("protagonista", opcao.texto);

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
  el.phoneHome.classList.add("oculto");
  el.phoneMessages.classList.remove("oculto");
  iniciarMensagens();
  renderizarMensagens(!state.mensagens.donoRespondendo);
  agendarEnvioDono();
}

function mostrarTelaInicial(moverFoco = true) {
  state.celular.tela = "inicio";
  el.phoneMessages.classList.add("oculto");
  el.phoneHome.classList.remove("oculto");
  if (moverFoco) el.btnMensagens.focus();
}

function voltarCelular() {
  if (state.modo !== "celular") return;
  if (state.celular.tela === "mensagens") {
    mostrarTelaInicial();
    return;
  }
  fecharCelular();
}

el.btnConversar.addEventListener("click", iniciarConversa);
el.btnCelular.addEventListener("click", abrirCelular);
el.btnMensagens.addEventListener("click", abrirMensagens);
el.btnVoltar.addEventListener("click", voltarCelular);
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

definirBotoes();
