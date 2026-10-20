// The dock (DESIGN_WARM_PAPER §7): a surface strip with, on Home, the composer above the Settings / Home / Journal tabs.
// The composer is a sunken pill with the emoji button and one ink button: the mic when empty, send when there are
// words, stop while Lexi replies. The mic is voice-first (§11): it listens through pauses until Done, then asks
// Send, Say again or Fix.
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TextInput, View, type TextInputInstance } from 'react-native';
import type { IconName } from '../art';
import { closeEmoji, useField } from '../fields';
import { sendChat, stopChat } from '../script';
import { speak } from '../speech';
import { showView, useLexi, type View as ViewName } from '../store';
import { alpha } from '../tokens';
import { R, useTheme } from '../theme';
import { Btn, Butterfly, Icon, IconBtn, Press, T } from '../ui';
import { stopVoice, toggleVoice, useListeningId, type VoiceTarget } from '../voice';
import { EmojiButton } from './Inputs';

function Composer() {
  const t = useTheme();
  const st = useLexi();
  const f = useField('');
  const input = useRef<TextInputInstance>(null);
  const listening = useListeningId() === 'composer';
  // 'confirm' after Done: the words wait for Send, Say again or Fix.
  const [confirm, setConfirm] = useState(false);
  const voice = useRef<VoiceTarget>({ id: 'composer', continuous: true, getText: () => f.ref.current, setText: f.set }).current;
  const was = useRef(false);
  useEffect(() => {
    if (was.current && !listening) {
      const words = f.ref.current.trim();
      setConfirm(!!words);
      // Read the words back with the device voice when "read every message out loud" is on.
      if (words && st.settings.autoread) speak(words, { device: true });
    }
    was.current = listening;
  }, [listening, f.ref, st.settings.autoread]);
  useEffect(() => () => stopVoice('composer'), []);

  const send = () => {
    if (st.sending) { stopChat(); return; }
    stopVoice('composer');
    const v = f.ref.current.trim();
    if (!v) return;
    f.set(''); setConfirm(false); closeEmoji();
    sendChat(v);
  };
  const listen = () => { closeEmoji(); setConfirm(false); f.set(''); toggleVoice(voice); };
  const fix = () => { setConfirm(false); setTimeout(() => input.current?.focus(), 50); };
  const hasWords = !!f.value.trim();
  const base = t.txt('body');
  const right: { icon: IconName; label: string; words: string; go: () => void } = st.sending
    ? { icon: 'stop', label: 'Stop', words: 'Stop', go: send }
    : listening ? { icon: 'stop', label: 'Done', words: 'Done', go: () => toggleVoice(voice) }
    : hasWords ? { icon: 'send', label: 'Send', words: 'Send', go: send }
    : { icon: 'mic', label: 'Talk to Lexi', words: 'Speak', go: listen };

  return (
    <View style={{ gap: 10 }}>
      {listening ? (
        <View style={s.status} accessibilityLiveRegion="polite">
          <View style={{ padding: 10 }}><Butterfly size={t.presence} state="listening" /></View>
          <T v="caption" muted style={{ flex: 1 }}>Listening…</T>
          <Btn variant="primary" icon="check" label="Done" height={48} onPress={() => toggleVoice(voice)} />
        </View>
      ) : confirm ? (
        <View style={s.confirm}>
          <IconBtn icon="speaker" label="Read my words" words="Read" onPress={() => speak(f.ref.current, { device: true })} />
          <View style={{ flex: 1 }} />
          <Btn label="Fix" height={48} onPress={fix} />
          <Btn icon="mic" label="Say again" height={48} onPress={listen} />
          <Btn variant="primary" icon="send" label="Send" height={48} onPress={send} />
        </View>
      ) : null}
      <View style={[s.pill, { backgroundColor: t.c.sunken, borderColor: t.c.borderStrong }]}>
        <TextInput
          ref={input}
          value={f.value}
          onChangeText={v => { f.onChange(v); if (confirm) setConfirm(false); }}
          onSelectionChange={f.onSelectionChange}
          editable={!listening}
          placeholder={listening ? 'Listening…' : 'Ask Lexi…'}
          placeholderTextColor={t.c.inkMuted}
          accessibilityLabel="Message Lexi"
          multiline
          submitBehavior="submit"
          returnKeyType="send"
          onSubmitEditing={send}
          style={[base, s.input, { maxHeight: (base.lineHeight as number) * 4.5 }]}
        />
        <EmojiButton field={f} k="composer" />
        <IconBtn icon={right.icon} label={right.label} words={right.words} variant="ink" onPress={right.go} selected={listening || undefined} />
      </View>
    </View>
  );
}

const TABS: [ViewName, IconName, string][] = [['settings', 'settings', 'Settings'], ['home', 'home', 'Home'], ['journal', 'journal', 'Journal']];
/** Settings, Home and Journal: a 24 px line icon over a 16 px word. The active tab's word turns the accent ink at 600,
 *  with a 56 × 28 tint pill behind its icon. */
function Tabs() {
  const t = useTheme();
  const st = useLexi();
  return (
    <View accessibilityRole="tablist" style={{ flexDirection: 'row' }}>
      {TABS.map(([v, icon, name]) => {
        const on = st.view === v;
        return (
          <Press key={v} onPress={() => { closeEmoji(); showView(v); }} accessibilityRole="tab" accessibilityLabel={name} accessibilityState={{ selected: on }}
            style={{ flex: 1, minHeight: 56, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6, borderRadius: R.lg }}>
            {t.icons ? (
              <View style={{ width: 56, height: 28, borderRadius: R.full, alignItems: 'center', justifyContent: 'center', backgroundColor: on ? t.c.accentTint : 'transparent' }}>
                <Icon name={icon} color={on ? t.c.accentInk : t.c.ink} />
              </View>
            ) : null}
            <View style={!t.icons && on ? { paddingHorizontal: 12, borderRadius: R.full, backgroundColor: t.c.accentTint } : null}>
              <T v="label" em={16 / t.fs} w={on ? 600 : 500} color={on ? t.c.accentInk : t.c.ink}>{name}</T>
            </View>
          </Press>
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
      backgroundColor: t.card, borderTopColor: t.c.hairline, paddingHorizontal: t.gutter,
      paddingBottom: (keyboardOpen ? 8 : bottomInset) + 6, paddingTop: home ? 10 : 4,
    }, !t.dark && Platform.OS === 'ios' && { boxShadow: '0 -4px 12px ' + alpha(t.c.ink, 0.06) }]}>
      {home ? <Composer /> : null}
      {keyboardOpen ? null : <Tabs />}
    </View>
  );
}

const s = StyleSheet.create({
  dock: { gap: 6, borderTopWidth: 1 },
  status: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  confirm: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  pill: { minHeight: 56, flexDirection: 'row', alignItems: 'flex-end', borderRadius: 28, borderWidth: 1, paddingLeft: 16, paddingRight: 3, paddingVertical: 3, gap: 2 },
  input: { flex: 1, minHeight: 48, paddingTop: 11, paddingBottom: 11, paddingHorizontal: 0 },
});
