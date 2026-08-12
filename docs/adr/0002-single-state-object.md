# ADR-0002: Estado centralizado único (variáveis do GDD)

- **Status:** Aceito
- **Data:** 2026-08-12

## Contexto

O GDD define três variáveis de estado estruturais para a progressão e os finais:
`tempo_restante`, `fragmentos_coletados` e `local_isolado`. Elas são lidas e
alteradas por várias camadas do jogo (cena, celular, chat e terminal), e os finais
dependem diretamente delas.

## Decisão

Manter um único objeto `state` em `game.js` como fonte de verdade, incluindo as
variáveis do GDD e flags de progresso (ato atual, chaves coletadas, eventos
disparados). Toda leitura/escrita passa por esse objeto, e a UI (HUD, telas)
reage às suas mudanças.

## Consequências

- Positivas: consistência entre camadas, previsibilidade na avaliação de finais,
  debug facilitado (o painel DEV serializa o estado).
- Negativas: possível acoplamento se o estado crescer demais; necessidade de
  disciplina para não duplicar estado em variáveis soltas.
- Mitigação: agrupar por domínio (progresso, tempo, isolamento, flags) quando os
  Atos 2 e 3 forem implementados.
