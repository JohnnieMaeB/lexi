# Lexi's own voice

Lexi's fixed lines are pre-recorded so they sound human, even on devices whose built-in voices are robotic. The web app plays these clips for her lines and uses a device voice for everything else (your writing and her chat replies).

- **Engine:** [Piper TTS](https://github.com/rhasspy/piper)
- **Voice:** `en_US-ljspeech-high`, trained on the LJ Speech dataset, which is public domain
- **Output:** `web/voice/vNN.mp3` (48 kbps mono), plus the `CLIPS` table in `web/lexi.html`, which maps each line's spoken text to its clip

## Regenerate the clips

When you add or change a line Lexi says:

1. Add or edit the line in `lines.json`, copied exactly as it appears in `web/lexi.html`.
2. Turn the lines into jobs:
   ```bash
   node keys.mjs
   ```
   This writes `jobs.json`. The key for each line is the text with emoji removed, the same `speechText()` the app uses.
3. Install the tools and download the voice:
   ```bash
   pip install piper-tts lameenc
   ```
   Then download `en_US-ljspeech-high.onnx` and its `.json` file from `rhasspy/piper-voices` on Hugging Face.
4. Make the clips:
   ```bash
   python synth.py en_US-ljspeech-high.onnx jobs.json ../../web/voice
   ```
5. Rebuild the `CLIPS` table in `web/lexi.html` from `jobs.json` (`key` → `voice/<file>`), then republish the artifact with the `voice/` folder.
