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
  }

  addEventListener() {}

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

  focus() {
    this.focused = true;
  }

  select() {
    this.selected = true;
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

  return {
    elementos,
    executar: (codigo) => require("./load-game.cjs").executar(contexto, codigo),
    ler: (expressao) => vm.runInContext(expressao, contexto),
    storage,
    timeouts,
    window
  };
}

function criarFoto(ambiente, nome) {
  ambiente.executar("tirarFoto();");
  const expressao = ambiente.ler("state.galeria.capturaPendente.photoExpression");
  ambiente.executar("mostrarPreviewFoto();");
  assert.equal(ambiente.executar(`confirmarFoto(${JSON.stringify(nome)});`), true);
  return expressao;
}

test("reset remoto limpa mensagens e arquivos, preservando a galeria entre sessões", async () => {
  const ambiente = criarAmbiente();
  ambiente.executar("prepararCelularTeste(); abrirCelular(); abrirGaleria();");
  criarFoto(ambiente, "Antes do reset");
  const fotosAntes = ambiente.ler("JSON.stringify(saveRepository.listarManuais())");

  ambiente.executar(`
    state.mensagens.historico.push({ autor: "protagonista", texto: "Teste" });
    agendarResetRemoto();
    iniciarResetRemoto();
  `);
  const timer = ambiente.ler("state.celular.resetTimer");
  timer.callback();
  assert.equal(ambiente.ler("state.celular.resetStatus"), "concluido");
  assert.equal(ambiente.ler("state.mensagens.historico.length"), 0);
  ambiente.executar("abrirArquivos();");
  assert.equal(ambiente.ler("el.filesList.children.length"), 1);
  assert.equal(ambiente.ler("el.filesList.firstElementChild.textContent"), "Nenhum arquivo encontrado.");
  ambiente.executar("mostrarTelaInicial(); abrirGaleria();");
  assert.equal(ambiente.ler("JSON.stringify(state.galeria.saves)"), fotosAntes);

  const novaSessao = criarAmbiente(ambiente.storage);
  novaSessao.executar(`
    restaurarEstadoJogo(saveRepository.obterAutosave().saveState);
    prepararCelularTeste(); abrirCelular();
    abrirGaleria();
  `);
  assert.equal(novaSessao.ler("state.celular.resetStatus"), "concluido");
  assert.equal(novaSessao.ler("JSON.stringify(state.galeria.saves)"), fotosAntes);
});

test("composição resolve cada expressão fotográfica e mantém o cenário em imagem independente", async () => {
  const ambiente = criarAmbiente();
  for (let numero = 1; numero <= 10; numero += 1) {
    const id = `mj__photo__${String(numero).padStart(2, "0")}`;
    const composicao = ambiente.executar(`criarComposicaoFoto({ sceneId: "beco_entrada", photoExpression: "${id}", saveState: { localizacao: { local: "beco" } } })`);
    const fundo = composicao.children.find((filho) => filho.className === "photo-background");
    const mj = composicao.children.find((filho) => filho.className === "photo-mj");
    assert.equal(mj.src, `assets/sprites/mj/photo/${id}.png`);
    assert.equal(mj.dataset.photoExpression, id);
    assert.equal(fundo.src, ambiente.ler('DATA.locais.beco.cenas.beco_entrada.background'));
  }
});

test("expressão fotográfica ausente ou desconhecida usa a pose neutra como fallback", async () => {
  const ambiente = criarAmbiente();
  for (const id of [undefined, null, "", "mj__photo__99", "__proto__", "constructor", "toString"]) {
    assert.equal(await ambiente.executar(`obterSpriteFotografico(${JSON.stringify(id)})`), "assets/sprites/MJ.png");
  }
});

