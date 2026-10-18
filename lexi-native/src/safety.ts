// Shared safety + style logic, ported as-is from docs/FEATURES_DO_NEXT.md §8 and §10 (web: inline in lexi.html).
// Only the types are new. Keep the two apps in step: change the spec block first, then both ports.
import { cleanLines, emojiList, stripEmoji } from './text';

export type Level = 'none' | 'check' | 'risk';

const RISK_PHRASES = ['kill myself','killing myself','kill my self','suicide','suicidal','end my life','end it all','take my life','want to die','wanna die','wish i was dead','wish i were dead','better off dead','better off without me','hang myself','self harm','hurt myself','hurting myself','harm myself','cut myself','cutting myself','dont want to live','no reason to live','unalive myself'];
const CHECK_PHRASES = ['want to disappear','cant go on','give up on everything','no point in anything','hopeless','worthless','hate my life','dead inside','overdose','nobody would care','cant do this anymore','dont want to be here'];
const RISK_TOKENS = ['kms','kys','unalive','sewerslide'];
const RISK_EMOJI = /[\u{1F52A}\u{1FA78}\u{26B0}\u{1FAA6}\u{1FAA2}]/u; // 🔪 🩸 ⚰ 🪦 🪢
export function soundKey(s: string): string {
  return String(s).toLowerCase()
    .replace(/\bd[yi]e\s+(my|your|his|her|their|the|it|this|that|a)\b/g, 'colour $1') // "dye my hair" is not "die"
    .replace(/[’']/g, '').replace(/[^a-z0-9\s]/g, ' ')
    .replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/c(?=[eiy])/g, 's').replace(/c/g, 'k')
    .replace(/z/g, 's').replace(/y/g, 'i').replace(/wh/g, 'w').replace(/kn/g, 'n')
    .replace(/([a-z])\1+/g, '$1').replace(/\s+/g, ' ').trim();
}
function lev(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}
// phrase match: starts at a word start with the same first letter; exact prefix, or ~1 typo per 6 letters ending on a word end
function fuzzyHas(hay: string, starts: number[], phrase: string): boolean {
  const p = soundKey(phrase).replace(/ /g, '');
  const max = p.length >= 10 ? 2 : p.length >= 6 ? 1 : 0;
  const ends = new Set(starts.slice(1)); ends.add(hay.length);
  for (const i of starts) {
    if (hay[i] !== p[0]) continue;
    if (hay.startsWith(p, i)) return true;
    for (let len = p.length - max; max && len <= p.length + max; len++) {
      if (ends.has(i + len) && lev(hay.slice(i, i + len), p, max) <= max) return true;
    }
  }
  return false;
}
export function riskCheck(text: string): Level {
  const raw = String(text || '');
  const key = soundKey(raw);
  const words = key ? key.split(' ') : [];
  if (words.some(w => RISK_TOKENS.includes(w))) return 'risk';
  let hay = ''; const starts: number[] = [];
  words.forEach(w => { starts.push(hay.length); hay += w; });
  if (RISK_PHRASES.some(p => fuzzyHas(hay, starts, p))) return 'risk';
  if (CHECK_PHRASES.some(p => fuzzyHas(hay, starts, p))) return 'check';
  if (RISK_EMOJI.test(raw) && words.length <= 4) return 'check';
  return 'none';
}
const LEVEL: Record<Level, number> = { none: 0, check: 1, risk: 2 };
export const maxLevel = (a: Level, b: Level): Level => (LEVEL[a] >= LEVEL[b] ? a : b);
export const asLevel = (v: unknown): Level => (v === 'risk' || v === 'check' ? v : 'none');

// Reply style check for every AI reply (chat + reflections)
const BANNED = ['hang in there','silver lining','bright side','everything happens for a reason','cheer up','be happy','stay positive','just be positive','good vibes','could be worse','piece of cake','every cloud','it is what it is','chin up','under the weather','beat yourself up','tough it out','man up','snap out of it'];
export function styleCheck(text: string, { icons = true }: { icons?: boolean } = {}): { tag: string; lines: string[] } {
  let tag = 'ok';
  const lines = cleanLines(text).map(l => l.replace(/^\[(ok|check|risk)\]\s*/i, (_, t: string) => { tag = t.toLowerCase(); return ''; })).filter(Boolean);
  let sentences: string[] = [];
  lines.forEach(l => (l.match(/[^.!?…]+(?:[.!?…]+["')\]]*)?/g) || [l]).map(s => s.trim()).filter(Boolean).forEach(s => {
    if (!stripEmoji(s) && sentences.length) sentences[sentences.length - 1] += ' ' + s; else sentences.push(s);
  }));
  const kept = sentences.filter(s => !BANNED.some(b => s.toLowerCase().includes(b)));
  if (kept.length) sentences = kept;
  const out: string[] = []; let count = 0;
  for (const s of sentences) {
    const w = stripEmoji(s).split(/\s+/).filter(Boolean).length;
    if (out.length === 3) break;
    if (count + w > 50) { if (!out.length) out.push(stripEmoji(s).split(/\s+/).slice(0, 50).join(' ') + '…'); break; }
    out.push(s); count += w;
  }
  const lines2 = out.map(s => {
    const emo = [...new Set(emojiList(s))].slice(0, 2);
    const body = stripEmoji(s);
    return icons && emo.length ? body + ' ' + emo.join(' ') : body;
  }).filter(Boolean);
  return { tag, lines: lines2 };
}

/* ---------- crisis lines (§7) ---------- */
export type Country = 'US' | 'CA' | 'GB' | 'IE' | 'AU' | 'NZ' | 'Other';
export type HelpLine = { name: string; how: string; call?: string; text?: string; textBody?: string; web?: string };
export const COUNTRIES: Record<Country, { name: string; emergency: string; dial?: string; lines: HelpLine[] }> = {
  US: { name: 'United States', emergency: '911', dial: '911', lines: [
    { name: '988 Suicide & Crisis Lifeline', how: 'call or text 988', call: '988', text: '988' },
    { name: 'Crisis Text Line', how: 'text HOME to 741741', text: '741741', textBody: 'HOME' },
  ] },
  CA: { name: 'Canada', emergency: '911', dial: '911', lines: [
    { name: '9-8-8 Suicide Crisis Helpline', how: 'call or text 988', call: '988', text: '988' },
  ] },
  GB: { name: 'United Kingdom', emergency: '999', dial: '999', lines: [
    { name: 'Samaritans', how: 'call 116 123 (free, any time)', call: '116123' },
    { name: 'Shout', how: 'text SHOUT to 85258', text: '85258', textBody: 'SHOUT' },
  ] },
  IE: { name: 'Ireland', emergency: '112 or 999', dial: '112', lines: [
    { name: 'Samaritans', how: 'call 116 123', call: '116123' },
    { name: 'Text About It', how: 'text HELLO to 50808', text: '50808', textBody: 'HELLO' },
  ] },
  AU: { name: 'Australia', emergency: '000', dial: '000', lines: [
    { name: 'Lifeline', how: 'call 13 11 14 or text 0477 13 11 14', call: '131114', text: '0477131114' },
  ] },
  NZ: { name: 'New Zealand', emergency: '111', dial: '111', lines: [
    { name: 'Need to talk?', how: 'call or text 1737', call: '1737', text: '1737' },
    { name: 'Lifeline', how: '0800 543 354', call: '0800543354' },
  ] },
  Other: { name: 'Other', emergency: 'your local emergency number', lines: [
    { name: 'Find a helpline', how: 'findahelpline.com, a free list of helplines in many countries', web: 'https://findahelpline.com' },
  ] },
};
export const COUNTRY_KEYS = Object.keys(COUNTRIES) as Country[];
/** Default from the locale region (en-GB → GB), otherwise "Other". */
export function defaultCountry(): Country {
  let loc = '';
  try { loc = Intl.DateTimeFormat().resolvedOptions().locale || ''; } catch {}
  const region = (loc.replace('_', '-').split('-').find((p, i) => i > 0 && /^[A-Za-z]{2}$/.test(p)) || '').toUpperCase();
  return (COUNTRY_KEYS as string[]).includes(region) && region !== 'OTHER' ? (region as Country) : 'Other';
}
