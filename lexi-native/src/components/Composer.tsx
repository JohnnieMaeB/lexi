// The bottom dock (Screens 11-13): an accent bar holding the ⚙️ 🏡 📖 nav row and, on Home, the white input
// pill with the text field, 🙂 and 🎙 inside it. ➤ appears inside the pill once there's something to send.
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { closeEmoji, useField, useVoiceTarget } from '../fields';
import { sendChat, stopChat } from '../script';
import { showView, useLexi, type View as ViewName } from '../store';
import { R, useTheme } from '../theme';
import { T } from '../ui';
import { stopVoice, useListeningId } from '../voice';
import { EmojiButton, MicButton } from './Inputs';

function InputPill() {
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
  const canSend = st.sending || !!f.value.trim();
  return (
    <View style={[s.pill, t.shadow, { backgroundColor: t.c.surface, borderWidth: t.barsBlend ? 1 : 0, borderColor: t.key === 'night' ? '#FFFFFF' : t.c.line }]}>
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
      {canSend ? (
        <Pressable onPress={send} accessibilityRole="button" accessibilityLabel={st.sending ? 'Stop' : 'Send'} hitSlop={4}
          style={({ pressed }) => [s.send, { backgroundColor: t.c.yes, opacity: pressed ? 0.85 : 1, minWidth: 44, paddingHorizontal: t.icons ? 0 : 12 }]}>
          {t.icons
            ? <Text style={[t.emoji(st.sending ? 22 : 24), { color: t.c.onYes }]}>{st.sending ? '⏹️' : '➤'}</Text>
            : <T em={0.85} color={t.c.onYes}>{st.sending ? 'Stop' : 'Send'}</T>}
        </Pressable>
      ) : null}
    </View>
  );
}

const TABS: [ViewName, string, string][] = [['settings', '⚙️', 'Settings'], ['home', '🏡', 'Home'], ['journal', '📖', 'Journal']];
/** ⚙️ 🏡 📖 at 34-36 px with 13 px labels; the active tab sits on a white rounded tile. */
function NavRow() {
  const t = useTheme();
  const st = useLexi();
  return (
    <View accessibilityRole="tablist" style={s.nav}>
      {TABS.map(([v, icon, name]) => {
        const on = st.view === v;
        return (
          <Pressable key={v} onPress={() => { closeEmoji(); showView(v); }} accessibilityRole="tab" accessibilityLabel={name} accessibilityState={{ selected: on }}
            style={({ pressed }) => [s.tab, on && t.shadow, {
              backgroundColor: on ? t.c.surface : 'transparent', paddingVertical: t.icons ? 4 : 12,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            }]}>
            {t.icons ? <Text style={t.emoji(on ? 36 : 34)}>{icon}</Text> : null}
            <Text style={[t.text(1, { bold: on, color: on ? t.c.ink : t.c.onBar }), { fontSize: t.icons ? 13 : 16, lineHeight: t.icons ? 17 : 22 }]}>{name}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Dock({ bottomInset, keyboardOpen }: { bottomInset: number; keyboardOpen: boolean }) {
  const t = useTheme();
  const st = useLexi();
  const home = st.view === 'home';
  return (
    <View style={[s.dock, {
      backgroundColor: t.c.bar, paddingBottom: (keyboardOpen ? 0 : bottomInset) + 10,
      borderTopWidth: t.barsBlend ? 1 : 0, borderTopColor: t.c.line,
    }]}>
      {keyboardOpen ? null : <NavRow />}
      {home ? <InputPill /> : null}
    </View>
  );
}

const s = StyleSheet.create({
  dock: { paddingHorizontal: 14, paddingTop: 8, gap: 10 },
  nav: { flexDirection: 'row', gap: 8 },
  tab: { flex: 1, alignItems: 'center', borderRadius: R.s },
  pill: { minHeight: 52, flexDirection: 'row', alignItems: 'flex-end', borderRadius: R.l, paddingLeft: 16, paddingRight: 4, paddingVertical: 4, gap: 2 },
  input: { flex: 1, minHeight: 44, paddingTop: 9, paddingBottom: 9, paddingHorizontal: 0 },
  send: { height: 44, borderRadius: R.pill, alignItems: 'center', justifyContent: 'center' },
});
