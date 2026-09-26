const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const raiz = path.resolve(__dirname, '..');
const FASES = ['preto', 'siglas', 'pausa-siglas', 'significado', 'risada',
  'pausa-completa', 'subida', 'preto-final', 'luz'];

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
  function esvaziar() { while (timers.size) advance(); }
  return { controller, start, input, advance, esvaziar, timers, phases, config, sequences, cancelled,
    get blocked() { return blocked; }, get finished() { return finished; }, get completions() { return completions; } };
}
async function ready() { for (let i = 0; i < 6; i++) await Promise.resolve(); }

test('bloqueia sincronamente, aguarda assets, executa ordem e finaliza uma vez', async () => {
  let resolve;
  const t = setup({ prepare: new Promise(r => { resolve = r; }) });
  t.start(); assert.equal(t.blocked, true); assert.equal(t.phases.length, 0);
  assert.equal(t.start(), false);
  resolve(); await ready();
  for (let i = 0; i < FASES.length - 1; i++) t.advance();
  assert.deepEqual(t.phases.map(p => p[0]), FASES);
  assert.equal(t.phases[0][1], 5000);
  assert.equal(t.phases[1][1], t.config.cutscene.titleReveal);
  assert.equal(t.phases[3][1], t.config.cutscene.titleExpansion);
  assert.equal(t.phases[4][1], t.config.cutscene.laughReveal);
  assert.equal(t.phases[8][1], t.config.cutscene.lampReveal);
  t.advance();
  assert.equal(t.finished, 1); assert.equal(t.completions, 1); assert.equal(t.blocked, false);
  t.controller.pularCutscene(); assert.equal(t.finished, 1);
});

