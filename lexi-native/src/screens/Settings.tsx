// ⚙️ Settings: everything from lexi.html, plus the clearly marked optional "Chat brain" API key.
import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MODEL } from '../ai';
import { ACCENTS, AVATARS, FONTS, MODES, SIZES, SPACING, TONES, TOPICS, type Settings } from '../content';
import { useField } from '../fields';
import { intro } from '../script';
import { removeAllEntries, removeCustom, setApiKey, setSetting, showView, toast, useLexi } from '../store';
import { mix, useTheme, verdanaIsNative } from '../theme';
import { Btn, Chip, Ico, Row, Swatch, T } from '../ui';
import { Box } from '../components/Inputs';

function Section({ icon, title, note, children, last }: { icon: string; title: string; note?: string; children?: React.ReactNode; last?: boolean }) {
  const t = useTheme();
  return (
    <View style={[s.set, { borderBottomColor: t.c.line, borderBottomWidth: last ? 0 : 2 }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ico e={icon} size={Math.round(t.fs * 1.1)} />
        <T display bold accessibilityRole="header">{title}</T>
      </View>
      {note ? <T em={0.85} soft>{note}</T> : null}
      {children}
    </View>
  );
}

function Seg<K extends keyof Settings>({ k, v, label, icon, labelStyle, children, a11y }: {
  k: K; v: Settings[K]; label?: string; icon?: string; labelStyle?: object; children?: React.ReactNode; a11y?: string;
}) {
  const st = useLexi();
  return <Chip label={label} icon={icon} selected={String(st.settings[k]) === String(v)} onPress={() => setSetting(k, v)} labelStyle={labelStyle} a11y={a11y}>{children}</Chip>;
}

function ChatBrain() {
  const t = useTheme();
  const st = useLexi();
  const key = useField('');
  if (st.apiKey) {
    return (
      <Section icon="🔑" title="Chat brain (optional)"
        note={st.aiOk ? "On. Free chat, ✨ Tidy spelling and reflections use Claude. Your key is kept in this phone's keychain." : "Your API key didn't work. Remove it and paste a new one."}>
        <T em={0.85} soft>{'Model: ' + MODEL + '. What you send to the chat brain goes to Anthropic.'}</T>
        <Row gap={8}><Chip icon="🗑️" label="Remove key" onPress={() => { setApiKey(null); toast('Chat brain turned off. 🔌'); }} /></Row>
      </Section>
    );
  }
  return (
    <Section icon="🔑" title="Chat brain (optional)"
      note="Off. Free chat, ✨ Tidy spelling and reflections need Claude, an AI from Anthropic. Paste your own Anthropic API key to turn them on. Check-ins, writing, voice typing and your journal work without it.">
      <Box field={key} placeholder="sk-ant-…" accessibilityLabel="Anthropic API key" secureTextEntry autoCapitalize="none" autoCorrect={false} />
      <Row gap={8}>
        <Btn variant="primary" icon="✔️" label="Save key" disabled={!key.value.trim()}
          onPress={() => { setApiKey(key.ref.current); key.set(''); toast('Chat brain is on. 🤖'); }} />
      </Row>
      <T em={0.8} soft>What you send to the chat brain goes to Anthropic. Get a key at console.anthropic.com.</T>
    </Section>
  );
}

export function SettingsScreen() {
  const t = useTheme();
  const st = useLexi();
  const S = st.settings;
  const [wipeAsk, setWipeAsk] = useState(false);
  const customs: [string, number, { e: string; label: string; band?: string }][] = [];
  (st.custom.mood || []).forEach((m, i) => customs.push(['mood', i, m]));
  TOPICS.forEach(tp => (st.custom[tp.key] || []).forEach((m, i) => customs.push([tp.key, i, m])));

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: t.narrow ? 10 : 12, paddingTop: 18, paddingBottom: 28 }} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 4 }}>
        <T em={1.45} display bold accessibilityRole="header">⚙️ Settings</T>
        <T em={0.85} soft>Make Lexi easy on your eyes and your brain.</T>
      </View>

      <Section icon="🧠" title="Icons and emoji" note="If icons don't work for your brain, turn them off. Words will show instead.">
        <Row gap={8}><Seg k="icons" v={true} label="Icons on" /><Seg k="icons" v={false} label="Words only" /></Row>
      </Section>

      <Section icon="🔤" title="Font" note={verdanaIsNative ? undefined : "Android phones don't have Verdana, so Lexi shows Atkinson Hyperlegible for it."}>
        <Row gap={8}>{(Object.keys(FONTS) as Settings['font'][]).map(k => <Seg key={k} k="font" v={k} label={FONTS[k]} labelStyle={t.fontPreview(k)} />)}</Row>
      </Section>

      <Section icon="🔠" title="Text size">
        <Row gap={8}>{(Object.keys(SIZES) as Settings['size'][]).map(k => <Seg key={k} k="size" v={k} label={SIZES[k][0]} />)}</Row>
      </Section>

      <Section icon="↕️" title="Line spacing" note="Wider gaps between lines can make reading easier.">
        <Row gap={8}>{(Object.keys(SPACING) as Settings['spacing'][]).map(k => <Seg key={k} k="spacing" v={k} label={SPACING[k][0]} />)}</Row>
      </Section>

      <Section icon="🎨" title="Colors">
        <Row gap={8}>{(Object.keys(ACCENTS) as Settings['accent'][]).map(k => <Seg key={k} k="accent" v={k} label={ACCENTS[k][0]}><Swatch color={ACCENTS[k][1]} /></Seg>)}</Row>
      </Section>

      <Section icon="🌗" title="Light or dark" note="Dark flips the background and the text.">
        <Row gap={8}>{(Object.keys(MODES) as Settings['mode'][]).map(k => <Seg key={k} k="mode" v={k} icon={MODES[k][1]} label={MODES[k][0]} />)}</Row>
      </Section>

      <Section icon="✋🏽" title="Skin tone">
        <Row gap={8}>
          {TONES.map(([tn, name]) => (
            <Seg key={name} k="tone" v={tn} label={name} a11y={name + ' skin tone'}>
              <Text style={t.emoji(Math.round(t.fs * 1.2))}>{'✋' + tn}</Text>
            </Seg>
          ))}
        </Row>
      </Section>

      <Section icon={S.avatar} title="My avatar">
        <Row gap={8}>
          {AVATARS.map(a => (
            <Seg key={a} k="avatar" v={a} a11y={'Avatar ' + a}>
              <Text style={t.emoji(Math.round(t.fs * 1.4))}>{t.toned(a)}</Text>
            </Seg>
          ))}
        </Row>
      </Section>

      <Section icon="🔊" title="Read aloud" note="Lexi can read every message out loud. You can also tap 🔊 on any message.">
        <Row gap={8}><Seg k="autoread" v={true} label="Read Lexi out loud" /><Seg k="autoread" v={false} label="Only when I tap" /></Row>
      </Section>

      <Section icon="🎙" title="Voice typing"
        note={'Tap 🎙 next to 🙂 and say your words. Your phone turns speech into text' + (Platform.OS === 'ios' ? ' with Apple speech recognition.' : ' with its speech service (usually Google).')} />

      <Section icon="🏷️" title="My own words" note={customs.length ? 'Words and emoji you added. Tap ✖️ to remove one.' : 'Add your own feeling words with ➕ My own during a check-in.'}>
        {customs.length ? (
          <Row gap={8}>
            {customs.map(([g, i, m]) => (
              <View key={g + i + m.label} style={[s.custom, { backgroundColor: mix(t.band(m.band).b, t.c.surface, 0.3) }]}>
                <T>{m.e + ' ' + m.label}</T>
                <Chip icon="✖️" words="Remove" a11y={'Remove ' + m.label} onPress={() => removeCustom(g, i)} style={{ minHeight: 36, borderColor: 'transparent', backgroundColor: 'transparent', paddingHorizontal: 6 }} />
              </View>
            ))}
          </Row>
        ) : null}
      </Section>

      <ChatBrain />

      <Section icon="💾" title="Your journal" note="Saved on this device only." last>
        <Row gap={8}>
          <Chip icon="🔁" label="Replay Lexi's intro" onPress={() => { showView('home'); intro(); }} />
          <Chip icon="🗑️" label="Delete all entries" onPress={() => setWipeAsk(true)} />
        </Row>
        {wipeAsk ? (
          <View style={[s.confirm, { backgroundColor: t.c.surface2 }]}>
            <T bold style={{ flexGrow: 1, flexBasis: t.fs * 10 }}>{'Delete all ' + st.entries.length + " entries? This can't be undone."}</T>
            <Btn label="Keep them" onPress={() => setWipeAsk(false)} />
            <Btn variant="danger" label="Delete all" onPress={() => { setWipeAsk(false); removeAllEntries(); toast('All entries deleted. 🗑️'); }} />
          </View>
        ) : null}
      </Section>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  set: { gap: 8, paddingVertical: 16 },
  custom: { flexDirection: 'row', alignItems: 'center', gap: 2, paddingLeft: 12, paddingRight: 2, borderRadius: 999 },
  confirm: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: 10, borderRadius: 14 },
});
