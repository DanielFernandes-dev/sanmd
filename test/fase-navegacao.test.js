const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class ClassList {
  constructor() {
    this.values = new Set();
  }

  add(...names) {
    names.forEach((name) => this.values.add(name));
  }

  remove(...names) {
    names.forEach((name) => this.values.delete(name));
  }

  contains(name) {
    return this.values.has(name);
  }
}

class Element {
  constructor(id = "") {
    this.id = id;
    this.children = [];
    this.classList = new ClassList();
    this.dataset = {};
    this.disabled = false;
    this.textContent = "";
  }

  addEventListener() {}

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...children) {
    this.children = children;
  }

  focus() {
    this.focused = true;
  }

  get firstElementChild() {
    return this.children[0] ?? null;
  }
}

function criarAmbiente() {
  const raiz = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
  const elementos = new Map(ids.map((id) => [id, new Element(id)]));

  const document = {
    addEventListener() {},
    createElement: () => new Element(),
    getElementById: (id) => elementos.get(id) ?? null
  };

  const contexto = vm.createContext({
    clearInterval() {},
    clearTimeout() {},
    console,
    document,
    requestAnimationFrame: (callback) => callback(),
    setInterval: () => ({}),
    setTimeout: () => ({})
  });

  vm.runInContext(require("./load-game.cjs")(raiz), contexto);
  vm.runInContext(`
    function prepararCelularTeste() {
      if (state.aparelho.activePhone !== null) return;
      state.sceneState.beco_fundo = { safeOpened: true, lulithPhoneCollected: true };
      state.aparelho.activePhone = "lulith";
      state.inventory = state.inventory.filter(id => id !== "lulith_phone");
      definirBotoes();
    }
  `, contexto);

  return { contexto, elementos };
}

function controlarAmbiente() {
  const ambiente = criarAmbiente();
  return {
    ...ambiente,
    executar: (codigo) => require("./load-game.cjs").executar(ambiente.contexto, codigo),
    ler: (expressao) => vm.runInContext(expressao, ambiente.contexto)
  };
}

function rotulosMenu(ler) {
  return JSON.parse(ler('JSON.stringify(Array.from(el.irParaMenu.children).map((botao) => botao.textContent))'));
}

test("início: local beco na cena beco_entrada", async () => {
  const { ler } = controlarAmbiente();

  assert.equal(ler("state.localizacao.local"), "beco");
  assert.equal(ler("state.localizacao.cena"), "beco_entrada");
  assert.equal(ler("DATA.cena.id"), "beco_entrada");
  assert.equal(ler("DATA.cena.background"), "assets/cenario/beco/entrada.png");
  assert.equal(ler("el.cenario.src"), "assets/cenario/beco/entrada.png");
});

test("IR PARA navega linearmente entrada <-> interior <-> fundo", async () => {
  const { executar, ler } = controlarAmbiente();

  await executar('irPara("beco_interior");');
  assert.equal(ler("state.localizacao.cena"), "beco_interior");
  assert.equal(ler("DATA.cena.id"), "beco_interior");
  assert.equal(ler("el.cenario.src"), "assets/cenario/beco/corredor.png");
  assert.equal(ler("JSON.stringify(DATA.cena.destinos)"), '["beco_entrada","beco_fundo"]');

  await executar('irPara("beco_entrada");');
  assert.equal(ler("state.localizacao.cena"), "beco_entrada");
  assert.equal(ler("el.cenario.src"), "assets/cenario/beco/entrada.png");

  await executar('irPara("beco_interior"); irPara("beco_fundo");');
  assert.equal(ler("state.localizacao.cena"), "beco_fundo");
  assert.equal(ler("DATA.cena.id"), "beco_fundo");
  assert.equal(ler("el.cenario.src"), "assets/cenario/beco/background.png");
  assert.equal(ler("JSON.stringify(DATA.cena.destinos)"), '["beco_interior"]');

  await executar('irPara("beco_interior"); irPara("beco_entrada"); irPara("beco_interior");');
  assert.equal(ler("state.localizacao.cena"), "beco_interior");
  assert.equal(ler("DATA.cena.id"), "beco_interior");
});

