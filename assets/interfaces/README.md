# Interfaces

> Arquitetura e regras gerais: [AGENTS.md](../../AGENTS.md). Este README mantém apenas o contrato local dos recursos.

Esta pasta contém artes usadas em runtime e mockups exclusivamente de referência. O caminho real é `assets/interfaces/`, no plural, e deve ser preservado. Regras de layout e interação permanecem em `index.html`, `styles.css` e nos sistemas de interface (`title-menu.js`, `phone.js`, `gallery.js`, `scene.js`, `workstation.js`).

## Tela Inicial

| Arquivo PNG | Dimensões | Modo | Uso |
|---|---|---|---|
| `menu.png` | 1672×941 | RGB | Capa fechada do caderno, mesa escura e cidade noturna; fundo de `#notebook-stage` e de `#notebook-cover` |
| `save-menu.png` | 1672×941 | RGB | Caderno aberto, usado como fundo de `#notebook-open` |

As duas artes são a **única fonte visual** da tela inicial: o título `Sanmd` e os rótulos `Novo jogo` e `Carregar` são gravados no pixels de `menu.png`, não são texto da interface. Os botões `#notebook-new` e `#notebook-load` são áreas de toque transparentes, com `aria-label`, sobrepostas exatamente aos rótulos.

Geometria medida na arte e mantida em `styles.css` (percentuais de `1672×941`):

| Elemento | Geometria (x · y) |
|---|---|
| Rótulo `Novo jogo` | 43,5-70,0% · 57,5-65,0% |
| Rótulo `Carregar` | 43,9-71,0% · 65,6-73,3% |
| Lombada giratória (`clip-path`) | 24-77% · 13-90% |
| Miolo do papel de `save-menu.png` | 18,4-78,7% · 19,5-87,5%, costura em x 47,5-48,8% |
| `#notebook-pages` | 18,4-78,7% · 19,5-87,5% |

`#notebook-open::before` desenha papel opaco sobre a mesma área para esconder os registros fictícios impressos em `save-menu.png`; o `clip-path` interno deixa a sombra natural da página aparecer nas bordas.

`#notebook-stage` preserva a proporção com `width: min(100vw, 177.68vh)` e `aspect-ratio: 1672 / 941`, e expõe `container-type: inline-size` para que os textos das páginas usem `cqw`. As opções da capa declaram `top` e `bottom` ao mesmo tempo: a altura passa a ser resolvida pelo contêiner, então **as duas áreas de toque nunca se sobrepõem** em nenhum tamanho de tela, sem depender de `min-height`. `test/tela-inicial.test.js` valida cobertura dos rótulos, separação das áreas e contenção no papel.

`js/title-menu.js` implementa a apresentação; o Save System continua sendo a fonte de verdade dos registros, sem formato próprio.

## Celular e Galeria

| Arquivo PNG | Dimensões | Modo | Uso |
|---|---|---|---|
| `wallpaper.png` | 940×1672 | RGB | Fundo do tema MJ; não é o único PNG de interface em runtime |
| `celular.png` | 1225×1284 | RGBA | Exclusivamente mockup de referência do celular |
| `save.png` | 1161×1355 | RGB | Exclusivamente mockup de referência da Galeria/save |

O wallpaper é declarado uma única vez, como fundo de `#phone-screen` em `styles.css`, com `center / cover no-repeat` e um gradiente escuro sobreposto. Ele preenche a tela com recorte proporcional, sem deformação. A Galeria usa painéis translúcidos que deixam esse fundo aparecer, sem reaplicar a imagem.

`celular.png` e `save.png` nunca são usados como UI, controles, fotografias de save ou sprites da MJ. São referências visuais, não substitutos da interface HTML/CSS nem do cenário e sprite que compõem cada fotografia.

O redesign implementado usa frame arredondado em gradiente escuro, identidade rosa/lilás e assinatura decorativa da MJ. A tela inicial tem data e uma grade 4×2 com oito apps na parte inferior (Galeria, Mensagens, Telefone, Notas, Config., Arquivos, Mapas, Música), com ícones SVG sobre tiles quadrados de cor própria e destaque rosa para Galeria. O cabeçalho da Galeria é alinhado à esquerda, com subtítulo e assinatura; a grade 3×3 tem slots vazios com `+`, número e `Espaço livre`. As fotos usam moldura clara `#efe3da`, e preview/detalhe ficam retos, sem rotação. Ações têm gradiente rosa e altura mínima de `44px`; exclusão mantém tratamento vinho/vermelho, e o foco visível dos botões do celular é rosa.

