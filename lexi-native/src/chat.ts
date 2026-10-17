// The Home chat log: the same say / ask / card queue as lexi.html, held outside React so the
// conversation script (script.ts) can be plain async code.
import { useSyncExternalStore } from 'react';
import { AccessibilityInfo } from 'react-native';
import type { Option } from './content';
import { state } from './store';
import { speak } from './speech';
import { sleep } from './text';

export type CardKind = 'choices' | 'legend' | 'mood' | 'topics' | 'topicAnswer';
export type ChatItem =
  | { id: string; type: 'bot'; text: string; info?: boolean }
  | { id: string; type: 'me'; text: string }
  | { id: string; type: 'typing' }
  | { id: string; type: 'card'; card: CardKind; props: any; done: boolean; picked?: number; finish: (v: unknown, picked?: number) => void };

let items: ChatItem[] = [];
let version = 0;
const listeners = new Set<() => void>();
const emit = () => { version++; listeners.forEach(l => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };
export function useChatItems(): ChatItem[] { useSyncExternalStore(subscribe, () => version); return items; }

let uid = 0;
export const nextId = (p = 'c') => p + '-' + (++uid);

export let reduceMotion = false;
AccessibilityInfo.isReduceMotionEnabled().then(v => { reduceMotion = v; }).catch(() => {});
AccessibilityInfo.addEventListener('reduceMotionChanged', v => { reduceMotion = v; });

function push(item: ChatItem) { items = [...items, item]; emit(); }
function remove(id: string) { items = items.filter(i => i.id !== id); emit(); }
function patch(id: string, p: Partial<ChatItem>) { items = items.map(i => (i.id === id ? ({ ...i, ...p } as ChatItem) : i)); emit(); }

export function showTyping(): () => void {
  const id = nextId('t');
  push({ id, type: 'typing' });
  return () => remove(id);
}
/** `quiet` skips read-aloud for lines the caller reads out together. */
export function addBot(text: string, opts: { info?: boolean; quiet?: boolean } = {}) {
  push({ id: nextId('b'), type: 'bot', text, info: opts.info });
  if (state.settings.autoread && !opts.quiet) speak(text, { queue: true });
}
export function addMe(text: string) { push({ id: nextId('m'), type: 'me', text }); }

/** Put a card in the log and wait until it calls finish(). The card then locks, as in lexi.html. */
export function addCard<T>(card: CardKind, props: object = {}, lockOnFinish = true): Promise<T> {
  return new Promise<T>(res => {
    const id = nextId('k');
    push({
      id, type: 'card', card, props, done: false,
      finish: (v, picked) => { if (lockOnFinish) patch(id, { done: true, picked }); res(v as T); },
    });
  });
}

const delayFor = (t: string) => (reduceMotion ? 150 : Math.min(1300, 380 + [...String(t)].length * 14));
export let sayQueue: Promise<void> = Promise.resolve();
export function say(text: string, opts?: { info?: boolean }): Promise<void> {
  sayQueue = sayQueue.then(async () => { const done = showTyping(); await sleep(delayFor(text)); done(); addBot(text, opts); });
  return sayQueue;
}
export async function sayMany(lines: string[]) { for (const l of lines) await say(l); }

export function ask<T>(text: string, options: Option<T>[], yn = false): Promise<T> {
  return say(text).then(() => addCard<T>('choices', { options, yn }));
}
