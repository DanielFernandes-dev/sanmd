const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

function criarNarrativa() {
  const contexto = vm.createContext({});
  for (const arquivo of ["data.js", "monologues.js"]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, "../js", arquivo), "utf8"), contexto);
  }
  return vm.runInContext("({ DATA, foiCelularColetado, resolverFalasMonologo })", contexto);
}

test("dados narrativos são serializáveis e independentes do estado global", () => {
  const { DATA } = criarNarrativa();
  const copia = JSON.parse(JSON.stringify(DATA.monologos));
  for (const [id, monologos] of Object.entries(DATA.monologos)) {
    assert.equal(Object.getOwnPropertyDescriptor(monologos, "inicial").get, undefined);
    assert.equal(copia[id].inicial.pendente[0].texto, monologos.inicial.pendente[0].texto);
  }
});

test("aquisição é reconhecida pelo inventário ou pelo estado persistido da cena", () => {
  const { foiCelularColetado } = criarNarrativa();
  assert.equal(foiCelularColetado(), false);
  assert.equal(foiCelularColetado({}, ["lulith_phone"]), true);
  assert.equal(foiCelularColetado({ beco_fundo: { lulithPhoneCollected: true } }, []), true);
});

test("monólogo acompanha abertura, coleta e ativação sem alterar dados ou contexto", () => {
  const { DATA, resolverFalasMonologo: resolver } = criarNarrativa();
  const dadosAntes = JSON.stringify(DATA);
  const contextos = [
    { sceneState: {}, inventory: [], aparelho: { activePhone: null } },
    { sceneState: { beco_fundo: { safeOpened: true } }, inventory: [] },
    { sceneState: {}, inventory: ["lulith_phone"] },
    { sceneState: { beco_fundo: { safeOpened: true, lulithPhoneCollected: true } },
      inventory: [], aparelho: { activePhone: "lulith" } }
  ];
  for (const [id, monologos] of Object.entries(DATA.monologos)) {
    for (const [indice, contexto] of contextos.entries()) {
      const antes = JSON.stringify(contexto);
      const variante = indice === 0 ? "pendente" : indice === 1
        ? (id === "beco_fundo" ? "aberto" : "pendente") : indice === 2
          ? "coletado" : (id === "beco_fundo" ? "ativo" : "coletado");
      assert.equal(resolver(monologos, "inicial", contexto), monologos.inicial[variante]);
      assert.equal(JSON.stringify(contexto), antes);
    }
  }
  assert.equal(JSON.stringify(DATA), dadosAntes);
});

test("fases estáticas e variantes de identidade continuam acessíveis", () => {
  const { DATA, resolverFalasMonologo: resolver } = criarNarrativa();
  const monologos = DATA.monologos.beco_fundo;
  assert.equal(resolver(monologos, "identidadeResolvida", {}), monologos.identidadeResolvida);
  assert.equal(resolver(monologos, "arquivoRota", {}), monologos.arquivoRota.masculino);
  assert.equal(resolver(monologos, "arquivoRota", { arquivos: { enigmaIdentidadeResolvido: true } }),
    monologos.arquivoRota.feminino);
  assert.equal(resolver(undefined, "inicial", {}), undefined);
});
