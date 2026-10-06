# Sim, Acredite nas Mentiras Dele kk

Protótipo web de uma Visual Novel de investigação ambientada em São Paulo que combina narrativa, exploração point-and-click, interface de celular, puzzles e elementos de ARG.

> **Status:** Protótipo V1 em desenvolvimento
>
> **Referências:** Ace Attorney, SIMULACRA, Cicada 3301, Enigma do Medo e estética hacker retrô

## Sobre o projeto

MJ, nome provisório de desenvolvimento, é uma investigadora criminal/consultora técnica ligada à polícia. Depois de resolver um caso introdutório, ela encontra uma nota com um enigma em sua mesa na delegacia. O jogador pode jogar o papel fora e encerrar a partida com uma porcentagem mínima de conclusão ou decifrá-lo para encontrar coordenadas, um cofre e, dentro dele, o celular de Lulith.

O aparelho inicia a investigação principal. Suas mensagens, arquivos, interfaces e puzzles apresentam fragmentos sobre Lulith, outros candidatos e a origem dos testes. Os finais representam perspectivas diferentes de MJ sobre o que ela conseguiu descobrir; apenas a reconstrução completa da história conduz ao final verdadeiro.

### Direção conceitual atual

- A história se passa em **São Paulo**.
- O nome real de MJ será escolhido pelo jogador no início.
- MJ tem experiência prévia com enigmas, ARGs e escape rooms e não é a única candidata testada.
- Lulith é a dona do celular e conduz MJ por persuasão, geralmente em tom leve ou de brincadeira.
- William James é amigo, antigo professor e colega de trabalho de MJ.
- Não haverá romance entre MJ e Lulith.
- O elenco principal/relevante terá no máximo seis personagens.
- A narrativa será fragmentada e utilizará cenários, objetos, expressões, interfaces e mecânicas para contar a história.
- Replay, progresso e finais fazem parte da investigação, não apenas da conclusão da campanha.
- A direção visual final será pixelada, com personagens 2D expressivos e apresentação inspirada em *Ace Attorney*.

As decisões conceituais, inclusive seus níveis de certeza e pendências, estão consolidadas em [`IDEIA_CONCEITUAL.md`](IDEIA_CONCEITUAL.md). O [`GDD.md`](GDD.md) organiza essa direção como design do jogo.

O objetivo da V1 é validar a estrutura visual e a experiência básica antes do desenvolvimento do jogo completo. O protótipo utiliza conteúdo e arte provisórios para testar:

- Layout inspirado na interface compacta de Ace Attorney para Nintendo DS.
- Apresentação de cenário e personagem.
- Sistema de diálogos com efeito de digitação.
- Navegação contextual entre cenas.
- Navegação entre a Visual Novel e o celular.
- Organização dos aplicativos simulados do aparelho.
- Funcionamento em desktop e dispositivos móveis.

## Estado atual

Revisado em **02/10/2026** contra o código do repositório. As seções de direção
conceitual e fluxo planejado descrevem o jogo futuro; a lista abaixo descreve o runtime.

O núcleo do protótipo é uma aplicação web estática feita com HTML, CSS e JavaScript. O projeto também possui uma camada Capacitor para gerar o aplicativo Android.

Já estão disponíveis:

- Abertura com um único título itálico: SANMD se expande no significado, recebe `kk` e sobe. Clique/estalo e luz revelam o menu, que permanece iluminado e bloqueado até o Skip. Duplo clique/toque pula qualquer fase.

