---
aliases:
  - Sistema de Cutscene
tags:
  - sanmd
  - arquitetura
  - cutscene
status: atual
updated: 2026-10-03
---

# Sistema de Cutscene

> [!summary] Objetivo
> Sequências com bloqueio de input, Skip e finalização comum. A primeira é
> `intro_abertura`, antes do menu principal. Navegação permanece no
> [Scene Transition](SCENE_TRANSITIONS.md); persistência no [Save System](SAVE_SYSTEM.md).

## Composição e ciclo de vida

`criarJogo` compõe um controlador e injeta `criarVisualCutscenes` (em
`cutscene-renderers.js`), que seleciona
`criarVisualAbertura` para o título ou `criarVisualQuadros` para sequências com `frames`. O bootstrap
prepara o menu bloqueado e chama `iniciarCutscene('intro_abertura')` uma vez.
Cada inicialização repete a abertura, sem flag persistente. Gameplay só começa
pela escolha do menu. Conteúdo e sequência vivem em `CUTSCENES`, em `data.js`.
Tempos vivem em `CONFIG.cutscene`. O controlador não conhece textos nem DOM.
Outras apresentações podem ser injetadas na mesma fábrica sem duplicar Skip.

`iniciarCutscene(id, onComplete)` recusa concorrência e bloqueia imediatamente.
O carregador global `prepareSceneImages` fornece cache, decode e timeout para
a arte do menu. Depois, um único timer por vez avança pelos passos, exceto o passo final com `hold`. Término
natural e `pularCutscene()` convergem em `finalizar()`, que cancela timer,
invalida callbacks pela identidade e fase da sessão, limpa a intenção de Skip e finaliza o visual.
Cada visual limpa seus recursos. A abertura cancela animações, observação de
tamanho e som, revelando o menu com foco em Novo jogo. Lulith faz fade e encerra
o áudio antes de ocultar o palco; o callback do caderno entrega o gameplay. A conclusão roda
uma vez. Na abertura, a fase `luz` declara `hold: true`: o acendimento termina e
a cena iluminada permanece, sem timer ou repetição de áudio, até o Skip.
Sequências sem `hold` continuam finalizando naturalmente.

Skip durante preparo aguarda somente o carregamento já limitado pelo timeout
global; não executa os passos. Falha de asset não prende a interface.
`isCutsceneActive()`, `getCurrent()` e `isSkipping()` expõem estado transitório
em closures. Nenhum timer, frame, posição, máscara, estado de áudio ou primeiro
toque entra em snapshots. A conclusão do Ato 1 acrescenta somente a flag persistente `act1Complete`; Novo jogo registra autosave após a conclusão de Lulith e a entrada no gameplay.

## Input e camadas

Captura no documento bloqueia ponteiro, mouse, touch, teclado, formulários e
wheel. O menu nasce `inert`; o app continua `inert` até a escolha de gameplay.
As ações públicas do menu também verificam esse bloqueio.

Na `intro_abertura`, dois `pointerup` primários na janela `skipDoubleInputWindow` (350 ms) pulam.
O controlador consome o clique gerado pelo segundo toque antes de liberar o menu;
depois disso, o próximo clique chega aos botões da capa. Nas demais cutscenes,
o detector de dois toques fica inativo, mas o controlador continua bloqueando
input durante a apresentação e mantém o Skip explícito pela API.
Clique único, dupla fora da janela e multitoque não pulam. Não depende de
`dblclick`. `touch-action: none` impede zoom. O overlay continua ativo até o
navegador concluir os eventos do segundo toque; depois a captura é desligada
e o menu aceita o primeiro clique. O título é decorativo e não focável.

Os overlays de abertura e de quadros usam camada 1001, imediatamente sobre o menu 1000; somente uma sequência fica ativa. O fade de cena continua em
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

## Cutscene 02 — `lulith_codigo`

Novo jogo abre o caderno, cobre o menu de preto, cancela temporizadores antigos,
recria o estado e a interface e executa a sequência. O app permanece `inert` até
terminar a apresentação e o fade de gameplay. Só então começa a conversa inicial
existente e registra o autosave. Carregar não executa a sequência. Nenhuma flag,
frame, câmera, efeito ou áudio é persistido.

