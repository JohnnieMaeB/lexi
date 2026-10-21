// ✏️ Write on my own: a full-screen sheet with an optional mood, free text, emoji, voice typing,
// ✨ Tidy spelling word by word (needs the optional API key) and 🔊 Read it back. The draft is kept while you type.
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { aiErrorText, claude, parseJsonReply } from '../ai';
import { savedHaptic } from '../a11y';
import { say } from '../chat';
import { closeEmoji, toggleEmoji, useField, useVoiceTarget, type Field } from '../fields';
import { STARTERS } from '../content';
import { checkSavedWriting, ensureActions, safetyFlow } from '../script';
import { speak } from '../speech';
import { addEntry, aiReady, clearDraft, loadDraft, saveDraft, setSheet, showView, state, toast, useLexi } from '../store';
import { dayKey } from '../text';
import { TIDY_PROMPT, applyFixes, placeFixes, type PlacedFix } from '../tidy';
import { R, useTheme } from '../theme';
import { Btn, Chip, Ico, IconBtn, Row, T } from '../ui';
import { stopVoice } from '../voice';
import { HelpPill } from './Help';
import { Box, MicButton } from './Inputs';
import { MoodBox, type Selected } from './Pickers';
import { SheetFoot, SheetFrame, SheetHead } from './Sheet';

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

/** "there 📍 a place", with the speaker saying the word and then its meaning. */
function MeaningLine({ word, emoji, meaning, bold }: { word: string; emoji?: string; meaning?: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
      <T raw bold={bold}>{word}</T>
      {emoji ? <Ico e={emoji} size={24} /> : null}
      {meaning ? <T raw muted>{meaning}</T> : null}
      <IconBtn icon="speaker" label={'Hear ' + word} words="Hear it" onPress={() => { speak(word, { device: true }); if (meaning) speak(meaning, { queue: true, device: true }); }} />
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
  const f = useField(loadDraft());
  const voice = useVoiceTarget('fw', f, true);
  const [mood, setMood] = useState<Selected>({});
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

  const hide = () => { stopVoice('fw'); closeEmoji(); setSheet(false); };
  /** Cancel or Close: the Home actions come back if they had folded away. */
  const close = () => { hide(); ensureActions(); };
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
      hide(); savedHaptic(); toast('Saved to your journal. 📖');
    } finally { setSaving(false); }
    // Saved writing gets the crisis check (§8): the entry is saved first, then Home, then the flow.
    const level = text ? await checkSavedWriting(text) : 'none';
    if (level !== 'none') { showView('home'); await safetyFlow(level); return; }
    if (state.view === 'home') say("Saved. 📖 I'm here if you have questions.");
    ensureActions();
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
    <SheetFrame>
      <SheetHead emoji="✏️" title="Write on my own" onClose={close} extra={<HelpPill />} />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: t.gutter, paddingVertical: 16, gap: 16 }}>
        <MoodBox selected={mood} onChange={setMood} />

        <T v="label" w={600}>Your words</T>
        {/* Sentence starters (§11): insert at the cursor, on a new line if needed, and say it. */}
        <Row gap={8}>
          {STARTERS.map(s0 => <Chip key={s0} label={s0} onPress={() => { insertStarter(f, s0); speak(s0); }} />)}
        </Row>
        <Box field={f} multiline lines={7} placeholder="Write anything. Spelling doesn't matter here." accessibilityLabel="Your words" autoFocus={!f.value} />

        <Row gap={8}>
          <Chip icon="emoji" label="Emoji" onPress={() => toggleEmoji({ key: 'fw', insert: f.insert })} />
          <MicButton target={voice} variant="chip" />
          {aiReady() ? <Chip emoji="✨" label="Tidy spelling" onPress={runTidy} disabled={tidy?.status === 'busy'} /> : null}
          <Chip icon="speaker" label="Read it back" onPress={() => speak(f.ref.current)} />
        </Row>

        {tidy ? (
          <View style={[s.tidy, t.raised]}>
            {tidy.status === 'busy' ? <T>✨ Tidying your spelling…</T> : null}
            {tidy.status === 'error' ? <T>{tidy.msg}</T> : null}
            {tidy.status === 'none' ? (
              <Row><T style={{ flex: 1 }}>I didn't find any words to fix. ✔️</T><Btn label="Close" height={48} onPress={() => setTidy(null)} /></Row>
            ) : null}
            {tidy.status === 'ready' ? (
              <>
                <T v="title">✨ Words to check</T>
                {tidy.fixes.map((fx, i) => {
                  const on = tidy.accepted[i];
                  return (
                    <View key={i + fx.from + fx.at} style={[s.fix, { borderColor: on ? t.c.accentInk : t.c.hairline, backgroundColor: on ? t.c.accentTint : t.c.sunken }]}>
                      {fx.kind === 'sound-alike' ? (
                        // Sound-alike (§10): both words on their own line, each with its emoji, meaning and speaker.
                        <View style={{ gap: 8 }}>
                          <MeaningLine word={fx.to} emoji={fx.emoji} meaning={fx.hint} bold />
                          <MeaningLine word={fx.from} emoji={fx.wrongEmoji} meaning={fx.wrongHint} />
                        </View>
                      ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
                          <T raw>{fx.from}</T><T>→</T><T raw bold>{fx.to}</T>
                          <IconBtn icon="speaker" label={'Hear ' + fx.to} words="Hear it" onPress={() => hear(fx)} />
                        </View>
                      )}
                      <Row gap={8}>
                        <Chip icon="check" label="Use" selected={on} onPress={() => choose(tidy.accepted.map((a, j) => (j === i ? true : a)))} />
                        <Chip emoji="✋🏽" label="Keep mine" selected={!on} onPress={() => choose(tidy.accepted.map((a, j) => (j === i ? false : a)))} />
                      </Row>
                    </View>
                  );
                })}
                <Row end gap={8}>
                  <Btn label="Undo all" onPress={() => choose(tidy.fixes.map(() => false))} />
                  <Btn variant="primary" icon="check" label="Use all" onPress={() => choose(tidy.fixes.map(() => true))} />
                </Row>
              </>
            ) : null}
          </View>
        ) : null}
      </ScrollView>

      <SheetFoot>
        <Btn label="Cancel" onPress={close} />
        <Btn variant="primary" icon="check" label="Save to journal" onPress={save} disabled={saving} />
      </SheetFoot>
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  tidy: { gap: 12, padding: 16, borderRadius: R.xl },
  fix: { gap: 8, padding: 12, borderRadius: R.md, borderWidth: 1 },
});
