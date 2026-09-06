const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

class ClassList {
  constructor() {
    this.values = new Set();
  }

  add(...nomes) {
    nomes.forEach((nome) => this.values.add(nome));
  }

  remove(...nomes) {
    nomes.forEach((nome) => this.values.delete(nome));
  }

  contains(nome) {
    return this.values.has(nome);
  }
}

class Element {
  constructor(id = "") {
    this.id = id;
    this.children = [];
    this.classList = new ClassList();
    this.dataset = {};
    this.attributes = {};
    this.disabled = false;
    this.textContent = "";
    this.value = "";
    this.hidden = false;
    this.open = false;
    this.listeners = new Map();
  }

  get className() {
    return [...this.classList.values].join(" ");
  }

  set className(valor) {
    this.classList = new ClassList();
    (valor || "").split(/\s+/).filter(Boolean).forEach((nome) => this.classList.add(nome));
  }

  addEventListener(event, fn) {
    if (!this.listeners.has(event)) this.listeners.set(event, []);
    this.listeners.get(event).push(fn);
  }

  dispatchEvent(event) {
    const list = this.listeners.get(event.type || event);
    if (list) list.forEach((fn) => fn(event));
  }

  click() {
    this.dispatchEvent({ type: "click" });
  }

  appendChild(filho) {
    this.children.push(filho);
    return filho;
  }

  replaceChildren(...filhos) {
    this.children = filhos;
  }

  setAttribute(nome, valor) {
    this.attributes[nome] = valor;
  }

  getAttribute(nome) {
    return this.attributes[nome] ?? null;
  }

  focus() {
    this.focused = true;
  }

  showModal() {
    this.open = true;
  }

  close() {
    this.open = false;
    this.dispatchEvent({ type: "close" });
  }

  querySelector(seletor) {
    const arquivo = seletor.match(/^\[data-file-id="(.+)"\]$/);
    if (arquivo) return this.children.find((filho) => filho.dataset.fileId === arquivo[1]) ?? null;
    if (seletor === 'button[type="submit"]') {
      this.submitButton ??= new Element();
      return this.submitButton;
    }
    return null;
  }

  get firstElementChild() {
    return this.children[0] ?? null;
  }
}

function criarStorage() {
  const dados = new Map();
  return {
    getItem: (chave) => dados.get(chave) ?? null,
    setItem: (chave, valor) => dados.set(chave, valor),
    dados
  };
}

function criarAmbiente(storage = criarStorage()) {
  const raiz = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
  const elementos = new Map(ids.map((id) => [id, new Element(id)]));
  const timeouts = [];
  const window = { confirm: () => true };

  const contexto = vm.createContext({
    clearInterval() {},
    clearTimeout(timer) {
      if (timer) timer.cancelado = true;
    },
    console,
    document: {
      addEventListener() {},
      createElement: () => new Element(),
      getElementById: (id) => elementos.get(id) ?? null
    },
    localStorage: storage,
    requestAnimationFrame: (callback) => callback(),
    setInterval: () => ({}),
    setTimeout(callback, delay) {
      const timer = { callback, delay, cancelado: false };
      timeouts.push(timer);
      return timer;
    },
    window
  });

  const data = fs.readFileSync(path.join(raiz, "js/data.js"), "utf8");
  const saves = fs.readFileSync(path.join(raiz, "js/save-system.js"), "utf8");
  const game = fs.readFileSync(path.join(raiz, "js/game.js"), "utf8");
  vm.runInContext(`${data}\n${saves}\n${game}`, contexto);

  return {
    elementos,
    executar: (codigo) => vm.runInContext(codigo, contexto),
    ler: (expressao) => vm.runInContext(expressao, contexto),
    storage,
    timeouts,
    window
  };
}

test("Bolsa vazia: exibe estado vazio elegante e oculta a barra de busca", () => {
  const a = criarAmbiente();
  assert.equal(a.ler("state.inventory.length"), 0);
  assert.equal(a.ler("el.bagEmpty.hidden"), false);
  assert.equal(a.ler("el.bagSearchWrapper.hidden"), true);
  assert.equal(a.ler("el.bagBody.hidden"), true);
  assert.equal(a.ler("el.bagNoResults.hidden"), true);
  assert.equal(a.ler("state.bolsa.itemSelecionadoId"), null);
});

