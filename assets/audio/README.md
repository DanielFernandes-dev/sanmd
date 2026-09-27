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
