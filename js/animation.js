/** Apresentação por instância: tempos, acessibilidade e execução de fades. */
function criarSistemaAnimacoes({ window, document, config }) {
  const agendar = window.setTimeout?.bind(window) ?? setTimeout;
  const cancelar = window.clearTimeout?.bind(window) ?? clearTimeout;
  const movimentoReduzido = () => Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);

  function duracaoVisual(duration, reduced = 0) {
    return movimentoReduzido() ? reduced : duration;
  }

  function esperarAnimacao(duration) {
    return new Promise(resolve => agendar(resolve, duration));
  }

  async function animarFade(element, from, to, duration) {
    element.style.opacity = String(to);
    if (!element.animate) return esperarAnimacao(duration);
    const animation = element.animate([{ opacity: from }, { opacity: to }],
      { duration, easing: "ease-in-out" });
    let timeout;
    try {
      // WebViews podem não resolver finished; nunca prender o input nesse caso.
      await Promise.race([animation.finished,
        new Promise(resolve => { timeout = agendar(resolve, duration + 100); })]);
    } finally {
      cancelar(timeout);
      animation.cancel();
    }
  }

  function configurarAnimacoes() {
    const style = document.documentElement?.style;
    for (const [name, duration] of Object.entries({
      'personagem-entrada': config.transicaoPersonagemEntrada,
      'personagem-saida': config.transicaoPersonagemSaida,
      'celular': config.transicaoCelular,
      'foto-flash': config.duracaoFlashFoto,
      'reset': config.duracaoReset
    })) style?.setProperty(`--duracao-${name}`, `${duration}ms`);
  }

  return Object.freeze({ movimentoReduzido, duracaoVisual, esperarAnimacao, animarFade, configurarAnimacoes });
}
