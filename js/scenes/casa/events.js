SANMD_CENAS.casa = function registrarEventosCasa({ state, el, services, eventosInteracao }) {
  eventosInteracao.casaExitDoor = () => {
    el.scene.interactionStatus.textContent = services.podeSairDaCasa()
      ? "Estamos prontos. Podemos sair pelo Ir para." : "Minha bolsa e meu telefone. E preciso falar com James.";
  };
  eventosInteracao.mjBagCollected = () => {
    el.scene.interactionStatus.textContent = "Peguei minha bolsa.";
    services.definirBotoes();
  };
  eventosInteracao.mjPhoneCollected = () => {
    state.aparelho.originalPhoneStatus = "working";
    state.aparelho.activePhone = "mj";
    state.aparelho.phoneTheme = "mj";
    el.scene.interactionStatus.textContent = "Peguei meu telefone.";
    services.definirBotoes();
  };
  return () => {
    delete eventosInteracao.casaExitDoor;
    delete eventosInteracao.mjBagCollected;
    delete eventosInteracao.mjPhoneCollected;
  };
};
