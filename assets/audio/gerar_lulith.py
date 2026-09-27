"""SFX originais sintetizados, mono PCM 22050 Hz. Sem arquivos externos."""
import math
import random
import struct
import wave
from pathlib import Path

RATE = 22050
ROOT = Path(__file__).parent
rng = random.Random(42)


def save(name, seconds, sample):
    with wave.open(str(ROOT / (name + '.wav')), 'wb') as output:
        output.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
        output.writeframes(b''.join(struct.pack('<h', round(max(-1, min(1, sample(i / RATE))) * 32767))
                                   for i in range(round(seconds * RATE))))


def keyboard(t, interval):
    beat = t % interval
    return (rng.uniform(-1, 1) * .22 + math.sin(2 * math.pi * 1800 * beat) * .1) * math.exp(-beat * 240)


save('keyboard', 1.4, lambda t: keyboard(t, .14))
save('keyboard_fast', 1.2, lambda t: keyboard(t, .1))
save('computer_error', .3, lambda t: math.sin(2 * math.pi * (330 if t < .13 else 220) * t)
     * .28 * min(t / .008, 1) * max(0, 1 - t / .3))
save('chair_move', .48, lambda t: (rng.uniform(-1, 1) * .2 + math.sin(2 * math.pi * 140 * t) * .09)
     * math.sin(math.pi * t / .48) ** 2)
save('kick_impact', .28, lambda t: (math.sin(2 * math.pi * 75 * t) * .65 + rng.uniform(-1, 1) * .3)
     * math.exp(-t * 23) * min(t / .002, 1))
# Frequências inteiras em um loop de dois segundos, sem descontinuidade na emenda.
save('room_ambience', 2, lambda t: .1 * math.sin(2 * math.pi * 60 * t) + .025 * math.sin(2 * math.pi * 180 * t))
