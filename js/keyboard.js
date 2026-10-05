/**
 * Cria o sistema do teclado virtual com dependências da instância.
 * @param {GameContext} context
 * @returns {Object} Renderização do teclado, consumida pelo sistema de entrada de texto.
 */
function criarSistemaTeclado(context) {
  const { state, el, document, services } = context;

  const LINHAS_QWERTY = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["shift", "z", "x", "c", "v", "b", "n", "m", "backspace"],
    ["layoutNumeros", "acentos", "espaco", "ok"]
  ];

  const LINHAS_NUMEROS = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["-", "_", ".", ",", "!", "?", "@", "#", ":", ";"],
    ["layoutLetras", "backspace", "espaco", "ok"]
  ];

  const LINHAS_COORDENADAS = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["°", "'", '"', "N", "S", "E", "W", "backspace"],
    ["espaco", "ok"]
  ];

  const ACENTOS_MINUSCULOS = ["á", "à", "â", "ã", "é", "ê", "í", "ó", "ô", "õ", "ú", "ç"];
  const ACENTOS_MAIUSCULOS = ["Á", "À", "Â", "Ã", "É", "Ê", "Í", "Ó", "Ô", "Õ", "Ú", "Ç"];

  function renderizarAcentos() {
    el.phone.textEntryAccents.replaceChildren();
    const aberto = state.texto.aberto && state.texto.painelAcentos;
    if (!aberto) {
      el.phone.textEntryAccents.classList.add("oculto");
      return;
    }
    const letras = state.texto.shift ? ACENTOS_MAIUSCULOS : ACENTOS_MINUSCULOS;
    const linha = document.createElement("div");
    linha.className = "game-keyboard-row";
    letras.forEach((letra) => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.dataset.key = letra;
      botao.className = "accent-key";
      botao.textContent = letra;
      linha.appendChild(botao);
    });
    el.phone.textEntryAccents.appendChild(linha);
    el.phone.textEntryAccents.classList.remove("oculto");
  }

  /** Criar tecla.
   * @param {string} tecla
   */
  function criarTecla(tecla) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.dataset.key = tecla;
    botao.className = "game-key";
    if (tecla === "shift") {
      botao.textContent = "⇧";
      if (state.texto.shift) botao.classList.add("game-key--ativa");
    } else if (tecla === "backspace") {
      botao.textContent = "⌫";
      botao.classList.add("game-key--special");
    } else if (tecla === "espaco") {
      botao.textContent = "ESPAÇO";
      botao.classList.add("game-key--space");
    } else if (tecla === "ok") {
      botao.textContent = state.texto.config?.confirmLabel ?? "OK";
      botao.classList.add("game-key--special", "game-key--wide");
    } else if (tecla === "layoutNumeros") {
      botao.textContent = "123";
      botao.classList.add("game-key--special");
    } else if (tecla === "layoutLetras") {
      botao.textContent = "abc";
      botao.classList.add("game-key--special");
    } else if (tecla === "acentos") {
      botao.textContent = "ÁÇ";
      botao.classList.add("game-key--special");
      if (state.texto.painelAcentos) botao.classList.add("game-key--ativa");
    } else {
      botao.textContent = state.texto.shift && /^[a-z]$/.test(tecla) ? tecla.toUpperCase() : tecla;
    }
    return botao;
  }

  /** Montar linha.
   * @param {string[]} teclas
   */
  function montarLinha(teclas) {
    const linha = document.createElement("div");
    linha.className = "game-keyboard-row";
    teclas.forEach((tecla) => linha.appendChild(criarTecla(tecla)));
    return linha;
  }

  function renderizarTeclado() {
    if (!state.texto.aberto) {
      el.phone.gameKeyboard.replaceChildren();
      el.phone.textEntryAccents.classList.add("oculto");
      return;
    }
    const linhas = state.texto.layout === "coordenadas" ? LINHAS_COORDENADAS
      : state.texto.layout === "numeros" ? LINHAS_NUMEROS : LINHAS_QWERTY;
    el.phone.gameKeyboard.replaceChildren(...linhas.map(montarLinha));
    renderizarAcentos();
  }

  return Object.freeze({
    renderizarAcentos,
    renderizarTeclado
  });
}
