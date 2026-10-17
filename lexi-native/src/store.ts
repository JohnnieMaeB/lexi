// App state plus on-device storage.
// Entries live in SQLite (lexi.db). Settings, custom words, the onboarding flag and the free-write draft
// live in expo-sqlite's key-value store. The optional Claude API key lives in the OS keychain (SecureStore).
import { useSyncExternalStore } from 'react';
import * as SQLite from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';
import * as SecureStore from 'expo-secure-store';
import { DEFAULTS, PITCH_RANGE, RATE_RANGE, type Pick, type Settings } from './content';

export type Todo = { t: string; done: boolean };
export type TopicAnswer = { key: string; picks: Pick[]; note: string; todos: Todo[] };
export type Entry = {
  id: string; kind: 'guided' | 'free'; createdAt: number; day: string;
  moods: Pick[]; topics: TopicAnswer[]; text: string; reflection?: string;
};
export type NewEntry = Omit<Entry, 'id'>;
export type Custom = Record<string, Pick[]>;
export type View = 'home' | 'journal' | 'settings';

type State = {
  loaded: boolean;
  entries: Entry[];
  settings: Settings;
  custom: Custom;
  onboarded: boolean;
  apiKey: string | null;
  aiOk: boolean;        // false after the key is rejected, until a new key is saved
  view: View;
  sheetOpen: boolean;
  sending: boolean;     // a chat reply is in flight (send button becomes Stop)
  toast: { msg: string; n: number } | null;
};

const KEYS = { settings: 'lexi.settings', custom: 'lexi.custom', onboarded: 'lexi.onboarded', draft: 'lexi.draft', apiKey: 'lexi.apiKey' };

function readKv<T>(k: string, d: T): T {
  try { const v = Storage.getItemSync(k); return v == null ? d : (JSON.parse(v) as T); } catch { return d; }
}
function writeKv(k: string, v: unknown) {
  Storage.setItem(k, JSON.stringify(v)).catch(e => console.warn('kv save', k, e));
}

/** Older builds stored `accent` (orange / purple / mint) and `mode` (auto / light / dark) instead of `theme`. */
function loadSettings(): Settings {
  const raw = readKv<Partial<Settings> & { accent?: string; mode?: string }>(KEYS.settings, {}) || {};
  const { accent, mode, ...rest } = raw;
  const s: Settings = { ...DEFAULTS, ...rest };
  if (!rest.theme && (accent || mode)) {
    const a = accent === 'purple' || accent === 'mint' ? accent : 'orange';
    s.theme = mode === 'dark' ? 'ember' : mode === 'light' ? a : a === 'orange' ? 'auto' : a;
  }
  if (!THEME_KEYS.includes(s.theme)) s.theme = 'auto';
  s.rate = clamp(Number(s.rate) || DEFAULTS.rate, RATE_RANGE);
  s.pitch = clamp(Number(s.pitch) || DEFAULTS.pitch, PITCH_RANGE);
  if (accent || mode) writeKv(KEYS.settings, s);
  return s;
}
const THEME_KEYS: Settings['theme'][] = ['auto', 'orange', 'purple', 'mint', 'night', 'ember'];
const clamp = (v: number, [lo, hi]: readonly [number, number]) => Math.min(hi, Math.max(lo, v));

export const state: State = {
  loaded: false,
  entries: [],
  settings: loadSettings(),
  custom: readKv<Custom>(KEYS.custom, {}) || {},
  onboarded: !!readKv(KEYS.onboarded, false),
  apiKey: null,
  aiOk: true,
  view: 'home',
  sheetOpen: false,
  sending: false,
  toast: null,
};

let version = 0;
const listeners = new Set<() => void>();
export function emit() { version++; listeners.forEach(l => { try { l(); } catch (e) { console.error(e); } }); }
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
/** Re-render on any state change. The app is small enough that one shared version counter is fine. */
export function useLexi(): State { useSyncExternalStore(subscribe, () => version); return state; }

