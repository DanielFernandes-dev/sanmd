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
    assert.equal(ler('el.objectLayer.children.length'), phone ? 0 : 1);
    assert.equal(ler('obterDestinos().some(x => x.id === "sair_casa")'), talked && bag && phone);
  }
});
