const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const raiz = path.resolve(__dirname, "..");
const pastaIcones = path.join(raiz, "assets/interfaces/icons");
const icones = ["icon-conversar.svg", "icon-ir-para.svg", "icon-celular.svg"];

test("ícones principais são SVGs pixel art sem conteúdo externo", () => {
  for (const arquivo of icones) {
    const svg = fs.readFileSync(path.join(pastaIcones, arquivo), "utf8");
    assert.match(svg, /viewBox="0 0 32 32"/);
    assert.match(svg, /fill="currentColor"/);
    assert.match(svg, /shape-rendering="crispEdges"/);
    assert.match(svg, /aria-hidden="true"/);
    assert.doesNotMatch(svg, /<(?:image|text|circle|ellipse|linearGradient|radialGradient|filter)\b/i);
    assert.doesNotMatch(svg, /\.(?:png|jpe?g|webp|gif)/i);
  }
});

test("botões principais preservam semântica e usam ícones decorativos", () => {
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const botoes = [
    ["btn-conversar", "Conversar"],
    ["btn-ir-para", "Ir para"],
    ["btn-celular", "Celular"]
  ];

  for (const [id, rotulo] of botoes) {
    const trecho = html.match(new RegExp(`<button id="${id}" type="button" aria-label="${rotulo}">([\\s\\S]*?)<\\/button>`));
    assert.ok(trecho, `${id} deve continuar sendo um button com nome acessível`);
    assert.match(trecho[1], /<svg class="action-icon"[^>]*aria-hidden="true">/);
    assert.equal(trecho[1].replace(/<[^>]+>/g, "").trim(), "");
  }
});

test("CSS mantém ícones discretos, coloridos por currentColor e sobre o cenário", () => {
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(raiz, "styles.css"), "utf8");
  assert.match(css, /\.action-icon\s*\{[^}]*width:\s*40px;[^}]*height:\s*40px;/s);
  assert.match(css, /\.action-icon\s*\{[^}]*color:\s*#f4f0df;[^}]*pointer-events:\s*none;/s);
  assert.match(css, /button:hover:not\(:disabled\) \.action-icon\s*\{[^}]*color:\s*#e8b34b;/s);
  assert.doesNotMatch(html, /id="sidebar"/);
  assert.match(css, /grid-template-columns:\s*minmax\(0, 1fr\) clamp\(72px, 7vw, 96px\)/);
  assert.match(css, /#vn-area\s*\{[^}]*grid-column:\s*1 \/ -1;[^}]*overflow:\s*hidden;/s);
  assert.match(css, /#btn-conversar,[^}]*#btn-celular\s*\{[^}]*grid-column:\s*2;[^}]*z-index:\s*2;/s);
});
