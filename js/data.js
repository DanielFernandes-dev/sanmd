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
    backgroundSize: [1672, 941],
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

const CENAS_CASA = {
  casa_quarto_mj: {
    id: "casa_quarto_mj", label: "Quarto da MJ",
    background: "assets/cenario/casa-mj-james/quarto-mj.png",
    initialState: { introSeen: false, mjBagCollected: false },
    destinos: ["casa_sala"],
    objects: [{ id: "mj_bag", rect: [78, 62, 9, 13], variants: [
      { asset: "assets/cenario/casa-mj-james/bolsa-mj.svg", conditions: { mjBagCollected: false } }
    ] }],
    hotspots: [{ id: "mj_bag", rect: [77, 60, 12, 17], ariaLabel: "Pegar bolsa da MJ",
      type: "interact", conditions: { mjBagCollected: false },
      changes: { mjBagCollected: true }, message: "Peguei minha bolsa.", eventId: "mjBagCollected" }],
    personagensPresentes: []
  },
  casa_sala: {
    id: "casa_sala", label: "Sala",
    background: "assets/cenario/casa-mj-james/sala.png",
    initialState: { mjPhoneCollected: false },
    destinos: ["casa_quarto_mj", "casa_cozinha", "casa_quarto_james"],
    objects: [{ id: "mj_phone", rect: [6.5, 46, 3, 5], variants: [
      { asset: "assets/cenario/casa-mj-james/celular-mj.svg", conditions: { mjPhoneCollected: false } }
    ] }],
    hotspots: [
      { id: "mj_phone", rect: [5, 43, 7, 11], ariaLabel: "Pegar telefone da MJ",
        type: "interact", conditions: { mjPhoneCollected: false },
        changes: { mjPhoneCollected: true }, message: "Peguei meu telefone.", eventId: "mjPhoneCollected" },
      { id: "lulith_door", rect: [55, 10, 6, 46], ariaLabel: "Porta do quarto de Lulith",
        type: "examine", message: "Está fechado." },
      { id: "main_door", rect: [70, 9, 10, 49], ariaLabel: "Porta de saída",
        type: "examine", eventId: "casaExitDoor" }
    ],
    personagensPresentes: []
  },
  casa_cozinha: {
    id: "casa_cozinha", label: "Cozinha",
    background: "assets/cenario/casa-mj-james/cozinha.png",
    initialState: { jamesIntroConversationComplete: false },
    destinos: ["casa_sala"],
    personagensPresentes: ["james"],
    personagensVisuais: [{ id: "james", pose: "neutral", slot: "right" }]
  },
  casa_quarto_james: {
    id: "casa_quarto_james", label: "Quarto do James",
    background: "assets/cenario/casa-mj-james/quarto-james.png",
    destinos: ["casa_sala"],
    initialState: {},
    hotspots: [{ id: "comics", rect: [12, 15, 22, 35], ariaLabel: "Ver quadrinhos",
      type: "examine", message: "James nunca perdeu o gosto pelos quadrinhos." }],
    personagensPresentes: []
  }
};

const CENAS_CRIME = {
  crime_sala: {
    id: "crime_sala", label: "Cena do crime",
    background: "assets/cenario/cena-do-crime/cena-do-crime.png",
    backgroundSize: [1664, 936],
    initialState: { introSeen: false, firstEvidenceExamined: false,
      investigationItemCollected: false, lockedEvidenceOpened: false },
    destinos: [],
    objects: [
      { id: "crime_small_key", rect: [44, 70, 3.5, 5.5], variants: [
        { asset: "assets/cenario/cena-do-crime/chave-pequena.svg",
          conditions: { investigationItemCollected: false } }
      ] },
      { id: "crime_case", rect: [13, 67, 19, 18], variants: [
        { asset: "assets/cenario/cena-do-crime/maleta-fechada.svg",
          conditions: { lockedEvidenceOpened: false } },
        { asset: "assets/cenario/cena-do-crime/maleta-aberta.svg",
          conditions: { lockedEvidenceOpened: true } }
      ] }
    ],
    hotspots: [
      { id: "crime_glass", rect: [31, 80, 12, 13], ariaLabel: "Examinar os cacos de vidro",
        type: "examine", conditions: { firstEvidenceExamined: false },
        changes: { firstEvidenceExamined: true }, eventId: "crimeEvidenceExamined" },
      { id: "crime_small_key", rect: [42.5, 68.5, 6.5, 9], ariaLabel: "Coletar chave pequena",
        type: "collect", itemId: "crime_small_key",
        conditions: { investigationItemCollected: false },
        changes: { investigationItemCollected: true }, message: "Uma chave pequena. Vou guardá-la na Bolsa." },
      { id: "crime_case", rect: [14, 69, 16, 15], ariaLabel: "Abrir a maleta no chão",
        type: "use_item", requiresItem: "crime_small_key", requiresSelection: true,
        consumeItem: true, missingItemMessage: "Está trancada. Preciso de alguma coisa para abrir.",
        conditions: { lockedEvidenceOpened: false },
        changes: { lockedEvidenceOpened: true }, eventId: "crimeCaseOpened" }
    ],
    personagensPresentes: []
  }
};

