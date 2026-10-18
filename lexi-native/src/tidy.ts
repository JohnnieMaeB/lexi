// ✨ Tidy word by word (FEATURES_DO_NEXT §12): find each fix in the original text, then rebuild the text from the
// original with only the fixes the person accepted. The original is never lost.

export type Fix = { from: string; to: string; kind: 'spelling' | 'sound-alike'; hint?: string };
/** A fix with where it was found in the original text. */
export type PlacedFix = Fix & { at: number };

export const TIDY_PROMPT = 'Find spelling mistakes and sound-alike word mix-ups (like there/their or here/hear) in the journal text. Do not change style, grammar, slang, emoji or capital letters. Reply with only JSON: {"fixes":[{"from":"the wrong word exactly as written","to":"the fixed word","kind":"spelling" or "sound-alike","hint":"sound-alike only: 2 to 4 simple words about the meaning"}]}. At most 20 fixes. If there are none, reply {"fixes":[]}.\n\nText:\n';

const WORD_CHAR = /[A-Za-z0-9À-ɏ'’]/;
/** First whole-word match of `word` at or after `from` (exact case first, then any case). */
function findWord(text: string, word: string, from: number): number {
  for (const hay of [text, text.toLowerCase()]) {
    const needle = hay === text ? word : word.toLowerCase();
    let i = hay.indexOf(needle, from);
    while (i >= 0) {
      const before = i > 0 ? text[i - 1] : '';
      const after = text[i + word.length] || '';
      if (!WORD_CHAR.test(before) && !WORD_CHAR.test(after)) return i;
      i = hay.indexOf(needle, i + 1);
    }
  }
  return -1;
}

/** Clean up the model's fixes and find each one, left to right, each after the one before. Unfound ones are dropped. */
export function placeFixes(original: string, raw: unknown): PlacedFix[] {
  const list = raw && typeof raw === 'object' && Array.isArray((raw as { fixes?: unknown }).fixes) ? (raw as { fixes: unknown[] }).fixes : [];
  const out: PlacedFix[] = [];
  let pos = 0;
  for (const r of list.slice(0, 20)) {
    if (!r || typeof r !== 'object') continue;
    const { from, to, kind, hint } = r as Record<string, unknown>;
    if (typeof from !== 'string' || typeof to !== 'string' || !from.trim() || !to.trim() || from === to) continue;
    const at = findWord(original, from, pos);
    if (at < 0) continue;
    out.push({ from, to, kind: kind === 'sound-alike' ? 'sound-alike' : 'spelling', hint: typeof hint === 'string' && hint.trim() ? hint.trim() : undefined, at });
    pos = at + from.length;
  }
  return out;
}

/** The original text with the accepted fixes applied, left to right. */
export function applyFixes(original: string, fixes: PlacedFix[], accepted: boolean[]): string {
  let out = '', pos = 0;
  fixes.forEach((f, i) => {
    if (!accepted[i] || f.at < pos) return;
    out += original.slice(pos, f.at) + f.to;
    pos = f.at + f.from.length;
  });
  return out + original.slice(pos);
}
