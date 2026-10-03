# Registro de decisões

> Histórico de decisões e revisões. Entradas antigas preservam o contexto da época
> e podem ter sido substituídas por decisões posteriores. Para o comportamento
> vigente, consulte [Estado do projeto](STATUS_PROJETO.md) e os contratos por sistema.

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

## 2026-09-26 — Significado no lugar do título, luz que espera e som da lâmpada

Status: aceito.

Contexto: a abertura mostrava o significado como subtítulo abaixo do título, e o
texto subia rápido demais para ser lido. O asset de áudio continuava pendente, e
uma cutscene que termina sozinha entrega o menu antes de o jogador estar
pronto para escolher.

Decisão: `#cutscene-siglas` e `#cutscene-frase` ocupam a mesma célula de grid, e
o significado nasce no lugar do título — uma palavra por letra de SANMD, em
cascata com `--i`, e a risada por último. Sem arquivo de fonte: o itálico é o
`font-style` real de `--fonte` e a leitura pixelada vem da revelação em
`steps(24, end)` com sombra deslocada sem desfoque. A subida vai a 3600ms e a
luz a 2600ms em `ease-in-out`, porque iluminar é ambiente e leitura de texto é
narrativa. Um passo com `hold: true` apresenta e não agenda timer: a luz fica
acesa e só `pularCutscene()` encerra, com `Enter`/`Space` como caminho sem
ponteiro. O som é sintetizado em `assets/audio/lampada.wav` e o APK libera o
autoplay em `MainActivity.java`.

Consequências: a espera não é cancelamento do Save System e não entra no
snapshot; a fase continua ativa e o menu permanece `inert` até o gesto, o que
torna a primeira interação do jogador um duplo toque intencional. A sequência
ganhou dois passos e a risada é conteúdo, não rótulo, então não recebe caixa
alta. A fonte continua entre as quatro faces existentes. Se um dia entrar fonte
pixel de verdade, é uma quinta face e precisa de revisão deste registro. Ver
[Cutscenes](cutscenes.md) e [`assets/audio/README.md`](../assets/audio/README.md).

## 2026-09-26 — SANMD como estado contraído do único título

Status: aceito; substitui a apresentação anterior com siglas/frase sobrepostas
ou separadas e a espera indefinida depois da luz.

As mesmas cinco iniciais se deslocam e abrem seus complementos, formando o
significado. Só então entra `kk`; o bloco completo pausa e sobe. Usar a fonte
do canon em itálico, 700, com tamanho expandido de 3.8cqw e escala contraída
1.84. Medidas são feitas por estado e movimentos usam transform/clip-path.
A conclusão natural liberava o menu automaticamente, decisão substituída pela
entrada seguinte. Som técnico original de 420 ms sincroniza com a luz, sem
depender de autoplay para concluir.

## 2026-09-26 — A luz acesa espera o Skip

Status: aceito; substitui a conclusão natural que liberava o menu sozinha.

Contexto: com o término natural, a abertura entregava o menu no mesmo instante
em que a luz terminava, e o primeiro toque do jogador caía em um alvo que ele
não tinha visto aparecer. A espera também evita a última disfarçada: o clip
negativo de `inset(0 -0.15em 0 0)` existia só para sangrar a letra na borda do
texto, e o título ficava sem respiro depois de revelado.

Decisão: um passo pode declarar `hold: true`. O controlador apresenta o passo e
não agenda timer, então `finalizar()` deixa de ser chamado pela sequência e
passa a ser chamado só por `pularCutscene()`. A luz acende em `ease-out` a
partir do canto da lâmpada e a cena permanece visível, com o menu `inert`,
até o duplo toque. Nenhuma tecla foi acrescentada como caminho sem ponteiro:
o duplo toque já é o gesto de Skip em todas as fases e manter um único caminho
evita duas formas de encerrar a mesma espera. O sangue da letra passa a ser
`padding-right: .1em` em `.cutscene-suffix` e `.cutscene-laugh`, e o clip
volta a ser `inset(0 0% 0 0)`.

Consequências: `intro_abertura` é a única sequência com `hold`, e somente no
último passo; um roteiro sem `hold` continua finalizando naturalmente, com o
mesmo finalizador e a mesma conclusão única. Sem timer não há segunda entrada
na fase, então o som da lâmpada toca uma vez. A espera continua sendo estado
transiente de apresentação: não é cancelamento do Save System, não entra no
snapshot e cada abertura do aplicativo repete a luz. A primeira interação do
jogador passa a ser um duplo toque intencional sobre uma cena já iluminada, e
os testes que percorrem a abertura precisam encerrar com `pularCutscene()`.
Ver [Cutscenes](cutscenes.md).

