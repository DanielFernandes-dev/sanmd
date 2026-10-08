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
  for (const file of ['config', 'data', 'state', 'animation', 'mechanics', 'scene-transition', 'scene-modules', 'scene']) {
    vm.runInContext(fs.readFileSync(`js/${file}.js`, 'utf8'), sandbox);
  }
  const state = vm.runInContext('criarEstadoJogo()', sandbox);
  const services = { isCutsceneActive: () => false, definirBotoes() {}, adicionarItem(id) { state.inventory.push(id); return true; },
    registrarAutosave() {} };
  const context = { state, services, document, window: { Image, matchMedia: () => ({ matches: reduced }) },
    el: { scene, bag: { bagDialog: { open: false }, btnBolsa: element() } },
    data: vm.runInContext('DATA', sandbox), items: vm.runInContext('ITEMS', sandbox),
    config: { sceneTransition: { out: 180, in: 220, hold: 0, reduced: 10, assetTimeout: 100 } },
    eventosInteracao: {} };
  Object.assign(services, sandbox.criarSistemaAnimacoes(context), sandbox.criarSceneTransitionController(context),
    sandbox.criarSistemaModulosCena(context), sandbox.criarSistemaCenas(context));
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
      await services.executarHotspot('safe');
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

test('cofre mantém sprite, bloqueia cliques e só libera celular após 420 ms', async () => {
  const { services, state, scene } = setup();
  state.localizacao.cena = 'beco_fundo';
  services.aplicarCena(services.obterCenaAtual());
  const sprite = scene.objectLayer.children[0];
  const waits = [];
  services.esperarAnimacao = duration => new Promise(resolve => waits.push({ duration, resolve }));
  const opening = services.executarHotspot('safe');
  assert.equal(services.executarHotspot('safe'), false);
  assert.equal(services.executarHotspot('lulith_phone'), false);
  for (let frame = 1; frame <= 5; frame++) {
    await tick();
    assert.equal(scene.objectLayer.children[0], sprite);
    assert.equal(scene.objectLayer.children.length, 1);
    assert.equal(services.estadoDaCena(services.obterCenaAtual()).safeOpened, false);
    assert.ok(scene.hotspotLayer.children.every(h => h.disabled));
    assert.ok(sprite.src.endsWith(frame < 5 ? `safe_opening_0${frame}.png` : 'safe_open.png'));
    assert.equal(waits[frame - 1].duration, frame < 5 ? 80 : 100);
    waits[frame - 1].resolve();
  }
  assert.equal(await opening, true);
  assert.equal(state.sceneState.beco_fundo.safeOpened, true);
  assert.deepEqual(Object.keys(state.sceneState.beco_fundo).sort(), ['lulithPhoneCollected', 'safeOpened']);
  assert.equal(scene.objectLayer.children[0], sprite);
  assert.equal(scene.objectLayer.children.length, 2);
  assert.equal(scene.hotspotLayer.children[0].dataset.hotspot, 'lulith_phone');
  assert.equal(scene.hotspotLayer.children[0].disabled, false);
  assert.equal(services.executarHotspot('safe'), false);
});

test('Load/troca cancela abertura pendente e estado aberto não repete animação', async () => {
  const { services, state, scene } = setup();
  state.localizacao.cena = 'beco_fundo';
  services.aplicarCena(services.obterCenaAtual());
  let resume;
  services.esperarAnimacao = () => new Promise(resolve => { resume = resolve; });
  const opening = services.executarHotspot('safe');
  await tick();
  services.trocarCenario(services.obterCenaAtual());
  resume();
  assert.equal(await opening, false);
  assert.ok(scene.objectLayer.children[0].src.endsWith('safe_closed.png'));
  assert.equal(services.estadoDaCena(services.obterCenaAtual()).safeOpened, false);
  state.sceneState.beco_fundo = { safeOpened: true, lulithPhoneCollected: false };
  services.trocarCenario(services.obterCenaAtual());
  assert.ok(scene.objectLayer.children[0].src.endsWith('safe_open.png'));
  assert.equal(scene.objectLayer.children.length, 2);
});