- Cutscene 02 (`lulith_codigo`) exclusiva de **Novo jogo**, com dez imagens estáticas, câmera discreta, áudio e efeitos pontuais, sem falas. Usa o mesmo controlador e Skip da abertura.
- Cutscene 03 (`act1_ending`) ao escolher **Sair do beco** em `Ir para`, após abrir o cofre e coletar o celular: oito imagens, cortes secos, preto criado pelo código, título **ATO 1 COMPLETO**, autosave e retorno ao menu.
- Tela inicial em caderno fechado sobre a mesa escura, com capa, animação de abertura e páginas internas mostrando os registros como fotografias.
- Três cenas noturnas provisórias conectadas: entrada, interior e fundo do beco.
- Personagem de MJ em PNG (`assets/sprites/MJ.png`), mostrada em cena somente durante os monólogos.
- Comandos por ícones pixelados para **Conversar**, **Ir para**, **Celular** e **Bolsa**, sem sidebar visual.
- Menu **Ir para** compacto e contextual, com somente os destinos disponíveis na cena atual.
- Caixa de diálogo inspirada em *Ace Attorney* com nome, falas sequenciais e efeito de digitação.
- Efeito de digitação com som sintetizado por letra via Web Audio API.
- Avanço do diálogo por clique, `Enter` ou barra de espaço.
- Interface de celular com relógio, data e aplicativos provisórios.
- Primeiro contato ramificado e anônimo dentro do aplicativo **Mensagens**.
- Rotas adicionais de conversa liberadas conforme os arquivos examinados.
- Monólogos diferentes conforme a primeira resposta condicional escolhida.
- Monólogo especial para quem examina os quatro arquivos e resolve `REMETENTE.enc`.
- Primeiro enigma em **Arquivos**, usado para deduzir que a dona do aparelho é uma mulher.
- Registros opcionais anteriores ao reset dentro de **Arquivos**.
- Reset remoto que limpa o acesso normal e preserva internamente as pistas vistas.
- Cronômetro vermelho de um minuto durante a janela anterior ao reset.
- Respostas selecionáveis com reações e histórico do caminho escolhido.
- Monólogo do protagonista ao usar **Conversar** em cenas sem personagens presenciais.
- Navegação de ida e volta pelo beco sem alterar o estado do celular ou das mensagens.
- Fechamento do menu **Ir para** por escolha ou `Escape`, com suporte a teclado.
- Retorno contextual do celular pelo botão **Voltar** ou pela tecla `Escape`.
- Layout responsivo para telas menores.
- Projeto Android e comando de build de APK com Capacitor.
- Sistema de Save/Load fotográfico com até 9 saves manuais, autosave separado e 10 expressões da MJ.
- Investigação point-and-click com hotspots acessíveis, objetos interativos e inventário narrativo pela Bolsa da MJ.
- Cofre interativo no fundo do beco com abertura e coleta do Celular de Lulith.
- Ativação do aparelho pela Bolsa com reação narrativa e transição de tema.
- Layout da Galeria com linhas dimensionadas pelo conteúdo, metadados estruturados e suporte a nomes longos.
- Otimização mobile com remoção do destaque de toque, redução do frame em paisagem e ajustes tipográficos.
- Teclado virtual próprio e entrada de texto sem IME do sistema, usado na Galeria, no decodificador e nas coordenadas do mapa/PC.
- Transição de cena com fade global, bloqueio de input durante o efeito e suporte a `prefers-reduced-motion`.
- Suíte Node cobrindo navegação, estado, saves, arte, teclado, menu, transições e as três cutscenes. Consulte [o relatório de implementação e validação](docs/STATUS_PROJETO.md).

> Após a Cutscene 02, o gameplay começa no beco; a saída da entrada do beco encerra o protótipo após a coleta do celular. James, dormitório, caso introdutório e nota ainda não foram implementados. O celular, os monólogos, os arquivos, o primeiro contato com Lulith e o reset remoto já formam um recorte canônico da Fase 8; os assets continuam genéricos.

## Celular, mensagens e conversas

A interface separa as conversas presenciais das mensagens digitais:

- O diálogo com a dona do celular acontece dentro de **Mensagens**, sem revelar sua identidade nesse primeiro contato.
- As mensagens do dono são exibidas à esquerda e as do protagonista à direita.
- O botão **Conversar** é usado para interações presenciais.
- Quando o protagonista está sozinho, **Conversar** apresenta um pensamento ou monólogo.
- O celular original da MJ começa quebrado e o ícone CELULAR fica oculto. Colete o Celular de Lulith no cofre e escolha **USAR** na Bolsa; ao concluir a reação, o aparelho fica ativo com o tema Lulith.
- O botão **Voltar**, sem borda ou fundo, fica no canto inferior esquerdo da tela inicial do celular e no canto superior esquerdo dentro dos apps.
- Dentro de Mensagens, **Voltar** retorna à tela inicial do aparelho.
- Na tela inicial, **Voltar** fecha o celular e retorna ao cenário.
- A **Bolsa da MJ** abre o inventário narrativo pelo ícone de mochila; ela registra o Celular de Lulith após a coleta e permite a ação **USAR** para ativar o aparelho.
- A investigação point-and-click usa hotspots acessíveis por mouse, toque e teclado, com objetos interativos e feedback visual direto no cenário.
- O jogo possui um **teclado virtual próprio** que substitui o IME do sistema. Ele é usado na Galeria, no decodificador e nas coordenadas do mapa/PC. Em Mensagens, o jogador escolhe respostas prontas.

