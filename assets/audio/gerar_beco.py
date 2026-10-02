"""Ambiente e foley originais sintetizados offline. PCM mono; sem dependências."""
import math
import random
import struct
import wave
from pathlib import Path

RATE = 22050
ROOT = Path(__file__).parent
rng = random.Random(303)

def save(name, seconds, sample):
    with wave.open(str(ROOT / (name + '.wav')), 'wb') as out:
        out.setparams((1, 2, RATE, 0, 'NONE', 'not compressed'))
        out.writeframes(b''.join(struct.pack('<h', round(max(-1, min(1, sample(i / RATE))) * 32767))
                                for i in range(round(seconds * RATE))))

# Soma periódica de frequências: vento filtrado, tráfego grave e loop sem estalo.
wind = [(f, rng.random() * math.tau) for f in range(40, 550, 7)]
def ambience(t):
    return sum(math.sin(math.tau * f * t + phase) for f, phase in wind) * .014 * (1 + .25 * math.sin(math.tau * t / 4)) + .035 * math.sin(math.tau * 60 * t)

def step(t):
    return (math.sin(math.tau * 110 * t) * .4 + rng.uniform(-1, 1) * .1) * math.exp(-t * 35) * min(1, t / .005)

def cloth(t, length):
    return rng.uniform(-1, 1) * .16 * math.sin(math.pi * min(1, t / length)) ** 2

save('rooftop_ambience', 4, ambience)
save('mj_steps', 1.5, lambda t: step(t % .48) * .6)
save('binoculars', .45, lambda t: cloth(t, .45) + step(t) * .15)
save('backpack', .9, lambda t: cloth(t, .9) + (rng.uniform(-1, 1) * .1 * math.sin(math.pi * (t - .4) / .3) ** 2 if .4 < t < .7 else 0))
save('strap', .4, lambda t: cloth(t, .4))
save('exit_steps', 1.05, lambda t: (step(t % .38) * .65 if t < .76 else step(t - .76) * .4))
