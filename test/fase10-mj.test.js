const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const raiz = path.resolve(__dirname, "..");
const caminhoSprite = "assets/art/characters/mj/vn/mj__vn__neutral.svg";

test("MJ genérica usa um sprite externo estático e provisório", () => {
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const sprite = fs.readFileSync(path.join(raiz, caminhoSprite), "utf8");

  assert.match(html, /<img id="personagem"/);
  assert.doesNotMatch(html, /<svg id="personagem"/);
  assert.match(sprite, /width="128" height="176" viewBox="0 0 128 176"/);
  assert.match(sprite, /shape-rendering="crispEdges"/);
  assert.doesNotMatch(sprite, /<animate|<script/);
});

test("dados separam personagem, pose, slot e caminho do sprite", () => {
  const data = fs.readFileSync(path.join(raiz, "js/data.js"), "utf8");
  const contexto = vm.createContext({});
  vm.runInContext(`${data}\nthis.resultado = DATA;`, contexto);

  assert.deepEqual(
    JSON.parse(JSON.stringify(contexto.resultado.cena.personagensVisuais)),
    [{ id: "mj", pose: "neutral", slot: "center" }]
  );
  assert.equal(contexto.resultado.personagens.mj.sprites.neutral, caminhoSprite);
  assert.deepEqual(JSON.parse(JSON.stringify(contexto.resultado.cena.personagensPresentes)), []);
});

test("pipeline web inclui a pasta de assets", () => {
  const pacote = JSON.parse(fs.readFileSync(path.join(raiz, "package.json"), "utf8"));
  assert.match(pacote.scripts["copy:web"], /cp -r js assets www\//);
});