/* ---------- profile ---------- */
export function setSetting<K extends keyof Settings>(k: K, v: Settings[K]) {
  state.settings = { ...state.settings, [k]: v };
  writeKv(KEYS.settings, state.settings); emit();
}
export function setOnboarded() { state.onboarded = true; writeKv(KEYS.onboarded, true); emit(); }
export function addCustom(group: string, m: Pick) {
  state.custom = { ...state.custom, [group]: [...(state.custom[group] || []), m] };
  writeKv(KEYS.custom, state.custom); emit();
}
export function removeCustom(group: string, i: number) {
  state.custom = { ...state.custom, [group]: (state.custom[group] || []).filter((_, j) => j !== i) };
  writeKv(KEYS.custom, state.custom); emit();
}
export const loadDraft = () => readKv<string>(KEYS.draft, '') || '';
export const saveDraft = (t: string) => writeKv(KEYS.draft, t);
export const clearDraft = () => { Storage.removeItem(KEYS.draft).catch(() => {}); };

/* ---------- Claude API key (optional) ---------- */
export async function setApiKey(key: string | null) {
  const k = key && key.trim() ? key.trim() : null;
  try {
    if (k) await SecureStore.setItemAsync(KEYS.apiKey, k);
    else await SecureStore.deleteItemAsync(KEYS.apiKey);
  } catch (e) { console.warn('secure store', e); }
  state.apiKey = k; state.aiOk = true; emit();
}
export function markKeyRejected() { state.aiOk = false; emit(); }
export const aiReady = () => !!state.apiKey && state.aiOk;

/* ---------- ui ---------- */
let toastTimer: ReturnType<typeof setTimeout> | null = null;
export function toast(msg: string) {
  state.toast = { msg, n: (state.toast?.n || 0) + 1 }; emit();
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { state.toast = null; emit(); }, 3200);
}
export function showView(v: View) { state.view = v; emit(); }
export function setSheet(open: boolean) { state.sheetOpen = open; emit(); }
export function setSending(on: boolean) { state.sending = on; emit(); }

/* ---------- journal entries (SQLite) ---------- */
let db: SQLite.SQLiteDatabase | null = null;
let readyResolve!: () => void;
export const ready = new Promise<void>(r => { readyResolve = r; });
const sortEntries = (es: Entry[]) => [...es].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
const newId = () => 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export async function initStore() {
  try { state.apiKey = await SecureStore.getItemAsync(KEYS.apiKey); } catch (e) { console.warn('secure store', e); }
  try {
    db = await SQLite.openDatabaseAsync('lexi.db');
    await db.execAsync(`PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS entries (id TEXT PRIMARY KEY NOT NULL, created_at INTEGER NOT NULL, day TEXT NOT NULL, data TEXT NOT NULL);`);
    const rows = await db.getAllAsync<{ id: string; data: string }>('SELECT id, data FROM entries ORDER BY created_at DESC');
    state.entries = rows.flatMap(r => { try { return [{ ...(JSON.parse(r.data) as NewEntry), id: r.id }]; } catch { return []; } });
  } catch (e) {
    console.warn('db open', e);
    toast("Couldn't open your saved journal. New entries may not be kept.");
  }
  state.loaded = true; emit(); readyResolve();
}

export async function addEntry(entry: NewEntry): Promise<string> {
  await ready;
  const id = newId();
  state.entries = sortEntries([{ ...entry, id }, ...state.entries]); emit();
  try {
    if (!db) throw new Error('no db');
    await db.runAsync('INSERT INTO entries (id, created_at, day, data) VALUES (?, ?, ?, ?)', id, entry.createdAt, entry.day, JSON.stringify(entry));
  } catch (e) { console.warn('save failed', e); toast("Couldn't save that on this phone. Try again."); }
  return id;
}
export async function updateEntry(id: string, patch: Partial<NewEntry>) {
  const cur = state.entries.find(e => e.id === id);
  if (!cur) return;
  const next = { ...cur, ...patch };
  state.entries = state.entries.map(e => (e.id === id ? next : e)); emit();
  try {
    const { id: _id, ...data } = next;
    await db?.runAsync('UPDATE entries SET data = ? WHERE id = ?', JSON.stringify(data), id);
  } catch (e) { console.warn(e); toast("Couldn't save that change. Try again."); }
}
export async function removeEntry(id: string) {
  state.entries = state.entries.filter(e => e.id !== id); emit();
  try { await db?.runAsync('DELETE FROM entries WHERE id = ?', id); }
  catch (e) { console.warn(e); toast("Couldn't delete that entry. Try again."); }
}
export async function removeAllEntries() {
  state.entries = []; emit();
  try { await db?.runAsync('DELETE FROM entries'); }
  catch (e) { console.warn(e); toast("Couldn't delete all entries. Try again."); }
}