## 2026-10-02 — Consolidação da Cutscene 02 e das revisões de ritmo

Status: aceito; registro consolidado das entregas de 26/09 e da revisão documental.

Decisão: `lulith_codigo` é uma sequência de dez quadros estáticos, exclusiva de
Novo jogo, executada pelo mesmo controlador da abertura. O estado novo é criado
antes da apresentação. Carregar não a executa. O renderer e o pool de áudio são
componentes de apresentação, sem outro detector de Skip e sem estado persistido.

O encerramento opcional assíncrono mantém input bloqueado enquanto câmera,
efeitos e áudio são cancelados e o palco faz fade. O callback do menu revela o
gameplay, inicia a conversa e reutiliza o autosave. Não existe autosave por frame.

Revisões solicitadas: primeiro encurtar o ritmo; depois suavizar os quadros
calmos em 100 ms; por último alongar 01–07 em cerca de 25%, preservando 08–10.
Erros e chute mantêm corte seco. A restrição inicial de evitar dissolves repetidos
foi ajustada pelo pedido posterior de suavização, sem interpolar artes ou criar
vídeo. CONFIG é a fonte dos tempos. SFX são sintetizados locais, substituíveis.

A proposta antiga de monólogo sobre recuperar o que foi tirado de Lulith não
integra a Cutscene 02: não há diálogo nem legenda. O roteiro canônico completo
após a cutscene continua pendente; o protótipo entra diretamente no beco.

Evidências e limites: [estado do projeto](STATUS_PROJETO.md) e
[contrato de cutscenes](cutscenes.md). Registros anteriores deste ADR descrevem
as revisões históricas: os nós separados de siglas/frase, o Skip por teclado e
os tempos antigos da abertura foram substituídos. O comportamento atual usa
um único título, duplo clique/toque e espera na luz até Skip.


## 2026-10-02 — Sessão de execução e limpeza idempotente das cutscenes

Status: aceito.

O controlador único agrupa seu estado transitório por execução, em vez de manter
flags independentes de geração, preparo e finalização. Identidade da sessão e
fase bloqueiam callbacks antigos e reentrância. Os contratos públicos, sequências,
tempos, detector de Skip e apresentação da abertura permanecem iguais.

A seleção de apresentação sai do renderer de quadros para `cutscene-renderers.js`.
O pool de áudio passa a cancelar preloads pendentes, compartilhar a promessa de
encerramento e limpar recursos em `finally`. Falhas visuais liberam a sessão;
recusa de concorrência em Novo jogo segue o tratamento de erro do caderno.

Validação: suíte Node completa e regressões de falha/cancelamento. APK debug
recompilado, instalado e revalidado em 02/10/2026 no SM-A055M: abertura, Lulith
natural, Skip nativo e Carregar aprovados. Ver [Cutscenes](cutscenes.md).

## 2026-10-02 — Cutscene 03 encerra o protótipo ao sair do beco

Status: aceito para o recorte atual.

A condição está em `scene.js`: **Sair do beco** surge em `Ir para` na entrada
quando o cofre está aberto, o celular foi coletado e `act1Complete` é falso.
A coleta sozinha não inicia a apresentação. A sequência `act1_ending` vive em
`CUTSCENES`, com oito PNGs existentes, cortes secos e um nono passo preto em
CSS; o título `act1_title` é outra sequência do mesmo controlador. A linguagem
do menu é reutilizada sem lâmpada ou interruptor.

Fim natural e Skip compartilham a conclusão: marcar `act1Complete`, registrar
um autosave e devolver o menu após o título. Saves v1 sem a nova flag recebem
`false`; carregar o final não repete a saída. Os passos, câmera, áudio e título
não entram no snapshot. Não se acrescenta sistema de áudio, transição ou Skip.

Validação: 193 testes Node, fluxo e Skip nos nove quadros no Chromium landscape,
APK debug compilado/instalado e abertura em paisagem no SM-A055M. A execução
completa e a escuta da sequência no WebView Android permanecem pendentes.
Ver [Cutscenes](cutscenes.md) e [Save System](SAVE_SYSTEM.md).
