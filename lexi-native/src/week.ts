// Days and weeks for Home's "This week" card and the Journal's "Last two weeks" grid (DESIGN_WARM_PAPER §10).
// Plain logic with no React Native imports, so the logic tests can run it.
import { BAND_BY, type BandKey, type Pick } from './content';
import { dayKey } from './text';

type DayEntry = { day: string; createdAt: number; moods?: Pick[] };
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
export const SHORT_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** "Good morning" before 12:00, "Good afternoon" before 18:00, otherwise "Good evening". */
export function greeting(d = new Date()): string {
  const h = d.getHours();
  return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
}

/** Monday of the week that `d` is in, at midnight. */
export function mondayOf(d = new Date()): Date {
  const m = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
  return m;
}
/** This week, Monday to Sunday. */
export function thisWeek(now = new Date()): Date[] {
  const m = mondayOf(now);
  return Array.from({ length: 7 }, (_, i) => new Date(m.getFullYear(), m.getMonth(), m.getDate() + i));
}
/** Last week and this week, Monday to Sunday: 14 days, two rows. */
export function twoWeeks(now = new Date()): Date[] {
  const m = mondayOf(now);
  return Array.from({ length: 14 }, (_, i) => new Date(m.getFullYear(), m.getMonth(), m.getDate() - 7 + i));
}

/** The band with the most picks. A tie goes to the band picked most recently (entries come newest first). */
export function dominantBand(es: DayEntry[]): BandKey | null {
  const n: Record<BandKey, number> = { content: 0, stressed: 0, low: 0 };
  const order: BandKey[] = [];
  for (const e of es) for (const m of e.moods || []) if (m.band && m.band in n) { n[m.band]++; if (!order.includes(m.band)) order.push(m.band); }
  const best = Math.max(n.content, n.stressed, n.low);
  if (!best) return null;
  return order.find(b => n[b] === best) ?? null;
}

/** "Most days" over the two weeks: the band with the most picks, 'mixed' on a tie, null with no moods. */
export function mostDays(es: DayEntry[], days: Date[]): BandKey | 'mixed' | null {
  const keys = new Set(days.map(d => dayKey(d)));
  const n: Record<BandKey, number> = { content: 0, stressed: 0, low: 0 };
  for (const e of es) if (keys.has(e.day)) for (const m of e.moods || []) if (m.band && m.band in n) n[m.band]++;
  const best = Math.max(n.content, n.stressed, n.low);
  if (!best) return null;
  const top = (Object.keys(n) as BandKey[]).filter(b => n[b] === best);
  return top.length > 1 ? 'mixed' : top[0];
}

export type DayCell = { date: Date; key: string; today: boolean; future: boolean; entries: number; band: BandKey | null; label: string };
/** One day of a week grid, with its screen-reader label ("Tuesday 20 October: Calm, Thankful"). */
export function dayCell(date: Date, es: DayEntry[], now = new Date()): DayCell {
  const key = dayKey(date), todayKey = dayKey(now);
  const mine = es.filter(e => e.day === key);
  const moods = mine.flatMap(e => e.moods || []);
  const future = key > todayKey;
  const name = WEEKDAYS[date.getDay()] + ' ' + date.getDate() + ' ' + MONTHS[date.getMonth()];
  const what = future ? 'not yet' : moods.length ? [...new Set(moods.map(m => m.label))].join(', ')
    : mine.length ? (mine.length === 1 ? '1 entry, no feelings picked' : mine.length + ' entries, no feelings picked') : 'no entry';
  return { date, key, today: key === todayKey, future, entries: mine.length, band: dominantBand(mine), label: name + ': ' + what };
}

/** The band's name for "Most days" and the legend. */
export const bandName = (b: BandKey) => BAND_BY[b].name;
