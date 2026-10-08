const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function environment(count = 0, reduced = false) {
  const timers = new Map(), listeners = new Map();
  let timerId = 0;
  const element = () => ({ hidden: true, children: [], dataset: {},
    classList: { values: new Set(), add(value) { this.values.add(value); }, remove(value) { this.values.delete(value); } },
    setAttribute(name, value) { this[name] = value; },
    appendChild(child) { this.children.push(child); },
    replaceChildren(...children) { this.children = children; }, focus() {}, addEventListener() {} });
  const ui = Object.fromEntries(['overlay', 'map', 'close', 'recentList', 'recentEmpty'].map(key => [key, element()]));
  const document = { hidden: false, getElementById: () => element(), createElement: element,
    addEventListener: (event, handler) => listeners.set(event, handler) };
  const media = { matches: reduced, addEventListener(event, handler) { this.change = handler; } };
  const el = { workstation: ui, worldMap: { mapOverlay: element() },
    bag: { bagDialog: { open: false } }, scene: { hotspotLayer: element() } };
  const state = { modo: 'livre', localizacao: { cena: 'delegacia_mesa_mj' } };
  let activity = Array.from({ length: count }, (_, index) => ({ itemId: String(index), label: `Item ${index}`, status: 'in_bag' }));
  const services = { isSceneTransitioning: () => false, isCutsceneActive: () => false,
    fecharMenuIrPara() {}, definirBotoes() {}, obterAtividadeInventario: () => activity };
  const sandbox = vm.createContext({
    setTimeout(callback, delay) { timers.set(++timerId, { callback, delay }); return timerId; },
    clearTimeout(id) { timers.delete(id); }
  });
  const root = path.resolve(__dirname, '..');
  vm.runInContext(fs.readFileSync(path.join(root, 'js/config.js'), 'utf8'), sandbox);
  vm.runInContext(fs.readFileSync(path.join(root, 'js/workstation.js'), 'utf8'), sandbox);
  const system = sandbox.criarSistemaEstacaoTrabalho({ state, el, document, services,
    window: { matchMedia: () => media }, config: vm.runInContext('CONFIG', sandbox) });
  Object.assign(services, system);
  system.inicializarEstacaoTrabalho();
  system.abrirEstacaoTrabalho();
  const tick = () => {
    assert.equal(timers.size, 1, 'uma única tarefa pendente');
    const [id, task] = timers.entries().next().value;
    timers.delete(id); task.callback();
  };
  return { system, ui, el, document, media, timers, tick, listeners,
    changeActivity: value => { activity = value; } };
}

test('Home: lista vazia e até quatro itens ficam parados e não recebem interação', () => {
  for (const count of [0, 1, 4]) {
    const env = environment(count);
    assert.equal(env.ui.recentEmpty.hidden, count > 0);
    assert.equal(env.ui.recentList.children.length, count);
    assert.equal(env.timers.size, 0);
  }
});

test('Home: excedente desliza uma linha, cancela ao sair e ignora callbacks antigos', () => {
  const env = environment(6);
  assert.equal(env.ui.recentList.children[0].dataset.itemId, '0');
  assert.equal(env.ui.recentList.children[4]['aria-hidden'], 'true');
  env.tick();
  assert.equal(env.ui.recentList.classList.values.has('workstation-recent--moving'), true);
  env.tick();
  assert.equal(env.ui.recentList.children[0].dataset.itemId, '1');
  env.tick();
  const stale = [...env.timers.values()][0].callback;
  env.el.worldMap.mapOverlay.hidden = false;
  env.system.pararAtividadeEstacao();
  assert.equal(env.timers.size, 0);
  stale();
  assert.equal(env.timers.size, 0);
  env.el.worldMap.mapOverlay.hidden = true;
  env.system.atualizarHomeEstacao();
  assert.equal(env.ui.recentList.children[0].dataset.itemId, '0');
  stale();
  assert.equal(env.timers.size, 1);
  env.system.fecharEstacaoTrabalho();
  assert.equal(env.timers.size, 0);
});

test('Home: reduced motion e aba oculta interrompem timers, retorno reconstrói a lista', () => {
  const env = environment(6, true);
  assert.equal(env.timers.size, 0);
  env.media.matches = false;
  env.media.change();
  assert.equal(env.timers.size, 1);
  env.tick();
  env.media.matches = true;
  env.media.change();
  assert.equal(env.timers.size, 0);
  assert.equal(env.ui.recentList.classList.values.has('workstation-recent--moving'), false);
  env.media.matches = false;
  env.media.change();
  env.document.hidden = true;
  env.listeners.get('visibilitychange')();
  assert.equal(env.timers.size, 0);
  env.changeActivity([{ itemId: 'novo', label: 'Novo', status: 'discarded' }]);
  env.document.hidden = false;
  env.listeners.get('visibilitychange')();
  assert.equal(env.ui.recentList.children[0].children[1].textContent, 'DESCARTADO');
  assert.equal(env.timers.size, 0);
});
