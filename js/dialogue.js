/**
 * Cria o sistema de diálogos com dependências da instância.
 * @param {GameContext} context
 * @returns {Object} Operações do componente, usadas pelos demais sistemas e pelos testes.
 */
function criarSistemaDialogos(context) {
  const { state, el, window, data: DATA, config: CONFIG, services } = context;

  /** Inicia falas narrativas na mesma interface e com o mesmo controle dos diálogos. */
  function iniciarFalas(falas) {
    if (state.modo !== "livre" || services.isSceneTransitioning() || services.isCutsceneActive()
      || !Array.isArray(falas) || !falas.length) return false;
    state.dialogo.falas = falas;
    state.dialogo.linha = 0;
    state.dialogo.conversationId = null;
    state.modo = "dialogo";
    el.dialogue.dialogueBox.classList.remove("oculto");
    services.definirBotoes();
    mostrarLinha();
    return true;
  }

  /** Iniciar conversa.
   */
  function iniciarConversa({ automatic = false } = {}) {
    if (services.isSceneTransitioning() || services.isCutsceneActive()) return false;
    if (state.modo !== "livre") return;

    const cena = services.obterCenaAtual();
    if (automatic && (cena.id !== "casa_quarto_mj" || state.sceneState.casa_quarto_mj?.introSeen)) return false;
    const personagemPresente = cena.personagensPresentes[0];
    const monologosDaCena = DATA.monologos[services.obterCenaAtual().id];
    const faseMonologo = obterFaseMonologo();
    const ehMonologo = !personagemPresente;
    state.dialogo.falas = ehMonologo
      ? (cena.id === "casa_quarto_mj" && state.sceneState.casa_quarto_mj?.introSeen
        ? monologosDaCena.retorno : obterFalasMonologo(monologosDaCena, faseMonologo))
      : DATA.conversas.presenciais[personagemPresente];

    if (!state.dialogo.falas?.length) return;

    if (personagemPresente === "james" && state.sceneState.casa_cozinha?.jamesIntroConversationComplete) {
      state.dialogo.falas = [{ autor: "James", texto: "Quando estiver pronta, pegue sua bolsa e seu telefone." }];
    }

    state.dialogo.conversationId = personagemPresente === "james" && !state.sceneState.casa_cozinha?.jamesIntroConversationComplete
      ? "james_intro" : automatic ? "mj_intro" : null;
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
    const personagem = fala.personagemId
      ? DATA.personagens[fala.personagemId]
      : Object.values(DATA.personagens).find(personagem => personagem.nome === fala.autor);
    if (personagem) {
      const visual = services.obterCenaAtual().personagensVisuais?.find(visual => visual.id === personagem.id);
      services.mostrarPersonagem(personagem.id, visual?.pose ?? "neutral", visual?.slot ?? "center");
    } else if (fala.autor) {
      services.ocultarPersonagem();
    }
    el.dialogue.namePlate.textContent = fala.autor;
    if (!fala.autor)
      el.dialogue.namePlate.classList.add("oculto");
    else el.dialogue.namePlate.classList.remove("oculto");
    if (fala.eventId === "jamesNotification") tocarEfeitoTransitorio("assets/audio/phone_notification.wav");
    if (fala.eventId === "mjPhoneImpact") tocarEfeitoTransitorio("assets/audio/kick_impact.wav");
    el.dialogue.continueArrow.classList.add("oculto");
    digitarTexto(fala.texto);
  }

  /** Efeito curto opcional. Ausência/rejeição de autoplay não atrasa apresentação. */
  function tocarEfeitoTransitorio(source) {
    if (!source || !window.Audio) return () => {};
    let audio;
    try {
      audio = new window.Audio(source);
      audio.play()?.catch(() => {});
    } catch { /* WebView sem áudio: apresentação segue em silêncio. */ }
    return () => { if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); } };
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
    const completedConversation = state.dialogo.conversationId;
    if (completedConversation === "mj_intro") {
      state.sceneState.casa_quarto_mj = { ...services.estadoDaCena(DATA.locais.casa.cenas.casa_quarto_mj), introSeen: true };
    } else if (state.dialogo.conversationId === "james_intro") {
      state.sceneState.casa_cozinha = { ...services.estadoDaCena(DATA.locais.casa.cenas.casa_cozinha), jamesIntroConversationComplete: true };
    }
    state.dialogo.conversationId = null;
    state.modo = "livre";
    el.dialogue.dialogueBox.classList.add("oculto");
    services.restaurarPersonagemCena();
    services.registrarAutosave();
    services.definirBotoes();
    if (completedConversation === "mj_intro") el.scene.btnIrPara.focus();
  }

  return Object.freeze({
    iniciarFalas,
    iniciarConversa,
    selecionarFaseMonologo,
    obterFaseMonologo,
    obterFalasMonologo,
    mostrarLinha,
    tocarBlipTexto,
    tocarEfeitoTransitorio,
    digitarTexto,
    finalizarDigitacao,
    avancarDialogo,
    encerrarConversa
  });
}
