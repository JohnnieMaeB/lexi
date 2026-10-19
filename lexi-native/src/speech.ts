// 🔊 Read aloud (DESIGN.md "Voice"). Lexi's fixed lines play as her own recorded voice (src/clips.ts, via
// expo-audio). Everything else is read by the most natural voice the phone has (expo-speech), one sentence at a
// time with emoji stripped, pausing briefly between bubbles.
import { useEffect, useState, useSyncExternalStore } from 'react';
import * as Speech from 'expo-speech';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { CLIPS, type Clip } from './clips';
import { state } from './store';
import { speechKey, wordAt } from './text';

export type RankedVoice = Speech.Voice & { score: number; label: string; detail: string; english: boolean };

/* ---------- voices ---------- */
// Apple's novelty voices (Zarvox, Bubbles...) and other joke or formant voices sound the most robotic.
const NOVELTY = new Set(['albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos', 'good news', 'jester', 'organ',
  'superstar', 'trinoids', 'whisper', 'wobble', 'zarvox', 'fred', 'junior', 'kathy', 'ralph', 'deranged', 'hysterical', 'pipe organ']);
const LANG_NAMES: Record<string, string> = {
  'en-us': 'US English', 'en-gb': 'UK English', 'en-au': 'Australian English', 'en-ie': 'Irish English', 'en-in': 'Indian English',
  'en-za': 'South African English', 'en-nz': 'New Zealand English', 'en-ca': 'Canadian English', 'en-sg': 'Singapore English',
};

/** The person's locale, e.g. "en-GB". Lexi talks English, so other languages fall back to US English. */
export function userEnglishLocale(): string {
  let loc = 'en-US';
  try { loc = Intl.DateTimeFormat().resolvedOptions().locale || loc; } catch {}
  const [lang, region] = loc.replace('_', '-').split('-');
  return lang.toLowerCase() === 'en' && region ? 'en-' + region.toUpperCase() : 'en-US';
}
const normLang = (l: string) => (l || '').replace('_', '-').toLowerCase();

function describe(v: Speech.Voice): { label: string; detail: string } {
  const id = (v.identifier || '').toLowerCase();
  const lang = LANG_NAMES[normLang(v.language)] || v.language;
  const tags: string[] = [];
  if (/premium/.test(id)) tags.push('Premium');
  else if (/enhanced/.test(id) || v.quality === Speech.VoiceQuality.Enhanced) tags.push('Enhanced');
  if (/siri/.test(id)) tags.push('Siri');
  // Android voice names look like "en-us-x-tpf-local": show the code and whether it needs the internet.
  const android = /^[a-z]{2,3}-[a-z]{2,4}-x-[a-z0-9]+-(local|network)$/i.exec(v.name || '');
  if (android) {
    // Kept lower case: no ALL CAPS anywhere (FEATURES_DO_NEXT §3).
    const code = (v.name.split('-x-')[1] || '').split('-')[0];
    return { label: 'Voice ' + code, detail: [lang, android[1] === 'network' ? 'online' : 'on this phone', ...tags].join(' · ') };
  }
  return { label: v.name || v.identifier, detail: [lang, ...tags].join(' · ') };
}

export function score(v: Speech.Voice, locale: string): number {
  const id = ((v.identifier || '') + ' ' + (v.name || '')).toLowerCase();
  const lang = normLang(v.language);
  let s = 0;
  if (v.quality === Speech.VoiceQuality.Enhanced) s += 40;
  if (/premium/.test(id)) s += 35;
  if (/enhanced/.test(id)) s += 25;
  if (/neural|natural/.test(id)) s += 30;
  if (/siri/.test(id)) s += 22;
  if (/google/.test(id)) s += 12;
  if (/-network\b/.test(id)) s += 8;
  if (/compact/.test(id)) s -= 25;
  if (/espeak|eloquence|speech\.synthesis\.voice/.test(id) || NOVELTY.has((v.name || '').toLowerCase())) s -= 80;
  if (lang === locale.toLowerCase()) s += 60;
  else if (lang.startsWith('en')) s += 35;
  else s -= 120;
  return s;
}

export function rankVoices(vs: Speech.Voice[], locale = userEnglishLocale()): RankedVoice[] {
  return vs
    .map(v => ({ ...v, ...describe(v), score: score(v, locale), english: normLang(v.language).startsWith('en') }))
    .sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
}

