// Emoji, skin tone and date helpers shared by every screen.

// Hermes has supported Unicode property escapes for a while, but keep a surrogate-range fallback so an
// older engine never crashes on boot.
function makeEmojiRe(): RegExp {
  try {
    return new RegExp('\\p{Extended_Pictographic}(?:\\uFE0F|\\p{Emoji_Modifier})*(?:\\u200D\\p{Extended_Pictographic}(?:\\uFE0F|\\p{Emoji_Modifier})*)*', 'gu');
  } catch {
    const unit = '(?:[\\u00A9\\u00AE\\u203C\\u2049\\u2122\\u2139\\u2194-\\u21AA\\u231A-\\u23FF\\u24C2\\u25AA-\\u27BF\\u2934\\u2935\\u2B05-\\u2B55\\u3030\\u303D\\u3297\\u3299]|\\uD83C[\\uDC00-\\uDFFF]|\\uD83D[\\uDC00-\\uDFFF]|\\uD83E[\\uDC00-\\uDFFF])';
    const mods = '(?:\\uFE0F|\\uD83C[\\uDFFB-\\uDFFF])*';
    return new RegExp(unit + mods + '(?:\\u200D' + unit + mods + ')*', 'g');
  }
}
const EMOJI_RE = makeEmojiRe();
const LEFTOVER_RE = /\uD83C[\uDFFB-\uDFFF]|[‍️]/g;
const MEDIUM_TONE = '\u{1F3FD}';

/** Swap the default medium skin tone for the one picked in Settings ('' = yellow). */
export const tone = (s: string, t: string) => (t === MEDIUM_TONE ? String(s) : String(s).split(MEDIUM_TONE).join(t));

export function stripEmoji(t: string): string {
  EMOJI_RE.lastIndex = 0;
  return String(t).replace(EMOJI_RE, '').replace(LEFTOVER_RE, '').replace(/[ \t]{2,}/g, ' ').replace(/ *\n */g, '\n').trim();
}
/** What Lexi says out loud for a line, and the key of its recorded clip (the web app's `speechText()`):
 *  "Stress(ors)" read as "Stressors", line breaks as ". ", emoji removed, runs of spaces collapsed. */
export function speechKey(t: string): string {
  EMOJI_RE.lastIndex = 0;
  return String(t).replace(/Stress\(ors\)/g, 'Stressors').replace(/\n+/g, '. ')
    .replace(EMOJI_RE, '').replace(LEFTOVER_RE, '').replace(/\s{2,}/g, ' ').trim();
}
/** Every emoji in a string, in order (skin tones and ZWJ sequences stay whole). */
export function emojiList(s: string): string[] {
  EMOJI_RE.lastIndex = 0;
  return String(s).match(EMOJI_RE) || [];
}
export function firstEmoji(s: string): string {
  EMOJI_RE.lastIndex = 0;
  const m = String(s).match(EMOJI_RE);
  return m ? m[0] : '';
}
/** Model replies come back as short lines; drop list markers and markdown the prompt asked it to avoid. */
export function cleanLines(text: string): string[] {
  return String(text).split(/\n+/)
    .map(s => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/^\s*(?:[-*•]|\d+\.)\s+/, '').replace(/^#+\s*/, '').trim())
    .filter(Boolean);
}

/* ---------- dates (formatted by hand so every phone shows the same thing) ---------- */
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function dayKey(d = new Date()): string {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
export function parseDay(k: string): Date {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}
export function fmtDay(k: string): string {
  const y = new Date(); y.setDate(y.getDate() - 1);
  if (k === dayKey()) return 'Today';
  if (k === dayKey(y)) return 'Yesterday';
  const d = parseDay(k);
  return WEEKDAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()];
}
/** Top bar date, e.g. "Thu 15 Oct". */
export const shortDate = (d = new Date()) => WEEKDAYS[d.getDay()].slice(0, 3) + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3);
export const narrowDay = (d: Date) => WEEKDAYS[d.getDay()][0];
export function fmtTime(ms: number): string {
  const d = new Date(ms);
  const h = d.getHours() % 12 || 12;
  return h + ':' + String(d.getMinutes()).padStart(2, '0') + ' ' + (d.getHours() < 12 ? 'AM' : 'PM');
}

export const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

/** A line split for display: whitespace kept, and each non-emoji token numbered as a word, the same way the
 *  clip timings count them (speechKey(text).split(/\s+/)). Used by the word highlight (FEATURES_SOON §1). */
export type Token = { s: string; word: number | -1; space: boolean };
export function tokenize(text: string): Token[] {
  let n = 0;
  return String(text).split(/(\s+)/).filter(s => s !== '').map(s => {
    if (/^\s+$/.test(s)) return { s, word: -1, space: true };
    return { s, word: speechKey(s) ? n++ : -1, space: false };
  });
}

/** For a clip's word timings (word starts in ms, then the end time): the word being said at `ms`, or -1 before
 *  the first word. After the end it stays on the last word. */
export function wordAt(t: number[], ms: number): number {
  if (t.length < 2 || ms < t[0]) return -1;
  for (let i = t.length - 2; i >= 0; i--) if (ms >= t[i]) return i;
  return -1;
}
