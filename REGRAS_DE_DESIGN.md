---
aliases:
  - Regras de Design
  - Design Rules
  - Canon Visual
tags:
  - sanmd
  - design
  - visual
  - tokens
  - acessibilidade
  - convencoes
status: atual
updated: 2026-09-26
---

# Regras de Design

> [!summary] Objetivo
> Este documento é o **canon das regras gerais de design** de *Sim, Acredite nas Mentiras Dele kk*: as regras transversais que valem para toda cena, toda interface e todo asset, independentemente de onde o elemento aparece.
>
> As regras **específicas de cada tipo de arte não ficam aqui**. Elas vivem nas pastas que contêm os assets e são referenciadas pela [seção 1](#1-onde-cada-regra-vive).
>
> O código é a fonte de verdade. Quando o código e este documento divergirem, a divergência é um bug: ou o código está errado, ou a regra mudou e este documento não foi atualizado. As divergências conhecidas estão na [seção 11](#11-pendências-e-divergências-conhecidas).

## Legenda de estado

Mesma convenção de [`IDEIA_CONCEITUAL.md`](IDEIA_CONCEITUAL.md):

| Marcador | Significado |
|---|---|
| `[DECIDIDO]` | Regra vigente. Código e arte devem obedecer. |
| `[PROVISÓRIO]` | Vale enquanto o protótipo durar. Pode mudar sem decisão nova. |
| `[PENDENTE]` | Questão aberta. Ninguém deve tratar como regra sem resolver antes. |

---

# 1. Onde cada regra vive

A separação é estrita: **regra geral na raiz, regra específica na pasta do asset**.

| Escopo | Onde a regra mora | Documento |
|---|---|---|
| Pilares visuais, tokens, composição, movimento, acessibilidade, naming, contrato comum de arte, pipeline | **raiz** | este arquivo |
| Fundos de cena, proporções, objetos interativos, hotspots | `assets/cenario/` | [`assets/cenario/README.md`](assets/cenario/README.md) |
| Ícones, tela inicial, wallpaper, mockups de referência | `assets/interfaces/` | [`assets/interfaces/README.md`](assets/interfaces/README.md) |
| Sprites de personagem, pivô, expressões fotográficas | `assets/sprites/` | [`assets/sprites/README.md`](assets/sprites/README.md) |
| Fábricas, injeção de dependências, Strategy, tempos visuais | `docs/` | [`docs/MECHANICS_PATTERN.md`](docs/MECHANICS_PATTERN.md) |
| Investigação point-and-click e Bolsa | `docs/` | [`docs/POINT_AND_CLICK.md`](docs/POINT_AND_CLICK.md) |
| Temas visuais do celular | `docs/` | [`docs/PHONE_THEMES.md`](docs/PHONE_THEMES.md) |
| Fade global e bloqueio de input | `docs/` | [`docs/SCENE_TRANSITIONS.md`](docs/SCENE_TRANSITIONS.md) |
| Teclado virtual e entrada de texto | `docs/` | [`docs/TEXT_INPUT.md`](docs/TEXT_INPUT.md) |
| Slots, autosave e snapshot | `docs/` | [`docs/SAVE_SYSTEM.md`](docs/SAVE_SYSTEM.md) |
| Direção de arte, personagens, pilares de gênero | **raiz** | [`IDEIA_CONCEITUAL.md`](IDEIA_CONCEITUAL.md) |
| Arquitetura, estado implementado, controles | **raiz** | [`ESTRUTURA_GAMING.md`](ESTRUTURA_GAMING.md) |
| Decisões que mudam regra | `docs/` | [`docs/ADR_LOG.md`](docs/ADR_LOG.md) |

Duas regras de hierarquia `[DECIDIDO]`:

1. **Um asset não redefine regra geral.** Se um PNG ou SVG de `assets/` impõe uma cor, um tamanho ou um comportamento, isso é Exception local e precisa ser escrito no README da sua pasta, com justificativa.
2. **Regra geral não duplica medida de asset.** Dimensão de PNG, geometria em porcentagem de uma arte, ID de arquivo e mapeamento de sprite pertencem ao README da pasta. Aqui só vale o que se aplica a qualquer arte.

Quando uma regra é das duas coisas, ela é **geral** e vai aqui; a **medida** do asset, lá.

---

# 2. Pilares visuais

`[DECIDIDO]` — herdados de [`IDEIA_CONCEITUAL.md` §14.1](IDEIA_CONCEITUAL.md) e mantidos aqui como formulação operacional.

1. **Pixel art é direção final, não placeholder.** A estética pixelada continua na versão final do jogo.
2. **Ace Attorney é linguagem, não cópia.** Referência para personagens 2D, sprites expressivos, poses marcantes, leitura clara de emoção e apresentação de Visual Novel. Nenhum personagem, cenário ou tela pode copiar design específico de terceiros.
3. **A interface é diegética sempre que possível.** Celular, Bolsa, caderno de registros, teclado e photographs são objetos dentro do fiction, não menus do jogo. Quando algo não pode ser diegético, ele se apresenta como interface do próprio jogo — nunca como sistema do autor.
4. **A cena domina a tela.** Não existe sidebar permanente, moldura ornamental ou painel compete com o cenário. Interface é sobreposta e some quando não é usada.
5. **Cor de acento significa interação.** Repouso é creme (`#f4f0df`); dourado (`--cor-destaque`) é reservado a hover, foco e feedback. Nenhum controle fica dourado em estado neutro. Essa regra é geral e vale para todo subsistema que tenha acento próprio (Bolsa, celular, tela inicial), conforme [seção 3.1](#31-cores).
6. **A arte não carrega interface.** Fundo de cena não tem diálogo, botão, hotspot, texto variável ou moldura. Isso vale para toda arte, com uma única exceção declarada no contrato de [`assets/interfaces/README.md`](assets/interfaces/README.md): rótulos pintados na arte da capa do caderno.
7. **A resolução-base do jogo ainda não foi decidida.** A proporção de trabalho
   hoje é `1672:941` e é ela que trava o palco, a tela inicial e a composição das
   fotos. A resolução-base `320×180` em 16:9 é planejamento registrado, não fato:
   está em [`TODO.md`](TODO.md) e é declarada como tal em
   [`assets/cenario/README.md`](assets/cenario/README.md). Nenhuma regra deste
   documento pode depender de `320×180` como se já estivesse valendo.

8. **Regra em vez de observação.** Onde a regra é estável, ela é escrita aqui como
   regra, não como descrição do que o código faz hoje. Onde a implementação atual
   foge dela, a exceção entra na [seção 11](#11-pendências-e-divergências-conhecidas)
   com arquivo e linha, em vez de ser silenciosamente normalizada.

> [!warning] Antes de escolher entre as regras em conflito
> A [seção 11](#11-pendências-e-divergências-conhecidas) lista onde o código hoje
> viola este documento. Ler essa seção antes de "simplificar" uma regra evita
> apagar uma decisão ainda não resolvida.

---

# 3. Tokens

O jogo não tem biblioteca de design system. O canon vive em variáveis CSS no
bloco `:root` de [`styles.css`](styles.css) e nos valores que `CONFIG` injeta via
`configurarAnimacoes()`. Esta seção declara o que esses tokens significam.

`[DECIDIDO]` **Nenhum valor novo entra hardcoded no CSS.** Cor, fonte, duração e
raio saem de token. Hex literal, `px` de fonte e `ms` de animação em regra nova
são dívida, e entram na [seção 11](#11-pendências-e-divergências-conhecidas).

## 3.1 Cores

### Núcleo

Quatro tokens sustentam a identidade. São declarados no `:root` e não têm
variante por subsistema.

| Token | Valor | Papel |
|---|---|---|
| `--cor-fundo` | `#0b0e16` | Fundo do app e origem do fade global |
| `--cor-texto` | `#f0ead6` | Tinta primária sobre fundo escuro |
| `--cor-tela` | `#11182d` | Fundo de app dentro do celular |
| `--cor-destaque` | `#e8b34b` | **Acento de interação.** Nunca repouso |

### Acento por subsistema

Cada sistema fecha tem o seu, escolhido para não competir com o próximo.

| Subsistema | Token / valor | Onde |
|---|---|---|
| Gameplay, Ir para, hotspots | `--cor-destaque` `#e8b34b` | Cena, barra de ação, menu Ir para |
| Bolsa da MJ | `--bolsa-accent` `#9b7fd6` (+ `--bolsa-accent-soft` `#7a5c9e`) | Slots, paginação, busca, ações |
| Celular tema `mj` | `#f2b5cd` / `#ed9bbc` / `#f3a5c1` | Foco de botão, ícones, Galeria |
| Celular tema `lulith` | `#64748c` / `#35435c` / `#edf0f6` | Mesmo papel, croma frio |
| Tela inicial | `#ffe0a0` | Foco de botão do caderno |

Regra de leitura: **quem tem acento próprio nunca usa o dourado**, para que o
dourado continue significando "ação de gameplay" e não "algo clicável".

### Papéis

Cor de papel é o único lugar onde o fundo é claro. Ela separa o objeto diegético
da interface que o cerca.

| Papel | Valor | Onde |
|---|---|---|
| Papel do diálogo | `#d9d6cf` | Caixa de diálogo e placa de nome |
| Papel de fotografia | `#efe3da` | Polaroid da Galeria |
| Papel de registro | `#e6c593` | Páginas do caderno de saves |

### Semânticas

| Estado | Valor | Onde |
|---|---|---|
| Erro / limite / alarme | `#ff536d` e `#ff667d` | Contagem de reset, limite de caracteres, exclusão |
| Sucesso / sistema | `#72e0a4` | Arquivos, prompt de identidade, eco do terminal |
| Aviso /atenção | `#ffe0ba` | Status da Galeria |
| Desabilitado | `opacity` entre `0.25` e `0.6` | Ver [seção 6](#6-estados-de-interação-e-acessibilidade) |

### Regras

- Acento não aparece em estado neutro. Repouso é sempre neutro.
- Tinta nunca é fundo e fundo nunca é tinta. Contraste mínimo legível em
  `10px`, que é o menor corpo de texto do jogo.
- Vermelho é sempre destrutivo ou urgente. Nunca é decoração.
- Verde é sempre "resposta do sistema", nunca confirmação de ação do jogador.
- Cor não é o único portador de estado: ver [seção 6](#6-estados-de-interação-e-acessibilidade).

## 3.2 Tipografia

`[DECIDIDO]` **Quatro faces, um papel cada.** Nenhuma face é usada para dois
papéis, e nenhum papel troca de face — inclusive dentro de media query.

| Face | Papel |
|---|---|
| `--fonte` — `"Trebuchet MS", "Segoe UI", Verdana, sans-serif` | Interface do jogo, títulos, corpo legível |
| `"Courier New", monospace` | Dentro do celular: sistema, metadado, código, arquivo |
| `cursive` | Assinatura manuscrita da MJ, no início e na Galeria |
| `Georgia, serif` | Papel do caderno de registros |

`[PROVISÓRIO]` A media query de paisagem troca a família do celular para
`"Avenir Next", "Trebuchet MS", system-ui, sans-serif` para caber. É a única
exceção e está anotada na [seção 11](#11-pendências-e-divergências-conhecidas).

### Escala e faixas

| Faixa | Tamanhos | Onde |
|---|---|---|
| Metadado | `7`–`9px` | Badge, barra da Galeria, rótulo de foto, teclas em paisagem |
| Corpo de app | `10`–`12px` | Mensagem, arquivo, item de lista, subrótulo |
| Interface | `13`–`15px` | Botão, campo de texto, item de menu, diálogo |
| Título | `18`–`24px` | Cabeçalho de seção, marca manuscrita, placar |

Regras:

- Abaixo de `10px` só em metadado, e **sempre dentro do celular**. Interface de
  gameplay nunca usa texto menor que `11px`.
- Texto que varia em tamanho usa `clamp()` com unidade de contexto: `vw` para
  texto livre, `cqw` para texto sobre arte com proporção travada.
- `line-height` entre `1.2` e `1.6`. Texto corrido de corpo usa `1.4` ou mais.
- Pesos apenas `400`, `500`, `600`, `700`. Sem `800`/`900` e sem `font-stretch`.
- `letter-spacing` só para rótulo curto em caixa alta: `0.06em` a `0.12em`.
  Nunca em parágrafo.
- `text-transform: uppercase` só em rótulo, nunca em conteúdo.
- Bloco de texto variável reserva altura com `min-height` para a interface não
  pular quando o texto cresce.

### Seleção de texto

O reset global desabilita seleção. Ela é **reabilitada explicitamente** apenas
onde o texto é conteúdo: caixa de diálogo, corpo do visualizador de arquivos,
lista de mensagens, corpo de mensagem e o campo de texto editável. Barra de
ação, ícones, grades e papel de foto não selecionam.

## 3.3 Espaçamento, raios, bordas e sombra

### Espaçamento

`[DECIDIDO]` Grade de `2px`, com `4px` como passo de trabalho. Values observados
ficam em `2`, `4`, `6`, `8`, `10`, `12`, `16`, `20`. Não existe token de
espaçamento: é a maior dívida de token do projeto e está na
[seção 11](#11-pendências-e-divergências-conhecidas).

Distância interna de controle é `8px` a `12px`. Distância entre grupos é o dobro
da interna. Padding de painel é `16px` ou mais.

### Raios

O raio codifica a natureza da superfície, não o gosto.

| Raio | Superfície |
|---|---|
| `0` | Tudo que precisa ler como pixel: caixa de diálogo, menu Ir para, teclas |
| `4`–`8` | Controle: input, tecla, slot, botão de página, arquivo |
| `9`–`14` | Item: bolha de mensagem, botão de escolha, slot de foto |
| `17`–`34` | Chrome do aparelho: tile de app, moldura, tela |

Regra: **raio grande só em chrome de aparelho.** Superfície de conteúdo tem raio pequeno.

### Bordas

| Espessura | Uso |
|---|---|
| `0` | Botão de ícone e área de toque transparente |
| `1px` | Separador, input, item de lista, tile |
| `1.5px` | Slot da Bolsa preenchido |
| `2px` | Botão de escolha, destaque de ação |
| `3px`–`4px` | Borda de papel: diálogo, placa de nome, moldura do aparelho |

Tracejado (`dashed`) significa **vazio ou ainda não ocupado**, nunca "erro":
slot vazio da Bolsa, slot livre da Galeria, régua do puzzle de identidade.

### Sombra

`[DECIDIDO]` **Três famílias, sem quarta.**

| Família | Valor | Onde |
|---|---|---|
| Dura, deslocada | `6px 6px 0 rgba(0,0,0,0.55)` | Superfície em cena: caixa de diálogo, menu Ir para |
| Ambiente | `0 16px 48px rgba(0,0,0,0.75)` com `blur` no `backdrop` | Dialog sobre conteúdo: Bolsa, overlay do celular |
| Brilho de acento | `0 0 12px` na cor do subsistema | Só em selecionado e foco |

Regras:

- Sombra deslocada sem desfoque pertence a elemento que precisa ler como pixel.
  Elemento pixel **nunca** recebe sombra difusa.
- Brilho de acento é consequência de estado, não decoração. Item em repouso não
  brilha.
- Sombra é o que separa plano de fundo. Sobre o cenário, a separação vem de
  borda e papel, não de sombra difusa.

## 3.4 Grid e proporção

`[DECIDIDO]` **A proporção `1672:941` é o lock de composição do jogo.** Ela
trata o palco, a tela inicial e o enquadramento das fotografias. Deriva dela:

- palco com `aspect-ratio` preservado e sem recortar objeto interativo;
- tela inicial com `width: min(100vw, 177.68dvh)` e `aspect-ratio: 1672 / 941`;
- fotos com o mesmo mundo em enquadramento `4:3` e recorte centrado declarado.

Regras:

- **Nunca distorcer.** Todo asset com proporção é exibido com `cover` e recorte
  planejado, nunca com `fill` ou escala independente por eixo.
- Arte com proporção travada declara `container-type: inline-size` e o texto
  sobre ela usa `cqw`.
- Overlay de interface é posicionado em porcentagem do palco, não em pixel, para
  acompanhar o lock.
- `100dvh` é a unidade de altura em container; `vh` não é usado em regra nova.
  `100vh` em `#app` é dívida registrada.
- Grade externa tem **uma única definição por condição**. `#app` é redefinido
  fora de media query e a definição posterior vence; quem adicionar regra de
  grade precisa considerar as quatro definições, não só a última.

---

# 4. Composição de tela

## 4.1 Breakpoints

Cinco condições, cada uma com uma responsabilidade. Não se cria uma sexta sem
justificativa escrita aqui.

| Condição | Responsabilidade |
|---|---|
| `max-width: 700px` | Gameplay em tela estreita: botões em linha única, menu Ir para vai para o rodapé, celular encolhe |
| `max-width: 680px` | Bolsa vira coluna única com rolagem |
| `orientation: landscape` e `max-height: 600px` | Compactação geral: celular, Bolsa, teclado e apps encolhem juntos |
| `hover: hover` e `pointer: fine` | Único lugar onde `:hover` é permitido |
| `max-height: 500px` e `orientation: landscape` | Tela inicial em paisagem baixa |

`[DECIDIDO]` **`hover` só existe dentro de `@media (hover: hover) and (pointer: fine)`.**
Dispositivo de toque não recebe estado hover, porque não existe hover real e o
estado preso em toque engana o jogador. A regra tem exatamente uma instância
hoje, a capa do caderno.

Regras:

- Cada breakpoint responde a uma pergunta diferente: largura para layout, altura
  para densidade. `max-width` não controla densidade e `max-height` não decide coluna.
- A condição de paisagem compacta **tudo** junto. Se um componente encolhe em
  paisagem, os componentes vizinhos encolhem na mesma media query.
- Nenhuma regra de breakpoint altera conteúdo ou lógica. Só apresentação.

## 4.2 Safe area

`[PENDENTE]` **Nenhuma regra de safe area está implementada.** O `viewport` não
declara `viewport-fit=cover` e `env(safe-area-inset-*)` não aparece em lugar
nenhum do projeto. Em aparelho com notch ou barra de sistema sobreposta, a barra
de ação e o frame do celular encostam na borda.

A regra que vale quando for implementada:

- `viewport-fit=cover` no `viewport`, com `env(safe-area-inset-*)` aplicado
  **no elemento que toca a borda**, nunca em `#app` inteiro.
- Padding de safe area se soma ao padding do componente, não o substitui.
- Safe area vale para o chrome (barra de ação, moldura do celular, teclado). Não
  vale para o cenário, que deve chegar à borda.
- `viewport-fit=cover` não pode ser adicionado sem `env()`: a tela passaria a
  desenhar sob a borda sem nenhuma compensação.

## 4.3 Alvo de toque

`[DECIDIDO]` **Mínimo `44px` em ambos os eixos** para qualquer alvo primário:
hotspot, botão de comando, escolha, ação da Bolsa, slot de foto, botão de página
do caderno.

Exceções permitidas, cada uma com contrato escrito:

| Exceção | Justificativa | Onde o contrato vive |
|---|---|---|
| Área de toque sobre rótulo pintado na arte | A arte reserva menos de `44px` por rótulo; ampliar a área cobraria a lombada vizinha | [`assets/interfaces/README.md`](assets/interfaces/README.md) |
| Teclado virtual do celular | `26`–`34px` por tecla para caber em paisagem com editor e lista | [seção 11](#11-pendências-e-divergências-conhecidas) |

Regra de leitura: **alvo pequeno demais é dívida, não exceção permanente.** Toda
exceção nova precisa entrar na tabela acima com o motivo e o contrato que a
sustenta.

## 4.4 Sobreposição e foco

- Interface é `position: absolute` dentro do palco ou `fixed` sobre ele, nunca
  no fluxo que empurra conteúdo.
- Overlay de tela cheia usa `inset: 0` e z-index próprio.
- Camadas de cena têm ordem fixa: cenário `0`, objeto `1`, personagem `2`,
  hotspot `3`, status `3`, diálogo `5`, menu `6`, fade `7`, celular `50`, tela
  inicial `1000`, cutscene `1001`. Novo elemento entra nessa ordem, não no topo por conveniência.
- `pointer-events` é explícito: camada que não recebe toque declara
  `pointer-events: none`; área invisível sobre arte declara `pointer-events: auto`
  e `touch-action: manipulation`.
- Selo de `-webkit-tap-highlight-color: transparent` é aplicado aos controles de
  toque que têm estilo próprio de `:active`, para o flash azul do Android não
  aparecer por baixo da pixel art.

## 4.5 Estado explícito em vez de `:has()`

`[DECIDIDO]` Nenhuma regra de layout depende de `:has()`. Hoje `#app` usa
`:has(#btn-celular[hidden])` e o celular usa `:has(#phone-home:not(.oculto))`
para reposicionar moldura e barra. `:has()` é suporte recente em WebView
Android e a versão do engine do aparelho alvo **não está declarada em lugar
nenhum** do projeto.

A alternativa já existente no projeto é atributo de estado: `#phone-screen`
recebe `texto-aberto` para bloquear seções durante a edição de texto. Preferir
atributo de estado explícito a `:has()`, e usar `:has()` apenas como
progresso, nunca como única forma de o layout funcionar.

---

# 5. Movimento

`[DECIDIDO]` **A fonte única dos tempos é `CONFIG`.** `js/config.js` define
`transicaoPersonagemEntrada`, `transicaoPersonagemSaida`, `transicaoCelular`,
`duracaoFlashFoto`, `duracaoReset` e `sceneTransition`.
`configurarAnimacoes()` em [`docs/MECHANICS_PATTERN.md`](docs/MECHANICS_PATTERN.md)
injeta esses valores como `--duracao-*` no `:root`, e o CSS consome com fallback
igual ao valor. Duração não se escreve em pixel no CSS.

## 5.1 Durações por função

| Faixa | Valor | Função |
|---|---|---|
| Toque | `0.05`–`0.08s` | Compressão do controle ao pressionar |
| Estado | `0.15s` | Mudança de cor, borda e brilho |
| Entrada | `0.18s` | Caixa de diálogo, código de reset |
| Elemento narrativo | `0.7`–`1s` | Piscar, cursor, alerta de cronômetro |
| Personagem | `280ms` sai, `320ms` entra | Entrada e saída de MJ |
| Container | `280ms` | Abertura e fechamento do celular |
| Efeito | `140ms` | Flash de fotografia |
| Ritual longo | `2.8s` | Progresso do reset remoto |

Regras:

- A faixa de toque é a mais curta possível e usa só `transform`. Animar `width`,
  `height` ou `top` em interação direta sente lag no aparelho.
- Efeito de `140ms` ou menos é percebido como clarão, não como animação. Flash de
  fotografia é o único que usa esse intervalo.
- O ritual longo é o único que pode bloquear input, e apenas porque representa
  tempo narrativo.

## 5.2 Curvas

`[DECIDIDO]` **Sem `cubic-bezier`.** As curvas disponíveis são `linear`, `ease`,
`ease-in`, `ease-out` e `ease-in-out`.

- Interface pixelada usa `steps()`. Passo 2 para piscar e alerta, passo 3 para
  entrada deslizante. Movimento interpolado em UI pixel parece Borrão.
- Movimento contínuo e ambiente usa `ease-in-out` com `infinite alternate`.
- Entrada e saída de personagem usam `ease-out` na entrada e `ease-in` na saída.
- Animação de disparo único sempre fecha em `forwards`, ou `both` quando precisa
  manter o estado inicial durante o atraso.

## 5.3 Movimento reduzido

`[DECIDIDO]` **`prefers-reduced-motion: reduce` reduziu o movimento decorativo e
nunca o narrativo.** Regra já implementada em
[`docs/MECHANICS_PATTERN.md`](docs/MECHANICS_PATTERN.md): digitação de mensagem,
intervalo de resposta, contagem e reset preservam o tempo real da história. A
preferência visual remove a espera decorativa, não o evento.

`[PENDENTE]` **A cobertura é parcial.** O bloco em `styles.css` desliga 1
animação de personagem, 1 transição de container, 1 flash e 1 cursor. As outras
6 animações por keyframe — `subir`, `piscar`, `alerta-cronometro`,
`progresso-reset`, `falha-reset`, `pulsar-digitando` — e as transições de
controle continuam ativas sob a preferência.

A regra que falta cumprir: **toda animação e toda transição de `styles.css`
responde a `prefers-reduced-motion`.** Piscar e cursor somem. Transição de
estado vira corte. `progresso-reset` deixa de ser animação e passa a ser
atualização de largura, porque é comunicação de estado e não decoração.

## 5.4 Regras de estrutura

- Keyframe fica **ao lado de quem usa**, não em bloco centralizado. O CSS é
  append-only por camadas e essa é a convenção que sustenta o arquivo.
- Keyframe tem nome de função em português quando descreve ação de jogo
  (`mj-entrar`, `falha-reset`), e nome de efeito genérico quando descreve UI
  (`piscar`, `subir`).
- Preferência de movimento é lida por JavaScript, não só por CSS, porque o
  tempo também vive em `CONFIG`. Estado único para os dois caminhos.
- Animação nunca entra em snapshot. Se um estado animada é restaurado, ele
  recomeça do início, nunca do meio.

---

# 6. Estados de interação e acessibilidade

`[DECIDIDO]` **Interação é botão real.** Todo alvo é `<button>` com nome
acessível. SVG, PNG e `div` decorativos recebem `aria-hidden="true"` e nunca
carregam clique, foco nem nome.

## 6.1 Foco

Foco é obrigatório e **usa a cor de acento do subsistema**, o que faz o anel de
foco enxergar a que sistema o controle pertence.

| Subsistema | Foco visível |
|---|---|
| Gameplay e Ir para | `outline: 3px solid var(--cor-destaque)`, `outline-offset: 2px` |
| Hotspot de cena | `outline: 2px solid var(--cor-destaque)`, `outline-offset: 2px` |
| Celular | `2px` na cor rosa do tema, `offset` interno ou de `3px` |
| Bolsa | `2px solid var(--bolsa-accent)`, `outline-offset: 1px` |
| Tela inicial | `3px solid #ffe0a0`, `outline-offset: 3px` |
| Item de arquivo | **`border-color` em vez de `outline`** |

Regras:

- Botão usa `:focus-visible`; campo de texto usa `:focus`, porque o campo já é
  focado por toque e o anel sumiria.
- Item de lista e slot focáveis trocam `outline` por mudança de borda e fundo.
  Ainda assim o foco é perceptível.
- `outline: none` sem substituto visível é proibido. A única ocorrência hoje é a
  capa do caderno, onde o rótulo é pintado na arte; o controle ganha no lugar o
  brilho de hover, e a perda de foco por teclado está na
  [seção 11](#11-pendências-e-divergências-conhecidas).
- Foco é interno ao componente. `:focus-visible` de dentro do celular não escapa
  para ocenario.

## 6.2 Demais estados

| Estado | Tratamento |
|---|---|
| Hover | Só sob `@media (hover: hover) and (pointer: fine)`. Muda cor, nunca layout. |
| Pressionado | `transform` de escala mínimo (`0.06s`), com `-webkit-tap-highlight-color: transparent` |
| Selecionado | Cor de acento + brilho. Nunca só cor: também muda borda ou fundo |
| Desabilitado | `opacity` entre `0.25` e `0.6`, `cursor: default`, e `grayscale` quando há ícone |
| Indisponível | `aria-disabled` com `pointer-events` preservado quando o controle precisa continuar legível |

`[DECIDIDO]` **Estado ativo precisa ser perceptível sem cor.** A cor de estado
sempre vem acompanhada de borda, offset, escala ou sombra. Razão: daltonismo é
caso de uso, não exceção.

## 6.3 Leitura e semântica

- Texto de conteúdo é selecionável; texto de controle e ícone não.
- Área de toque sobre arte é `button` com `aria-label` descrevendo a **função**,
  não a aparência. O rótulo visível vem da arte.
- `role="status"` para texto que muda sozinho, `role="timer"` para contagem,
  `aria-live="assertive"` só para alarme que exige ação imediata.
- Imagem de cenário é `aria-hidden`, porque é ambiente e não informação.
- O nome acessível de um item da Bolsa descreve o item e sua ação possível, não
  o rótulo do botão que o ativa.
- Filtro por busca, estado de item e resultado vazio são anunciáveis: o
  resultado precisa ser lido por leitor de tela sem que o jogador navegue até
  ele.

---

# 7. Voz e copy

Design de conteúdo é design. Estas regras valem para todo texto que o jogador lê
dentro do jogo: diálogo, monólogo, item da Bolsa, rótulo de foto, status de app
e texto de sistema.

`[DECIDIDO]` Princípio herdado de
[`IDEIA_CONCEITUAL.md` §17](IDEIA_CONCEITUAL.md): **o ambiente conta a história.**
Cenário, personagem, expressão, objeto, interface, puzzle e arquivo sustentam a
narrativa. A historia não pode depender de personagem explicando tudo.

Regras transversais já verificáveis no código:

- **O jogador lê em primeira pessoa.** Monólogo é pensamento de MJ, dialogo é
  fala de NPC. Os dois são suportes distintos: o monólogo não tem placa de nome e
  o diálogo tem.
- **Ficção e sistema não se misturam.** Texto de sistema é diegético sempre que
  houver objeto que o suporte: o celular é sistema, o terminal é fiction, a
  Galeria é a câmera. Texto que pertence ao autor é curto e sem personality.
- **Item se descreve em fato, não em adjetivo.** A descrição da Bolsa informa o
  que o objeto é e o que permite, sem commentary do narrador.
- **Sem elipse estilística.** O jogo não usa reticências decorativas nem
  pontuação como efeito. A incerteza vem do conteúdo, não da escrita.
- **Sem antecipação que o jogador não tem.** Tutorial, aviso e instrução de
  cenário entram pela diegese ou por interface diegética. Nunca um texto de
  sistema explicando o jogo.
- **Sem voz de inteligência artificial.** Personagem não menciona modelo, dado,
  token, prompt, prompt de sistema ou assistente. Vocabulário de IA é material
  de ficção dentro do Ato, nunca metalinguagem do jogo sobre ele.
- **Termo técnico é diegético.** `index.md`, `.txt`, erro de rede e similar
  aparecem como artefato ou como tela de aparelho, com a formatação que o objeto
  teria.

`[PENDENTE]` **Não existe registro formal de voz.** O projeto tem personagem,
princípio narrativo e tom implícito, mas nenhum documento declara idioma,
cadência, comprimento de frase, tratamento formal, uso de gíria ou política de
concordância. A regra abaixo precisa ser escrita e aprovada antes do Protótipo 3,
porque o design definitivo de personagem depende dela:

- registro por personagem, na forma de tabela;
- comprimento máximo de linha em diálogo e em monólogo;
- política de pontuação e de reticências;
- vocabulário proibido, incluindo metalinguagem de IA;
- o que o jogo nunca diz ao jogador sobre a trama que ele deve descobrir.

Enquanto esse registro não existir, [seção 11](#11-pendências-e-divergências-conhecidas)
mantém a pendência aberta. Texto novo não deve ser aceito sem que a decisão
exista.

---

# 8. Naming e organização

`[DECIDIDO]` **ID narrativo é desacoplado de caminho físico.** O nome do arquivo
organiza arte; o ID organiza o jogo. Eles nunca são o mesmo valor, e trocar
uma arte não pode quebrar save, cena ou item.

## 8.1 Arquivos de arte

| Tipo | Convenção | Exemplo |
|---|---|---|
| Sprite de personagem | `snake_case` | `assets/sprites/MJ.png` |
| Objeto de cena | `snake_case` com estado ou quadro numerado | `safe_opening_01.png` |
| Expressão fotográfica | `ID__photo__NN` | `mj__photo__01.png` |
| Ícone de interface | `kebab-case` com prefixo `icon-` | `icon-conversar.svg` |
| Fundo de cena | nome do local lógico | `beco/entrada.png` |

Regras:

- Nome descreve **função na cena**, não aparência. Um sprite provisório não se
  chama `placeholder_generico_v2`.
- Arquivo de runtime não carrega qualificador de origem: nem `ai`, nem
  `wip`, nem `provisorio`.
- Quadro de animação é `nome_01`, `nome_02`, e o mapa de sequencing fica em
  [`assets/cenario/README.md`](assets/cenario/README.md).
- Mockup de referência é assim nomeado e não é asset de runtime. A presença dele
  em `www/` não o torna usado.
- Ícone SVG é duplo: existe o arquivo-fonte na pasta e a forma inline em
  `index.html`. Alterar um exige manter o outro sincronizado. O
  `viewBox` é `0 0 32 32`, com `currentColor` e `shape-rendering="crispEdges"`.

## 8.2 CSS

- Container e identidade de tela usam `#id`. Item e estado usam `.classe` e
  sufixo `--estado`.
- Classe não carrega número nem nada visual. `bag-slot--selected`, nunca
  `bag-slot-6-azul`.
- Prefixo de componente é o namespace. Estilo de um componente não altera
  globalmente a classe de outro: `#ir-para-menu .message-choice` existe
  exatamente para isolar menu de celular, que compartilham `.message-choice`.
- Nenhum seletor ID desce mais de um nível sem necessidade. Parentesco é
  explícito com `>` ou classe própria.
- Media query vem **depois** da regra que adapta, e override posterior vence
  por ordem de arquivo. Quem escreve override declara o porquê em comentário.

## 8.3 JavaScript

- Fábrica de sistema: `criar<Sistema>`. Ponte de apresentação: `criar<Serviço>`
  para Domino. Dom agrupado: `criarDom`. Singleton de dado: `DATA`.
- Tipo de interação é string registrada em
  `criarMecanicasHotspot`, nunca classe. Tipo desconhecido é recusado.
- Composicao acontece em `criarJogo` e apenas lá. Fábrica não executa serviço
  na construção.
- Conteúdo narrativo e mapeamento de asset vivem em `js/data.js`. Nenhum outro
  arquivo declara cena, destino, item ou sprite.
- Comment de regra explica **por quê**, não **o quê**. Comentário que repete a
  linha seguinte é removido.

## 8.4 Documentação

- Arquivo de documento em português, com nome em CAIXA ALTA na raiz e `kebab-case`
  em `docs/`.
- Nota tem frontmatter `aliases`, `tags`, `status`, `updated`.
- Nota longa começa com `> [!summary] Objetivo` e declara onde a regra
  complementar mora.
- Seção de decisão usa `##` para tema e `#` para capítulo numerado, como em
  [`IDEIA_CONCEITUAL.md`](IDEIA_CONCEITUAL.md).
- Estado de decisão usa os marcadores da [legenda](#legenda-de-estado).
- Documento novo entra na tabela de Documentação do
  [`README.md`](README.md).
- Link relativo é obrigatório entre documentos. `www/` nunca é citado como
  fonte.

---

# 9. Contrato geral de arte

Regras que valem para **todo** asset, seja ele de cena, sprite ou interface. O
que é específico de um tipo de arte fica no README da pasta
([seção 1](#1-onde-cada-regra-vive)).

`[DECIDIDO]`

1. **A pasta organiza arte; a regra fica em `js/data.js`.** ID, rótulo, conexão
   e mapeamento de sprite nunca vivem em nome de arquivo.
2. **Nome descreve função, não aparência.** Especialmente em arte provisória,
   onde a aparência é justamente o que mais vai mudar.
3. **Modo de cor é declarado pela necessidade.** `RGB` quando o asset é opaco e
   não é recortado. `RGBA` quando tem alpha, é recortado ou é sobreposto. Não há
   PNG com alpha que não precisa de alpha.
4. **Transparência se preserva.** Substituir ou adicionar sprite mantém o alpha,
   incluindo valores interiores próximos de `255`. Normalizar tamanho não
   destrói canal.
5. **Arte não carrega interface.** Sem diálogo, botão, hotspot, texto variável,
   moldura ou moldura de UI. Exceção única e declarada: rótulo pintado na capa do
   caderno, cujo contrato está em
   [`assets/interfaces/README.md`](assets/interfaces/README.md).
6. **Conteúdo essencial sobrevive a recorte.** Arte passa a sobreviver a
   `cover` em desktop, retrato e paisagem. ZoneOfSafety fica em porcentagem do
   palco, não em pixel absoluto.
7. **Proporção é declarada e respeitada.** Asset com proporção usa `cover` com
   recorte planejado. `fill` e escala independente por eixo são proibidos.
8. **Pixel art não é redimensionada por interpolação.** `image-rendering:
   pixelated` onde a arte é pixel. Onde a arte éderivada com interpolação —
   expressão fotográfica, retrato — `image-rendering: auto` é explícito.
9. **Produção assistida é derivação declarada, não recorte.** Asset gerado com
   auxílio de IA é arte nova. Não é presenteado como recorte do original, e o
   original continua sendo fonte de produção, não de runtime.
10. **Mockup de referência nunca vira asset de runtime.** Reference mockup não
    substitui interface HTML/CSS, cenário ou sprite.
11. **Asset de runtime é referenciado por ID, não por caminho em código.**
    `js/data.js` é o único lugar onde o caminho físico é escrito.
12. **Asset novo entra no teste.** Asset que o jogo carrega precisa de verificação
    automatizada de existência, formato ou dimensões. Ver
    [seção 10](#10-pipeline-e-validação).
13. **Substituir arte não altera layout.** Se uma arte nova exige outro tamanho,
    isso é decisão de composição e passa pela
    [seção 11](#11-pendências-e-divergências-conhecidas), não por ajuste local.

---

# 10. Pipeline e validação

## 10.1 Fonte e artefato

`[DECIDIDO]` **A fonte é a raiz.** `index.html`, `styles.css`, `js/` e `assets/`
são fonte. `www/` e `android/` são artefato gerado e nunca se edita como fonte.

| Caminho | Papel |
|---|---|
| `index.html` | Estrutura de tela, do celular e da tela inicial |
| `styles.css` | Aparência, movimento e responsividade |
| `js/` | Comportamento e dados |
| `assets/` | Arte |
| `www/` | Saída de `npm run copy:web`, consumida pelo Capacitor |
| `android/` | Projeto nativo gerado por `npx cap sync android` |

Comandos: `npm test` roda a suíte, `npm run sync` atualiza `www/` e o Android,
`npm run apk` gera o APK de debug. `copy:web` também injeta um `v=` de cache
em `www/index.html`; isso é artefato, não fonte.

## 10.2 Validação

`[DECIDIDO]` **Regra de design que não pode ser verificada por teste é marcada
como tal.** Um documento que diz "faça assim" sem dar como conferir é
incompleto.

A suíte usa `node --test`. O que já existe e o que cobre:

| Suíte | Cobre |
|---|---|
| `test/tela-inicial.test.js` | Geometria da capa contra a arte, cobertura de rótulo, separação das áreas de toque |
| `test/interface-icons.test.js` | Formato do SVG, ausência de conteúdo externo, semântica do botão |
| `test/photo-assets.test.js` | Existência e proporção das expressões fotográficas |
| `test/gallery-layout.test.js` | Estrutura da grade da Galeria |
| `test/save-system.test.js` | Slots, autosave e snapshot |
| `test/text-input.test.js` | Teclado virtual, acentos, limites e integração |
| `test/scene-transition.test.js` | Fade global e bloqueio de input |
| `test/bolsa.test.js`, `test/fase-navegacao.test.js` | Bolsa e navegação entre cenas |

Regras:

- Regra que envolve **geometria de arte** se testa contra a arte. É o padrão
  adotado pela tela inicial e o modelo para o resto.
- Regra que envolve **contrato de arquivo** — naming, modo de cor, caminho —
  se testa lendo o arquivo.
- Regra puramente visual e não automatizável é marcada `[PENDENTE] de validação`
  e vira item de [`TODO.md`](TODO.md).
- Nenhuma regra nova entra sem dizer como ela é conferida.

## 10.3 Ordem de trabalho

1. A regra é decidida e entra na [seção 12](#12-como-alterar-uma-regra).
2. Se for geral, entra aqui. Se for específica de um asset, entra no README da
   pasta, e aqui só a referencia.
3. O código muda.
4. A validação automática entra junto, ou a pendência de validação é anotada.
5. `README.md` é atualizado se um documento novo entrou ou se um escopo mudou.

---

# 11. Pendências e divergências conhecidas

Onde o código atual **contradiz** este documento. Não são decisões: são dívidas
registradas para não serem normalizadas em silêncio. Cada linha precisa de
decidir entre corrigir o código ou declarar a exceção.

`[PENDENTE]` A lista existe porque este documento **declara** o canon, e um
canon sem divergência declarada é fiction.

## 11.1 Tokens ausentes

| Item | Onde | Consequência |
|---|---|---|
| Nenhum token de espaçamento | `styles.css` | Grade de `2px` é convenção oral; nada impede `7px` ou `13px` |
| Nenhum token de raio | `styles.css` | 15 raios distintos, sem nome por função |
| Nenhum token de sombra | `styles.css` | Três famílias informais, sem nome |
| Nenhum token de z-index | `styles.css` | Ordem de camada declarada só na [seção 4.4](#44-sobreposição-e-foco) |

Ação proposta: criar quatro famílias de token (`--espaco-*`, `--raio-*`,
`--sombra-*`, `--camada-*`) e migrar regra por componente, começando por
`#app`, caixa de diálogo e celular, que são os três blocos que mais têm regra.

## 11.2 Variáveis mortas

Declaradas no `:root` e nunca referenciadas: `--cor-moldura`, `--cor-painel`,
`--cor-botao`, `--cor-botao-hover`, `--bolsa-bg`, `--bolsa-panel`,
`--bolsa-border-focus`.

Ação proposta: remover as sete, ou documentar para que existam. Elas sugerem
um sistema de cor que não existe. Enquanto ficarem no `:root`, induzem a erro:
quem lê o bloco acredita que `--cor-painel` é a cor de painel.

## 11.3 Duplicatas de acento

| Item | Ocorrências |
|---|---|
| `--bolsa-border-focus` e `--bolsa-accent-soft` têm o mesmo valor `#7a5c9e` | 2 tokens |
| `rgba(155, 127, 214, …)` no lugar de `--bolsa-accent` | 8 |
| `rgba(122, 92, 158, …)` no lugar de `--bolsa-accent-soft` | 3 |
| `#e8b34b` literal no lugar de `var(--cor-destaque)` | 11 |
| `#131828` literal, quase igual a `--cor-painel` | 1 |

Ação proposta: apagar o duplicado e derivar o `rgba()` do token com
`color-mix()`, ou manter as variantes `rgba` como tokens nomeados de opacidade.
O que não pode continuar é acento escrito de duas formas.

## 11.4 Paleta sem token

`styles.css` tem **166 hexes distintos**. Dentre eles, families inteiras
escritas fora de token: rosa do celular, cinza-azulado do tema `lulith`,
vermelho de erro, verde de sistema, âmbar de aviso e todos os tons de papel.

Ação proposta: tokenizar por subsistema, na ordem de subscribers — celular,
Bolsa, papel, semântica. Cada família entra com nome e valor único.

## 11.5 Acessibilidade

| Item | Onde | Impacto |
|---|---|---|
| `env(safe-area-inset-*)` inexistente e `viewport-fit=cover` ausente | `index.html:5`, `styles.css` | Chrome encosta na borda em aparelho com notch ([seção 4.2](#42-safe-area)) |
| `prefers-reduced-motion` cobre 4 das 10 animações e 1 das 22 transições | `styles.css:1406` | Piscar, cursor, alerta e progresso de reset ignoram a preferência ([seção 5.3](#53-movimento-reduzido)) |
| `#notebook-cover button:focus-visible` é `outline: none` sem substituto | `styles.css:2308` | Botão da capa não é alcançável por teclado com feedback visível |
| Alvos abaixo de `44px`: teclas `34`/`30px`, voltar `40px`, paginação `32px`, busca limpa `24px`, arquivo `42px` | `styles.css` | Conflita com [seção 4.3](#43-alvo-de-toque); teclas são a exceção de fato, o resto é dívida |
| `.action-icon` é `40×40px` e nunca encolhe na paisagem | `styles.css:252` | Ícone de `40px` dentro de botão de `44px` de altura |
| Estado desabilitado depende de `opacity` sem `aria-disabled` | `styles.css` | Leitor de tela anuncia o botão como disponível |

Ação proposta: safe area primeiro, porque é correção pequena e de impacto
visual grande. Depois cobertura de `prefers-reduced-motion`. Foco da capa e
alvos pequenos entram como item próprio.

## 11.6 Estrutura e compatibilidade

| Item | Onde | Impacto |
|---|---|---|
| `:has()` decide layout de `#app` e do celular | `styles.css:2075`, `#phone-home` | Sem suporte, barra de ação e chrome do celular se posicionam errado |
| Versão de WebView mínima não declarada | `capacitor.config.json`, `package.json` | Não há como saber se `:has()`, `dvh` e `cqw` são seguros |
| `vh` e `dvh` misturados no mesmo componente | `styles.css:52`, `:1537`, `:2159` | Altura oscila conforme a barra de sistema aparece |
| `100vh` em `#app` | `styles.css:52` | Pasta inferior fica sob a barra de sistema |
| `#app` redefinido quatro vezes, sendo a terceira fora de media query | `styles.css:47`, `:1425`, `:2052`, `:2075` | Quem lê a regra final não vê que há override anterior |
| Regra de `60×60px` morta para os botões de ação | `styles.css:222` | Sobrescrita por `56×44px` em `:2059`; o valor antigo ainda está no arquivo |
| `assets/interfaces/README.md` afirma touch target de `60×60px` | `assets/interfaces/README.md:64` | Documento afirma valor que o código não usa |
| `all` em `transition` | `styles.css:1616` e outras 4 | Animandopropriedade não prevista |
| Raio em porcentagem em dois lugares | `styles.css:2289`, `:2310` | Sem precedente no resto do arquivo |
| Fonte trocada dentro de media query | `styles.css:2217`–`2252` | Quebra a regra "quatro faces, um papel cada" |
| `will-change` e `animation-delay` ausentes | `styles.css` | Sem promoção de camada explícita nem atraso orquestrado |

Ação proposta: declarar a versão mínima de WebView antes de mexer em
`:has()`; sem isso não há como decidir se o risco é real.

## 11.7 Cobertura de teste

`[PENDENTE]` Nenhuma regra de cor, tipografia, espaçamento, movimento ou estado
tem verificação automatizada. A suíte cobre geometria de arte, contrato de
arquivo, persistência e transição. As regras visuais puras deste documento são
hoje verificadas por inspeção.

Ação proposta: começar pelo que é mensurável sem browser — contagem de hexes
literal fora de token, existência das variáveis do `:root`, e sobreposição das
áreas de toque da capa. As três pegam regressão de token sem precisar de
renderização.

## 11.8 Decisões que dependem de conteúdo

| Item | Depende de |
|---|---|
| Registro formal de voz | Personagens definidos ([seção 7](#7-voz-e-copy)) |
| Resolução-base e proporção final | Protótipo 3 ([seção 2](#2-pilares-visuais), item 7) |
| Se as regras específicas sobem para a raiz | Reorganização de `assets/` ([seção 1](#1-onde-cada-regra-vive)) |

A terceira está em aberto por decisão do responsável: os README de
`assets/cenario`, `assets/interfaces` e `assets/sprites` seguem como estão, e
este documento apenas os referencia. Promover as tabelas de medida para cá é o
caminho natural se a direção for ter um único documento de referência.

---

# 12. Como alterar uma regra

`[DECIDIDO]`

1. **Decidir antes de escrever.** Regra nova nasce de uma decisão, não de
   implementação acidental. A decisão vai para
   [`docs/ADR_LOG.md`](docs/ADR_LOG.md) quando afeta arquitetura, apresentação ou
   pipeline.
2. **Escolher o escopo.** Regra transversal entra aqui. Regra que só vale para
   um tipo de arte entra no README da pasta, e a raiz passa a referenciá-la sem
   duplicar a medida.
3. **Atualizar o código no mesmo passo.** Regra que não passa pelo código é
   letra morta.
4. **Dizer como conferir.** Nova regra vem com teste, ou marcada como pendente
   de validação na [seção 11.7](#117-cobertura-de-teste).
5. **Registrar a exceção.** Se a implementação não consegue seguir a regra, a
   exceção entra na [seção 11](#11-pendências-e-divergências-conhecidas) com
   arquivo e linha. Exceção não documentada vira regra de fato.
6. **Atualizar o índice.** `README.md` referencia o documento; documento novo
   entra na tabela de Documentação.

> [!note] Regra contra código
> Quando este documento e o código divergirem, **o código está errado por
> omissão, não por decisão**. Não existe caminho conhecido em que o código
> esteja certo e o documento errado, exceto para os itens marcados na
> [seção 11](#11-pendências-e-divergências-conhecidas), que são divergências
> registradas, e para o `assets/interfaces/README.md:64`, que precisa ser
> corrigido junto da regra de touch target.

---

# Referências

Documentos de regra geral:

- [`IDEIA_CONCEITUAL.md`](IDEIA_CONCEITUAL.md) — direção artística, pilares de
  gênero, princípio narrativo e convenção de marcadores de decisão.
- [`ESTRUTURA_GAMING.md`](ESTRUTURA_GAMING.md) — arquitetura, estado
  implementado, controles, Matriz de Funcionalidades e tela inicial.
- [`GDD.md`](GDD.md) — design narrativo e mecânico de longo prazo.
- [`README.md`](README.md) — visão geral, execução e índice de documentação.

Regras específicas de arte, por pasta:

- [`assets/cenario/README.md`](assets/cenario/README.md) — fundos de cena,
  proporções, objetos interativos, hotspots e contrato do palco.
- [`assets/interfaces/README.md`](assets/interfaces/README.md) — ícones, tela
  inicial, wallpaper, mockups e contrato de SVG.
- [`assets/sprites/README.md`](assets/sprites/README.md) — sprites de personagem,
  pivô e expressões fotográficas.

Contratos de sistema:

- [`docs/MECHANICS_PATTERN.md`](docs/MECHANICS_PATTERN.md) — fábricas, injeção de
  dependências, Strategy, tempos visuais e movimento reduzido.
- [`docs/POINT_AND_CLICK.md`](docs/POINT_AND_CLICK.md) — investigação,
  hotspots e Bolsa.
- [`docs/PHONE_THEMES.md`](docs/PHONE_THEMES.md) — temas visuais do celular.
- [`docs/SCENE_TRANSITIONS.md`](docs/SCENE_TRANSITIONS.md) — fade global e
  bloqueio de input.
- [`docs/TEXT_INPUT.md`](docs/TEXT_INPUT.md) — teclado virtual e entrada de texto.
- [`docs/SAVE_SYSTEM.md`](docs/SAVE_SYSTEM.md) — slots, autosave e snapshot.
- [`docs/ADR_LOG.md`](docs/ADR_LOG.md) — decisões de arquitetura e apresentação.
- [`TODO.md`](TODO.md) — roadmap executável, incluindo pendências de validação.
A abertura usa um título de `3.8cqw`, itálico, peso 700, com escala contraída
`1.84`, conforme a decisão
local registrada em [ADR_LOG](docs/ADR_LOG.md) e no [sistema de Cutscene](docs/cutscenes.md).
O texto de apresentação é itálico da face `--fonte`, sem arquivo de fonte
novo, e a leitura pixelada vem de `steps(24, end)` com sombra deslocada sem
desfoque. A luz é ambiente: revela em `ease-in-out` e, ao contrário da subida
narrativa, não é cortada no movimento reduzido.
