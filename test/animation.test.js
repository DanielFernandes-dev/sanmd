const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup(reduced = false) {
  const sandbox = vm.createContext({ setTimeout, clearTimeout });
  vm.runInContext(fs.readFileSync('js/animation.js', 'utf8'), sandbox);
  return sandbox.criarSistemaAnimacoes({ window: { matchMedia: () => ({ matches: reduced }) },
    document: {}, config: {} });
}

test('fade libera recursos mesmo quando a animação falha', async () => {
  const services = setup();
  let cancelled = false;
  const element = { style: {}, animate: () => ({
    finished: Promise.reject(new Error('interrompida')), cancel() { cancelled = true; }
  }) };
  await assert.rejects(services.animarFade(element, 0, 1, 20), /interrompida/);
  assert.equal(cancelled, true);
  assert.equal(element.style.opacity, '1');
});

test('fallback sem Web Animations aplica destino e conclui', async () => {
  const element = { style: {} };
  await setup().animarFade(element, 1, 0, 0);
  assert.equal(element.style.opacity, '0');
});

test('reduced motion elimina espera visual e preserva duração alternativa do fade', () => {
  assert.equal(setup(true).duracaoVisual(280), 0);
  assert.equal(setup(true).duracaoVisual(320, 10), 10);
  assert.equal(setup().duracaoVisual(280), 280);
});

test('registro recusa tipos herdados e coleta propaga recusa do inventário', () => {
  const sandbox = vm.createContext({});
  vm.runInContext(fs.readFileSync('js/mechanics.js', 'utf8'), sandbox);
  const mechanics = sandbox.criarMecanicasHotspot({ services: { adicionarItem: () => false } });
  assert.equal(mechanics.obter('collect')({ itemId: 'invalido' }), false);
  assert.equal(mechanics.obter('examine')({}), true);
  assert.equal(mechanics.obter('toString'), null);
  assert.equal(mechanics.obter('desconhecido'), null);
});

test('fade que não termina é liberado pelo limite de tempo', async () => {
  let cancelled = false;
  await setup().animarFade({ style: {}, animate: () => ({
    finished: new Promise(() => {}), cancel() { cancelled = true; }
  }) }, 0, 1, 0);
  assert.equal(cancelled, true);
});

test('configuração injetada alimenta durações do CSS', () => {
  const sandbox = vm.createContext({ setTimeout, clearTimeout });
  vm.runInContext(fs.readFileSync('js/animation.js', 'utf8'), sandbox);
  const values = {};
  sandbox.criarSistemaAnimacoes({ window: {},
    document: { documentElement: { style: { setProperty(k, v) { values[k] = v; } } } },
    config: { transicaoPersonagemEntrada: 123, transicaoPersonagemSaida: 234,
      transicaoCelular: 345, duracaoFlashFoto: 456, duracaoReset: 567 }
  }).configurarAnimacoes();
  assert.deepEqual(values, { '--duracao-personagem-entrada': '123ms',
    '--duracao-personagem-saida': '234ms', '--duracao-celular': '345ms',
    '--duracao-foto-flash': '456ms', '--duracao-reset': '567ms' });
});
