/**
 * Cria o sistema de persistência com dependências da instância.
 * @param {GameContext} context
 * @returns {Object} Operações do componente, usadas pelos demais sistemas e pelos testes.
 */
function criarSistemaPersistencia(context) {
  const { state, el, saveRepository, data: DATA, items: ITEMS, services } = context;

  /** Copia dados serializáveis sem preservar referências mutáveis.
   * @param {Object} dados
   */
  function copiarDados(dados) {
    return JSON.parse(JSON.stringify(dados));
  }

  /** Captura progresso persistente; exclui DOM, áudio, timers e seleção da interface.
   */
  function capturarEstadoJogo() {
    return {
      act1Complete: state.act1Complete,
      aparelho: { ...state.aparelho },
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

  /** Eh registro.
   * @param {unknown} valor
   */
  function ehRegistro(valor) {
    return valor !== null && typeof valor === "object" && !Array.isArray(valor);
  }

  /** Validar estrutura basica.
   * @param {unknown} candidato
   */
  function validarEstruturaBasica(candidato) {
    return ehRegistro(candidato) && candidato.saveVersion === SAVE_VERSION
      && Number.isFinite(candidato.capturedAt);
  }

  /** Validar localizacao.
   * @param {Object} localizacao
   */
  function validarLocalizacao(localizacao) {
    if (!ehRegistro(localizacao) || typeof localizacao.local !== "string"
      || typeof localizacao.cena !== "string" || !Object.hasOwn(DATA.locais, localizacao.local)) return false;
    return Object.hasOwn(DATA.locais[localizacao.local].cenas, localizacao.cena);
  }

  /** Validar dialogo.
   * @param {Object} dialogo
   * @param {Object} localizacao
   */
  function validarDialogo(dialogo, localizacao) {
    if (!ehRegistro(dialogo)) return false;
    const monologos = DATA.monologos[localizacao.cena];
    const rota = dialogo.rotaMonologoArquivo;
    return Boolean(monologos)
      && typeof dialogo.faseMonologo === "string"
      && Object.hasOwn(monologos, dialogo.faseMonologo)
      && (rota === null || (typeof rota === "string" && Object.hasOwn(monologos, rota)));
  }

  /** Validar arquivos.
   * @param {Object} arquivos
   */
  function validarArquivos(arquivos) {
    if (!ehRegistro(arquivos)) return false;
    const idsArquivos = new Set(DATA.celular.arquivosAntesReset.map((arquivo) => arquivo.id));
    return [arquivos.vistos, arquivos.vistosAntesReset]
      .every((lista) => Array.isArray(lista) && lista.every((id) => idsArquivos.has(id)))
      && typeof arquivos.enigmaIdentidadeResolvido === "boolean"
      && typeof arquivos.enigmaIdentidadeResolvidoAntesReset === "boolean";
  }

  /** Validar mensagens.
   * @param {Object} mensagens
   */
  function validarMensagens(mensagens) {
    if (!ehRegistro(mensagens)) return false;
    const etapas = DATA.mensagens.dono.etapas;
    const etapaValida = (etapa) => etapa === null
      || (typeof etapa === "string" && Object.hasOwn(etapas, etapa));
    const historicoValido = (historico) => Array.isArray(historico) && historico.every((mensagem) =>
      ehRegistro(mensagem) && ["protagonista", "dono"].includes(mensagem.autor) && typeof mensagem.texto === "string"
    );
    return etapaValida(mensagens.etapa) && etapaValida(mensagens.proximaEtapa)
      && historicoValido(mensagens.historico) && historicoValido(mensagens.historicoAntesReset)
      && Array.isArray(mensagens.fila) && mensagens.fila.every((texto) => typeof texto === "string")
      && typeof mensagens.donoRespondendo === "boolean" && typeof mensagens.donoDigitando === "boolean"
      && (mensagens.cooldownAte === null || Number.isFinite(mensagens.cooldownAte));
  }

  /** Validar celular.
   * @param {Object} celular
   */
  function validarCelular(celular) {
    return ehRegistro(celular) && Object.values(RESET_STATUS).includes(celular.resetStatus)
      && (celular.resetAte === null || Number.isFinite(celular.resetAte))
      && (celular.resetStatus !== RESET_STATUS.AGENDADO || Number.isFinite(celular.resetAte));
  }

  /** Valida e migra um snapshot sem modificar o candidato ou o jogo atual.
   * @param {unknown} candidato
   */
  function validarSnapshot(candidato) {
    if (!validarEstruturaBasica(candidato) || !validarLocalizacao(candidato.localizacao)
      || !validarDialogo(candidato.dialogo, candidato.localizacao)
      || !validarArquivos(candidato.arquivos) || !validarMensagens(candidato.mensagens)
      || !validarCelular(candidato.celular)) return null;
    if (candidato.act1Complete !== undefined && typeof candidato.act1Complete !== 'boolean') return null;
    const exploration = validarExploracao(candidato);
    if (!exploration) return null;
    const aparelho = validarAparelho(candidato, exploration);
    if (!aparelho) return null;
    return { ...copiarDados(candidato), ...exploration, aparelho, act1Complete: candidato.act1Complete ?? false };
  }

  /** Validar aparelho.
   * @param {Object} snapshot
   * @param {Object} exploration
   */
  function validarAparelho(snapshot, exploration) {
    let aparelho = snapshot.aparelho;
    if (aparelho === undefined) {
      const usouCelular = snapshot.mensagens.historico.length > 0
        || snapshot.mensagens.historicoAntesReset.length > 0
        || snapshot.arquivos.vistos.length > 0
        || snapshot.celular.resetStatus !== RESET_STATUS.INATIVO;
      aparelho = { originalPhoneStatus: "broken", activePhone: usouCelular ? "lulith" : null,
        phoneTheme: usouCelular ? "mj" : "lulith" };
      if (usouCelular) {
        exploration.inventory = exploration.inventory.filter(id => id !== "lulith_phone");
        exploration.sceneState.beco_fundo = { safeOpened: true, lulithPhoneCollected: true };
      }
    }
    const housePhoneCollected = exploration.sceneState.casa_sala?.mjPhoneCollected === true;
    const crime = exploration.sceneState.crime_sala;
    const crimeConcluded = crime?.firstEvidenceExamined === true && crime?.lockedEvidenceOpened === true;
    // Saves da casa anteriores ao Cenário 02 ainda registravam o aparelho original como quebrado.
    if (housePhoneCollected && !crimeConcluded && aparelho?.originalPhoneStatus === "broken"
      && aparelho.activePhone === null) {
      aparelho = { originalPhoneStatus: "working", activePhone: "mj", phoneTheme: "mj" };
    }
    if (!aparelho || !["broken", "working"].includes(aparelho.originalPhoneStatus)
      || ![null, "mj", "lulith"].includes(aparelho.activePhone)
      || !["lulith", "mj"].includes(aparelho.phoneTheme)) return null;
    if (aparelho.originalPhoneStatus === "working"
      && (!housePhoneCollected || aparelho.activePhone !== "mj" || crimeConcluded)) return null;
    if (aparelho.activePhone === "mj" && aparelho.originalPhoneStatus !== "working") return null;
    const collected = exploration.sceneState.beco_fundo?.lulithPhoneCollected;
    if (aparelho.activePhone === "lulith" && (!collected
      || !exploration.sceneState.beco_fundo.safeOpened
      || exploration.inventory.includes("lulith_phone"))) return null;
    return { ...aparelho };
  }

  /** Valida antes de cancelar timers e restaurar progresso e interface.
   * @param {unknown} candidato
   */
  function restaurarEstadoJogo(candidato) {
    if (services.isSceneTransitioning()) return false;
    const snapshot = validarSnapshot(candidato);
    if (!snapshot) throw new Error("Este ponto de salvamento está corrompido ou é incompatível.");
    cancelarTemporizadores();
    restaurarDadosPersistidos(snapshot);
    retomarResetRestaurado();
    restaurarInterface();
  }

  /** Registrar autosave.
   */
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

  /** Validar exploracao.
   * @param {Object} snapshot
   */
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

  /** Cancela tarefas pendentes para impedir alterações tardias após uma restauração.
   */
  function cancelarTemporizadores() {
    clearTimeout(state.cena.personagemSaidaTimer);
    clearInterval(state.dialogo.timer);
    clearInterval(state.celular.relogio);
    clearTimeout(state.celular.transicao);
    clearTimeout(state.celular.resetTimer);
    clearInterval(state.celular.resetInterval);
    clearTimeout(state.galeria.flashTimer);
    services.cancelarEnvioDono();
    state.cena.personagemSaidaTimer = null;
  }

  /** Reconstrói os componentes transitórios e aplica o progresso validado.
   * @param {Object} snapshot
   */
  function restaurarDadosPersistidos(snapshot) {
    state.act1Complete = snapshot.act1Complete;
    state.modo = "livre";
    state.inventoryActionPending = null;
    state.aparelho = snapshot.aparelho;
    state.localizacao = snapshot.localizacao;
    state.inventory = snapshot.inventory;
    state.sceneState = snapshot.sceneState;
    state.bolsa = criarEstadoBolsa();
    state.dialogo = { ...criarEstadoDialogo(), ...snapshot.dialogo, audio: state.dialogo.audio };
    state.celular = { ...criarEstadoCelular(), ...snapshot.celular };
    state.arquivos = { ...snapshot.arquivos, vistos: new Set(snapshot.arquivos.vistos) };
    state.mensagens = { ...criarEstadoMensagens(), ...snapshot.mensagens, timer: null };
    state.galeria = criarEstadoGaleria();
    state.texto = criarEstadoTexto();
  }

  /** Sincroniza a interface e devolve o foco após carregar um snapshot.
   */
  function restaurarInterface() {
    if (el.bag.bagDialog.open && typeof el.bag.bagDialog.close === "function") el.bag.bagDialog.close();
    el.bag.bagSearch.value = "";
    el.scene.interactionStatus.textContent = "";
    services.renderizarBolsa();
    el.phone.phoneOverlay.classList.remove("aberto");
    el.phone.phoneOverlay.classList.add("oculto");
    services.ocultarTelasCelular();
    el.phone.phoneHome.classList.remove("oculto");
    el.dialogue.dialogueBox.classList.add("oculto");
    el.scene.personagem.classList.add("oculto");
    el.scene.personagem.classList.remove("personagem-entrando", "personagem-saindo");
    el.scene.personagem.src = "";
    el.scene.personagem.dataset.characterId = "";
    el.scene.personagem.dataset.pose = "";
    el.scene.personagem.dataset.slot = "";
    el.gallery.galleryFlash.classList.add("oculto");
    el.phone.resetCountdown.classList.add("oculto");
    el.phone.phoneSignal.classList.remove("oculto");
    el.phone.btnVoltar.disabled = false;
    services.trocarCenario(services.obterCenaAtual());
    if (state.localizacao.cena === "casa_cozinha") services.mostrarPersonagem("james", "neutral", "right");
    services.fecharMenuIrPara();
    services.atualizarCabecalhoMensagens();
    services.definirBotoes();
    (state.aparelho.activePhone ? el.phone.btnCelular : el.bag.btnBolsa).focus();
  }

  /** Retomar reset restaurado.
   */
  function retomarResetRestaurado() {
    if (state.celular.resetStatus === RESET_STATUS.EXECUTANDO
      || (state.celular.resetStatus === RESET_STATUS.AGENDADO && state.celular.resetAte <= Date.now())) {
      services.concluirResetRestaurado();
    } else if (state.celular.resetStatus === RESET_STATUS.AGENDADO) {
      state.celular.resetTimer = setTimeout(services.iniciarResetRemoto, state.celular.resetAte - Date.now());
    }
  }

  return Object.freeze({
    copiarDados,
    capturarEstadoJogo,
    ehRegistro,
    validarEstruturaBasica,
    validarLocalizacao,
    validarDialogo,
    validarArquivos,
    validarMensagens,
    validarCelular,
    validarSnapshot,
    validarAparelho,
    restaurarEstadoJogo,
    registrarAutosave,
    validarExploracao,
    cancelarTemporizadores,
    restaurarDadosPersistidos,
    restaurarInterface,
    retomarResetRestaurado
  });
}
