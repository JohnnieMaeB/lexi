// The composer under the chat (Screens 11-15): a pill holding the text box, 🙂 and 🎙, then Send.
import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { closeEmoji, useField, useVoiceTarget } from '../fields';
import { sendChat, stopChat } from '../script';
import { useLexi } from '../store';
import { useTheme } from '../theme';
import { T } from '../ui';
import { stopVoice, useListeningId } from '../voice';
import { EmojiButton, MicButton } from './Inputs';

export function Composer() {
  const t = useTheme();
  const st = useLexi();
  const f = useField('');
  const voice = useVoiceTarget('composer', f);
  const listening = useListeningId() === 'composer';
  const base = t.text(1);

  const send = () => {
    if (st.sending) { stopChat(); return; }
    stopVoice('composer');
    const v = f.ref.current.trim();
    if (!v) return;
    f.set(''); closeEmoji();
    sendChat(v);
  };
  // In the purple theme the bar is purple, so Send flips to a light button (as in lexi.html).
  const sendBg = t.accent === 'purple' ? t.c.surface : t.c.accent2;
  const sendInk = t.accent === 'purple' ? t.c.accent2 : t.c.onAccent2;

  return (
    <View style={[s.bar, { backgroundColor: t.c.accent }]}>
      <View style={[s.pill, { backgroundColor: t.c.surface }]}>
        <TextInput
          value={f.value}
          onChangeText={f.onChange}
          onSelectionChange={f.onSelectionChange}
          placeholder={listening ? 'Listening… 🎙' : 'Ask Lexi…'}
          placeholderTextColor={t.c.inkSoft}
          accessibilityLabel="Message Lexi"
          multiline
          submitBehavior="submit"
          returnKeyType="send"
          onSubmitEditing={send}
          style={[base, s.input, { maxHeight: (base.lineHeight as number) * 4.5 }]}
        />
        <EmojiButton field={f} k="composer" />
        <MicButton target={voice} />
      </View>
      <Pressable onPress={send} accessibilityRole="button" accessibilityLabel={st.sending ? 'Stop' : 'Send'}
        style={({ pressed }) => [s.send, { backgroundColor: sendBg, opacity: pressed ? 0.85 : 1, width: t.icons ? 48 : undefined, paddingHorizontal: t.icons ? 0 : 16 }]}>
        {t.icons
          ? <Text style={[t.emoji(Math.round(t.fs * 1.25)), { color: sendInk }]}>{st.sending ? '⏹️' : '➤'}</Text>
          : <T em={0.9} color={sendInk}>{st.sending ? 'Stop' : 'Send'}</T>}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 16, paddingVertical: 10 },
  pill: { flex: 1, minHeight: 48, flexDirection: 'row', alignItems: 'flex-end', borderRadius: 24, paddingLeft: 14, paddingRight: 4, paddingVertical: 4 },
  input: { flex: 1, minHeight: 40, paddingTop: 8, paddingBottom: 8, paddingHorizontal: 0 },
  send: { height: 48, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
});