## Entrada de texto e teclado virtual

O jogo não usa campos `input` nativos nem o teclado IME do sistema. Um teclado virtual próprio, desenhado dentro do celular, processa toda a digitação do jogo. Isso mantém a identidade visual, evita sobreposição do teclado do SO e elimina o último diálogo/formulário nativo do fluxo.

Dois serviços compartilham o mesmo estado transitório:
- `js/keyboard.js` — renderiza as teclas em `#game-keyboard` e o painel de acentos.
- `js/text-entry.js` — mantém o buffer, cursor e estado da edição em `state.texto`.

A entrada de texto é aberta por requisição (`abrirEntradaTexto({...})` com `confirmLabel`, `maxLength`, `allowEmpty` e callbacks de confirmação) e confirmada ou cancelada sem diálogos nativos. Galeria, decodificador e mapa/PC abrem o editor. Enquanto edita, o teclado físico é desviado (digitar, Backspace, setas, Enter, Esc) e o IME do sistema nunca abre. O estado de edição não é persistido: restaurar um save fecha a edição.

Layouts do teclado:
- **QWERTY** — letras, shift, acentos (ÁÇ), espaço, OK.
- **Números** — dígitos, símbolos, espaço, OK.

Consulte [`docs/TEXT_INPUT.md`](docs/TEXT_INPUT.md) para detalhes completos.

## Como executar

O projeto pode ser aberto diretamente pelo `index.html`, mas é recomendado usar um servidor HTTP local.

Com Python 3:

```bash
python3 -m http.server 8000
```

Depois, acesse:

```text
http://localhost:8000
```

Para executar somente a versão web, não é necessário instalar pacotes.

### Gerar o APK Android

Com Node.js, Java e o Android SDK configurados:

```bash
npm ci
npm run apk
```

O comando copia os arquivos web, sincroniza o projeto Capacitor e executa o build Android de debug.

## Controles

| Ação | Controle |
|---|---|
| Pular cutscene | Duplo clique / duplo toque |
| Iniciar conversa | Botão **Conversar** |
| Mostrar destinos | Botão **Ir para** |
| Escolher destino | Opção do menu **Ir para** |
| Avançar ou completar uma fala | Clique na caixa, `Enter` ou espaço |
| Abrir o celular | Botão **Celular** |
| Abrir a Bolsa | Botão **Bolsa** |
| Fechar destinos ou voltar no celular | `Escape` |
| Voltar ou fechar o celular | Botão **Voltar** |

## Estrutura do projeto

