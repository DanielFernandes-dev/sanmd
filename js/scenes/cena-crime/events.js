SANMD_CENAS.cena_crime = function registrarEventosCrime({ state, el, services, data, eventosInteracao }) {
  function concluirInvestigacao() {
    const crime = state.sceneState.crime_sala;
    if (state.localizacao.local !== "cena_crime" || state.localizacao.cena !== "crime_sala"
      || !crime?.firstEvidenceExamined || !crime?.lockedEvidenceOpened
      || state.aparelho.originalPhoneStatus !== "working") return false;
    state.aparelho.originalPhoneStatus = "broken";
    state.aparelho.activePhone = null;
    services.definirBotoes();
    services.iniciarFalas(data.monologos.crime_sala.phoneBreak);
    return true;
  }
  eventosInteracao.crimeEvidenceExamined = ({ sceneId }) => {
    if (sceneId !== "crime_sala") return;
    if (!concluirInvestigacao()) el.scene.interactionStatus.textContent = "Os cacos se espalharam a partir da mesa.";
  };
  eventosInteracao.crimeCaseOpened = ({ sceneId }) => {
    if (sceneId !== "crime_sala") return;
    if (!concluirInvestigacao()) el.scene.interactionStatus.textContent = "Há documentos dentro. Melhor examinar o resto da sala.";
  };
  return () => {
    delete eventosInteracao.crimeEvidenceExamined;
    delete eventosInteracao.crimeCaseOpened;
  };
};
