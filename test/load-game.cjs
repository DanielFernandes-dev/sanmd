const fs = require("node:fs");
const path = require("node:path");

// Os testes executam os mesmos scripts e a mesma ordem usados no navegador.
module.exports = function carregarScripts(raiz) {
  const html = fs.readFileSync(path.join(raiz, "index.html"), "utf8");
  const scripts = [...html.matchAll(/<script src="([^"?]+)(?:\?[^\"]*)?"><\/script>/g)]
    .map(([, arquivo]) => fs.readFileSync(path.join(raiz, arquivo), "utf8"))
    .join("\n");
  // O bootstrap cria a instância (const game) no mesmo script. O harness expõe
  // a API da instância nos globals para os testes continuarem usando o formato antigo,
  // achatando el por componente (scene/bag/dialogue/phone/gallery).
  return `${scripts}
globalThis.state = game.state;
globalThis.el = Object.assign({}, ...Object.values(game.el));
globalThis.saveRepository = game.saveRepository;
globalThis.eventosInteracao = game.eventosInteracao;
for (const [nome, fn] of Object.entries(game.services)) globalThis[nome] = fn;
`;
};
