// The Home chat log: the same say / ask / card queue as lexi.html, held outside React so the
// conversation script (script.ts) can be plain async code.
import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { Option } from './content';
import { reduceMotion, savedHaptic } from './a11y';
import { state } from './store';
import { speak } from './speech';
import { sleep, speechKey } from './text';

/** `question` is a Lexi bubble with its Yes / No pills under the words.
 *  `actions` is the Home block: Guided check-in, Write on my own and the This week card.
 *  `crisis` is the help-lines card for the chosen country (`emergencyOnly` shows just the emergency number). */
export type CardKind = 'question' | 'choices' | 'actions' | 'legend' | 'mood' | 'nuance' | 'topics' | 'topicAnswer' | 'recap' | 'quickstart' | 'crisis';
export type ChatItem =
  /** `saved` is the "Saved to your journal." moment: a slower fade and one light haptic (DESIGN_WARM_PAPER §6). */
  | { id: string; type: 'bot'; text: string; info?: boolean; saved?: boolean }
  /** `emoji` set: the answer shows as huge emoji with a small caption and no bubble. */
  | { id: string; type: 'me'; text: string; emoji?: string[]; caption?: string }
  /** The Thinking row: the butterfly with folded wings and "Thinking…" (§8). */
  | { id: string; type: 'thinking' }
  /** The Home welcome block: the big butterfly and the greeting (§10). */
  | { id: string; type: 'welcome'; greeting: string }
  /** "I tap for next" pace (FEATURES_SOON §7): the ▸ Next pill under a bubble when Lexi has more to say. */
  | { id: string; type: 'next'; go: () => void }
  | { id: string; type: 'card'; card: CardKind; props: any; finish: (v: unknown) => void };

let items: ChatItem[] = [];
let version = 0;
const listeners = new Set<() => void>();
const emit = () => { version++; listeners.forEach(l => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export function useChatItems(): ChatItem[] { useSyncExternalStore(subscribe, () => version); return items; }

let uid = 0;
export const nextId = (p = 'c') => p + '-' + (++uid);

function push(item: ChatItem) { items = [...items, item]; emit(); }
function remove(id: string) { items = items.filter(i => i.id !== id); emit(); }
function replace(id: string, next: ChatItem) { items = items.map(i => (i.id === id ? next : i)); emit(); }
/** Whether a card of this kind is still waiting in the chat. */
export const hasCard = (kind: CardKind) => items.some(i => i.type === 'card' && i.card === kind);
/** Take waiting cards of one kind out of the chat (their promises are simply left unanswered). */
export function dropCards(kind: CardKind) {
  if (hasCard(kind)) { items = items.filter(i => !(i.type === 'card' && i.card === kind)); emit(); }
}

/** Screen readers hear each new Lexi line once; focus never moves (§9). */
function announce(text: string) {
  const words = speechKey(text);
  if (words) AccessibilityInfo.announceForAccessibility('Lexi says: ' + words);
}

/** The Thinking row while Lexi works out a reply. */
export function showThinking(): () => void {
  const id = nextId('t');
  push({ id, type: 'thinking' });
  return () => remove(id);
}
/** The welcome block, first in the chat when the app opens. */
export function addWelcome(greeting: string) { push({ id: nextId('w'), type: 'welcome', greeting }); }
/** `quiet` skips read-aloud for lines the caller reads out together. Reading targets the bubble, for its
 *  ring and word highlight. */
export function addBot(text: string, opts: { info?: boolean; quiet?: boolean; saved?: boolean } = {}) {
  const id = nextId('b');
  push({ id, type: 'bot', text, info: opts.info, saved: opts.saved });
  announce(text);
  if (opts.saved) savedHaptic();
  if (state.settings.autoread && !opts.quiet) speak(text, { queue: true, target: id });
}
export function addMe(text: string) { push({ id: nextId('m'), type: 'me', text }); }
/** An answer made of emoji picks: shown huge, with the words as a caption. */
export function addMeEmoji(emoji: string[], caption: string) {
  push({ id: nextId('m'), type: 'me', text: caption, emoji, caption });
}

/** Put a card in the log and wait until it calls finish(). A finished card folds away (§9): it leaves the chat and
 *  only the answer row stays. A question keeps Lexi's words as a plain bubble; its buttons go. */
export function addCard<T>(card: CardKind, props: object = {}, id = nextId('k')): Promise<T> {
  return new Promise<T>(res => {
    let done = false;
    push({
      id, type: 'card', card, props,
      finish: v => {
        if (done) return;
        done = true;
        if (card === 'question') replace(id, { id, type: 'bot', text: (props as { text: string }).text });
        else remove(id);
        res(v as T);
      },
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
/** Wait before Lexi's next line, by the Message pace setting (§7): "Lexi decides" thinks for a moment (or ~150 ms
 *  with no Thinking row under Reduce Motion), "I tap for next" waits for ▸ Next when she's mid-run, "All at once"
 *  doesn't wait. */
async function pause(text: string) {
  const pace = state.settings.pace;
  if (pace === 'fast') return;
  if (pace === 'tap') {
    if (items[items.length - 1]?.type === 'bot') await waitForNext();
    return;
  }
  if (reduceMotion) { await sleep(150); return; }
  const done = showThinking(); await sleep(delayFor(text)); done();
}
export let sayQueue: Promise<void> = Promise.resolve();
export function say(text: string, opts?: { info?: boolean; saved?: boolean }): Promise<void> {
  sayQueue = sayQueue.then(async () => { await pause(text); addBot(text, opts); });
  return sayQueue;
}
export async function sayMany(lines: string[]) { for (const l of lines) await say(l); }

/** Lexi asks, and the answer pills sit under her words. */
export function ask<T>(text: string, options: Option<T>[], yn = false): Promise<T> {
  sayQueue = sayQueue.then(() => pause(text));
  return sayQueue.then(() => {
    const id = nextId('k');
    const answer = addCard<T>('question', { text, options, yn }, id);
    announce(text);
    if (state.settings.autoread) speak(text, { queue: true, target: id });
    return answer;
  });
}
