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

  const data = fs.readFileSync(path.join(raiz, "js/data.js"), "utf8");
  const saves = fs.readFileSync(path.join(raiz, "js/save-system.js"), "utf8");
  const game = fs.readFileSync(path.join(raiz, "js/game.js"), "utf8");
  vm.runInContext(`${data}\n${saves}\n${game}`, contexto);

  return { contexto, elementos };
}

function controlarAmbiente() {
  const ambiente = criarAmbiente();
  return {
    ...ambiente,
    executar: (codigo) => vm.runInContext(codigo, ambiente.contexto),
    ler: (expressao) => vm.runInContext(expressao, ambiente.contexto)
  };
}

function rotulosMenu(ler) {
  return JSON.parse(ler('JSON.stringify(Array.from(el.irParaMenu.children).map((botao) => botao.textContent))'));
}

test("início: local beco na cena beco_entrada", () => {
  const { ler } = controlarAmbiente();

  assert.equal(ler("state.localizacao.local"), "beco");
  assert.equal(ler("state.localizacao.cena"), "beco_entrada");
  assert.equal(ler("DATA.cena.id"), "beco_entrada");
  assert.equal(ler("DATA.cena.background"), "assets/cenario/beco/entrada.png");
  assert.equal(ler("el.cenario.src"), "assets/cenario/beco/entrada.png");
});

test("IR PARA navega linearmente entrada <-> interior <-> fundo", () => {
  const { executar, ler } = controlarAmbiente();

  executar('irPara("beco_interior");');
  assert.equal(ler("state.localizacao.cena"), "beco_interior");
  assert.equal(ler("DATA.cena.id"), "beco_interior");
  assert.equal(ler("el.cenario.src"), "assets/cenario/beco/corredor.png");
  assert.equal(ler("JSON.stringify(DATA.cena.destinos)"), '["beco_entrada","beco_fundo"]');

  executar('irPara("beco_entrada");');
  assert.equal(ler("state.localizacao.cena"), "beco_entrada");
  assert.equal(ler("el.cenario.src"), "assets/cenario/beco/entrada.png");

  executar('irPara("beco_interior"); irPara("beco_fundo");');
  assert.equal(ler("state.localizacao.cena"), "beco_fundo");
  assert.equal(ler("DATA.cena.id"), "beco_fundo");
  assert.equal(ler("el.cenario.src"), "assets/cenario/beco/background.png");
  assert.equal(ler("JSON.stringify(DATA.cena.destinos)"), '["beco_interior"]');

  executar('irPara("beco_interior"); irPara("beco_entrada"); irPara("beco_interior");');
  assert.equal(ler("state.localizacao.cena"), "beco_interior");
  assert.equal(ler("DATA.cena.id"), "beco_interior");
});

test("IR PARA não permite salto direto entre entrada e fundo", () => {
  const { executar, ler } = controlarAmbiente();

  executar('irPara("beco_fundo");');
  assert.equal(ler("state.localizacao.cena"), "beco_entrada");

  executar('irPara("beco_interior"); irPara("beco_fundo");');
  assert.equal(ler("state.localizacao.cena"), "beco_fundo");
  executar('irPara("beco_entrada");');
  assert.equal(ler("state.localizacao.cena"), "beco_fundo");
});

test("menu exibe somente os destinos disponíveis da cena atual", () => {
  const { executar, ler } = controlarAmbiente();

  executar("abrirMenuIrPara();");
  assert.deepEqual(rotulosMenu(ler), ["Interior do beco"]);
  assert.equal(ler('el.irParaMenu.classList.contains("oculto")'), false);

  executar("fecharMenuIrPara(); irPara('beco_interior'); abrirMenuIrPara();");
  assert.deepEqual(rotulosMenu(ler), ["Entrada do beco", "Fundo do beco"]);

  executar("fecharMenuIrPara(); irPara('beco_fundo'); abrirMenuIrPara();");
  assert.deepEqual(rotulosMenu(ler), ["Interior do beco"]);
});

test("navegação não altera estado do celular, das mensagens nem do progresso", () => {
  const { executar, ler } = controlarAmbiente();

  executar(`
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

test("irParaLocal (mapa) redefine a cena para a entrada do local", () => {
  const { executar, ler } = controlarAmbiente();

  executar('irPara("beco_interior"); irPara("beco_fundo");');
  executar('irParaLocal("beco");');

  assert.equal(ler("state.localizacao.local"), "beco");
  assert.equal(ler("state.localizacao.cena"), "beco_entrada");
  assert.equal(ler("DATA.cena.id"), "beco_entrada");
  assert.equal(ler("el.cenario.src"), "assets/cenario/beco/entrada.png");
});

test("locais separam local, cena, label, background e destinos", () => {
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

test("Conversar continua funcionando em cada cena do beco", () => {
  const { executar, ler } = controlarAmbiente();

  executar("iniciarConversa();");
  assert.equal(ler('state.dialogo.falas[0].texto.includes("cofre")'), true);

  executar('encerrarConversa(); irPara("beco_interior"); iniciarConversa();');
  assert.equal(ler('state.dialogo.falas[0].autor'), "MJ");
  assert.equal(ler("state.dialogo.falas.length"), 2);

  executar('encerrarConversa(); irPara("beco_fundo"); iniciarConversa();');
  assert.equal(ler('state.dialogo.falas[0].texto.includes("fundo do beco")'), true);
  assert.equal(ler('state.dialogo.falas[0].texto.includes("cofre")'), true);
});

test("Celular continua funcionando depois de navegar entre cenas", () => {
  const { executar, ler } = controlarAmbiente();

  executar('irPara("beco_interior"); irPara("beco_fundo");');
  executar("abrirCelular();");
  assert.equal(ler("state.modo"), "celular");
  assert.equal(ler("state.celular.tela"), "inicio");

  executar("voltarCelular();");
  assert.equal(ler("state.modo"), "livre");
  assert.equal(ler("state.localizacao.cena"), "beco_fundo");
});

test("botão IR PARA segue o padrão de habilitação dos outros controles", () => {
  const { executar, ler } = controlarAmbiente();

  assert.equal(ler("el.btnIrPara.disabled"), false);
  executar("state.modo = 'dialogo'; definirBotoes();");
  assert.equal(ler("el.btnConversar.disabled"), true);
  assert.equal(ler("el.btnIrPara.disabled"), true);
  assert.equal(ler("el.btnCelular.disabled"), true);
  executar("state.modo = 'livre'; definirBotoes();");
  assert.equal(ler("el.btnIrPara.disabled"), false);
});
