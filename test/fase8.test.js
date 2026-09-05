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
    this.attributes = {};
    this.disabled = false;
    this.textContent = "";
    this.value = "";
  }

  addEventListener() {}

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  replaceChildren(...children) {
    this.children = children;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  focus() {
    this.focused = true;
  }

  select() {
    this.selected = true;
  }

  querySelector(selector) {
    const match = selector.match(/^\[data-file-id="(.+)"\]$/);
    if (match) return this.children.find((child) => child.dataset.fileId === match[1]) ?? null;
    if (selector === 'button[type="submit"]') {
      this.submitButton ??= new Element();
      return this.submitButton;
    }
    return null;
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
  const timeouts = [];

  const document = {
    addEventListener() {},
    createElement: () => new Element(),
    getElementById: (id) => elementos.get(id) ?? null
  };

  const setTimeout = (callback, delay) => {
    const timer = { callback, delay, cancelado: false };
    timeouts.push(timer);
    return timer;
  };

  const clearTimeout = (timer) => {
    if (timer) timer.cancelado = true;
  };

  const executarProximoTimeout = () => {
    let timer = timeouts.shift();
    while (timer?.cancelado) timer = timeouts.shift();
    assert.ok(timer, "era esperado um timeout pendente");
    timer.callback();
  };

  const contexto = vm.createContext({
    clearInterval() {},
    clearTimeout,
    console,
    document,
    requestAnimationFrame: (callback) => callback(),
    setInterval: () => ({}),
    setTimeout
  });

  const data = fs.readFileSync(path.join(raiz, "js/data.js"), "utf8");
  const saves = fs.readFileSync(path.join(raiz, "js/save-system.js"), "utf8");
  const game = fs.readFileSync(path.join(raiz, "js/game.js"), "utf8");
  vm.runInContext(`${data}\n${saves}\n${game}`, contexto);

  return { contexto, elementos, executarProximoTimeout, timeouts };
}

function controlarAmbiente() {
  const ambiente = criarAmbiente();
  const executar = (codigo) => vm.runInContext(codigo, ambiente.contexto);
  const ler = (expressao) => vm.runInContext(expressao, ambiente.contexto);
  const executarAte = (condicao) => {
    for (let tentativa = 0; tentativa < 30 && !ler(condicao); tentativa++) {
      ambiente.executarProximoTimeout();
    }
    assert.equal(ler(condicao), true, `fluxo não alcançou: ${condicao}`);
  };

  return { ...ambiente, executar, executarAte, ler };
}

test("Fase 8 libera o enigma após a rota nova e preserva a solução antes do reset", () => {
  const { elementos, executar, executarAte, executarProximoTimeout, ler, timeouts } = controlarAmbiente();

  executar("abrirCelular(); abrirArquivos();");
  assert.equal(
    ler('Array.from(el.filesList.children).some((item) => item.dataset.fileId === "identidade")'),
    false
  );
  executar('visualizarArquivo("identidade"); resolverEnigmaIdentidade("ela");');
  assert.equal(ler("state.arquivos.enigmaIdentidadeResolvido"), false);

  executar('visualizarArquivo("candidatos"); voltarCelular(); abrirMensagens();');
  assert.equal(elementos.get("btn-mensagens").disabled, false);
  assert.equal(ler('state.celular.tela'), "mensagens");
  assert.equal(
    ler('Array.from(el.messagesChoices.children).some((item) => item.dataset.optionId === "questionar-arquivos")'),
    true
  );

  executar('escolherResposta("questionar-arquivos");');
  executarAte('state.mensagens.etapa === "explicar-escolha" && !state.mensagens.donoRespondendo');
  assert.equal(elementos.get("messages-header").textContent, "???");

  executar('escolherResposta("perguntar-pesquisa");');
  executarAte('state.mensagens.etapa === "antes-reset" && !state.mensagens.donoRespondendo');

  executar('escolherResposta("copiei-informacoes");');
  executarAte("state.celular.resetStatus === RESET_STATUS.AGENDADO && !state.mensagens.donoRespondendo");
  assert.equal(ler("CONFIG.esperaAntesReset"), 60_000);
  assert.equal(timeouts.find((timer) => !timer.cancelado)?.delay, 60_000);
  assert.equal(ler('state.dialogo.faseMonologo'), "aposPrimeiroEnvio");
  assert.equal(elementos.get("reset-countdown").textContent, "01:00");
  assert.equal(elementos.get("reset-countdown").classList.contains("oculto"), false);
  assert.equal(elementos.get("phone-signal").classList.contains("oculto"), true);

  executar('voltarCelular(); abrirArquivos(); visualizarArquivo("identidade"); resolverEnigmaIdentidade("ele");');
  assert.equal(ler("state.arquivos.enigmaIdentidadeResolvido"), false);
  executar('resolverEnigmaIdentidade("ela");');
  assert.equal(ler("state.arquivos.enigmaIdentidadeResolvido"), true);
  assert.equal(ler('state.dialogo.faseMonologo'), "identidadeResolvida");

  executarProximoTimeout();

  assert.equal(ler("state.celular.resetStatus"), "executando");
  assert.equal(elementos.get("reset-countdown").textContent, "00:00");
  assert.equal(ler("JSON.stringify(state.arquivos.vistosAntesReset)"), '["candidatos","identidade"]');
  assert.equal(ler("state.arquivos.enigmaIdentidadeResolvidoAntesReset"), true);
  assert.ok(ler("state.mensagens.historicoAntesReset.length") > 0);

  executarProximoTimeout();

  assert.equal(ler("state.celular.resetStatus"), "concluido");
  assert.equal(ler("state.mensagens.historico.length"), 0);
  assert.equal(elementos.get("btn-arquivos").disabled, false);
  assert.equal(elementos.get("phone-home").classList.contains("oculto"), false);
  assert.equal(ler('state.dialogo.faseMonologo'), "conversaConcluida");
  assert.equal(ler('saveRepository.obterAutosave().saveState.dialogo.faseMonologo'), "conversaConcluida");
  assert.equal(ler('saveRepository.obterAutosave().saveState.celular.resetStatus'), "concluido");
  assert.equal(elementos.get("reset-countdown").classList.contains("oculto"), true);
  assert.equal(elementos.get("phone-signal").classList.contains("oculto"), false);

  executar("abrirArquivos();");
  assert.equal(elementos.get("files-list").children[0].textContent, "Nenhum arquivo encontrado.");

  executar("voltarCelular();");
  executar("abrirMensagens();");
  assert.equal(elementos.get("messages-list").children[0].textContent, "Nenhuma conversa encontrada.");
});

test("rota condicional longa converge no enigma e respeita o prazo de reset", () => {
  const { executar, executarAte, executarProximoTimeout, ler, timeouts } = controlarAmbiente();

  executar("abrirCelular(); abrirMensagens();");
  assert.equal(
    ler('Array.from(el.messagesChoices.children).some((item) => item.dataset.optionId === "questionar-origem-aparelho")'),
    false
  );
  assert.equal(
    ler('Array.from(el.messagesChoices.children).some((item) => item.dataset.optionId === "exigir-resposta")'),
    false
  );

  executar('voltarCelular(); abrirArquivos(); visualizarArquivo("rota"); voltarCelular(); abrirMensagens();');
  assert.equal(
    ler('Array.from(el.messagesChoices.children).some((item) => item.dataset.optionId === "questionar-origem-aparelho")'),
    true
  );
  assert.equal(
    ler('Array.from(el.messagesChoices.children).some((item) => item.dataset.optionId === "exigir-resposta")'),
    false
  );

  executar('escolherResposta("questionar-origem-aparelho");');
  executarAte('state.mensagens.etapa === "explicar-teste" && !state.mensagens.donoRespondendo');

  executar('escolherResposta("contestar-teste");');
  executarAte('state.mensagens.etapa === "questionar-confianca" && !state.mensagens.donoRespondendo');

  executar('escolherResposta("duvidar-remetente");');
  executarAte('state.mensagens.etapa === "encerrar-contato" && !state.mensagens.donoRespondendo');

  executar('escolherResposta("investigar");');
  executarAte('state.mensagens.etapa === "antes-reset" && !state.mensagens.donoRespondendo');

  executar('escolherResposta("impedir-reset");');
  executarAte("state.celular.resetStatus === RESET_STATUS.AGENDADO && !state.mensagens.donoRespondendo");

  assert.equal(ler("state.mensagens.etapa"), null);
  assert.equal(ler('state.mensagens.historico.some((item) => item.texto.includes("Recrutamento e lógica"))'), true);
  assert.equal(timeouts.find((timer) => !timer.cancelado)?.delay, 60_000);

  executarProximoTimeout();
  assert.equal(ler("state.celular.resetStatus"), "executando");
  assert.equal(ler("state.arquivos.enigmaIdentidadeResolvidoAntesReset"), false);
});

[
  {
    arquivo: "candidatos",
    opcao: "questionar-arquivos",
    rota: "arquivoCandidatos",
    trechoMasculino: "O dono deste celular",
    trechoFeminino: "A dona deste celular"
  },
  {
    arquivo: "rota",
    opcao: "questionar-origem-aparelho",
    rota: "arquivoRota",
    trechoMasculino: "Ele planejou cada etapa",
    trechoFeminino: "Ela planejou cada etapa"
  },
  {
    arquivo: "recuperar",
    opcao: "exigir-resposta",
    rota: "arquivoRecuperar",
    trechoMasculino: "Ele escreveu que não quer destruir",
    trechoFeminino: "Ela escreveu que não quer destruir"
  }
].forEach(({ arquivo, opcao, rota, trechoMasculino, trechoFeminino }) => {
  test(`primeira resposta condicional fixa o monólogo ${rota}`, () => {
    const { executar, ler } = controlarAmbiente();

    executar(`abrirCelular(); abrirArquivos(); visualizarArquivo("${arquivo}"); voltarCelular(); abrirMensagens();`);
    executar(`escolherResposta("${opcao}");`);

    assert.equal(ler("state.dialogo.rotaMonologoArquivo"), rota);

    executar("fecharCelular(); iniciarConversa();");
    assert.equal(ler(`state.dialogo.falas.some((fala) => fala.texto.includes("${trechoMasculino}"))`), true);

    executar("encerrarConversa(); state.arquivos.enigmaIdentidadeResolvido = true; iniciarConversa();");
    assert.equal(ler(`state.dialogo.falas.some((fala) => fala.texto.includes("${trechoFeminino}"))`), true);
  });
});

test("quatro arquivos resolvidos substituem a rota individual pelo monólogo completo", () => {
  const { executar, ler } = controlarAmbiente();

  executar(`
    abrirCelular();
    abrirArquivos();
    visualizarArquivo("candidatos");
    visualizarArquivo("rota");
    visualizarArquivo("recuperar");
    voltarCelular();
    abrirMensagens();
    escolherResposta("questionar-arquivos");
    state.celular.resetStatus = RESET_STATUS.AGENDADO;
    voltarCelular();
    abrirArquivos();
    visualizarArquivo("identidade");
    resolverEnigmaIdentidade("ela");
  `);

  assert.equal(ler("state.dialogo.rotaMonologoArquivo"), "arquivoCandidatos");
  assert.equal(ler("obterFaseMonologo()"), "todosArquivos");

  executar("fecharCelular(); iniciarConversa();");
  assert.equal(ler('state.dialogo.falas[0].texto.includes("Candidatos, rota, recuperação")'), true);

  executar("encerrarConversa(); state.modo = 'celular'; concluirResetRemoto(); fecharCelular(); iniciarConversa();");
  assert.equal(ler("obterFaseMonologo()"), "todosArquivos");
  assert.equal(ler('state.dialogo.falas[0].texto.includes("Candidatos, rota, recuperação")'), true);
});

test("dados narrativos mantêm referências válidas e identificadores únicos", () => {
  const { ler } = controlarAmbiente();
  const raiz = path.resolve(__dirname, "..");
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const game = fs.readFileSync(path.join(raiz, "js/game.js"), "utf8");
  const idsHtml = [...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]);
  const idsReferenciados = [...game.matchAll(/getElementById\("([^"]+)"\)/g)].map((match) => match[1]);

  assert.equal(ler("new Set(DATA.celular.arquivosAntesReset.map((item) => item.id)).size"), 4);
  assert.equal(ler("Object.values(DATA.mensagens.dono.etapas).flatMap((etapa) => etapa.opcoes).length"), 14);
  assert.equal(
    ler(`(() => {
      const etapas = DATA.mensagens.dono.etapas;
      const arquivos = new Set(DATA.celular.arquivosAntesReset.map((item) => item.id));
      const monologos = DATA.monologos[DATA.cena.id];
      const opcoes = Object.values(etapas).flatMap((etapa) => etapa.opcoes);
      return new Set(opcoes.map((opcao) => opcao.id)).size === opcoes.length
        && opcoes.every((opcao) => opcao.proxima === null || etapas[opcao.proxima])
        && opcoes.every((opcao) => !opcao.requerArquivoVisto || arquivos.has(opcao.requerArquivoVisto))
        && opcoes.every((opcao) => !opcao.rotaMonologo || monologos[opcao.rotaMonologo]);
    })()`),
    true
  );
  assert.equal(new Set(idsHtml).size, idsHtml.length);
  assert.equal(idsReferenciados.every((id) => idsHtml.includes(id)), true);
  assert.equal(ler("Object.values(el).every(Boolean)"), true);
});

test("todas as opções cadastradas aplicam texto, resposta e próxima etapa", () => {
  const base = controlarAmbiente();
  const opcoes = JSON.parse(base.ler(`JSON.stringify(
    Object.entries(DATA.mensagens.dono.etapas).flatMap(([etapaId, etapa]) =>
      etapa.opcoes.map((opcao) => ({ etapaId, ...opcao }))
    )
  )`));

  assert.equal(opcoes.length, 14);

  opcoes.forEach((opcao) => {
    const { executar, ler } = controlarAmbiente();
    executar(`state.mensagens.etapa = ${JSON.stringify(opcao.etapaId)};`);
    if (opcao.etapaId !== "celular-encontrado") {
      executar('state.mensagens.historico.push({ autor: "dono", texto: "contexto" });');
    }
    if (opcao.requerArquivoVisto) {
      executar(`state.arquivos.vistos.add(${JSON.stringify(opcao.requerArquivoVisto)});`);
    }

    executar(`escolherResposta(${JSON.stringify(opcao.id)});`);

    assert.equal(ler("state.mensagens.historico.at(-1).texto"), opcao.texto);
    assert.equal(ler("state.mensagens.proximaEtapa"), opcao.proxima);
    opcao.resposta.forEach((resposta) => {
      assert.equal(ler(`state.mensagens.fila.includes(${JSON.stringify(resposta)})`), true);
    });
  });
});

test("opção condicional não pode ser escolhida sem examinar seu arquivo", () => {
  const { executar, ler } = controlarAmbiente();

  executar('abrirCelular(); abrirMensagens(); escolherResposta("questionar-origem-aparelho");');

  assert.equal(ler("state.mensagens.historico.length"), 0);
  assert.equal(ler("state.mensagens.etapa"), "celular-encontrado");
  assert.equal(ler("state.dialogo.rotaMonologoArquivo"), null);
});

test("cronômetro formata minutos e segundos", () => {
  const { ler } = controlarAmbiente();

  assert.equal(ler("formatarDuracao(60)"), "01:00");
  assert.equal(ler("formatarDuracao(59)"), "00:59");
  assert.equal(ler("formatarDuracao(0)"), "00:00");
});

test("reset conclui em segundo plano quando o celular está fechado", () => {
  const { executar, executarProximoTimeout, ler } = controlarAmbiente();

  executar('abrirCelular(); state.mensagens.historico.push({ autor: "protagonista", texto: "teste" }); agendarResetRemoto(); fecharCelular();');
  executarProximoTimeout();

  assert.equal(ler("state.celular.resetStatus"), "concluido");
  assert.equal(ler("state.mensagens.historico.length"), 0);
  assert.equal(ler("state.mensagens.historicoAntesReset.length"), 1);
  assert.equal(ler("state.celular.resetTimer"), null);
  assert.equal(ler("state.celular.resetInterval"), null);
  assert.equal(ler("state.mensagens.timer"), null);

  executar("abrirCelular(); abrirArquivos();");
  assert.equal(ler('el.filesList.children[0].textContent'), "Nenhum arquivo encontrado.");
});
