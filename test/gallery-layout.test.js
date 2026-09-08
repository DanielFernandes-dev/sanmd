const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const raiz = path.resolve(__dirname, "..");
const css = fs.readFileSync(path.join(raiz, "styles.css"), "utf8");
const game = fs.readFileSync(path.join(raiz, "js/game.js"), "utf8");

test("grade da galeria dimensiona cada linha pelo conteúdo completo dos cards", () => {
  assert.match(css, /#gallery-grid\s*\{[^}]*grid-auto-rows:\s*max-content;[^}]*align-content:\s*start;[^}]*align-items:\s*start;/s);
  assert.match(css, /\.gallery-photo\s*\{[^}]*display:\s*grid;[^}]*grid-template-rows:\s*auto auto;[^}]*height:\s*auto;/s);
  assert.doesNotMatch(css, /#gallery-grid\s*\{[^}]*grid-template-rows:\s*repeat\([^}]*(?:1fr|minmax\()/s);
});

test("thumbnail e metadados pertencem ao fluxo normal do card preenchido", () => {
  assert.match(game, /botao\.appendChild\(criarComposicaoFoto\(save\)\)/);
  assert.match(game, /metadados\.className = "gallery-photo-metadata"/);
  assert.match(game, /nome\.className = "gallery-photo-name"/);
  assert.match(game, /data\.className = "gallery-photo-date"/);
  assert.match(game, /hora\.className = "gallery-photo-time"/);
  assert.match(game, /metadados\.appendChild\(nome\);[\s\S]*metadados\.appendChild\(data\);[\s\S]*metadados\.appendChild\(hora\);[\s\S]*botao\.appendChild\(metadados\);/);
  assert.match(css, /\.gallery-photo-name\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*white-space:\s*normal;/s);
});