test("TESTE — 1 ITEM: celular no primeiro slot, 8 slots vazios, detalhes exibidos e sem página 2", () => {
  const a = criarAmbiente();
  a.executar('adicionarItem("lulith_phone");');
  assert.equal(a.ler("state.inventory.length"), 1);
  assert.equal(a.ler("el.bagEmpty.hidden"), true);
  assert.equal(a.ler("el.bagBody.hidden"), false);
  assert.equal(a.ler("el.bagSearchWrapper.hidden"), false);

  // Grade possui exatamente 9 slots
  assert.equal(a.ler("el.bagGrid.children.length"), 9);
  // Primeiro slot é botão com o celular
  const slot1 = a.ler("el.bagGrid.children[0]");
  assert.equal(slot1.dataset.itemId, "lulith_phone");
  assert.equal(slot1.classList.contains("bag-slot--selected"), true);
  assert.equal(slot1.children[1].textContent, "Celular");
  // Os outros 8 slots são vazios
  for (let i = 1; i < 9; i++) {
    const slotVazio = a.ler(`el.bagGrid.children[${i}]`);
    assert.equal(slotVazio.classList.contains("bag-slot--empty"), true);
  }

  // Detalhes exibidos
  assert.equal(a.ler("el.bagDetails.children[0].textContent"), "Celular de Lulith");
  // Imagem maior
  assert.equal(a.ler("el.bagDetails.children[1].children[0].src"), "assets/cenario/beco/objects/lulith_phone_item.png");
  // FUNÇÃO
  assert.equal(a.ler("el.bagDetails.children[2].children[0].textContent"), "FUNÇÃO");
  assert.equal(a.ler("el.bagDetails.children[2].children[1].textContent"), "Pode conter informações importantes sobre Lulith.");
  // DESCRIÇÃO
  assert.equal(a.ler("el.bagDetails.children[3].children[0].textContent"), "DESCRIÇÃO");
  assert.equal(a.ler("el.bagDetails.children[3].children[1].textContent"), "Celular encontrado no cofre do fundo do beco.");

  // Sem página 2 (paginação oculta)
  assert.equal(a.ler("el.bagPagination.hidden"), true);
});

test("TESTE — 9 ITENS: grade 3x3 completa, exatamente 1 página, sem página 2", () => {
  const a = criarAmbiente();
  for (let i = 1; i <= 8; i++) {
    a.executar(`ITEMS["item_${i}"] = { id: "item_${i}", label: "Item ${i}", shortLabel: "I${i}", description: "Desc ${i}", purpose: "Fun ${i}", asset: "" };`);
    a.executar(`adicionarItem("item_${i}");`);
  }
  a.executar('adicionarItem("lulith_phone");');
  assert.equal(a.ler("state.inventory.length"), 9);
  assert.equal(a.ler("el.bagGrid.children.length"), 9);
  for (let i = 0; i < 9; i++) {
    const slot = a.ler(`el.bagGrid.children[${i}]`);
    assert.equal(slot.classList.contains("bag-slot--filled"), true);
    assert.equal(slot.classList.contains("bag-slot--empty"), false);
  }
  assert.equal(a.ler("el.bagPagination.hidden"), true);
});

