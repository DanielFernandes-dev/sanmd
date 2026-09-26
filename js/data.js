const CENAS_BECO = {
  beco_entrada: {
    id: "beco_entrada",
    label: "Entrada do beco",
    background: "assets/cenario/beco/entrada.png",
    destinos: ["beco_interior"],
    personagensVisuais: [{ id: "mj", pose: "neutral", slot: "center" }],
    personagensPresentes: []
  },
  beco_interior: {
    id: "beco_interior",
    label: "Interior do beco",
    background: "assets/cenario/beco/corredor.png",
    destinos: ["beco_entrada", "beco_fundo"],
    personagensVisuais: [{ id: "mj", pose: "neutral", slot: "center" }],
    personagensPresentes: []
  },
  beco_fundo: {
    id: "beco_fundo",
    label: "Fundo do beco",
    background: "assets/cenario/beco/background.png",
    initialState: { safeOpened: false, lulithPhoneCollected: false },
    objects: [
      { id: "safe", rect: [40.8, 23, 29.6, 52.6], variants: [
        { asset: "assets/cenario/beco/objects/safe_closed.png", conditions: { safeOpened: false } },
        { asset: "assets/cenario/beco/objects/safe_open.png", conditions: { safeOpened: true } }
      ] },
      { id: "lulith_phone", rect: [48.4, 49, 4, 10], variants: [
        { asset: "assets/cenario/beco/objects/lulith_phone.png", conditions: { safeOpened: true, lulithPhoneCollected: false } }
      ] }
    ],
    hotspots: [
      { id: "safe", rect: [42, 29, 19, 35], ariaLabel: "Abrir cofre",
        animation: { objectId: "safe", frameDuration: 80, finalHold: 100,
          frames: ["safe_closed", "safe_opening_01", "safe_opening_02", "safe_opening_03", "safe_opening_04", "safe_open"]
            .map(name => `assets/cenario/beco/objects/${name}.png`) },
        type: "interact", conditions: { safeOpened: false }, changes: { safeOpened: true },
        message: "O cofre abriu. Há um celular dentro." },
      { id: "lulith_phone", rect: [46.5, 47, 8, 14], ariaLabel: "Coletar celular",
        type: "collect", itemId: "lulith_phone", conditions: { safeOpened: true, lulithPhoneCollected: false },
        changes: { lulithPhoneCollected: true }, message: "Celular de Lulith guardado na Bolsa." }
    ],
    destinos: ["beco_interior"],
    personagensVisuais: [{ id: "mj", pose: "neutral", slot: "center" }],
    personagensPresentes: []
  }
};

