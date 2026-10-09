# Áudio

> Arquitetura e regras gerais: [AGENTS.md](../../AGENTS.md). Este README mantém apenas o contrato local dos recursos.

Assets de apresentação, fora do snapshot. Os scripts abaixo documentam geração local de placeholders; a proveniência histórica não foi reconstituída integralmente nesta auditoria.

## Efeitos de diálogo

`phone_notification.wav` atende a notificação durante a conversa com James; `kick_impact.wav` também é reutilizado na sequência do telefone. O blip de digitação é sintetizado em `js/dialogue.js` por Web Audio, sem WAV dedicado. Os três geradores abaixo não documentam uma receita para todos os arquivos desta pasta.

## Interruptor da abertura

`lampada.wav` é um **placeholder técnico sintetizado original**, WAV PCM mono,
16 bits, 22050 Hz, 420 ms. Receita reproduzível: `python3 assets/audio/gerar_lampada.py`.
Clique mecânico em 0 ms, corpo curto do interruptor, estalo elétrico em 52 ms e
hum de amplitude baixa em rápida queda. Sem loop, impacto grave ou descarga longa.

`CUTSCENES.intro_abertura.lampAudio` aponta para o arquivo. O serviço existente
`tocarEfeitoTransitorio` executa uma vez no início da fase `luz` e devolve seu
cancelador. A iluminação começa em `CONFIG.cutscene.lampLightDelay` (70 ms) e
termina em `lampReveal` (1100 ms); não aguarda o áudio terminar.

Rejeição de autoplay ou arquivo indisponível não trava a apresentação, não
agenda nova tentativa e não toca som atrasado. O APK atual já contém uma
configuração nativa de autoplay fornecida antes desta refatoração; esta tarefa
não alterou fonte Android. Navegadores podem exigir gesto do usuário.

A gravação definitiva pode substituir o placeholder mantendo seu timing.
Ver [Cutscenes](../../docs/cutscenes.md).

## Quarto da Lulith

`python3 assets/audio/gerar_lulith.py` reproduz seis SFX originais em WAV mono
PCM 16 bits/22050 Hz: ambiente de computador, duas velocidades de teclado,
erro, cadeira e impacto. São efeitos sintetizados; não são gravações de foley.
Volumes ficam no catálogo `CUTSCENES.lulith_codigo.sounds`. O pool transitório
em `cutscene-audio.js` limita o preload, interrompe cada SFX na troca de quadro
e faz fade do ambiente ao concluir ou pular. Nenhum áudio entra no save.


| ID lógico | Arquivo | Uso/volume no catálogo |
|---|---|---|
| `room_ambience` | `room_ambience.wav` | Loop ambiente, 0,16 |
| `keyboard` | `keyboard.wav` | Quadro 02, 0,35 |
| `keyboard_fast` | `keyboard_fast.wav` | Quadro 05, 0,43 |
| `computer_error` | `computer_error.wav` | Quadros 03/06, 0,35; segundo erro ×1,2 |
| `chair_move` | `chair_move.wav` | Quadro 07, 0,40 |
| `kick_impact` | `kick_impact.wav` | Quadro 08, 0,60 |

`CONFIG.cutscene.lulithCodigo` limita o preload de áudio a 1500 ms e o fade do
ambiente a 180 ms. Som com falha é descartado sem reprodução tardia. Digitação
é um SFX de duração própria; ampliar a permanência do quadro não estica o WAV.
Os testes verificam reprodução/limpeza por estado dos elementos; avaliação
subjetiva de timbre, volume e alto-falante do aparelho permanece complementar.

## Telhado — Cutscene 03

`python3 assets/audio/gerar_beco.py` reproduz seis WAVs mono PCM originais usados
pela sequência `act1_ending`. O pool de `cutscene-audio.js` faz preload e descarte;
o ambiente inicia no Frame 01 e desaparece durante o fade para o Frame 09.

| ID lógico | Arquivo | Uso/volume no catálogo |
|---|---|---|
| `rooftop_ambience` | `rooftop_ambience.wav` | Vento/cidade em loop, 0,22 |
| `mj_steps` | `mj_steps.wav` | Quadros 02–03, 0,12; no 03 peso 0,55 e fade a zero |
| `binoculars` | `binoculars.wav` | Quadro 04, 0,18 |
| `backpack` | `backpack.wav` | Quadro 05, 0,20 |
| `strap` | `strap.wav` | Quadro 06, 0,16 |
| `exit_steps` | `exit_steps.wav` | Quadro 07, 0,24 |

O Frame 08 deixa apenas o ambiente. `CONFIG.cutscene.act1Ending` limita preload
de áudio a 1500 ms e controla o fade de 400 ms. Skip descarta todo o pool,
inclusive os passos e intervalos de volume. O título final não executa sons.
Os volumes ainda precisam de avaliação auditiva no Android físico.

O ambiente da sequência é escolhido por `ambience` no catálogo. O pool mantém
`room_ambience` como padrão para sequências anteriores. Cada chamada de `play`
tem uma identidade transitória: rejeições e fades antigos não interrompem um
WAV que já foi reutilizado por outro quadro.