test("IR PARA não permite salto direto entre entrada e fundo", async () => {
  const { executar, ler } = controlarAmbiente();

  await executar('irPara("beco_fundo");');
  assert.equal(ler("state.localizacao.cena"), "beco_entrada");

  await executar('irPara("beco_interior"); irPara("beco_fundo");');
  assert.equal(ler("state.localizacao.cena"), "beco_fundo");
  await executar('irPara("beco_entrada");');
  assert.equal(ler("state.localizacao.cena"), "beco_fundo");
});

test("menu exibe somente os destinos disponíveis da cena atual", async () => {
  const { executar, ler } = controlarAmbiente();

  executar("abrirMenuIrPara();");
  assert.deepEqual(rotulosMenu(ler), ["Interior do beco"]);
  assert.equal(ler('el.irParaMenu.classList.contains("oculto")'), false);

  await executar("fecharMenuIrPara(); irPara('beco_interior'); abrirMenuIrPara();");
  assert.deepEqual(rotulosMenu(ler), ["Entrada do beco", "Fundo do beco"]);

  await executar("fecharMenuIrPara(); irPara('beco_fundo'); abrirMenuIrPara();");
  assert.deepEqual(rotulosMenu(ler), ["Interior do beco"]);
});

test("navegação não altera estado do celular, das mensagens nem do progresso", async () => {
  const { executar, ler } = controlarAmbiente();

  await executar(`
    state.mensagens.etapa = "antes-reset";
    state.arquivos.vistos.add("candidatos");
    state.celular.resetStatus = RESET_STATUS.AGENDADO;
    irPara("beco_interior");
    irPara("beco_fundo");
    irPara("beco_entrada");
  `);

  assert.equal(ler('state.mensagens.etapa'), "antes-reset");
  assert.equal(ler('state.arquivos.vistos.has("candidatos")'), true);
  assert.equal(ler("state.celular.resetStatus"), "agendado");
  assert.equal(ler("state.mensagens.historico.length"), 0);
});

test("irParaLocal (mapa) redefine a cena para a entrada do local", async () => {
  const { executar, ler } = controlarAmbiente();

  await executar('irPara("beco_interior"); irPara("beco_fundo");');
  await executar('irParaLocal("beco");');

  assert.equal(ler("state.localizacao.local"), "beco");
  assert.equal(ler("state.localizacao.cena"), "beco_entrada");
  assert.equal(ler("DATA.cena.id"), "beco_entrada");
  assert.equal(ler("el.cenario.src"), "assets/cenario/beco/entrada.png");
});

test("locais separam local, cena, label, background e destinos", async () => {
  const { ler } = controlarAmbiente();

  assert.equal(ler("DATA.locais.beco.id"), "beco");
  assert.equal(ler("DATA.locais.beco.cenaInicial"), "beco_entrada");
  assert.equal(ler("JSON.stringify(Object.keys(DATA.locais.beco.cenas))"), '["beco_entrada","beco_interior","beco_fundo"]');

  const valido = ler(`(() => {
    const local = DATA.locais.beco;
    return Object.values(local.cenas).every((cena) =>
      typeof cena.id === "string"
      && typeof cena.label === "string"
      && /^assets\\/cenario\\/beco\\//.test(cena.background)
      && Array.isArray(cena.destinos)
      && cena.destinos.every((destino) => local.cenas[destino])
    );
  })()`);
  assert.equal(valido, true);
});

test("Conversar continua funcionando em cada cena do beco", async () => {
  const { executar, ler } = controlarAmbiente();

  executar("iniciarConversa();");
  assert.equal(ler('state.dialogo.falas[0].texto.includes("cofre")'), true);

  await executar('encerrarConversa(); irPara("beco_interior"); iniciarConversa();');
  assert.equal(ler('state.dialogo.falas[0].autor'), "MJ");
  assert.equal(ler("state.dialogo.falas.length"), 2);

  await executar('encerrarConversa(); irPara("beco_fundo"); iniciarConversa();');
  assert.equal(ler('state.dialogo.falas[0].texto.includes("fundo do beco")'), true);
  assert.equal(ler('state.dialogo.falas[0].texto.includes("cofre")'), true);
});

