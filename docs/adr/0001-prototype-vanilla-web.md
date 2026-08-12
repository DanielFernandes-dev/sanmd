# ADR-0001: Protótipo web vanilla, sem build

- **Status:** Aceito
- **Data:** 2026-08-12

## Contexto

O GDD prevê um jogo para Web/Desktop. O objetivo desta fase é validar o ciclo de
jogo (Visual Novel, celular simulado e terminal hacker) com o menor atrito de
desenvolvimento possível, permitindo abrir o protótipo em qualquer navegador sem
instalar dependências.

## Decisão

Implementar o protótipo em HTML/CSS/JavaScript puro (vanilla), com tela fixa de
1280x720 escalada via `transform: scale()`, sem build steps e sem dependências
externas.

## Consequências

- Positivas: abertura imediata no navegador, portabilidade, zero custo de
  instalação, facilidade de iterar nos Atos.
- Negativas: sem tipagem estática e sem testes automatizados nativos; a migração
  para um framework (ex.: React, Phaser) exigirá reescrita da camada de UI.
- Mitigação futura: manter a lógica do jogo desacoplada da DOM em `game.js` para
  facilitar essa migração.
