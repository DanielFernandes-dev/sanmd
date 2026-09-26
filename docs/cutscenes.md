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
> Executar sequências narrativas com bloqueio de input, Skip e finalização comum.
> A primeira utilização é `intro_abertura`, antes de entregar o menu principal.
> Navegação continua em [Scene Transitions](SCENE_TRANSITIONS.md); persistência
> continua no [Save System](SAVE_SYSTEM.md).

## Responsabilidades e integração

`criarJogo` compõe `criarCutsceneController` e injeta a apresentação
`criarVisualAbertura`. O bootstrap prepara o menu bloqueado e chama
`game.services.iniciarCutscene('intro_abertura')` uma vez. O gameplay só começa
pela escolha do menu. Cada abertura do aplicativo executa a intro novamente.

`CUTSCENES`, em `js/data.js`, mapeia IDs narrativos estáveis para conteúdo,
assets e passos. Cada passo nomeia uma fase visual e uma duração em
`CONFIG.cutscene`; pode declarar duração alternativa para movimento reduzido
ou disparo de áudio. O controlador não conhece textos, elementos do caderno,
keyframes nem regras narrativas. Uma próxima apresentação pode ser injetada
na mesma fábrica (ou despachada por ID), reutilizando execução e Skip.
Nenhuma próxima cutscene ou flag narrativa foi implementada.

## Ciclo de vida e cancelamento

1. `iniciarCutscene(id, onComplete)` recusa concorrência e bloqueia imediatamente.
2. Prepara/decodifica assets usando `prepareSceneImages`, com cache e timeout
   do controlador global de cena. O palco permanece preto durante essa espera.
3. Executa os passos sequencialmente, com um único timer registrado por vez.
4. Término natural e `pularCutscene()` convergem em `finalizar()`.
5. Cancela timer, invalida callbacks por geração, limpa intenção de Skip,
   para áudio, cancela animações CSS, aplica visual final e libera o menu/foco.
   `onComplete` roda uma única vez.

Skip durante carregamento cancela a sequência e espera apenas o preparo já
limitado por `CONFIG.sceneTransition.assetTimeout`, evitando revelar arte ainda
não decodificada. Falha de asset é registrada e não prende o menu indefinidamente.
Nenhum callback da sequência encerrada pode iniciar fase ou áudio posteriormente.

`isCutsceneActive()`, `getCurrent()` e `isSkipping()` expõem estado transitório.
Tudo fica em closures; snapshot não contém timer, fase, máscara, posição,
geração ou primeiro toque. Save/Load e seu formato permanecem intactos.

## Input e acessibilidade

Captura no documento bloqueia ponteiro, touch, mouse, teclado, formulário,
context menu e wheel. O menu está `inert` desde o HTML; o app permanece `inert`
até a escolha de Novo jogo/Carregar. As ações públicas do menu também recusam
ativação enquanto ele estiver inerte.

Somente `pointerup` primário conta para Skip: dois cliques/toques completos
dentro de `skipDoubleInputWindow` (350 ms). Não usa `dblclick` para detectar
Skip e não conta os eventos touch/mouse sintetizados como novos toques.
Um toque isolado ou dois fora da janela não pulam; multitoque não conta.
`touch-action: none` impede zoom de duplo toque sobre a apresentação.

Click/dblclick e eventos de cauda do gesto usado para pular são consumidos
mesmo após esconder o overlay. Uma nova pressão de ponteiro ou tecla libera
a próxima interação. Ao terminar, o foco retorna a Novo jogo com o contrato
existente de `:focus-visible`. Os textos decorativos não são focáveis.

## Apresentação e camadas

O overlay `1001` fica imediatamente sobre a tela inicial `1000`; o fade de
cena permanece em `7`, o celular em `50`. Não se cria outro sistema de troca
de cenas. Cutscenes futuras que naveguem devem terminar sua apresentação e
usar `transitionToScene`, como definido no contrato global.

O palco usa o mesmo lock `1672:941`, largura e centralização do menu.
Preto → SANMD por máscara central → pausa → significado com a mesma máscara
→ pausa → subida conjunta → preto → luz superior → menu existente.
A máscara usa `clip-path`; o texto fica parado. A subida usa `transform` em
passos. A luz descobre progressivamente a arte por gradiente radial superior
com retirada da escuridão, sem recriar a mesa/caderno nem modificar assets.

Todas as durações são resolvidas de CONFIG e passadas ao CSS por
`--cutscene-duration`. `movimentoReduzido()` é a fonte da preferência, lida a
cada fase e espelhada em `data-reduced`. Em modo reduzido a máscara abre sem
expansão gradual, a subida é cortada e a luz dura 100 ms; pausas de leitura
preservam SANMD, significado e ordem narrativa.

## Áudio pendente

O serviço de diálogo já contém o áudio sintetizado da digitação. Foi estendido
somente com `tocarEfeitoTransitorio(source)`, que retorna um cancelador para um
arquivo curto e não aguarda playback. `lampAudio: null` declara o asset pendente:
fornecer um som de interruptor autorizado em `assets/audio/` e apontar esse
campo para o arquivo. Nenhum asset externo foi baixado; atualmente a abertura
é silenciosa. Arquivo ausente e rejeição de autoplay são tolerados.

Navegadores e WebViews podem impedir som antes de um gesto. Nesse caso o visual
prossegue, sem replay tardio nem espera pelo áudio. O cancelador pausa e remove
a fonte no término/Skip. A reprodução audível real depende do asset final e de
validação em dispositivo.

## Validação

`test/cutscene.test.js` controla o relógio e cobre ordem, preparo, concorrência,
finalização única, Skip em cada uma das oito fases, timer cancelado, callback
obsoleto, clique único/duplo, janela expirada, multitoque, bloqueio de teclado,
cauda do gesto, retomada de teclado, reduced motion e limpeza visual/áudio.
`test/tela-inicial.test.js` executa o bootstrap publicado e verifica menu
bloqueado antes da intro, liberação posterior e snapshot sem estado visual.

Checklist visual desktop/APK: abrir com cache frio, confirmar preto sem flash,
máscaras centrais e subida conjunta; testar clique único e dupla em cada fase;
confirmar que Novo jogo não abre pelo toque de Skip; usar Carregar e voltar;
repetir em landscape, tamanhos diferentes e movimento reduzido. Confirmar luz
superior e estado final idêntico ao menu já aprovado. Áudio aguarda asset final.
