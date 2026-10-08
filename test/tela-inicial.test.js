const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const raiz = path.resolve(__dirname, "..");
const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
const planilha = fs.readFileSync(path.join(raiz, "styles.css"), "utf8");

// A capa usa rótulos gravados no PNG; o JavaScript apenas aponta para eles.
// Caixas medidas em assets/interfaces/menu.png (1672x941).
const ARTE = { largura: 1672, altura: 941 };
const ROTULOS = {
  "notebook-new": { x: [728, 1170], y: [541, 611] },
  "notebook-load": { x: [734, 1187], y: [617, 690] }
};
// Miolo do papel medido em assets/interfaces/save-menu.png.
const PAPEL = { x: [0.184, 0.787], y: [0.195, 0.875] };
const FOLGA = 12;

function valorDe(seletores, propriedade) {
  for (const seletor of [seletores].flat()) {
    const bloco = planilha.match(new RegExp(`^\\s*${seletor}\\s*\\{([^}]*)\\}`, "m"));
    if (!bloco) continue;
    const achado = bloco[1].match(new RegExp(`(?:^|;)\\s*${propriedade}\\s*:\\s*([^;]+)`));
    if (achado) return achado[1].trim();
  }
  throw new Error(`${seletores} não declara ${propriedade}`);
}

/** Converte os lados em porcentagem de styles.css para pixels da arte.
 *  Quem declara `top` e `bottom` tem a altura resolvida pelo contêiner. */
function caixa(seletores) {
  const medida = (v, total) => (v.endsWith("%") ? (Number.parseFloat(v) / 100) * total : Number.parseFloat(v));
  const declarar = (propriedade) => {
    try { return valorDe(seletores, propriedade); } catch { return null; }
  };
  const x = medida(declarar("left"), ARTE.largura);
  const topo = declarar("top");
  const base = declarar("bottom");
  const y0 = topo === null ? null : medida(topo, ARTE.altura);
  const y1 = base === null ? null : ARTE.altura - medida(base, ARTE.altura);
  return { x0: x, y0, x1: x + medida(declarar("width"), ARTE.largura),
    y1: y1 ?? y0 + medida(declarar("height"), ARTE.altura) };
}

function pontosDaLombada() {
  const bruto = valorDe("#notebook-cover", "clip-path").match(/polygon\(([^)]+)\)/)[1];
  return bruto.split(",").map((par) => par.trim().split(/\s+/).map((n) => Number.parseFloat(n)));
}

function dentroDaLombada(pontos, px, py) {
  let dentro = false;
  for (let i = 0, j = pontos.length - 1; i < pontos.length; j = i++) {
    const xi = pontos[i][0] / 100 * ARTE.largura;
    const yi = pontos[i][1] / 100 * ARTE.altura;
    const xj = pontos[j][0] / 100 * ARTE.largura;
    const yj = pontos[j][1] / 100 * ARTE.altura;
    if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) dentro = !dentro;
  }
  return dentro;
}

class ClassList {
  constructor() { this.valores = new Set(); }
  add(...nomes) { nomes.forEach((nome) => this.valores.add(nome)); }
  remove(...nomes) { nomes.forEach((nome) => this.valores.delete(nome)); }
  contains(nome) { return this.valores.has(nome); }
}

