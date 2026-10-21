// App state plus on-device storage.
// Entries live in SQLite (lexi.db). Settings, custom words, the onboarding flag and the free-write draft
// live in expo-sqlite's key-value store. The optional Claude API key lives in the OS keychain (SecureStore).
import { useSyncExternalStore } from 'react';
import * as SQLite from 'expo-sqlite';
import Storage from 'expo-sqlite/kv-store';
import * as SecureStore from 'expo-secure-store';
import { File } from 'expo-file-system';
import { DEFAULTS, HIGHLIGHTS, LETTERS, PACES, PITCH_RANGE, RATE_RANGE, SIZES, type Pick, type Settings } from './content';
import { COUNTRY_KEYS, defaultCountry } from './safety';

export type Todo = { t: string; done: boolean };
export type TopicAnswer = { key: string; picks: Pick[]; note: string; todos: Todo[] };
export type Entry = {
  id: string; kind: 'guided' | 'free' | 'voice'; createdAt: number; day: string;
  moods: Pick[]; topics: TopicAnswer[]; text: string; reflection?: string;
  /** The words as first written, kept when ✨ Tidy changed them (FEATURES_DO_NEXT §12). */
  original?: string;
  /** "Name it more" picks (FEATURES_SOON §12). */
  nuance?: Pick[];
  /** Voice entries (FEATURES_SOON §4): the kept recording's file uri; `text` is the transcript. */
  audio?: string;
};
/** The unfinished guided check-in (FEATURES_SOON §6), saved after every step. */
export type CheckinDraft = { step: string; moods: Pick[]; nuance: Pick[] | null; keys: string[] | null; answers: Record<string, TopicAnswer | null> };
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
  voiceOpen: boolean;   // the 🎙️ Speak an entry sheet
  helpOpen: boolean;    // the 🆘 Help sheet
  sending: boolean;     // a chat reply is in flight (send button becomes Stop)
  toast: { msg: string; n: number } | null;
};

const KEYS = { settings: 'lexi.settings', custom: 'lexi.custom', onboarded: 'lexi.onboarded', draft: 'lexi.draft', checkin: 'lexi.checkin', apiKey: 'lexi.apiKey' };

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
  if (!(s.size in SIZES)) s.size = 'm';
  if (!(s.letters in LETTERS)) s.letters = 'normal';
  if (!(s.highlight in HIGHLIGHTS)) s.highlight = 'auto';
  if (!(s.pace in PACES)) s.pace = 'auto';
  s.reminders = { ...DEFAULTS.reminders, ...(rest.reminders || {}) };
  // The country for crisis lines starts from the phone's region (en-GB → GB) the first time.
  if (!rest.country || !COUNTRY_KEYS.includes(s.country)) s.country = defaultCountry();
  s.rate = clamp(Number(s.rate) || DEFAULTS.rate, RATE_RANGE);
  s.pitch = clamp(Number(s.pitch) || DEFAULTS.pitch, PITCH_RANGE);
  if (accent || mode || !rest.country) writeKv(KEYS.settings, s);
  return s;
}
const THEME_KEYS: Settings['theme'][] = ['auto', 'orange', 'purple', 'mint', 'cream', 'night', 'ember'];
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
  voiceOpen: false,
  helpOpen: false,
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
export function setVoiceSheet(open: boolean) { state.voiceOpen = open; emit(); }
export function setHelp(open: boolean) { state.helpOpen = open; emit(); }
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
/** A voice entry's recording goes when its entry goes. */
function deleteAudio(uri?: string) {
  if (!uri) return;
  try { const f = new File(uri); if (f.exists) f.delete(); } catch (e) { console.warn('audio delete', e); }
}
export async function removeEntry(id: string) {
  const gone = state.entries.find(e => e.id === id);
  state.entries = state.entries.filter(e => e.id !== id); emit();
  deleteAudio(gone?.audio);
  try { await db?.runAsync('DELETE FROM entries WHERE id = ?', id); }
  catch (e) { console.warn(e); toast("Couldn't delete that entry. Try again."); }
}
export async function removeAllEntries() {
  const gone = state.entries;
  state.entries = []; emit();
  gone.forEach(e => deleteAudio(e.audio));
  try { await db?.runAsync('DELETE FROM entries'); }
  catch (e) { console.warn(e); toast("Couldn't delete all entries. Try again."); }
}

/* ---------- the unfinished check-in (FEATURES_SOON §6) ---------- */
export const loadCheckin = (): CheckinDraft | null => readKv<CheckinDraft | null>(KEYS.checkin, null);
export const saveCheckin = (d: CheckinDraft) => writeKv(KEYS.checkin, d);
export const clearCheckin = () => { Storage.removeItem(KEYS.checkin).catch(() => {}); };

/** 🗑️ Delete everything (FEATURES_SOON §8): entries and recordings, settings, my own words, both drafts.
 *  The onboarding flag and the optional API key are kept. */
export async function deleteEverything() {
  await removeAllEntries();
  state.settings = { ...DEFAULTS, country: defaultCountry() };
  state.custom = {};
  [KEYS.settings, KEYS.custom, KEYS.draft, KEYS.checkin].forEach(k => { Storage.removeItem(k).catch(() => {}); });
  emit();
}
