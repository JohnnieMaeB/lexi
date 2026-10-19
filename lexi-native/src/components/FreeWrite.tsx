// ✏️ Write on my own: a full-screen sheet with an optional mood, free text, emoji, voice typing,
// ✨ Tidy spelling word by word (needs the optional API key) and 🔊 Read it back. The draft is kept while you type.
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { aiErrorText, claude, parseJsonReply } from '../ai';
import { say } from '../chat';
import { closeEmoji, toggleEmoji, useField, useVoiceTarget, type Field } from '../fields';
import { STARTERS } from '../content';
import { checkSavedWriting, safetyFlow } from '../script';
import { speak } from '../speech';
import { addEntry, aiReady, clearDraft, loadDraft, saveDraft, setSheet, showView, state, toast, useLexi } from '../store';
import { dayKey } from '../text';
import { TIDY_PROMPT, applyFixes, placeFixes, type PlacedFix } from '../tidy';
import { useTheme } from '../theme';
import { Btn, Chip, Ico, Row, T } from '../ui';
import { stopVoice } from '../voice';
import { HelpPill } from './Help';
import { Box, MicButton } from './Inputs';
import { MoodPicker, type Selected } from './Pickers';

type Tidy =
  | { status: 'busy' }
  | { status: 'error'; msg: string }
  | { status: 'none' }
  | { status: 'ready'; original: string; fixes: PlacedFix[]; accepted: boolean[]; applied: string };

/** A starter goes in at the cursor, plus a space, starting a new line unless the text before it already ends one. */
function insertStarter(f: Field, starter: string) {
  const before = f.ref.current.slice(0, f.sel.current.start);
  f.insert((before && !before.endsWith('\n') ? '\n' : '') + starter + ' ');
}

