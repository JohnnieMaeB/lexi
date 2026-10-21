// 🎙️ Speak an entry (FEATURES_SOON §4, native only): record yourself; Lexi keeps the audio and saves the
// dictated words next to it, so mistakes in the transcript don't matter. Saved as { kind: 'voice', audio, text, moods }.
import { useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { savedHaptic } from '../a11y';
import { say } from '../chat';
import { useField } from '../fields';
import { deleteRecording, usePlayback, useStopPlaybackOnUnmount } from '../recording';
import { checkSavedWriting, ensureActions, safetyFlow } from '../script';
import { addEntry, setVoiceSheet, showView, state, toast, useLexi } from '../store';
import { dayKey } from '../text';
import { R, useTheme } from '../theme';
import { Btn, Butterfly, Chip, Icon, Press, Row, T } from '../ui';
import { canKeepRecording, stopVoice, toggleVoice, useListeningId, voiceTypingAvailable, type VoiceTarget } from '../voice';
import { HelpPill, SpeakIcon } from './Help';
import { Box } from './Inputs';
import { MoodBox, type Selected } from './Pickers';
import { SheetFoot, SheetFrame, SheetHead } from './Sheet';

const INTRO = "Talk about anything. I keep your recording, so mistakes in the words don't matter.";

export function VoiceEntrySheet() {
  const st = useLexi();
  if (!st.voiceOpen) return null;
  return <Sheet />;
}

function Sheet() {
  const t = useTheme();
  const f = useField('');
  const [audio, setAudio] = useState<string | null>(null);
  const audioRef = useRef<string | null>(null);
  const saved = useRef(false);
  const [mood, setMood] = useState<Selected>({});
  const [saving, setSaving] = useState(false);
  const listening = useListeningId() === 'voice-entry';
  const play = usePlayback(audio || undefined);
  const keeps = canKeepRecording();
  useStopPlaybackOnUnmount();

  const target = useRef<VoiceTarget>({
    id: 'voice-entry', continuous: true, getText: () => f.ref.current, setText: f.set,
    // A new recording replaces the last one.
    onAudio: uri => { if (audioRef.current && audioRef.current !== uri) deleteRecording(audioRef.current); audioRef.current = uri; setAudio(uri); },
  }).current;
  // Leaving without saving throws the recording away.
  useEffect(() => () => { stopVoice('voice-entry'); if (!saved.current) deleteRecording(audioRef.current); }, []);

  const hide = () => { stopVoice('voice-entry'); setVoiceSheet(false); };
  const close = () => { hide(); ensureActions(); };
  const save = async () => {
    const text = f.ref.current.trim(), moods = Object.values(mood), uri = audioRef.current;
    if (!text && !uri && !moods.length) { toast('Talk first, then save. 🎙️'); return; }
    setSaving(true);
    try {
      stopVoice('voice-entry');
      await addEntry({ kind: 'voice', createdAt: Date.now(), day: dayKey(), moods, topics: [], text, ...(uri ? { audio: uri } : {}) });
      saved.current = true;
      hide(); savedHaptic(); toast('Saved to your journal. 📖');
    } finally { setSaving(false); }
    // The transcript gets the same crisis check as written entries (FEATURES_DO_NEXT §8).
    const level = text ? await checkSavedWriting(text) : 'none';
    if (level !== 'none') { showView('home'); await safetyFlow(level); return; }
    if (state.view === 'home') say("Saved. 📖 I'm here if you have questions.");
    ensureActions();
  };

  return (
    <SheetFrame>
      <SheetHead emoji="🎙️" title="Speak an entry" onClose={close} extra={<HelpPill />} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: t.gutter, paddingVertical: 16, gap: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
          <T style={{ flex: 1 }}>{INTRO}</T>
          <SpeakIcon text={INTRO} />
        </View>

        {/* The big record button: the accent fill to start, danger (with its icon and word) to stop. */}
        <View style={{ alignItems: 'center', gap: 12 }}>
          {listening ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, padding: 8 }}>
              <Butterfly size={t.presence} state="listening" />
              <T v="caption" muted>Listening…</T>
            </View>
          ) : null}
          <Press onPress={() => toggleVoice(target)} accessibilityRole="button" accessibilityLabel={listening ? 'Stop recording' : 'Start recording'}
            style={{ width: 168, height: 168, borderRadius: 84, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: listening ? t.danger.bg : t.c.accent }}>
            <Icon name={listening ? 'stop' : 'mic'} size={40} color={listening ? t.danger.ink : t.c.onAccent} />
            <T v="label" w={600} color={listening ? t.danger.ink : t.c.onAccent}>{listening ? 'Stop' : audio ? 'Talk again' : 'Start talking'}</T>
          </Press>
        </View>
        {!keeps && voiceTypingAvailable() ? <T v="caption" muted style={{ textAlign: 'center' }}>This phone can't keep recordings, so I'll save your words only.</T> : null}
        {audio ? (
          <Row style={{ justifyContent: 'center' }}>
            <Chip icon={play.playing ? 'stop' : 'play'} label={play.playing ? 'Stop' : 'Play my recording'} onPress={play.toggle} />
          </Row>
        ) : null}

        <T v="label" w={600}>Your words</T>
        <Box field={f} multiline lines={5} placeholder={listening ? 'Listening…' : 'Your words show up here.'} accessibilityLabel="Your words" style={{ borderRadius: R.md }} />

        <MoodBox selected={mood} onChange={setMood} />
      </ScrollView>

      <SheetFoot>
        <Btn label="Cancel" onPress={close} />
        <Btn variant="primary" icon="check" label="Save to journal" onPress={save} disabled={saving || listening} />
      </SheetFoot>
    </SheetFrame>
  );
}