test("TESTE — 10 ITENS: 2 páginas automáticas, navegação 1 <-> 2 funcional", () => {
  const a = criarAmbiente();
  for (let i = 1; i <= 9; i++) {
    a.executar(`ITEMS["item_${i}"] = { id: "item_${i}", label: "Item ${i}", shortLabel: "I${i}", description: "Desc ${i}", purpose: "Fun ${i}", asset: "" };`);
    a.executar(`adicionarItem("item_${i}");`);
  }
  a.executar('adicionarItem("lulith_phone");');
  assert.equal(a.ler("state.inventory.length"), 10);

  // Paginação visível
  assert.equal(a.ler("el.bagPagination.hidden"), false);
  assert.equal(a.ler("state.bolsa.pagina"), 1);

  // Página 1: 9 preenchidos
  assert.equal(a.ler("el.bagGrid.children[0].dataset.itemId"), "item_1");
  assert.equal(a.ler("el.bagGrid.children[8].dataset.itemId"), "item_9");

  // Ir para página 2
  a.executar("state.bolsa.pagina = 2; renderizarBolsa();");
  assert.equal(a.ler("state.bolsa.pagina"), 2);
  // Página 2: 1 preenchido (lulith_phone), 8 vazios
  assert.equal(a.ler("el.bagGrid.children[0].dataset.itemId"), "lulith_phone");
  for (let i = 1; i < 9; i++) {
    assert.equal(a.ler(`el.bagGrid.children[${i}].classList.contains("bag-slot--empty")`), true);
  }
  // Auto-selecionou o primeiro item da página 2
  assert.equal(a.ler("state.bolsa.itemSelecionadoId"), "lulith_phone");
  assert.equal(a.ler("el.bagDetails.children[0].textContent"), "Celular de Lulith");

  // Voltar para página 1
  a.executar("state.bolsa.pagina = 1; renderizarBolsa();");
  assert.equal(a.ler("el.bagGrid.children[0].dataset.itemId"), "item_1");
  assert.equal(a.ler("state.bolsa.itemSelecionadoId"), "item_1");
});

test("TESTE — 18 ITENS: duas páginas completas 3x3", () => {
  const a = criarAmbiente();
  for (let i = 1; i <= 18; i++) {
    a.executar(`ITEMS["item_${i}"] = { id: "item_${i}", label: "Item ${i}", shortLabel: "I${i}", description: "Desc ${i}", purpose: "Fun ${i}", asset: "" };`);
    a.executar(`adicionarItem("item_${i}");`);
  }
  assert.equal(a.ler("state.inventory.length"), 18);
  assert.equal(a.ler("el.bagPagination.hidden"), false);

  // Página 1: 9 preenchidos
  assert.equal(a.ler("el.bagGrid.children.every(c => c.classList.contains('bag-slot--filled'))"), true);

  // Página 2: 9 preenchidos
  a.executar("state.bolsa.pagina = 2; renderizarBolsa();");
  assert.equal(a.ler("el.bagGrid.children.every(c => c.classList.contains('bag-slot--filled'))"), true);
  assert.equal(a.ler("el.bagGrid.children[8].dataset.itemId"), "item_18");
});

test("TESTE — 19 ITENS: página 3 criada automaticamente", () => {
  const a = criarAmbiente();
  for (let i = 1; i <= 19; i++) {
    a.executar(`ITEMS["item_${i}"] = { id: "item_${i}", label: "Item ${i}", shortLabel: "I${i}", description: "Desc ${i}", purpose: "Fun ${i}", asset: "" };`);
    a.executar(`adicionarItem("item_${i}");`);
  }
  assert.equal(a.ler("state.inventory.length"), 19);

  a.executar("state.bolsa.pagina = 3; renderizarBolsa();");
  assert.equal(a.ler("state.bolsa.pagina"), 3);
  assert.equal(a.ler("el.bagGrid.children[0].dataset.itemId"), "item_19");
  for (let i = 1; i < 9; i++) {
    assert.equal(a.ler(`el.bagGrid.children[${i}].classList.contains("bag-slot--empty")`), true);
  }
});

test("TESTE — INVENTÁRIO GRANDE: 30 itens, paginação compacta sem limite", () => {
  const a = criarAmbiente();
  for (let i = 1; i <= 30; i++) {
    a.executar(`ITEMS["item_${i}"] = { id: "item_${i}", label: "Item ${i}", shortLabel: "I${i}", description: "Desc ${i}", purpose: "Fun ${i}", asset: "" };`);
    a.executar(`adicionarItem("item_${i}");`);
  }
  assert.equal(a.ler("state.inventory.length"), 30);
  assert.equal(a.ler("Math.ceil(state.inventory.length / 9)"), 4);

  // Página 4 tem 3 itens + 6 vazios
  a.executar("state.bolsa.pagina = 4; renderizarBolsa();");
  assert.equal(a.ler("el.bagGrid.children[0].dataset.itemId"), "item_28");
  assert.equal(a.ler("el.bagGrid.children[1].dataset.itemId"), "item_29");
  assert.equal(a.ler("el.bagGrid.children[2].dataset.itemId"), "item_30");
  assert.equal(a.ler("el.bagGrid.children[3].classList.contains('bag-slot--empty')"), true);

  // Paginação compacta testada com 10 páginas (90 itens)
  for (let i = 31; i <= 90; i++) {
    a.executar(`ITEMS["item_${i}"] = { id: "item_${i}", label: "Item ${i}", shortLabel: "I${i}", description: "Desc ${i}", purpose: "Fun ${i}", asset: "" };`);
    a.executar(`adicionarItem("item_${i}");`);
  }
  a.executar("state.bolsa.pagina = 5; renderizarBolsa();");
  // Contém elipse "…" na navegação
  assert.equal(a.ler("el.bagPagination.children.some(c => c.textContent === '…')"), true);
});

