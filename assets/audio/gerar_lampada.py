"""Placeholder técnico original: interruptor pequeno + estalo, sem assets externos."""
import math
import random
import struct
import wave
from pathlib import Path

rate = 22050
rng = random.Random(17)
samples = []
for index in range(round(rate * 0.42)):
    t = index / rate
    noise = rng.uniform(-1, 1)
    click = noise * math.exp(-t / 0.006) * 0.55
    body = math.sin(2 * math.pi * 650 * t) * math.exp(-t / 0.014) * 0.16
    dt = t - 0.052
    spark = 0 if dt < 0 else noise * math.exp(-dt / 0.009) * 0.18
    hum = 0 if dt < 0 else math.sin(2 * math.pi * 120 * dt) * min(dt / 0.025, 1) * math.exp(-dt / 0.065) * 0.012
    samples.append(click + body + spark + hum)
with wave.open(str(Path(__file__).with_name('lampada.wav')), 'wb') as out:
    out.setparams((1, 2, rate, 0, 'NONE', 'not compressed'))
    out.writeframes(b''.join(struct.pack('<h', round(max(-1, min(1, sample)) * 32767)) for sample in samples))
