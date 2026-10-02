/** Apresentação transitória: o repositório e a persistência continuam donos dos saves. */
function criarTelaInicial({ game, document, window }) {
  const { services, state, saveRepository } = game;
  const get = id => document.getElementById(id);
  const menu = get('title-menu');
  const app = get('app');
  const cover = get('notebook-cover');
  const opened = get('notebook-open');
  const pages = get('notebook-pages');
  const status = get('notebook-status');
  let mode = 'menu';
  let page = 0;
  let playing = false;
  let initialized = false;
  const compactPages = window.matchMedia?.('(max-height: 500px) and (orientation: landscape)');
  function setMode(value) {
    mode = value;
    menu.dataset.state = value;
    cover.inert = value !== 'menu';
    pages.inert = value !== 'load';
  }
  async function animateBook(open) {
    setMode(open ? 'opening' : 'closing');
    opened.hidden = false;
    const duration = services.movimentoReduzido() ? 160 : 700;
    const frames = [{ opacity: 1, transform: 'perspective(1200px) rotateY(0deg)' },
      { opacity: 0, transform: 'perspective(1200px) rotateY(-85deg)' }];
    const animation = cover.animate?.(open ? frames : [...frames].reverse(),
      { duration, easing: 'ease-in-out', fill: 'forwards' });
    const spread = opened.animate?.([{ opacity: open ? 0 : 1 }, { opacity: open ? 1 : 0 }],
      { duration, easing: 'ease-in-out', fill: 'forwards' });
    await services.esperarAnimacao(duration);
    cover.style.opacity = open ? '0' : '1';
    opened.style.opacity = open ? '1' : '0';
    animation?.cancel();
    spread?.cancel();
    if (!open) opened.hidden = true;
  }
  function records() {
    const auto = saveRepository.obterAutosave();
    return [...(auto ? [{ ...auto, name: 'Último progresso · automático' }] : []),
      ...saveRepository.listarManuais()];
  }
  function render() {
    const saves = records();
    const slots = compactPages?.matches ? 2 : 4;
    const total = Math.max(1, Math.ceil(saves.length / slots));
    page = Math.min(page, total - 1);
    status.textContent = saves.length ? '' : 'Nenhum registro disponível.';
    get('notebook-saves').replaceChildren(...Array.from({ length: slots }, (_, index) => {
      const save = saves[page * slots + index];
      const slot = document.createElement(save ? 'button' : 'div');
      slot.className = save ? 'notebook-photo' : 'notebook-empty';
      if (!save) { slot.setAttribute('aria-hidden', 'true'); return slot; }
      slot.type = 'button';
      slot.dataset.saveId = save.id;
      if (save.id === 'autosave') {
        const thumbnail = document.createElement('img');
        thumbnail.className = 'notebook-auto-thumbnail';
        thumbnail.src = services.obterCenaDaFoto(save)?.background ?? '';
        thumbnail.alt = '';
        slot.appendChild(thumbnail);
      } else slot.appendChild(services.criarComposicaoFoto(save));
      const name = document.createElement('strong');
      name.textContent = save.name;
      slot.title = save.name;
      const date = document.createElement('span');
      const formatted = services.formatarDataFoto(save.createdAt);
      date.textContent = `${formatted.data} · ${formatted.hora}`;
      slot.appendChild(name);
      slot.appendChild(date);
      slot.addEventListener('click', () => load(save.id));
      return slot;
    }));
    get('notebook-page').textContent = `${page + 1} / ${total}`;
    get('notebook-prev').disabled = page === 0;
    get('notebook-next').disabled = page === total - 1;
  }
  async function openLoad() {
    if (menu.inert || mode !== 'menu') return;
    page = 0;
    render();
    await animateBook(true);
    setMode('load');
    get('notebook-back').focus();
  }
  async function close() {
    if (mode !== 'load') return;
    await animateBook(false);
    setMode('menu');
    get('notebook-load').focus();
  }
  async function enter(restore, newGame) {
    setMode('startingGame');
    const fade = get('notebook-fade');
    const duration = services.movimentoReduzido() ? 100 : 420;
    try {
      await services.animarFade(fade, 0, 1, duration);
      restore();
      game.iniciar();
      get('notebook-stage').hidden = true;
      menu.classList.add('entering-game');
      if (newGame) {
        await new Promise((resolve, reject) => {
          if (services.iniciarCutscene('lulith_codigo', resolve) === false) {
            reject(new Error('Uma apresentação já está em andamento. Tente novamente.'));
          }
        });
      }
      await services.animarFade(fade, 1, 0, duration);
      menu.hidden = true;
      app.inert = false;
      playing = true;
      if (newGame) {
        services.iniciarConversa();
        services.registrarAutosave();
      }
      get('btn-conversar').focus();
    } catch (error) {
      playing = false;
      app.inert = true;
      menu.hidden = false;
      get('notebook-stage').hidden = false;
      menu.classList.remove('entering-game');
      fade.style.opacity = '0';
      render();
      setMode('load');
      status.textContent = error.message || 'Não foi possível carregar este registro.';
      get('notebook-back').focus();
    }
  }
  async function newGame() {
    if (menu.inert || mode !== 'menu') return;
    // Não mostrar registros antigos durante a abertura de uma partida nova.
    get('notebook-saves').replaceChildren();
    status.textContent = '';
    await animateBook(true);
    await enter(() => {
      services.cancelarTemporizadores();
      Object.assign(state, criarEstadoJogo());
      services.restaurarInterface();
    }, true);
  }
  async function load(id) {
    if (mode !== 'load') return;
    const save = records().find(record => record.id === id);
    if (!save) { render(); return; }
    await enter(() => {
      if (services.restaurarEstadoJogo(save.saveState) === false) throw new Error('Aguarde a transição e tente novamente.');
    }, false);
  }
  function saveOnExit() {
    if (!playing || services.isSceneTransitioning() || services.isCutsceneActive()) return;
    services.registrarAutosave();
  }
  function iniciar({ bloqueado = false } = {}) {
    if (initialized) return;
    initialized = true;
    services.configurarAnimacoes();
    app.inert = true;
    setMode('menu');
    menu.inert = bloqueado;
    get('notebook-new').addEventListener('click', newGame);
    get('notebook-load').addEventListener('click', openLoad);
    get('notebook-back').addEventListener('click', close);
    get('notebook-prev').addEventListener('click', () => { if (mode === 'load' && page > 0) { page--; render(); } });
    get('notebook-next').addEventListener('click', () => { if (mode === 'load') { page++; render(); } });
    compactPages?.addEventListener('change', () => { if (mode === 'load') { page = 0; render(); } });
    document.addEventListener('keydown', event => {
      if (!playing && event.key === 'Escape') { event.preventDefault(); close(); }
    });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveOnExit(); });
    window.addEventListener('pagehide', saveOnExit);
    if (!bloqueado) get('notebook-new').focus();
  }
  return Object.freeze({ iniciar, newGame, openLoad, close, load, saveOnExit, getMode: () => mode });
}
