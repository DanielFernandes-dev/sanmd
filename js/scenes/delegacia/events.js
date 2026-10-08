SANMD_CENAS.delegacia = function registrarEventosDelegacia({ services, eventosInteracao }) {
  eventosInteracao.mjNoteRead = ({ sceneId }) => {
    if (sceneId === "delegacia_mesa_mj") services.abrirBilhete({ returnHotspotId: "mj_note" });
  };
  eventosInteracao.mjComputerUsed = ({ sceneId }) => {
    if (sceneId === "delegacia_mesa_mj") services.abrirEstacaoTrabalho();
  };
  return () => {
    delete eventosInteracao.mjNoteRead;
    delete eventosInteracao.mjComputerUsed;
  };
};