O frame usa largura `min(360px, calc(100vw - 20px))` e altura `min(720px, calc(100dvh - 20px))`. Até `700px`, a largura passa a `min(360px, calc(100vw - 12px))`, o padding cai de `10px` para `6px` e há `max-height: calc(100dvh - 12px)`, sem substituir a altura base. A grade mantém três colunas, linhas mínimas de `112px` e rolagem vertical; tela inicial, preview e detalhe também podem rolar.

## Outros recursos em runtime

`layout-pc-mj.png` compõe a estação da delegacia e recebe src ao abri-la. `bolsa.png` e `game-icon.png` permanecem na pasta, mas não têm referência direta nos fontes web atuais; o último consta no histórico de produção do ícone Android em [ADR](../../docs/ADR_LOG.md). `preview_celular.png` e `save-aleatorio.png` são referências de produção, não apps. A grade tem oito ícones, mas apenas Galeria, Mensagens e Arquivos funcionam. A descrição rosa acima se refere ao tema MJ; [temas](../../docs/PHONE_THEMES.md) detalha Lulith.

## Distribuição

O script `copy:web` de `package.json` já copia toda a árvore `assets` para `www/` com `cp -r js assets www/`. Isso inclui wallpaper, ícones, as duas artes da tela inicial e mockups em `assets/interfaces/`; não é necessário modificar o script ou renomear a pasta. A presença dos mockups no pacote não os torna assets usados em runtime.

## Ícones Principais

| Arquivo | Controle | Elemento interativo |
|---|---|---|
| `icons/icon-conversar.svg` | Conversar | `#btn-conversar` |
| `icons/icon-ir-para.svg` | Ir para | `#btn-ir-para` |
| `icons/icon-celular.svg` | Celular | `#btn-celular` |

Os SVGs-fonte usam `viewBox="0 0 32 32"`, `currentColor` e `shape-rendering="crispEdges"`. As mesmas formas são incorporadas inline no HTML para responder aos estados de cor definidos no CSS.

## Contrato

- SVGs são decorativos e usam `aria-hidden="true"`.
- Clique, foco, nome acessível e estado desabilitado pertencem aos elementos `button`, nunca ao SVG.
- Preservar nomes acessíveis e conferir tamanho de toque nas regras responsivas; existem overrides de `56×44` pixels, portanto `60×60` não é um tamanho universal.
- Nos três controles principais do gameplay, a cor normal é creme; dourado é reservado a hover, foco e feedback de interação. Essa regra não descreve os botões rosa do celular/Galeria.
- Os ícones não devem conter texto, imagens externas, gradientes, filtros ou lógica de navegação.
- Alterar um ícone exige manter sincronizadas sua fonte nesta pasta e a forma inline correspondente em `index.html`.

## Menu Ir Para

O menu de destinos é parte da interface, mas não é um asset SVG. Seu contrato está documentado em `ESTRUTURA_GAMING.md` e implementado por `#ir-para-menu` em `styles.css`.

- O menu permanece contextual, compacto e associado ao ícone **Ir para**.
- Destinos continuam sendo `button.message-choice` criados por `js/scene.js`.
- Estilos específicos não devem alterar globalmente `.message-choice`, também usada no celular.
- Nenhuma regra de destino ou conexão entre cenas pertence aos arquivos desta pasta.

## Validação

`test/interface-icons.test.js` verifica formato, ausência de conteúdo externo, semântica dos botões e integração visual básica. `test/tela-inicial.test.js` executa o bootstrap real contra o DOM de `index.html` e confere a geometria da tela inicial contra as medidas da arte.

## Referências

- [Design atual da Galeria](../../ESTRUTURA_GAMING.md#design-atual): composição visual e responsividade do celular e da Galeria, sem alteração do contrato de persistência.
- [Tela Inicial](../../ESTRUTURA_GAMING.md#tela-inicial): capa, páginas de registros e animação do caderno.
- [`../../ESTRUTURA_GAMING.md`](../../ESTRUTURA_GAMING.md): controles e contrato arquitetural do menu.
- [`../../IDEIA_CONCEITUAL.md`](../../IDEIA_CONCEITUAL.md): direção minimalista da interface atual.
- [`../../TODO.md`](../../TODO.md): implementação e validações pendentes.


## Integração com as cutscenes

O caderno é preparado sob a Cutscene 01; conclusão natural ou Skip libera seus botões. Novo
jogo abre a capa e cobre a tela antes de reiniciar o estado e executar Lulith.
Carregar segue para os registros e nunca dispara a Cutscene 02. A Cutscene 03
devolve o jogador à mesma capa após **ATO 1 COMPLETO**, sem repetir SANMD ou
o som da lâmpada. Os overlays de cutscene estão na camada 1001, sobre o menu
1000. Não são novos menus em bitmap.
Ver [Cutscenes](../../docs/cutscenes.md) e [Save System](../../docs/SAVE_SYSTEM.md).