let ranked: RankedVoice[] = [];
let loading: Promise<RankedVoice[]> | null = null;
export function loadVoices(force = false): Promise<RankedVoice[]> {
  if (loading && !force) return loading;
  loading = Speech.getAvailableVoicesAsync()
    .then(vs => (ranked = rankVoices(vs || [])))
    .catch(e => { console.warn('voices', e); return (ranked = []); });
  return loading;
}
/** Ranked voices for Settings; refreshes when the screen opens, so newly downloaded voices show up. */
export function useVoices(): RankedVoice[] | null {
  const [vs, setVs] = useState<RankedVoice[] | null>(ranked.length ? ranked : null);
  useEffect(() => { let on = true; loadVoices(true).then(v => { if (on) setVs(v); }); return () => { on = false; }; }, []);
  return vs;
}
export const bestVoice = (): RankedVoice | undefined => ranked.find(v => v.english) || ranked[0];
/** The chosen voice if it's still installed, otherwise the best one. */
export function currentVoice(): RankedVoice | undefined {
  const id = state.settings.voice;
  return (id && ranked.find(v => v.identifier === id)) || bestVoice();
}

/* ---------- speaking ---------- */
/** Short pieces at sentence ends; long utterances get cut off on some engines. */
export function sentences(text: string): string[] {
  const t = speechKey(text);
  return (t.match(/[^.!?…\n]+(?:[.!?…]+["')\]]*|$)/g) || []).map(s => s.trim()).filter(s => /[^\s.!?…"'()[\]\-–—,:;]/.test(s));
}
/** Lexi's recorded clip for a line, unless the person picked a device voice. */
export function clipFor(text: string): Clip | undefined {
  return state.settings.lexiVoice === 'device' ? undefined : CLIPS[speechKey(text)];
}
/** A line's words, the way the bubble and the clip timings count them: the speech key's whitespace tokens. */
export const wordsOf = (text: string) => speechKey(text).split(/\s+/).filter(Boolean);

/* ---------- which bubble, and which word, is being read (FEATURES_SOON §1) ---------- */
let reading: { target: string; word: number } | null = null;
let readVersion = 0;
const readListeners = new Set<() => void>();
function setReading(r: { target: string; word: number } | null) {
  if (r === reading || (r && reading && r.target === reading.target && r.word === reading.word)) return;
  reading = r; readVersion++; readListeners.forEach(l => l());
}
const subscribeReading = (l: () => void) => { readListeners.add(l); return () => { readListeners.delete(l); }; };
/** For one bubble: null when it isn't being read, -1 while it's read with no word known yet, else the word. */
export function useReadingWord(target: string | undefined): number | null {
  return useSyncExternalStore(subscribeReading, () => (target && reading && reading.target === target ? reading.word : null));
}

// One queue for everything Lexi says, so her bubbles are read in order. A part is a recorded clip or one sentence.
// `target` is the bubble being read and `offset` the index of the part's first word in it.
type Part =
  | { kind: 'clip'; clip: Clip; text: string; gap: number; target?: string }
  | { kind: 'tts'; text: string; gap: number; voice?: string; target?: string; offset: number };
let queue: Part[] = [];
let busy = false;
let gen = 0;
let player: AudioPlayer | null = null;
let stopPlayer: (() => void) | null = null;
const BUBBLE_GAP = 350;

let audioModeSet = false;
function ensureAudioMode() {
  if (audioModeSet) return;
  audioModeSet = true;
  // Play even with the iPhone's silent switch on (like spoken read-aloud), and lower other apps' sound meanwhile.
  setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'duckOthers', shouldPlayInBackground: false }).catch(e => console.warn('audio mode', e));
}

/** Plays one clip at the speed setting (pitch kept). Calls fail() if it can't start, so the line is spoken instead. */
function playClip(clip: Clip, target: string | undefined, done: () => void, fail: () => void) {
  ensureAudioMode();
  let p: AudioPlayer;
  try { p = createAudioPlayer(clip.src, { updateInterval: 50 }); } catch (e) { console.warn('clip', e); fail(); return; }
  player = p;
  let started = false, over = false;
  let cap: ReturnType<typeof setTimeout> | null = null;
  const cleanup = () => {
    if (over) return false;
    over = true;
    clearTimeout(startTimer); if (cap) clearTimeout(cap);
    sub.remove();
    try { p.remove(); } catch {}
    if (player === p) { player = null; stopPlayer = null; }
    return true;
  };
  stopPlayer = () => { try { p.pause(); } catch {} cleanup(); };
  const sub = p.addListener('playbackStatusUpdate', st => {
    if (st.playing && !started) {
      started = true;
      // A safety net in case the "finished" event never arrives.
      if (st.duration > 0) cap = setTimeout(() => { if (cleanup()) done(); }, (st.duration / Math.max(0.5, state.settings.rate) + 2) * 1000);
    }
    // currentTime is media time, so the timings hold at any playback rate.
    if (target && st.playing) setReading({ target, word: wordAt(clip.t, st.currentTime * 1000) });
    if (st.didJustFinish && cleanup()) done();
  });
  const startTimer = setTimeout(() => { if (!started && cleanup()) fail(); }, 4000);
  try {
    p.setPlaybackRate(state.settings.rate, 'high');
    p.play();
  } catch (e) { console.warn('clip', e); if (cleanup()) fail(); }
}

/** Device-voice parts for a line: one per sentence, each knowing where its words start in the bubble. */
function ttsParts(text: string, gap: number, voice?: string, target?: string): Part[] {
  const key = speechKey(text);
  const parts = sentences(text);
  let cursor = 0;
  return parts.map((p, i): Part => {
    const at = key.indexOf(p, cursor);
    const offset = at < 0 ? 0 : key.slice(0, at).split(/\s+/).filter(Boolean).length;
    if (at >= 0) cursor = at + p.length;
    return { kind: 'tts', text: p, gap: i === parts.length - 1 ? gap : 0, voice, target, offset };
  });
}

function pump(g: number) {
  if (g !== gen) return;
  const next = queue.shift();
  if (!next) { busy = false; setReading(null); return; }
  busy = true;
  const S = state.settings;
  const after = () => {
    if (g !== gen) return;
    if (!queue.length || queue[0].target !== next.target) setReading(null);
    if (next.gap) setTimeout(() => pump(g), next.gap); else pump(g);
  };
  if (next.target) setReading({ target: next.target, word: -1 }); // the bubble's ring shows straight away
  if (next.kind === 'clip') {
    // If the clip can't play, read the same line with the device voice instead.
    playClip(next.clip, next.target, after, () => {
      if (g !== gen) return;
      queue.unshift(...ttsParts(next.text, next.gap, undefined, next.target));
      pump(g);
    });
    return;
  }
  const { target, offset, text } = next;
  try {
    Speech.speak(text, {
      voice: next.voice ?? currentVoice()?.identifier,
      rate: S.rate, pitch: S.pitch,
      onDone: after, onError: after,
      // Word boundaries give a char index in this sentence; count the words before it. No events = ring only.
      onBoundary: target ? (ev: { charIndex?: number }) => {
        if (g !== gen || typeof ev?.charIndex !== 'number') return;
        const before = text.slice(0, ev.charIndex).split(/\s+/).filter(Boolean).length;
        const inWord = ev.charIndex > 0 && !/\s/.test(text[ev.charIndex - 1] || ' ');
        setReading({ target, word: offset + before - (inWord ? 1 : 0) });
      } : undefined,
    });
  } catch (e) { console.warn('speak', e); after(); }
}

/** A tap on 🔊 interrupts whatever is playing; `queue` (Lexi reading her own bubbles) waits its turn.
 *  `voice` forces a device voice (the voice picker's ▶ previews), so no clip is used.
 *  `target` is the chat bubble being read, for its ring and word highlight. */
export function speak(text: string, opts: { queue?: boolean; voice?: string; target?: string; device?: boolean } = {}) {
  if (!opts.queue) stopSpeaking();
  const clip = opts.voice || opts.device ? undefined : clipFor(text);
  if (clip !== undefined) {
    queue.push({ kind: 'clip', clip, text, gap: BUBBLE_GAP, target: opts.target });
  } else {
    const parts = ttsParts(text, BUBBLE_GAP, opts.voice, opts.target);
    if (!parts.length) return;
    queue.push(...parts);
  }
  if (!busy) pump(gen);
}
/** Tap a word to hear it (§2): just that word, in the device voice. */
export function speakWord(word: string) {
  speak(word, { device: true });
}
export function stopSpeaking() {
  gen++; queue = []; busy = false;
  if (stopPlayer) stopPlayer();
  setReading(null);
  try { Speech.stop(); } catch {}
}

/* ---------- lines used by Settings (all recorded, so Lexi's own voice can say them) ---------- */
export const TEST_LINE = "Hi! I'm Lexi, the journaling chatbot. I'm here to make journaling easy and fun.";
export const NATURAL_LINE = "Hi! I'm Lexi. I'm here to make journaling easy and fun.";
export const DEVICE_LINE = "Hi! I'm Lexi. I'll read with you.";
export const SPEED_LINE = 'This is how I sound now.';
