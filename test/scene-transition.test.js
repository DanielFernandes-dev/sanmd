const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup(reduced = false) {
  const animations = [];
  const listeners = {};
  const element = () => ({ style: {}, dataset: {}, children: [], src: '',
    classList: { add() {}, remove() {}, contains: () => true },
    replaceChildren(...children) { this.children = children; }, focus() {},
    addEventListener() {} });
  const scene = Object.fromEntries(['transitionOverlay', 'personagem', 'cenario', 'objectLayer',
    'hotspotLayer', 'interactionStatus', 'irParaMenu', 'btnIrPara'].map(k => [k, element()]));
  scene.transitionOverlay.animate = (frames, options) => {
    let finish;
    const finished = new Promise(resolve => { finish = resolve; });
    animations.push({ frames, options, finish });
    return { finished, cancel() {} };
  };
  const document = { createElement: element, addEventListener(type, fn) { listeners[type] = fn; } };
  class Image {
    set src(value) { queueMicrotask(() => value === 'broken' ? this.onerror?.() : this.onload?.()); }
    decode() { return Promise.resolve(); }
  }
  const sandbox = vm.createContext({ console: { error() {} }, setTimeout, clearTimeout });
  for (const file of ['config', 'data', 'state', 'scene-transition', 'scene']) {
    vm.runInContext(fs.readFileSync(`js/${file}.js`, 'utf8'), sandbox);
  }
  const state = vm.runInContext('criarEstadoJogo()', sandbox);
  const services = { definirBotoes() {}, adicionarItem(id) { state.inventory.push(id); return true; },
    registrarAutosave() {} };
  const context = { state, services, document, window: { Image, matchMedia: () => ({ matches: reduced }) },
    el: { scene, bag: { bagDialog: { open: false }, btnBolsa: element() } },
    data: vm.runInContext('DATA', sandbox), items: vm.runInContext('ITEMS', sandbox),
    config: { sceneTransition: { out: 180, in: 220, hold: 0, reduced: 10, assetTimeout: 100 } },
    eventosInteracao: {} };
  Object.assign(services, sandbox.criarSceneTransitionController(context), sandbox.criarSistemaCenas(context));
  services.aplicarCena(services.obterCenaAtual());
  return { services, state, scene, animations, listeners, context };
}
const tick = () => new Promise(resolve => setTimeout(resolve, 5));
async function reveal(env, count) {
  for (let i = 0; i < 100 && env.animations.length === count; i++) await tick();
  assert.equal(env.animations.length, count + 1);
}
async function complete(env, pending) {
  const count = env.animations.length;
  env.animations.at(-1).finish();
  await reveal(env, count);
  env.animations.at(-1).finish();
  return pending;
}

test('troca apenas no escuro, bloqueia concorrência/input e preserva objetos na ida e volta', async () => {
  const env = setup();
  const { services, state, scene, animations, listeners } = env;
  for (const destination of ['beco_interior', 'beco_fundo', 'beco_interior', 'beco_entrada', 'beco_interior', 'beco_fundo']) {
    const old = state.localizacao.cena;
    const pending = services.irPara(destination);
    assert.equal(services.isSceneTransitioning(), true);
    assert.equal(state.localizacao.cena, old);
    assert.equal(services.executarHotspot('safe'), false);
    assert.equal(await services.transitionToScene('beco', destination), false);
    let blocked = 0;
    listeners.click({ preventDefault() { blocked++; }, stopImmediatePropagation() { blocked++; } });
    assert.equal(blocked, 2);
    const count = animations.length;
    animations.at(-1).finish();
    await reveal(env, count);
    assert.equal(state.localizacao.cena, destination);
    assert.equal(animations.at(-1).frames[0].opacity, 1);
    animations.at(-1).finish();
    assert.equal(await pending, true);
    assert.equal(services.isSceneTransitioning(), false);
    assert.equal(scene.transitionOverlay.style.opacity, '0');
    if (destination === 'beco_fundo' && !state.sceneState.beco_fundo?.safeOpened) {
      services.executarHotspot('safe');
      services.executarHotspot('lulith_phone');
    }
  }
  assert.equal(state.sceneState.beco_fundo.safeOpened, true);
  assert.equal(state.sceneState.beco_fundo.lulithPhoneCollected, true);
  assert.ok(state.inventory.includes('lulith_phone'));
  assert.ok(!scene.hotspotLayer.children.some(h => h.dataset.hotspot === 'lulith_phone'));
});

test('mapa genérico, reduced motion e falha de asset deixam o jogo recuperável', async () => {
  const env = setup(true);
  env.context.data.locais.teste = { id: 'teste', cenaInicial: 'sala', cenas: {
    sala: { id: 'sala', background: 'sala.png', initialState: {}, destinos: [], objects: [], hotspots: [] }
  } };
  assert.equal(await complete(env, env.services.irParaLocal('teste')), true);
  assert.equal(env.state.localizacao.cena, 'sala');
  assert.ok(env.animations.every(a => a.options.duration === 10));
  env.context.data.locais.beco.cenas.beco_entrada.background = 'broken';
  const failed = env.services.irParaLocal('beco');
  env.animations.at(-1).finish();
  assert.equal(await failed, false);
  assert.equal(env.state.localizacao.cena, 'sala');
  assert.equal(env.services.isSceneTransitioning(), false);
  assert.equal(env.scene.transitionOverlay.style.opacity, '0');
  assert.equal(await env.services.runSceneTransition(() => { throw Error('loader'); }).then(v => v), false);
});
