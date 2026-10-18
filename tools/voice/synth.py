# Synthesize every job with Piper, write vNN.mp3 and per-word timings (ms) estimated from each sentence's phonemes.
import json, sys, os, re
import lameenc
from piper import PiperVoice, SynthesisConfig
model, jobs_path, out_dir, timings_path = sys.argv[1:5]
os.makedirs(out_dir, exist_ok=True)
voice = PiperVoice.load(model)
cfg = SynthesisConfig(length_scale=1.08, noise_scale=0.6, noise_w_scale=0.8)
PAD = 0.08
PUNCT = ',.!?;:…'
def weights(tokens):
    return [max(1, len(t)) + (4 if t and t[-1] in PUNCT else 0) for t in tokens]
def spread(start, dur, ws):
    tot = sum(ws) or 1; out = []; t = start
    for w in ws: out.append(t); t += dur * w / tot
    return out
timings = {}; total = 0
for j in json.load(open(jobs_path, encoding='utf-8')):
    words = j['key'].split()
    chunks = list(voice.synthesize(j['text'], syn_config=cfg))
    sr = chunks[0].sample_rate
    pcm = b''.join(c.audio_int16_bytes for c in chunks)
    durs = [len(c.audio_int16_bytes) / 2 / sr for c in chunks]
    groups = [[g for g in ''.join(c.phonemes).split(' ') if g] for c in chunks]
    starts = []
    if sum(len(g) for g in groups) == len(words):
        t = PAD
        for g, d in zip(groups, durs):
            starts += spread(t, d, weights(g)); t += d
    else:
        # fall back: split the key into sentences; if they line up with Piper's chunks, spread per chunk by letters
        sents = [s for s in re.split(r'(?<=[.!?…])\s+', j['key']) if s]
        if len(sents) == len(chunks):
            t = PAD
            for s, d in zip(sents, durs):
                starts += spread(t, d, weights(s.split())); t += d
        else:
            starts = spread(PAD, sum(durs), weights(words))
    end = PAD + sum(durs)
    timings[j['file']] = [round(x * 1000) for x in starts] + [round(end * 1000)]
    pad = b'\x00\x00' * int(sr * PAD)
    enc = lameenc.Encoder(); enc.set_bit_rate(48); enc.set_in_sample_rate(sr); enc.set_channels(1); enc.set_quality(2)
    mp3 = enc.encode(pad + pcm + pad) + enc.flush()
    open(os.path.join(out_dir, j['file']), 'wb').write(mp3); total += len(mp3)
json.dump(timings, open(timings_path, 'w', encoding='utf-8'))
print('done', len(timings), 'clips', total, 'bytes')
