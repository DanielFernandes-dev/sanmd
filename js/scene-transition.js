/** Um controlador visual por jogo. Nenhum estado de animação entra no snapshot. */
function criarSceneTransitionController({ el, services, document, window, config }) {
  const overlay = el.scene.transitionOverlay;
  const timing = config.sceneTransition;
  let transitioning = false;
  const cache = new Map();
  const wait = ms => new Promise(resolve => (window.setTimeout?.bind(window) ?? setTimeout)(resolve, ms));

  function blockInput(event) {
    if (!transitioning) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  // Capture também protege teclado e elementos fora da área visual (Bolsa/celular).
  for (const type of ["click", "dblclick", "pointerdown", "pointerup", "touchstart", "touchend", "keydown", "keyup", "submit"]) {
    document.addEventListener(type, blockInput, { capture: true, passive: false });
  }

  async function fade(from, to, duration) {
    overlay.style.opacity = String(to);
    if (!overlay.animate) { await wait(duration); return; }
    const animation = overlay.animate([{ opacity: from }, { opacity: to }],
      { duration, easing: "ease-in-out" });
    try {
      // O limite também libera WebViews que não concluam a animação.
      await Promise.race([animation.finished, wait(duration + 100)]);
    } finally {
      animation.cancel();
    }
  }

  function prepareSceneImages(sources) {
    return Promise.all([...new Set(sources.filter(Boolean))].map(source => {
      const src = window.URL ? new window.URL(source, document.baseURI).href : source;
      if (!cache.has(src)) {
        const pending = new Promise((resolve, reject) => {
          const img = new window.Image();
          const timer = setTimeout(() => finish(new Error(`Tempo excedido ao carregar ${src}`)), timing.assetTimeout);
          function finish(error) {
            clearTimeout(timer);
            img.onload = img.onerror = null;
            if (error) reject(error); else resolve(img);
          }
          img.onerror = () => finish(new Error(`Não foi possível carregar ${src}`));
          img.onload = async () => {
            try { if (img.decode) await img.decode(); finish(); }
            catch (error) { finish(error); }
          };
          img.src = src;
        }).catch(error => { cache.delete(src); throw error; });
        cache.set(src, pending);
      }
      return cache.get(src);
    }));
  }

  async function runSceneTransition(loadScene) {
    if (transitioning) return false;
    transitioning = true;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const activeElement = document.activeElement;
    try {
      services.fecharMenuIrPara();
      el.scene.interactionStatus.textContent = "";
      activeElement?.blur?.();
      overlay.classList.add("transitioning");
      services.definirBotoes();
      await fade(0, 1, reduced ? timing.reduced : timing.out);
      await loadScene();
      // Deixa layout/composição da nova cena ocorrerem sob a cobertura opaca.
      await wait(reduced ? 0 : timing.hold);
      await fade(1, 0, reduced ? timing.reduced : timing.in);
      return true;
    } catch (error) {
      console.error("Falha na transição de cena", error);
      el.scene.interactionStatus.textContent = "Não foi possível mudar de cena. Tente novamente.";
      return false;
    } finally {
      overlay.style.opacity = "0";
      overlay.classList.remove("transitioning");
      transitioning = false;
      services.definirBotoes();
      if (activeElement?.isConnected && !activeElement.disabled) activeElement.focus();
      else el.scene.btnIrPara.focus();
    }
  }

  return Object.freeze({ runSceneTransition, prepareSceneImages,
    isSceneTransitioning: () => transitioning });
}
