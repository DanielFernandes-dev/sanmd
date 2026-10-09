# Sprites

> Arquitetura e regras gerais: [AGENTS.md](../../AGENTS.md). Este README mantém apenas o contrato local dos recursos.

Esta pasta contém os sprites de personagens usados em runtime. Os assets atuais pertencem aos Protótipos 1 e 2 e não representam o design canônico dos personagens.

## Conteúdo Atual

| Arquivo | Personagem | Pose | Uso |
|---|---|---|---|
| `MJ.png` | `mj` | `neutral` | Falas e monólogos nos locais atuais |
| `james.png` | `james` | `neutral` | Conversa na cozinha |
| `lulith.png` | `lulith` | `neutral` | Cadastrado no catálogo; não substitui quadros cinematográficos |

`MJ.png` possui canvas transparente de `1070×1470` pixels. É um asset estático, genérico, provisório e produzido com auxílio de IA para validar presença, escala e integração. Ele pode ser substituído integralmente no Protótipo 3.

## Arte de Lulith

`lulith.png` está cadastrado em `DATA.personagens` e pode ser resolvido pelo motor de falas. O chat preserva o anonimato; cadastro não significa exibição em toda conversa. A Cutscene 02 usa os
dez quadros completos em `assets/cenario/quarto-lulith`, preservando o desenho
original; não recorta nem anima membros do sprite. A Cutscene 03 também usa
quadros completos do telhado em `assets/cenario/custcene-beco`; a MJ distante
já está desenhada nos Frames 02–03 e não usa overlay de sprite.

## Mapas nesta pasta

`mapa.png` é a arte original; `mapa-sem-beco.png` é usada pelo mapa com marcadores HTML. Não são sprites de personagem e não devem ser adicionados ao catálogo de poses. O src do mapa é atribuído ao abrir a interface.

## Contrato

- Personagens usam IDs narrativos independentes do caminho dos arquivos.
- O mapeamento entre personagem, pose e arquivo pertence a `js/data.js`.
- O pivô visual fica no centro inferior do canvas.
- Arquivos de runtime recebem nomes semânticos, sem características provisórias do design.
- Sprites não contêm animação; movimento de entrada ou saída pertence à interface.
- Transparência deve ser preservada ao substituir ou adicionar sprites.
- Novas poses devem ser adicionadas ao mapa `DATA.personagens`, sem acoplar o ID narrativo ao caminho físico.

O caminho atual em runtime é `assets/sprites/MJ.png`. `npm run copy:web` o replica em `www/assets/sprites/MJ.png` para o pacote Capacitor.

## Expressões fotográficas da MJ

As fotografias da Galeria usam dez PNGs RGBA individuais em `mj/photo/`, todos
com canvas de `512×576`, proporção preservada e alinhamento central inferior.
O fundo é transparente; a interpolação da personagem usa `image-rendering: auto`.

| ID persistido | Expressão | Arquivo em `mj/photo/` |
|---|---|---|
| `mj__photo__01` | Sorriso | `mj__photo__01.png` |
| `mj__photo__02` | Olhar suave | `mj__photo__02.png` |
| `mj__photo__03` | Séria | `mj__photo__03.png` |
| `mj__photo__04` | Pensativa | `mj__photo__04.png` |
| `mj__photo__05` | Surpresa | `mj__photo__05.png` |
| `mj__photo__06` | Irritada | `mj__photo__06.png` |
| `mj__photo__07` | Alegre | `mj__photo__07.png` |
| `mj__photo__08` | Triste | `mj__photo__08.png` |
| `mj__photo__09` | Tímida | `mj__photo__09.png` |
| `mj__photo__10` | Piscadinha | `mj__photo__10.png` |

O mapa pertence a `DATA.personagens.mj.fotografia.sprites` em `js/data.js`.
O save armazena somente `photoExpression` com o ID lógico; o cenário continua
sendo uma imagem independente resolvida pelo save. IDs ausentes ou inválidos
usam `assets/sprites/MJ.png`. Essas expressões não são poses narrativas.

Produzidos com a ferramenta integrada `image_gen`, a partir dos dez retratos de
`assets/interfaces/save-aleatorio.png`, com extração de fundo e remoção de símbolos.
São derivados gerados com IA, não recortes pixel a pixel da folha original.
A normalização de tamanho preserva o alpha gerado, inclusive valores interiores
próximos de 255. A folha original é apenas fonte de produção e não é usada pelo renderer.
O registro de produção e os prompts estão em
[Expressões fotográficas da MJ](../../ESTRUTURA_GAMING.md#expressões-fotográficas-da-mj).

`npm run copy:web` replica os PNGs para `www/assets/sprites/mj/photo/`.

## Direção Futura

- A resolução-base e o padrão final dos sprites ainda precisam ser definidos.
- Poses pensando, surpresa, irritada e cansada de MJ continuam pendentes.
- Sprites genéricos de Lulith e James já existem; arte definitiva/poses adicionais continuam pendentes.
- O design definitivo será fechado somente no Protótipo 3.

## Referências

- [`../../ESTRUTURA_GAMING.md`](../../ESTRUTURA_GAMING.md): carregamento, slots e transições de personagem.
- [`../../IDEIA_CONCEITUAL.md`](../../IDEIA_CONCEITUAL.md): decisões sobre personagens e direção artística.
- [`../../TODO.md`](../../TODO.md): poses e personagens ainda pendentes.