test("Celular continua funcionando depois de navegar entre cenas", async () => {
  const { executar, ler } = controlarAmbiente();

  await executar('irPara("beco_interior"); irPara("beco_fundo");');
  executar("prepararCelularTeste(); abrirCelular();");
  assert.equal(ler("state.modo"), "celular");
  assert.equal(ler("state.celular.tela"), "inicio");

  executar("voltarCelular();");
  assert.equal(ler("state.modo"), "livre");
  assert.equal(ler("state.localizacao.cena"), "beco_fundo");
});

test("botão IR PARA segue o padrão de habilitação dos outros controles", async () => {
  const { executar, ler } = controlarAmbiente();

  assert.equal(ler("el.btnIrPara.disabled"), false);
  executar("state.modo = 'dialogo'; definirBotoes();");
  assert.equal(ler("el.btnConversar.disabled"), true);
  assert.equal(ler("el.btnIrPara.disabled"), true);
  assert.equal(ler("el.btnCelular.disabled"), true);
  executar("state.modo = 'livre'; definirBotoes();");
  assert.equal(ler("el.btnIrPara.disabled"), false);
});

function entrarCasa(executar) {
  executar(`state.localizacao = { local: 'casa', cena: 'casa_quarto_mj' };
    aplicarCena(obterCenaAtual());`);
}

test('casa: monólogo inicial ocorre uma vez e sala conecta somente os quatro cômodos', async () => {
  const { executar, ler } = controlarAmbiente();
  entrarCasa(executar);
  executar('iniciarIntroCasa();');
  assert.equal(ler('state.modo'), 'dialogo');
  assert.equal(ler('el.namePlate.classList.contains("oculto")'), true);
  assert.equal(ler('el.btnIrPara.disabled'), true);
  executar('encerrarConversa();');
  assert.equal(ler('state.sceneState.casa_quarto_mj.introSeen'), true);
  assert.equal(ler('iniciarIntroCasa()'), false);
  assert.equal(ler('JSON.stringify(obterDestinos().map(x => x.id))'), '["casa_sala"]');
  await executar('irPara("casa_cozinha");');
  assert.equal(ler('state.localizacao.cena'), 'casa_quarto_mj');
  await executar('irPara("casa_sala");');
  assert.equal(ler('JSON.stringify(obterDestinos().map(x => x.id))'),
    '["casa_quarto_mj","casa_cozinha","casa_quarto_james","casa_banheiro"]');
  for (const destination of ['casa_cozinha', 'casa_quarto_james', 'casa_banheiro', 'casa_quarto_mj']) {
    await executar(`irPara("${destination}");`);
    assert.equal(ler('state.localizacao.cena'), destination);
    assert.equal(ler('JSON.stringify(obterDestinos().map(x => x.id))'), '["casa_sala"]');
    await executar('irPara("casa_sala");');
  }
});

test('casa: James habilita coleta, bolsa e telefone persistem e liberam saída', async () => {
  const { executar, ler } = controlarAmbiente();
  entrarCasa(executar);
  executar('state.sceneState.casa_quarto_mj = { introSeen: true, mjBagCollected: false };');
  assert.equal(ler('executarHotspot("mj_bag")'), false);
  await executar('irPara("casa_sala");');
  assert.equal(ler('executarHotspot("mj_phone")'), false);
  assert.equal(ler('irPara("sair_casa")'), false);
  await executar('irPara("casa_cozinha");');
  executar('iniciarConversa();');
  assert.equal(ler('state.dialogo.falas[0].autor'), 'James');
  assert.equal(ler('state.dialogo.falas[0].texto.includes("olheiras")'), true);
  assert.equal(ler('state.modo'), 'dialogo');
  assert.equal(ler('irPara("casa_sala")'), undefined);
  executar('encerrarConversa();');
  assert.equal(ler('state.sceneState.casa_cozinha.jamesIntroConversationComplete'), true);
  executar('iniciarConversa();');
  assert.equal(ler('state.dialogo.falas.length'), 1);
  executar('encerrarConversa();');
  await executar('irPara("casa_sala");');
  await executar('executarHotspot("mj_phone");');
  assert.equal(ler('state.sceneState.casa_sala.mjPhoneCollected'), true);
  assert.equal(ler('state.aparelho.activePhone'), 'mj');
  assert.equal(ler('state.aparelho.originalPhoneStatus'), 'working');
  assert.equal(ler('executarHotspot("mj_phone")'), false);
  assert.equal(ler('podeSairDaCasa()'), false);
  await executar('irPara("casa_quarto_mj");');
  await executar('executarHotspot("mj_bag");');
  assert.equal(ler('state.sceneState.casa_quarto_mj.mjBagCollected'), true);
  assert.equal(ler('state.inventory.length'), 0);
  await executar('irPara("casa_sala");');
  assert.equal(ler('podeSairDaCasa()'), true);
  assert.equal(ler('obterDestinos().some(x => x.id === "sair_casa")'), true);
  const snapshot = ler('capturarEstadoJogo()');
  executar('state.sceneState = {};');
  executar('restaurarEstadoJogo(' + JSON.stringify(snapshot) + ');');
  assert.equal(ler('state.localizacao.cena'), 'casa_sala');
  assert.equal(ler('podeSairDaCasa()'), true);
  assert.equal(ler('el.objectLayer.children.length'), 0);
});

