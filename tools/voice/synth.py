import json, sys, os, io, wave
import lameenc
from piper import PiperVoice
model, jobs_path, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out_dir, exist_ok=True)
voice = PiperVoice.load(model)
try:
    from piper import SynthesisConfig
    cfg = SynthesisConfig(length_scale=1.08, noise_scale=0.6, noise_w_scale=0.8)
except Exception:
    cfg = None
def pcm_for(text):
    if cfg is not None and hasattr(voice, 'synthesize'):
        try:
            chunks = list(voice.synthesize(text, syn_config=cfg))
            if chunks and hasattr(chunks[0], 'audio_int16_bytes'):
                return b''.join(c.audio_int16_bytes for c in chunks), chunks[0].sample_rate
        except TypeError:
            pass
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as w:
        voice.synthesize(text, w)
    buf.seek(0)
    with wave.open(buf, 'rb') as r:
        return r.readframes(r.getnframes()), r.getframerate()
total = 0
for j in json.load(open(jobs_path, encoding='utf-8')):
    pcm, sr = pcm_for(j['text'])
    pad = b'\x00\x00' * int(sr * 0.08)
    enc = lameenc.Encoder(); enc.set_bit_rate(48); enc.set_in_sample_rate(sr); enc.set_channels(1); enc.set_quality(2)
    mp3 = enc.encode(pad + pcm + pad) + enc.flush()
    open(os.path.join(out_dir, j['file']), 'wb').write(mp3)
    total += len(mp3)
print('done', total, 'bytes')