```text
.
├── index.html       # Estrutura da Visual Novel e do celular
├── styles.css       # Aparência, animações e responsividade
├── js/
│   ├── bootstrap.js # Cria a instância, prepara o menu e inicia a Cutscene 01
│   ├── game.js      # Composição das fábricas e injeção de services
│   ├── cutscene.js  # Controlador único de sequência, input e Skip
│   ├── cutscene-view.js # Apresentação do título e luz da abertura
│   ├── cutscene-frames.js # Renderer de quadros, câmera e efeitos
│   ├── cutscene-renderers.js # Seleção da apresentação de cada sequência
│   ├── cutscene-audio.js # Preload e ciclo de vida dos SFX
│   ├── title-menu.js # Tela inicial: capa do caderno e páginas de registros
│   ├── config.js    # Tempos e limites globais, incluindo cutscenes
│   ├── data.js      # Locais, cenas, personagem e conteúdo narrativo
│   ├── state.js     # Estado centralizado do jogo
│   ├── dom.js       # Acesso agrupado ao DOM por componente
│   ├── events.js    # Eventos globais (teclado, redimensionamento)
│   ├── bag.js       # Fábrica da Bolsa (inventário)
│   ├── dialogue.js  # Fábrica de diálogos e monólogos
│   ├── monologues.js# Conteúdo dos monólogos por contexto
│   ├── phone.js     # Fábrica do celular (apps, tema, navegação)
│   ├── scene.js     # Fábrica de cena (fundos, hotspots, objetos)
│   ├── gallery.js   # Fábrica da Galeria (fotografias, save/load)
│   ├── persistence.js # Snapshot, validação e restauração narrativa
│   ├── save-system.js # Sistema de saves manuais e autosave
│   ├── interface.js # Fábrica da interface principal (botões, menus)
│   ├── keyboard.js  # Teclado virtual próprio do jogo
│   ├── text-entry.js # Controlador compartilhado de entrada de texto
│   ├── animation.js # Serviço de animação e tempos visuais
│   ├── mechanics.js # Estratégias de interação e registro de tipos
│   └── scene-transition.js # Fade global entre cenas e bloqueio de input
├── assets/
│   ├── audio/       # WAVs sintetizados e receitas reproduzíveis
│   ├── cenario/     # Fundos, quadros de Lulith e contrato de cenários
│   ├── interfaces/  # Ícones e README do contrato de interface
│   └── sprites/     # Personagens e README do contrato de sprites
├── android/         # Projeto nativo gerado pelo Capacitor
├── capacitor.config.json # Configuração do aplicativo Android
├── package.json      # Dependências e comandos de build
├── GDD.md           # Visão completa do jogo e da narrativa
├── IDEIA_CONCEITUAL.md # Decisões conceituais e pendências atuais
├── ESTRUTURA_GAMING.md # Arquitetura, estado implementado e contratos técnicos
├── REGRAS_DE_DESIGN.md # Regras gerais de design e índice dos contratos de assets
├── TODO.md          # Lista de tarefas do protótipo
├── docs/
│   ├── ADR_LOG.md   # Registro de decisões de arquitetura
│   ├── STATUS_PROJETO.md # Implementado, pendente e evidências de validação
│   ├── cutscenes.md # Sequências, configuração e limpeza de apresentação
│   ├── PHONE_THEMES.md # Contrato de temas visuais do celular
│   ├── POINT_AND_CLICK.md # Guia de point-and-click e Bolsa
│   ├── SAVE_SYSTEM.md # Contrato de persistência e saves
│   ├── SCENE_TRANSITIONS.md # Contrato das transições globais de cena
│   └── TEXT_INPUT.md # Documentação do teclado virtual e entrada de texto
└── README.md        # Visão geral e instruções de execução
```

## Documentação

| Documento | Responsabilidade |
|---|---|
| [`IDEIA_CONCEITUAL.md`](IDEIA_CONCEITUAL.md) | Decisões, hipóteses e pendências conceituais |
| [`GDD.md`](GDD.md) | Design narrativo e mecânico de longo prazo |
| [`REGRAS_DE_DESIGN.md`](REGRAS_DE_DESIGN.md) | Regras gerais de design e índice dos contratos de assets |
| [`ESTRUTURA_GAMING.md`](ESTRUTURA_GAMING.md) | Arquitetura, estado implementado e contratos técnicos |
| [`TODO.md`](TODO.md) | Roadmap executável do Ato I |
| [`docs/STATUS_PROJETO.md`](docs/STATUS_PROJETO.md) | Estado consolidado e validação registrada |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Visão geral da arquitetura e fluxo de dados |
| [`docs/JS_MODULES.md`](docs/JS_MODULES.md) | Referência de cada módulo JavaScript |
| [`AGENTS.md`](AGENTS.md) | Diretrizes para agentes Kilo e revisão de código |
| [`assets/audio/README.md`](assets/audio/README.md) | SFX locais e geração reproduzível |
| [`docs/ADR_LOG.md`](docs/ADR_LOG.md) | Registro de decisões de arquitetura |
| [`docs/PHONE_THEMES.md`](docs/PHONE_THEMES.md) | Contrato de temas visuais do celular |
| [`docs/POINT_AND_CLICK.md`](docs/POINT_AND_CLICK.md) | Guia de point-and-click e Bolsa |
| [`docs/SAVE_SYSTEM.md`](docs/SAVE_SYSTEM.md) | Contrato de persistência e saves |
| [`docs/cutscenes.md`](docs/cutscenes.md) | Cutscenes 01–03, título final, tempos, preload, Skip, câmera e áudio |
| [`docs/SCENE_TRANSITIONS.md`](docs/SCENE_TRANSITIONS.md) | Contrato das transições globais de cena |
| [`docs/TEXT_INPUT.md`](docs/TEXT_INPUT.md) | Documentação do teclado virtual e entrada de texto |
| [`assets/cenario/README.md`](assets/cenario/README.md) | Organização e contrato dos fundos de cena |
| [`assets/interfaces/README.md`](assets/interfaces/README.md) | Organização e contrato dos ícones de interface |
| [`assets/sprites/README.md`](assets/sprites/README.md) | Organização e contrato dos sprites |

