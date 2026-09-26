# Registro de decisões

## 2026-09-09 — Teclado virtual próprio e entrada de texto sem IME

Status: aceito.

Contexto: nomear fotografias e responder mensagens precisa de digitação, mas
campos `input` nativos abrem o teclado IME do Android, que sobrepõe o celular do
jogo e quebra o layout fixo em paisagem. Para manter a identidade visual e o
controle total da interface, o jogo não pode depender do teclado do sistema.

Decisão: criar um teclado virtual próprio dentro do celular (`js/keyboard.js`)
e um controlador compartilhado de entrada de texto (`js/text-entry.js`) com
estado transitório `state.texto` (buffer, cursor, shift, layout, painel de
acentos). A entrada de texto é aberta por requisição (`abrirEntradaTexto({...})`
com `confirmLabel`, `maxLength`, `allowEmpty` e callbacks de confirmação) e
confirmada ou cancelada sem diálogos nativos. `#gallery-photo-name` e
`#messages-composer-field` viraram botões e o compositor envia mensagens
diretamente pelo sistema de celular. Enquanto edita, `#phone-screen` ganha
`texto-aberto` com as seções bloqueadas por CSS; o listener global de `keydown`
desvia o teclado físico (digitar, Backspace, setas, Enter, Esc). O estado do
teclado não é persistido: `capturarEstadoJogo` usa chaves explícitas e restaurar
fecha a edição.

Consequências: `CONFIG.tamanhoMensagem` (160) complementa `tamanhoNomeFoto`
(28); o teclado nativo nunca abre para o texto do jogo. A Galeria e Mensagens
reutilizam o mesmo editor, que permanece indisponível para regressões de
Save/Load. Sem o IME, não há mais dependência de comportamento após
toque/seletor de idioma do sistema.

Validação: suíte com 71 testes existentes mais 12 novos (`test/text-input.test.js`),
total de 83 aprovados com `node --test`, cobrindo Galeria, Mensagens, limites,
shift, layouts, acentos, teclado físico e snapshot.

## 2026-09-09 — Refatoração em fábrica e fim dos diálogos nativos

Status: aceito.

Contexto: `game.js` centralizava quase 2 mil linhas, impedindo testes isolados e
tornando a suíte frágil após mudanças pontuais. A Galeria dependia de
`window.confirm`, diálogo nativo do sistema operacional, para confirmar a
exclusão de fotografias.

Decisão: dividir `js/game.js` em fábricas independentes por componente
(`config`, `data`, `state`, `dom`, `bag`, `dialogue`, `monologues`, `phone`,
`scene`, `gallery`, `persistence`, `save-system`, `interface`, `events`,
`bootstrap`). `criarJogo()` compõe os serviços e injeta dependências de banco
local; o DOM é exposto por `dom.js` de forma agrupada por componente. O harness
`test/load-game.cjs` acessa a instância criada pelo bootstrap. A exclusão via
`excluirFotoSelecionada()` passou a agir imediatamente, sem o `window.confirm`,
eliminando o último diálogo nativo do jogo.

Consequências: a suíte cobre agora 71 testes isolados, todos verdes. Não há mais
uso de `alert`, `confirm` ou `prompt` do sistema no código do jogo. O estado do
diálogo de exclusão transitório (`exclusaoIdPendente`) não é persistido porque os
snapshots não capturam a galeria.

Validação: `node --test` com 71 testes aprovados; APK debug recompilado com
sucesso e instalado via ADB no dispositivo conectado.

## 2026-09-06 — Layout mobile em paisagem e carregamento direto

Status: aceito.

Decisão: bloquear a Activity Android em paisagem e reduzir proporcionalmente a
Bolsa, o aparelho e os painéis de Mensagens, Arquivos e Galeria em alturas
pequenas. Interações com o cofre e o aparelho não exibem mensagens temporárias;
carregar uma fotografia restaura o save diretamente, sem confirmação.

Consequências: o estado de Save/Load permanece o mesmo, a confirmação de exclusão
de fotografias continua protegendo uma ação destrutiva e os dados narrativos dos
apps não são alterados.

Validação: 61 testes automatizados passaram; APK Android será recompilado com a
orientação fixa em paisagem.

## 2026-09-06 — Ícone do jogo no launcher Android

Status: aceito.

Decisão: usar a arte oficial do jogo em `assets/interfaces/game-icon.png`, sem a
chave dourada, como ícone normal e redondo do launcher, nas densidades legadas e
no adaptive icon do Android. O fundo do adaptive icon acompanha a paleta escura
da arte.

