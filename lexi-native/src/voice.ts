// 🎙 Voice to text (Miro board, Screens 11-15: the mic sits beside 🙂 in the composer).
// Uses the phone's own speech recognizer through expo-speech-recognition. That library is native code that
// Expo Go doesn't include, so it is loaded as optional: in Expo Go the mic explains it needs a dev build.
import { useSyncExternalStore } from 'react';
import { requireOptionalNativeModule } from 'expo';
import type { ExpoSpeechRecognitionErrorEvent, ExpoSpeechRecognitionResultEvent } from 'expo-speech-recognition';
import { BANDS, TOPICS } from './content';
import { state, toast } from './store';
import { stopSpeaking } from './speech';

type SRModule = typeof import('expo-speech-recognition').ExpoSpeechRecognitionModule;
const SR: SRModule | null = requireOptionalNativeModule('ExpoSpeechRecognition')
  ? (require('expo-speech-recognition') as typeof import('expo-speech-recognition')).ExpoSpeechRecognitionModule
  : null;

/** What the mic types into. `continuous` keeps listening through pauses until the person taps stop. */
export type VoiceTarget = { id: string; getText: () => string; setText: (t: string) => void; continuous?: boolean };

let active: VoiceTarget | null = null;
let base = '', committed = '', interim = '';
let ending = false;
// Better dictation (FEATURES_DO_NEXT §14): on-device when the phone supports it, with one quiet retry without it.
let onDeviceSession = false, gotResult = false, retryWithoutOnDevice = false;

/** Feeling and topic words plus the person's own words, so the recognizer expects them (max 100). */
function vocabulary(): string[] {
  const words = new Set<string>();
  BANDS.forEach(b => b.items.forEach(([, l]) => words.add(l)));
  TOPICS.forEach(tp => { words.add(tp.name); (tp.opts || []).forEach(([, l]) => words.add(l)); });
  Object.values(state.custom).forEach(list => (list || []).forEach(m => m.label && words.add(m.label)));
  return [...words].filter(w => w.length > 1).slice(0, 100);
}
function startSession(sr: SRModule, onDevice: boolean) {
  onDeviceSession = onDevice; gotResult = false;
  sr.start({
    lang: 'en-US', interimResults: true, continuous: !!active?.continuous, addsPunctuation: true, iosTaskHint: 'dictation',
    requiresOnDeviceRecognition: onDevice, contextualStrings: vocabulary(),
  });
}
function supportsOnDevice(sr: SRModule): boolean {
  try { return !!sr.supportsOnDeviceRecognition(); } catch { return false; }
}
let endWaiters: (() => void)[] = [];
let version = 0;
const listeners = new Set<() => void>();
const emit = () => { version++; listeners.forEach(l => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

/** id of the field the mic is typing into right now, or null. */
export function useListeningId(): string | null {
  useSyncExternalStore(subscribe, () => version);
  return active ? active.id : null;
}

const join = (a: string, b: string) => (!a ? b : !b ? a : a + (/\s$/.test(a) ? '' : ' ') + b);
function write() { if (active) active.setText(join(base, join(committed, interim))); }
/** A stopped session still sends `end` a moment later; wait for it before starting the next one. */
const waitForEnd = () => new Promise<void>(r => { endWaiters.push(r); setTimeout(r, 1500); });

let wired = false;
function wire(sr: SRModule) {
  if (wired) return;
  wired = true;
  sr.addListener('result', (ev: ExpoSpeechRecognitionResultEvent) => {
    const t = (ev.results[0]?.transcript || '').trim();
    if (t) gotResult = true;
    // iOS sends one growing transcript; Android sends a final result per segment, then starts a new one.
    if (ev.isFinal) { committed = join(committed, t); interim = ''; } else interim = t;
    write();
  });
  sr.addListener('error', (ev: ExpoSpeechRecognitionErrorEvent) => {
    const m: Record<string, string> = {
      'no-speech': "I didn't hear anything. Tap 🎙 and try again.",
      'speech-timeout': "I didn't hear anything. Tap 🎙 and try again.",
      'not-allowed': 'Lexi needs the microphone to hear you. Turn it on in your phone settings. 🎙',
      'network': 'Voice typing needs the internet on this phone. 🔌',
      'language-not-supported': "Voice typing can't do English on this phone yet. 🎙",
      'service-not-allowed': "Voice typing isn't turned on for this phone. 🎙",
      'busy': 'Voice typing is busy. Try again in a moment. 🎙',
    };
    // On-device models can be missing or fail to start: try again once with the phone's normal recognizer.
    if (onDeviceSession && !gotResult && active && !ending && ev.error !== 'aborted' && ev.error !== 'not-allowed' && ev.error !== 'no-speech' && ev.error !== 'speech-timeout') {
      retryWithoutOnDevice = true;
      return;
    }
    if (ev.error !== 'aborted') toast(m[ev.error] || 'Voice typing stopped. Try again. 🎙');
  });
  sr.addListener('end', () => {
    if (retryWithoutOnDevice && active) {
      retryWithoutOnDevice = false;
      try { startSession(sr, false); return; } catch (e) { console.warn('voice retry', e); }
    }
    retryWithoutOnDevice = false;
    interim = ''; active = null; ending = false;
    endWaiters.splice(0).forEach(f => f());
    emit();
  });
}

function halt(sr: SRModule, keepWords: boolean) {
  ending = true;
  if (keepWords) sr.stop(); else sr.abort();
}

export async function toggleVoice(target: VoiceTarget) {
  if (!SR) { toast("Voice typing needs Lexi's development build. It doesn't run in Expo Go. 🎙"); return; }
  if (active && active.id === target.id) { halt(SR, true); return; }
  try {
    if (!SR.isRecognitionAvailable()) { toast("Voice typing isn't available on this phone. 🎙"); return; }
    const perm = await SR.requestPermissionsAsync();
    if (!perm.granted) { toast('Lexi needs the microphone to hear you. Turn it on in your phone settings. 🎙'); return; }
    wire(SR);
    if (active) { const w = waitForEnd(); halt(SR, false); await w; }
    else if (ending) await waitForEnd();
    stopSpeaking(); // don't let the recognizer hear Lexi reading aloud
    base = target.getText(); committed = ''; interim = '';
    active = target; emit();
    startSession(SR, supportsOnDevice(SR));
  } catch (e) {
    console.warn('voice', e);
    active = null; emit();
    toast('Voice typing stopped. Try again. 🎙');
  }
}

/** Stop listening and drop words still being worked out (on send, closing the sheet, unmount). */
export function stopVoice(id?: string) {
  if (!SR || !active || (id && active.id !== id)) return;
  halt(SR, false);
  active = null; emit();
}
