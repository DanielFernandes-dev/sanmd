var DATA = {
  intro: [
    'Um celular na minha mesa de trabalho.',
    'Não é meu. Está morno, como se tivessem acabado de deixá-lo aqui.',
    'Sem marcas, sem película, sem capinha.',
    'Alguém entrou na minha casa enquanto eu dormia.',
    'Isso não vai ficar por isso.'
  ],
  pickup: [
    'Um smartphone preto. Pesado. Sem marcas de identificação.',
    'A tela acende sozinha quando eu me aproximo.',
    'O meu está no meu bolso. Este não é meu.',
    'Vou desbloquear. E descobrir quem deixou isso aqui.'
  ],
  chat: {
    init: [
      { from: 'them', text: 'Quem é você?' },
      { from: 'them', text: 'Como desbloqueou este aparelho?' },
      { from: 'them', text: 'Escute, consultor. Este celular não é um achado.' },
      { from: 'them', text: 'É um teste — de recrutamento e de lógica.' },
      { from: 'them', text: 'Há fragmentos de código espalhados. Prove que sabe decodificá-los.' },
      { from: 'them', text: 'Abra o aplicativo Terminal e digite: help' }
    ],
    afterDecode: [
      { from: 'them', text: 'Correto. Esse é o padrão. Hex é a língua do chão.' },
      { from: 'them', text: 'Agora digite: scan' }
    ],
    afterScan: [
      { from: 'them', text: 'O fragmento está no pacote retido. Use decode no conteúdo.' }
    ],
    afterFragment: [
      { from: 'them', text: 'FRAGMENTO 1/3 coletado. Chave registrada: KX8A-7QL2.' },
      { from: 'them', text: 'Você é melhor do que eu esperava, consultor.' },
      { from: 'them', text: 'Mas isto é só o começo.' }
    ]
  },
  neighbor: {
    enter: [
      'Boa noite? É a Marta, da casa ao lado.',
      'Vi a luz acesa e trouxe um bolo de milho. Não resisto a essa hora.'
    ],
    smalltalk: [
      'Você viu as luzes piscando lá fora?',
      'Não é só aqui não, é a cidade inteira. Coisa de sistema, dizem.',
      'Eu não entendo dessas coisas, mas me deu um calafrio.'
    ],
    leave: [
      'Bom, já vou indo.',
      'Qualquer coisa, me chama. Boa noite!'
    ]
  },
  items: {
    shelf: {
      title: 'Bilhete na estante',
      body: 'Lembrete — wi-fi: pi sem o ponto (3141)\ncelular novo: mesmo PIN.\n\n(Caligrafia apressada. Não é sua.)'
    },
    laptop: {
      title: 'E-mail — sem assunto',
      body: 'De: <oculto>\nPara: core-sp@seg.publica.sp\n\n"GENTE, o sistema saiu do ar por 3 segundos às 23:47.\nNão foi manutenção. Não foi tráfego. Foi alguém.\nNão é vírus. É pior.\n\nSe alguém de vocês receber um celular sem dono:\nNÃO CONECTEM. Mandem para o protocolo 7.\n\n— C"'
    },
    window: {
      title: 'Janela',
      body: 'A cidade à noite.\nAs luzes piscam em intervalos irregulares, como se alguém estivesse piscando de volta.'
    },
    door: {
      title: 'Porta',
      body: 'Trancada. Você está sozinho em casa.'
    },
    doorDone: {
      title: 'Porta',
      body: 'Porta trancada. Silêncio absoluto na rua.'
    }
  },
  gallery: [
    { cls: 'gal-1', title: 'Rua — 23:47', caption: 'Fotografia escura. As luzes piscam em três quadras ao mesmo tempo.' },
    { cls: 'gal-2', title: 'CORE-SP OFFLINE', caption: 'Captura de tela. O sistema municipal saiu do ar por 3 segundos.' },
    { cls: 'gal-3', title: 'Terminal', caption: 'Foto desfocada de um terminal antigo. Algo pisca na tela.' }
  ],
  notes: [
    { title: 'Anotação inicial', body: '23:47 — tudo apagou por 3s. Não achei que fosse importante.' }
  ],

  act2: {
    intro: [
      'Estou na delegacia. O celular continua comigo, zumbindo no bolso.',
      'Delegacia lotada como sempre. O chefe está na sala dele.',
      'Vou reportar o caso e mostrar as evidências pelo terminal.'
    ],
    report: [
      'O que? O app Terminal sumiu da tela inicial.',
      'Trava de presença única... o aparelho detecta que não estou sozinho.',
      'Ele se esconde quando há testemunhas. É a trava sensorial do remetente.',
      'Sem apoio dos superiores, então. Vou resolver isso sozinho.'
    ],
    chat: [
      { from: 'them', text: 'Percebeu? A delegacia travou o terminal para você.' },
      { from: 'them', text: 'Programado assim. Você só avança sozinho.' },
      { from: 'them', text: 'Eles nunca vão acreditar em você. Este é o teste de verdade.' },
      { from: 'them', text: 'Explore a sala. O desenvolvedor deixou anotações escondidas aqui.' }
    ],
    devNote: [
      { from: 'them', text: 'Você achou o bilhete do C. Ele criptografou o fragmento.' },
      { from: 'them', text: 'Decodifique o pacote que enviei no terminal. Depois use decrypt com a chave que descobrir.' },
      { from: 'them', text: 'ZGVjcnlwdCBQUk9UT0NPTE83' }
    ],
    frag2: [
      { from: 'them', text: 'FRAGMENTO 2/3 coletado. Chave registrada: JW3M-THP9.' },
      { from: 'them', text: 'Agora vem a parte que eu não queria te contar.' },
      { from: 'them', text: 'Você vai me odiar. Mas é a única forma de provar que estou certo.' }
    ]
  },

  act3: {
    chat: [
      { from: 'them', text: 'É aqui que tudo muda, consultor.' },
      { from: 'them', text: 'Os fragmentos que você reuniu são o código de um vírus autônomo de invasão.' },
      { from: 'them', text: 'Eu criptografei o vírus e armei um alarme: reinserir as senhas avisa a polícia em tempo real.' },
      { from: 'them', text: 'Você foi usado, consultor. Reuniu as chaves para o vilão e vai levar a culpa.' },
      { from: 'them', text: 'O último fragmento está no computador da delegacia — o sistema que caiu às 23:47.' },
      { from: 'them', text: 'Corra. Você tem pouco tempo.' }
    ],
    frag3: [
      { from: 'them', text: 'FRAGMENTO 3/3. Todas as chaves.' },
      { from: 'them', text: 'Agora digite: decrypt' },
      { from: 'them', text: 'E depois: corromper' }
    ],
    cOrrendo: [
      'Você destruiu o código, consultor. Eles vão te prender agora.',
      'Não se preocupe. Eu gravei cada mensagem desta conversa.',
      'Está tudo em áudio. Eu apareço no seu julgamento.',
      'Eles vão saber a verdade. Confie em mim.'
    ]
  },

  items: {
    computerOffice: {
      title: 'Computador da delegacia — mensagens',
      body: 'CONSULTOR: Chefe, recebi um celular sem dono. Dizem que é um teste de código.\n\nCHEFE: Paranoia, consultor. Foca na escala. Não é vírus.\n\nCONSULTOR: O sistema da cidade caiu às 23:47. Tem relação.\n\nCHEFE: Coincidência. Toma um café.\n\n(No fim do thread, um rascunho deixado por um usuário anterior:)\n"Se um dia um consultor chegar com um celular sem dono:\nNÃO reportem. O aparelho trava na presença de gente.\nLevem o caso para casa. — C"'
    },
    tv: {
      title: 'Monitor de notícias',
      body: 'URGENTE — Sistemas municipais saíram do ar por 3 segundos às 23:47.\nEspecialistas descartam falha de energia. Prefeitura não comenta.\n\nHá rumores de um terceiro incidente nas últimas 24h.'
    },
    cabinet: {
      title: 'Gaveta — pasta PROTOCOLO-7',
      body: '"Para quem encontrar isto:\nEu criptografei o fragmento final com a senha do cofre.\nA senha é a palavra do protocolo, sem espaço, em maiúsculas:\n\nPROTOCOLO7\n\nCuidado: reinserir as senhas reativa o alarme.\nEles vão me culpar. Eu não vou deixar. — C"'
    },
    windowOffice: {
      title: 'Janela da delegacia',
      body: 'O corredor está cheio. Salas e mais salas com gente.\nO terminal não vai abrir enquanto houver presença por perto.'
    },
    computerAct3: {
      title: 'Computador da delegacia — processo estranho',
      body: 'O sistema está instável. Um processo chamado "fragmento_final" está aberto na máquina.\nConteúdo do processo, em HEX:\n\n46 52 41 47 5F 33 3D 50 51 39 5A 2D 4D 4E 4F 32\n\n(copie o hex. O terminal só abre em casa — corra.)'
    }
  },

  endings: {
    e1: '<b>FINAL 1 — O CULPADO PERFEITO</b><br/>' +
      'Poucas senhas decifradas. O tempo esgotou.<br/>' +
      'A polícia invade e encontra o celular com chaves parciais.<br/>' +
      'Você é preso sem provas da sua versão.<br/>' +
      'O vilão fica com parte do código — e some.<br/>' +
      'Ninguém acredita no consultor técnico.',
    e2: '<b>FINAL 2 — A VERDADE PARCIAL</b><br/>' +
      'Metade das senhas decifrada, mas a polícia chega primeiro.<br/>' +
      'Você é preso — ainda carrega os registros de áudio do aparelho.<br/>' +
      'Um colega policial leal guarda uma cópia.<br/>' +
      'Talvez haja dúvida, afinal.',
    e3: '<b>FINAL 3 — O SACRIFÍCIO / VERDADEIRO</b><br/>' +
      'Com 100% das senhas decifradas a tempo, você obtém acesso total.<br/>' +
      'Corrompe e destrói o código do vírus — frustrando o vilão.<br/>' +
      'A polícia o prende, mas o desenvolvedor dissidente aparece no julgamento<br/>' +
      'com os registros que provam sua inocência.'
  }
};