for (let phase = 0; phase < FASES.length; phase++) {
  test(`duplo toque pula fase ${phase}, cancela timer e recusa callback obsoleto`, async () => {
    const t = setup(); t.start(); await ready();
    for (let i = 0; i < phase; i++) t.advance();
    const stale = [...t.timers.values()][0].fn;
    t.input('pointerup', 100, { pointerType: 'touch' });
    assert.equal(t.finished, 0);
    t.input('pointerup', 200, { pointerType: 'touch' });
    assert.equal(t.finished, 1); assert.equal(t.completions, 1);
    assert.equal(t.blocked, false); assert.equal(t.timers.size, 0);
    assert.equal(t.cancelled.length, 1);
    const count = t.phases.length;
    stale?.(); t.controller.pularCutscene();
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
  t.esvaziar();
  assert.equal(t.phases.length, 9);
  assert.equal(t.phases[1][1], t.config.cutscene.reducedMotion);
  assert.equal(t.phases[5][1], t.config.cutscene.completeTitleHold);
  assert.equal(t.phases[4][1], t.config.cutscene.reducedMotion, 'a risada também é narrativa');

  assert.equal(t.finished, 1);
});

test('cauda do gesto não atravessa o fim da espera e o teclado volta a ativar o menu', async () => {
  const t = setup(); t.start(); await ready();
  t.input('pointerdown', 0);
  t.esvaziar();
  assert.equal(t.controller.isCutsceneActive(), false);
  assert.equal(t.finished, 1);
  assert.equal(t.input('click', 210).prevented, true);
  assert.equal(t.input('keydown', 300).prevented, undefined);
  assert.equal(t.input('click', 301).prevented, undefined);
});

function viewSetup() {
  const elements = new Map(); let plays = 0, stops = 0, cancellations = 0;
  const element = () => ({ dataset: {}, style: { setProperty(k, v) { this[k] = v; } },
    children: [], offsetWidth: 20, appendChild(child) { this.children.push(child); },
    replaceChildren(...children) { this.children = children; }, focus() { this.focused = true; },
    animate() { return { cancel() { cancellations++; } }; } });
  const document = { createElement: element, getElementById(id) {
    if (!elements.has(id)) elements.set(id, element()); return elements.get(id);
  } };
  const context = vm.createContext({});
  for (const file of ['config', 'data', 'cutscene-view']) vm.runInContext(fs.readFileSync(path.join(raiz, `js/${file}.js`), 'utf8'), context);
  const data = vm.runInContext('CUTSCENES.intro_abertura', context);
  const visual = context.criarVisualAbertura({ document, config: vm.runInContext('CONFIG', context),
    services: { tocarEfeitoTransitorio() { plays++; return () => stops++; } } });
  visual.iniciar(data);
  return { visual, elements, get plays() { return plays; }, get stops() { return stops; }, get cancellations() { return cancellations; } };
}

test('um único título preserva as iniciais durante expansão e kk só entra depois', () => {
  const t = viewSetup(), title = t.elements.get('cutscene-title');
  const initials = title.children.slice(0, 5).map(word => word.children[0]);
  assert.deepEqual(initials.map(node => node.textContent), ['S', 'A', 'N', 'M', 'D']);
  t.visual.apresentar({ phase: 'significado' }, 2000, false);
  assert.deepEqual(title.children.slice(0, 5).map(word => word.children[0]), initials);
  assert.equal(title.children[5].style.clipPath, 'inset(0 100% 0 0)');
  assert.equal(title.children.slice(0, 5).map(word => word.children.map(node => node.textContent).join('')).join('').replaceAll('\u00a0', ' '), 'Sim, Acredite Nas Mentiras Dele');
  t.visual.apresentar({ phase: 'risada' }, 450, false);
  assert.equal(title.children[5].textContent, '\u00a0kk');
  assert.equal(title.children[5].style.clipPath, 'inset(0 -0.15em 0 0)');
  t.visual.finalizar();
  assert.ok(t.cancellations > 0);
  assert.equal(t.elements.get('title-menu').inert, false);
  assert.equal(t.elements.get('cutscene-overlay').hidden, true);
});

test('skip antes do som nunca toca; fase luz toca uma vez e finalizar interrompe', () => {
  const early = viewSetup(); early.visual.finalizar(); assert.equal(early.plays, 0);
  const t = viewSetup();
  t.visual.apresentar({ phase: 'luz', sound: true }, 1100, false);
  assert.equal(t.plays, 1);
  assert.equal(t.elements.get('cutscene-stage').style['--cutscene-lamp-delay'], '70ms');
  t.visual.finalizar(); assert.equal(t.stops, 1); assert.equal(t.plays, 1);
});

test('o som da lâmpada é um WAV mono curto e o dado aponta para o arquivo', () => {
  const data = vm.runInNewContext(`${fs.readFileSync(path.join(raiz, 'js/data.js'), 'utf8')}\nCUTSCENES`);
  const intro = data.intro_abertura;
  assert.equal(intro.lampAudio, 'assets/audio/lampada.wav');
  const arquivo = path.join(raiz, intro.lampAudio);
  const buffer = fs.readFileSync(arquivo);
  assert.equal(buffer.subarray(0, 4).toString('ascii'), 'RIFF');
  assert.equal(buffer.subarray(8, 12).toString('ascii'), 'WAVE');
  const canais = buffer.readUInt16LE(22), taxa = buffer.readUInt32LE(24);
  const quadros = buffer.readUInt32LE(40);
  assert.equal(canais, 1, 'o arquivo é mono');
  assert.equal(taxa, 22050);
  const duracao = quadros / (taxa * 2);
  assert.ok(duracao > 0.3 && duracao < 0.5, `duração curta de fato: ${duracao}s`);
  assert.ok(fs.statSync(arquivo).size < 200 * 1024, 'asset leve o bastante para a abertura');
});

test('rejeição de autoplay e áudio indisponível não escapam do serviço; cancelamento pausa', async () => {
  const context = vm.createContext({});
  vm.runInContext(fs.readFileSync(path.join(raiz, 'js/dialogue.js'), 'utf8'), context);
  let plays = 0, pauses = 0;
  const system = context.criarSistemaDialogos({ window: { Audio: class {
    play() { plays++; return Promise.reject(new Error('NotAllowedError')); }
    pause() { pauses++; } removeAttribute() {} load() {}
  } } });
  const stop = system.tocarEfeitoTransitorio('assets/audio/lampada.wav');
  await Promise.resolve(); stop();
  assert.equal(plays, 1); assert.equal(pauses, 1);
  const unavailable = context.criarSistemaDialogos({ window: { Audio: class { constructor() { throw Error('indisponível'); } } } });
  assert.doesNotThrow(() => unavailable.tocarEfeitoTransitorio('missing.wav')());
});
