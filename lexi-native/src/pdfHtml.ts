// The journal as plain HTML for the PDF (FEATURES_SOON §8): no emoji, sans font, black on white, about 12 pt.
// Kept free of native modules so it can be tested on its own; exportPdf.ts prints and shares it.
import { BAND_BY, TOPIC_BY } from './content';
import type { Entry } from './store';
import { dayKey, fmtDay, fmtTime, parseDay, stripEmoji } from './text';

const esc = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
/** Plain words only: emoji stripped, then HTML-escaped. */
const plain = (s: string) => esc(stripEmoji(String(s || ''))).replace(/\n/g, '<br>');
const KIND: Record<Entry['kind'], string> = { guided: 'Check-in', free: 'Free writing', voice: 'Voice entry' };

function longDate(k: string) {
  const d = parseDay(k);
  return fmtDay(k) === 'Today' || fmtDay(k) === 'Yesterday' ? fmtDay(k) + ' (' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ')' : fmtDay(k) + ' ' + d.getFullYear();
}

export function journalHtml(entries: Entry[], range: 'month' | 'all'): string {
  const from = new Date(); from.setDate(from.getDate() - 29);
  const list = (range === 'month' ? entries.filter(e => (e.day || dayKey(new Date(e.createdAt))) >= dayKey(from)) : entries)
    .slice().sort((a, b) => a.createdAt - b.createdAt);
  const first = list[0]?.day, last = list[list.length - 1]?.day;
  const rangeText = range === 'month' ? 'The last 30 days' : 'Everything';
  const span = first ? longDate(first) + (last && last !== first ? ' to ' + longDate(last) : '') : 'No entries yet';
  const rows = list.map(e => {
    const parts: string[] = [];
    parts.push('<h2>' + plain(longDate(e.day) + ', ' + fmtTime(e.createdAt)) + ' &middot; ' + KIND[e.kind] + '</h2>');
    if (e.moods?.length) parts.push('<p><b>Feelings:</b> ' + plain(e.moods.map(m => m.label + (m.band ? ' (' + BAND_BY[m.band].name + ')' : '')).join(', ')) + '</p>');
    if (e.nuance?.length) parts.push('<p><b>Named more exactly:</b> ' + plain(e.nuance.map(m => m.label).join(', ')) + '</p>');
    for (const tp of e.topics || []) {
      const T = TOPIC_BY[tp.key];
      const bits: string[] = [];
      if (tp.picks?.length) bits.push(plain(tp.picks.map(p => p.label).join(', ')));
      if (tp.note) bits.push(plain(tp.note));
      if (tp.todos?.length) bits.push('<ul>' + tp.todos.map(td => '<li>' + (td.done ? '[done] ' : '[not done] ') + plain(td.t) + '</li>').join('') + '</ul>');
      parts.push('<p><b>' + plain(T ? T.name : tp.key) + ':</b> ' + bits.join('<br>') + '</p>');
    }
    if (e.text) parts.push('<p><b>' + (e.kind === 'voice' ? 'What I said' : 'Writing') + ':</b><br>' + plain(e.text) + '</p>');
    if (e.reflection) parts.push('<p><b>Reflection:</b><br>' + plain(e.reflection) + '</p>');
    return '<section>' + parts.join('') + '</section>';
  }).join('');
  return `<!doctype html><html><head><meta charset="utf-8"><style>
    body { font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 12pt; line-height: 1.5; color: #000; background: #fff; margin: 0; }
    h1 { font-size: 20pt; margin: 0 0 4pt; } h2 { font-size: 13pt; margin: 18pt 0 4pt; }
    p, ul { margin: 0 0 6pt; } .meta { color: #000; margin: 0 0 2pt; }
    section { page-break-inside: avoid; border-top: 1px solid #000; padding-top: 4pt; }
  </style></head><body>
    <h1>Lexi journal</h1>
    <p class="meta">${esc(rangeText)}: ${plain(span)}</p>
    <p class="meta">Made with Lexi</p>
    ${rows || '<p>No entries in this time.</p>'}
  </body></html>`;
}