test('casa: load preserva estados parciais sem liberar saída antes dos três requisitos', () => {
  for (const [talked, bag, phone] of [
    [false, false, false], [true, false, false],
    [true, true, false], [true, false, true], [true, true, true]
  ]) {
    const { executar, ler } = controlarAmbiente();
    entrarCasa(executar);
    executar(`state.localizacao.cena = 'casa_sala';
      state.sceneState.casa_quarto_mj = { introSeen: true, mjBagCollected: ${bag} };
      state.sceneState.casa_cozinha = { jamesIntroConversationComplete: ${talked} };
      state.sceneState.casa_sala = { mjPhoneCollected: ${phone} };
      aplicarCena(obterCenaAtual());`);
    const snapshot = ler('capturarEstadoJogo()');
    executar('state.sceneState = {};');
    executar('restaurarEstadoJogo(' + JSON.stringify(snapshot) + ');');
    assert.equal(ler('state.localizacao.local'), 'casa');
    assert.equal(ler('state.localizacao.cena'), 'casa_sala');
    assert.equal(ler('state.sceneState.casa_cozinha.jamesIntroConversationComplete'), talked);
    assert.equal(ler('state.sceneState.casa_quarto_mj.mjBagCollected'), bag);
    assert.equal(ler('state.sceneState.casa_sala.mjPhoneCollected'), phone);
    assert.equal(ler('state.aparelho.activePhone'), phone ? 'mj' : null);
    assert.equal(ler('el.objectLayer.children.length'), phone ? 0 : 1);
    assert.equal(ler('obterDestinos().some(x => x.id === "sair_casa")'), talked && bag && phone);
  }
});

test('cena do crime: saída da casa, retorno e autorização futura da Delegacia', async () => {
  const { executar, ler } = controlarAmbiente();
  entrarCasa(executar);
  executar(`state.localizacao.cena = 'casa_sala';
    state.sceneState.casa_quarto_mj = { introSeen: true, mjBagCollected: true };
    state.sceneState.casa_cozinha = { jamesIntroConversationComplete: true };
    state.sceneState.casa_sala = { mjPhoneCollected: true };
    state.aparelho = { originalPhoneStatus: 'working', activePhone: 'mj', phoneTheme: 'mj' };
    aplicarCena(obterCenaAtual());`);
  await executar('irPara("sair_casa");');
  assert.equal(ler('state.localizacao.local'), 'cena_crime');
  assert.equal(ler('state.localizacao.cena'), 'crime_sala');
  assert.equal(ler('state.modo'), 'dialogo');
  executar('encerrarConversa(); abrirMenuIrPara();');
  assert.deepEqual(rotulosMenu(ler), ['Casa']);
  assert.equal(ler('irPara("ir_delegacia")'), false);
  executar('fecharMenuIrPara();');
  await executar('irPara("voltar_casa");');
  assert.equal(ler('state.localizacao.cena'), 'casa_sala');
  await executar('irPara("sair_casa");');
  assert.equal(ler('state.modo'), 'livre', 'o contexto inicial não se repete');
  assert.equal(ler('state.sceneState.crime_sala.introSeen'), true);
  executar(`state.sceneState.crime_sala.firstEvidenceExamined = true;
    state.sceneState.crime_sala.lockedEvidenceOpened = true;
    state.aparelho.originalPhoneStatus = 'broken'; state.aparelho.activePhone = null;`);
  assert.equal(ler('podeIrDelegacia()'), true);
  assert.equal(ler('obterDestinos().some(x => x.id === "ir_delegacia")'), true);
  executar('abrirMenuIrPara();');
  assert.deepEqual(rotulosMenu(ler), ['Casa', 'Delegacia']);
  await executar('fecharMenuIrPara(); irPara("ir_delegacia");');
  assert.equal(ler('state.localizacao.cena'), 'delegacia_corredor');
});

