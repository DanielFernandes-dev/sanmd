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

O núcleo do protótipo é uma aplicação web estática feita com HTML, CSS e JavaScript. O projeto também possui uma camada Capacitor para gerar o aplicativo Android.

Já estão disponíveis:

- Três cenas noturnas provisórias conectadas: entrada, interior e fundo do beco.
- Personagem de MJ em PNG (`assets/sprites/MJ.png`), mostrada em cena somente durante os monólogos.
- Comandos por ícones pixelados para **Conversar**, **Ir para** e **Celular**, sem sidebar visual.
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

> A cena ainda começa em um contexto provisório, pois as etapas anteriores do Ato I não foram implementadas. O celular, os monólogos, os arquivos, o primeiro contato com Lulith e o reset remoto já formam um recorte canônico da Fase 8; os assets continuam genéricos.

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
| Iniciar conversa | Botão **Conversar** |
| Mostrar destinos | Botão **Ir para** |
| Escolher destino | Opção do menu **Ir para** |
| Avançar ou completar uma fala | Clique na caixa, `Enter` ou espaço |
| Abrir o celular | Botão **Celular** |
| Fechar destinos ou voltar no celular | `Escape` |
| Voltar ou fechar o celular | Botão **Voltar** |

## Estrutura do projeto

```text
.
├── index.html       # Estrutura da Visual Novel e do celular
├── styles.css       # Aparência, animações e responsividade
├── js/
│   ├── data.js      # Locais, cenas, personagem e conteúdo narrativo
│   └── game.js      # Estado, diálogos e navegação
├── assets/
│   ├── cenario/     # Fundos e README do contrato de cenários
│   ├── interfaces/  # Ícones e README do contrato de interface
│   └── sprites/     # Personagens e README do contrato de sprites
├── android/         # Projeto nativo gerado pelo Capacitor
├── capacitor.config.json # Configuração do aplicativo Android
├── package.json      # Dependências e comandos de build
├── GDD.md           # Visão completa do jogo e da narrativa
├── IDEIA_CONCEITUAL.md # Decisões conceituais e pendências atuais
├── ESTRUTURA_GAMING.md # Estado técnico e roadmap do protótipo
├── TODO.md          # Lista de tarefas do protótipo
├── test/            # Testes automatizados dos fluxos implementados
└── README.md        # Visão geral e instruções de execução
```

## Documentação

| Documento | Responsabilidade |
|---|---|
| [`IDEIA_CONCEITUAL.md`](IDEIA_CONCEITUAL.md) | Decisões, hipóteses e pendências conceituais |
| [`GDD.md`](GDD.md) | Design narrativo e mecânico de longo prazo |
| [`ESTRUTURA_GAMING.md`](ESTRUTURA_GAMING.md) | Arquitetura, estado implementado e contratos técnicos |
| [`TODO.md`](TODO.md) | Roadmap executável do Ato I |
| [`assets/cenario/README.md`](assets/cenario/README.md) | Organização e contrato dos fundos de cena |
| [`assets/interfaces/README.md`](assets/interfaces/README.md) | Organização e contrato dos ícones de interface |
| [`assets/sprites/README.md`](assets/sprites/README.md) | Organização e contrato dos sprites |

## Fluxo do protótipo atual

```text
Cenário
   │
   ├── Conversar ──> Diálogo ou monólogo ──> Cenário
   │
   ├── Ir para ──> Destinos conectados ──> Outra cena
   │
   └── Celular ──> Tela inicial ──> Aplicativos ──> Voltar
```

O celular é a principal interface narrativa planejada. Seus aplicativos simulados são:

- **Mensagens:** primeiro contato anônimo; permanece identificado como `???` durante toda a conversa inicial.
- **Galeria:** fotografias com 10 expressões da MJ, gravações e pistas visuais (implementada com Save/Load fotográfico).
- **Notas:** informações contextuais.
- **Arquivos:** quatro registros anteriores ao reset, incluindo o enigma obrigatório `5-12-1`; após a limpeza, o aplicativo continua acessível, mas vazio.

Na direção futura também estão previstos **Câmera**, **Terminal**, **Mapa**, **Progresso** e **Salvamento/replay**.

Na V1 atual, **Mensagens**, **Galeria** (com 10 expressões fotográficas da MJ) e o recorte pré-reset de **Arquivos** estão funcionais; Notas permanece como elemento provisório.

## Escopo da V1

A V1 busca validar somente a base da interface e das interações. Permanecem fora deste protótipo inicial:

- Sistema completo de investigação.
- Exame e apresentação de evidências.
- Navegação por mapa.
- Puzzles e terminal hacker.
- ARG e integrações externas.
- Sistema de finais e progresso de 100%.
- Replay narrativo.
- Arte e narrativa definitivas.

Esses recursos fazem parte da visão de longo prazo descrita no [`GDD.md`](GDD.md), mas não são necessários para validar a estrutura atual.

## Fluxo narrativo planejado do Ato I

```text
Cutscene provisória de Lulith
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

O Ato I deverá ensinar os principais sistemas antes de abrir a estrutura maior de investigação. O caso introdutório, o texto da cutscene, os enigmas da nota e do cofre e o local exato em São Paulo ainda precisam ser definidos.

## Critérios de validação

A estrutura básica da V1 será considerada funcional quando for possível:

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
- [x] Usar **Conversar** como monólogo quando o protagonista estiver sozinho.
- [x] Posicionar o botão **Voltar** dentro do celular.

> A V1 não precisa representar o jogo final. Ela precisa mostrar se essa estrutura é a direção certa para o projeto.
