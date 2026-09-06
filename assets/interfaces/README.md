# Interfaces

Esta pasta contém assets da interface e mockups exclusivamente de referência. O caminho real é `assets/interfaces/`, no plural, e deve ser preservado. Regras de layout e interação permanecem em `index.html`, `styles.css` e `js/game.js`.

## Celular e Galeria

| Arquivo PNG | Dimensões | Modo | Uso |
|---|---|---|---|
| `wallpaper.png` | 940×1672 | RGB | Único PNG desta pasta usado em runtime pelo redesign |
| `celular.png` | 1225×1284 | RGBA | Exclusivamente mockup de referência do celular |
| `save.png` | 1161×1355 | RGB | Exclusivamente mockup de referência da Galeria/save |

O wallpaper é declarado uma única vez, como fundo de `#phone-screen` em `styles.css`, com `center / cover no-repeat` e um gradiente escuro sobreposto. Ele preenche a tela com recorte proporcional, sem deformação. A Galeria usa painéis translúcidos que deixam esse fundo aparecer, sem reaplicar a imagem.

`celular.png` e `save.png` nunca são usados como UI, controles, fotografias de save ou sprites da MJ. São referências visuais, não substitutos da interface HTML/CSS nem do cenário e sprite que compõem cada fotografia.

O redesign implementado usa frame arredondado em gradiente escuro, identidade rosa/lilás e assinatura decorativa da MJ. A tela inicial tem data e uma grade 4×2 com oito apps na parte inferior (Galeria, Mensagens, Telefone, Notas, Config., Arquivos, Mapas, Música), com ícones SVG sobre tiles quadrados de cor própria e destaque rosa para Galeria. O cabeçalho da Galeria é alinhado à esquerda, com subtítulo e assinatura; a grade 3×3 tem slots vazios com `+`, número e `Espaço livre`. As fotos usam moldura clara `#efe3da`, e preview/detalhe ficam retos, sem rotação. Ações têm gradiente rosa e altura mínima de `44px`; exclusão mantém tratamento vinho/vermelho, e o foco visível dos botões do celular é rosa.

O frame usa largura `min(360px, calc(100vw - 20px))` e altura `min(720px, calc(100dvh - 20px))`. Até `700px`, a largura passa a `min(360px, calc(100vw - 12px))`, o padding cai de `10px` para `6px` e há `max-height: calc(100dvh - 12px)`, sem substituir a altura base. A grade mantém três colunas, linhas mínimas de `112px` e rolagem vertical; tela inicial, preview e detalhe também podem rolar.

## Distribuição

O script `copy:web` de `package.json` já copia toda a árvore `assets` para `www/` com `cp -r js assets www/`. Isso inclui wallpaper, ícones e mockups em `assets/interfaces/`; não é necessário modificar o script ou renomear a pasta. A presença dos mockups no pacote não os torna assets usados em runtime.

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
- Os comandos principais preservam `aria-label` e touch target de `60×60` pixels.
- Nos três controles principais do gameplay, a cor normal é creme; dourado é reservado a hover, foco e feedback de interação. Essa regra não descreve os botões rosa do celular/Galeria.
- Os ícones não devem conter texto, imagens externas, gradientes, filtros ou lógica de navegação.
- Alterar um ícone exige manter sincronizadas sua fonte nesta pasta e a forma inline correspondente em `index.html`.

## Menu Ir Para

O menu de destinos é parte da interface, mas não é um asset SVG. Seu contrato está documentado em `ESTRUTURA_GAMING.md` e implementado por `#ir-para-menu` em `styles.css`.

- O menu permanece contextual, compacto e associado ao ícone **Ir para**.
- Destinos continuam sendo `button.message-choice` criados por `js/game.js`.
- Estilos específicos não devem alterar globalmente `.message-choice`, também usada no celular.
- Nenhuma regra de destino ou conexão entre cenas pertence aos arquivos desta pasta.

## Validação

`test/interface-icons.test.js` verifica formato, ausência de conteúdo externo, semântica dos botões e integração visual básica.

## Referências

- [`../../SAVE_LOAD_ATUAL.md#design-atual`](../../SAVE_LOAD_ATUAL.md#design-atual): composição visual e responsividade do celular e da Galeria, sem alteração do contrato de persistência.
- [`../../ESTRUTURA_GAMING.md`](../../ESTRUTURA_GAMING.md): controles e contrato arquitetural do menu.
- [`../../IDEIA_CONCEITUAL.md`](../../IDEIA_CONCEITUAL.md): direção minimalista da interface atual.
- [`../../TODO.md`](../../TODO.md): implementação e validações pendentes.
