const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup(reduced = false, id = 'lulith_codigo') {
  const elements = new Map(), audios = [], animations = [], intervals = new Set();
  const timers = new Map(); let serial = 0;
  const element = () => ({ style: {}, dataset: {}, removeAttribute(key) { delete this[key]; },
    animate(keys, options) { const a = { keys, options, cancelled: false, cancel() { this.cancelled = true; } }; animations.push(a); return a; } });
  const document = { getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); } };
  const window = {
    setTimeout(fn) { timers.set(++serial, fn); return serial; }, clearTimeout(id) { timers.delete(id); },
    setInterval(fn) { intervals.add(fn); return fn; }, clearInterval(fn) { intervals.delete(fn); },
    Audio: class {
      constructor() { this.paused = true; this.volume = 1; audios.push(this); }
      load() { if(this.src) queueMicrotask(() => this.oncanplaythrough?.()); }
      play() { this.paused = false; return Promise.resolve(); }
      pause() { this.paused = true; }
      removeAttribute(key) { delete this[key]; }
    }
  };
  const services = { movimentoReduzido: () => reduced, esperarAnimacao: async () => {},
    animarFade: async (el, from, to) => { el.style.opacity = String(to); } };
  const ctx = vm.createContext({ console, Date });
  for (const file of ['config','data','cutscene-audio','cutscene-frames']) vm.runInContext(fs.readFileSync(`js/${file}.js`, 'utf8'), ctx);
  const config = vm.runInContext('CONFIG', ctx), sequence = vm.runInContext(`CUTSCENES.${id}`, ctx);
  const visual = ctx.criarVisualQuadros({ document, window, config, services });
  return { visual, sequence, config, animations, audios, elements, timers, intervals, window, services,
    createAudio: () => ctx.criarAudioCutscene({ window, services }, config.cutscene.lulithCodigo, sequence.sounds) };
}

for (let index = 0; index < 10; index++) test(`renderer: limpeza completa no quadro ${index + 1}`, async () => {
  const t = setup(); t.visual.iniciar(t.sequence); await t.visual.preparar();
  assert.equal(t.audios.length, 6); assert.equal(t.timers.size, 0);
  for (const step of t.sequence.steps.slice(0, index + 1)) t.visual.apresentar(step, t.config.cutscene.lulithCodigo[step.duration], false);
  assert.equal(t.audios.filter(a => !a.paused).length, t.sequence.steps[index].sfx ? 2 : 1);
  await t.visual.encerrar(); t.visual.finalizar();
  assert.ok(t.animations.every(a => a.cancelled));
  assert.ok(t.audios.every(a => a.paused && !a.src));
  assert.equal(t.intervals.size, 0);
  assert.equal(t.elements.get('frame-cutscene-stage').style.transform, 'none');
  assert.equal(t.elements.get('cutscene-effects').style.opacity, '0');
  assert.equal(t.elements.get('frame-cutscene-overlay').hidden, true);
});
test('reduced motion preserva os 10 quadros sem câmera nem shake', async () => {
  const t = setup(true); t.visual.iniciar(t.sequence); await t.visual.preparar();
  for(const step of t.sequence.steps) t.visual.apresentar(step, t.config.cutscene.lulithCodigo[step.duration], true);
  assert.ok(t.animations.every(a => a.keys.every(k => !k.transform)));
  assert.equal(t.elements.get('cutscene-frame').dataset.frame, 'lulith_codigo_10');
  await t.visual.encerrar(); t.visual.finalizar();
});
test('assets: dez PNGs válidos, paisagem e IDs independentes; SFX WAV locais', () => {
  const t = setup();
  assert.equal(Object.keys(t.sequence.frames).length, 10);
  assert.equal(fs.readdirSync('assets/cenario/quarto-lulith').length, 10);
  for(const file of Object.values(t.sequence.frames)) {
    const b = fs.readFileSync(file); assert.equal(b.subarray(1,4).toString(),'PNG');
    const ratio = b.readUInt32BE(16)/b.readUInt32BE(20); assert.ok(ratio > 1.77 && ratio < 1.81);
  }
  for(const sound of Object.values(t.sequence.sounds)) assert.equal(fs.readFileSync(sound.src).subarray(0,4).toString(),'RIFF');
});

