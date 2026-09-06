const CONFIG = Object.freeze({
  velocidadeDigitacao: 65,
  intervaloMensagemDono: 1200,
  cooldownPrimeiraResposta: 60 * 1000,
  transicaoCelular: 280,
  transicaoPersonagemEntrada: 320,
  transicaoPersonagemSaida: 280,
  esperaAntesReset: 60 * 1000,
  duracaoReset: 2800,
  duracaoFlashFoto: 140
});

const SAVE_VERSION = 1;

const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const RESET_STATUS = Object.freeze({
  INATIVO: "inativo",
  AGENDADO: "agendado",
  EXECUTANDO: "executando",
  CONCLUIDO: "concluido"
});

const state = {
  inventory: [],
  bolsa: {
    pagina: 1,
    pesquisa: "",
    itemSelecionadoId: null
  },
  sceneState: {},
  modo: "livre",
  localizacao: {
    local: "beco",
    cena: "beco_entrada"
  },
  personagemSaidaTimer: null,
  audio: null,
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
  },
  galeria: {
    saves: [],
    visualizacao: "grade",
    capturaPendente: null,
    selecionadoId: null,
    flashTimer: null
  }
};

const el = {
  objectLayer: document.getElementById("object-layer"),
  hotspotLayer: document.getElementById("hotspot-layer"),
  btnBolsa: document.getElementById("btn-bolsa"),
  bagDialog: document.getElementById("bag-dialog"),
  bagClose: document.getElementById("bag-close"),
  bagSearchWrapper: document.getElementById("bag-search-wrapper"),
  bagSearch: document.getElementById("bag-search"),
  bagSearchClear: document.getElementById("bag-search-clear"),
  bagBody: document.getElementById("bag-body"),
  bagGrid: document.getElementById("bag-grid"),
  bagPagination: document.getElementById("bag-pagination"),
  bagDetails: document.getElementById("bag-details"),
  bagEmpty: document.getElementById("bag-empty"),
  bagNoResults: document.getElementById("bag-no-results"),
  interactionStatus: document.getElementById("interaction-status"),
  cenario: document.getElementById("cenario"),
  personagem: document.getElementById("personagem"),
  dialogueBox: document.getElementById("dialogue-box"),
  namePlate: document.getElementById("name-plate"),
  dialogueText: document.getElementById("dialogue-text"),
  continueArrow: document.getElementById("continue-arrow"),
  btnConversar: document.getElementById("btn-conversar"),
  btnIrPara: document.getElementById("btn-ir-para"),
  irParaMenu: document.getElementById("ir-para-menu"),
  btnCelular: document.getElementById("btn-celular"),
  phoneOverlay: document.getElementById("phone-overlay"),
  phoneHome: document.getElementById("phone-home"),
  phoneMessages: document.getElementById("phone-messages"),
  phoneFiles: document.getElementById("phone-files"),
  phoneGallery: document.getElementById("phone-gallery"),
  phoneReset: document.getElementById("phone-reset"),
  messagesList: document.getElementById("messages-list"),
  messagesChoices: document.getElementById("messages-choices"),
  messagesHeader: document.getElementById("messages-header"),
  btnMensagens: document.getElementById("btn-mensagens"),
  btnGaleria: document.getElementById("btn-galeria"),
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
  galleryGrid: document.getElementById("gallery-grid"),
  galleryToolbar: document.getElementById("gallery-toolbar"),
  galleryCount: document.getElementById("gallery-count"),
  galleryStatus: document.getElementById("gallery-status"),
  btnTirarFoto: document.getElementById("btn-tirar-foto"),
  galleryPhotoForm: document.getElementById("gallery-photo-form"),
  galleryPreview: document.getElementById("gallery-preview"),
  galleryPhotoName: document.getElementById("gallery-photo-name"),
  btnCancelarFoto: document.getElementById("btn-cancelar-foto"),
  galleryDetail: document.getElementById("gallery-detail"),
  galleryDetailPhoto: document.getElementById("gallery-detail-photo"),
  galleryDetailName: document.getElementById("gallery-detail-name"),
  galleryDetailDate: document.getElementById("gallery-detail-date"),
  btnCarregarFoto: document.getElementById("btn-carregar-foto"),
  btnExcluirFoto: document.getElementById("btn-excluir-foto"),
  btnVoltarGaleria: document.getElementById("btn-voltar-galeria"),
  galleryFlash: document.getElementById("gallery-flash"),
  btnVoltar: document.getElementById("btn-voltar")
};

const saveRepository = criarSaveRepository(typeof localStorage === "undefined" ? null : localStorage);

function copiarDados(dados) {
  return JSON.parse(JSON.stringify(dados));
}

function capturarEstadoJogo() {
  return {
    inventory: [...state.inventory],
    sceneState: copiarDados(state.sceneState),
    saveVersion: SAVE_VERSION,
    capturedAt: Date.now(),
    localizacao: { ...state.localizacao },
    dialogo: {
      faseMonologo: state.dialogo.faseMonologo,
      rotaMonologoArquivo: state.dialogo.rotaMonologoArquivo
    },
    celular: {
      resetAte: state.celular.resetAte,
      resetStatus: state.celular.resetStatus
    },
    arquivos: {
      vistos: [...state.arquivos.vistos],
      vistosAntesReset: [...state.arquivos.vistosAntesReset],
      enigmaIdentidadeResolvido: state.arquivos.enigmaIdentidadeResolvido,
      enigmaIdentidadeResolvidoAntesReset: state.arquivos.enigmaIdentidadeResolvidoAntesReset
    },
    mensagens: {
      etapa: state.mensagens.etapa,
      historico: copiarDados(state.mensagens.historico),
      donoRespondendo: state.mensagens.donoRespondendo,
      donoDigitando: state.mensagens.donoDigitando,
      fila: [...state.mensagens.fila],
      proximaEtapa: state.mensagens.proximaEtapa,
      cooldownAte: state.mensagens.cooldownAte,
      historicoAntesReset: copiarDados(state.mensagens.historicoAntesReset)
    }
  };
}

