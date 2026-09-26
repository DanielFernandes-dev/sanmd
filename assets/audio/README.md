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