/** "there 📍 a place", with 🔊 saying the word and then its meaning. */
function MeaningLine({ word, emoji, meaning, bold }: { word: string; emoji?: string; meaning?: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
      <T raw bold={bold}>{word}</T>
      {emoji ? <Ico e={emoji} size={24} /> : null}
      {meaning ? <T em={0.9} soft raw>{meaning}</T> : null}
      <Chip icon="🔊" words="Hear it" a11y={'Hear ' + word} onPress={() => { speak(word, { device: true }); if (meaning) speak(meaning, { queue: true, device: true }); }} />
    </View>
  );
}

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
  /** The words as they were before the first ✨ Tidy, kept on the entry if tidying changed them. */
  const preTidy = useRef<string | null>(null);

  useEffect(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => saveDraft(f.value), 400);
  }, [f.value]);
  useEffect(() => () => { if (draftTimer.current) clearTimeout(draftTimer.current); }, []);
  // Typing after a tidy closes the fix list: its fixes were found in the older text.
  useEffect(() => { if (tidy?.status === 'ready' && f.value !== tidy.applied) setTidy(null); }, [f.value, tidy]);

  const close = () => { stopVoice('fw'); closeEmoji(); setSheet(false); };
  const save = async () => {
    const text = f.ref.current.trim(), moods = Object.values(mood);
    if (!text && !moods.length) { toast('Write something or pick a mood first. ✏️'); return; }
    setSaving(true);
    try {
      stopVoice('fw');
      const original = preTidy.current != null && preTidy.current.trim() !== text ? preTidy.current.trim() : undefined;
      await addEntry({ kind: 'free', createdAt: Date.now(), day: dayKey(), moods, topics: [], text, ...(original ? { original } : {}) });
      if (draftTimer.current) clearTimeout(draftTimer.current);
      clearDraft();
      close(); toast('Saved to your journal. 📖');
    } finally { setSaving(false); }
    // Saved writing gets the crisis check (§8): the entry is saved first, then Home, then the flow.
    const level = text ? await checkSavedWriting(text) : 'none';
    if (level !== 'none') { showView('home'); await safetyFlow(level); }
    else if (state.view === 'home') say("Saved. 📖 I'm here if you have questions.");
  };
  const runTidy = async () => {
    const text = f.ref.current;
    if (!text.trim()) { toast('Write something first. ✏️'); return; }
    if (preTidy.current == null) preTidy.current = text;
    setTidy({ status: 'busy' });
    try {
      const { text: out } = await claude({ effort: 'low', messages: [{ role: 'user', content: TIDY_PROMPT + text }] });
      const fixes = placeFixes(text, parseJsonReply(out));
      setTidy(fixes.length ? { status: 'ready', original: text, fixes, accepted: fixes.map(() => false), applied: text } : { status: 'none' });
    } catch (e) {
      const m = aiErrorText(e);
      setTidy(m ? { status: 'error', msg: m } : null);
    }
  };
  /** Accept or undo fixes; the text is always rebuilt from the original. */
  const choose = (next: boolean[]) => {
    if (tidy?.status !== 'ready') return;
    const applied = applyFixes(tidy.original, tidy.fixes, next);
    setTidy({ ...tidy, accepted: next, applied });
    f.set(applied);
  };
  const hear = (fx: PlacedFix) => { speak(fx.to); if (fx.hint) speak(fx.hint, { queue: true }); };

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: t.c.scrim }]}>
      <View accessibilityViewIsModal style={{ flex: 1, backgroundColor: t.c.bg }}>
        <View style={[s.head, { paddingTop: insets.top, height: 56 + insets.top, backgroundColor: t.c.bar, borderBottomWidth: t.barsBlend ? 1 : 0, borderBottomColor: t.c.line }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
            <Ico e="✏️" size={28} />
            <T em={1.1} display bold color={t.c.onBar} accessibilityRole="header">Write on my own</T>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <HelpPill />
            <Chip icon="✖️" label="Close" onPress={close} style={{ borderColor: 'transparent' }} />
          </View>
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
          {/* Sentence starters (§11): insert at the cursor, on a new line if needed, and say it. */}
          <Row gap={8}>
            {STARTERS.map(s0 => <Chip key={s0} label={s0} onPress={() => { insertStarter(f, s0); speak(s0); }} />)}
          </Row>
          <Box field={f} multiline lines={7} placeholder="Write anything. Spelling doesn't matter here." accessibilityLabel="Your words" autoFocus={!f.value} />

          <Row gap={8}>
            <Chip icon="🙂" label="Emoji" onPress={() => toggleEmoji({ key: 'fw', insert: f.insert })} />
            <MicButton target={voice} variant="chip" />
            {aiReady() ? <Chip icon="✨" label="Tidy spelling" onPress={runTidy} disabled={tidy?.status === 'busy'} /> : null}
            <Chip icon="🔊" label="Read it back" onPress={() => speak(f.ref.current)} />
          </Row>

          {tidy ? (
            <View style={[s.tidy, { backgroundColor: t.c.surface, borderColor: t.c.bot }]}>
              {tidy.status === 'busy' ? <T>✨ Tidying your spelling…</T> : null}
              {tidy.status === 'error' ? <T>{tidy.msg}</T> : null}
              {tidy.status === 'none' ? (
                <Row><T style={{ flex: 1 }}>I didn't find any words to fix. ✔️</T><Btn label="Close" onPress={() => setTidy(null)} /></Row>
              ) : null}
              {tidy.status === 'ready' ? (
                <>
                  <T bold>✨ Words to check</T>
                  {tidy.fixes.map((fx, i) => {
                    const on = tidy.accepted[i];
                    return (
                      <View key={i + fx.from + fx.at} style={[s.fix, { borderColor: on ? t.c.ring : t.c.line, backgroundColor: on ? t.c.sel : t.c.field }]}>
                        {fx.kind === 'sound-alike' ? (
                          // Sound-alike (§10): both words on their own line, each with its emoji, meaning and 🔊.
                          <View style={{ gap: 6 }}>
                            <MeaningLine word={fx.to} emoji={fx.emoji} meaning={fx.hint} bold />
                            <MeaningLine word={fx.from} emoji={fx.wrongEmoji} meaning={fx.wrongHint} />
                          </View>
                        ) : (
                          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                            <T raw>{fx.from}</T><T>→</T><T raw bold>{fx.to}</T>
                          </View>
                        )}
                        <Row gap={8}>
                          {fx.kind === 'sound-alike' ? null : <Chip icon="🔊" words="Hear it" a11y={'Hear ' + fx.to} onPress={() => hear(fx)} />}
                          <Chip icon="✔️" label="Use" selected={on} onPress={() => choose(tidy.accepted.map((a, j) => (j === i ? true : a)))} />
                          <Chip icon="✋🏽" label="Keep mine" selected={!on} onPress={() => choose(tidy.accepted.map((a, j) => (j === i ? false : a)))} />
                        </Row>
                      </View>
                    );
                  })}
                  <Row end gap={8}>
                    <Btn icon="↩️" label="Undo all" onPress={() => choose(tidy.fixes.map(() => false))} />
                    <Btn variant="primary" icon="✔️" label="Use all" onPress={() => choose(tidy.fixes.map(() => true))} />
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
  tidy: { gap: 10, padding: 14, borderRadius: 22, borderWidth: 2 },
  fix: { gap: 8, padding: 10, borderRadius: 14, borderWidth: 2 },
  foot: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 2 },
});