class Element {
  removeAttribute(name) { delete this.attributes[name]; }
  constructor() {
    this.children = [];
    this.classList = new ClassList();
    this.dataset = {};
    this.attributes = {};
    this.style = { setProperty() {} };
    this.ouvintes = new Map();
    this.disabled = false;
    this.hidden = false;
    this.inert = false;
    this.textContent = "";
    this.value = "";
  }
  addEventListener(tipo, fn) {
    if (!this.ouvintes.has(tipo)) this.ouvintes.set(tipo, []);
    this.ouvintes.get(tipo).push(fn);
  }
  removeEventListener(tipo, fn) {
    this.ouvintes.set(tipo, (this.ouvintes.get(tipo) ?? []).filter((outro) => outro !== fn));
  }
  disparar(tipo, evento = {}) { (this.ouvintes.get(tipo) ?? []).forEach((fn) => fn(evento)); }
  appendChild(filho) { this.children.push(filho); return filho; }
  replaceChildren(...filhos) { this.children = filhos; }
  setAttribute(nome, valor) { this.attributes[nome] = valor; }
  getAttribute(nome) { return this.attributes[nome] ?? null; }
  focus() { this.focado = true; }
  blur() { this.focado = false; }
  animate() { return { cancel() {}, finished: Promise.resolve() }; }
  close() { this.aberto = false; }
  querySelector(seletor) {
    const arquivo = seletor.match(/^\[data-file-id="(.+)"\]$/);
    if (arquivo) return this.children.find((filho) => filho.dataset.fileId === arquivo[1]) ?? null;
    if (seletor === 'button[type="submit"]') { this.submitButton ??= new Element(); return this.submitButton; }
    return null;
  }
  get firstElementChild() { return this.children[0] ?? null; }
}

function criarStorage() {
  const dados = new Map();
  return {
    getItem: (chave) => dados.get(chave) ?? null,
    setItem: (chave, valor) => dados.set(chave, valor),
    dados
  };
}

/** Roda os scripts reais de index.html, inclusive o bootstrap da tela inicial. */
function criarAmbiente({ movimentoReduzido = false } = {}) {
  const storage = criarStorage();
  const declaracoes = [...html.matchAll(/<[^>]*\sid="([^"]+)"[^>]*>/g)];
  const elementos = new Map(declaracoes.map(([tag, id]) => {
    const elemento = new Element();
    elemento.setAttribute("id", id);
    if (/\shidden(\s|>|=)/.test(tag)) elemento.hidden = true;
    if (/\sinert(\s|>|=)/.test(tag)) elemento.inert = true;
    if (/\sdisabled(\s|>|=)/.test(tag)) elemento.disabled = true;
    return [id, elemento];
  }));
  const documento = new Element();
  documento.documentElement = { style: { setProperty() {} } };
  documento.visibilityState = "visible";
  documento.getElementById = (id) => {
    if (!elementos.has(id)) elementos.set(id, new Element());
    return elementos.get(id);
  };
  documento.createElement = () => new Element();
  const reduzido = { matches: movimentoReduzido, addEventListener() {}, removeEventListener() {} };
  const janelaDeTelas = { matches: false, addEventListener() {}, removeEventListener() {} };
  const window = {
    confirm: () => true,
    matchMedia: (consulta) => (consulta.includes("prefers-reduced-motion") ? reduzido : janelaDeTelas),
    setTimeout: (callback) => Promise.resolve().then(callback),
    clearTimeout() {},
    Image: class { set src(valor) { Promise.resolve().then(() => this.onload?.()); } decode() { return Promise.resolve(); } }
  };
  window.addEventListener = (tipo, fn) => { window[tipo] = fn; };
  window.removeEventListener = () => {};
  const contexto = vm.createContext({
    clearInterval() {},
    clearTimeout() {},
    console,
    document: documento,
    localStorage: storage,
    requestAnimationFrame: (callback) => callback(),
    setInterval: () => ({}),
    setTimeout(callback, delay) { return delay === 10000 ? 0 : Promise.resolve().then(callback); },
    window
  });
  const scripts = [...html.matchAll(/<script src="([^"?]+)(?:\?[^"]*)?"><\/script>/g)]
    .flatMap(([, arquivo]) => arquivo === "js/bootstrap.js"
      ? ["js/scenes/casa/events.js", "js/scenes/cena-crime/events.js", "js/scenes/delegacia/events.js", arquivo]
      : [arquivo])
    .map(arquivo => fs.readFileSync(path.join(raiz, arquivo), "utf8"))
    .join("\n");
  vm.runInContext(scripts, contexto);
  vm.runInContext("globalThis.jogo = game; globalThis.menu = titleMenu;", contexto);
  return { contexto, documento, elementos, storage, janela: window };
}

