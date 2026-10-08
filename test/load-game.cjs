const fs = require("node:fs");
const path = require("node:path");

// Os testes executam os scripts da página na mesma ordem e pré-registram os
// módulos de cena que o navegador busca ao entrar em cada local.
module.exports = function carregarScripts(raiz) {
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const scripts = [...html.matchAll(/<script src="([^"?]+)(?:\?[^\"]*)?"><\/script>/g)]
    .flatMap(([, arquivo]) => arquivo === "js/bootstrap.js"
      ? ["js/scenes/casa/events.js", "js/scenes/cena-crime/events.js", "js/scenes/delegacia/events.js", arquivo]
      : [arquivo])
    .map(arquivo => fs.readFileSync(path.join(raiz, arquivo), "utf8"))
    .join("\n")
    .replace("titleMenu.iniciar({ bloqueado: true });", "game.iniciar();")
    .replace("game.services.iniciarCutscene('intro_abertura');", "");
  // O bootstrap cria a instância (const game) no mesmo script. O harness expõe
  // a API da instância nos globals para os testes continuarem usando o formato antigo,
  // achatando el por componente (scene/bag/dialogue/phone/gallery).
  return `
globalThis.window ??= {};
window.setTimeout = callback => Promise.resolve().then(callback);
window.Image = class {
  set src(value) { Promise.resolve().then(() => this.onload?.()); }
  decode() { return Promise.resolve(); }
};
document.getElementById('scene-transition-overlay').style = {};
${scripts}
globalThis.state = game.state;
globalThis.el = Object.assign({}, ...Object.values(game.el));
globalThis.saveRepository = game.saveRepository;
globalThis.eventosInteracao = game.eventosInteracao;
for (const [nome, fn] of Object.entries(game.services)) globalThis[nome] = fn;
`;
};

// Executa trechos síncronos no mesmo escopo global e aguarda navegações e interações animadas.
module.exports.executar = function(contexto, codigo) {
  const vm = require("node:vm");
  if (!/\b(?:irPara(?:Local)?|executarHotspot)\(/.test(codigo)) return vm.runInContext(codigo, contexto);
  return (async () => {
    let offset = 0;
    for (const match of codigo.matchAll(/\b(?:irPara(?:Local)?|executarHotspot)\([^)]*\);?/g)) {
      vm.runInContext(codigo.slice(offset, match.index), contexto);
      await vm.runInContext(match[0], contexto);
      offset = match.index + match[0].length;
    }
    return vm.runInContext(codigo.slice(offset), contexto);
  })();
};
