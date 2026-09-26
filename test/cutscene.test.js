const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup({ reduced = false, prepare = Promise.resolve() } = {}) {
  const timers = new Map(), listeners = {}, phases = [], cancelled = [];
  let serial = 0, finished = 0, blocked = false;
  const context = vm.createContext({ console, clearTimeout });
  for (const file of ['config', 'data', 'cutscene']) {
    vm.runInContext(fs.readFileSync(`${__dirname}/../js/${file}.js`, 'utf8'), context);
  }
  const config = vm.runInContext('CONFIG', context);
  const sequences = vm.runInContext('CUTSCENES', context);
  const controller = context.criarCutsceneController({
    document: { addEventListener(type, fn) { listeners[type] = fn; } },
    window: { setTimeout(fn, duration) { timers.set(++serial, { fn, duration }); return serial; },
      clearTimeout(id) { if (timers.has(id)) cancelled.push(id); timers.delete(id); } },
    config, sequences,
    services: { movimentoReduzido: () => reduced, prepareSceneImages: () => prepare },
    visual: { iniciar() { blocked = true; }, apresentar(step, duration) { phases.push([step.phase, duration]); },
      finalizar() { blocked = false; finished++; } }
  });
  let completions = 0;
  const start = () => controller.iniciarCutscene('intro_abertura', () => completions++);
  function input(type, timeStamp, extra = {}) {
    const event = { type, timeStamp, button: 0, isPrimary: true,
      preventDefault() { this.prevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...extra };
    listeners[type](event); return event;
  }
  function advance() {
    const [id, timer] = timers.entries().next().value;
    timers.delete(id); timer.fn();
  }
  return { controller, start, input, advance, timers, phases, config, sequences, cancelled,
    get blocked() { return blocked; }, get finished() { return finished; }, get completions() { return completions; } };
}
async function ready() { for (let i = 0; i < 6; i++) await Promise.resolve(); }

test('bloqueia sincronamente, aguarda assets, executa ordem e finaliza uma vez', async () => {
  let resolve;
  const t = setup({ prepare: new Promise(r => { resolve = r; }) });
  t.start(); assert.equal(t.blocked, true); assert.equal(t.phases.length, 0);
  assert.equal(t.start(), false);
  resolve(); await ready();
  while (t.timers.size) t.advance();
  assert.deepEqual(t.phases.map(p => p[0]), ['preto', 'titulo', 'pausa-titulo', 'subtitulo', 'pausa-completa', 'subida', 'preto-final', 'luz']);
  assert.equal(t.phases[0][1], 5000);
  assert.equal(t.finished, 1); assert.equal(t.completions, 1); assert.equal(t.blocked, false);
  t.controller.pularCutscene(); assert.equal(t.finished, 1);
});

for (let phase = 0; phase < 8; phase++) {
  test(`duplo toque pula fase ${phase}, cancela timer e recusa callback obsoleto`, async () => {
    const t = setup(); t.start(); await ready();
    for (let i = 0; i < phase; i++) t.advance();
    const stale = [...t.timers.values()][0].fn;
    t.input('pointerup', 100, { pointerType: 'touch' });
    assert.equal(t.finished, 0);
    t.input('pointerup', 200, { pointerType: 'touch' });
    assert.equal(t.finished, 1); assert.equal(t.completions, 1);
    assert.equal(t.blocked, false); assert.equal(t.timers.size, 0); assert.equal(t.cancelled.length, 1);
    const count = t.phases.length;
    stale(); t.controller.pularCutscene();
    assert.equal(t.phases.length, count); assert.equal(t.finished, 1);
    assert.equal(t.input('click', 201).prevented, true);
    assert.equal(t.input('dblclick', 202).prevented, true);
    assert.equal(t.input('pointerdown', 500).prevented, undefined);
    assert.equal(t.input('click', 510).prevented, undefined);
  });
}

test('clique único, fora da janela e multitoque não pulam; nova dupla pula', async () => {
  const t = setup(); t.start(); await ready();
  t.input('pointerup', 0); t.input('pointerup', 500);
  t.input('pointerup', 510, { isPrimary: false });
  assert.equal(t.finished, 0);
  t.input('pointerup', 600); assert.equal(t.finished, 1);
});

test('skip durante preparo espera asset, não executa fases e termina no mesmo caminho', async () => {
  let resolve;
  const t = setup({ prepare: new Promise(r => { resolve = r; }) });
  t.start(); t.controller.pularCutscene();
  assert.equal(t.controller.isSkipping(), true); assert.equal(t.blocked, true);
  resolve(); await ready();
  assert.equal(t.finished, 1); assert.equal(t.phases.length, 0);
});

test('teclado, toque e gameplay bloqueados; reduced motion mantém narrativa', async () => {
  const t = setup({ reduced: true }); t.start(); await ready();
  for (const type of ['keydown', 'keyup', 'click', 'touchstart', 'touchend', 'submit']) {
    const event = t.input(type, 100);
    assert.equal(event.prevented, true); assert.equal(event.stopped, true);
  }
  while (t.timers.size) t.advance();
  assert.equal(t.phases.length, 8);
  assert.equal(t.phases[1][1], t.config.cutscene.reducedMotion);
  assert.equal(t.phases[4][1], t.config.cutscene.completeTitleHold);
  assert.equal(t.finished, 1);
});

test('teclado volta a ativar menu após skip e cauda de gesto não atravessa fim natural', async () => {
  const t = setup(); t.start(); await ready();
  t.input('pointerdown', 0);
  while (t.timers.size) t.advance();
  assert.equal(t.input('click', 200).prevented, true);
  assert.equal(t.input('keydown', 300).prevented, undefined);
  assert.equal(t.input('click', 301).prevented, undefined);
});

test('apresentação termina áudio e animações, restaura menu e usa dados sem salvar estado', () => {
  const elements = new Map(); let stops = 0, cancellations = 0;
  const document = { getElementById(id) {
    if (!elements.has(id)) elements.set(id, { dataset: {}, style: { setProperty() {} },
      focus() { this.focused = true; }, getAnimations() { return [{ cancel() { cancellations++; } }]; } });
    return elements.get(id);
  } };
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(`${__dirname}/../js/cutscene-view.js`, 'utf8'), context);
  const visual = context.criarVisualAbertura({ document,
    services: { tocarEfeitoTransitorio: () => () => { stops++; } } });
  visual.iniciar({ title: 'SANMD', subtitle: 'Sim, Acredite Nas Mentiras Dele kk', lampAudio: null });
  assert.equal(elements.get('title-menu').inert, true);
  visual.apresentar({ phase: 'luz', sound: true }, 100, false);
  visual.finalizar();
  assert.equal(stops, 1); assert.equal(cancellations, 1);
  assert.equal(elements.get('title-menu').inert, false);
  assert.equal(elements.get('cutscene-overlay').hidden, true);
  assert.equal(elements.get('notebook-new').focused, true);
});
