// Inputs: the themed text box, the 🎙 mic button, a note line (text + 🙂 + 🎙) and the custom-word adder.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View, type StyleProp, type TextInputInstance, type TextInputProps, type TextStyle, type ViewStyle } from 'react-native';
import { BANDS, type BandKey, type Pick } from '../content';
import { closeEmoji, toggleEmoji, useField, useVoiceTarget, type Field } from '../fields';
import { firstEmoji } from '../text';
import { useTheme } from '../theme';
import { Btn, Chip, Row, Swatch, T } from '../ui';
import { stopVoice, toggleVoice, useListeningId, type VoiceTarget } from '../voice';
import { reduceMotion } from '../chat';

let fieldUid = 0;
export const useFieldId = (p: string) => useRef(p + '-' + (++fieldUid)).current;

type BoxProps = TextInputProps & { field: Field; style?: StyleProp<TextStyle>; lines?: number };
/** `textarea` / `input` from lexi.html: cream fill, soft outline, the person's font and spacing. */
export const Box = React.forwardRef<TextInputInstance, BoxProps>(function Box({ field, style, lines = 1, multiline, ...rest }, ref) {
  const t = useTheme();
  const base = t.text(1);
  return (
    <TextInput
      ref={ref}
      value={field.value}
      onChangeText={field.onChange}
      onSelectionChange={field.onSelectionChange}
      placeholderTextColor={t.c.inkSoft}
      multiline={multiline}
      textAlignVertical={multiline ? 'top' : 'center'}
      style={[base, s.box, {
        borderColor: t.c.line, backgroundColor: t.c.bg,
        minHeight: multiline ? (base.lineHeight as number) * lines + 18 : 48,
        paddingHorizontal: t.fs * 0.75,
      }, style]}
      {...rest}
    />
  );
});

/** 🎙 Mic: tap to talk, tap again to stop. Pulses while listening. */
export function MicButton({ target, variant = 'round', size = 40 }: { target: VoiceTarget; variant?: 'round' | 'chip'; size?: number }) {
  const t = useTheme();
  const on = useListeningId() === target.id;
  const pulse = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!on || reduceMotion) { pulse.setValue(1); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 0.55, duration: 600, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [on, pulse]);
  useEffect(() => () => stopVoice(target.id), [target.id]);
  const press = () => { closeEmoji(); toggleVoice(target); };
  const a11y = on ? 'Stop voice typing' : 'Voice typing';
  if (variant === 'chip') {
    return (
      <Animated.View style={{ opacity: pulse }}>
        <Chip icon={on ? '⏹️' : '🎙'} label={on ? 'Stop' : 'Speak'} selected={on} onPress={press} a11y={a11y} />
      </Animated.View>
    );
  }
  return (
    <Animated.View style={{ opacity: pulse }}>
      <Pressable onPress={press} accessibilityRole="button" accessibilityLabel={a11y} accessibilityState={{ selected: on }}
        hitSlop={4}
        style={[s.round, { minWidth: size, height: size, backgroundColor: on ? t.c.accent2 : 'transparent', paddingHorizontal: t.icons ? 0 : 10 }]}>
        {t.icons
          ? <Text style={t.emoji(Math.round(size * 0.55))}>{on ? '⏹️' : '🎙'}</Text>
          : <T em={0.8} color={on ? t.c.onAccent2 : t.c.ink}>{on ? 'Stop' : 'Speak'}</T>}
      </Pressable>
    </Animated.View>
  );
}

/** Round 🙂 button that opens the emoji picker for a field. */
export function EmojiButton({ field, k, size = 40, single }: { field: Field; k: string; size?: number; single?: boolean }) {
  const t = useTheme();
  return (
    <Pressable onPress={() => toggleEmoji({ key: k, insert: single ? field.set : field.insert, single })}
      accessibilityRole="button" accessibilityLabel="Add emoji" hitSlop={4}
      style={[s.round, { minWidth: size, height: size, paddingHorizontal: t.icons ? 0 : 10 }]}>
      {t.icons ? <Text style={t.emoji(Math.round(size * 0.55))}>🙂</Text> : <T em={0.8}>Emoji</T>}
    </Pressable>
  );
}