test("foto manual persiste snapshot, cenário, data, nome e expressão entre reinicializações", async () => {
  const storage = criarStorage();
  const primeiraSessao = criarAmbiente(storage);

  await primeiraSessao.executar(`
    irPara("beco_interior");
    state.arquivos.vistos.add("rota");
    state.dialogo.faseMonologo = "aposPrimeiroEnvio";
    prepararCelularTeste(); abrirCelular();
    abrirGaleria();
    tirarFoto();
  `);
  const expressao = primeiraSessao.ler("state.galeria.capturaPendente.photoExpression");
  assert.match(expressao, /^mj__photo__\d{2}$/);
  assert.equal(primeiraSessao.ler('el.galleryFlash.classList.contains("oculto")'), false);
  assert.equal(primeiraSessao.ler("state.galeria.capturaPendente.sceneId"), "beco_interior");

  primeiraSessao.executar("mostrarPreviewFoto(); confirmarFoto('Antes do cofre');");
  assert.equal(primeiraSessao.ler("saveRepository.listarManuais().length"), 1);
  assert.equal(primeiraSessao.ler("saveRepository.listarManuais()[0].createdAt > 0"), true);
  assert.equal(primeiraSessao.ler("saveRepository.listarManuais()[0].saveState.arquivos.vistos[0]"), "rota");

  const segundaSessao = criarAmbiente(storage);
  segundaSessao.executar("prepararCelularTeste(); abrirCelular(); abrirGaleria();");
  assert.equal(segundaSessao.ler("state.galeria.saves.length"), 1);
  assert.equal(segundaSessao.ler("state.galeria.saves[0].name"), "Antes do cofre");
  assert.equal(segundaSessao.ler("state.galeria.saves[0].photoExpression"), expressao);
  assert.equal(segundaSessao.ler("el.galleryGrid.children.length"), 9);
});

test("cancelar não cria save e a expressão seguinte evita repetição imediata", async () => {
  const ambiente = criarAmbiente();
  ambiente.executar("prepararCelularTeste(); abrirCelular(); abrirGaleria(); tirarFoto(); mostrarPreviewFoto(); cancelarFoto();");
  assert.equal(ambiente.ler("saveRepository.listarManuais().length"), 0);
  assert.equal(ambiente.ler("state.galeria.capturaPendente"), null);

  const primeira = criarFoto(ambiente, "Primeira");
  ambiente.executar("Math.random = () => 0;");
  const segunda = criarFoto(ambiente, "Segunda");
  assert.notEqual(segunda, primeira);
  assert.equal(ambiente.ler("DATA.personagens.mj.fotografia.expressoes.includes(state.galeria.saves[1].photoExpression)"), true);
});

test("galeria limita nove slots, não sobrescreve e libera somente o save excluído", async () => {
  const ambiente = criarAmbiente();
  ambiente.executar("prepararCelularTeste(); abrirCelular(); abrirGaleria();");
  for (let indice = 1; indice <= 9; indice++) criarFoto(ambiente, `Foto ${indice}`);

  assert.equal(ambiente.ler("state.galeria.saves.length"), 9);
  assert.equal(ambiente.ler("el.btnTirarFoto.disabled"), true);
  const idsAntes = ambiente.ler("JSON.stringify(state.galeria.saves.map((save) => save.id))");
  ambiente.executar("tirarFoto();");
  assert.equal(ambiente.ler("state.galeria.capturaPendente"), null);
  assert.equal(ambiente.ler("JSON.stringify(state.galeria.saves.map((save) => save.id))"), idsAntes);
  assert.match(ambiente.ler("el.galleryStatus.textContent"), /galeria está cheia/i);

  ambiente.executar("state.galeria.selecionadoId = state.galeria.saves[4].id; excluirFotoSelecionada();");
  assert.equal(ambiente.ler("state.galeria.saves.length"), 8);
  assert.equal(ambiente.ler("el.btnTirarFoto.disabled"), false);
  criarFoto(ambiente, "Nova foto");
  assert.equal(ambiente.ler("state.galeria.saves.length"), 9);
});