O mesmo controlador seleciona o renderer de quadros por `sequence.frames`.
`criarVisualAbertura` e seus dados permanecem intactos. A finalização opcional
assíncrona mantém input bloqueado enquanto o visual faz fade para preto. Skip
cancela imediatamente o timer e impede avanços da sessão; a mesma finalização atende o fim
natural. A imagem anterior serve somente à suavização; não existem dez camadas.

`LULITH_FRAMES` mapeia IDs lógicos aos dez PNGs de `assets/cenario/quarto-lulith`.
Inspeção confirmou paisagem, ordem, ausência de números e divisórias. Os arquivos
**não têm proporção exatamente igual**: variam de aproximadamente 1,775 a 1,800.
O palco fixo 1672:941 usa `cover`, recortando levemente as bordas sem esticar nem
reprocessar as artes. `image-rendering: pixelated` mantém a nitidez.

Os tempos de `CONFIG.cutscene.lulithCodigo` são 2000, 1550, 1050, 1450, 1300,
950, 900, 400, 1150 e 1700 ms. Os sete primeiros quadros têm aproximadamente
25% mais tempo de leitura; os três últimos mantêm o ritmo anterior. Entrada: 200 ms;
saída: 280 ms. Os quadros 02, 04, 05, 07, 09 e 10 têm transição suave de 100 ms.
Os erros e o chute continuam com corte seco. Reduced motion mantém todos os
quadros, desliga câmera/shake/suavização interna e reduz a intensidade do flash.

A câmera usa apenas duas variantes (1,02 e 1,025). O flash magenta fica na região
do notebook; erro forte move o palco em até 1 px e chute em até 3 px por 140 ms.
A finalização congela a câmera durante o fade e limpa tudo ao terminar.

Preload global aguarda e decodifica as dez imagens. Falha/timeout registra erro e
encerra a sequência com segurança, sem mostrar imagem quebrada. O pool de áudio
aguarda no máximo 1500 ms por SFX; falhas seguem em silêncio, sem reprodução
posterior. Trocar de quadro para o som anterior, e finalizar faz fade de ambiente
de 180 ms. Sons sintetizados originais: `assets/audio/gerar_lulith.py`.

Testes em `cutscene.test.js`, `cutscene-frames.test.js`, `title-menu.test.js` e
`tela-inicial.test.js` cobrem ordem, tempos, falhas, Skip nos dez quadros, áudio,
animações, reduced motion, limpeza, autosave e o fluxo de Carregar.

### Timeline atual

Valores conferidos em `CONFIG.cutscene.lulithCodigo` em 02/10/2026. A duração
inclui a transição de entrada do próprio quadro; o fade final é adicional.

| Quadro | Acontecimento | Tempo | Troca |
|---|---|---:|---|
| 01 | Quarto / introdução | 2000 ms | Fade-in de 200 ms |
| 02 | Trabalho no notebook | 1550 ms | Suave, 100 ms |
| 03 | Primeiro erro | 1050 ms | Corte seco |
| 04 | Irritação | 1450 ms | Suave, 100 ms |
| 05 | Segunda tentativa | 1300 ms | Suave, 100 ms |
| 06 | Segunda falha | 950 ms | Corte seco |
| 07 | Lulith levanta | 900 ms | Suave, 100 ms |
| 08 | Chute | 400 ms | Corte seco |
| 09 | Consequência | 1150 ms | Suave, 100 ms |
| 10 | Plano final | 1700 ms | Suave, 100 ms |

São 12.450 ms de quadros, mais 280 ms de fade final. Preload, abertura do caderno
e fade do menu para gameplay são etapas adicionais. Push-in tem escala máxima
1,02/1,025; flash de erro 110 ms; shakes 90/140 ms; fade de áudio 180 ms.
A janela do duplo toque da abertura continua 350 ms.

### Validação registrada no aparelho — 2026-09-26

APK debug compilado e instalado por ADB no aparelho conectado em
`192.168.0.42:41205`. WebView em landscape: viewport 774×360 CSS px, palco
639,64×359,98, escala de viewport 1. Execução natural com cache desabilitado:
10/10 imagens completas, sem quadros vazios ou mudança das dimensões do palco;
intervalos medidos próximos aos tempos da revisão testada, anterior ao aumento
dos quadros 01–07 (aproximadamente 5–8 ms adicionais por quadro). Transição concluiu no gameplay inicial.