Consequências: o ícone exibido na tela inicial do Android fica consistente com o
ícone do jogo, sem alterar o sistema de Save/Load ou a identidade visual interna.

Validação: APK debug recompilado com sucesso e instalado no dispositivo Android
conectado via ADB.

## 2026-09-06 — Fundos atuais e visuais após a cutscene

Status: aceito.

Decisão: alinhar a Galeria à paleta de Mensagens e Arquivos apenas no tema
`lulith`. Preservar no tema `mj` a aparência anterior da tela inicial e de cada
app, destinada ao momento posterior à cutscene. A Galeria mantém integralmente
o sistema de Save/Load. A troca narrativa de tema não é antecipada neste ajuste.

Referência: [Visuais do celular](PHONE_THEMES.md).

Validação antes do commit: 61 testes passaram com `node --test`, incluindo
ativação pela Bolsa e regressões de Save/Load. `git diff --check` sem erros.

## 2026-09-06 — Objetos interativos e Bolsa da MJ

Status: aceito.

Contexto: a investigação no beco precisa permitir abrir o cofre, coletar o celular e preservar o progresso ao salvar e carregar.

Decisão: manter o fundo da cena separado dos sprites e hotspots dos objetos. Representar o inventário por IDs e as mudanças dos objetos por flags de cena. A Bolsa usa pesquisa e páginas de nove itens, com detalhes do item selecionado. Os snapshots v1 aceitam `inventory` e `sceneState`; saves antigos recebem valores iniciais.

Consequências: objetos, áreas interativas e fundo compartilham as coordenadas da cena. A coleta e a abertura do cofre podem ser restauradas sem trocar o fundo. As definições dos itens permanecem fora dos saves.

Referências: [Point-and-click e Bolsa](POINT_AND_CLICK.md), [Save/Load](SAVE_SYSTEM.md).

## 2026-09-06 — Aparência e posição do botão Voltar

Status: aceito.

Contexto: a moldura arredondada do botão incomodava visualmente, e sua posição deve distinguir a tela inicial dos aplicativos.

Decisão: remover borda, arredondamento, fundo e sombra do botão. Na tela inicial do celular, posicioná-lo no canto inferior esquerdo e reservar espaço abaixo dos apps. Nas telas dos aplicativos, manter o canto superior esquerdo. A posição acompanha a visibilidade de `phone-home` por CSS.

Consequências: a seta rosa e a navegação contextual existente são preservadas; o botão não ocupa o espaço da grade de apps.

Validação do conjunto: 56 testes passaram usando Node.js v26.7.0 (`node --test`); `git diff --check` sem erros. O teste existente de aparência foi atualizado para o botão sem moldura. Essa execução não inclui inspeção visual em navegador.

## 2026-09-06 — Da Bolsa ao aparelho ativo

Status: aceito.

Contexto: coletar o celular não deve desbloquear automaticamente sua função. MJ
está com o aparelho original quebrado e precisa decidir usar o aparelho encontrado.

Decisão: separar `aparelho.activePhone` do inventário e de `phoneTheme`, mantendo
`originalPhoneStatus: "broken"`. A coleta existente permanece intermediária. Uma
`inventoryAction` declarada pelo item aciona um handler após uma reação curta;
a conclusão remove o item, ativa Lulith e usa o autosave do diálogo. O botão
CELULAR reflete exclusivamente a presença de aparelho ativo e o layout se compacta
quando está oculto. O tema inicial Lulith não exibe a personalização MJ.

Consequências: a Bolsa passa a suportar ações diretas opcionais sem misturá-las aos
hotspots. Dados do celular e Galeria são preservados. Load cancela ações pendentes;
a migração de saves anteriores preserva progresso já realizado no celular, conforme
[contrato de persistência](SAVE_SYSTEM.md). Nenhuma nova função de aparelho ou
personalização foi adicionada.

Validação: testes automatizados cobrem A/B/C entre sessões, duplo clique, autosave,
preservação de conteúdo, migração, cancelamento por load e atualização da Bolsa.
O fluxo também foi exercitado em Chromium com mouse e toque em 1440×900, 390×844
e 844×390.

## 2026-09-11 — Facade de animação e Strategy para interações

Status: aceito.

