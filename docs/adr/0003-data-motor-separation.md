# ADR-0003: Separação conteúdo (data) x motor (game)

- **Status:** Aceito
- **Data:** 2026-08-12

## Contexto

O roteiro do jogo (diálogos, mensagens de chat, itens, galeria, notas) é extenso e
evolui independentemente da lógica de jogo. Misturar roteiro e motor no mesmo
arquivo dificulta a edição do conteúdo e a reutilização de cenas.

## Decisão

Separar em dois módulos:
- `js/data.js`: apenas conteúdo (diálogos, sequências de chat, textos de itens,
  galeria, notas, finais), exposto globalmente como `DATA`.
- `js/game.js`: motor — estado, fluxo de cenas, celular, terminal, eventos e
  avaliação de finais.

## Consequências

- Positivas: roteiro editável sem tocar na lógica; dados prontos para exportar
  para JSON ou uma ferramenta de escrita; menor risco de quebrar o jogo ao
  escrever diálogo.
- Negativas: índice global `DATA` em vez de módulo real (ESM) por limitação do
  modelo "abrir arquivo direto no navegador".
- Mitigação futura: converter para ES modules quando houver build.