test('Delegacia e mapa global: bilhete, busca, desbloqueio, viagem e Load', async () => {
  const { executar, ler } = controlarAmbiente();
  executar(`state.localizacao = { local: 'cena_crime', cena: 'crime_sala' };
    state.sceneState.crime_sala = { introSeen: true, firstEvidenceExamined: true,
      investigationItemCollected: true, lockedEvidenceOpened: true };
    state.sceneState.casa_sala = { mjPhoneCollected: true };
    state.aparelho = { originalPhoneStatus: 'broken', activePhone: null, phoneTheme: 'mj' };
    aplicarCena(obterCenaAtual());`);
  await executar('irPara("ir_delegacia"); irPara("delegacia_investigadores"); irPara("delegacia_mesa_mj");');
  assert.equal(ler('state.localizacao.cena'), 'delegacia_mesa_mj');
  assert.equal(ler('executarHotspot("mj_computer")'), true);
  assert.equal(ler('el.mapOverlay.hidden'), true, 'o PC abre a estação, não o mapa');
  assert.equal(ler('el.overlay.hidden'), false);
  assert.equal(ler('state.modo'), 'interface');
  assert.equal(ler('state.sceneState.delegacia_mesa_mj?.computerOn'), true);
  assert.equal(ler('executarHotspot("mj_note")'), false, 'estação modal bloqueia a cena');
  assert.equal(ler('fecharEstacaoTrabalho()'), true);
  assert.equal(ler('state.modo'), 'livre');
  assert.equal(ler('executarHotspot("mj_note")'), true);
  assert.equal(ler('state.sceneState.delegacia_mesa_mj.noteRead'), true);
  assert.equal(ler('el.noteOverlay.hidden'), false);
  assert.equal(ler('executarHotspot("mj_computer")'), false);
  executar('fecharBilhete();');
  assert.equal(ler('executarHotspot("mj_note")'), true);
  await executar('fecharBilhete(); executarHotspot("mj_computer");');
  assert.equal(ler('state.sceneState.delegacia_mesa_mj.computerOn'), true);
  assert.equal(ler('el.overlay.hidden'), false);
  executar('abrirMapaGlobal({ source: "delegacia_computer" });');
  assert.equal(ler('el.overlay.inert'), true);
  assert.equal(ler('el.mapOverlay.hidden'), false);
  assert.equal(ler('el.mapLocations.children.find(x => x.dataset.localId === "delegacia").disabled'), true);
  assert.equal(ler('viajarPeloMapa("delegacia")'), false);
  assert.equal(ler('state.modo'), 'interface');
  assert.equal(ler('irPara("delegacia_investigadores")'), undefined);
  assert.equal(ler('executarHotspot("mj_note")'), false);
  assert.equal(ler('el.mapLocations.children.find(x => x.dataset.localId === "beco").disabled'), true);
  assert.equal(ler('viajarPeloMapa("beco")'), false);
  assert.equal(ler('localizarCoordenadas()'), false);
  executar(`el.mapLatitude.value = DATA.prototypeAlleyCoordinates.latitude; el.mapLongitude.value = '0';`);
  assert.equal(ler('localizarCoordenadas()'), false);
  assert.equal(ler('state.worldMap.availableLocations.beco'), false);
  executar(`el.mapLatitude.value = DATA.prototypeAlleyCoordinates.latitude.toLowerCase();
    el.mapLongitude.value = DATA.prototypeAlleyCoordinates.longitude.toLowerCase();`);
  assert.equal(ler('localizarCoordenadas()'), true);
  assert.equal(ler('state.worldMap.availableLocations.beco'), true);
  assert.equal(ler('saveRepository.obterAutosave().saveState.worldMap.availableLocations.beco'), true);
  assert.equal(ler('el.mapOverlay.hidden'), false);
  assert.equal(ler('localizarCoordenadas()'), true);
  assert.equal(ler('state.localizacao.local'), 'delegacia');
  assert.equal(ler('el.mapLocations.children.find(x => x.dataset.localId === "beco").disabled'), false);
  const snapshot = ler('JSON.stringify(capturarEstadoJogo())');
  executar('fecharMapaGlobal();');
  await ler('viajarPeloMapa("beco")'); // Mapa fechado: nenhuma viagem.
  assert.equal(ler('state.localizacao.local'), 'delegacia');
  executar(`restaurarEstadoJogo(${snapshot});`);
  assert.equal(ler('el.mapOverlay.hidden'), true, 'Load não reabre o painel');
  assert.equal(ler('state.sceneState.delegacia_mesa_mj.noteRead'), true);
  assert.equal(ler('state.sceneState.delegacia_mesa_mj.computerOn'), true);
  executar(`abrirMapaGlobal({source: 'test'});`);
  assert.equal(ler('el.mapLocations.children.find(x => x.dataset.localId === "beco").disabled'), false);
  const trip = ler('viajarPeloMapa("beco")');
  assert.equal(ler('viajarPeloMapa("casa")'), false);
  await trip;
  assert.equal(ler('state.localizacao.local'), 'beco');
  assert.equal(ler('state.localizacao.cena'), 'beco_entrada');
  assert.equal(ler('state.worldMap.availableLocations.beco'), true);
  assert.equal(ler('saveRepository.obterAutosave().saveState.localizacao.local'), 'beco');
  const alleySave = ler('JSON.stringify(capturarEstadoJogo())');
  executar(`restaurarEstadoJogo(${snapshot}); restaurarEstadoJogo(${alleySave});`);
  assert.equal(ler('state.localizacao.local'), 'beco');
  assert.equal(ler('state.worldMap.availableLocations.beco'), true);
  const legacy = JSON.parse(snapshot);
  delete legacy.worldMap;
  executar(`restaurarEstadoJogo(${JSON.stringify(legacy)});`);
  assert.equal(ler('state.worldMap.availableLocations.beco'), false);
  for (const [localId, sceneId] of [['casa', 'casa_quarto_mj'], ['cena_crime', 'crime_sala']]) {
    executar(`restaurarEstadoJogo(${snapshot}); abrirMapaGlobal({source: 'test'});`);
    await ler(`viajarPeloMapa("${localId}")`);
    assert.equal(ler('state.localizacao.local'), localId);
    assert.equal(ler('state.localizacao.cena'), sceneId);
    if (ler('state.modo') === 'dialogo') executar('encerrarConversa();');
  }
});