Na versão de 26/09, Skip foi exercitado no WebView nos dez quadros pelo detector global de ponteiro:
primeiro toque não pula, segundo pula, contagem de quadros para imediatamente,
nenhum HTMLAudioElement permanece tocando, zero animações residuais e transform
do palco volta a `none`. Carregar o autosave não inicia `lulith_codigo`.
Os registros existentes foram copiados antes dos testes e restaurados ao final.

Verificação complementar naquela versão do APK: duplo toque nativo via CDP no quadro 01
chegou ao gameplay mantendo `visualViewport.scale === 1`; emulação de
`prefers-reduced-motion` no WebView apresentou os dez quadros com zero animações
de transform. A suspensão da tela foi restaurada para os 30 segundos originais.
O runner Node registrou 17 arquivos aprovados (inclui o helper `test/load-game.cjs`;
não significa apenas 17 casos individuais). Reprodução/limpeza de áudio
foi verificada por estado dos elementos; a avaliação auditiva dos SFX sintetizados
continua sendo subjetiva.


### Último ajuste de leitura e revisão documental

Os quadros 01–07 foram alongados para os valores da timeline atual; 08–10 e as
transições foram mantidos. Os 48 casos dos dois arquivos de teste de cutscene
passaram após esse ajuste, e o APK foi recompilado e instalado no aparelho.
A validação Android detalhada acima é da rodada anterior: não equivale a uma
nova avaliação subjetiva do ritmo alongado. Em 02/10/2026 a documentação foi
conferida contra CONFIG e a suíte Node completa passou novamente; não houve
nova rodada no aparelho nessa revisão documental.


### Refatoração do ciclo de vida — 02/10/2026

O controlador agrupa cada execução em uma sessão (`preparing`, `playing`,
`finishing`) com sequência, índice, timer e callback próprios. Callbacks antigos
só executam enquanto sua sessão continua ativa. Falhas de inicialização,
apresentação, encerramento ou limpeza são registradas e não mantêm a sessão
presa; a conclusão comum é chamada uma vez. Durações ausentes/inválidas não
produzem timers sem limite.

A seleção de renderizador fica em `cutscene-renderers.js`; o renderer de quadros
separa transição, câmera e efeitos, preservando os tempos e as artes. O pool de
áudio reutiliza a mesma promessa de preload/encerramento, cancela carregamentos
pendentes no descarte e limpa o intervalo de fade mesmo se a espera falhar.
O encerramento não depende de `this`. Novo jogo trata a recusa de execução
concorrente como erro recuperável do caderno, sem promessa pendente indefinidamente.

A suíte Node completa passou após a refatoração, com regressões adicionais para
falhas, callbacks obsoletos, descarte durante preload e encerramento repetido.
A validação Android de setembro é histórica. Em 02/10/2026 a refatoração foi
revalidada no aparelho físico, conforme a rodada abaixo.


### APK refatorado no aparelho — 02/10/2026

Build debug aprovado e instalado com `adb install -r` no Samsung SM-A055M,
conectado em `192.168.0.42:40637`. Arquivos dos controladores e renderizadores
conferidos contra as cópias do pacote Android antes do build.

Verificações aprovadas no WebView real:

- Cutscene 01 chegou à luz, manteve o menu bloqueado e concluiu por duplo toque nativo.
- Novo jogo apresentou 10/10 quadros de Lulith em ordem, com os tempos atuais.
- Nenhuma imagem vazia; viewport landscape 774×360 CSS px e escala 1.
- Fim natural deixou zero animações, nenhum áudio residual e shake em `none`.
- Duplo toque nativo no quadro 01 concluiu Lulith e entregou gameplay sem zoom.
- Carregar restaurou autosave sem executar a Cutscene 02.

Os saves originais e a suspensão de tela foram restaurados ao terminar.
Essa rodada confirma os fluxos refatorados; o teste de Skip em todos os quadros
continua coberto pela suíte automatizada e pela rodada Android de setembro.

## Cutscene 03 — `act1_ending`

Na entrada do beco, `Ir para` oferece `Sair do beco` quando `safeOpened` e
`lulithPhoneCollected` são verdadeiros e `act1Complete` é falso. Coletar o
celular e navegar dentro do beco não iniciam a sequência. Não há requisito
adicional de reset ou conversa do celular.