test("o markup publicado expõe tudo que o bootstrap da tela inicial exige", () => {
  const fonte = fs.readFileSync(path.join(raiz, "js/title-menu.js"), "utf8");
  const exigidos = [...fonte.matchAll(/get\('([^']+)'\)/g)].map(([, id]) => id);
  assert.ok(exigidos.length >= 10, "a forma de listar ids mudou");
  for (const id of new Set(exigidos)) {
    assert.ok(html.includes(`id="${id}"`), `index.html precisa declarar id="${id}"`);
  }
  assert.match(html, /<section id="title-menu"[^>]*data-state="menu"/);
  assert.match(html, /<div id="app" inert>/);
  assert.ok(html.indexOf("js/title-menu.js") < html.indexOf("js/bootstrap.js"),
    "a tela inicial precisa ser montada antes do bootstrap");
});

test("cada opção da capa cobre o rótulo gravado em menu.png", () => {
  const pontos = pontosDaLombada();
  for (const [id, rotulo] of Object.entries(ROTULOS)) {
    const area = caixa([`#${id}`, "#notebook-cover button"]);
    assert.ok(area.x0 <= rotulo.x[0] && area.x1 >= rotulo.x[1], `${id} não cobre a largura do rótulo`);
    assert.ok(area.y0 <= rotulo.y[0] && area.y1 >= rotulo.y[1], `${id} não cobre a altura do rótulo`);
    // A lombada gira: nada do rótulo pode ficar de fora do recorte.
    assert.ok(dentroDaLombada(pontos, rotulo.x[0], rotulo.y[0])
      && dentroDaLombada(pontos, rotulo.x[1], rotulo.y[1]), `o clip-path apaga parte de ${id}`);
  }
  // As duas áreas não podem se sobrepor, senão o toque ambíguo.
  const [novo, carregar] = [caixa(["#notebook-new", "#notebook-cover button"]),
    caixa(["#notebook-load", "#notebook-cover button"])];
  assert.ok(novo.y1 <= carregar.y0, "as opções da capa precisam de áreas de toque separadas");
});

test("o painel de registros cabe no miolo do papel de save-menu.png", () => {
  const painel = caixa("#notebook-pages");
  assert.ok(painel.x0 >= PAPEL.x[0] * ARTE.largura - FOLGA, "o painel invade a borda esquerda");
  assert.ok(painel.x1 <= PAPEL.x[1] * ARTE.largura + FOLGA, "o painel invade a borda direita");
  assert.ok(painel.y0 >= PAPEL.y[0] * ARTE.altura - FOLGA, "o painel invade a borda superior");
  assert.ok(painel.y1 <= PAPEL.y[1] * ARTE.altura + FOLGA, "o painel invade a borda inferior");
  // O papel opaco cobre também os registros fictícios impressos na referência.
  const opaco = caixa("#notebook-open::before");
  assert.ok(opaco.x0 <= PAPEL.x[0] * ARTE.largura && opaco.x1 >= PAPEL.x[1] * ARTE.largura,
    "o papel opaco deixa a página direita descoberta");
  assert.ok(opaco.y0 <= PAPEL.y[0] * ARTE.altura && opaco.y1 >= PAPEL.y[1] * ARTE.altura,
    "o papel opaco deixa a página descoberta");
});

test("abrir o app publica a capa fechada e não deixa a narrativa rodar antes", () => {
  const { elementos } = criarAmbiente();
  assert.equal(elementos.get("title-menu").dataset.state, "menu");
  assert.equal(elementos.get("notebook-open").hidden, true, "o caderno nasce fechado");
  assert.equal(elementos.get("app").inert, true, "a cena narrativa espera a escolha");
  assert.equal(elementos.get("notebook-saves").children.length, 0, "a capa não lista registros antes de abrir");
});

test("Novo jogo abre o caderno, faz fade, reinicia o estado e só então chama a cutscene", async () => {
  const { contexto, elementos } = criarAmbiente();
  vm.runInContext("game.state.inventory.push('sobra-da-partida-anterior');"
    + "game.state.sceneState.beco_entrada = { visited: true };", contexto);
  await concluirIntro(contexto);
  await vm.runInContext("menu.newGame()", contexto);

  assert.equal(vm.runInContext("game.state.inventory.length", contexto), 0, "o estado anterior não pode vazar");
  assert.equal(vm.runInContext("Object.keys(game.state.sceneState).length", contexto), 0);
  assert.equal(elementos.get("title-menu").hidden, true, "a tela inicial sai depois do fade");
  assert.equal(elementos.get("app").inert, false, "o jogo retoma o input");
  assert.equal(elementos.get("notebook-stage").hidden, true);
  // game.iniciar() aplicou a cena inicial real do jogo.
  assert.notEqual(elementos.get("cenario").src, "", "a cena inicial precisa estar aplicada");
});

test("Carregar abre a página, usa os registros reais e volta para a capa fechada", async () => {
  const { contexto, elementos, storage } = criarAmbiente();
  storage.setItem("sanmd:saves", JSON.stringify({
    storageVersion: 1,
    manualSaves: [{ id: "foto-1", name: "Beco", createdAt: Date.UTC(2026, 8, 25, 12, 30),
      photoExpression: "sorriso", saveState: { saveVersion: 1, capturedAt: 1 } }],
    autosave: { id: "autosave", createdAt: Date.UTC(2026, 8, 24, 8, 5),
      saveState: { saveVersion: 1, capturedAt: 1, localizacao: { local: "beco", cena: "beco_entrada" } } }
  }));

  await concluirIntro(contexto);
  await vm.runInContext("menu.openLoad()", contexto);
  assert.equal(elementos.get("title-menu").dataset.state, "load");
  const slots = elementos.get("notebook-saves").children;
  assert.equal(slots.length, 4, "a página mostra também os espaços discretos");
  assert.equal(slots[0].dataset.saveId, "autosave");
  assert.equal(slots[1].dataset.saveId, "foto-1");
  assert.equal(slots[1].children[1].textContent, "Beco", "o nome vem do registro real");
  assert.match(slots[1].children[2].textContent, /\d{2}\/\d{2}\/\d{4} · \d{2}:\d{2}/, "data e hora do registro real");
  assert.equal(slots[2].dataset.saveId, undefined, "espaço vazio não é clicável");
  assert.equal(slots[2].getAttribute("aria-hidden"), "true");
  assert.equal(elementos.get("notebook-status").textContent, "");

  await concluirIntro(contexto);
  await vm.runInContext("menu.close()", contexto);
  assert.equal(elementos.get("title-menu").dataset.state, "menu");
  assert.equal(elementos.get("notebook-open").hidden, true, "o caderno fecha de novo");
});

test("Carregar sem registros abre normalmente e avisa discretamente", async () => {
  const { contexto, elementos } = criarAmbiente();
  await concluirIntro(contexto);
  await vm.runInContext("menu.openLoad()", contexto);
  assert.equal(elementos.get("title-menu").dataset.state, "load", "a tela não é bloqueada por estar vazia");
  assert.equal(elementos.get("notebook-status").textContent, "Nenhum registro disponível.");
  assert.equal(elementos.get("notebook-saves").children.length, 4);
  assert.equal(elementos.get("notebook-prev").disabled, true);
  assert.equal(elementos.get("notebook-next").disabled, true);
});

test("a saída reaproveita o autosave existente e não cria nem sobrescreve fotos manuais", async () => {
  const { contexto, storage, elementos, documento } = criarAmbiente();
  const manual = { id: "foto-1", name: "Beco", createdAt: Date.UTC(2026, 8, 25, 12, 30),
    photoExpression: "sorriso", saveState: { saveVersion: 1, capturedAt: 1 } };
  storage.setItem("sanmd:saves", JSON.stringify({
    storageVersion: 1, manualSaves: [manual], autosave: null }));
  await concluirIntro(contexto);
  await vm.runInContext("menu.newGame()", contexto);
  vm.runInContext("game.state.inventory.push('progresso')", contexto);

  const antes = JSON.parse(storage.getItem("sanmd:saves"));
  assert.ok(antes.autosave, "conclusão da cutscene registra o início da partida");
  assert.equal(antes.manualSaves.length, 1, "as fotos manuais ficam intactas");

  documento.visibilityState = "hidden";
  documento.disparar("visibilitychange");
  const depois = JSON.parse(storage.getItem("sanmd:saves"));
  assert.ok(depois.autosave, "a saída precisa gravar no autosave existente");
  assert.deepEqual(Array.from(depois.autosave.saveState.inventory), ["progresso"]);
  assert.deepEqual(depois.manualSaves, [manual], "o autosave não pode tocar nas fotos manuais");
  assert.equal(elementos.get("title-menu").hidden, true);
});

test("movimento reduzido encurta a animação sem pular a etapa visível", async () => {
  const { contexto, elementos } = criarAmbiente({ movimentoReduzido: true });
  await concluirIntro(contexto);
  const abertura = vm.runInContext("menu.openLoad()", contexto);
  assert.equal(elementos.get("title-menu").dataset.state, "opening");
  assert.equal(elementos.get("notebook-open").hidden, false, "o caderno já aparece abrindo");
  await abertura;
  assert.equal(elementos.get("title-menu").dataset.state, "load");
});

async function concluirIntro(contexto) {
  await esperarIluminacao(contexto);
  vm.runInContext('game.services.pularCutscene()', contexto);
}

async function pularAberturaComDuploClique(documento, contexto) {
  for (let i = 0; i < 60 && vm.runInContext("document.getElementById('cutscene-stage').dataset.phase === 'preto'", contexto); i++) {
    await Promise.resolve();
  }
  const gesto = tipo => {
    const evento = { type: tipo, timeStamp: tipo === 'pointerup' ? gesto.tempo += 100 : gesto.tempo,
      button: 0, isPrimary: true,
      preventDefault() { this.prevented = true; },
      stopImmediatePropagation() { this.stopped = true; } };
    documento.disparar(tipo, evento);
    return evento;
  };
  gesto.tempo = 0;
  assert.equal(gesto('pointerup').prevented, true);
  assert.equal(vm.runInContext('game.services.isCutsceneActive()', contexto), true);
  assert.equal(gesto('pointerup').prevented, true);
  assert.equal(gesto('click').prevented, true, 'o clique de saída pertence à cutscene');
  await Promise.resolve();
  assert.equal(vm.runInContext('game.services.isCutsceneActive()', contexto), false);
  assert.equal(gesto('click').prevented, undefined, 'o menu recebe o próximo clique');
}

test('após Skip por duplo clique, um clique em Carregar abre o caderno', async () => {
  const { contexto, documento, elementos } = criarAmbiente();
  await pularAberturaComDuploClique(documento, contexto);
  elementos.get('notebook-load').disparar('click');
  for (let i = 0; i < 100 && elementos.get('title-menu').dataset.state !== 'load'; i++) await Promise.resolve();
  assert.equal(elementos.get('title-menu').dataset.state, 'load');
});

test('após Skip por duplo clique, um clique em Novo jogo inicia a partida', async () => {
  const { contexto, documento, elementos } = criarAmbiente();
  await pularAberturaComDuploClique(documento, contexto);
  elementos.get('notebook-new').disparar('click');
  for (let i = 0; i < 100 && elementos.get('title-menu').hidden === false; i++) await Promise.resolve();
  assert.equal(elementos.get('title-menu').hidden, true);
  assert.equal(vm.runInContext('game.state.modo', contexto), 'dialogo');
});

for (const skip of [false, true]) {
  test(`novo jogo mostra MJ após Cutscene 02, skip=${skip}`, async () => {
    const { contexto, elementos } = criarAmbiente();
    await concluirIntro(contexto);
    const started = vm.runInContext('menu.newGame()', contexto);
    if (skip) {
      for (let i = 0; i < 100 && !vm.runInContext('game.services.isCutsceneActive()', contexto); i++) {
        await Promise.resolve();
      }
      assert.equal(vm.runInContext('game.services.isCutsceneActive()', contexto), true);
      vm.runInContext('game.services.pularCutscene()', contexto);
    }
    await started;
    assert.equal(vm.runInContext('game.state.localizacao.cena', contexto), 'casa_quarto_mj');
    assert.equal(vm.runInContext('game.state.modo', contexto), 'dialogo');
    assert.equal(elementos.get('personagem').dataset.characterId, 'mj');
    assert.equal(elementos.get('personagem').classList.contains('oculto'), false);
    assert.equal(elementos.get('dialogue-box').classList.contains('oculto'), false);
  });
}

/** Aguarda o relógio visual do harness até a finalização natural. */
async function esperarIluminacao(contexto) {
  for (let i = 0; i < 60 && vm.runInContext('game.services.isCutsceneActive()', contexto); i++) {
    await Promise.resolve();
  }
}

test('intro precede controle do menu e snapshot ignora apresentação', async () => {
  const { contexto, elementos } = criarAmbiente();
  assert.equal(elementos.get('title-menu').inert, true);
  assert.equal(elementos.get('cutscene-overlay').hidden, false);
  await vm.runInContext('menu.newGame(); menu.openLoad();', contexto);
  assert.equal(elementos.get('title-menu').dataset.state, 'menu');
  const before = vm.runInContext('JSON.stringify(game.services.capturarEstadoJogo())', contexto);
  await concluirIntro(contexto);
  assert.equal(elementos.get('title-menu').inert, false);
  assert.equal(elementos.get('cutscene-overlay').hidden, true);
  const after = vm.runInContext('JSON.stringify(game.services.capturarEstadoJogo())', contexto);
  const normalize = value => { const data = JSON.parse(value); delete data.capturedAt; return data; };
  assert.deepEqual(normalize(before), normalize(after));
  assert.doesNotMatch(after, /cutscene|intro_abertura|skipDoubleInput|pausa-siglas/);
});

test('iluminação concluída libera Carregar com um clique sem Skip adicional', async () => {
  const { contexto, elementos } = criarAmbiente();
  await esperarIluminacao(contexto);
  assert.equal(elementos.get('cutscene-stage').dataset.phase, 'fim');
  assert.equal(elementos.get('title-menu').inert, false);
  assert.equal(elementos.get('cutscene-overlay').hidden, true);
  elementos.get('notebook-load').disparar('click');
  for (let i = 0; i < 100 && elementos.get('title-menu').dataset.state !== 'load'; i++) await Promise.resolve();
  assert.equal(elementos.get('title-menu').dataset.state, 'load');
});

test('iluminação concluída libera Novo jogo com um clique sem Skip adicional', async () => {
  const { contexto, elementos } = criarAmbiente();
  await esperarIluminacao(contexto);
  elementos.get('notebook-new').disparar('click');
  for (let i = 0; i < 100 && elementos.get('title-menu').hidden === false; i++) await Promise.resolve();
  assert.equal(elementos.get('title-menu').hidden, true);
  assert.equal(vm.runInContext('game.state.modo', contexto), 'dialogo');
});