test('falha e timeout de SFX liberam preload e nunca disparam reprodução atrasada', async () => {
  const t = setup(); t.visual.iniciar(t.sequence); const pending = t.visual.preparar();
  const late = t.audios.map(a => a.oncanplaythrough);
  t.audios[0].onerror();
  for(const timeout of [...t.timers.values()]) timeout();
  await pending;
  t.visual.apresentar(t.sequence.steps[1], 1250, false);
  await t.visual.encerrar(); t.visual.finalizar();
  late.forEach(callback => callback());
  assert.ok(t.audios.every(a => a.paused && !a.src));
  assert.equal(t.timers.size, 0);
});
test('suavização curta usa somente o quadro anterior e preserva cortes de impacto', async () => {
  const t = setup(); t.visual.iniciar(t.sequence); await t.visual.preparar();
  t.visual.apresentar(t.sequence.steps[0],1600,false);
  t.visual.apresentar(t.sequence.steps[1],1250,false);
  assert.equal(t.elements.get('cutscene-previous-frame').src,t.sequence.frames.lulith_codigo_01);
  assert.ok(t.animations.some(a=>a.options.duration===100&&!a.cancelled));
  t.visual.apresentar(t.sequence.steps[2],850,false);
  assert.ok(t.animations.filter(a=>a.options.duration===100).every(a=>a.cancelled));
  await t.visual.encerrar();t.visual.finalizar();
});

test('finalizar durante preload descarta imediatamente mídia e timers pendentes', async () => {
  const t = setup(); const audio = t.createAudio();
  const pending = audio.preparar();
  assert.equal(audio.preparar(),pending);
  const late = t.audios.map(a=>a.oncanplaythrough);
  audio.finalizar();
  assert.equal(t.timers.size,0);
  assert.ok(t.audios.every(a=>a.paused&&!a.src));
  late.forEach(fn=>fn()); await pending;
  audio.apresentar('keyboard');
  assert.ok(t.audios.every(a=>a.paused));
});
test('encerramento de áudio é idempotente e não depende de this', async () => {
  const t = setup(); const audio = t.createAudio(); await audio.preparar();
  audio.apresentar('keyboard');
  const { encerrar, finalizar } = audio;
  const first = encerrar(); assert.equal(encerrar(), first);
  await first; finalizar();
  assert.equal(t.intervals.size,0);
  assert.ok(t.audios.every(a=>a.paused&&!a.src));
});
test('falha durante fade de áudio ainda limpa o pool e o intervalo', async () => {
  const t = setup(); const audio = t.createAudio(); await audio.preparar();
  audio.apresentar('keyboard');
  t.services.esperarAnimacao = async () => { throw new Error('fade interrompido'); };
  await assert.rejects(audio.encerrar(),/fade interrompido/);
  assert.equal(t.intervals.size,0);
  assert.ok(t.audios.every(a=>a.paused&&!a.src));
});

for (let index = 0; index < 10; index++) test(`Ato 1: limpa câmera, áudio e imagens no passo ${index + 1}`, async () => {
  const t = setup(false, 'act1_ending'); t.visual.iniciar(t.sequence); await t.visual.preparar();
  for (const step of t.sequence.steps.slice(0, index + 1))
    t.visual.apresentar(step, t.config.cutscene.act1Ending[step.duration], false);
  if (index >= 8) assert.equal(t.elements.get('frame-cutscene-fade').style.opacity, '1');
  await t.visual.encerrar(); t.visual.finalizar();
  assert.ok(t.animations.every(a => a.cancelled));
  assert.ok(t.audios.every(a => a.paused && !a.src));
  assert.equal(t.intervals.size, 0); assert.equal(t.timers.size, 0);
});
test('Ato 1: oito assets paisagem, reduced motion e preto sem src indefinido', async () => {
  const t = setup(true, 'act1_ending'); t.visual.iniciar(t.sequence); await t.visual.preparar();
  for (const file of t.sequence.assets) {
    const b = fs.readFileSync(file); const ratio = b.readUInt32BE(16) / b.readUInt32BE(20);
    assert.ok(ratio > 1.76 && ratio < 1.80);
  }
  for (const step of t.sequence.steps) t.visual.apresentar(step, t.config.cutscene.act1Ending[step.duration], true);
  assert.equal(t.elements.get('cutscene-frame').src, t.sequence.frames.cutscene_act1_08);
  assert.equal(t.elements.get('cutscene-frame').style.visibility, 'hidden');
  assert.equal(t.elements.get('frame-cutscene-title').hidden, true);
  assert.ok(t.animations.every(a => a.keys.every(k => !k.transform)));
  await t.visual.encerrar(); t.visual.finalizar();
});