test("TESTE — PESQUISA GLOBAL: item na página 4 é encontrado e começa na página 1", () => {
  const a = criarAmbiente();
  for (let i = 1; i <= 28; i++) {
    a.executar(`ITEMS["item_${i}"] = { id: "item_${i}", label: "Documento ${i}", shortLabel: "Doc ${i}", description: "Registro", purpose: "Arquivo", asset: "" };`);
    a.executar(`adicionarItem("item_${i}");`);
  }
  // Adiciona lulith_phone como 29º item (estaria na página 4)
  a.executar('adicionarItem("lulith_phone");');
  assert.equal(a.ler("state.inventory.length"), 29);

  // Pesquisar "celular"
  a.executar('el.bagSearch.value = "celular"; el.bagSearch.dispatchEvent({ type: "input" });');
  assert.equal(a.ler("state.bolsa.pagina"), 1);
  assert.equal(a.ler("el.bagGrid.children[0].dataset.itemId"), "lulith_phone");
  // Apenas 1 página de resultado
  assert.equal(a.ler("el.bagPagination.hidden"), true);
});

test("TESTE — PESQUISA POR FUNÇÃO: pesquisa termo no purpose do item", () => {
  const a = criarAmbiente();
  a.executar(`
    ITEMS.storage_key = {
      id: "storage_key",
      label: "Chave de Metal",
      shortLabel: "Chave",
      description: "Pequena chave prateada.",
      purpose: "Destranca o portão do depósito.",
      asset: ""
    };
    adicionarItem("storage_key");
    adicionarItem("lulith_phone");
  `);
  // Buscar "portao"
  a.executar('el.bagSearch.value = "portao"; el.bagSearch.dispatchEvent({ type: "input" });');
  assert.equal(a.ler("el.bagGrid.children[0].dataset.itemId"), "storage_key");
  assert.equal(a.ler("el.bagGrid.children[1].classList.contains('bag-slot--empty')"), true);

  // Buscar com/sem acento: "deposito" deve encontrar "depósito"
  a.executar('el.bagSearch.value = "deposito"; el.bagSearch.dispatchEvent({ type: "input" });');
  assert.equal(a.ler("el.bagGrid.children[0].dataset.itemId"), "storage_key");
});

test("TESTE — PESQUISA APENAS NA BOLSA: não revela itens de ITEMS que não foram coletados", () => {
  const a = criarAmbiente();
  a.executar(`
    ITEMS.chave_secreta = {
      id: "chave_secreta",
      label: "Chave Secreta Não Coletada",
      shortLabel: "Chave",
      description: "Secreta",
      purpose: "Abrir algo secreto",
      asset: ""
    };
    adicionarItem("lulith_phone");
  `);
  // Buscar "secreta"
  a.executar('el.bagSearch.value = "secreta"; el.bagSearch.dispatchEvent({ type: "input" });');
  // Não deve encontrar a chave secreta
  assert.equal(a.ler("el.bagNoResults.hidden"), false);
  assert.equal(a.ler("el.bagBody.hidden"), true);
});

test("TESTE — PESQUISA SEM RESULTADOS: exibe 'Nenhum item encontrado' sem dizer que a bolsa está vazia", () => {
  const a = criarAmbiente();
  a.executar('adicionarItem("lulith_phone");');
  a.executar('el.bagSearch.value = "xyz_inexistente"; el.bagSearch.dispatchEvent({ type: "input" });');
  assert.equal(a.ler("el.bagNoResults.hidden"), false);
  assert.equal(a.ler("el.bagEmpty.hidden"), true);
  assert.equal(a.ler("el.bagBody.hidden"), true);
});

