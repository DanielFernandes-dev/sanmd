/**
 * Monta uma instância independente do jogo. As fábricas não iniciam eventos ou timers.
 * @param {Object} options
 * @param {Document} options.document Documento com a interface.
 * @param {Storage|null} [options.storage] Persistência; null mantém saves em memória.
 * @param {Object} [options.data] Catálogo narrativo.
 * @param {Object<string, ItemDefinition>} [options.items] Catálogo de itens.
 * @param {Object} [options.config] Configuração de tempos e limites.
 * @param {Window|Object} [options.window] APIs de áudio e confirmação.
 * @returns {GameInstance}
 */
function criarJogo({ document, storage = null, data = DATA, items = ITEMS,
  config = CONFIG, window = globalThis.window ?? {} }) {
  const state = criarEstadoJogo();
  const el = criarElementos(document);
  const services = {};
  const saveRepository = criarSaveRepository(storage);
  const context = { state, el, services, document, window, data, items, config,
    saveRepository, eventosInteracao: Object.create(null) };
  const systems = {
    persistence: criarSistemaPersistencia(context),
    scene: criarSistemaCenas(context),
    dialogue: criarSistemaDialogos(context),
    phone: criarSistemaCelular(context),
    gallery: criarSistemaGaleria(context),
    bag: criarSistemaBolsa(context),
    interface: criarSistemaInterface(context),
    events: criarSistemaEventos(context)
  };
  for (const system of Object.values(systems)) Object.assign(services, system);
  Object.freeze(services);

  let iniciado = false;
  /** Inicia os componentes uma única vez depois de ligar todas as dependências. */
  function iniciar() {
    if (iniciado) return;
    services.inicializarEventos();
    services.aplicarCena(services.obterCenaAtual());
    services.atualizarCabecalhoMensagens();
    services.renderizarBolsa();
    iniciado = true;
  }

  return Object.freeze({ state, el, services, systems: Object.freeze(systems),
    saveRepository, eventosInteracao: context.eventosInteracao, iniciar });
}