O padrão implementado para mecânicas e animações está em
[`docs/MECHANICS_PATTERN.md`](docs/MECHANICS_PATTERN.md).

## Fluxo do protótipo atual

```text
Preto → SANMD → significado → kk → subida → luz (aguarda Skip) → Menu
│
├── Novo jogo ──> Abre o caderno → Fade → Estado novo → Lulith (10 quadros) → Beco
│                                                                       → Sair do beco → Cutscene 03
│                                                                       → ATO 1 COMPLETO → Menu
│
└── Carregar ──> Abre o caderno ──> Páginas com os registros ──> Selecionar ──> Load
                       ▲
                       └── Voltar fecha o caderno
```

Depois disso o protótipo combina exploração point-and-click no cenário com a interface do celular:

```text
Cenário
│
├── Conversar ──> Diálogo ou monólogo ──> Cenário
│
├── Ir para ──> Destinos conectados ──> Outra cena; na entrada, saída final após coleta
│
├── Bolsa ──> Inventário e ação USAR ──> Cenário
│
└── Celular ──> Tela inicial ──> Aplicativos ──> Voltar
```

- **Tela inicial:** caderno fechado sobre a mesa escura. `Novo jogo` e `Carregar` são rótulos gravados na arte, com áreas de toque sobrepostas. A página aberta do próprio caderno é a tela de Load, e **Carregar** nunca abre um menu externo. A tela inicial apenas apresenta e seleciona o registro: o Save System continua sendo a fonte de verdade, sem formato próprio.

- **Hotspots:** objetos clicáveis no beco (cofre, celular) com feedback visual e acessibilidade por teclado.
- **Bolsa:** inventário narrativo que registra o Celular de Lulith e permite a ação **USAR** para ativar o aparelho.
- **Celular:** principal interface narrativa com relógio, data e apps simulados.

Os aplicativos do celular são:

- **Mensagens:** primeiro contato anônimo; permanece identificado como `???` durante toda a conversa inicial.
- **Galeria:** fotografias com 10 expressões da MJ, save/load fotográfico com até 9 saves manuais, preview, detalhe e flash de 140ms.
- **Arquivos:** quatro registros anteriores ao reset, incluindo o enigma obrigatório `5-12-1`; após a limpeza, o aplicativo continua acessível, mas vazio.

Na direção futura também estão previstos **Câmera**, **Terminal**, **Mapa**, **Progresso** e **Salvamento/replay**.

Na V1 atual, **Mensagens**, **Galeria** (com 10 expressões fotográficas da MJ) e o recorte pré-reset de **Arquivos** estão funcionais; **Notas** foi removida da tela inicial.

## Escopo da V1

A V1 busca validar a base da interface, das interações e dos sistemas centrais. Permanecem fora deste protótipo inicial:

- Sistema completo de investigação point-and-click.
- Exame e apresentação de evidências.
- Navegação por mapa.
- Puzzles e terminal hacker.
- ARG e integrações externas.
- Sistema de finais e progresso de 100%.
- Replay narrativo persistente.
- Arte e narrativa definitivas.

A investigação point-and-click com hotspots, Bolsa e ativação do celular já está prototipada no recorte atual do beco. Esses recursos fazem parte da visão de longo prazo descrita no [`GDD.md`](GDD.md), mas não são necessários para validar a estrutura atual.

## Fluxo narrativo planejado do Ato I