test('falha de preload mantém cofre fechado e permite tentar novamente', async () => {
  const { services, state, scene } = setup();
  state.localizacao.cena = 'beco_fundo';
  services.aplicarCena(services.obterCenaAtual());
  const prepare = services.prepareSceneImages;
  services.prepareSceneImages = () => Promise.reject(new Error('offline'));
  assert.equal(await services.executarHotspot('safe'), false);
  assert.ok(scene.objectLayer.children[0].src.endsWith('safe_closed.png'));
  assert.equal(scene.hotspotLayer.children[0].disabled, false);
  services.prepareSceneImages = prepare;
  assert.equal(await services.executarHotspot('safe'), true);
});

test('saída narrativa exige coleta e entrada; conclusão salva antes do título e não repete', () => {
  const { services, state, context } = setup();
  const calls = [], callbacks = [];
  services.cancelarTemporizadores = () => calls.push('cancel');
  services.iniciarCutscene = (id, done) => { calls.push(id); callbacks.push(done); return true; };
  services.registrarAutosave = () => calls.push(`save:${state.act1Complete}`);
  context.eventosInteracao.act1Complete = () => calls.push('menu');
  services.irPara('sair_beco'); assert.equal(calls.length, 0);
  state.sceneState.beco_fundo = { safeOpened: true, lulithPhoneCollected: false };
  services.irPara('sair_beco'); assert.equal(calls.length, 0);
  state.sceneState.beco_fundo.lulithPhoneCollected = true;
  assert.equal(calls.length, 0, 'coleta não inicia a sequência');
  state.localizacao.cena = 'beco_fundo';
  services.irPara('sair_beco'); assert.equal(calls.length, 0);
  state.localizacao.cena = 'beco_entrada';
  assert.ok(services.obterDestinos().some(d => d.id === 'sair_beco'));
  services.irPara('sair_beco');
  assert.equal(state.modo, 'cutscene'); assert.equal(state.act1Complete, false);
  callbacks.shift()();
  assert.deepEqual(calls, ['act1_ending', 'cancel', 'save:true', 'act1_title']);
  callbacks.shift()(); assert.equal(calls.at(-1), 'menu');
  assert.equal(state.modo, 'livre');
  services.irPara('sair_beco'); assert.equal(calls.length, 5);
  assert.ok(!services.obterDestinos().some(d => d.id === 'sair_beco'));
});

test('saída recusada conserva gameplay, timers e progresso', () => {
  const { services, state } = setup();
  state.sceneState.beco_fundo = { safeOpened: true, lulithPhoneCollected: true };
  let cancellations = 0;
  services.cancelarTemporizadores = () => cancellations++;
  services.iniciarCutscene = () => false;
  assert.equal(services.irPara('sair_beco'), false);
  assert.equal(state.modo, 'livre');
  assert.equal(state.act1Complete, false);
  assert.equal(cancellations, 0);
});
test('conclusão repetida não duplica autosave/título e recusa do título devolve menu', () => {
  const { services, state, context } = setup();
  state.sceneState.beco_fundo = { safeOpened: true, lulithPhoneCollected: true };
  let done, saves = 0, titles = 0, menus = 0;
  services.cancelarTemporizadores = () => {};
  services.registrarAutosave = () => { assert.equal(state.act1Complete, true); saves++; };
  services.iniciarCutscene = (id, callback) => {
    if (id === 'act1_ending') { done = callback; return true; }
    titles++; return false;
  };
  context.eventosInteracao.act1Complete = () => menus++;
  services.irPara('sair_beco'); done(); done();
  assert.equal(saves, 1); assert.equal(titles, 1); assert.equal(menus, 1);
  assert.equal(state.modo, 'livre');
});