test("TESTE — LIMPAR PESQUISA: botão [X] restaura todos os itens e reseta página", () => {
  const a = criarAmbiente();
  for (let i = 1; i <= 10; i++) {
    a.executar(`ITEMS["item_${i}"] = { id: "item_${i}", label: "Item ${i}", shortLabel: "I${i}", description: "Desc", purpose: "Fun", asset: "" };`);
    a.executar(`adicionarItem("item_${i}");`);
  }
  a.executar('el.bagSearch.value = "Item 10"; el.bagSearch.dispatchEvent({ type: "input" });');
  assert.equal(a.ler("el.bagSearchClear.hidden"), false);
  assert.equal(a.ler("el.bagGrid.children[0].dataset.itemId"), "item_10");

  // Clica no limpar pesquisa
  a.executar("el.bagSearchClear.click();");
  assert.equal(a.ler("el.bagSearch.value"), "");
  assert.equal(a.ler("state.bolsa.pagina"), 1);
  assert.equal(a.ler("el.bagGrid.children[0].dataset.itemId"), "item_1");
  assert.equal(a.ler("el.bagSearchClear.hidden"), true);
});

test("TESTE — ITEM CONSUMIDO: removerItem recalcula páginas e ajusta seleção", () => {
  const a = criarAmbiente();
  for (let i = 1; i <= 10; i++) {
    a.executar(`ITEMS["item_${i}"] = { id: "item_${i}", label: "Item ${i}", shortLabel: "I${i}", description: "Desc", purpose: "Fun", asset: "" };`);
    a.executar(`adicionarItem("item_${i}");`);
  }
  // Vai para a página 2 (que tem apenas item_10)
  a.executar("state.bolsa.pagina = 2; renderizarBolsa();");
  assert.equal(a.ler("state.bolsa.pagina"), 2);
  assert.equal(a.ler("state.bolsa.itemSelecionadoId"), "item_10");

  // Consome item_10
  a.executar('removerItem("item_10");');
  assert.equal(a.ler("state.inventory.length"), 9);
  // Página 2 sumiu, voltou para página 1
  assert.equal(a.ler("state.bolsa.pagina"), 1);
  assert.equal(a.ler("el.bagPagination.hidden"), true);
  // Seleção atualizada para item existente
  assert.equal(a.ler("state.bolsa.itemSelecionadoId"), "item_1");
});

test("TESTE — SAVE/LOAD: persiste apenas IDs e restaura tudo ao carregar", () => {
  const a = criarAmbiente();
  a.executar(`
    ITEMS.doc_teste = {
      id: "doc_teste",
      label: "Documento Confidencial",
      shortLabel: "Documento",
      description: "Arquivo encontrado sob a mesa.",
      purpose: "Revela o código de acesso.",
      asset: ""
    };
    adicionarItem("lulith_phone");
    adicionarItem("doc_teste");
  `);
  const snapshot = a.ler("capturarEstadoJogo();");
  // O snapshot deve conter somente array de IDs em inventory
  assert.deepEqual([...snapshot.inventory], ["lulith_phone", "doc_teste"]);
  // Não contém estado de UI
  assert.equal(snapshot.bolsa, undefined);

  // Novo ambiente carregando o save
  const b = criarAmbiente(a.storage);
  b.executar(`
    ITEMS.doc_teste = {
      id: "doc_teste",
      label: "Documento Confidencial",
      shortLabel: "Documento",
      description: "Arquivo encontrado sob a mesa.",
      purpose: "Revela o código de acesso.",
      asset: ""
    };
    restaurarEstadoJogo(${JSON.stringify(snapshot)});
  `);
  assert.deepEqual([...b.ler("state.inventory")], ["lulith_phone", "doc_teste"]);
  assert.equal(b.ler("el.bagGrid.children[0].dataset.itemId"), "lulith_phone");
  assert.equal(b.ler("el.bagGrid.children[1].dataset.itemId"), "doc_teste");
  assert.equal(b.ler("el.bagDetails.children[0].textContent"), "Celular de Lulith");
});

function coletarAparelho(a) {
  a.executar('irPara("beco_interior"); irPara("beco_fundo"); executarHotspot("safe"); executarHotspot("lulith_phone");');
}

function concluirReacao(a) {
  a.executar('while (state.modo === "dialogo") avancarDialogo();');
}

