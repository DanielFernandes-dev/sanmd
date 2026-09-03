const DATA = {
  cena: {
    id: "sala",
    nome: "Sala — Noite",
    personagensPresentes: []
  },

  personagem: {
    id: "protagonista",
    nome: "MJ"
  },

  celular: {
    arquivosAntesReset: [
      {
        id: "identidade",
        nome: "REMETENTE.enc",
        tipo: "ASSINATURA CRIPTOGRAFADA",
        conteudo: "PRONOME_DO_REMETENTE: 5-12-1\nCHAVE: A=1, B=2, C=3...",
        enigma: true
      },
      {
        id: "candidatos",
        nome: "CANDIDATOS_04.log",
        tipo: "REGISTRO PARCIAL",
        conteudo: "04 perfis compatíveis em São Paulo. Critérios: investigação, ARG, escape room. Candidata 03: resposta acima da média."
      },
      {
        id: "rota",
        nome: "ROTA_013.txt",
        tipo: "ROTA DE ENTREGA",
        conteudo: "NOTA > COORDENADAS > COFRE > APARELHO. Não interferir depois da primeira escolha. Confirmar identidade pela solução."
      },
      {
        id: "recuperar",
        nome: "RECUPERAR.tmp",
        tipo: "FRAGMENTO CORROMPIDO",
        conteudo: "...não quero destruir o que fizeram. Quero recuperar o que tiraram de mim..."
      }
    ]
  },

  conversas: {
    presenciais: {}
  },

  monologos: {
    sala: {
      inicial: [
        { autor: "MJ", texto: "(O dono deste aparelho preparou o cofre para mim.)" },
        { autor: "MJ", texto: "(Há uma conversa esperando. Talvez eu descubra quem preparou tudo isso.)" }
      ],
      identidadeResolvida: [
        { autor: "MJ", texto: "(5-12-1. E-L-A.)" },
        { autor: "MJ", texto: "(Então o aparelho pertence a uma mulher. Ela queria que eu descobrisse isso.)" }
      ],
      aposPrimeiroEnvio: [
        { autor: "MJ", texto: "(Mensagem enviada. Quem está do outro lado sabia que eu chegaria até o cofre.)" },
        { autor: "MJ", texto: "(Ainda não sei com quem estou falando.)" }
      ],
      arquivoCandidatos: {
        masculino: [
          { autor: "MJ", texto: "(Quatro perfis compatíveis em São Paulo. Eu sou a candidata 03.)" },
          { autor: "MJ", texto: "(O dono deste celular está testando outras pessoas. Preciso descobrir quem são as outras três.)" }
        ],
        feminino: [
          { autor: "MJ", texto: "(Quatro perfis compatíveis em São Paulo. Eu sou a candidata 03.)" },
          { autor: "MJ", texto: "(A dona deste celular está testando outras pessoas. Preciso descobrir quem são as outras três.)" }
        ]
      },
      arquivoRota: {
        masculino: [
          { autor: "MJ", texto: "(Nota, coordenadas, cofre, aparelho. Ele planejou cada etapa antes de eu começar.)" },
          { autor: "MJ", texto: "(Se minhas escolhas estavam previstas, talvez a rota esconda mais do que um destino.)" }
        ],
        feminino: [
          { autor: "MJ", texto: "(Nota, coordenadas, cofre, aparelho. Ela planejou cada etapa antes de eu começar.)" },
          { autor: "MJ", texto: "(Se minhas escolhas estavam previstas, talvez a rota esconda mais do que um destino.)" }
        ]
      },
      arquivoRecuperar: {
        masculino: [
          { autor: "MJ", texto: "(Ele escreveu que não quer destruir o que fizeram. Quer recuperar o que tiraram dele.)" },
          { autor: "MJ", texto: "(Ainda não sei o que foi tirado, mas isso parece ser o motivo de todo o teste.)" }
        ],
        feminino: [
          { autor: "MJ", texto: "(Ela escreveu que não quer destruir o que fizeram. Quer recuperar o que tiraram dela.)" },
          { autor: "MJ", texto: "(Ainda não sei o que foi tirado, mas isso parece ser o motivo de todo o teste.)" }
        ]
      },
      todosArquivos: [
        { autor: "MJ", texto: "(Candidatos, rota, recuperação e a assinatura: ELA.)" },
        { autor: "MJ", texto: "(Os quatro arquivos formam uma mensagem. Ela queria medir não só minha lógica, mas o que eu escolheria investigar.)" }
      ],
      conversaConcluida: [
        { autor: "MJ", texto: "(Ela apagou tudo antes que eu pudesse comparar os arquivos.)" },
        { autor: "MJ", texto: "(Mas eu vi o bastante para saber que não sou a única.)" }
      ]
    }
  },

  mensagens: {
    dono: {
      inicio: "celular-encontrado",
      abertura: [
        "Você chegou mais rápido do que o previsto.",
        "Não confunda uma resposta com uma apresentação. kk"
      ],
      etapas: {
        "celular-encontrado": {
          recebidas: [],
          opcoes: [
            {
              id: "perguntar-identidade",
              texto: "Quem é você?",
              resposta: ["Essa pergunta não faz parte do que você precisa resolver agora."],
              proxima: "explicar-escolha"
            },
            {
              id: "questionar-escolha",
              texto: "Você deixou a nota e o cofre para mim?",
              resposta: ["Você encontrou um caminho e decidiu seguir cada parte dele."],
              proxima: "explicar-escolha"
            },
            {
              id: "questionar-origem-aparelho",
              texto: "Por que seu celular estava dentro daquele cofre?",
              resposta: ["Porque encontrar o aparelho era a primeira parte."],
              proxima: "explicar-teste",
              requerArquivoVisto: "rota",
              rotaMonologo: "arquivoRota"
            },
            {
              id: "exigir-resposta",
              texto: "Isso não tem graça. Explique agora.",
              resposta: ["Direto ao ponto. É uma qualidade útil."],
              proxima: "explicar-teste",
              requerArquivoVisto: "recuperar",
              rotaMonologo: "arquivoRecuperar"
            },
            {
              id: "questionar-arquivos",
              texto: "O que significam os arquivos sobre candidatos?",
              resposta: ["Significam apenas o que está escrito. Não vou interpretar por você."],
              proxima: "explicar-escolha",
              requerArquivoVisto: "candidatos",
              rotaMonologo: "arquivoCandidatos"
            }
          ]
        },
        "explicar-escolha": {
          recebidas: ["Você resolveu a primeira parte. Isso é tudo que precisa saber."],
          opcoes: [
            {
              id: "perguntar-pesquisa",
              texto: "Há quanto tempo você me pesquisa?",
              resposta: ["Outra pergunta pessoal. Outra resposta que você não terá."],
              proxima: "antes-reset"
            },
            {
              id: "recusar-teste",
              texto: "Eu não aceitei participar do seu teste.",
              resposta: ["Ainda assim, cada escolha até aqui foi sua."],
              proxima: "antes-reset"
            }
          ]
        },
        "explicar-teste": {
          recebidas: ["Recrutamento e lógica. Nada demais. kk"],
          opcoes: [
            {
              id: "contestar-teste",
              texto: "Um teste? O aparelho estava dentro de um cofre.",
              resposta: ["Exatamente. Precisávamos saber o que você faria com ele."],
              proxima: "questionar-confianca"
            },
            {
              id: "recusar-teste-antigo",
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
              id: "duvidar-remetente",
              texto: "...E por que eu acreditaria em você?",
              resposta: ["Porque esse é o nome do jogo. kk"],
              proxima: "encerrar-contato"
            }
          ]
        },
        "encerrar-contato": {
          recebidas: ["Pense bem antes de decidir o que fazer com o celular."],
          opcoes: [
            {
              id: "investigar",
              texto: "Vou descobrir quem colocou isso no meu caminho.",
              resposta: ["É exatamente isso que esperamos de você."],
              proxima: "antes-reset"
            },
            {
              id: "encerrar",
              texto: "Essa conversa acabou.",
              resposta: ["Por enquanto. kk"],
              proxima: "antes-reset"
            }
          ]
        },
        "antes-reset": {
          recebidas: ["Você já viu mais do que deveria nesta primeira conversa."],
          opcoes: [
            {
              id: "copiei-informacoes",
              texto: "Eu já memorizei o que encontrei.",
              resposta: [
                "Eu estava contando com isso. Vamos limpar a mesa mesmo assim. kk",
                "O último arquivo foi liberado. Você tem um minuto antes do reset."
              ],
              proxima: null
            },
            {
              id: "impedir-reset",
              texto: "O que você vai fazer com o aparelho?",
              resposta: [
                "Devolver o silêncio a ele. Nos falamos depois.",
                "O último arquivo foi liberado. Você tem um minuto antes do reset."
              ],
              proxima: null
            }
          ]
        }
      }
    }
  }
};