Contexto: o fade executava sua própria animação e os tempos de CSS duplicavam
CONFIG. Hotspots tinham uma lista de tipos e um desvio exclusivo para coleta,
enquanto a Bolsa já usava handlers por tipo.

Decisão: extrair `animation.js` e `mechanics.js`, mantendo fábricas e injeção de
dependências. Compartilhar o registro de estratégias entre hotspots e Bolsa;
preservar validação, mutações, eventos narrativos e autosave nos seus sistemas.
Centralizar durações CSS em CONFIG e eliminar esperas decorativas quando o
jogador pede movimento reduzido. Limpar o timer de proteção após cada fade.

Consequências: novas interações têm um ponto explícito de extensão, os efeitos
visuais ficam separados das regras narrativas e o formato de saves não muda.
Contrato e extensão: [Padrão das mecânicas](MECHANICS_PATTERN.md).

## 2026-09-26 — Regras gerais de design na raiz e contratos específicos nos assets

Status: aceito.

Contexto: as regras de design estavam dispersas. A direção artística vivia em
`IDEIA_CONCEITUAL.md`, a arquitetura e o estado atual em `ESTRUTURA_GAMING.md`,
os contratos de tempo em `docs/MECHANICS_PATTERN.md` e as medidas de arte em três
README dentro de `assets/`. Não havia lugar que declarasse o que vale para toda
cena, toda interface e todo asset, e `styles.css` já carregava 166 hexes distintos,
sete variáveis declaradas e nunca usadas, dois nomes para o mesmo roxo e uma
regra de toque de `60×60px` em documento que o código não usa.

Decisão: criar `REGRAS_DE_DESIGN.md` na raiz como canon das regras transversais,
declarando tokens, composição de tela, movimento, estados de interação,
acessibilidade, naming, contrato comum de arte, pipeline e validação. O
documento declara o canon em vez de descrever o código: onde a implementação
divergir, a divergência é registrada como pendência com arquivo e linha, não
normalizada em silêncio. As regras específicas de cada tipo de arte permanecem
nos README de `assets/cenario`, `assets/interfaces` e `assets/sprites`, e a raiz
os referencia por link sem duplicar medida. Duas regras de hierarquia sustentam
a separação: um asset não redefine regra geral, e regra geral não duplica medida
de asset. Nenhum arquivo de código foi alterado; `README.md` e
`ESTRUTURA_GAMING.md` passaram a referenciar o novo documento.

Consequências: existe um único lugar para deciding regra de design, e a
separação entre transversal e específico fica explícita em vez de implícita na
estrutura de pastas. A seção de pendências registra o que o código viola, entre
elas a ausência de `env(safe-area-inset-*)`, a cobertura parcial de
`prefers-reduced-motion`, o foco removido da capa do caderno, alvos abaixo de
`44px` e a versão mínima de WebView não declarada, que é o que impede decidir se
o uso de `:has()` no layout é seguro. As regras específicas de assets não foram
alteradas, e a promoção delas para a raiz permanece em aberto. O registro formal
de voz do texto do jogo continua pendente: o projeto tem personagem e princípio
narrativo, mas nenhum documento declara idioma, cadência ou comprimento de linha.
Contrato e extensão: [Regras de design](../REGRAS_DE_DESIGN.md).

Validação: os 108 testes existentes seguem aprovados com `node --test`, sem
alteração de código. Os 16 links relativos e as 14 âncoras internas do novo
documento foram conferidos contra o repositório, e as citações de linha usadas
na seção de pendências foram verificadas em `styles.css`.

## 2026-09-26 — Abertura e controlador reutilizável de Cutscene

Status: aceito.

Decisão: compor um controlador por jogo, com sequência declarada em `js/data.js`,
tempos em CONFIG e visual separado. A abertura antecede o controle do menu, sem
recriar o caderno. Skip por dois inputs primários usa o mesmo finalizador do
fim natural, invalida callbacks e consome eventos sintetizados do gesto.

Consequências: estado visual fica em closures, fora do Save System; nenhuma flag
persistente impede repetição da intro. O novo overlay ocupa 1001 acima do menu
1000; o fade global continua responsável por navegação e fornece o preparo de
imagens. A tipografia de apresentação usa tokens de 7cqw/2.4cqw, exceção local à
escala de títulos de interface, para hierarquia no palco 1672:941. Movimento
reduzido preserva conteúdo e corta deslocamento. O efeito de interruptor tem
integração opcional; asset final pendente. Ver [Cutscenes](cutscenes.md).
