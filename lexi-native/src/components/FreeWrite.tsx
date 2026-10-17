// ✏️ Write on my own: a full-screen sheet with an optional mood, free text, emoji, voice typing,
// ✨ Tidy spelling (needs the optional API key) and 🔊 Read it back. The draft is kept while you type.
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { aiErrorText, claude } from '../ai';
import { say } from '../chat';
import { closeEmoji, toggleEmoji, useField, useVoiceTarget } from '../fields';
import { speak } from '../speech';
import { addEntry, aiReady, clearDraft, loadDraft, saveDraft, setSheet, state, toast, useLexi } from '../store';
import { dayKey } from '../text';
import { useTheme } from '../theme';
import { Btn, Chip, Ico, Row, T } from '../ui';
import { stopVoice } from '../voice';
import { Box, MicButton } from './Inputs';
import { MoodPicker, type Selected } from './Pickers';

type Tidy = { status: 'busy' } | { status: 'done'; text: string } | { status: 'error'; msg: string };

export function FreeWriteSheet() {
  const st = useLexi();
  if (!st.sheetOpen) return null;
  return <Sheet />;
}

function Sheet() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const f = useField(loadDraft());
  const voice = useVoiceTarget('fw', f, true);
  const [mood, setMood] = useState<Selected>({});
  const [moodOpen, setMoodOpen] = useState(false);
  const [tidy, setTidy] = useState<Tidy | null>(null);
  const [saving, setSaving] = useState(false);
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => saveDraft(f.value), 400);
  }, [f.value]);
  useEffect(() => () => { if (draftTimer.current) clearTimeout(draftTimer.current); }, []);

  const close = () => { stopVoice('fw'); closeEmoji(); setSheet(false); };
  const save = async () => {
    const text = f.ref.current.trim(), moods = Object.values(mood);
    if (!text && !moods.length) { toast('Write something or pick a mood first. ✏️'); return; }
    setSaving(true);
    try {
      stopVoice('fw');
      await addEntry({ kind: 'free', createdAt: Date.now(), day: dayKey(), moods, topics: [], text });
      if (draftTimer.current) clearTimeout(draftTimer.current);
      clearDraft();
      close(); toast('Saved to your journal. 📖');
      if (state.view === 'home') say("Saved. 📖 I'm here if you have questions.");
    } finally { setSaving(false); }
  };
  const runTidy = async () => {
    const text = f.ref.current.trim();
    if (!text) { toast('Write something first. ✏️'); return; }
    setTidy({ status: 'busy' });
    try {
      const { text: fixed } = await claude({
        effort: 'low',
        messages: [{
          role: 'user',
          content: "Fix only the spelling mistakes and obvious typos in the journal text below. Keep the writer's own words, tone, slang, emoji, capital letters and line breaks. " +
            'Do not add, remove or reword ideas. Reply with only the corrected text and nothing else.\n\nText:\n' + text,
        }],
      });
      setTidy({ status: 'done', text: fixed.trim() });
    } catch (e) {
      const m = aiErrorText(e);
      setTidy(m ? { status: 'error', msg: m } : null);
    }
  };

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: t.c.scrim }]}>
      <View accessibilityViewIsModal style={{ flex: 1, backgroundColor: t.c.bg }}>
        <View style={[s.head, { paddingTop: insets.top, height: 56 + insets.top, backgroundColor: t.c.bar, borderBottomWidth: t.barsBlend ? 1 : 0, borderBottomColor: t.c.line }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
            <Ico e="✏️" size={28} />
            <T em={1.1} display bold color={t.c.onBar} accessibilityRole="header">Write on my own</T>
          </View>
          <Chip icon="✖️" label="Close" onPress={close} style={{ borderColor: 'transparent' }} />
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 14 }}>
          <View style={[s.moodBox, { borderColor: t.c.line, backgroundColor: t.c.surface }]}>
            <Pressable onPress={() => setMoodOpen(!moodOpen)} accessibilityRole="button" accessibilityState={{ expanded: moodOpen }}
              style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, paddingHorizontal: 14, paddingVertical: 8 }}>
              <Ico e="🌡️" size={28} />
              <T bold>How do you feel?</T>
              <T em={0.85} soft>(you can skip this)</T>
              <View style={{ flex: 1 }} />
              <T soft>{moodOpen ? '▲' : '▼'}</T>
            </Pressable>
            {moodOpen ? (
              <View style={{ padding: 10, borderTopWidth: 2, borderTopColor: t.c.line }}>
                <MoodPicker selected={mood} onChange={setMood} />
              </View>
            ) : null}
          </View>

          <T bold em={0.9}>Your words</T>
          <Box field={f} multiline lines={7} placeholder="Write anything. Spelling doesn't matter here." accessibilityLabel="Your words" autoFocus={!f.value} />

          <Row gap={8}>
            <Chip icon="🙂" label="Emoji" onPress={() => toggleEmoji({ key: 'fw', insert: f.insert })} />
            <MicButton target={voice} variant="chip" />
            {aiReady() ? <Chip icon="✨" label="Tidy spelling" onPress={runTidy} disabled={tidy?.status === 'busy'} /> : null}
            <Chip icon="🔊" label="Read it back" onPress={() => speak(f.ref.current)} />
          </Row>

          {tidy ? (
            <View style={[s.tidy, { backgroundColor: t.c.bot }]}>
              {tidy.status === 'busy' ? <T color={t.c.botInk}>✨ Tidying your spelling…</T> : null}
              {tidy.status === 'error' ? <T color={t.c.botInk}>{tidy.msg}</T> : null}
              {tidy.status === 'done' ? (
                <>
                  <T bold color={t.c.botInk}>✨ Lexi's tidy version</T>
                  <T raw color={t.c.botInk}>{tidy.text}</T>
                  <Row end gap={8}>
                    <Chip icon="🔊" words="Read" a11y="Read aloud" onPress={() => speak(tidy.text)} />
                    <Btn icon="✖️" label="Keep mine" onPress={() => setTidy(null)} />
                    <Btn variant="primary" icon="✔️" label="Use this" onPress={() => { f.set(tidy.text); setTidy(null); toast('Spelling tidied. ✨'); }} />
                  </Row>
                </>
              ) : null}
            </View>
          ) : null}
        </ScrollView>

        <View style={[s.foot, { paddingBottom: insets.bottom + 12, borderTopColor: t.c.line, backgroundColor: t.c.surface }]}>
          <Btn label="Cancel" onPress={close} />
          <Btn variant="primary" icon="✔️" label="Save to journal" onPress={save} disabled={saving} />
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 16 },
  moodBox: { borderWidth: 2, borderRadius: 22, overflow: 'hidden' },
  tidy: { gap: 10, padding: 14, borderRadius: 22 },
  foot: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 2 },
});
