// 🎙️ Speak an entry (FEATURES_SOON §4, native only): record yourself; Lexi keeps the audio and saves the
// dictated words next to it, so mistakes in the transcript don't matter. Saved as { kind: 'voice', audio, text, moods }.
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reduceMotion, say } from '../chat';
import { useField } from '../fields';
import { deleteRecording, usePlayback, useStopPlaybackOnUnmount } from '../recording';
import { checkSavedWriting, safetyFlow } from '../script';
import { speak } from '../speech';
import { addEntry, setVoiceSheet, showView, state, toast, useLexi } from '../store';
import { dayKey } from '../text';
import { R, useTheme } from '../theme';
import { Btn, Chip, Ico, Row, T } from '../ui';
import { canKeepRecording, stopVoice, toggleVoice, useListeningId, voiceTypingAvailable, type VoiceTarget } from '../voice';
import { HelpPill } from './Help';
import { Box } from './Inputs';
import { MoodPicker, type Selected } from './Pickers';

const INTRO = "Talk about anything. I keep your recording, so mistakes in the words don't matter.";

export function VoiceEntrySheet() {
  const st = useLexi();
  if (!st.voiceOpen) return null;
  return <Sheet />;
}

function Sheet() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const f = useField('');
  const [audio, setAudio] = useState<string | null>(null);
  const audioRef = useRef<string | null>(null);
  const saved = useRef(false);
  const [mood, setMood] = useState<Selected>({});
  const [moodOpen, setMoodOpen] = useState(false);
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

  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!listening || reduceMotion) { pulse.setValue(1); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 600, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [listening, pulse]);

  const close = () => { stopVoice('voice-entry'); setVoiceSheet(false); };
  const save = async () => {
    const text = f.ref.current.trim(), moods = Object.values(mood), uri = audioRef.current;
    if (!text && !uri && !moods.length) { toast('Talk first, then save. 🎙️'); return; }
    setSaving(true);
    try {
      stopVoice('voice-entry');
      await addEntry({ kind: 'voice', createdAt: Date.now(), day: dayKey(), moods, topics: [], text, ...(uri ? { audio: uri } : {}) });
      saved.current = true;
      close(); toast('Saved to your journal. 📖');
    } finally { setSaving(false); }
    // The transcript gets the same crisis check as written entries (FEATURES_DO_NEXT §8).
    const level = text ? await checkSavedWriting(text) : 'none';
    if (level !== 'none') { showView('home'); await safetyFlow(level); }
    else if (state.view === 'home') say("Saved. 📖 I'm here if you have questions.");
  };

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: t.c.bg }]} accessibilityViewIsModal>
      <View style={[s.head, { paddingTop: insets.top, height: 56 + insets.top, backgroundColor: t.c.bar, borderBottomWidth: t.barsBlend ? 1 : 0, borderBottomColor: t.c.line }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
          <Ico e="🎙️" size={28} />
          <T em={1.1} display bold color={t.c.onBar} accessibilityRole="header">Speak an entry</T>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <HelpPill />
          <Chip icon="✖️" label="Close" onPress={close} style={{ borderColor: 'transparent' }} />
        </View>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 16, alignItems: 'stretch' }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
          <T style={{ flex: 1 }}>{INTRO}</T>
          <Chip icon="🔊" words="Read" a11y="Read aloud" onPress={() => speak(INTRO)} />
        </View>

        <Animated.View style={{ alignSelf: 'center', transform: [{ scale: pulse }] }}>
          <Pressable onPress={() => toggleVoice(target)}
            accessibilityRole="button" accessibilityLabel={listening ? 'Stop recording' : 'Start recording'}
            style={({ pressed }) => [t.shadow, s.rec, { backgroundColor: listening ? t.c.danger : t.c.yes, opacity: pressed ? 0.85 : 1 }]}>
            {t.icons ? <Text style={t.emoji(56)}>{listening ? '⏹️' : '🎙️'}</Text> : null}
            <T bold color={listening ? '#FFFFFF' : t.c.onYes}>{listening ? 'Stop' : audio ? 'Talk again' : 'Start talking'}</T>
          </Pressable>
        </Animated.View>
        {!keeps && voiceTypingAvailable() ? <T em={0.85} soft style={{ textAlign: 'center' }}>This phone can't keep recordings, so I'll save your words only.</T> : null}
        {audio ? (
          <Row style={{ justifyContent: 'center' }}>
            <Chip icon={play.playing ? '⏹️' : '▶️'} label={play.playing ? 'Stop' : 'Play my recording'} onPress={play.toggle} />
          </Row>
        ) : null}

        <T bold em={0.9}>Your words</T>
        <Box field={f} multiline lines={5} placeholder={listening ? 'Listening… 🎙' : 'Your words show up here.'} accessibilityLabel="Your words" />

        <View style={[s.moodBox, { borderColor: t.c.line, backgroundColor: t.c.surface }]}>
          <Pressable onPress={() => setMoodOpen(!moodOpen)} accessibilityRole="button" accessibilityState={{ expanded: moodOpen }}
            style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, paddingVertical: 8 }}>
            <Ico e="🌡️" size={28} />
            <T bold>How do you feel?</T>
            <T em={0.85} soft>(you can skip this)</T>
            <View style={{ flex: 1 }} />
            <T soft>{moodOpen ? '▲' : '▼'}</T>
          </Pressable>
          {moodOpen ? <View style={{ padding: 10, borderTopWidth: 2, borderTopColor: t.c.line }}><MoodPicker selected={mood} onChange={setMood} /></View> : null}
        </View>
      </ScrollView>

      <View style={[s.foot, { paddingBottom: insets.bottom + 12, borderTopColor: t.c.line, backgroundColor: t.c.surface }]}>
        <Btn label="Cancel" onPress={close} />
        <Btn variant="primary" icon="✔️" label="Save to journal" onPress={save} disabled={saving || listening} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 16 },
  rec: { width: 168, height: 168, borderRadius: 84, alignItems: 'center', justifyContent: 'center', gap: 4 },
  moodBox: { borderWidth: 2, borderRadius: R.m, overflow: 'hidden' },
  foot: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 2 },
});
