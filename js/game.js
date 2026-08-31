const state = {
  modo: "livre",
  linha: 0,
  digitando: false,
  timer: null,
  relogio: null,
  transicaoCelular: null,
  falasAtuais: [],
  telaCelular: "inicio"
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
  state.falasAtuais = personagemPresente
    ? DATA.conversas.presenciais[personagemPresente]
    : DATA.monologos[DATA.cena.id];
  if (!state.falasAtuais?.length) return;
  state.modo = "dialogo";
  state.linha = 0;
  el.hint.classList.add("oculto");
  el.dialogueBox.classList.remove("oculto");
  definirBotoes();
  mostrarLinha();
}

function mostrarLinha() {
  const fala = state.falasAtuais[state.linha];
  el.namePlate.textContent = fala.autor;
  el.continueArrow.classList.add("oculto");
  digitarTexto(fala.texto);
}

function digitarTexto(texto) {
  clearInterval(state.timer);
  state.digitando = true;
  el.dialogueText.textContent = "";
  let i = 0;
  state.timer = setInterval(() => {
    el.dialogueText.textContent += texto[i];
    i++;
    if (i >= texto.length) finalizarDigitacao();
  }, 22);
}

function finalizarDigitacao() {
  clearInterval(state.timer);
  state.timer = null;
  state.digitando = false;
  const fala = state.falasAtuais[state.linha];
  el.dialogueText.textContent = fala.texto;
  el.continueArrow.classList.remove("oculto");
}

function avancarDialogo() {
  if (state.modo !== "dialogo") return;
  if (state.digitando) {
    finalizarDigitacao();
    return;
  }
  if (state.linha < state.falasAtuais.length - 1) {
    state.linha++;
    mostrarLinha();
  } else {
    encerrarConversa();
  }
}

function encerrarConversa() {
  clearInterval(state.timer);
  state.timer = null;
  state.digitando = false;
  state.falasAtuais = [];
  state.modo = "livre";
  el.dialogueBox.classList.add("oculto");
  el.hint.classList.remove("oculto");
  definirBotoes();
}

function atualizarRelogio() {
  const agora = new Date();
  const hh = String(agora.getHours()).padStart(2, "0");
  const mm = String(agora.getMinutes()).padStart(2, "0");
  el.clock.textContent = `${hh}:${mm}`;
  const dias = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  el.phoneDate.textContent = `${dias[agora.getDay()]}, ${agora.getDate()} de ${meses[agora.getMonth()]}`;
}

function abrirCelular() {
  if (state.modo !== "livre") return;
  clearTimeout(state.transicaoCelular);
  state.transicaoCelular = null;
  state.modo = "celular";
  mostrarTelaInicial(false);
  el.phoneOverlay.classList.remove("oculto");
  requestAnimationFrame(() => {
    el.phoneOverlay.classList.add("aberto");
    el.btnMensagens.focus();
  });
  atualizarRelogio();
  state.relogio = setInterval(atualizarRelogio, 1000);
  definirBotoes();
}

function fecharCelular() {
  if (state.modo !== "celular") return;
  state.modo = "livre";
  el.phoneOverlay.classList.remove("aberto");
  clearInterval(state.relogio);
  state.relogio = null;
  clearTimeout(state.transicaoCelular);
  state.transicaoCelular = setTimeout(() => {
    el.phoneOverlay.classList.add("oculto");
    state.transicaoCelular = null;
    el.btnCelular.focus();
  }, 280);
  definirBotoes();
}

function renderizarMensagens() {
  el.messagesList.replaceChildren();
  DATA.mensagens.dono.forEach((mensagem) => {
    const balao = document.createElement("p");
    const enviada = mensagem.autor === "protagonista";
    balao.className = enviada ? "mensagem mensagem-enviada" : "mensagem mensagem-recebida";
    balao.textContent = mensagem.texto;
    el.messagesList.appendChild(balao);
  });
  el.messagesList.scrollTop = el.messagesList.scrollHeight;
}

function abrirMensagens() {
  if (state.modo !== "celular" || state.telaCelular !== "inicio") return;
  state.telaCelular = "mensagens";
  el.phoneHome.classList.add("oculto");
  el.phoneMessages.classList.remove("oculto");
  renderizarMensagens();
  el.btnVoltar.focus();
}

function mostrarTelaInicial(moverFoco = true) {
  state.telaCelular = "inicio";
  el.phoneMessages.classList.add("oculto");
  el.phoneHome.classList.remove("oculto");
  if (moverFoco) el.btnMensagens.focus();
}

function voltarCelular() {
  if (state.modo !== "celular") return;
  if (state.telaCelular === "mensagens") {
    mostrarTelaInicial();
    return;
  }
  fecharCelular();
}

el.btnConversar.addEventListener("click", iniciarConversa);
el.btnCelular.addEventListener("click", abrirCelular);
el.btnMensagens.addEventListener("click", abrirMensagens);
el.btnVoltar.addEventListener("click", voltarCelular);
el.dialogueBox.addEventListener("click", avancarDialogo);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.modo === "celular") {
    voltarCelular();
    return;
  }
  if ((e.key === " " || e.key === "Enter") && state.modo === "dialogo") {
    e.preventDefault();
    avancarDialogo();
  }
});

definirBotoes();
