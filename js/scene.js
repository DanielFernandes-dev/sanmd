/**
 * Cria o sistema de cenas e exploração com dependências da instância.
 * @param {GameContext} context
 * @returns {Object} Operações do componente, usadas pelos demais sistemas e pelos testes.
 */
function criarSistemaCenas(context) {
  const { state, el, document, data: DATA, items: ITEMS, config: CONFIG, services } = context;

  const eventosInteracao = context.eventosInteracao;
  const mecanicas = criarMecanicasHotspot(context);
  // Transitório e privado: nunca faz parte de state/snapshot.
  let objectAnimation = null;

  function assetsDaCena(cena) {
    return [cena.background, ...(cena.objects ?? []).flatMap(o => o.variants.map(v => v.asset)),
      ...(cena.hotspots ?? []).flatMap(h => h.animation?.frames ?? [])];
  }

  /** Ocultar personagem.
   */
  function ocultarPersonagem() {
    if (el.scene.personagem.classList.contains("oculto")) return;

    const estavaVisivel = Boolean(el.scene.personagem.dataset.characterId);
    clearTimeout(state.cena.personagemSaidaTimer);
    state.cena.personagemSaidaTimer = null;

    if (!estavaVisivel) {
      el.scene.personagem.classList.add("oculto");
      return;
    }

    el.scene.personagem.classList.remove("personagem-entrando");
    el.scene.personagem.classList.add("personagem-saindo");
    state.cena.personagemSaidaTimer = setTimeout(() => {
      el.scene.personagem.classList.add("oculto");
      el.scene.personagem.classList.remove("personagem-saindo");
      el.scene.personagem.src = "";
      el.scene.personagem.dataset.characterId = "";
      el.scene.personagem.dataset.pose = "";
      el.scene.personagem.dataset.slot = "";
      state.cena.personagemSaidaTimer = null;
    }, services.duracaoVisual(CONFIG.transicaoPersonagemSaida));
  }

  /** Mostrar personagem.
   * @param {string} id
   * @param {string} pose
   * @param {string} slot
   */
  function mostrarPersonagem(id, pose, slot) {
    const personagem = DATA.personagens[id];
    const sprite = personagem?.sprites[pose];
    if (!sprite) return;

    clearTimeout(state.cena.personagemSaidaTimer);
    el.scene.personagem.src = sprite;
    el.scene.personagem.dataset.characterId = personagem.id;
    el.scene.personagem.dataset.pose = pose;
    el.scene.personagem.dataset.slot = slot;
    el.scene.personagem.classList.remove("oculto");
    el.scene.personagem.classList.remove("personagem-saindo");
    el.scene.personagem.classList.add("personagem-entrando");
  }

  /** Obter local.
   */
  function obterLocal() {
    return DATA.locais[state.localizacao.local];
  }

  /** Resolve a cena pela localização da instância, sem modificar o catálogo narrativo.
   */
  function obterCenaAtual() {
    return obterLocal()?.cenas[state.localizacao.cena];
  }

  /** Obter destinos.
   * @param {SceneDefinition} [cena]
   */
  function obterDestinos(cena = obterCenaAtual()) {
    const local = obterLocal();
    if (!local || !cena) return [];
    const exits = podeSairDoBeco() && cena.id === 'beco_entrada'
      ? [{ id: 'sair_beco', label: 'Sair do beco' }] : [];
    return exits.concat(cena.destinos
      .map((destinoId) => local.cenas[destinoId])
      .filter(Boolean));
  }

  /** Tem destinos.
   */
  function temDestinos() {
    return obterDestinos().length > 0;
  }

  /** Criar botao destino.
   * @param {SceneDefinition} destino
   */
  function criarBotaoDestino(destino) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "message-choice";
    botao.textContent = destino.label;
    botao.addEventListener("click", () => irPara(destino.id));
    return botao;
  }

  /** Renderizar menu ir para.
   */
  function renderizarMenuIrPara() {
    el.scene.irParaMenu.replaceChildren(...obterDestinos().map(criarBotaoDestino));
  }

  /** Menu ir para aberto.
   */
  function menuIrParaAberto() {
    return !el.scene.irParaMenu.classList.contains("oculto");
  }

  /** Abrir menu ir para.
   */
  function abrirMenuIrPara() {
    if (state.modo !== "livre" || services.isSceneTransitioning()) return;
    renderizarMenuIrPara();
    el.scene.irParaMenu.classList.remove("oculto");
    el.scene.irParaMenu.firstElementChild?.focus();
  }

  /** Fechar menu ir para.
   */
  function fecharMenuIrPara() {
    el.scene.irParaMenu.classList.add("oculto");
    el.scene.irParaMenu.replaceChildren();
  }

  /** Alternar menu ir para.
   */
  function alternarMenuIrPara() {
    if (state.modo !== "livre" || services.isSceneTransitioning()) return;
    if (menuIrParaAberto()) {
      fecharMenuIrPara();
      el.scene.btnIrPara.focus();
    } else {
      abrirMenuIrPara();
    }
  }

  /** Trocar cenario.
   * @param {SceneDefinition} cena
   */
  function trocarCenario(cena) {
    objectAnimation = null; // Troca de cena ou Load invalida qualquer continuação pendente.
    state.localizacao.cena = cena.id;
    DATA.cena = cena;
    el.scene.cenario.src = cena.background;
    renderizarObjetos();
    if (cena.hotspots?.some(h => h.animation)) {
      services.prepareSceneImages(assetsDaCena(cena)).catch(() => {
        // O clique tenta novamente; o sprite estático continua visível.
      });
    }
    el.scene.interactionStatus.textContent = "";
  }

  /** Aplicar cena.
   * @param {SceneDefinition} cena
   */
  function aplicarCena(cena) {
    if (!cena) return;
    trocarCenario(cena);
    fecharMenuIrPara();
    ocultarPersonagem();
    services.definirBotoes();
  }

  /** A saída narrativa fica disponível somente depois da coleta. */
  function podeSairDoBeco() {
    const progress = state.sceneState.beco_fundo;
    return state.localizacao.local === 'beco' && !state.act1Complete
      && progress?.safeOpened === true && progress?.lulithPhoneCollected === true;
  }

  /** Ir para.
   * @param {string} destinoId
   */
  function irPara(destinoId) {
    if (state.modo !== "livre" || services.isSceneTransitioning()) return;
    if (services.isCutsceneActive()) return;
    if (destinoId === 'sair_beco') {
      if (!podeSairDoBeco() || state.localizacao.cena !== 'beco_entrada') return;
      fecharMenuIrPara();
      services.cancelarTemporizadores();
      state.modo = 'cutscene';
      return services.iniciarCutscene('act1_ending', () => {
        state.act1Complete = true;
        services.registrarAutosave();
        services.iniciarCutscene('act1_title', () => {
          state.modo = 'livre';
          eventosInteracao.act1Complete?.();
        });
      });
    }
    const cena = obterCenaAtual();
    if (!cena?.destinos.includes(destinoId)) return;
    const destino = obterLocal()?.cenas[destinoId];
    if (!destino) return;
    return transitionToScene(obterLocal().id, destino.id);
  }

  /** Ir para local.
   * @param {string} localId
   */
  function irParaLocal(localId) {
    if (state.modo !== "livre" || services.isSceneTransitioning()) return;
    if (typeof localId !== "string" || !Object.hasOwn(DATA.locais, localId)) return;
    const local = DATA.locais[localId];
    if (!local) return;
    return transitionToScene(local.id, local.cenaInicial);
  }

  /** Carrega um destino já autorizado por navegação/mapa/cutscene. */
  function transitionToScene(localId, cenaId) {
    if (services.isSceneTransitioning()) return Promise.resolve(false);
    const local = Object.hasOwn(DATA.locais, localId) && DATA.locais[localId];
    const destino = local && Object.hasOwn(local.cenas, cenaId) && local.cenas[cenaId];
    if (!destino || (state.localizacao.local === localId && state.localizacao.cena === cenaId)) {
      return Promise.resolve(false);
    }
    const anterior = { ...state.localizacao };
    return services.runSceneTransition(async () => {
      await services.prepareSceneImages(assetsDaCena(destino));
      try {
        state.localizacao.local = localId;
        aplicarCena(destino);
        clearTimeout(state.cena.personagemSaidaTimer);
        state.cena.personagemSaidaTimer = null;
        el.scene.personagem.classList.add("oculto");
        el.scene.personagem.classList.remove("personagem-entrando", "personagem-saindo");
        el.scene.personagem.src = "";
        el.scene.personagem.dataset.characterId = "";
        await services.prepareSceneImages([el.scene.cenario.src,
          ...Array.from(el.scene.objectLayer.children).map(o => o.src)]);
      } catch (error) {
        Object.assign(state.localizacao, anterior);
        aplicarCena(obterCenaAtual());
        throw error;
      }
    });
  }

  /** Estado da cena.
   * @param {SceneDefinition} cena
   * @param {Object} [source]
   */
  function estadoDaCena(cena, source = state.sceneState) {
    return { ...cena.initialState, ...source[cena.id] };
  }

  /** Condicoes atendidas.
   * @param {Object} [conditions]
   * @param {Object} sceneState
   */
  function condicoesAtendidas(conditions = {}, sceneState) {
    return Object.entries(conditions).every(([key, value]) => sceneState[key] === value);
  }

  /** Posicionar objeto.
   * @param {HTMLElement} element
   * @param {number[]} rect
   */
  function posicionarObjeto(element, rect) {
    const [x, y, width, height] = rect;
    element.style = `left:${x}%;top:${y}%;width:${width}%;height:${height}%;`;
  }

  /** Compõe objetos visíveis a partir do estado informado, inclusive em fotografias.
   * @param {SceneDefinition} cena
   * @param {Object} [source]
   */
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

  /** Renderizar objetos.
   */
  function renderizarObjetos() {
    const cena = obterCenaAtual();
    const previous = Array.from(el.scene.objectLayer.children);
    el.scene.objectLayer.replaceChildren(...criarObjetos(cena).map(sprite => {
      const existing = previous.find(o => o.dataset.objectId === sprite.dataset.objectId);
      if (!existing) return sprite;
      if (objectAnimation?.objectId !== sprite.dataset.objectId) existing.src = sprite.src;
      return existing;
    }));
    const values = estadoDaCena(cena);
    el.scene.hotspotLayer.replaceChildren(...(cena.hotspots ?? [])
      .filter(h => condicoesAtendidas(h.conditions, values))
      .map(h => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "scene-hotspot";
        button.ariaLabel = h.ariaLabel;
        button.dataset.hotspot = h.id;
        button.disabled = Boolean(objectAnimation);
        posicionarObjeto(button, h.rect);
        button.addEventListener("click", () => executarHotspot(h.id));
        return button;
      }));
  }

  /** Executa uma interação válida, aplica mudanças e registra o autosave.
   * @param {string} id
   * @param {string|null} [selectedItem]
   */
  function executarHotspot(id, selectedItem = null) {
    if (objectAnimation || services.isSceneTransitioning() || state.modo !== "livre" || el.bag.bagDialog.open) return false;
    const cena = obterCenaAtual();
    const h = cena.hotspots?.find(hotspot => hotspot.id === id);
    const executarMecanica = h && mecanicas.obter(h.type);
    if (!executarMecanica
      || !condicoesAtendidas(h.conditions, estadoDaCena(cena))) return false;
    if (h.requiresItem && (!state.inventory.includes(h.requiresItem)
      || (selectedItem !== null && selectedItem !== h.requiresItem))) {
      el.scene.interactionStatus.textContent = h.missingItemMessage ?? "Preciso de outro item para isso.";
      return false;
    }
    if (h.animation) return animarObjeto(cena, h, executarMecanica);
    return concluirHotspot(cena, h, executarMecanica);
  }

  async function animarObjeto(cena, h, executarMecanica) {
    const animation = h.animation;
    const sprite = Array.from(el.scene.objectLayer.children).find(o => o.dataset.objectId === animation.objectId);
    if (!sprite) return false;
    const token = { objectId: animation.objectId };
    objectAnimation = token;
    fecharMenuIrPara();
    renderizarObjetos();
    try {
      await services.prepareSceneImages(assetsDaCena(cena));
      if (objectAnimation !== token) return false;
      // O primeiro frame já está visível; quatro intermediários de 80 ms.
      for (const frame of animation.frames.slice(1, -1)) {
        sprite.src = frame;
        await services.esperarAnimacao(animation.frameDuration);
        if (objectAnimation !== token) return false;
      }
      sprite.src = animation.frames.at(-1);
      await services.esperarAnimacao(animation.finalHold);
      if (objectAnimation !== token) return false;
      objectAnimation = null;
      return concluirHotspot(cena, h, executarMecanica);
    } catch (error) {
      if (objectAnimation !== token) return false;
      objectAnimation = null;
      renderizarObjetos();
      el.scene.interactionStatus.textContent = "Não foi possível abrir o cofre. Tente novamente.";
      return false;
    }
  }

  function concluirHotspot(cena, h, executarMecanica) {
    if (!executarMecanica(h)) return false;
    state.sceneState[cena.id] = { ...estadoDaCena(cena), ...h.changes };
    if (h.requiresItem && (h.consumeItem ?? ITEMS[h.requiresItem]?.consumable)) services.removerItem(h.requiresItem);
    fecharMenuIrPara();
    renderizarObjetos();
    el.scene.interactionStatus.textContent = "";
    // Narrative hooks run after the atomic logical transition and may remove inventory items.
    if (h.eventId) eventosInteracao[h.eventId]?.({ sceneId: cena.id, itemId: h.itemId });
    services.registrarAutosave();
    (el.scene.hotspotLayer.firstElementChild ?? el.bag.btnBolsa).focus();
    return true;
  }

  return Object.freeze({
    ocultarPersonagem,
    mostrarPersonagem,
    obterLocal,
    obterCenaAtual,
    obterDestinos,
    temDestinos,
    criarBotaoDestino,
    renderizarMenuIrPara,
    menuIrParaAberto,
    abrirMenuIrPara,
    fecharMenuIrPara,
    alternarMenuIrPara,
    trocarCenario,
    aplicarCena,
    irPara,
    irParaLocal,
    transitionToScene,
    estadoDaCena,
    condicoesAtendidas,
    posicionarObjeto,
    criarObjetos,
    renderizarObjetos,
    executarHotspot
  });
}