function validarSnapshot(candidato) {
  if (!candidato || candidato.saveVersion !== SAVE_VERSION || !Number.isFinite(candidato.capturedAt)) return null;

  const local = DATA.locais[candidato.localizacao?.local];
  if (!local || !local.cenas[candidato.localizacao?.cena]) return null;

  const fases = Object.values(DATA.monologos)
    .some((monologos) => Object.hasOwn(monologos, candidato.dialogo?.faseMonologo));
  const rota = candidato.dialogo?.rotaMonologoArquivo;
  if (
    !fases
    || (rota !== null && !Object.values(DATA.monologos).some((monologos) => Object.hasOwn(monologos, rota)))
  ) return null;

  const idsArquivos = new Set(DATA.celular.arquivosAntesReset.map((arquivo) => arquivo.id));
  const arraysDeArquivosValidos = [candidato.arquivos?.vistos, candidato.arquivos?.vistosAntesReset]
    .every((lista) => Array.isArray(lista) && lista.every((id) => idsArquivos.has(id)));
  if (!arraysDeArquivosValidos) return null;

  const mensagens = candidato.mensagens;
  const etapas = DATA.mensagens.dono.etapas;
  const etapaValida = (etapa) => etapa === null || Boolean(etapas[etapa]);
  const historicoValido = (historico) => Array.isArray(historico) && historico.every((mensagem) =>
    mensagem && ["protagonista", "dono"].includes(mensagem.autor) && typeof mensagem.texto === "string"
  );
  if (
    !mensagens
    || !etapaValida(mensagens.etapa)
    || !etapaValida(mensagens.proximaEtapa)
    || !historicoValido(mensagens.historico)
    || !historicoValido(mensagens.historicoAntesReset)
    || !Array.isArray(mensagens.fila)
    || !mensagens.fila.every((texto) => typeof texto === "string")
    || typeof mensagens.donoRespondendo !== "boolean"
    || typeof mensagens.donoDigitando !== "boolean"
    || (mensagens.cooldownAte !== null && !Number.isFinite(mensagens.cooldownAte))
  ) return null;

  const celular = candidato.celular;
  if (
    !celular
    || !Object.values(RESET_STATUS).includes(celular.resetStatus)
    || (celular.resetAte !== null && !Number.isFinite(celular.resetAte))
    || typeof candidato.arquivos.enigmaIdentidadeResolvido !== "boolean"
    || typeof candidato.arquivos.enigmaIdentidadeResolvidoAntesReset !== "boolean"
  ) return null;

  const exploration = validarExploracao(candidato);
  if (!exploration) return null;
  return { ...copiarDados(candidato), ...exploration };
}

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

function restaurarEstadoJogo(candidato) {
  const snapshot = validarSnapshot(candidato);
  if (!snapshot) throw new Error("Este ponto de salvamento está corrompido ou é incompatível.");

  clearTimeout(state.personagemSaidaTimer);
  clearInterval(state.dialogo.timer);
  clearInterval(state.celular.relogio);
  clearTimeout(state.celular.transicao);
  clearTimeout(state.celular.resetTimer);
  clearInterval(state.celular.resetInterval);
  cancelarEnvioDono();

  state.modo = "livre";
  state.localizacao = snapshot.localizacao;
  state.inventory = snapshot.inventory;
  state.sceneState = snapshot.sceneState;
  if (el.bagDialog.open && typeof el.bagDialog.close === "function") el.bagDialog.close();
  el.interactionStatus.textContent = "";
  state.bolsa.pagina = 1;
  state.bolsa.pesquisa = "";
  if (el.bagSearch) el.bagSearch.value = "";
  state.bolsa.itemSelecionadoId = null;
  renderizarBolsa();
  state.dialogo.linha = 0;
  state.dialogo.digitando = false;
  state.dialogo.timer = null;
  state.dialogo.falas = [];
  state.dialogo.faseMonologo = snapshot.dialogo.faseMonologo;
  state.dialogo.rotaMonologoArquivo = snapshot.dialogo.rotaMonologoArquivo;
  state.celular.tela = "inicio";
  state.celular.relogio = null;
  state.celular.transicao = null;
  state.celular.resetTimer = null;
  state.celular.resetInterval = null;
  state.celular.resetAte = snapshot.celular.resetAte;
  state.celular.resetStatus = snapshot.celular.resetStatus;
  state.arquivos.vistos = new Set(snapshot.arquivos.vistos);
  state.arquivos.vistosAntesReset = snapshot.arquivos.vistosAntesReset;
  state.arquivos.enigmaIdentidadeResolvido = snapshot.arquivos.enigmaIdentidadeResolvido;
  state.arquivos.enigmaIdentidadeResolvidoAntesReset = snapshot.arquivos.enigmaIdentidadeResolvidoAntesReset;
  Object.assign(state.mensagens, snapshot.mensagens, { timer: null });

  if (
    state.celular.resetStatus === RESET_STATUS.EXECUTANDO
    || (state.celular.resetStatus === RESET_STATUS.AGENDADO && state.celular.resetAte <= Date.now())
  ) {
    concluirResetRestaurado();
  } else if (state.celular.resetStatus === RESET_STATUS.AGENDADO) {
    state.celular.resetTimer = setTimeout(iniciarResetRemoto, state.celular.resetAte - Date.now());
  }

  el.phoneOverlay.classList.remove("aberto");
  el.phoneOverlay.classList.add("oculto");
  ocultarTelasCelular();
  el.phoneHome.classList.remove("oculto");
  el.dialogueBox.classList.add("oculto");
  el.personagem.classList.add("oculto");
  el.personagem.classList.remove("personagem-entrando", "personagem-saindo");
  el.personagem.src = "";
  el.resetCountdown.classList.add("oculto");
  el.phoneSignal.classList.remove("oculto");
  trocarCenario(obterCenaAtual());
  fecharMenuIrPara();
  atualizarCabecalhoMensagens();
  definirBotoes();
  el.btnCelular.focus();
}

