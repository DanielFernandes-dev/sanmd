# Cenários

Esta pasta contém os fundos de cena usados pelo protótipo. Eles são assets 2D provisórios dos Protótipos 1 e 2 e não definem a direção canônica dos locais do jogo.

## Conteúdo Atual

Os três fundos navegáveis pertencem ao local lógico `beco`. A pasta também contém
os dez quadros narrativos de Lulith, que não são destinos de navegação:

| Arquivo | Cena | Rótulo | Destinos |
|---|---|---|---|
| `beco/entrada.png` | `beco_entrada` | Entrada do beco | `beco_interior` |
| `beco/corredor.png` | `beco_interior` | Interior do beco | `beco_entrada`, `beco_fundo` |
| `beco/background.png` | `beco_fundo` | Fundo do beco | `beco_interior` |

Os fundos de entrada e corredor possuem `3344×1882`; o fundo independente `background.png` possui `1672×941`. O palco preserva a proporção `1672:941`, sem recortar objetos interativos. `cofre.png` é referência histórica e não é carregado pelo jogo.

Os sprites RGBA independentes ficam em `beco/objects/`: `safe_closed.png`, `safe_opening_01.png` a `safe_opening_04.png`, `safe_open.png` e `lulith_phone.png`. Os seis frames do cofre compartilham canvas 1254×1254. Ver [POINT_AND_CLICK](../../docs/POINT_AND_CLICK.md).

## Quadros do quarto de Lulith

`quarto-lulith/cena1.png` a `cena10.png` são as dez imagens da Cutscene 02.
`LULITH_FRAMES` em `js/data.js` associa cada arquivo ao ID `lulith_codigo_01` a
`lulith_codigo_10`. A ordem usa os IDs explícitos, não ordenação alfabética dos
nomes físicos (`cena10` não vem depois de `cena1` na narrativa).

| Quadros | Dimensões |
|---|---|
| 01, 02, 05 | 826×462 |
| 03, 04 | 826×459 |
| 06 | 825×462 |
| 07 | 826×463 |
| 08 | 825×463 |
| 09, 10 | 1670×941 |

São paisagem, sem numeração visual nem divisórias brancas. A proporção varia
levemente: o renderer preserva palco 1672:941 com `object-fit: cover`, sem esticar
nem modificar os PNGs. Não são sprites de membros nem frames intermediários de
animação. O código/erro no notebook faz parte da composição narrativa da arte.
Preload decodifica todos antes da exibição; ver [Cutscenes](../../docs/cutscenes.md).

## Contrato

- A pasta física organiza arte; IDs, rótulos e conexões pertencem a `js/data.js`.
- O nome do arquivo deve representar sua função na cena, não detalhes visuais provisórios.
- Fundos não devem incorporar diálogos, botões, hotspots, textos variáveis ou outras camadas de interface.
- Objetos interativos e máscaras de hotspot permanecem separados do background.
- Conteúdo essencial deve considerar recortes de desktop, retrato e paisagem.
- A resolução-base futura de `320×180` ainda é planejamento e não corresponde aos PNGs atuais.
- Novos cenários devem ser registrados em `js/data.js` e incluídos na validação de navegação.

## Pipeline

`npm run copy:web` copia toda a pasta `assets/` para `www/assets/`. `www/` é artefato gerado e não deve ser editado como fonte.

## Referências

- [`../../ESTRUTURA_GAMING.md`](../../ESTRUTURA_GAMING.md): arquitetura de cenas e navegação.
- [`../../GDD.md`](../../GDD.md): função dos cenários no design do jogo.
- [`../../IDEIA_CONCEITUAL.md`](../../IDEIA_CONCEITUAL.md): decisões visuais e caráter provisório.
- [`../../TODO.md`](../../TODO.md): produção e validação dos cenários do Ato I.
