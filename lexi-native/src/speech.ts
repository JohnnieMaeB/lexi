// 🔊 Read aloud (DESIGN.md "Voice"). Lexi's fixed lines play as her own recorded voice (src/clips.ts, via
// expo-audio). Everything else is read by the most natural voice the phone has (expo-speech), one sentence at a
// time with emoji stripped, pausing briefly between bubbles.
import { useEffect, useState } from 'react';
import * as Speech from 'expo-speech';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';
import { CLIPS } from './clips';
import { state } from './store';
import { speechKey } from './text';

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
    const code = (v.name.split('-x-')[1] || '').split('-')[0].toUpperCase();
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
export function clipFor(text: string): number | undefined {
  return state.settings.lexiVoice === 'device' ? undefined : CLIPS[speechKey(text)];
}

// One queue for everything Lexi says, so her bubbles are read in order. A part is a recorded clip or one sentence.
type Part = { kind: 'clip'; src: number; text: string; gap: number } | { kind: 'tts'; text: string; gap: number; voice?: string };
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

/** Plays one clip at the speed setting. Calls fail() if it can't start, so the line is spoken instead. */
function playClip(src: number, done: () => void, fail: () => void) {
  ensureAudioMode();
  let p: AudioPlayer;
  try { p = createAudioPlayer(src); } catch (e) { console.warn('clip', e); fail(); return; }
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
    if (st.didJustFinish && cleanup()) done();
  });
  const startTimer = setTimeout(() => { if (!started && cleanup()) fail(); }, 4000);
  try {
    p.setPlaybackRate(state.settings.rate, 'high');
    p.play();
  } catch (e) { console.warn('clip', e); if (cleanup()) fail(); }
}

function pump(g: number) {
  if (g !== gen) return;
  const next = queue.shift();
  if (!next) { busy = false; return; }
  busy = true;
  const S = state.settings;
  const after = () => { if (g !== gen) return; if (next.gap) setTimeout(() => pump(g), next.gap); else pump(g); };
  if (next.kind === 'clip') {
    // If the clip can't play, read the same line with the device voice instead.
    playClip(next.src, after, () => {
      if (g !== gen) return;
      const parts = sentences(next.text);
      queue.unshift(...parts.map((t, i): Part => ({ kind: 'tts', text: t, gap: i === parts.length - 1 ? next.gap : 0 })));
      pump(g);
    });
    return;
  }
  try {
    Speech.speak(next.text, {
      voice: next.voice ?? currentVoice()?.identifier,
      rate: S.rate, pitch: S.pitch,
      onDone: after, onError: after,
    });
  } catch (e) { console.warn('speak', e); after(); }
}

/** A tap on 🔊 interrupts whatever is playing; `queue` (Lexi reading her own bubbles) waits its turn.
 *  `voice` forces a device voice (the voice picker's ▶ previews), so no clip is used. */
export function speak(text: string, opts: { queue?: boolean; voice?: string } = {}) {
  if (!opts.queue) stopSpeaking();
  const clip = opts.voice ? undefined : clipFor(text);
  if (clip !== undefined) {
    queue.push({ kind: 'clip', src: clip, text, gap: BUBBLE_GAP });
  } else {
    const parts = sentences(text);
    if (!parts.length) return;
    parts.forEach((p, i) => queue.push({ kind: 'tts', text: p, gap: i === parts.length - 1 ? BUBBLE_GAP : 0, voice: opts.voice }));
  }
  if (!busy) pump(gen);
}
export function stopSpeaking() {
  gen++; queue = []; busy = false;
  if (stopPlayer) stopPlayer();
  try { Speech.stop(); } catch {}
}

/* ---------- lines used by Settings (all recorded, so Lexi's own voice can say them) ---------- */
export const TEST_LINE = "Hi! I'm Lexi, the journaling chatbot. I'm here to make journaling easy and fun.";
export const NATURAL_LINE = "Hi! I'm Lexi. I'm here to make journaling easy and fun.";
export const DEVICE_LINE = "Hi! I'm Lexi. I'll read with you.";
export const SPEED_LINE = 'This is how I sound now.';
