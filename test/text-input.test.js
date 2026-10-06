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
    executar: (codigo) => vm.runInContext(codigo, contexto),
    ler: (expressao) => vm.runInContext(expressao, contexto)
  };
}

test("coordenadas: teclado oferece todos os caracteres do bilhete e confirma o valor", () => {
  const { executar, ler } = criarAmbiente();
  for (const field of ['latitude', 'longitude']) {
    executar(`abrirEntradaTexto({ layout: 'coordenadas', maxLength: 48,
      aoConfirmar: value => { globalThis.confirmedCoordinate = value; } });`);
    const coordinate = ler(`DATA.prototypeAlleyCoordinates.${field}`);
    const keys = JSON.parse(ler('JSON.stringify(el.gameKeyboard.children.flatMap(row => row.children.map(key => key.dataset.key)))'));
    for (const character of coordinate) {
      const key = character === ' ' ? 'espaco' : character;
      assert.ok(keys.includes(key), `Tecla disponível: ${character}`);
      executar(`pressionarTecla(${JSON.stringify(key)});`);
    }
    executar('pressionarTecla("ok");');
    assert.equal(ler('confirmedCoordinate'), coordinate);
    assert.equal(ler('entradaTextoAberta()'), false);
  }
  executar('abrirEntradaTexto();');
  assert.equal(ler('state.texto.layout'), 'qwerty', 'celular mantém o teclado padrão');
});

test("galeria: teclado virtual nomeia e confirma a fotografia", () => {
  const ambiente = criarAmbiente();
  ambiente.executar(`
    prepararCelularTeste(); abrirCelular(); abrirGaleria();
    tirarFoto(); mostrarPreviewFoto();
  `);
  assert.equal(ambiente.ler("el.galleryPhotoName.textContent"), "Toque para nomear");
  assert.equal(ambiente.executar("abrirEditorNomeFoto();"), true);
  assert.equal(ambiente.ler("state.texto.aberto"), true);
  assert.equal(
    ambiente.ler('el.textEntryDock.classList.contains("oculto")'),
    false
  );
  assert.equal(ambiente.ler('el.phoneScreen.classList.contains("texto-aberto")'), true);
  assert.equal(ambiente.ler("el.textEntrySend.textContent"), "OK");

  ambiente.executar(`
    pressionarTecla("E"); pressionarTecla("n"); pressionarTecla("s");
    pressionarTecla("a"); pressionarTecla("i"); pressionarTecla("o");
  `);
  assert.equal(ambiente.ler("state.texto.buffer"), "Ensaio");
  assert.equal(ambiente.ler("el.textEntryCount.textContent"), "6/28");
  assert.equal(ambiente.executar("confirmarEntradaTexto();"), true);

  assert.equal(ambiente.ler("state.texto.aberto"), false);
  assert.equal(ambiente.ler('el.textEntryDock.classList.contains("oculto")'), true);
  assert.equal(ambiente.ler('el.phoneScreen.classList.contains("texto-aberto")'), false);
  assert.equal(ambiente.ler("saveRepository.listarManuais().length"), 1);
  assert.equal(ambiente.ler("saveRepository.listarManuais()[0].name"), "Ensaio");
  assert.equal(ambiente.ler("state.galeria.capturaPendente"), null);
});

test("confirmação vazia fica bloqueada até o buffer ter conteúdo", () => {
  const ambiente = criarAmbiente();
  ambiente.executar("abrirEntradaTexto({ maxLength: 5 });");
  assert.equal(ambiente.ler("podeConfirmarEntradaTexto()"), false);
  assert.equal(ambiente.ler("el.textEntrySend.disabled"), true);
  assert.equal(ambiente.executar("confirmarEntradaTexto();"), false);
  assert.equal(ambiente.ler("state.texto.aberto"), true);
  ambiente.executar("pressionarTecla('espaco');");
  assert.equal(ambiente.ler("podeConfirmarEntradaTexto()"), false);
  ambiente.executar("pressionarTecla('a');");
  assert.equal(ambiente.ler("podeConfirmarEntradaTexto()"), true);
  assert.equal(ambiente.ler("el.textEntrySend.disabled"), false);
});

