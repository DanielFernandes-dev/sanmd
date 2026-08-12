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
  ]
};