test("aparelho: coleta e seleção não desbloqueiam; USAR conclui uma única transição e autosave", () => {
  const a = criarAmbiente();
  assert.equal(a.ler('state.aparelho.originalPhoneStatus'), 'broken');
  assert.equal(a.ler('el.btnCelular.hidden'), true);
  a.executar('abrirCelular();');
  assert.equal(a.ler('state.modo'), 'livre');
  assert.equal(a.ler('executarAcaoInventario("lulith_phone")'), false);
  coletarAparelho(a);
  const before = a.ler('JSON.stringify(saveRepository.obterAutosave())');
  a.executar('el.btnBolsa.click(); el.bagGrid.firstElementChild.click();');
  assert.equal(a.ler('el.btnCelular.hidden'), true);
  assert.equal(a.ler('JSON.stringify(saveRepository.obterAutosave())'), before);
  const button = a.ler('el.bagDetails.children[4]');
  assert.equal(button.getAttribute('aria-label'), 'Usar Celular de Lulith');
  // Dados existentes sobrevivem à mudança de categoria do objeto.
  a.executar(`state.mensagens.historico.push({autor: "dono", texto: "Conteúdo preservado"});
    state.arquivos.vistos.add("candidatos");
    saveRepository.criarManual({id: "foto-preservada"});`);
  button.click();
  button.click();
  assert.equal(button.disabled, true);
  assert.equal(a.ler('state.modo'), 'dialogo');
  assert.equal(a.ler('state.dialogo.linha'), 0);
  assert.equal(a.ler('state.inventory.includes("lulith_phone")'), true);
  assert.equal(a.ler('state.aparelho.activePhone'), null);
  assert.equal(a.ler('el.btnCelular.hidden'), true);
  assert.equal(a.ler('JSON.stringify(saveRepository.obterAutosave())'), before);
  concluirReacao(a);
  assert.equal(a.ler('state.aparelho.activePhone'), 'lulith');
  assert.equal(a.ler('state.aparelho.originalPhoneStatus'), 'broken');
  assert.equal(a.ler('state.aparelho.phoneTheme'), 'lulith');
  assert.equal(a.ler('el.phoneScreen.dataset.phoneTheme'), 'lulith');
  assert.equal(a.ler('el.btnCelular.hidden'), false);
  assert.equal(a.ler('state.inventory.length'), 0);
  assert.equal(a.ler('el.bagEmpty.hidden'), false);
  assert.equal(a.ler('el.bagDetails.children.length'), 0);
  assert.equal(a.ler('el.bagGrid.children.length'), 0);
  assert.equal(a.ler('saveRepository.obterAutosave().saveState.aparelho.activePhone'), 'lulith');
  assert.equal(a.ler('state.mensagens.historico[0].texto'), 'Conteúdo preservado');
  assert.equal(a.ler('state.arquivos.vistos.has("candidatos")'), true);
  assert.equal(a.ler('saveRepository.listarManuais()[0].id'), 'foto-preservada');
  assert.equal(a.ler('adicionarItem("lulith_phone")'), false);
  assert.equal(a.ler('executarHotspot("lulith_phone")'), false);
  assert.equal(a.ler('executarAcaoInventario("lulith_phone")'), false);
  a.executar('el.btnCelular.click();');
  assert.equal(a.ler('state.modo'), 'celular');
});