test('cena do crime: hotspots acompanham o recorte cover em landscape', () => {
  const { executar, ler } = controlarAmbiente();
  executar(`state.localizacao = { local: 'cena_crime', cena: 'crime_sala' };
    el.cenario.clientWidth = 1600; el.cenario.clientHeight = 720;
    aplicarCena(obterCenaAtual());`);
  const keyStyle = ler('el.objectLayer.children.find(x => x.dataset.objectId === "crime_small_key").style');
  const hotspotStyle = ler('el.hotspotLayer.children.find(x => x.dataset.hotspot === "crime_small_key").style');
  assert.match(keyStyle, /left:704px;top:540px;/);
  assert.match(hotspotStyle, /left:680px;top:526\.5px;/);
  executar('el.cenario.clientWidth = 1664; el.cenario.clientHeight = 936; renderizarObjetos();');
  assert.match(ler('el.objectLayer.children.find(x => x.dataset.objectId === "crime_small_key").style'),
    /left:732\.16px;top:655\.2px;/);
});

test('mapa: coordenadas incompletas, formatação e desbloqueio sem autosave duplicado', async () => {
  const { executar, ler } = controlarAmbiente();
  await executar(`state.localizacao = { local: 'delegacia', cena: 'delegacia_mesa_mj' };
    aplicarCena(obterCenaAtual()); executarHotspot('mj_computer');
    abrirMapaGlobal({ source: 'delegacia_computer' });
    globalThis.clock = 100; Date.now = () => ++clock;`);
  for (const field of ['none', 'latitude', 'longitude', 'wrong']) {
    executar(`el.mapLatitude.value = ${field === 'latitude' ? 'DATA.prototypeAlleyCoordinates.latitude' : "''"};
      el.mapLongitude.value = ${field === 'longitude' ? 'DATA.prototypeAlleyCoordinates.longitude' : "''"};`);
    if (field === 'wrong') executar(`el.mapLatitude.value = '0'; el.mapLongitude.value = '0';`);
    assert.equal(ler('localizarCoordenadas()'), false);
    assert.equal(ler('state.worldMap.availableLocations.beco'), false);
    assert.equal(ler('el.mapOverlay.hidden'), false);
  }
  executar(`const format = value => value.toLowerCase().replace(/°/g, 'º').replace(/'/g, '′').replace(/"/g, '″').replace(/ /g, '  ');
    el.mapLatitude.value = format(DATA.prototypeAlleyCoordinates.latitude);
    el.mapLongitude.value = format(DATA.prototypeAlleyCoordinates.longitude);`);
  assert.equal(ler('localizarCoordenadas()'), true);
  const savedAt = ler('saveRepository.obterAutosave().saveState.capturedAt');
  assert.equal(ler('localizarCoordenadas()'), true);
  assert.equal(ler('saveRepository.obterAutosave().saveState.capturedAt'), savedAt);
  assert.match(ler('el.mapLocations.children.find(x => x.dataset.localId === "beco").className'), /available/);
  executar('fecharMapaGlobal();');
  assert.equal(ler('state.modo'), 'interface');
  assert.equal(ler('el.map.focused'), true);
  executar('fecharEstacaoTrabalho();');
  assert.equal(ler('state.modo'), 'livre');
  assert.equal(ler('el.hotspotLayer.children.find(x => x.dataset.hotspot === "mj_computer").focused'), true);
});