test("load restaura o estado narrativo, fecha o celular e não aplica expressão fotográfica", async () => {
  const ambiente = criarAmbiente();
  await ambiente.executar(`
    irPara("beco_interior");
    state.arquivos.vistos.add("candidatos");
    state.dialogo.faseMonologo = "arquivoCandidatos";
    state.mensagens.etapa = "antes-reset";
    state.mensagens.historico.push({ autor: "protagonista", texto: "Eu já memorizei." });
    prepararCelularTeste(); abrirCelular();
    abrirGaleria();
  `);
  criarFoto(ambiente, "Pista");
  const expressao = ambiente.ler("state.galeria.saves[0].photoExpression");

  ambiente.executar(`
    state.localizacao.cena = "beco_fundo";
    state.arquivos.vistos.clear();
    state.dialogo.faseMonologo = "inicial";
    state.mensagens.etapa = null;
    state.mensagens.historico = [];
    state.galeria.selecionadoId = state.galeria.saves[0].id;
    carregarFotoSelecionada();
  `);

  assert.equal(ambiente.ler("state.localizacao.cena"), "beco_interior");
  assert.equal(ambiente.ler('state.arquivos.vistos.has("candidatos")'), true);
  assert.equal(ambiente.ler("state.dialogo.faseMonologo"), "arquivoCandidatos");
  assert.equal(ambiente.ler("state.mensagens.etapa"), "antes-reset");
  assert.equal(ambiente.ler("state.mensagens.historico[0].texto"), "Eu já memorizei.");
  assert.equal(ambiente.ler("state.modo"), "livre");
  assert.equal(ambiente.ler("state.celular.tela"), "inicio");
  assert.equal(ambiente.ler('el.phoneOverlay.classList.contains("oculto")'), true);
  assert.notEqual(ambiente.ler("state.dialogo.faseMonologo"), expressao);
});

test("snapshot inválido não altera a sessão nem impede outros saves", async () => {
  const ambiente = criarAmbiente();
  ambiente.executar("prepararCelularTeste(); abrirCelular(); abrirGaleria();");
  criarFoto(ambiente, "Válida");
  ambiente.executar(`
    const corrompida = { ...state.galeria.saves[0], id: "corrompida", name: "Corrompida", saveState: { saveVersion: 999 } };
    saveRepository.criarManual(corrompida);
    carregarSavesGaleria();
    state.galeria.selecionadoId = "corrompida";
    state.localizacao.cena = "beco_fundo";
  `);

  assert.equal(ambiente.executar("carregarFotoSelecionada();"), false);
  assert.equal(ambiente.ler("state.localizacao.cena"), "beco_fundo");
  assert.match(ambiente.ler("el.galleryStatus.textContent"), /corrompido|incompatível/i);
  assert.equal(ambiente.ler('state.galeria.saves.some((save) => save.name === "Válida")'), true);
});

test("fim de cutscene substitui autosave, mas load manual não", async () => {
  const ambiente = criarAmbiente();
  ambiente.executar("prepararCelularTeste(); abrirCelular(); abrirGaleria();");
  criarFoto(ambiente, "Início");
  assert.equal(ambiente.ler("saveRepository.obterAutosave()"), null);
  await ambiente.executar("mostrarTelaInicial(); fecharCelular(); irPara('beco_interior'); iniciarConversa(); encerrarConversa();");
  const autosaveAntesLoad = ambiente.ler("JSON.stringify(saveRepository.obterAutosave())");
  assert.equal(ambiente.ler("saveRepository.listarManuais().length"), 1);
  assert.equal(ambiente.ler("saveRepository.obterAutosave().saveState.localizacao.cena"), "beco_interior");
  assert.equal(ambiente.ler('Object.hasOwn(saveRepository.obterAutosave(), "photoExpression")'), false);

  ambiente.executar(`
    prepararCelularTeste(); abrirCelular();
    abrirGaleria();
    state.galeria.selecionadoId = state.galeria.saves[0].id;
    carregarFotoSelecionada();
  `);
  assert.equal(ambiente.ler("JSON.stringify(saveRepository.obterAutosave())"), autosaveAntesLoad);
  assert.equal(ambiente.ler("state.localizacao.cena"), "beco_entrada");

  ambiente.executar("state.arquivos.vistos.add('rota'); iniciarConversa(); encerrarConversa();");
  assert.notEqual(ambiente.ler("JSON.stringify(saveRepository.obterAutosave())"), autosaveAntesLoad);
  assert.equal(ambiente.ler("saveRepository.obterAutosave().saveState.arquivos.vistos.includes('rota')"), true);
  assert.equal(ambiente.ler("saveRepository.listarManuais().length"), 1);
});