test("aparelho: snapshots A/B/C restauram cofre, Bolsa e dispositivo entre sessões sem vazamento", () => {
  const a = criarAmbiente();
  a.executar('irPara("beco_interior"); irPara("beco_fundo"); executarHotspot("safe");');
  const snapshots = [a.ler('JSON.stringify(capturarEstadoJogo())')];
  a.executar('executarHotspot("lulith_phone");');
  snapshots.push(a.ler('JSON.stringify(capturarEstadoJogo())'));
  a.executar('el.btnBolsa.click(); executarAcaoInventario("lulith_phone");');
  concluirReacao(a);
  snapshots.push(a.ler('JSON.stringify(capturarEstadoJogo())'));
  snapshots.forEach((snapshot, i) => a.executar(`saveRepository.criarManual({id: "${i}", saveState: ${snapshot}});`));
  const b = criarAmbiente(a.storage);
  for (const i of [2, 0, 1, 2, 1, 0]) {
    b.executar(`restaurarEstadoJogo(saveRepository.listarManuais()[${i}].saveState);`);
    assert.equal(b.ler('state.aparelho.activePhone'), i === 2 ? 'lulith' : null);
    assert.equal(b.ler('state.inventory.includes("lulith_phone")'), i === 1);
    assert.equal(b.ler('el.btnCelular.hidden'), i !== 2);
    assert.equal(b.ler('el.hotspotLayer.children.length'), i === 0 ? 1 : 0);
    assert.equal(b.ler('el.objectLayer.children.length'), i === 0 ? 2 : 1);
    b.executar('el.btnBolsa.click();');
    assert.equal(b.ler('el.bagDetails.children.some(e => e.className === "bag-item-action")'), i === 1);
    b.executar('el.bagDialog.close(); abrirCelular();');
    assert.equal(b.ler('state.modo'), i === 2 ? 'celular' : 'livre');
  }
});

test("aparelho: load durante reação cancela ativação; snapshots inválidos não alteram a sessão", () => {
  const a = criarAmbiente();
  const initial = a.ler('JSON.stringify(capturarEstadoJogo())');
  coletarAparelho(a);
  a.executar('el.btnBolsa.click(); executarAcaoInventario("lulith_phone");');
  a.executar(`restaurarEstadoJogo(${initial}); encerrarConversa();`);
  assert.equal(a.ler('state.inventoryActionPending'), null);
  assert.equal(a.ler('state.aparelho.activePhone'), null);
  for (const patch of ['{activePhone: "other"}', '{phoneTheme: null}', '{originalPhoneStatus: "missing"}', '{activePhone: "lulith"}']) {
    a.executar(`var invalid = capturarEstadoJogo(); Object.assign(invalid.aparelho, ${patch});`);
    assert.throws(() => a.executar('restaurarEstadoJogo(invalid);'), /corrompido/);
    assert.equal(a.ler('state.aparelho.activePhone'), null);
  }
});

test("aparelho: migração v1 distingue exploração de progresso no celular e mantém tema independente", () => {
  const a = criarAmbiente();
  coletarAparelho(a);
  a.executar('var old = capturarEstadoJogo(); delete old.aparelho; restaurarEstadoJogo(old);');
  assert.equal(a.ler('state.aparelho.activePhone'), null);
  assert.equal(a.ler('state.inventory[0]'), 'lulith_phone');
  a.executar(`old.mensagens.historico.push({autor: "dono", texto: "Legado"}); restaurarEstadoJogo(old);`);
  assert.equal(a.ler('state.aparelho.activePhone'), 'lulith');
  assert.equal(a.ler('state.inventory.length'), 0);
  assert.equal(a.ler('state.aparelho.phoneTheme'), 'mj');
  a.executar('restaurarEstadoJogo(capturarEstadoJogo());');
  assert.equal(a.ler('el.phoneScreen.dataset.phoneTheme'), 'mj');
  assert.equal(a.ler('state.aparelho.activePhone'), 'lulith');
});

test("ação direta: item sem ação não ganha USAR; ativação recalcula página, seleção e pesquisa", () => {
  const a = criarAmbiente();
  a.executar(`for (let i = 0; i < 9; i++) {
    ITEMS['note'+i] = {id: 'note'+i, label: 'Bilhete '+i}; adicionarItem('note'+i);
  }`);
  assert.equal(a.ler('el.bagDetails.children.length'), 4);
  coletarAparelho(a);
  a.executar('el.btnBolsa.click(); state.bolsa.pagina = 2; renderizarBolsa(); executarAcaoInventario("lulith_phone");');
  concluirReacao(a);
  assert.equal(a.ler('state.bolsa.pagina'), 1);
  assert.equal(a.ler('el.bagPagination.hidden'), true);
  assert.equal(a.ler('state.bolsa.itemSelecionadoId'), 'note0');
  a.executar('state.bolsa.pesquisa = "Lulith"; renderizarBolsa();');
  assert.equal(a.ler('obterItensFiltradosBolsa().length'), 0);
  assert.equal(a.ler('el.bagNoResults.hidden'), false);
  assert.equal(a.ler('el.bagDetails.children.length'), 0);
});