test("limite de caracteres bloqueia inserções acima do máximo", () => {
  const ambiente = criarAmbiente();
  ambiente.executar(`
    abrirEntradaTexto({
      maxLength: 3,
      aoConfirmar: (valor) => { globalThis.capturado = valor; }
    });
  `);
  for (const letra of ["a", "b", "c", "d"]) ambiente.executar(`pressionarTecla("${letra}");`);
  assert.equal(ambiente.ler("state.texto.buffer"), "abc");
  assert.equal(ambiente.ler("el.textEntryCount.textContent"), "3/3");
  assert.equal(ambiente.ler('el.textEntryCount.classList.contains("limite")'), true);
  ambiente.executar("confirmarEntradaTexto();");
  assert.equal(ambiente.ler("globalThis.capturado"), "abc");
  assert.equal(ambiente.ler("state.texto.aberto"), false);
});

test("espaço, backspace e cursor editam no meio do texto", () => {
  const ambiente = criarAmbiente();
  ambiente.executar("abrirEntradaTexto({ maxLength: 10 });");
  ambiente.executar('pressionarTecla("a"); pressionarTecla("b");');
  assert.equal(ambiente.ler("state.texto.cursor"), 2);
  ambiente.executar("moverCursor(-1);");
  assert.equal(ambiente.ler("state.texto.cursor"), 1);
  ambiente.executar('pressionarTecla("X");');
  assert.equal(ambiente.ler("state.texto.buffer"), "aXb");
  ambiente.executar("pressionarTecla('backspace');");
  assert.equal(ambiente.ler("state.texto.buffer"), "ab");
  ambiente.executar("pressionarTecla('espaco'); pressionarTecla('c');");
  assert.equal(ambiente.ler("state.texto.buffer"), "a cb");
  assert.equal(ambiente.ler("el.textEntryField.children.length"), 3);
  assert.equal(ambiente.ler('el.textEntryField.children[1].id'), "text-entry-caret");
});

test("shift insere maiúscula e volta automaticamente para minúsculas", () => {
  const ambiente = criarAmbiente();
  ambiente.executar("abrirEntradaTexto({ maxLength: 10 });");
  ambiente.executar("pressionarTecla('shift');");
  assert.equal(ambiente.ler("state.texto.shift"), true);
  ambiente.executar('pressionarTecla("a");');
  assert.equal(ambiente.ler("state.texto.buffer"), "A");
  assert.equal(ambiente.ler("state.texto.shift"), false);
  ambiente.executar('pressionarTecla("h");');
  assert.equal(ambiente.ler("state.texto.buffer"), "Ah");
});

test("layouts alternam entre letras, números e painel de acentos", () => {
  const ambiente = criarAmbiente();
  ambiente.executar("abrirEntradaTexto({ maxLength: 20 });");
  assert.equal(ambiente.ler("state.texto.layout"), "qwerty");
  ambiente.executar("pressionarTecla('layoutNumeros');");
  assert.equal(ambiente.ler("state.texto.layout"), "numeros");
  ambiente.executar("pressionarTecla('layoutLetras');");
  assert.equal(ambiente.ler("state.texto.layout"), "qwerty");

  ambiente.executar("pressionarTecla('acentos');");
  assert.equal(ambiente.ler("state.texto.painelAcentos"), true);
  assert.equal(
    ambiente.ler('el.textEntryAccents.classList.contains("oculto")'),
    false
  );
  ambiente.executar('pressionarTecla("á");');
  assert.equal(ambiente.ler("state.texto.buffer"), "á");
  assert.equal(ambiente.ler("state.texto.painelAcentos"), false);
  assert.equal(ambiente.ler('el.textEntryAccents.classList.contains("oculto")'), true);
});

test("cancelar descarta o draft sem descartar a captura pendente", () => {
  const ambiente = criarAmbiente();
  ambiente.executar(`
    prepararCelularTeste(); abrirCelular(); abrirGaleria();
    tirarFoto(); mostrarPreviewFoto(); abrirEditorNomeFoto();
    pressionarTecla("P"); pressionarTecla("i"); pressionarTecla("s");
  `);
  assert.equal(ambiente.executar("cancelarEntradaTexto();"), true);
  assert.equal(ambiente.ler("state.texto.aberto"), false);
  assert.equal(ambiente.ler("state.texto.buffer"), "");
  assert.equal(ambiente.ler("el.galleryPhotoName.textContent"), "Toque para nomear");
  assert.notEqual(ambiente.ler("state.galeria.capturaPendente"), null);
  assert.equal(ambiente.ler("saveRepository.listarManuais().length"), 0);
});

