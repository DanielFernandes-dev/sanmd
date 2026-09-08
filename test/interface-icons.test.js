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
    const trecho = html.match(new RegExp(`<button id="${id}" type="button" aria-label="${rotulo}"(?: hidden)?>([\\s\\S]*?)<\\/button>`));
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

test("tela inicial usa grade 4x2 de apps com ícones SVG e botão Voltar", () => {
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(raiz, "styles.css"), "utf8");
  const appsHabilitados = ["btn-mensagens", "btn-galeria", "btn-arquivos"];
  for (const id of appsHabilitados) {
    assert.match(html, new RegExp(`<button id="${id}" class="phone-app phone-app--[a-z]+" type="button"`));
  }
  const appsDesabilitados = ["btn-telefone", "btn-notas", "btn-config", "btn-mapas", "btn-musica"];
  for (const id of appsDesabilitados) {
    assert.match(html, new RegExp(`<button id="${id}" class="phone-app phone-app--[a-z]+" type="button"[^>]*disabled`));
  }
  assert.equal((html.match(/class="phone-app phone-app--/g) || []).length, 8);
  assert.match(html, /data-phone-theme="lulith"/);
  assert.doesNotMatch(html, /class="app"/);
  assert.doesNotMatch(html, /<span class="app-icon">/);
  assert.match(html, /<button id="btn-voltar" type="button" aria-label="Voltar"><span class="back-icon" aria-hidden="true">[^<]+<\/span><\/button>/);
  assert.match(css, /#apps-grid\s*\{[^}]*grid-template-columns:\s*repeat\(4, minmax\(0, 1fr\)\)/s);
  assert.match(css, /\[data-phone-theme="mj"\] \.phone-app--galeria\s*\{[^}]*#d75d8c/s);
  assert.match(css, /#btn-voltar\s*\{[^}]*border:\s*0;[^}]*border-radius:\s*0;[^}]*background:\s*transparent;/s);
  assert.match(css, /#btn-voltar \.back-icon\s*\{[^}]*color:\s*#f2b5cd;/s);
  assert.match(css, /#btn-conversar,\s*#btn-ir-para,\s*#btn-celular,\s*#btn-bolsa,\s*#dialogue-box\s*\{[^}]*-webkit-tap-highlight-color:\s*transparent;/s);
});

test("celular usa wallpaper real sem transformar mockups em interface", () => {
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const css = fs.readFileSync(path.join(raiz, "styles.css"), "utf8");
  assert.match(css, /#phone-screen\s*\{[^}]*wallpaper\.png[^}]*cover/s);
  assert.doesNotMatch(html + css, /assets\/interfaces\/(?:save|celular)\.png/);
  assert.ok(fs.existsSync(path.join(pastaIcones, "..", "wallpaper.png")));
  for (const id of ["btn-tirar-foto", "btn-carregar-foto", "btn-excluir-foto", "btn-cancelar-foto"]) {
    assert.match(html, new RegExp(`<button id="${id}"[^>]*type="button"`));
  }
  assert.match(html, /<input id="gallery-photo-name"[^>]*maxlength="28"/);
  assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /#gallery-grid\s*\{[^}]*overflow-y: auto/s);
});
