/**
 * Cria o sistema de diálogos com dependências da instância.
 * @param {GameContext} context
 * @returns {Object} Operações do componente, usadas pelos demais sistemas e pelos testes.
 */
function criarSistemaDialogos(context) {
  const { state, el, window, data: DATA, config: CONFIG, services } = context;

  /** Iniciar conversa.
   */
  function iniciarConversa() {
    if (services.isSceneTransitioning()) return false;
    if (state.modo !== "livre") return;

    const personagemPresente = services.obterCenaAtual().personagensPresentes[0];
    const monologosDaCena = DATA.monologos[services.obterCenaAtual().id];
    const faseMonologo = obterFaseMonologo();
    const ehMonologo = !personagemPresente;
    state.dialogo.falas = ehMonologo
      ? obterFalasMonologo(monologosDaCena, faseMonologo)
      : DATA.conversas.presenciais[personagemPresente];

    if (!state.dialogo.falas?.length) return;

    if (ehMonologo) services.mostrarPersonagem("mj", "neutral", "center");

    state.modo = "dialogo";
    state.dialogo.linha = 0;
    el.dialogue.dialogueBox.classList.remove("oculto");
    services.definirBotoes();
    mostrarLinha();
  }

  /** Seleciona a fase narrativa de acordo com arquivos, identidade e rota.
   * @param {Object} contexto Critérios narrativos para seleção da fase.
   */
  function selecionarFaseMonologo({ arquivos, arquivosVistos, identidadeResolvida, rota, fase }) {
    const todosArquivosVistos = arquivos.every((arquivo) => arquivosVistos.has(arquivo.id));

    if (todosArquivosVistos && identidadeResolvida) return "todosArquivos";
    return rota ?? fase;
  }

  /** Obter fase monologo.
   */
  function obterFaseMonologo() {
    return selecionarFaseMonologo({
      arquivos: DATA.celular.arquivosAntesReset,
      arquivosVistos: state.arquivos.vistos,
      identidadeResolvida: state.arquivos.enigmaIdentidadeResolvido,
      rota: state.dialogo.rotaMonologoArquivo,
      fase: state.dialogo.faseMonologo
    });
  }

  /** Obter falas monologo.
   * @param {Object} monologosDaCena
   * @param {string} fase
   */
  function obterFalasMonologo(monologosDaCena, fase) {
    return resolverFalasMonologo(monologosDaCena, fase, state);
  }

  /** Mostrar linha.
   */
  function mostrarLinha() {
    const fala = state.dialogo.falas[state.dialogo.linha];
    el.dialogue.namePlate.textContent = fala.autor;
    el.dialogue.continueArrow.classList.add("oculto");
    digitarTexto(fala.texto);
  }

  /** Tocar blip texto.
   */
  function tocarBlipTexto() {
    try {
      if (!state.dialogo.audio) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        state.dialogo.audio = new AudioContext();
      }
      if (state.dialogo.audio.state === "suspended") state.dialogo.audio.resume();

      const oscilador = state.dialogo.audio.createOscillator();
      const ganho = state.dialogo.audio.createGain();
      const filtro = state.dialogo.audio.createBiquadFilter();

      oscilador.type = "square";
      oscilador.frequency.value = 620 + Math.random() * 60;
      filtro.type = "highpass";
      filtro.frequency.value = 1400;
      ganho.gain.setValueAtTime(0.05, state.dialogo.audio.currentTime);
      ganho.gain.exponentialRampToValueAtTime(0.0001, state.dialogo.audio.currentTime + 0.05);

      oscilador.connect(filtro);
      filtro.connect(ganho);
      ganho.connect(state.dialogo.audio.destination);
      oscilador.start();
      oscilador.stop(state.dialogo.audio.currentTime + 0.06);
    } catch {
      // áudio indisponível: segue em silêncio
    }
  }

  /** Digitar texto.
   * @param {string} texto
   */
  function digitarTexto(texto) {
    clearInterval(state.dialogo.timer);
    state.dialogo.digitando = true;
    el.dialogue.dialogueText.textContent = "";
    let indice = 0;

    state.dialogo.timer = setInterval(() => {
      const caractere = texto[indice];
      el.dialogue.dialogueText.textContent += caractere;
      if (caractere && !/\s/.test(caractere)) tocarBlipTexto();
      indice++;
      if (indice >= texto.length) finalizarDigitacao();
    }, CONFIG.velocidadeDigitacao);
  }

  /** Finalizar digitacao.
   */
  function finalizarDigitacao() {
    clearInterval(state.dialogo.timer);
    state.dialogo.timer = null;
    state.dialogo.digitando = false;
    el.dialogue.dialogueText.textContent = state.dialogo.falas[state.dialogo.linha].texto;
    el.dialogue.continueArrow.classList.remove("oculto");
  }

  /** Avancar dialogo.
   */
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

  /** Encerrar conversa.
   */
  function encerrarConversa() {
    if (state.modo !== "dialogo") return;
    services.concluirAcaoInventario();
    clearInterval(state.dialogo.timer);
    state.dialogo.timer = null;
    state.dialogo.digitando = false;
    state.dialogo.falas = [];
    state.modo = "livre";
    el.dialogue.dialogueBox.classList.add("oculto");
    services.ocultarPersonagem();
    services.registrarAutosave();
    services.definirBotoes();
  }

  return Object.freeze({
    iniciarConversa,
    selecionarFaseMonologo,
    obterFaseMonologo,
    obterFalasMonologo,
    mostrarLinha,
    tocarBlipTexto,
    digitarTexto,
    finalizarDigitacao,
    avancarDialogo,
    encerrarConversa
  });
}
