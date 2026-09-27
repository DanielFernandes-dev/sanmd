const CONFIG = Object.freeze({
  cutscene: Object.freeze({
    lulithCodigo: Object.freeze({
      frame01: 2000, frame02: 1550, frame03: 1050, frame04: 1450, frame05: 1300,
      frame06: 950, frame07: 900, frame08: 400, frame09: 1150, frame10: 1700,
      entryFade: 200, exitFade: 280, frameBlend: 100, impactShake: 140, errorShake: 90,
      errorFlash: 110, audioTimeout: 1500, audioFade: 180, audioFadeTick: 16
    }),
    skipDoubleInputWindow: 350, introBlackHold: 5000, titleReveal: 1200,
    titleHold: 650, titleExpansion: 2000, laughReveal: 450, completeTitleHold: 1600,
    titleExit: 1800, postTitleBlackHold: 550, lampLightDelay: 70,
    lampReveal: 1100, reducedMotion: 100
  }),
  sceneTransition: Object.freeze({ out: 320, hold: 100, in: 400, reduced: 10, assetTimeout: 10000 }),
  velocidadeDigitacao: 65,
  intervaloMensagemDono: 1200,
  cooldownPrimeiraResposta: 60 * 1000,
  transicaoCelular: 280,
  transicaoPersonagemEntrada: 320,
  transicaoPersonagemSaida: 280,
  esperaAntesReset: 60 * 1000,
  duracaoReset: 2800,
  itensPorPaginaBolsa: 9,
  duracaoFlashFoto: 140,
  intervaloRelogio: 1000,
  intervaloCronometroReset: 250,
  tamanhoNomeFoto: 28,
  tamanhoMensagem: 160,
  limiteBotoesPaginacao: 7
});

const SAVE_VERSION = 1;

const DIAS = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const RESET_STATUS = Object.freeze({
  INATIVO: "inativo",
  AGENDADO: "agendado",
  EXECUTANDO: "executando",
  CONCLUIDO: "concluido"
});
