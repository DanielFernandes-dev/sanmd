/**
 * Cria o sistema de galeria com dependências da instância.
 * @param {GameContext} context
 * @returns {Object} Operações do componente, usadas pelos demais sistemas e pelos testes.
 */
function criarSistemaGaleria(context) {
  const { state, el, document, window, saveRepository, data: DATA, config: CONFIG, services } = context;

  /** Obter cena da foto.
   * @param {PhotoSave} save
   */
  function obterCenaDaFoto(save) {
    const local = DATA.locais[save.saveState?.localizacao?.local];
    return local?.cenas[save.sceneId] ?? local?.cenas[save.saveState?.localizacao?.cena] ?? null;
  }

  /** Obter sprite fotografico.
   * @param {string} expressao
   */
  function obterSpriteFotografico(expressao) {
    const sprites = DATA.personagens.mj.fotografia.sprites;
    const sprite = Object.hasOwn(sprites, expressao) ? sprites[expressao] : null;
    return typeof sprite === "string" && sprite.length > 0 ? sprite : DATA.personagens.mj.sprites.neutral;
  }

  /** Criar composicao foto.
   * @param {PhotoSave} save
   */
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
      objects.replaceChildren(...services.criarObjetos(cena, save.saveState?.sceneState ?? {}));
      composicao.appendChild(objects);
    }
    composicao.appendChild(mj);
    return composicao;
  }

  /** Formatar data foto.
   * @param {number} timestamp
   */
  function formatarDataFoto(timestamp) {
    const data = new Date(timestamp);
    if (Number.isNaN(data.getTime())) return { data: "Data indisponível", hora: "--:--" };
    return {
      data: data.toLocaleDateString("pt-BR"),
      hora: data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    };
  }

  /** Definir status galeria.
   * @param {Object} [mensagem]
   */
  function definirStatusGaleria(mensagem = "") {
    el.gallery.galleryStatus.textContent = mensagem;
  }

  /** Carregar saves galeria.
   */
  function carregarSavesGaleria() {
    state.galeria.saves = saveRepository.listarManuais();
  }

  /** Criar slot foto.
   * @param {PhotoSave} save
   * @param {number} indice
   */
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

    const metadados = document.createElement("span");
    metadados.className = "gallery-photo-metadata";

    const nome = document.createElement("strong");
    nome.className = "gallery-photo-name";
    nome.textContent = save.name;
    const data = document.createElement("span");
    data.className = "gallery-photo-date";
    const formatada = formatarDataFoto(save.createdAt);
    data.textContent = formatada.data;
    const hora = document.createElement("span");
    hora.className = "gallery-photo-time";
    hora.textContent = formatada.hora;

    metadados.appendChild(nome);
    metadados.appendChild(data);
    metadados.appendChild(hora);
    botao.appendChild(metadados);
    return botao;
  }

  /** Renderizar galeria.
   */
  function renderizarGaleria() {
    el.gallery.galleryGrid.replaceChildren(
      ...Array.from({ length: MAX_MANUAL_SAVES }, (_, indice) => criarSlotFoto(state.galeria.saves[indice], indice))
    );
    el.gallery.galleryCount.textContent = `${state.galeria.saves.length}/${MAX_MANUAL_SAVES}`;
    el.gallery.btnTirarFoto.disabled = state.galeria.saves.length >= MAX_MANUAL_SAVES;
  }

  /** Mostrar grade galeria.
   * @param {boolean} [moverFoco]
   */
  function mostrarGradeGaleria(moverFoco = false) {
    clearTimeout(state.galeria.flashTimer);
    state.galeria.flashTimer = null;
    state.galeria.visualizacao = "grade";
    state.galeria.capturaPendente = null;
    state.galeria.selecionadoId = null;
    el.gallery.galleryFlash.classList.add("oculto");
    el.gallery.galleryPhotoForm.classList.add("oculto");
    el.gallery.galleryDetail.classList.add("oculto");
    el.gallery.galleryGrid.classList.remove("oculto");
    el.gallery.galleryToolbar.classList?.remove("oculto");
    renderizarGaleria();
    if (moverFoco) el.gallery.btnTirarFoto.focus();
  }

  /** Abrir galeria.
   */
  function abrirGaleria() {
    if (state.modo !== "celular" || state.celular.tela !== "inicio") return;

    state.celular.tela = "galeria";
    services.ocultarTelasCelular();
    el.phone.phoneGallery.classList.remove("oculto");
    carregarSavesGaleria();
    definirStatusGaleria(
      state.galeria.saves.length >= MAX_MANUAL_SAVES
        ? "A galeria está cheia. Apague uma fotografia para registrar um novo momento."
        : ""
    );
    mostrarGradeGaleria(true);
  }

  /** Sortear expressao fotografica.
   */
  function sortearExpressaoFotografica() {
    const expressoes = DATA.personagens.mj.fotografia.expressoes;
    const anterior = state.galeria.saves.at(-1)?.photoExpression;
    const candidatas = expressoes.length > 1 ? expressoes.filter((expressao) => expressao !== anterior) : expressoes;
    return candidatas[Math.floor(Math.random() * candidatas.length)];
  }

  /** Gerar id save.
   */
  function gerarIdSave() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
    return `foto-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  /** Mostrar preview foto.
   */
  function mostrarPreviewFoto() {
    state.galeria.flashTimer = null;
    el.gallery.galleryFlash.classList.add("oculto");
    if (!state.galeria.capturaPendente) return;

    state.galeria.visualizacao = "preview";
    el.gallery.galleryToolbar.classList.add("oculto");
    el.gallery.galleryGrid.classList.add("oculto");
    el.gallery.galleryDetail.classList.add("oculto");
    el.gallery.galleryPreview.replaceChildren(criarComposicaoFoto(state.galeria.capturaPendente));
    el.gallery.galleryPhotoForm.classList.remove("oculto");
    el.gallery.galleryPhotoName.textContent = "Toque para nomear";
    el.gallery.galleryPhotoName.focus();
  }

  /** Abrir editor do nome da foto.
   */
  function abrirEditorNomeFoto() {
    if (state.modo !== "celular" || state.celular.tela !== "galeria") return false;
    if (!state.galeria.capturaPendente || state.galeria.visualizacao !== "preview") return false;
    return services.abrirEntradaTexto({
      confirmLabel: "OK",
      maxLength: CONFIG.tamanhoNomeFoto,
      allowEmpty: false,
      aoConfirmar: confirmarFoto,
      aoCancelar: () => {
        el.gallery.galleryPhotoName.textContent = "Toque para nomear";
      },
      aoAlterar: (valor) => {
        el.gallery.galleryPhotoName.textContent = valor || "Toque para nomear";
      }
    });
  }

  /** Tirar foto.
   */
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
      saveState: services.capturarEstadoJogo()
    };
    definirStatusGaleria();
    el.gallery.galleryFlash.classList.remove("oculto");
    state.galeria.flashTimer = setTimeout(mostrarPreviewFoto, services.duracaoVisual(CONFIG.duracaoFlashFoto));
  }

  /** Confirmar foto.
   * @param {string} nome
   */
  function confirmarFoto(nome) {
    if (!state.galeria.capturaPendente) return false;
    const nomeSeguro = nome.trim().slice(0, CONFIG.tamanhoNomeFoto);
    if (!nomeSeguro) {
      definirStatusGaleria("Informe um nome para a fotografia.");
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

  /** Cancelar foto.
   */
  function cancelarFoto() {
    definirStatusGaleria();
    mostrarGradeGaleria(true);
  }

  /** Selecionar foto.
   * @param {string} saveId
   */
  function selecionarFoto(saveId) {
    const save = state.galeria.saves.find((item) => item.id === saveId);
    if (!save) return;

    state.galeria.visualizacao = "detalhe";
    state.galeria.selecionadoId = save.id;
    el.gallery.galleryToolbar.classList.add("oculto");
    el.gallery.galleryGrid.classList.add("oculto");
    el.gallery.galleryPhotoForm.classList.add("oculto");
    el.gallery.galleryDetailPhoto.replaceChildren(criarComposicaoFoto(save));
    el.gallery.galleryDetailName.textContent = save.name;
    const formatada = formatarDataFoto(save.createdAt);
    el.gallery.galleryDetailDate.textContent = `${formatada.data}\n${formatada.hora}`;
    el.gallery.galleryDetail.classList.remove("oculto");
    definirStatusGaleria();
    el.gallery.btnCarregarFoto.focus();
  }

  /** Carregar foto selecionada.
   */
  function carregarFotoSelecionada() {
    const save = state.galeria.saves.find((item) => item.id === state.galeria.selecionadoId);
    if (!save) return false;

    try {
      services.restaurarEstadoJogo(save.saveState);
      return true;
    } catch (erro) {
      definirStatusGaleria(erro.message || "Não foi possível carregar esta fotografia.");
      return false;
    }
  }

  /** Excluir foto selecionada.
   */
  function excluirFotoSelecionada() {
    const save = state.galeria.saves.find((item) => item.id === state.galeria.selecionadoId);
    if (!save) return false;

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

  return Object.freeze({
    obterCenaDaFoto,
    obterSpriteFotografico,
    criarComposicaoFoto,
    formatarDataFoto,
    definirStatusGaleria,
    carregarSavesGaleria,
    criarSlotFoto,
    renderizarGaleria,
    mostrarGradeGaleria,
    abrirGaleria,
    sortearExpressaoFotografica,
    gerarIdSave,
    mostrarPreviewFoto,
    abrirEditorNomeFoto,
    tirarFoto,
    confirmarFoto,
    cancelarFoto,
    selecionarFoto,
    carregarFotoSelecionada,
    excluirFotoSelecionada
  });
}
