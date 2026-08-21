const state = {
  modo: "livre",
  linha: 0,
  digitando: false,
  timer: null,
  relogio: null
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
  state.modo = "dialogo";
  state.linha = 0;
  el.hint.classList.add("oculto");
  el.dialogueBox.classList.remove("oculto");
  definirBotoes();
  mostrarLinha();
}

function mostrarLinha() {
  const fala = DATA.conversas.principal[state.linha];
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
  const fala = DATA.conversas.principal[state.linha];
  el.dialogueText.textContent = fala.texto;
  el.continueArrow.classList.remove("oculto");
}

function avancarDialogo() {
  if (state.modo !== "dialogo") return;
  if (state.digitando) {
    finalizarDigitacao();
    return;
  }
  if (state.linha < DATA.conversas.principal.length - 1) {
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
  state.modo = "celular";
  el.phoneOverlay.classList.remove("oculto");
  requestAnimationFrame(() => el.phoneOverlay.classList.add("aberto"));
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
  setTimeout(() => el.phoneOverlay.classList.add("oculto"), 280);
  definirBotoes();
}

el.btnConversar.addEventListener("click", iniciarConversa);
el.btnCelular.addEventListener("click", abrirCelular);
el.btnVoltar.addEventListener("click", fecharCelular);
el.dialogueBox.addEventListener("click", avancarDialogo);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && state.modo === "celular") {
    fecharCelular();
    return;
  }
  if ((e.key === " " || e.key === "Enter") && state.modo === "dialogo") {
    e.preventDefault();
    avancarDialogo();
  }
});

definirBotoes();
