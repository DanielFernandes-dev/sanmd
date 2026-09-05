# Interfaces

Esta pasta contém assets visuais reutilizáveis da interface. Regras de layout e interação permanecem em `index.html`, `styles.css` e `js/game.js`.

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
- A cor normal é creme; dourado é reservado a hover, foco e feedback de interação.
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

- [`../../ESTRUTURA_GAMING.md`](../../ESTRUTURA_GAMING.md): controles e contrato arquitetural do menu.
- [`../../IDEIA_CONCEITUAL.md`](../../IDEIA_CONCEITUAL.md): direção minimalista da interface atual.
- [`../../TODO.md`](../../TODO.md): implementação e validações pendentes.
