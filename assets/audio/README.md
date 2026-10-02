# Áudio

Assets de apresentação, fora do Save System. Nenhum arquivo foi baixado.

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
