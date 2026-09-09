const CONFIG = Object.freeze({
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
