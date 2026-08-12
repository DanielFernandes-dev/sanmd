# ADR-0006: Multi-cena, cronômetro e finais (Atos 2 e 3)

- **Status:** Aceito
- **Data:** 2026-08-12

## Contexto

O GDD exige progressão em três atos: o Ato 2 ocorre em outro cenário (delegacia),
com o terminal oculto por trava de presença; o Ato 3 ativa um cronômetro de
contagem regressiva e ramifica em três finais conforme o desempenho (senhas
decifradas x tempo).

## Decisão

Estender o motor existente sem quebrar as decisões anteriores:
- **Cenas múltiplas**: containers de cena distintos (`#room`, `#room-office`)
  alternados por `state.location`, sem roteamento de páginas.
- **Isolamento derivado do local**: `state.isolated = (location === 'casa')`,
  reutilizando a trava sensorial já existente; a delegacia bloqueia o terminal.
- **Cronômetro**: `state.timerRunning` + `state.timeRemaining` decrementados em
  um intervalo de 1s; viagens entre cenas custam tempo (10s), pressionando o
  jogador.
- **Finais**: avaliação centralizada a partir do estado — `corrupted` (Final 3),
  fragmentos coletados e tempo restante (Finais 1 e 2), exibida em overlay
  próprio (`#ending`).
- **Puzzles dos Atos 2/3**: comandos novos no parser existente (`decrypt <chave>`
  e `corromper`), com fragmentos hex/base64 gerados fora do jogo.

## Consequências

- Positivas: os três atos e os três finais do GDD ficam jogáveis no protótipo;
  a mecânica de trava sensorial ganha sentido narrativo (delegacia cheia).
- Negativas: a narrativa por `showDialog` em cadeia cresce com os Atos; o
  conteúdo por cena continua em CSS art manual.
- Mitigação futura: converter diálogos em script/data-driven por cena e mover o
  cálculo de finais para uma função pura testável.
