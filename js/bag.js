/**
 * Cria o sistema de bolsa e inventário com dependências da instância.
 * @param {GameContext} context
 * @returns {Object} Operações do componente, usadas pelos demais sistemas e pelos testes.
 */
function criarSistemaBolsa(context) {
  const { state, el, document, items: ITEMS, config: CONFIG, services } = context;

  /** Adicionar item.
   * @param {string} id
   */
  function adicionarItem(id) {
    if (!Object.hasOwn(ITEMS, id) || state.inventory.includes(id)
      || (ITEMS[id].inventoryAction?.device === state.aparelho.activePhone)) return false;
    state.inventory.push(id);
    renderizarBolsa();
    return true;
  }

  /** Remover item.
   * @param {string} id
   */
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

  /** Normaliza texto para busca sem distinguir acentos ou maiúsculas.
   * @param {string} texto
   */
  function normalizarTexto(texto) {
    return (texto ?? "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  /** Obter itens filtrados bolsa.
   */
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

  /** Calcula as páginas visíveis e reticências para navegação da bolsa.
   * @param {number} paginaAtual
   * @param {number} totalPaginas
   */
  function gerarNumerosPaginacao(paginaAtual, totalPaginas) {
    if (totalPaginas <= CONFIG.limiteBotoesPaginacao) {
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

  /** Renderizar paginacao bolsa.
   * @param {number} totalPaginas
   */
  function renderizarPaginacaoBolsa(totalPaginas) {
    el.bag.bagPagination.hidden = totalPaginas <= 1;
    if (totalPaginas <= 1) {
      el.bag.bagPagination.replaceChildren();
      return;
    }
    const atual = state.bolsa.pagina;
    const anterior = criarBotaoPaginacao("‹", "Página anterior", atual - 1, atual <= 1);
    const proximo = criarBotaoPaginacao("›", "Próxima página", atual + 1, atual >= totalPaginas);
    anterior.classList.add("bag-page-nav");
    proximo.classList.add("bag-page-nav");
    const paginas = gerarNumerosPaginacao(atual, totalPaginas).map(pagina => {
      if (pagina === "…") {
        const ellipsis = document.createElement("span");
        ellipsis.className = "bag-page-ellipsis";
        ellipsis.textContent = "…";
        ellipsis.setAttribute("aria-hidden", "true");
        return ellipsis;
      }
      const botao = criarBotaoPaginacao(pagina, `Página ${pagina} da Bolsa`, pagina);
      if (pagina === atual) {
        botao.classList.add("bag-page-btn--active");
        botao.setAttribute("aria-current", "page");
      }
      return botao;
    });
    el.bag.bagPagination.replaceChildren(anterior, ...paginas, proximo);
  }

  /** Renderizar detalhes bolsa.
   */
  function renderizarDetalhesBolsa() {
    const item = state.inventory.includes(state.bolsa.itemSelecionadoId)
      ? ITEMS[state.bolsa.itemSelecionadoId] : null;
    if (!item) {
      renderizarDetalhesVaziosBolsa();
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

    const funcSection = criarSecaoDetalhesBolsa("FUNÇÃO", item.purpose);
    const descSection = criarSecaoDetalhesBolsa("DESCRIÇÃO", item.description);

    el.bag.bagDetails.replaceChildren(title, imageWrapper, funcSection, descSection);
    if (acaoInventarioDisponivel(item.id)) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "bag-item-action";
      button.textContent = item.inventoryAction.label.toUpperCase();
      button.setAttribute("aria-label", `${item.inventoryAction.label} ${item.label}`);
      button.addEventListener("click", () => {
        if (executarAcaoInventario(item.id)) button.disabled = true;
      });
      el.bag.bagDetails.appendChild(button);
    }
  }

  /** Atualiza busca, seleção, página, grade e detalhes do inventário.
   */
  function renderizarBolsa() {
    const totalItens = state.inventory.length;

    if (totalItens === 0) {
      el.bag.bagSearchWrapper.hidden = true;
      el.bag.bagBody.hidden = true;
      el.bag.bagNoResults.hidden = true;
      el.bag.bagEmpty.hidden = false;
      limparConteudoBolsa();
      return;
    }

    el.bag.bagEmpty.hidden = true;
    el.bag.bagSearchWrapper.hidden = false;
    el.bag.bagSearchClear.hidden = !state.bolsa.pesquisa;

    const itensFiltrados = obterItensFiltradosBolsa();

    if (itensFiltrados.length === 0) {
      el.bag.bagBody.hidden = true;
      el.bag.bagNoResults.hidden = false;
      limparConteudoBolsa();
      return;
    }

    el.bag.bagNoResults.hidden = true;
    el.bag.bagBody.hidden = false;

    const totalPaginas = Math.ceil(itensFiltrados.length / CONFIG.itensPorPaginaBolsa) || 1;
    if (state.bolsa.pagina > totalPaginas) state.bolsa.pagina = totalPaginas;
    if (state.bolsa.pagina < 1) state.bolsa.pagina = 1;

    const inicio = (state.bolsa.pagina - 1) * CONFIG.itensPorPaginaBolsa;
    const itensPagina = itensFiltrados.slice(inicio, inicio + CONFIG.itensPorPaginaBolsa);

    const itemNaPagina = itensPagina.find(item => item.id === state.bolsa.itemSelecionadoId);
    if (!itemNaPagina) {
      state.bolsa.itemSelecionadoId = itensPagina[0]?.id ?? null;
    }

    renderizarGradeBolsa(itensPagina);

    renderizarPaginacaoBolsa(totalPaginas);
    renderizarDetalhesBolsa();
  }

  /** Obter handler inventario.
   * @param {ItemDefinition} item
   */
  function obterHandlerInventario(item) {
    return item?.inventoryAction ? inventoryActionHandlers.obter(item.inventoryAction.type) : null;
  }

  /** Acao inventario disponivel.
   * @param {string} itemId
   */
  function acaoInventarioDisponivel(itemId) {
    const item = ITEMS[itemId];
    return state.inventory.includes(itemId) && !state.inventoryActionPending
      && Boolean(obterHandlerInventario(item)?.validar(item));
  }

  /** Inicia a reação narrativa de um item disponível na bolsa.
   * @param {string} itemId
   */
  function executarAcaoInventario(itemId) {
    if (state.modo !== "livre" || !el.bag.bagDialog.open || !acaoInventarioDisponivel(itemId)) return false;
    const action = ITEMS[itemId].inventoryAction;
    if (action.type === "use_on_hotspot") {
      el.bag.bagDialog.close();
      state.bolsa.itemEmUsoId = itemId;
      el.scene.interactionStatus.textContent = "Vou usar a chave na maleta.";
      const target = Array.from(el.scene.hotspotLayer.children)
        .find(button => button.dataset.hotspot === action.targetHotspot);
      (target ?? el.bag.btnBolsa).focus();
      return true;
    }
    state.inventoryActionPending = itemId;
    el.bag.bagDialog.close();
    services.fecharMenuIrPara();
    state.dialogo.falas = ITEMS[itemId].inventoryAction.reaction;
    state.dialogo.linha = 0;
    state.modo = "dialogo";
    el.dialogue.dialogueBox.classList.remove("oculto");
    services.definirBotoes();
    services.mostrarLinha();
    return true;
  }

  /** Conclui a ação pendente somente se o item e suas condições ainda forem válidos.
   */
  function concluirAcaoInventario() {
    const itemId = state.inventoryActionPending;
    state.inventoryActionPending = null;
    if (!itemId || !state.inventory.includes(itemId)) return;
    const item = ITEMS[itemId];
    const handler = obterHandlerInventario(item);
    if (handler?.validar(item)) handler.concluir(item);
  }

  /** Criar secao detalhes bolsa.
   * @param {string} titulo
   * @param {string} texto
   */
  function criarSecaoDetalhesBolsa(titulo, texto) {
    const section = document.createElement("div");
    section.className = "bag-detail-section";
    const heading = document.createElement("h4");
    heading.className = "bag-detail-section-title";
    heading.textContent = titulo;
    const content = document.createElement("p");
    content.className = "bag-detail-text";
    content.textContent = texto || "—";
    section.appendChild(heading);
    section.appendChild(content);
    return section;
  }

  /** Renderizar detalhes vazios bolsa.
   */
  function renderizarDetalhesVaziosBolsa() {
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
    el.bag.bagDetails.replaceChildren(emptyWrapper);
  }

  /** Renderizar grade bolsa.
   * @param {ItemDefinition[]} itensPagina
   */
  function renderizarGradeBolsa(itensPagina) {
    const slots = [];
    for (let i = 0; i < CONFIG.itensPorPaginaBolsa; i++) {
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
    el.bag.bagGrid.replaceChildren(...slots);

  }

  /** Limpar conteudo bolsa.
   */
  function limparConteudoBolsa() {
    state.bolsa.itemSelecionadoId = null;
    state.bolsa.pagina = 1;
    el.bag.bagGrid.replaceChildren();
    el.bag.bagDetails.replaceChildren();
    el.bag.bagPagination.replaceChildren();
    el.bag.bagPagination.hidden = true;
  }

  /** Cria um botão de página que respeita o estado desabilitado.
   * @param {string} texto
   * @param {string} rotulo
   * @param {number} pagina
   * @param {boolean} [desabilitado]
   */
  function criarBotaoPaginacao(texto, rotulo, pagina, desabilitado = false) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "bag-page-btn";
    botao.textContent = String(texto);
    botao.setAttribute("aria-label", rotulo);
    botao.disabled = desabilitado;
    botao.addEventListener("click", () => {
      if (botao.disabled) return;
      state.bolsa.pagina = pagina;
      renderizarBolsa();
    });
    return botao;
  }

  const inventoryActionHandlers = criarRegistroMecanicas({
    use_on_hotspot: {
      validar: item => state.localizacao.local === "cena_crime"
        && state.localizacao.cena === "crime_sala"
        && item.inventoryAction.targetHotspot === "crime_case"
        && !state.sceneState.crime_sala?.lockedEvidenceOpened
    },
    activate_phone: {
      validar: item => state.aparelho.activePhone === null
        && item.inventoryAction.device === "lulith"
        && Boolean(state.sceneState.beco_fundo?.safeOpened)
        && Boolean(state.sceneState.beco_fundo?.lulithPhoneCollected),
      concluir: item => {
        state.aparelho.activePhone = item.inventoryAction.device;
        state.aparelho.phoneTheme = item.inventoryAction.theme;
        removerItem(item.id);
        el.scene.interactionStatus.textContent = "";
      }
    }
  });

  return Object.freeze({
    adicionarItem,
    removerItem,
    normalizarTexto,
    obterItensFiltradosBolsa,
    gerarNumerosPaginacao,
    renderizarPaginacaoBolsa,
    renderizarDetalhesBolsa,
    renderizarBolsa,
    obterHandlerInventario,
    acaoInventarioDisponivel,
    executarAcaoInventario,
    concluirAcaoInventario,
    criarSecaoDetalhesBolsa,
    renderizarDetalhesVaziosBolsa,
    renderizarGradeBolsa,
    limparConteudoBolsa,
    criarBotaoPaginacao
  });
}