`ACT1_FRAMES` aponta para as oito artes existentes em `assets/cenario/custcene-beco`.
O palco e `object-fit: cover` são compartilhados com a Cutscene 02. Não há
sprite de caminhada adequado; os quadros 02–03 representam o afastamento da MJ.
Todos os cortes internos são secos. CONFIG.cutscene.act1Ending contém tempos,
fades e câmeras (escala máxima 1,02; pan máximo 0,3%). Reduced motion mantém
quadros e som, sem câmera. Os sons originais são reproduzíveis offline com
`python3 assets/audio/gerar_beco.py` e usam o pool de áudio existente.

Após 08, um passo de fade de 400 ms cobre a tela; o passo 09 mantém preto
uniforme por 650 ms. Não há imagem 09. O ambiente termina durante o fade.
A mesma conclusão natural/Skip marca `act1Complete`, registra um autosave e
inicia `act1_title`: revelação central, pausa, subida e preto. Essa sequência
separada usa o mesmo controlador, renderer, fonte e keyframes da abertura,
sem lâmpada ou interruptor. O callback retorna à capa normal do menu.

Somente `act1Complete` entra no snapshot; saves antigos recebem `false`.
Carregar o save final preserva o progresso e não oferece novamente essa saída.
O retorno ao menu cancela timers de gameplay e preserva saves manuais e autosave.

Tempos em `CONFIG.cutscene.act1Ending`: 1800, 1350, 1150, 1250, 1150, 1050,
1050 e 1450 ms para os oito PNGs; fade para preto de 400 ms, Frame 09 de 650 ms.
O título usa revelação de 1200 ms, pausa de 1600 ms, subida de 1800 ms e preto
final de 550 ms. O primeiro quadro entra em 240 ms de fade. Skip funciona nos
nove quadros, no fade e no título; mudanças de frame e áudio pendentes são
canceladas. Reduced motion mantém os oito quadros e o preto, com câmera desligada.

Validação: 193 testes Node aprovados, incluindo Skip, limpeza, gatilho, migração
e reentrada. Chromium em viewport 915×412 confirmou fluxo completo, Skip nos
nove quadros, reduced motion, autosave e retorno ao menu sem zoom nem áudio
residual. Captura do Frame 09 teve RGB `(0,0,0)` em todos os pixels. O APK foi
compilado e instalado via ADB no SM-A055M e o aplicativo abriu em paisagem.
Nessa primeira rodada, a execução completa e a avaliação auditiva no aparelho
ainda estavam pendentes. A validação posterior da refatoração está abaixo.


### Refatoração da Cutscene 03 — 03/10/2026

Os oito passos de imagem estão declarados explicitamente em `CUTSCENES`, com
frame, duração, corte, câmera e SFX no mesmo objeto. A sequência informa
`ambience: 'rooftop_ambience'`; não depende do nome do ambiente do quarto.
O renderer compartilhado resolve `frame`, `fade-black`, `black` e `title` por
funções de apresentação e rejeita tipos, frames ou fases desconhecidos para
o controlador finalizar com segurança.

`scene.js` mantém `sairDoBeco()` como ação narrativa, separada da validação de
navegação em `irPara`. Uma recusa de início devolve modo livre sem cancelar os
timers de gameplay. Conclusão e retorno são idempotentes por execução: não
duplicam autosave nem título. Se o título não puder iniciar, o fluxo já concluído
retorna ao menu. A única flag persistente continua sendo `act1Complete`.

Skip cancela e oculta o título antes de aguardar o encerramento, e a limpeza
remove texto, fase, duração, transformações e imagem residual. O pool de áudio
identifica cada reprodução para rejeições antigas de `play()` não pausarem o
mesmo WAV no quadro seguinte; callbacks de volume descartados ficam inertes.

A suíte completa passou com 202 testes, incluindo recusa de início, callbacks
de conclusão duplicados, título interrompido nas três fases, rejeição antiga de
áudio, dados inválidos e preservação de saves no retorno ao menu. O Chromium 915×412 confirmou os oito quadros, título, autosave, retorno ao menu,
reentrada e Skip do título. O APK gerado foi conferido contra todos os scripts
e CSS fonte. A revisão foi instalada no SM-A055M via ADB em 03/10/2026.
No WebView real, os oito quadros apareceram em ordem, `act1Complete` e o
autosave final foram confirmados, o menu retornou com zero animações residuais
e escala 1, e carregar o final não repetiu a sequência. Os saves anteriores
foram restaurados após o teste. Avaliação auditiva de volume/timbre e Skip em
todos os quadros no aparelho continuam pendentes.