function registrarAutosave() {
  try {
    saveRepository.salvarAutosave({
      id: "autosave",
      createdAt: Date.now(),
      saveState: capturarEstadoJogo()
    });
  } catch (erro) {
    console.warn("Não foi possível atualizar o autosave.", erro);
  }
}

function ocultarPersonagem() {
  if (el.personagem.classList.contains("oculto")) return;

  const estavaVisivel = Boolean(el.personagem.dataset.characterId);
  clearTimeout(state.personagemSaidaTimer);
  state.personagemSaidaTimer = null;

  if (!estavaVisivel) {
    el.personagem.classList.add("oculto");
    return;
  }

  el.personagem.classList.remove("personagem-entrando");
  el.personagem.classList.add("personagem-saindo");
  state.personagemSaidaTimer = setTimeout(() => {
    el.personagem.classList.add("oculto");
    el.personagem.classList.remove("personagem-saindo");
    el.personagem.src = "";
    el.personagem.dataset.characterId = "";
    el.personagem.dataset.pose = "";
    el.personagem.dataset.slot = "";
    state.personagemSaidaTimer = null;
  }, CONFIG.transicaoPersonagemSaida);
}

function mostrarPersonagem(id, pose, slot) {
  const personagem = DATA.personagens[id];
  const sprite = personagem?.sprites[pose];
  if (!sprite) return;

  clearTimeout(state.personagemSaidaTimer);
  el.personagem.src = sprite;
  el.personagem.dataset.characterId = personagem.id;
  el.personagem.dataset.pose = pose;
  el.personagem.dataset.slot = slot;
  el.personagem.classList.remove("oculto");
  el.personagem.classList.remove("personagem-saindo");
  el.personagem.classList.add("personagem-entrando");
}

function definirBotoes() {
  if (state.modo !== "livre") fecharMenuIrPara();
  const livre = state.modo === "livre";
  el.btnConversar.disabled = !livre;
  el.btnIrPara.disabled = !livre || !temDestinos();
  el.btnCelular.disabled = !livre;
  el.btnBolsa.disabled = !livre;
  el.hotspotLayer.inert = !livre;
}

function obterLocal() {
  return DATA.locais[state.localizacao.local];
}

function obterCenaAtual() {
  return obterLocal()?.cenas[state.localizacao.cena];
}

function obterDestinos(cena = obterCenaAtual()) {
  const local = obterLocal();
  if (!local || !cena) return [];
  return cena.destinos
    .map((destinoId) => local.cenas[destinoId])
    .filter(Boolean);
}

function temDestinos() {
  return obterDestinos().length > 0;
}

function criarBotaoDestino(destino) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "message-choice";
  botao.textContent = destino.label;
  botao.addEventListener("click", () => irPara(destino.id));
  return botao;
}

function renderizarMenuIrPara() {
  el.irParaMenu.replaceChildren(...obterDestinos().map(criarBotaoDestino));
}

function menuIrParaAberto() {
  return !el.irParaMenu.classList.contains("oculto");
}

function abrirMenuIrPara() {
  if (state.modo !== "livre") return;
  renderizarMenuIrPara();
  el.irParaMenu.classList.remove("oculto");
  el.irParaMenu.firstElementChild?.focus();
}

function fecharMenuIrPara() {
  el.irParaMenu.classList.add("oculto");
  el.irParaMenu.replaceChildren();
}

function alternarMenuIrPara() {
  if (state.modo !== "livre") return;
  if (menuIrParaAberto()) {
    fecharMenuIrPara();
    el.btnIrPara.focus();
  } else {
    abrirMenuIrPara();
  }
}

function trocarCenario(cena) {
  state.localizacao.cena = cena.id;
  DATA.cena = cena;
  el.cenario.src = cena.background;
  renderizarObjetos();
  el.interactionStatus.textContent = "";
}

function aplicarCena(cena) {
  if (!cena) return;
  trocarCenario(cena);
  fecharMenuIrPara();
  ocultarPersonagem();
  definirBotoes();
}

function irPara(destinoId) {
  if (state.modo !== "livre") return;
  const cena = obterCenaAtual();
  if (!cena?.destinos.includes(destinoId)) return;
  const destino = obterLocal()?.cenas[destinoId];
  if (!destino) return;
  aplicarCena(destino);
}

function irParaLocal(localId) {
  if (state.modo !== "livre") return;
  const local = DATA.locais[localId];
  if (!local) return;
  state.localizacao.local = local.id;
  aplicarCena(local.cenas[local.cenaInicial]);
}

