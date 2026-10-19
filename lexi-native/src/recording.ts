// ▶ Playing back a voice entry's recording (FEATURES_SOON §4). One recording plays at a time.
import { useEffect, useSyncExternalStore } from 'react';
import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import { File } from 'expo-file-system';
import { stopSpeaking } from './speech';
import { toast } from './store';

let player: AudioPlayer | null = null;
let playingUri: string | null = null;
let version = 0;
const listeners = new Set<() => void>();
const emit = () => { version++; listeners.forEach(l => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l); }; };

export function stopRecordingPlayback() {
  if (player) { try { player.pause(); player.remove(); } catch {} }
  player = null; playingUri = null; emit();
}

export function playRecording(uri: string) {
  stopRecordingPlayback();
  stopSpeaking();
  try {
    if (!new File(uri).exists) { toast("I can't find that recording on this phone."); return; }
    const p = createAudioPlayer(uri);
    player = p; playingUri = uri; emit();
    const sub = p.addListener('playbackStatusUpdate', st => {
      if (st.didJustFinish && player === p) { sub.remove(); stopRecordingPlayback(); }
    });
    p.play();
  } catch (e) {
    console.warn('playback', e);
    stopRecordingPlayback();
    toast("I couldn't play that recording.");
  }
}

/** ▶ / ⏹️ state for one recording. */
export function usePlayback(uri?: string) {
  useSyncExternalStore(subscribe, () => version);
  const playing = !!uri && playingUri === uri;
  return { playing, toggle: () => { if (!uri) return; if (playing) stopRecordingPlayback(); else playRecording(uri); } };
}

/** Stop playback when a screen that started it goes away. */
export function useStopPlaybackOnUnmount() {
  useEffect(() => () => stopRecordingPlayback(), []);
}

export function deleteRecording(uri?: string | null) {
  if (!uri) return;
  try { const f = new File(uri); if (f.exists) f.delete(); } catch (e) { console.warn('recording delete', e); }
}
