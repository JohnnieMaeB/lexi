// Read aloud with the phone's own text-to-speech voice (expo-speech). Emoji are dropped first so the
// voice doesn't spell out "smiling face with smiling eyes".
import * as Speech from 'expo-speech';
import { stripEmoji } from './text';

/** A tap on 🔊 replaces whatever is playing; `queue` (Lexi reading her own messages) waits its turn. */
export function speak(text: string, opts: { queue?: boolean } = {}) {
  const t = stripEmoji(text);
  if (!t) return;
  try {
    if (!opts.queue) Speech.stop();
    Speech.speak(t, { rate: 0.95 });
  } catch (e) { console.warn('speak', e); }
}
export function stopSpeaking() {
  try { Speech.stop(); } catch {}
}