test("mensagens: somente as opções prontas enviam respostas sem abrir teclado", () => {
  const ambiente = criarAmbiente();
  ambiente.executar("prepararCelularTeste(); abrirCelular(); abrirMensagens();");
  assert.equal(ambiente.elementos.has("messages-composer"), false);
  assert.equal(ambiente.elementos.has("messages-composer-field"), false);
  assert.equal(ambiente.ler('el.messagesChoices.children.length > 0'), true);
  assert.equal(ambiente.ler('state.texto.aberto'), false);
  ambiente.executar('escolherResposta("perguntar-identidade");');
  assert.equal(ambiente.ler("state.mensagens.historico.length"), 1);
  assert.equal(ambiente.ler("state.mensagens.historico[0].autor"), "protagonista");
  assert.equal(ambiente.ler("state.mensagens.historico[0].texto"), "Quem é você?");
  assert.equal(ambiente.ler("state.texto.aberto"), false);
  assert.equal(ambiente.ler('el.textEntryDock.classList.contains("oculto")'), true);
});

test("voltar durante a edição cancela a entrada sem sair da tela", () => {
  const ambiente = criarAmbiente();
  ambiente.executar(`
    prepararCelularTeste(); abrirCelular(); abrirGaleria();
    abrirEntradaTexto({ maxLength: 10 }); pressionarTecla("x");
  `);
  ambiente.executar("voltarCelular();");
  assert.equal(ambiente.ler("state.texto.aberto"), false);
  assert.equal(ambiente.ler("state.celular.tela"), "galeria");
});

test("teclado físico: letras, backspace, setas, Enter confirma e Escape cancela", () => {
  const ambiente = criarAmbiente();
  ambiente.executar("abrirEntradaTexto({ maxLength: 10 });");

  assert.equal(ambiente.executar("tratarTecladoFisico({ key: 'a', preventDefault() {} })"), true);
  assert.equal(ambiente.ler("state.texto.buffer"), "a");
  assert.equal(ambiente.executar("tratarTecladoFisico({ key: 'Backspace', preventDefault() {} })"), true);
  assert.equal(ambiente.ler("state.texto.buffer"), "");
  ambiente.executar(`
    tratarTecladoFisico({ key: 'x', preventDefault() {} });
    tratarTecladoFisico({ key: 'y', preventDefault() {} });
    tratarTecladoFisico({ key: 'ArrowLeft', preventDefault() {} });
  `);
  assert.equal(ambiente.ler("state.texto.cursor"), 1);
  assert.equal(ambiente.executar("tratarTecladoFisico({ key: 'Enter', preventDefault() {} })"), true);
  assert.equal(ambiente.ler("state.texto.aberto"), false);

  ambiente.executar("abrirEntradaTexto({ maxLength: 10 });");
  ambiente.executar("tratarTecladoFisico({ key: 'Escape', preventDefault() {} });");
  assert.equal(ambiente.ler("state.texto.aberto"), false);
});

test("snapshot não persiste o texto e restaurar fecha a edição", () => {
  const ambiente = criarAmbiente();
  ambiente.executar(`
    abrirEntradaTexto({ maxLength: 10, aoConfirmar: (valor) => { globalThis.resposta = valor; } });
    pressionarTecla("q");
    globalThis.foto = capturarEstadoJogo();
  `);
  assert.equal(ambiente.ler(`Object.hasOwn(globalThis.foto, "texto")`), false);
  assert.equal(ambiente.ler("JSON.stringify(globalThis.foto).includes('\"texto\"')"), false);

  ambiente.executar("restaurarEstadoJogo(globalThis.foto);");
  assert.equal(ambiente.ler("state.texto.aberto"), false);
  assert.equal(ambiente.ler("state.texto.buffer"), "");
  assert.equal(ambiente.ler('el.textEntryDock.classList.contains("oculto")'), true);
  assert.equal(ambiente.ler('el.phoneScreen.classList.contains("texto-aberto")'), false);
});

test("fecharCelular encerra a edição em andamento", () => {
  const ambiente = criarAmbiente();
  ambiente.executar(`
    prepararCelularTeste(); abrirCelular(); abrirGaleria();
    abrirEntradaTexto({ maxLength: 10 }); pressionarTecla("z");
  `);
  ambiente.executar("fecharCelular();");
  assert.equal(ambiente.ler("state.modo"), "livre");
  assert.equal(ambiente.ler("state.texto.aberto"), false);
  assert.equal(ambiente.ler('el.textEntryDock.classList.contains("oculto")'), true);
});