function iniciarConversa() {
  if (state.modo !== "livre") return;

  const personagemPresente = DATA.cena.personagensPresentes[0];
  const monologosDaCena = DATA.monologos[DATA.cena.id];
  const faseMonologo = obterFaseMonologo();
  const ehMonologo = !personagemPresente;
  state.dialogo.falas = ehMonologo
    ? obterFalasMonologo(monologosDaCena, faseMonologo)
    : DATA.conversas.presenciais[personagemPresente];

  if (!state.dialogo.falas?.length) return;

  if (ehMonologo) mostrarPersonagem("mj", "neutral", "center");

  state.modo = "dialogo";
  state.dialogo.linha = 0;
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

function tocarBlipTexto() {
  try {
    if (!state.audio) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      state.audio = new AudioContext();
    }
    if (state.audio.state === "suspended") state.audio.resume();

    const oscilador = state.audio.createOscillator();
    const ganho = state.audio.createGain();
    const filtro = state.audio.createBiquadFilter();

    oscilador.type = "square";
    oscilador.frequency.value = 620 + Math.random() * 60;
    filtro.type = "highpass";
    filtro.frequency.value = 1400;
    ganho.gain.setValueAtTime(0.05, state.audio.currentTime);
    ganho.gain.exponentialRampToValueAtTime(0.0001, state.audio.currentTime + 0.05);

    oscilador.connect(filtro);
    filtro.connect(ganho);
    ganho.connect(state.audio.destination);
    oscilador.start();
    oscilador.stop(state.audio.currentTime + 0.06);
  } catch {
    // áudio indisponível: segue em silêncio
  }
}

