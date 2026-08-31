const DATA = {
  cena: {
    id: "sala",
    nome: "Sala — Noite",
    personagensPresentes: []
  },

  personagem: {
    id: "protagonista",
    nome: "Você"
  },

  conversas: {
    presenciais: {}
  },

  monologos: {
    sala: {
      inicial: [
        { autor: "Você", texto: "Não há ninguém aqui para conversar." },
        { autor: "Você", texto: "(Talvez o celular tenha alguma resposta.)" }
      ],
      aposPrimeiroEnvio: [
        { autor: "Você", texto: "(Enviei a mensagem. Agora é esperar.)" },
        { autor: "Você", texto: "(Se alguém responder, talvez eu descubra por que este celular está aqui.)" }
      ],
      conversaConcluida: [
        { autor: "Você", texto: "(Essa conversa deixou tudo ainda mais estranho.)" },
        { autor: "Você", texto: "(Preciso descobrir quem colocou este celular na minha casa.)" }
      ]
    }
  },

  mensagens: {
    dono: {
      inicio: "celular-encontrado",
      abertura: [
        "Ah... você encontrou o celular, foi?",
        "Relaxa, kk. É só um teste."
      ],
      etapas: {
        "celular-encontrado": {
          recebidas: [],
          opcoes: [
            {
              id: "perguntar-identidade",
              texto: "Quem é você?",
              resposta: ["Minha identidade não importa. Ainda não."],
              proxima: "explicar-teste"
            },
            {
              id: "questionar-invasao",
              texto: "Por que seu celular estava na minha casa?",
              resposta: ["Porque encontrar o aparelho era a primeira parte."],
              proxima: "explicar-teste"
            },
            {
              id: "exigir-resposta",
              texto: "Isso não tem graça. Explique agora.",
              resposta: ["Direto ao ponto. É uma qualidade útil."],
              proxima: "explicar-teste"
            }
          ]
        },
        "explicar-teste": {
          recebidas: ["Recrutamento e lógica, amigo. Nada demais. kk"],
          opcoes: [
            {
              id: "contestar-teste",
              texto: "Um teste? O aparelho estava na MINHA casa.",
              resposta: ["Exatamente. Precisávamos saber o que você faria com ele."],
              proxima: "questionar-confianca"
            },
            {
              id: "recusar-teste",
              texto: "Não aceitei participar de teste nenhum.",
              resposta: ["Mesmo assim, você abriu as mensagens. Curiosidade conta."],
              proxima: "questionar-confianca"
            }
          ]
        },
        "questionar-confianca": {
          recebidas: ["Até aqui, você está indo melhor do que esperávamos."],
          opcoes: [
            {
              id: "questionar-confianca",
              texto: "...E por que eu acreditaria em você?",
              resposta: ["porque esse eh o nome do jogo kk"],
              proxima: "encerrar-contato"
            }
          ]
        },
        "encerrar-contato": {
          recebidas: ["Pense bem antes de decidir o que fazer com o celular."],
          opcoes: [
            {
              id: "investigar",
              texto: "Vou descobrir quem colocou isso aqui.",
              resposta: ["É exatamente isso que esperamos de você."],
              proxima: null
            },
            {
              id: "encerrar",
              texto: "Essa conversa acabou.",
              resposta: ["Por enquanto. kk"],
              proxima: null
            }
          ]
        }
      }
    }
  }
};
