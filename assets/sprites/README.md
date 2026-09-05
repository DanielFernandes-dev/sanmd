# Sprites

Esta pasta contém os sprites de personagens usados em runtime. Os assets atuais pertencem aos Protótipos 1 e 2 e não representam o design canônico dos personagens.

## Conteúdo Atual

| Arquivo | Personagem | Pose | Uso |
|---|---|---|---|
| `MJ.png` | `mj` | `neutral` | Monólogos nas três cenas provisórias do beco |

`MJ.png` possui canvas transparente de `1070×1470` pixels. É um asset estático, genérico, provisório e produzido com auxílio de IA para validar presença, escala e integração. Ele pode ser substituído integralmente no Protótipo 3.

## Contrato

- Personagens usam IDs narrativos independentes do caminho dos arquivos.
- O mapeamento entre personagem, pose e arquivo pertence a `js/data.js`.
- O pivô visual fica no centro inferior do canvas.
- Arquivos de runtime recebem nomes semânticos, sem características provisórias do design.
- Sprites não contêm animação; movimento de entrada ou saída pertence à interface.
- Transparência deve ser preservada ao substituir ou adicionar sprites.
- Novas poses devem ser adicionadas ao mapa `DATA.personagens`, sem acoplar o ID narrativo ao caminho físico.

O caminho atual em runtime é `assets/sprites/MJ.png`. `npm run copy:web` o replica em `www/assets/sprites/MJ.png` para o pacote Capacitor.

## Direção Futura

- A resolução-base e o padrão final dos sprites ainda precisam ser definidos.
- Poses pensando, surpresa, irritada e cansada de MJ continuam pendentes.
- Sprites genéricos de Lulith e James continuam pendentes.
- O design definitivo será fechado somente no Protótipo 3.

## Referências

- [`../../ESTRUTURA_GAMING.md`](../../ESTRUTURA_GAMING.md): carregamento, slots e transições de personagem.
- [`../../IDEIA_CONCEITUAL.md`](../../IDEIA_CONCEITUAL.md): decisões sobre personagens e direção artística.
- [`../../TODO.md`](../../TODO.md): poses e personagens ainda pendentes.