function digitarTexto(texto) {
  clearInterval(state.dialogo.timer);
  state.dialogo.digitando = true;
  el.dialogueText.textContent = "";
  let indice = 0;

  state.dialogo.timer = setInterval(() => {
    const caractere = texto[indice];
    el.dialogueText.textContent += caractere;
    if (caractere && !/\s/.test(caractere)) tocarBlipTexto();
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
  ocultarPersonagem();
  registrarAutosave();
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
  if (state.celular.resetStatus === RESET_STATUS.AGENDADO) iniciarCronometroReset();
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

function obterCenaDaFoto(save) {
  const local = DATA.locais[save.saveState?.localizacao?.local];
  return local?.cenas[save.sceneId] ?? local?.cenas[save.saveState?.localizacao?.cena] ?? null;
}

function obterSpriteFotografico(expressao) {
  const sprites = DATA.personagens.mj.fotografia.sprites;
  const sprite = Object.hasOwn(sprites, expressao) ? sprites[expressao] : null;
  return typeof sprite === "string" && sprite.length > 0 ? sprite : DATA.personagens.mj.sprites.neutral;
}

function criarComposicaoFoto(save) {
  const composicao = document.createElement("figure");
  composicao.className = "photo-composition";

  const cenario = document.createElement("img");
  cenario.className = "photo-background";
  cenario.src = obterCenaDaFoto(save)?.background ?? "";
  cenario.alt = "";

  const mj = document.createElement("img");
  mj.className = "photo-mj";
  mj.src = obterSpriteFotografico(save.photoExpression);
  mj.alt = "MJ voltada para a câmera";
  mj.dataset.photoExpression = save.photoExpression;

  composicao.appendChild(cenario);
  const cena = obterCenaDaFoto(save);
  if (cena?.objects?.length) {
    const objects = document.createElement("div");
    objects.className = "photo-objects";
    objects.replaceChildren(...criarObjetos(cena, save.saveState?.sceneState ?? {}));
    composicao.appendChild(objects);
  }
  composicao.appendChild(mj);
  return composicao;
}

function formatarDataFoto(timestamp) {
  const data = new Date(timestamp);
  if (Number.isNaN(data.getTime())) return { data: "Data indisponível", hora: "--:--" };
  return {
    data: data.toLocaleDateString("pt-BR"),
    hora: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  };
}

function definirStatusGaleria(mensagem = "") {
  el.galleryStatus.textContent = mensagem;
}

function carregarSavesGaleria() {
  state.galeria.saves = saveRepository.listarManuais();
}

function criarSlotFoto(save, indice) {
  if (!save) {
    const vazio = document.createElement("div");
    vazio.className = "gallery-slot gallery-slot-empty";
    vazio.textContent = String(indice + 1);
    return vazio;
  }

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "gallery-slot gallery-photo";
  botao.dataset.saveId = save.id;
  botao.appendChild(criarComposicaoFoto(save));

  const nome = document.createElement("strong");
  nome.textContent = save.name;
  const data = document.createElement("span");
  const formatada = formatarDataFoto(save.createdAt);
  data.textContent = `${formatada.data} · ${formatada.hora}`;
  botao.appendChild(nome);
  botao.appendChild(data);
  return botao;
}

function renderizarGaleria() {
  el.galleryGrid.replaceChildren(
    ...Array.from({ length: MAX_MANUAL_SAVES }, (_, indice) => criarSlotFoto(state.galeria.saves[indice], indice))
  );
  el.galleryCount.textContent = `${state.galeria.saves.length}/${MAX_MANUAL_SAVES}`;
  el.btnTirarFoto.disabled = state.galeria.saves.length >= MAX_MANUAL_SAVES;
}

function mostrarGradeGaleria(moverFoco = false) {
  clearTimeout(state.galeria.flashTimer);
  state.galeria.flashTimer = null;
  state.galeria.visualizacao = "grade";
  state.galeria.capturaPendente = null;
  state.galeria.selecionadoId = null;
  el.galleryFlash.classList.add("oculto");
  el.galleryPhotoForm.classList.add("oculto");
  el.galleryDetail.classList.add("oculto");
  el.galleryGrid.classList.remove("oculto");
  el.galleryToolbar.classList?.remove("oculto");
  renderizarGaleria();
  if (moverFoco) el.btnTirarFoto.focus();
}

function abrirGaleria() {
  if (state.modo !== "celular" || state.celular.tela !== "inicio") return;

  state.celular.tela = "galeria";
  ocultarTelasCelular();
  el.phoneGallery.classList.remove("oculto");
  carregarSavesGaleria();
  definirStatusGaleria(
    state.galeria.saves.length >= MAX_MANUAL_SAVES
      ? "A galeria está cheia. Apague uma fotografia para registrar um novo momento."
      : ""
  );
  mostrarGradeGaleria(true);
}

function sortearExpressaoFotografica() {
  const expressoes = DATA.personagens.mj.fotografia.expressoes;
  const anterior = state.galeria.saves.at(-1)?.photoExpression;
  const candidatas = expressoes.length > 1 ? expressoes.filter((expressao) => expressao !== anterior) : expressoes;
  return candidatas[Math.floor(Math.random() * candidatas.length)];
}

function gerarIdSave() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `foto-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function mostrarPreviewFoto() {
  state.galeria.flashTimer = null;
  el.galleryFlash.classList.add("oculto");
  if (!state.galeria.capturaPendente) return;

  state.galeria.visualizacao = "preview";
  el.galleryToolbar.classList.add("oculto");
  el.galleryGrid.classList.add("oculto");
  el.galleryDetail.classList.add("oculto");
  el.galleryPreview.replaceChildren(criarComposicaoFoto(state.galeria.capturaPendente));
  el.galleryPhotoForm.classList.remove("oculto");
  el.galleryPhotoName.value = "";
  el.galleryPhotoName.focus();
}

function tirarFoto() {
  if (state.galeria.saves.length >= MAX_MANUAL_SAVES) {
    definirStatusGaleria("A galeria está cheia. Apague uma fotografia para registrar um novo momento.");
    return;
  }

  const createdAt = Date.now();
  state.galeria.capturaPendente = {
    id: gerarIdSave(),
    name: "",
    createdAt,
    photoExpression: sortearExpressaoFotografica(),
    sceneId: state.localizacao.cena,
    saveState: capturarEstadoJogo()
  };
  definirStatusGaleria();
  el.galleryFlash.classList.remove("oculto");
  state.galeria.flashTimer = setTimeout(mostrarPreviewFoto, CONFIG.duracaoFlashFoto);
}

function confirmarFoto(nome) {
  if (!state.galeria.capturaPendente) return false;
  const nomeSeguro = nome.trim().slice(0, el.galleryPhotoName.maxLength || 28);
  if (!nomeSeguro) {
    definirStatusGaleria("Informe um nome para a fotografia.");
    el.galleryPhotoName.focus();
    return false;
  }

  try {
    const save = { ...state.galeria.capturaPendente, name: nomeSeguro };
    saveRepository.criarManual(save);
    carregarSavesGaleria();
    definirStatusGaleria("Momento registrado.");
    mostrarGradeGaleria();
    return true;
  } catch (erro) {
    definirStatusGaleria(erro.message || "Não foi possível registrar a fotografia.");
    return false;
  }
}

function cancelarFoto() {
  definirStatusGaleria();
  mostrarGradeGaleria(true);
}

function selecionarFoto(saveId) {
  const save = state.galeria.saves.find((item) => item.id === saveId);
  if (!save) return;

  state.galeria.visualizacao = "detalhe";
  state.galeria.selecionadoId = save.id;
  el.galleryToolbar.classList.add("oculto");
  el.galleryGrid.classList.add("oculto");
  el.galleryPhotoForm.classList.add("oculto");
  el.galleryDetailPhoto.replaceChildren(criarComposicaoFoto(save));
  el.galleryDetailName.textContent = save.name;
  const formatada = formatarDataFoto(save.createdAt);
  el.galleryDetailDate.textContent = `${formatada.data}\n${formatada.hora}`;
  el.galleryDetail.classList.remove("oculto");
  definirStatusGaleria();
  el.btnCarregarFoto.focus();
}

function confirmarAcao(mensagem) {
  return typeof window !== "undefined" && typeof window.confirm === "function" && window.confirm(mensagem);
}

function carregarFotoSelecionada() {
  const save = state.galeria.saves.find((item) => item.id === state.galeria.selecionadoId);
  if (!save || !confirmarAcao("Voltar para este momento?")) return false;

  try {
    restaurarEstadoJogo(save.saveState);
    return true;
  } catch (erro) {
    definirStatusGaleria(erro.message || "Não foi possível carregar esta fotografia.");
    return false;
  }
}

function excluirFotoSelecionada() {
  const save = state.galeria.saves.find((item) => item.id === state.galeria.selecionadoId);
  if (!save || !confirmarAcao("Excluir esta fotografia?\n\nEste ponto de salvamento será removido.")) return false;

  try {
    saveRepository.excluirManual(save.id);
    carregarSavesGaleria();
    definirStatusGaleria("Fotografia excluída.");
    mostrarGradeGaleria(true);
    return true;
  } catch {
    definirStatusGaleria("Não foi possível excluir esta fotografia.");
    return false;
  }
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
  registrarAutosave();

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
  el.resetStatus.textContent = "Apagando dados locais, exceto a galeria...";
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
  el.phoneGallery.classList.add("oculto");
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
  if (state.celular.tela === "galeria" && state.galeria.visualizacao !== "grade") {
    mostrarGradeGaleria(true);
    return;
  }
  if (["mensagens", "arquivos", "galeria"].includes(state.celular.tela)) {
    mostrarTelaInicial();
    return;
  }
  fecharCelular();
}

el.btnBolsa.addEventListener("click", () => {
  if (state.modo !== "livre") return;
  fecharMenuIrPara();
  state.bolsa.pagina = 1;
  state.bolsa.pesquisa = "";
  if (el.bagSearch) el.bagSearch.value = "";
  renderizarBolsa();
  if (typeof el.bagDialog.showModal === "function") el.bagDialog.showModal();
});
el.bagClose.addEventListener("click", () => {
  if (typeof el.bagDialog.close === "function") el.bagDialog.close();
});
el.bagDialog.addEventListener("close", () => el.btnBolsa.focus());
el.bagSearch.addEventListener("input", () => {
  state.bolsa.pesquisa = el.bagSearch.value;
  state.bolsa.pagina = 1;
  renderizarBolsa();
});
el.bagSearchClear.addEventListener("click", () => {
  el.bagSearch.value = "";
  state.bolsa.pesquisa = "";
  state.bolsa.pagina = 1;
  if (typeof el.bagSearch.focus === "function") el.bagSearch.focus();
  renderizarBolsa();
});
el.bagSearch.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && el.bagSearch.value) {
    event.stopPropagation();
    el.bagSearch.value = "";
    state.bolsa.pesquisa = "";
    state.bolsa.pagina = 1;
    renderizarBolsa();
  }
});
el.btnConversar.addEventListener("click", iniciarConversa);
el.btnIrPara.addEventListener("click", alternarMenuIrPara);
el.btnCelular.addEventListener("click", abrirCelular);
el.btnMensagens.addEventListener("click", abrirMensagens);
el.btnGaleria.addEventListener("click", abrirGaleria);
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
el.btnTirarFoto.addEventListener("click", tirarFoto);
el.btnCancelarFoto.addEventListener("click", cancelarFoto);
el.btnVoltarGaleria.addEventListener("click", () => mostrarGradeGaleria(true));
el.btnCarregarFoto.addEventListener("click", carregarFotoSelecionada);
el.btnExcluirFoto.addEventListener("click", excluirFotoSelecionada);
el.galleryGrid.addEventListener("click", (event) => {
  const botao = event.target.closest("button[data-save-id]");
  if (botao) selecionarFoto(botao.dataset.saveId);
});
el.galleryPhotoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  confirmarFoto(el.galleryPhotoName.value);
});
el.dialogueBox.addEventListener("click", avancarDialogo);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.modo === "livre" && menuIrParaAberto()) {
    fecharMenuIrPara();
    el.btnIrPara.focus();
    return;
  }
  if (event.key === "Escape" && state.modo === "celular") {
    voltarCelular();
    return;
  }
  if ((event.key === " " || event.key === "Enter") && state.modo === "dialogo") {
    event.preventDefault();
    avancarDialogo();
  }
});

aplicarCena(obterCenaAtual());
atualizarCabecalhoMensagens();
renderizarBolsa();

function estadoDaCena(cena, source = state.sceneState) {
  return { ...cena.initialState, ...source[cena.id] };
}

function condicoesAtendidas(conditions = {}, sceneState) {
  return Object.entries(conditions).every(([key, value]) => sceneState[key] === value);
}

function validarExploracao(snapshot) {
  const inventory = snapshot.inventory === undefined ? [] : snapshot.inventory;
  const scenes = snapshot.sceneState === undefined ? {} : snapshot.sceneState;
  if (!Array.isArray(inventory) || !inventory.every(id => Object.hasOwn(ITEMS, id))
    || !scenes || typeof scenes !== "object" || Array.isArray(scenes)) return null;
  const result = {};
  const definitions = Object.values(DATA.locais).flatMap(local => Object.values(local.cenas));
  for (const [id, values] of Object.entries(scenes)) {
    const definition = definitions.find(cena => cena.id === id);
    if (!definition?.initialState || !values || typeof values !== "object" || Array.isArray(values)) return null;
    if (!Object.entries(values).every(([key, value]) => Object.hasOwn(definition.initialState, key)
      && typeof value === typeof definition.initialState[key])) return null;
    result[id] = { ...definition.initialState, ...values };
  }
  return { inventory: [...new Set(inventory)], sceneState: result };
}

function adicionarItem(id) {
  if (!Object.hasOwn(ITEMS, id) || state.inventory.includes(id)) return false;
  state.inventory.push(id);
  renderizarBolsa();
  return true;
}

function removerItem(id) {
  const index = state.inventory.indexOf(id);
  if (index < 0) return false;
  state.inventory.splice(index, 1);
  if (state.bolsa.itemSelecionadoId === id) {
    state.bolsa.itemSelecionadoId = null;
  }
  renderizarBolsa();
  return true;
}

function posicionarObjeto(element, rect) {
  const [x, y, width, height] = rect;
  element.style = `left:${x}%;top:${y}%;width:${width}%;height:${height}%;`;
}

function criarObjetos(cena, source = state.sceneState) {
  const values = estadoDaCena(cena, source);
  return (cena.objects ?? []).flatMap(object => {
    const variant = object.variants.find(v => condicoesAtendidas(v.conditions, values));
    if (!variant) return [];
    const sprite = document.createElement("img");
    sprite.className = "scene-object";
    sprite.src = variant.asset;
    sprite.alt = "";
    sprite.draggable = false;
    sprite.dataset.objectId = object.id;
    posicionarObjeto(sprite, object.rect);
    return [sprite];
  });
}

function renderizarObjetos() {
  const cena = obterCenaAtual();
  el.objectLayer.replaceChildren(...criarObjetos(cena));
  const values = estadoDaCena(cena);
  el.hotspotLayer.replaceChildren(...(cena.hotspots ?? [])
    .filter(h => condicoesAtendidas(h.conditions, values))
    .map(h => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "scene-hotspot";
      button.ariaLabel = h.ariaLabel;
      button.dataset.hotspot = h.id;
      posicionarObjeto(button, h.rect);
      button.addEventListener("click", () => executarHotspot(h.id));
      return button;
    }));
}

// Optional selectedItem lets a future puzzle reuse this executor without a new inventory.
function executarHotspot(id, selectedItem = null) {
  if (state.modo !== "livre" || el.bagDialog.open) return false;
  const cena = obterCenaAtual();
  const h = cena.hotspots?.find(hotspot => hotspot.id === id);
  if (!h || !["examine", "interact", "collect", "use_item", "trigger"].includes(h.type)
    || !condicoesAtendidas(h.conditions, estadoDaCena(cena))) return false;
  if (h.requiresItem && (!state.inventory.includes(h.requiresItem)
    || (selectedItem !== null && selectedItem !== h.requiresItem))) {
    el.interactionStatus.textContent = h.missingItemMessage ?? "Preciso de outro item para isso.";
    return false;
  }
  if (h.type === "collect" && !adicionarItem(h.itemId)) return false;
  state.sceneState[cena.id] = { ...estadoDaCena(cena), ...h.changes };
  if (h.requiresItem && (h.consumeItem ?? ITEMS[h.requiresItem]?.consumable)) removerItem(h.requiresItem);
  fecharMenuIrPara();
  renderizarObjetos();
  el.interactionStatus.textContent = h.message ?? "";
  // Narrative hooks run after the atomic logical transition and may remove inventory items.
  if (h.eventId) eventosInteracao[h.eventId]?.({ sceneId: cena.id, itemId: h.itemId });
  registrarAutosave();
  (el.hotspotLayer.firstElementChild ?? el.btnBolsa).focus();
  return true;
}

function normalizarTexto(texto) {
  return (texto ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function obterItensFiltradosBolsa() {
  const ids = state.inventory;
  const termo = normalizarTexto(state.bolsa.pesquisa);
  if (!termo) {
    return ids.map(id => ITEMS[id]).filter(Boolean);
  }
  return ids
    .map(id => ITEMS[id])
    .filter(Boolean)
    .filter(item => {
      const nome = normalizarTexto(item.label);
      const curto = normalizarTexto(item.shortLabel);
      const desc = normalizarTexto(item.description);
      const prop = normalizarTexto(item.purpose);
      return nome.includes(termo) || curto.includes(termo) || desc.includes(termo) || prop.includes(termo);
    });
}

function gerarNumerosPaginacao(paginaAtual, totalPaginas) {
  if (totalPaginas <= 7) {
    return Array.from({ length: totalPaginas }, (_, i) => i + 1);
  }
  if (paginaAtual <= 4) {
    return [1, 2, 3, 4, 5, "…", totalPaginas];
  }
  if (paginaAtual >= totalPaginas - 3) {
    return [1, "…", totalPaginas - 4, totalPaginas - 3, totalPaginas - 2, totalPaginas - 1, totalPaginas];
  }
  return [1, "…", paginaAtual - 1, paginaAtual, paginaAtual + 1, "…", totalPaginas];
}

function renderizarPaginacaoBolsa(totalPaginas) {
  if (totalPaginas <= 1) {
    el.bagPagination.hidden = true;
    el.bagPagination.replaceChildren();
    return;
  }

  el.bagPagination.hidden = false;
  const botoes = [];

  const btnAnterior = document.createElement("button");
  btnAnterior.type = "button";
  btnAnterior.className = "bag-page-btn bag-page-nav";
  btnAnterior.textContent = "‹";
  btnAnterior.setAttribute("aria-label", "Página anterior");
  btnAnterior.disabled = state.bolsa.pagina <= 1;
  btnAnterior.addEventListener("click", () => {
    if (state.bolsa.pagina > 1) {
      state.bolsa.pagina--;
      renderizarBolsa();
    }
  });
  botoes.push(btnAnterior);

  const paginas = gerarNumerosPaginacao(state.bolsa.pagina, totalPaginas);
  for (const p of paginas) {
    if (p === "…") {
      const ellipsis = document.createElement("span");
      ellipsis.className = "bag-page-ellipsis";
      ellipsis.textContent = "…";
      ellipsis.setAttribute("aria-hidden", "true");
      botoes.push(ellipsis);
    } else {
      const btnPagina = document.createElement("button");
      btnPagina.type = "button";
      btnPagina.className = "bag-page-btn";
      if (p === state.bolsa.pagina) {
        btnPagina.classList.add("bag-page-btn--active");
        btnPagina.setAttribute("aria-current", "page");
      }
      btnPagina.textContent = String(p);
      btnPagina.setAttribute("aria-label", `Página ${p} da Bolsa`);
      btnPagina.addEventListener("click", () => {
        state.bolsa.pagina = p;
        renderizarBolsa();
      });
      botoes.push(btnPagina);
    }
  }

  const btnProximo = document.createElement("button");
  btnProximo.type = "button";
  btnProximo.className = "bag-page-btn bag-page-nav";
  btnProximo.textContent = "›";
  btnProximo.setAttribute("aria-label", "Próxima página");
  btnProximo.disabled = state.bolsa.pagina >= totalPaginas;
  btnProximo.addEventListener("click", () => {
    if (state.bolsa.pagina < totalPaginas) {
      state.bolsa.pagina++;
      renderizarBolsa();
    }
  });
  botoes.push(btnProximo);

  el.bagPagination.replaceChildren(...botoes);
}

function renderizarDetalhesBolsa() {
  const item = ITEMS[state.bolsa.itemSelecionadoId];
  if (!item) {
    const emptyWrapper = document.createElement("div");
    emptyWrapper.className = "bag-detail-empty";
    const promptTitle = document.createElement("p");
    promptTitle.className = "bag-detail-prompt-title";
    promptTitle.textContent = "Selecione um item";
    const promptSub = document.createElement("p");
    promptSub.className = "bag-detail-prompt-sub";
    promptSub.textContent = "Escolha um objeto da Bolsa para ver mais informações.";
    emptyWrapper.appendChild(promptTitle);
    emptyWrapper.appendChild(promptSub);
    el.bagDetails.replaceChildren(emptyWrapper);
    return;
  }

  const title = document.createElement("h3");
  title.className = "bag-detail-title";
  title.textContent = item.label;

  const imageWrapper = document.createElement("div");
  imageWrapper.className = "bag-detail-image-wrapper";
  const image = document.createElement("img");
  image.className = "bag-detail-img";
  image.src = item.asset || "";
  image.alt = "";
  image.draggable = false;
  imageWrapper.appendChild(image);

  const funcSection = document.createElement("div");
  funcSection.className = "bag-detail-section";
  const funcTitle = document.createElement("h4");
  funcTitle.className = "bag-detail-section-title";
  funcTitle.textContent = "FUNÇÃO";
  const funcText = document.createElement("p");
  funcText.className = "bag-detail-text";
  funcText.textContent = item.purpose || "—";
  funcSection.appendChild(funcTitle);
  funcSection.appendChild(funcText);

  const descSection = document.createElement("div");
  descSection.className = "bag-detail-section";
  const descTitle = document.createElement("h4");
  descTitle.className = "bag-detail-section-title";
  descTitle.textContent = "DESCRIÇÃO";
  const descText = document.createElement("p");
  descText.className = "bag-detail-text";
  descText.textContent = item.description || "—";
  descSection.appendChild(descTitle);
  descSection.appendChild(descText);

  el.bagDetails.replaceChildren(title, imageWrapper, funcSection, descSection);
}

function renderizarBolsa() {
  const totalItens = state.inventory.length;

  if (totalItens === 0) {
    el.bagSearchWrapper.hidden = true;
    el.bagBody.hidden = true;
    el.bagNoResults.hidden = true;
    el.bagEmpty.hidden = false;
    state.bolsa.itemSelecionadoId = null;
    return;
  }

  el.bagEmpty.hidden = true;
  el.bagSearchWrapper.hidden = false;
  el.bagSearchClear.hidden = !state.bolsa.pesquisa;

  const itensFiltrados = obterItensFiltradosBolsa();

  if (itensFiltrados.length === 0) {
    el.bagBody.hidden = true;
    el.bagNoResults.hidden = false;
    state.bolsa.itemSelecionadoId = null;
    return;
  }

  el.bagNoResults.hidden = true;
  el.bagBody.hidden = false;

  const totalPaginas = Math.ceil(itensFiltrados.length / 9) || 1;
  if (state.bolsa.pagina > totalPaginas) state.bolsa.pagina = totalPaginas;
  if (state.bolsa.pagina < 1) state.bolsa.pagina = 1;

  const inicio = (state.bolsa.pagina - 1) * 9;
  const itensPagina = itensFiltrados.slice(inicio, inicio + 9);

  const itemNaPagina = itensPagina.find(item => item.id === state.bolsa.itemSelecionadoId);
  if (!itemNaPagina) {
    state.bolsa.itemSelecionadoId = itensPagina[0]?.id ?? null;
  }

  const slots = [];
  for (let i = 0; i < 9; i++) {
    const item = itensPagina[i];
    if (item) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bag-slot bag-slot--filled";
      if (item.id === state.bolsa.itemSelecionadoId) {
        button.classList.add("bag-slot--selected");
        button.setAttribute("aria-current", "true");
      }
      button.setAttribute("aria-label", item.label);
      button.dataset.itemId = item.id;

      const icon = document.createElement("img");
      icon.className = "bag-slot-icon";
      icon.src = item.asset || "";
      icon.alt = "";
      icon.draggable = false;

      const label = document.createElement("span");
      label.className = "bag-slot-label";
      label.textContent = item.shortLabel ?? item.label;

      button.appendChild(icon);
      button.appendChild(label);

      button.addEventListener("click", () => {
        state.bolsa.itemSelecionadoId = item.id;
        renderizarBolsa();
      });

      slots.push(button);
    } else {
      const emptySlot = document.createElement("div");
      emptySlot.className = "bag-slot bag-slot--empty";
      emptySlot.setAttribute("aria-hidden", "true");
      slots.push(emptySlot);
    }
  }
  el.bagGrid.replaceChildren(...slots);

  renderizarPaginacaoBolsa(totalPaginas);
  renderizarDetalhesBolsa();
}

const eventosInteracao = Object.create(null);