const CENAS_DELEGACIA = {
  delegacia_corredor: {
    id: "delegacia_corredor", label: "Corredor da Delegacia",
    background: "assets/cenario/delegacia/corredor-delegacia.png",
    initialState: {}, destinos: ["delegacia_investigadores"], personagensPresentes: []
  },
  delegacia_investigadores: {
    id: "delegacia_investigadores", label: "Área dos investigadores",
    background: "assets/cenario/delegacia/central-delegacia.png",
    initialState: {}, destinos: ["delegacia_corredor", "delegacia_mesa_mj"], personagensPresentes: []
  },
  delegacia_mesa_mj: {
    id: "delegacia_mesa_mj", label: "Mesa da MJ",
    background: "assets/cenario/delegacia/escritoria-mj.png",
    backgroundSize: [1672, 941],
    initialState: { noteRead: false, computerOn: false },
    destinos: ["delegacia_investigadores"],
    hotspots: [
      { id: "mj_note", rect: [48, 70, 17, 14], ariaLabel: "Examinar bilhete",
        type: "examine", changes: { noteRead: true }, eventId: "mjNoteRead" },
      { id: "mj_computer", rect: [37, 32, 27, 39], ariaLabel: "Usar computador",
        type: "interact", changes: { computerOn: true }, eventId: "mjComputerUsed" }
    ],
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
    casa: { id: "casa", nome: "Casa", cenaInicial: "casa_quarto_mj", cenas: CENAS_CASA },
    cena_crime: { id: "cena_crime", nome: "Cena do crime", cenaInicial: "crime_sala", cenas: CENAS_CRIME },
    delegacia: { id: "delegacia", nome: "Delegacia", cenaInicial: "delegacia_corredor", cenas: CENAS_DELEGACIA },
    beco: {
      id: "beco",
      nome: "Beco",
      cenaInicial: "beco_entrada",
      cenas: CENAS_BECO
    }
  },

  cena: CENAS_BECO.beco_entrada,

  prototypeAlleyCoordinates: { latitude: '23° 33\' 12" S', longitude: '46° 38\' 27" W' },
  worldMapLocations: {
    casa: { label: "Casa", localId: "casa", initiallyAvailable: true, mapPosition: { x: 45.7, y: 22.4 } },
    cena_crime: { label: "Cena do Crime", localId: "cena_crime", initiallyAvailable: true, mapPosition: { x: 52.6, y: 61.6 } },
    delegacia: { label: "Delegacia", localId: "delegacia", initiallyAvailable: true, mapPosition: { x: 67.1, y: 15.0 } },
    beco: { label: "Beco", localId: "beco", initiallyAvailable: false, mapPosition: { x: 80.5, y: 56.1 } }
  },

  personagens: {
    lulith: { id: "lulith", nome: "Lulith", sprites: { neutral: "assets/sprites/lulith.png" } },
    james: { id: "james", nome: "James", sprites: { neutral: "assets/sprites/james.png" } },
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
    presenciais: {
      james: [
        { autor: "James", texto: "Você está trabalhando muito. Olha essas olheiras. Você devia pedir pros nossos superiores te dar uma folga. Umas férias, sabe." },
        { autor: "", texto: "James entrega uma xícara de café à MJ." },
        { autor: "James", texto: "Tipo uma passagem pra viajar." },
        { autor: "", texto: "O celular de James vibra. Ele olha a mensagem por um instante." , eventId: "jamesNotification" },
        { autor: "James", texto: "...Dito isso, pegue sua bolsa e seu telefone. Temos um caso que surgiu." }
      ]
    }
  },

  monologos: {
    delegacia_corredor: { inicial: [{ autor: "MJ", texto: "(Preciso ir à minha mesa.)" }] },
    delegacia_investigadores: { inicial: [{ autor: "MJ", texto: "(Minha mesa fica adiante.)" }] },
    delegacia_mesa_mj: { inicial: [{ autor: "MJ", texto: "(O computador está aqui.)" }] },
    crime_sala: {
      inicial: [{ autor: "MJ", texto: "(Então foi aqui. Melhor olhar com calma antes de ir embora.)" }],
      phoneBreak: [
        { autor: "", personagemId: "mj", texto: "O telefone escorrega da mão de MJ e bate no chão.", eventId: "mjPhoneImpact" },
        { autor: "MJ", texto: "(...Ótimo.)" }
      ]
    },
    casa_quarto_mj: { inicial: [
      { autor: "MJ", texto: "(Acordei... Que sonho estranho.)" },
      { autor: "MJ", texto: "(Já podia começar o dia sem essa sensação.)" }
    ], retorno: [{ autor: "MJ", texto: "(Preciso me arrumar e seguir em frente.)" }] },
    casa_sala: { inicial: [{ autor: "MJ", texto: "(Preciso me organizar antes de sair.)" }] },
    casa_cozinha: { inicial: [{ autor: "MJ", texto: "(James está preparando café.)" }] },
    casa_quarto_james: { inicial: [{ autor: "MJ", texto: "(James sempre deixa seus quadrinhos à vista.)" }] },
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
  crime_small_key: {
    id: "crime_small_key", label: "Chave pequena", shortLabel: "Chave",
    description: "Uma chave pequena encontrada perto dos objetos espalhados.",
    purpose: "Talvez abra a maleta no chão.",
    asset: "assets/cenario/cena-do-crime/chave-pequena.svg",
    inventoryAction: { type: "use_on_hotspot", label: "Usar", targetHotspot: "crime_case" },
    consumable: true
  },
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
const LULITH_FRAMES = Object.freeze({
  lulith_codigo_01: 'assets/cenario/quarto-lulith/cena1.png',
  lulith_codigo_02: 'assets/cenario/quarto-lulith/cena2.png',
  lulith_codigo_03: 'assets/cenario/quarto-lulith/cena3.png',
  lulith_codigo_04: 'assets/cenario/quarto-lulith/cena4.png',
  lulith_codigo_05: 'assets/cenario/quarto-lulith/cena5.png',
  lulith_codigo_06: 'assets/cenario/quarto-lulith/cena6.png',
  lulith_codigo_07: 'assets/cenario/quarto-lulith/cena7.png',
  lulith_codigo_08: 'assets/cenario/quarto-lulith/cena8.png',
  lulith_codigo_09: 'assets/cenario/quarto-lulith/cena9.png',
  lulith_codigo_10: 'assets/cenario/quarto-lulith/cena10.png',
});

const ACT1_FRAMES = Object.freeze(Object.fromEntries(Array.from({ length: 8 }, (_, i) =>
  [`cutscene_act1_0${i + 1}`, `assets/cenario/custcene-beco/cena${i + 1}.png`])));

const CUTSCENES = Object.freeze({
  act1_ending: Object.freeze({
    timing: 'act1Ending', frames: ACT1_FRAMES, assets: Object.values(ACT1_FRAMES),
    ambience: 'rooftop_ambience',
    sounds: Object.freeze({
      rooftop_ambience: { src: 'assets/audio/rooftop_ambience.wav', volume: .22, loop: true },
      mj_steps: { src: 'assets/audio/mj_steps.wav', volume: .12 },
      binoculars: { src: 'assets/audio/binoculars.wav', volume: .18 },
      backpack: { src: 'assets/audio/backpack.wav', volume: .20 },
      strap: { src: 'assets/audio/strap.wav', volume: .16 },
      exit_steps: { src: 'assets/audio/exit_steps.wav', volume: .24 }
    }),
    steps: [
      { frame: 'cutscene_act1_01', duration: 'frame01', transition: 'fade-in', camera: 'rooftop-push' },
      { frame: 'cutscene_act1_02', duration: 'frame02', transition: 'cut', camera: 'street-focus', sfx: 'mj_steps' },
      { frame: 'cutscene_act1_03', duration: 'frame03', transition: 'cut', camera: 'street-track', sfx: 'mj_steps', weight: .55, fadeTo: 0 },
      { frame: 'cutscene_act1_04', duration: 'frame04', transition: 'cut', sfx: 'binoculars' },
      { frame: 'cutscene_act1_05', duration: 'frame05', transition: 'cut', camera: 'equipment-focus', sfx: 'backpack' },
      { frame: 'cutscene_act1_06', duration: 'frame06', transition: 'cut', camera: 'door-focus', sfx: 'strap' },
      { frame: 'cutscene_act1_07', duration: 'frame07', transition: 'cut', sfx: 'exit_steps' },
      { frame: 'cutscene_act1_08', duration: 'frame08', transition: 'cut' },
      { type: 'fade-black', duration: 'exitFade' },
      { type: 'black', duration: 'frame09' }
    ]
  }),
  act1_title: Object.freeze({
    timing: 'act1Ending', frames: {}, title: 'ATO 1 COMPLETO', assets: [],
    steps: [
      { type: 'title', phase: 'reveal', duration: 'titleReveal', reduced: 'reducedMotion' },
      { type: 'title', phase: 'hold', duration: 'titleHold' },
      { type: 'title', phase: 'exit', duration: 'titleExit', reduced: 'reducedMotion' },
      { type: 'black', duration: 'postTitleBlackHold' }
    ]
  }),
  lulith_codigo: Object.freeze({
    timing: 'lulithCodigo',
    frames: LULITH_FRAMES,
    sounds: Object.freeze({
      room_ambience: { src: 'assets/audio/room_ambience.wav', volume: .16, loop: true },
      keyboard: { src: 'assets/audio/keyboard.wav', volume: .35 },
      keyboard_fast: { src: 'assets/audio/keyboard_fast.wav', volume: .43 },
      computer_error: { src: 'assets/audio/computer_error.wav', volume: .35 },
      chair_move: { src: 'assets/audio/chair_move.wav', volume: .4 },
      kick_impact: { src: 'assets/audio/kick_impact.wav', volume: .6 }
    }),
    assets: Object.values(LULITH_FRAMES),
    steps: [
      { frame: 'lulith_codigo_01', duration: 'frame01', transition: 'fade-in', camera: 'slow-push' },
      { frame: 'lulith_codigo_02', duration: 'frame02', sfx: 'keyboard', transition: 'soft-cut', camera: 'small-push' },
      { frame: 'lulith_codigo_03', effect: 'computer-error', flashRegion: [6, 25, 46, 55], duration: 'frame03', sfx: 'computer_error', transition: 'cut' },
      { frame: 'lulith_codigo_04', duration: 'frame04', transition: 'soft-cut', camera: 'slow-push' },
      { frame: 'lulith_codigo_05', duration: 'frame05', sfx: 'keyboard_fast', transition: 'soft-cut', camera: 'small-push' },
      { frame: 'lulith_codigo_06', effect: 'computer-error', flashRegion: [1, 32, 39, 53], duration: 'frame06', shake: 'error', sfx: 'computer_error', weight: 1.2, transition: 'cut' },
      { frame: 'lulith_codigo_07', duration: 'frame07', sfx: 'chair_move', transition: 'soft-cut' },
      { frame: 'lulith_codigo_08', duration: 'frame08', shake: 'impact', sfx: 'kick_impact', transition: 'cut' },
      { frame: 'lulith_codigo_09', duration: 'frame09', transition: 'soft-cut' },
      { frame: 'lulith_codigo_10', duration: 'frame10', transition: 'soft-cut', camera: 'slow-push' }
    ]
  }),
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
