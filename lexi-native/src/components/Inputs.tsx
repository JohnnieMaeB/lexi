// Inputs: the themed text box, the 🎙 mic button, a note line (text + emoji + mic) and the ➕ My own adder.
import React, { useRef, useState } from 'react';
import { StyleSheet, TextInput, View, type StyleProp, type TextInputInstance, type TextInputProps, type TextStyle } from 'react-native';
import type { Pick } from '../content';
import { closeEmoji, toggleEmoji, useField, useVoiceTarget, type Field } from '../fields';
import { firstEmoji } from '../text';
import { R, useTheme } from '../theme';
import { Btn, Chip, IconBtn, Row, T } from '../ui';
import { stopVoice, toggleVoice, useListeningId, type VoiceTarget } from '../voice';

let fieldUid = 0;
export const useFieldId = (p: string) => useRef(p + '-' + (++fieldUid)).current;

type BoxProps = TextInputProps & { field: Field; style?: StyleProp<TextStyle>; lines?: number };
/** A text box (§10): sunken fill, a 1 px strong edge, 12 px corners, the person's font and spacing. */
export const Box = React.forwardRef<TextInputInstance, BoxProps>(function Box({ field, style, lines = 1, multiline, ...rest }, ref) {
  const t = useTheme();
  const base = t.txt('body');
  return (
    <TextInput
      ref={ref}
      value={field.value}
      onChangeText={field.onChange}
      onSelectionChange={field.onSelectionChange}
      placeholderTextColor={t.c.inkMuted}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={[base, s.box, {
        borderColor: t.c.borderStrong, backgroundColor: t.c.sunken,
        minHeight: multiline ? (base.lineHeight as number) * lines + 20 : 48,
        paddingHorizontal: Math.round(t.fs * 0.75),
      }, style]}
      {...rest}
    />
  );
});

/** 🎙 Mic: tap to talk, tap again to stop. While on, it shows the stop square. */
export function MicButton({ target, variant = 'round' }: { target: VoiceTarget; variant?: 'round' | 'chip' }) {
  const on = useListeningId() === target.id;
  React.useEffect(() => () => stopVoice(target.id), [target.id]);
  const press = () => { closeEmoji(); toggleVoice(target); };
  if (variant === 'chip') {
    return <Chip icon={on ? 'stop' : 'mic'} label={on ? 'Stop' : 'Speak'} selected={on} onPress={press} a11y={on ? 'Stop voice typing' : 'Voice typing'} />;
  }
  return <IconBtn icon={on ? 'stop' : 'mic'} label={on ? 'Stop voice typing' : 'Voice typing'} words={on ? 'Stop' : 'Speak'} variant={on ? 'ink' : 'surface'} selected={on} onPress={press} />;
}

/** The smile button that opens the emoji picker for a field. */
export function EmojiButton({ field, k, single, variant = 'plain' }: { field: Field; k: string; single?: boolean; variant?: 'plain' | 'surface' }) {
  return <IconBtn icon="emoji" label="Add emoji" words="Emoji" variant={variant} onPress={() => toggleEmoji({ key: k, insert: single ? field.set : field.insert, single })} />;
}

/** A two-line note with the emoji and mic buttons beside it (`.note-line`). */
export function NoteLine({ field, placeholder, disabled }: { field: Field; placeholder: string; disabled?: boolean }) {
  const id = useFieldId('note');
  const voice = useVoiceTarget(id, field);
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
      <Box field={field} multiline lines={2} placeholder={placeholder} accessibilityLabel={placeholder} editable={!disabled} style={{ flex: 1 }} />
      <View style={{ gap: 8 }}>
        <EmojiButton field={field} k={id} variant="surface" />
        <MicButton target={voice} />
      </View>
    </View>
  );
}

/** ➕ My own: a word and an emoji. A mood joins the group on show, so there's no group to choose here. */
export function CustomAdder({ onAdd, onClose }: { onAdd: (m: Pick) => void; onClose: () => void }) {
  const t = useTheme();
  const [err, setErr] = useState('');
  const emo = useField(''), word = useField('');
  const id = useFieldId('emo');
  const wordRef = useRef<TextInputInstance>(null);
  React.useEffect(() => { const h = setTimeout(() => wordRef.current?.focus(), 50); return () => clearTimeout(h); }, []);
  const submit = () => {
    const e = firstEmoji(emo.ref.current), w = word.ref.current.trim();
    if (!e && !w) { setErr('Add a word or an emoji.'); return; }
    onAdd({ e: e || '🏷️', label: w || e });
    emo.set(''); word.set(''); setErr(''); closeEmoji();
  };
  return (
    <View style={[s.adder, { borderColor: t.c.borderStrong }]}>
      <T v="label" w={600}>My own</T>
      <Row gap={8}>
        <Box field={emo} placeholder="🙂" accessibilityLabel="Emoji" maxLength={16} style={{ width: Math.round(t.fs * 4.2), textAlign: 'center' }} />
        <Chip icon="emoji" label="Pick" onPress={() => toggleEmoji({ key: id, insert: emo.set, single: true })} />
        <Box ref={wordRef} field={word} placeholder="Your word" accessibilityLabel="Your word" maxLength={28}
          returnKeyType="done" onSubmitEditing={submit} style={{ flexGrow: 1, flexBasis: t.fs * 9, minWidth: 0 }} />
      </Row>
      {err ? <T v="label" color={t.danger.bg}>{err}</T> : null}
      <Row end>
        <Btn label="Cancel" height={48} onPress={() => { closeEmoji(); onClose(); }} />
        <Btn variant="primary" icon="add" label="Add" height={48} onPress={submit} />
      </Row>
    </View>
  );
}

const s = StyleSheet.create({
  box: { borderWidth: 1, borderRadius: R.md, paddingVertical: 10 },
  adder: { alignSelf: 'stretch', gap: 12, padding: 16, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: R.lg },
});
