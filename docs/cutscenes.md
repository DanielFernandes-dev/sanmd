---
aliases:
  - Sistema de Cutscene
tags:
  - sanmd
  - arquitetura
  - cutscene
status: atual
updated: 2026-09-26
---

# Sistema de Cutscene

> [!summary] Objetivo
> Sequências com bloqueio de input, Skip e finalização comum. A primeira é
> `intro_abertura`, antes do menu principal. Navegação permanece no
> [Scene Transition](SCENE_TRANSITIONS.md); persistência no [Save System](SAVE_SYSTEM.md).

## Composição e ciclo de vida

`criarJogo` compõe o controlador e injeta `criarVisualAbertura`. O bootstrap
prepara o menu bloqueado e chama `iniciarCutscene('intro_abertura')` uma vez.
Cada inicialização repete a abertura, sem flag persistente. Gameplay só começa
pela escolha do menu. Conteúdo e sequência vivem em `CUTSCENES`, em `data.js`.
Tempos vivem em `CONFIG.cutscene`. O controlador não conhece textos nem DOM.
Outras apresentações podem ser injetadas na mesma fábrica sem duplicar Skip.

`iniciarCutscene(id, onComplete)` recusa concorrência e bloqueia imediatamente.
O carregador global `prepareSceneImages` fornece cache, decode e timeout para
a arte do menu. Depois, um único timer por vez avança pelos passos. Término
natural e `pularCutscene()` convergem em `finalizar()`, que cancela timer,
invalida callbacks por geração, limpa a intenção de Skip e finaliza o visual.
O visual cancela animações Web Animations/CSS, desconecta observação de tamanho,
interrompe áudio e revela o mesmo menu, com foco em Novo jogo. A conclusão roda
uma vez. Não há espera por gesto depois da luz.

Skip durante preparo aguarda somente o carregamento já limitado pelo timeout
global; não executa os passos. Falha de asset não prende a interface.
`isCutsceneActive()`, `getCurrent()` e `isSkipping()` expõem estado transitório
em closures. Nenhum timer, frame, posição, máscara, estado de áudio ou primeiro
toque entra em snapshots. Save/Load não foi alterado.

## Input e camadas

Captura no documento bloqueia ponteiro, mouse, touch, teclado, formulários e
wheel. O menu nasce `inert`; o app continua `inert` até a escolha de gameplay.
As ações públicas do menu também verificam esse bloqueio.

Dois `pointerup` primários na janela `skipDoubleInputWindow` (350 ms) pulam.
Clique único, dupla fora da janela e multitoque não pulam. Não depende de
`dblclick`. `touch-action: none` impede zoom. Eventos sintetizados de cauda são
consumidos mesmo após esconder o overlay, até uma nova pressão de ponteiro ou
tecla; o segundo toque não ativa Novo jogo. O título é decorativo e não focável.

Overlay 1001 fica imediatamente sobre o menu 1000. O fade de cena continua em
7 e celular em 50. Cutscenes futuras que naveguem devem terminar e usar a API
`transitionToScene`; não há um segundo sistema de navegação.

## Um único título

O palco mantém `1672:941`. O único componente `#cutscene-title` contém cinco
palavras, cada uma com inicial e complemento, mais a risada. As mesmas iniciais
permanecem no DOM e na tela: S → Sim, A → Acredite, N → Nas, M → Mentiras, D → Dele.
Não há segundo título, substituição de texto ou crossfade. Fonte do canon,
itálica e peso 700; nenhuma fonte externa.

As larguras são medidas nas mudanças de estado. Inicialmente só as iniciais
estão juntas e os complementos ficam mascarados. Durante a expansão, palavras
se deslocam por `transform`, os complementos abrem por `clip-path` e o conjunto
reduz a escala para caber. Ambas as posições são calculadas em torno do mesmo
centro. Não há animação contínua de width/top/left. Resize recalcula composição.
`kk` só abre na fase seguinte, deslocando as palavras meio comprimento da risada
para manter o conjunto centralizado. Toda a frase sobe como um bloco.

Fases: preto (5 s), siglas por máscara central, pausa, expansão, risada,
pausa completa, subida, preto final, luz. CONFIG controla todas as durações.
O JavaScript injeta `--cutscene-duration` e `--cutscene-lamp-delay`; a consulta
compartilhada `movimentoReduzido()` alimenta `data-reduced`. Movimento reduzido
mantém a ordem e pausas de leitura, aplica expansão/risada sem deslocamento
animado, corta subida e encurta a luz. Resultado final idêntico.

## Som e luz

O [WAV técnico original](../assets/audio/README.md) tem clique em 0 ms,
estalo em 52 ms e duração de 420 ms. O áudio existente dispara uma única vez
no início de `luz`; a retirada da escuridão começa aos 70 ms e termina aos
1100 ms. Gradiente parte da região superior esquerda onde está a lâmpada da
arte. Menu e caderno não são recriados. Não há partículas, blur ou flashes.

Autoplay rejeitado segue em silêncio, sem espera ou reprodução tardia.
Skip antes da luz impede o disparo; durante a luz interrompe o efeito.
O APK atual já tinha configuração nativa de autoplay antes desta refatoração;
nenhuma fonte Android foi editada nesta etapa.

## Verificações

Testes de relógio controlado cobrem fases, finalização natural única, Skip nas
nove fases, callbacks obsoletos, input, reduced motion, permanência dos mesmos
nós das iniciais, entrada tardia do kk, cancelamento de áudio, rejeição de
autoplay e WAV curto. O bootstrap real verifica bloqueio/liberação do menu e
snapshot sem estado de cutscene. Validação visual e áudio em aparelho são
complementares aos testes automatizados.
