const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

function setup({ compact = false } = {}) {
  const elements = new Map();
  function element() {
    return { dataset: {}, style: {}, children: [], listeners: {},
      classList: { add() {}, remove() {} },
      addEventListener(name, fn) { this.listeners[name] = fn; },
      appendChild(child) { this.children.push(child); },
      replaceChildren(...children) { this.children = children; },
      setAttribute() {}, focus() {} };
  }
  const document = { ...element(), getElementById(id) {
    if (!elements.has(id)) elements.set(id, element());
    return elements.get(id);
  }, createElement: element };
  const media = { ...element(), matches: compact };
  const window = { ...element(), matchMedia: () => media };
  const phases = [], waits = [];
  let transitioning = false;
  const context = vm.createContext({ document, window });
  for (const file of ['state.js', 'save-system.js', 'title-menu.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../js', file), 'utf8'), context);
  }
  vm.runInContext('const RESET_STATUS = { INATIVO: "inativo" };', context);
  const state = vm.runInContext('criarEstadoJogo()', context);
  const repository = vm.runInContext('criarSaveRepository(null)', context);
  const services = {
    movimentoReduzido: () => false, configurarAnimacoes() {},
    esperarAnimacao: ms => new Promise(resolve => { phases.push(`book:${ms}`); waits.push(resolve); }),
    animarFade: async (_, from, to) => { phases.push(`fade:${from}-${to}`); },
    cancelarTemporizadores: () => phases.push('cancel'),
    restaurarInterface: () => phases.push('reset-ui'),
    iniciarCutscene: (id, done) => { phases.push(id); done(); },
    isCutsceneActive: () => false,
    iniciarConversa: () => phases.push('story'),
    restaurarEstadoJogo(snapshot) {
      phases.push('restore');
      if (snapshot.invalid) throw new Error('Registro incompatível');
      state.inventory = [...snapshot.inventory];
    },
    registrarAutosave() { repository.salvarAutosave({ id: 'autosave', createdAt: 1, saveState: { inventory: [...state.inventory] } }); },
    isSceneTransitioning: () => transitioning,
    criarComposicaoFoto: save => ({ expression: save.photoExpression }),
    obterCenaDaFoto: () => ({ background: 'scene.png' }),
    formatarDataFoto: () => ({ data: '25/09/2026', hora: '10:30' })
  };
  context.game = { state, services, saveRepository: repository, iniciar: () => phases.push('init') };
  const menu = vm.runInContext('criarTelaInicial({ game, document, window })', context);
  menu.iniciar();
  return { menu, state, repository, phases, elements, document, window, media,
    transitioning: value => { transitioning = value; },
    finish: () => waits.shift()(), get: id => document.getElementById(id) };
}
const photo = id => ({ id, name: `Foto ${id}`, createdAt: 1, photoExpression: 'neutral', saveState: { inventory: ['record'] } });

test('capa bloqueia gameplay; vazio abre, ignora cliques duplicados e fecha', async () => {
  const t = setup();
  assert.equal(t.get('app').inert, true);
  assert.equal(t.menu.getMode(), 'menu');
  const opening = t.menu.openLoad();
  await t.menu.newGame();
  assert.deepEqual(t.phases, ['book:700']);
  t.finish(); await opening;
  assert.equal(t.menu.getMode(), 'load');
  assert.equal(t.get('notebook-status').textContent, 'Nenhum registro disponível.');
  assert.equal(t.get('notebook-saves').children.length, 4);
  const closing = t.menu.close();
  assert.equal(t.menu.getMode(), 'closing');
  t.finish(); await closing;
  assert.equal(t.menu.getMode(), 'menu');
  assert.equal(t.get('notebook-open').hidden, true);
});

test('Novo Jogo aguarda abertura e fade, limpa progresso e só então inicia narrativa', async () => {
  const t = setup();
  t.state.inventory.push('old');
  t.state.sceneState.previous = { opened: true };
  t.repository.criarManual(photo('manual'));
  const starting = t.menu.newGame();
  assert.equal(t.state.inventory[0], 'old');
  assert.deepEqual(t.phases, ['book:700']);
  t.finish(); await starting;
  assert.deepEqual(t.phases, ['book:700', 'fade:0-1', 'cancel', 'reset-ui', 'init', 'lulith_codigo', 'fade:1-0', 'story']);
  assert.equal(t.state.inventory.length, 0);
  assert.equal(Object.keys(t.state.sceneState).length, 0);
  assert.equal(t.repository.listarManuais().length, 1);
  assert.equal(t.get('app').inert, false);
  assert.equal(t.get('title-menu').hidden, true);
});

test('páginas apresentam registros reais, paginam e delegam restauração sem iniciar narrativa', async () => {
  const t = setup({ compact: true });
  for (let i = 0; i < 5; i++) t.repository.criarManual(photo(String(i)));
  const opening = t.menu.openLoad(); t.finish(); await opening;
  assert.equal(t.get('notebook-saves').children.length, 2);
  assert.equal(t.get('notebook-page').textContent, '1 / 3');
  const slot = t.get('notebook-saves').children[0];
  assert.equal(slot.children[0].expression, 'neutral');
  assert.equal(slot.children[1].textContent, 'Foto 0');
  assert.equal(slot.children[2].textContent, '25/09/2026 · 10:30');
  t.get('notebook-next').listeners.click();
  assert.equal(t.get('notebook-saves').children[0].dataset.saveId, '2');
  await t.get('notebook-saves').children[0].listeners.click();
  assert.deepEqual(t.state.inventory, ['record']);
  assert.equal(t.phases.includes('restore'), true);
  assert.equal(t.phases.includes('story'), false);
});

test('save inválido mantém caderno utilizável e permite voltar', async () => {
  const t = setup();
  t.repository.criarManual({ ...photo('bad'), saveState: { invalid: true } });
  const opening = t.menu.openLoad(); t.finish(); await opening;
  await t.menu.load('bad');
  assert.equal(t.menu.getMode(), 'load');
  assert.equal(t.get('notebook-status').textContent, 'Registro incompatível');
  assert.equal(t.get('title-menu').hidden, false);
  assert.equal(t.get('app').inert, true);
  const closing = t.menu.close(); t.finish(); await closing;
  assert.equal(t.menu.getMode(), 'menu');
});

test('saída usa autosave existente apenas durante gameplay e preserva fotos manuais', async () => {
  const t = setup();
  t.repository.criarManual(photo('manual'));
  t.menu.saveOnExit(); assert.equal(t.repository.obterAutosave(), null);
  const starting = t.menu.newGame(); t.finish(); await starting;
  const initial = t.repository.obterAutosave();
  t.transitioning(true); t.menu.saveOnExit(); assert.deepEqual(t.repository.obterAutosave(), initial);
  t.transitioning(false);
  t.state.inventory = ['progress'];
  t.document.visibilityState = 'hidden'; t.document.listeners.visibilitychange();
  assert.deepEqual(Array.from(t.repository.obterAutosave().saveState.inventory), ['progress']);
  assert.equal(t.repository.listarManuais()[0].id, 'manual');
});