const MONOLOGOS_BECO = {
  identidadeResolvida: [
    { autor: "MJ", texto: "(5-12-1. E-L-A.)" },
    { autor: "MJ", texto: "(Então quem preparou o aparelho é uma mulher. Ela queria que eu descobrisse isso.)" }
  ],
  aposPrimeiroEnvio: [
    { autor: "MJ", texto: "(Mensagem enviada. Quem está do outro lado sabia que eu chegaria até o cofre.)" },
    { autor: "MJ", texto: "(Ainda não sei com quem estou falando.)" }
  ],
  arquivoCandidatos: {
    masculino: [
      { autor: "MJ", texto: "(Quatro perfis compatíveis em São Paulo. Eu sou a candidata 03.)" },
      { autor: "MJ", texto: "(Quem está por trás deste celular está testando outras pessoas. Preciso descobrir quem são as outras três.)" }
    ],
    feminino: [
      { autor: "MJ", texto: "(Quatro perfis compatíveis em São Paulo. Eu sou a candidata 03.)" },
      { autor: "MJ", texto: "(A pessoa por trás deste celular está testando outras pessoas. Preciso descobrir quem são as outras três.)" }
    ]
  },
  arquivoRota: {
    masculino: [
      { autor: "MJ", texto: "(Nota, coordenadas, cofre, aparelho. Quem planejou isso previu cada etapa antes de eu começar.)" },
      { autor: "MJ", texto: "(Se minhas escolhas estavam previstas, talvez a rota esconda mais do que um destino.)" }
    ],
    feminino: [
      { autor: "MJ", texto: "(Nota, coordenadas, cofre, aparelho. Ela planejou cada etapa antes de eu começar.)" },
      { autor: "MJ", texto: "(Se minhas escolhas estavam previstas, talvez a rota esconda mais do que um destino.)" }
    ]
  },
  arquivoRecuperar: {
    masculino: [
      { autor: "MJ", texto: "(A mensagem diz que não quer destruir o que fizeram. Quer recuperar o que tiraram de alguém.)" },
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
};

const DATA = {
  locais: {
    beco: {
      id: "beco",
      nome: "Beco",
      cenaInicial: "beco_entrada",
      cenas: CENAS_BECO
    }
  },

  cena: CENAS_BECO.beco_entrada,

  personagens: {
    mj: {
      id: "mj",
      nome: "MJ",
      sprites: {
        neutral: "assets/sprites/MJ.png"
      },
      fotografia: {
        expressoes: Array.from({ length: 10 }, (_, indice) => `mj__photo__${String(indice + 1).padStart(2, "0")}`),
        sprites: {
          mj__photo__01: "assets/sprites/mj/photo/mj__photo__01.png",
          mj__photo__02: "assets/sprites/mj/photo/mj__photo__02.png",
          mj__photo__03: "assets/sprites/mj/photo/mj__photo__03.png",
          mj__photo__04: "assets/sprites/mj/photo/mj__photo__04.png",
          mj__photo__05: "assets/sprites/mj/photo/mj__photo__05.png",
          mj__photo__06: "assets/sprites/mj/photo/mj__photo__06.png",
          mj__photo__07: "assets/sprites/mj/photo/mj__photo__07.png",
          mj__photo__08: "assets/sprites/mj/photo/mj__photo__08.png",
          mj__photo__09: "assets/sprites/mj/photo/mj__photo__09.png",
          mj__photo__10: "assets/sprites/mj/photo/mj__photo__10.png"
        }
      }
    }
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
    beco_entrada: {
      ...MONOLOGOS_BECO,
      inicial: {
        pendente: [
          { autor: "MJ", texto: "(A nota que encontrei me trouxe até este beco. Quem a deixou mencionou um cofre por aqui.)" },
          { autor: "MJ", texto: "(O lugar parece isolado e deserto. Preciso avançar com cuidado e ver o que está escondido.)" }
        ],
        coletado: [
          { autor: "MJ", texto: "(De volta à entrada do beco. Já peguei o aparelho dentro do cofre.)" },
          { autor: "MJ", texto: "(Agora preciso analisar o conteúdo dele com cuidado.)" }
        ]
      }
    },
    beco_interior: {
      ...MONOLOGOS_BECO,
      inicial: {
        pendente: [
          { autor: "MJ", texto: "(O beco se estreita e fica mais escuro por aqui.)" },
          { autor: "MJ", texto: "(Se as pistas estiverem certas, o que procuro deve estar mais adiante.)" }
        ],
        coletado: [
          { autor: "MJ", texto: "(O corredor do beco segue em silêncio absoluto.)" },
          { autor: "MJ", texto: "(Já explorei o fundo do beco e peguei o aparelho. Não há mais nada por aqui.)" }
        ]
      }
    },
    beco_fundo: {
      ...MONOLOGOS_BECO,
      inicial: {
        pendente: [
          { autor: "MJ", texto: "(Cheguei ao fundo do beco. Há um cofre metálico fixado na parede.)" },
          { autor: "MJ", texto: "(As coordenadas me trouxeram exatamente até aqui. Preciso inspecionar este cofre.)" }
        ],
        aberto: [
          { autor: "MJ", texto: "(No fundo do beco, o cofre finalmente se abriu.)" },
          { autor: "MJ", texto: "(Há um celular ativo lá dentro. Devo recolhê-lo para investigar.)" }
        ],
        coletado: [
          { autor: "MJ", texto: "(Este é o fundo do beco. O cofre agora está vazio.)" },
          { autor: "MJ", texto: "(O aparelho está na minha bolsa. Preciso colocá-lo em uso.)" }
        ],
        ativo: [
          { autor: "MJ", texto: "(Este é o fundo do beco. O cofre agora está vazio.)" },
          { autor: "MJ", texto: "(O aparelho está funcionando. Preciso descobrir quem armou tudo isso.)" }
        ]
      }
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

// Inventário persiste somente IDs; definições permanecem fora do snapshot.
const ITEMS = {
  lulith_phone: {
    id: "lulith_phone",
    label: "Celular de Lulith",
    shortLabel: "Celular",
    description: "Celular encontrado no cofre do fundo do beco.",
    purpose: "Pode conter informações importantes sobre Lulith.",
    asset: "assets/cenario/beco/objects/lulith_phone_item.png",
    inventoryAction: {
      type: "activate_phone", label: "Usar", device: "lulith", theme: "lulith",
      reaction: [
        { autor: "MJ", texto: "(Está funcionando... O meu quebrou, mas este parece intacto.)" },
        { autor: "MJ", texto: "(Vou usá-lo. Talvez o conteúdo explique por que estava no cofre.)" }
      ]
    },
    consumable: false
  }
};

// IDs narrativos independentes dos caminhos dos assets. Uma palavra por sigla.
const CUTSCENES = Object.freeze({
  intro_abertura: Object.freeze({
    title: 'SANMD',
    significado: ['Sim,', 'Acredite', 'Nas', 'Mentiras', 'Dele'],
    risada: 'kk',
    assets: ['assets/interfaces/menu.png'],
    lampAudio: 'assets/audio/lampada.wav',
    steps: [
      { phase: 'preto', duration: 'introBlackHold' },
      { phase: 'siglas', duration: 'titleReveal', reduced: 'reducedMotion' },
      { phase: 'pausa-siglas', duration: 'titleHold' },
      { phase: 'significado', duration: 'titleExpansion', reduced: 'reducedMotion' },
      { phase: 'risada', duration: 'laughReveal', reduced: 'reducedMotion' },
      { phase: 'pausa-completa', duration: 'completeTitleHold' },
      { phase: 'subida', duration: 'titleExit', reduced: 'reducedMotion' },
      { phase: 'preto-final', duration: 'postTitleBlackHold' },
      { phase: 'luz', duration: 'lampReveal', reduced: 'reducedMotion', sound: true }
    ]
  })
});