```text
Cutscene de Lulith (já implementada, sem falas)
↓
James acorda MJ
↓
Caso policial introdutório e tutorial point-and-click
↓
Retorno à mesa na delegacia
↓
Nota: jogar fora → final imediato com progresso mínimo
│
└── resolver → coordenadas → deslocamento → cofre
                                   ↓
                           celular de Lulith
                                   ↓
                  mensagens, reset remoto e terminal
```

O protótipo encerra o Ato I ao sair do beco depois da coleta, com a Cutscene 03 e o título **ATO 1 COMPLETO**. O Ato I canônico deverá ensinar os principais sistemas antes de abrir a estrutura maior de investigação. A Cutscene 02 já apresenta Lulith trabalhando e reagindo às falhas do notebook, sem diálogo. O caso introdutório, os enigmas da nota e do cofre e o local exato em São Paulo ainda precisam ser definidos; o jogo atual segue diretamente para o beco.

## Testes

O projeto inclui suítes automatizadas que validam navegação, estado do celular, saves, assets fotográficos, layout da Galeria, teclado virtual, entrada de texto e a tela inicial:

```bash
npm test
```

Arquivos de teste:
- `test/animation.test.js` — serviço de animação e tempos visuais.
- `test/cutscene.test.js` — ordem, Skip, input, preload e finalização comum.
- `test/cutscene-frames.test.js` — quadros, câmera, áudio, efeitos, suavização e limpeza.
- `test/bolsa.test.js` — inventário, ações diretas e ativação do aparelho.
- `test/fase-navegacao.test.js` — destinos e bloqueio de saltos entre cenas.
- `test/fase10-mj.test.js` — sprite e presença visual de MJ.
- `test/fase8.test.js` — fluxo do primeiro contato, reset remoto e monólogos.
- `test/gallery-layout.test.js` — grade da Galeria e metadados das fotografias.
- `test/interface-icons.test.js` — ícones principais e contrato visual.
- `test/photo-assets.test.js` — sprites fotográficos, transparência e fallback.
- `test/save-system.test.js` — persistência, validação, load e autosave.
- `test/text-input.test.js` — teclado virtual, entrada de texto, shift, layouts, acentos, teclado físico e snapshot.
- `test/scene-transition.test.js` — fases da transição, concorrência, bloqueio de input, estados e reduced motion.
- `test/title-menu.test.js` — estados, animação, paginação e delegação de carga da tela inicial.
- `test/tela-inicial.test.js` — bootstrap real contra o DOM publicado e geometria conferida contra `assets/interfaces/menu.png` e `save-menu.png`.

## Critérios de validação

A estrutura básica da V1 será considerada funcional quando for possível:

- [x] Assistir às Cutscenes 01 e 02, pular por duplo clique/toque e iniciar gameplay somente após a apresentação.
- [x] Sair do beco após coletar o celular, assistir ou pular a Cutscene 03, registrar autosave e retornar ao menu.
- [x] Carregar registros sem executar a Cutscene 02.
- [x] Visualizar um cenário provisório.
- [x] Navegar entre entrada, interior e fundo do beco.
- [x] Visualizar um personagem provisório.
- [x] Utilizar o botão **Conversar**.
- [x] Exibir e avançar uma sequência de falas.
- [x] Utilizar o botão **Ir para** e exibir somente destinos válidos.
- [x] Utilizar o botão **Celular**.
- [x] Abrir uma interface provisória de celular.
- [x] Retornar à interface principal.
- [x] Repetir a navegação sem quebrar o estado da interface.
- [x] Conversar com o dono pelo aplicativo **Mensagens**.
- [x] Usar **Conversar** como monólogo quando o protagonista estiver sozinha.
- [x] Posicionar o botão **Voltar** dentro do celular.
- [x] Examinar hotspots point-and-click no cenário.
- [x] Abrir o cofre e coletar o Celular de Lulith.
- [x] Abrir a Bolsa e ver o item coletado.
- [x] Ativar o celular pela Bolsa com reação narrativa.
- [x] Tirar fotografias na Galeria com flash, preview e detalhe.
- [x] Carregar e excluir saves fotográficos.
- [x] Utilizar o celular em layout mobile paisagem.

> A V1 não precisa representar o jogo final. Ela precisa mostrar se essa estrutura é a direção certa para o projeto.