test('viagem global valida destino e concorrência independentemente dos botões', async () => {
  const { executar, ler } = controlarAmbiente();
  executar(`state.localizacao = { local: 'delegacia', cena: 'delegacia_mesa_mj' };
    aplicarCena(obterCenaAtual());`);
  for (const id of ['beco', 'delegacia', 'inexistente', '__proto__']) {
    assert.equal(await ler(`travelToWorldLocation('${id}')`), false);
  }
  executar('state.modo = "dialogo";');
  assert.equal(await ler('travelToWorldLocation("casa")'), false);
  executar('state.modo = "livre"; el.bagDialog.open = true;');
  assert.equal(await ler('travelToWorldLocation("casa")'), false);
  executar('el.bagDialog.open = false;');
  const trip = ler('travelToWorldLocation("casa")');
  assert.equal(await ler('travelToWorldLocation("cena_crime")'), false);
  assert.equal(await trip, true);
  assert.equal(ler('state.localizacao.cena'), ler('DATA.locais.casa.cenaInicial'));
});

test('Load antigo migra mapa pela progressão e novas visitas liberam os locais', async () => {
  const { executar, ler } = controlarAmbiente();
  executar(`state.localizacao = { local: 'casa', cena: 'casa_quarto_mj' };
    aplicarCena(obterCenaAtual());
    const antigo = capturarEstadoJogo(); delete antigo.worldMap;
    restaurarEstadoJogo(antigo);`);
  assert.equal(ler('state.worldMap.availableLocations.casa'), true);
  assert.equal(ler('state.worldMap.availableLocations.cena_crime'), false);
  assert.equal(ler('state.worldMap.availableLocations.delegacia'), false);
  assert.equal(ler('state.worldMap.availableLocations.beco'), false);
  executar(`state.sceneState.casa_quarto_mj = { introSeen: true, mjBagCollected: true };
    state.sceneState.casa_cozinha = { jamesIntroConversationComplete: true };
    state.sceneState.casa_sala = { mjPhoneCollected: true };
    state.aparelho = { originalPhoneStatus: 'working', activePhone: 'mj', phoneTheme: 'mj' };`);
  await executar('irPara("casa_sala"); irPara("sair_casa");');
  assert.equal(ler('state.worldMap.availableLocations.cena_crime'), true);
  executar(`encerrarConversa(); state.sceneState.crime_sala.firstEvidenceExamined = true;
    state.sceneState.crime_sala.lockedEvidenceOpened = true;
    state.aparelho.originalPhoneStatus = 'broken'; state.aparelho.activePhone = null;`);
  await executar('irPara("ir_delegacia");');
  assert.equal(ler('state.worldMap.availableLocations.delegacia'), true);
});