test("point-and-click: snapshots isolados nos três estados e navegação", async () => {
  const a = criarAmbiente();
  await a.executar('irPara("beco_interior"); irPara("beco_fundo"); const fechado = capturarEstadoJogo();');
  assert.equal(a.ler('executarHotspot("lulith_phone")'), false);
  assert.equal(await a.ler('executarHotspot("safe")'), true);
  assert.equal(a.ler('executarHotspot("safe")'), false);
  a.executar('const aberto = capturarEstadoJogo();');
  assert.equal(a.ler('el.hotspotLayer.children[0].dataset.hotspot'), 'lulith_phone');
  assert.equal(a.ler('executarHotspot("lulith_phone")'), true);
  assert.equal(a.ler('executarHotspot("lulith_phone")'), false);
  assert.equal(a.ler('state.inventory.length'), 1);
  await a.executar('const coletado = capturarEstadoJogo(); irPara("beco_interior"); irPara("beco_fundo");');
  assert.equal(a.ler('el.objectLayer.children.length'), 1);
  assert.equal(a.ler('el.hotspotLayer.children.length'), 0);
  a.executar('restaurarEstadoJogo(fechado);');
  assert.equal(a.ler('state.inventory.length'), 0);
  assert.equal(a.ler('el.hotspotLayer.children[0].dataset.hotspot'), 'safe');
  a.executar('restaurarEstadoJogo(aberto);');
  assert.equal(a.ler('el.objectLayer.children.length'), 2);
  assert.equal(a.ler('executarHotspot("lulith_phone")'), true);
  a.executar('restaurarEstadoJogo(coletado);');
  assert.equal(a.ler('state.inventory[0]'), 'lulith_phone');
  assert.equal(a.ler('el.hotspotLayer.children.length'), 0);
  assert.equal(a.ler('el.bagGrid.children[0].children[1].textContent'), 'Celular');
  assert.equal(a.ler('el.bagDetails.children[0].textContent'), 'Celular de Lulith');
  const b = criarAmbiente(a.storage);
  b.executar('restaurarEstadoJogo(saveRepository.obterAutosave().saveState);');
  assert.equal(b.ler('state.inventory[0]'), 'lulith_phone');
  assert.equal(b.ler('el.hotspotLayer.children.length'), 0);
});

test("point-and-click: saves antigos, dados inválidos e IDs únicos", async () => {
  const a = criarAmbiente();
  a.executar('const antigo = capturarEstadoJogo(); delete antigo.inventory; delete antigo.sceneState; adicionarItem("lulith_phone"); restaurarEstadoJogo(antigo);');
  assert.equal(a.ler('state.inventory.length'), 0);
  assert.equal(a.ler('validarSnapshot({...antigo, inventory: ["inexistente"]})'), null);
  assert.equal(a.ler('validarSnapshot({...antigo, inventory: null})'), null);
  assert.equal(a.ler('validarSnapshot({...antigo, sceneState: {beco_fundo: {safeOpened: "true"}}})'), null);
  assert.equal(a.ler('validarSnapshot({...antigo, inventory: ["lulith_phone", "lulith_phone"]}).inventory.length'), 1);
});