/** A two-line note with 🙂 and 🎙 beside it (`.note-line`). */
export function NoteLine({ field, placeholder, disabled }: { field: Field; placeholder: string; disabled?: boolean }) {
  const id = useFieldId('note');
  const voice = useVoiceTarget(id, field);
  return (
    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
      <Box field={field} multiline lines={2} placeholder={placeholder} accessibilityLabel={placeholder} editable={!disabled} style={{ flex: 1 }} />
      <View style={{ gap: 6 }}>
        <Chip icon="🙂" words="Emoji" a11y="Add emoji" onPress={() => toggleEmoji({ key: id, insert: field.insert })} />
        <MicButton target={voice} variant="chip" />
      </View>
    </View>
  );
}

/** ➕ My own: add a custom word and emoji (with a band for moods). */
export function CustomAdder({ withBand, onAdd }: { withBand: boolean; onAdd: (m: Pick) => void }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const [band, setBand] = useState<BandKey>('content');
  const [err, setErr] = useState('');
  const emo = useField(''), word = useField('');
  const id = useFieldId('emo');
  const wordRef = useRef<TextInputInstance>(null);
  const submit = () => {
    const e = firstEmoji(emo.ref.current), w = word.ref.current.trim();
    if (!e && !w) { setErr('Add a word or an emoji.'); return; }
    onAdd({ e: e || '🏷️', label: w || e, ...(withBand ? { band } : {}) });
    emo.set(''); word.set(''); setErr(''); setOpen(false); closeEmoji();
  };
  return (
    <View style={{ gap: 10, alignItems: 'flex-start' }}>
      <Chip icon="➕" label="My own" selected={open} onPress={() => { setOpen(!open); if (!open) setTimeout(() => wordRef.current?.focus(), 50); }} />
      {open ? (
        <View style={[s.adder, { borderColor: t.c.line }]}>
          <Row gap={8}>
            <Box field={emo} placeholder="🙂" accessibilityLabel="Emoji" maxLength={16} style={{ width: t.fs * 4.2, textAlign: 'center' }} />
            <Chip icon="🙂" label="Pick" onPress={() => toggleEmoji({ key: id, insert: emo.set, single: true })} />
            <Box ref={wordRef} field={word} placeholder="Your word" accessibilityLabel="Your word" maxLength={28}
              returnKeyType="done" onSubmitEditing={submit} style={{ flexGrow: 1, flexBasis: t.fs * 9, minWidth: 0 }} />
          </Row>
          {withBand ? (
            <Row gap={8} style={{ alignSelf: 'stretch' }}>
              {BANDS.map(b => (
                <Chip key={b.key} label={b.name} selected={band === b.key} onPress={() => setBand(b.key)}>
                  <Swatch color={t.band(b.key).b} />
                </Chip>
              ))}
            </Row>
          ) : null}
          {err ? <T em={0.9} bold color={t.c.danger}>{err}</T> : null}
          <Row end style={{ alignSelf: 'stretch' }}><Btn variant="primary" icon="✔️" label="Add" onPress={submit} /></Row>
        </View>
      ) : null}
    </View>
  );
}

export function Spacer({ style }: { style?: StyleProp<ViewStyle> }) { return <View style={[{ flex: 1 }, style]} />; }

const s = StyleSheet.create({
  box: { borderWidth: 2, borderRadius: 14, paddingVertical: 8 },
  round: { alignItems: 'center', justifyContent: 'center', borderRadius: 999 },
  adder: { alignSelf: 'stretch', gap: 10, padding: 12, borderWidth: 2, borderStyle: 'dashed', borderRadius: 16 },
});
