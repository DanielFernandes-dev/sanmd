const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const source = file => fs.readFileSync(path.join(root, file), 'utf8');

function setup() {
  const scripts = [];
  const document = {
    createElement: () => ({ remove() { this.removed = true; } }),
    head: { appendChild(script) { scripts.push(script); } }
  };
  const context = vm.createContext({ document });
  vm.runInContext(source('js/scene-modules.js'), context);
  const eventosInteracao = Object.create(null);
  const state = { localizacao: { local: 'cena_crime', cena: 'crime_sala' },
    sceneState: { crime_sala: { firstEvidenceExamined: true, lockedEvidenceOpened: true } },
    aparelho: { originalPhoneStatus: 'working', activePhone: 'mj' } };
  const el = { scene: { interactionStatus: { textContent: '' } } };
  const calls = [];
  const services = {
    definirBotoes: () => calls.push('buttons'),
    iniciarFalas: value => calls.push(value),
    abrirBilhete: () => calls.push('note'),
    abrirEstacaoTrabalho: () => calls.push('computer')
  };
  Object.assign(context, { state, el, services, data: { monologos: { crime_sala: { phoneBreak: ['fala'] } } }, eventosInteracao });
  const loader = vm.runInContext('criarSistemaModulosCena({ document, state, el, services, data, eventosInteracao })', context);
  return { scripts, context, state, eventosInteracao, loader, calls };
}

test('eventos exclusivos são carregados uma vez e desativados ao sair do local', async () => {
  const env = setup();
  const first = env.loader.prepararModuloCena('cena_crime');
  assert.equal(env.scripts.length, 1);
  assert.equal(env.scripts[0].src, 'js/scenes/cena-crime/events.js');
  assert.equal(env.loader.prepararModuloCena('cena_crime'), first);
  vm.runInContext(source('js/scenes/cena-crime/events.js'), env.context);
  env.scripts[0].onload();
  await first;
  assert.equal(env.loader.ativarModuloCena('cena_crime'), true);
  env.eventosInteracao.crimeEvidenceExamined({ sceneId: 'crime_sala' });
  assert.equal(env.state.aparelho.originalPhoneStatus, 'broken');
  assert.equal(env.calls[1][0], 'fala');
  env.loader.ativarModuloCena('beco');
  assert.equal(env.eventosInteracao.crimeEvidenceExamined, undefined);
  assert.equal(env.loader.prepararModuloCena('cena_crime'), true);
  assert.equal(env.scripts.length, 1);
});

test('falha de rede libera tentativa para retry sem ativar eventos incompletos', async () => {
  const env = setup();
  const first = env.loader.prepararModuloCena('delegacia');
  env.scripts[0].onerror();
  await assert.rejects(first, /Não foi possível carregar/);
  assert.equal(env.scripts[0].removed, true);
  assert.equal(env.loader.ativarModuloCena('delegacia'), false);
  const retry = env.loader.prepararModuloCena('delegacia');
  assert.equal(env.scripts.length, 2);
  vm.runInContext(source('js/scenes/delegacia/events.js'), env.context);
  env.scripts[1].onload();
  await retry;
  env.loader.ativarModuloCena('delegacia');
  env.eventosInteracao.mjComputerUsed({ sceneId: 'delegacia_mesa_mj' });
  assert.deepEqual(env.calls, ['computer']);
});

test('eventos da casa não permanecem ativos ao entrar na cena do crime', async () => {
  const env = setup();
  const pending = env.loader.prepararModuloCena('casa');
  vm.runInContext(source('js/scenes/casa/events.js'), env.context);
  env.scripts[0].onload();
  await pending;
  env.loader.ativarModuloCena('casa');
  env.eventosInteracao.mjPhoneCollected();
  assert.equal(env.state.aparelho.activePhone, 'mj');
  env.loader.ativarModuloCena('beco');
  assert.equal(env.eventosInteracao.mjPhoneCollected, undefined);
});