test("snapshots rejeitam identificadores herdados e formatos inválidos sem alterar o jogo", async () => {
  const a = criarAmbiente();
  a.executar("const baseValidacao = capturarEstadoJogo();");
  for (const alteracao of [
    's.localizacao.local = "toString"',
    's.localizacao.cena = "constructor"',
    's.mensagens.etapa = "toString"',
    's.mensagens.proximaEtapa = "__proto__"',
    's.mensagens.etapa = ["celular-encontrado"]',
    's.dialogo.faseMonologo = ["inicial"]',
    's.dialogo.rotaMonologoArquivo = "constructor"',
    's.arquivos.enigmaIdentidadeResolvido = 1',
    's.arquivos.enigmaIdentidadeResolvidoAntesReset = null',
    's.celular.resetStatus = "agendado"; s.celular.resetAte = null'
  ]) {
    assert.equal(a.ler(`(() => {
      const s = copiarDados(baseValidacao);
      ${alteracao};
      return validarSnapshot(s);
    })()`), null, alteracao);
  }
  assert.equal(a.ler("state.localizacao.cena"), "beco_entrada");
  assert.equal(a.ler("state.mensagens.etapa"), null);
});

test("fase global do celular continua salvável após voltar para casa", () => {
  const a = criarAmbiente();
  assert.equal(a.ler(`(() => {
    const s = capturarEstadoJogo();
    s.localizacao = { local: "casa", cena: "casa_sala" };
    s.dialogo.faseMonologo = "aposPrimeiroEnvio";
    s.dialogo.rotaMonologoArquivo = "arquivoRota";
    return validarSnapshot(s)?.dialogo.faseMonologo;
  })()`), "aposPrimeiroEnvio");
});

test("validação preserva o candidato e aceita um reset agendado com prazo válido", async () => {
  const a = criarAmbiente();
  assert.equal(a.ler(`(() => {
    const s = capturarEstadoJogo();
    s.celular = {resetStatus: "agendado", resetAte: Date.now() + 60000};
    const antes = JSON.stringify(s);
    const validado = validarSnapshot(s);
    return validado !== null && validado !== s && JSON.stringify(s) === antes;
  })()`), true);
});

test("point-and-click: exige item, consumo automático e remoção narrativa", async () => {
  const a = criarAmbiente();
  await a.executar(`
    ITEMS.test_key = { id: "test_key", label: "Chave", description: "Teste", asset: "", consumable: true };
    irPara("beco_interior"); irPara("beco_fundo");
    DATA.cena.hotspots.push({id: "test_door", type: "use_item", requiresItem: "test_key",
      conditions: {safeOpened: false}, changes: {safeOpened: true}});
  `);
  assert.equal(a.ler('executarHotspot("test_door")'), false);
  a.executar('adicionarItem("test_key");');
  assert.equal(a.ler('executarHotspot("test_door", "lulith_phone")'), false);
  assert.equal(a.ler('executarHotspot("test_door")'), true);
  assert.equal(a.ler('state.inventory.length'), 0);
  await a.executar('executarHotspot("lulith_phone"); removerItem("lulith_phone"); irPara("beco_interior"); irPara("beco_fundo");');
  assert.equal(a.ler('executarHotspot("lulith_phone")'), false);
  assert.equal(a.ler('state.inventory.length'), 0);
});

test('conclusão do ato persiste, migra saves antigos e rejeita flag inválida', () => {
  const ambiente = criarAmbiente();
  ambiente.executar(`
    state.act1Complete = true;
    registrarAutosave();
    const finalSave = saveRepository.obterAutosave().saveState;
    state.act1Complete = false;
    restaurarEstadoJogo(finalSave);
    if (!state.act1Complete) throw new Error('Conclusão perdida no Load');
    delete finalSave.act1Complete;
    restaurarEstadoJogo(finalSave);
    if (state.act1Complete !== false) throw new Error('Save antigo não migrou');
    finalSave.act1Complete = 'true';
    if (validarSnapshot(finalSave) !== null) throw new Error('Flag inválida aceita');
  `);
});
