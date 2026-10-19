// The Home chat log: the same say / ask / card queue as lexi.html, held outside React so the
// conversation script (script.ts) can be plain async code.
import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { Option } from './content';
import { emit as emitStore, state } from './store';
import { speak } from './speech';
import { sleep, stripEmoji } from './text';

/** `question` is a bot bubble with its answer pills inside (Yes / No on Screens 11-13).
 *  `crisis` is the help-lines card for the chosen country (`emergencyOnly` shows just the emergency number). */
export type CardKind = 'question' | 'choices' | 'legend' | 'mood' | 'nuance' | 'topics' | 'topicAnswer' | 'recap' | 'quickstart' | 'crisis';
export type ChatItem =
  | { id: string; type: 'bot'; text: string; info?: boolean }
  /** `emoji` set: the answer shows as huge emoji with a small caption and no bubble. */
  | { id: string; type: 'me'; text: string; emoji?: string[]; caption?: string }
  | { id: string; type: 'typing' }
  /** "I tap for next" pace (FEATURES_SOON §7): the ▸ Next pill under a bubble when Lexi has more to say. */
  | { id: string; type: 'next'; go: () => void }
  | { id: string; type: 'card'; card: CardKind; props: any; done: boolean; picked?: number; finish: (v: unknown, picked?: number) => void };

let items: ChatItem[] = [];
let version = 0;
const listeners = new Set<() => void>();
const emit = () => { version++; listeners.forEach(l => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export function useChatItems(): ChatItem[] { useSyncExternalStore(subscribe, () => version); return items; }

let uid = 0;
export const nextId = (p = 'c') => p + '-' + (++uid);

/** The phone's Reduce Motion setting (FEATURES_DO_NEXT §4): no typing dots, no pop-in, no celebration rows. */
export let reduceMotion = false;
const setReduceMotion = (v: boolean) => { reduceMotion = v; emit(); emitStore(); };
AccessibilityInfo.isReduceMotionEnabled().then(setReduceMotion).catch(() => {});
AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);

function push(item: ChatItem) { items = [...items, item]; emit(); }
function remove(id: string) { items = items.filter(i => i.id !== id); emit(); }
function patch(id: string, p: Partial<ChatItem>) { items = items.map(i => (i.id === id ? ({ ...i, ...p } as ChatItem) : i)); emit(); }

/** "Lexi is typing" while she waits for the chat brain. Under Reduce Motion it's a still line, not dots. */
export function showTyping(): () => void {
  const id = nextId('t');
  push({ id, type: 'typing' });
  return () => remove(id);
}
/** `quiet` skips read-aloud for lines the caller reads out together. Reading targets the bubble, for its
 *  ring and word highlight. */
export function addBot(text: string, opts: { info?: boolean; quiet?: boolean } = {}) {
  const id = nextId('b');
  push({ id, type: 'bot', text, info: opts.info });
  if (state.settings.autoread && !opts.quiet) speak(text, { queue: true, target: id });
}
export function addMe(text: string) { push({ id: nextId('m'), type: 'me', text }); }
/** An answer made of emoji picks: shown huge, with the words as a caption. */
export function addMeEmoji(emoji: string[], caption: string) {
  push({ id: nextId('m'), type: 'me', text: caption, emoji, caption });
}

/** Put a card in the log and wait until it calls finish(). The card then locks, as in lexi.html. */
export function addCard<T>(card: CardKind, props: object = {}, lockOnFinish = true, id = nextId('k')): Promise<T> {
  return new Promise<T>(res => {
    push({
      id, type: 'card', card, props, done: false,
      finish: (v, picked) => { if (lockOnFinish) patch(id, { done: true, picked }); res(v as T); },
    });
  });
}

const delayFor = (t: string) => Math.min(1300, 380 + [...String(t)].length * 14);
/** Wait for a tap on ▸ Next under Lexi's last bubble. */
function waitForNext(): Promise<void> {
  return new Promise(res => {
    const id = nextId('n');
    push({ id, type: 'next', go: () => { remove(id); res(); } });
  });
}
/** Wait before Lexi's next line, by the Message pace setting (§7): "Lexi decides" types for a moment (or ~150 ms
 *  with no dots under Reduce Motion), "I tap for next" waits for ▸ Next when she's mid-run, "All at once" doesn't wait. */
async function pause(text: string) {
  const pace = state.settings.pace;
  if (pace === 'fast') return;
  if (pace === 'tap') {
    if (items[items.length - 1]?.type === 'bot') await waitForNext();
    return;
  }
  if (reduceMotion) { await sleep(150); return; }
  const done = showTyping(); await sleep(delayFor(text)); done();
}
export let sayQueue: Promise<void> = Promise.resolve();
export function say(text: string, opts?: { info?: boolean }): Promise<void> {
  sayQueue = sayQueue.then(async () => {
    // Celebration rows (👏🏽 / 🎉, emoji only) are left out under Reduce Motion.
    if (reduceMotion && !stripEmoji(text)) return;
    await pause(text); addBot(text, opts);
  });
  return sayQueue;
}
export async function sayMany(lines: string[]) { for (const l of lines) await say(l); }

/** Lexi asks, and the answer pills sit inside her bubble. */
export function ask<T>(text: string, options: Option<T>[], yn = false): Promise<T> {
  sayQueue = sayQueue.then(() => pause(text));
  return sayQueue.then(() => {
    const id = nextId('k');
    const answer = addCard<T>('question', { text, options, yn }, true, id);
    if (state.settings.autoread) speak(text, { queue: true, target: id });
    return answer;
  });
}
