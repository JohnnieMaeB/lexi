// ⚙️ Settings: themes, reading comfort, 🔊 voice, and the clearly marked optional "Chat brain" API key.
import React, { useEffect, useState } from 'react';
import { Image, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { MODEL } from '../ai';
import { AVATARS, FONTS, PITCH_RANGE, RATE_RANGE, SIZES, SPACING, THEME_NAMES, TONES, TOPICS, type Settings, type ThemeKey } from '../content';
import { useField } from '../fields';
import { intro } from '../script';
import { DEVICE_LINE, NATURAL_LINE, SPEED_LINE, TEST_LINE, bestVoice, currentVoice, speak, stopSpeaking, useVoices, type RankedVoice } from '../speech';
import { removeAllEntries, removeCustom, setApiKey, setSetting, showView, toast, useLexi } from '../store';
import { PALETTES, R, mix, useTheme, verdanaIsNative, type Palette } from '../theme';
import { Badge, Btn, Chip, Ico, Row, T } from '../ui';
import { Box } from '../components/Inputs';

const BUTTERFLY = require('../../assets/butterfly.png');

function Section({ icon, title, note, children }: { icon: string; title: string; note?: string; children?: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={[s.section, t.shadow, { backgroundColor: t.c.surface }, t.dark && { borderWidth: 1, borderColor: t.c.line }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ico e={icon} size={32} />
        <T display bold accessibilityRole="header" style={{ flex: 1 }}>{title}</T>
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

/* ---------- themes ---------- */
function MiniPhone({ p, butterfly, w, h }: { p: Palette; butterfly?: boolean; w: number; h: number }) {
  const blend = p.bar === p.bg;
  return (
    <View style={{ width: w, height: h, backgroundColor: p.bg, overflow: 'hidden' }}>
      <View style={{ height: 12, backgroundColor: p.bar, borderBottomWidth: blend ? 1 : 0, borderBottomColor: p.line }} />
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ width: 4, backgroundColor: p.bar }} />
        <View style={{ flex: 1, padding: 6, gap: 5 }}>
          {butterfly ? <Image source={BUTTERFLY} resizeMode="contain" style={{ position: 'absolute', alignSelf: 'center', top: 2, width: w * 0.5, height: h * 0.62, tintColor: '#FFB877', opacity: 0.3 }} /> : null}
          <View style={{ width: '70%', height: 12, borderRadius: 6, backgroundColor: p.bot, borderWidth: p.botLine ? 1 : 0, borderColor: p.botLine || 'transparent' }} />
          <View style={{ width: '58%', height: 12, borderRadius: 6, backgroundColor: p.bot, borderWidth: p.botLine ? 1 : 0, borderColor: p.botLine || 'transparent' }} />
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <View style={{ width: 16, height: 9, borderRadius: 5, backgroundColor: p.yes }} />
            <View style={{ width: 16, height: 9, borderRadius: 5, borderWidth: 1.5, borderColor: p.yes, backgroundColor: p.surface }} />
          </View>
        </View>
        <View style={{ width: 4, backgroundColor: p.bar }} />
      </View>
      <View style={{ height: 14, backgroundColor: p.bar, borderTopWidth: blend ? 1 : 0, borderTopColor: p.line, justifyContent: 'center', paddingHorizontal: 6 }}>
        <View style={{ height: 7, borderRadius: 4, backgroundColor: p.surface }} />
      </View>
    </View>
  );
}

function ThemePicker() {
  const t = useTheme();
  const st = useLexi();
  const w = Math.floor((t.contentW - 28 - 20) / 3);
  const h = Math.round(w * 1.15);
  const keys: ThemeKey[] = ['auto', 'orange', 'purple', 'mint', 'night', 'ember'];
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      {keys.map(k => {
        const on = st.settings.theme === k;
        return (
          <Pressable key={k} onPress={() => setSetting('theme', k)} accessibilityRole="button" accessibilityLabel={THEME_NAMES[k] + ' theme'} accessibilityState={{ selected: on }}
            style={({ pressed }) => [{ width: w, alignItems: 'center', gap: 6, transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
            <View style={[{ borderRadius: R.s, borderWidth: 3, borderColor: on ? t.c.ring : 'transparent', padding: 2 }, on && t.shadow]}>
              <View style={{ borderRadius: R.s - 4, overflow: 'hidden', flexDirection: 'row', borderWidth: 1, borderColor: t.c.line }}>
                {k === 'auto' ? (
                  <>
                    <MiniPhone p={PALETTES.orange} w={Math.floor((w - 10) / 2)} h={h} />
                    <MiniPhone p={PALETTES.ember} butterfly w={Math.ceil((w - 10) / 2)} h={h} />
                  </>
                ) : <MiniPhone p={PALETTES[k]} butterfly={k === 'ember'} w={w - 10} h={h} />}
              </View>
              {on ? <Badge /> : null}
            </View>
            <T em={0.8} bold={on} style={{ textAlign: 'center' }}>{THEME_NAMES[k]}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- voice ---------- */
/** One of the two big "how does Lexi sound" choices. */
function BigChoice({ icon, title, tag, detail, on, onPress }: { icon: string; title: string; tag?: string; detail: string; on: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={title + (tag ? ', ' + tag : '') + '. ' + detail}
      style={({ pressed }) => [s.big, on && t.shadow, {
        borderWidth: 3, borderColor: on ? t.c.ring : t.c.line, backgroundColor: on ? t.c.sel : t.c.surface, transform: [{ scale: pressed ? 0.98 : 1 }],
      }]}>
      <Ico e={icon} size={36} />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <T bold>{title}</T>
          {tag ? <View style={[s.tag, { backgroundColor: t.c.bot }]}><T em={0.7} bold color={t.c.botInk}>{tag}</T></View> : null}
        </View>
        <T em={0.8} soft>{detail}</T>
      </View>
      {on ? <Badge /> : null}
    </Pressable>
  );
}

function VoiceRow({ v, title, detail, on, onPick }: { v?: RankedVoice; title: string; detail: string; on: boolean; onPick: () => void }) {
  const t = useTheme();
  return (
    <View style={[s.voice, { borderColor: on ? t.c.ring : t.c.line, borderWidth: on ? 3 : 1.5, backgroundColor: on ? t.c.sel : t.c.surface }]}>
      <Pressable onPress={onPick} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={title + ', ' + detail}
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 48 }}>
        <View style={[s.radio, { borderColor: on ? t.c.ring : t.c.inkSoft }]}>{on ? <View style={[s.radioDot, { backgroundColor: t.c.ring }]} /> : null}</View>
        <View style={{ flex: 1 }}>
          <T bold={on} raw>{title}</T>
          <T em={0.75} soft raw>{detail}</T>
        </View>
      </Pressable>
      <Pressable onPress={() => speak(NATURAL_LINE, { voice: v?.identifier ?? bestVoice()?.identifier })} accessibilityRole="button" accessibilityLabel={'Play a sample of ' + title}
        hitSlop={6} style={({ pressed }) => [s.play, { borderColor: t.c.yes, backgroundColor: pressed ? t.c.yes : 'transparent' }]}>
        {({ pressed }) => <Text style={{ color: pressed ? t.c.onYes : t.c.yes, fontSize: 18, lineHeight: 22, fontWeight: '700' }}>▶</Text>}
      </Pressable>
    </View>
  );
}

function Stepper({ label, value, range, step, low, high, onChange }: {
  label: string; value: number; range: readonly [number, number]; step: number; low: string; high: string; onChange: (v: number) => void;
}) {
  const t = useTheme();
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  const set = (x: number) => { const r = Math.round(Math.min(range[1], Math.max(range[0], x)) * 100) / 100; setV(r); onChange(r); };
  return (
    <View style={{ gap: 2 }}>
      <T bold>{label + ': ' + v.toFixed(2).replace(/0$/, '') + '×'}</T>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Chip words="Less" icon="➖" a11y={label + ' down'} onPress={() => set(v - step)} style={{ paddingHorizontal: 10 }} />
        <Slider style={{ flex: 1, height: 44 }} minimumValue={range[0]} maximumValue={range[1]} step={step} value={v}
          onValueChange={x => setV(Math.round(x * 100) / 100)} onSlidingComplete={x => set(x)}
          minimumTrackTintColor={t.c.ring} maximumTrackTintColor={t.c.line} thumbTintColor={t.c.yes} accessibilityLabel={label} />
        <Chip words="More" icon="➕" a11y={label + ' up'} onPress={() => set(v + step)} style={{ paddingHorizontal: 10 }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <T em={0.75} soft>{low}</T><T em={0.75} soft>{high}</T>
      </View>
    </View>
  );
}

function VoiceSection() {
  const t = useTheme();
  const st = useLexi();
  const S = st.settings;
  const voices = useVoices();
  const [all, setAll] = useState(false);
  useEffect(() => () => stopSpeaking(), []);
  const english = (voices || []).filter(v => v.english);
  const top = (english.length ? english : voices || []).slice(0, 5);
  const list = all ? voices || [] : top;
  const best = bestVoice();
  // A picked voice that was uninstalled falls back to the best one, so "Best" shows as chosen then.
  const autoPick = !S.voice || !(voices || []).some(v => v.identifier === S.voice);
  const tip = Platform.OS === 'ios'
    ? 'For a more natural voice on iPhone: open Settings › Accessibility › Spoken Content › Voices › English, and download an Enhanced or Premium voice. Then come back here and pick it.'
    : 'For a more natural voice on Android: install or update "Speech Services by Google", then open Settings › Accessibility › Text-to-speech output and download a voice. Then come back here and pick it.';
  const natural = S.lexiVoice !== 'device';
  const pickLexi = (v: Settings['lexiVoice']) => { setSetting('lexiVoice', v); speak(v === 'device' ? DEVICE_LINE : NATURAL_LINE); };
  return (
    <Section icon="🔊" title="Voice" note="Pick how Lexi sounds when she reads out loud.">
      <View style={{ gap: 10 }} accessibilityRole="radiogroup">
        <BigChoice icon="🎙️" title="Lexi's own voice" tag="Natural" on={natural} onPress={() => pickLexi('natural')}
          detail="Lexi's words are recorded. Your writing and her chat replies use a voice from this device." />
        <BigChoice icon="📱" title="A voice from this device" on={!natural} onPress={() => pickLexi('device')}
          detail="Everything is read by the voice you pick below." />
      </View>

      <T bold style={{ marginTop: 6 }}>{natural ? 'Device voice (for everything else)' : 'Device voice'}</T>
      {voices === null ? <T soft>Looking for voices…</T> : null}
      {voices && !voices.length ? <T soft>This phone didn't list any voices. Lexi will use its default voice.</T> : null}
      {voices && voices.length ? (
        <View style={{ gap: 8 }} accessibilityRole="radiogroup">
          <VoiceRow title="⭐ Best on this phone" detail={best ? best.label + ' · ' + best.detail : 'Default voice'} on={autoPick} onPick={() => setSetting('voice', '')} />
          {list.map(v => (
            <VoiceRow key={v.identifier} v={v} title={v.label} detail={v.detail} on={S.voice === v.identifier} onPick={() => setSetting('voice', v.identifier)} />
          ))}
          {voices.length > top.length ? (
            <Row><Chip icon={all ? '🔼' : '🔽'} label={all ? 'Show fewer voices' : 'Show all voices (' + voices.length + ')'} onPress={() => setAll(!all)} /></Row>
          ) : null}
        </View>
      ) : null}

      <Stepper label="Speed" value={S.rate} range={RATE_RANGE} step={0.05} low="🐢 Slower" high="🐇 Faster"
        onChange={v => { setSetting('rate', v); speak(SPEED_LINE); }} />
      <Stepper label="Pitch" value={S.pitch} range={PITCH_RANGE} step={0.05} low="Lower" high="Higher"
        onChange={v => { setSetting('pitch', v); speak(SPEED_LINE, { voice: currentVoice()?.identifier }); }} />
      {natural ? <T em={0.75} soft>Pitch changes the device voice only. Speed changes both.</T> : null}
      <Row><Btn variant="primary" icon="🔊" label="Test Lexi's voice" onPress={() => speak(TEST_LINE)} /></Row>

      <T bold style={{ marginTop: 4 }}>Read Lexi out loud?</T>
      <Row gap={8}><Seg k="autoread" v={true} label="Read every message" /><Seg k="autoread" v={false} label="Only when I tap 🔊" /></Row>

      <View style={[s.tip, { backgroundColor: t.c.surface2 }]}>
        <Ico e="💡" size={28} />
        <T em={0.85} style={{ flex: 1 }}>{tip}</T>
      </View>
      <T em={0.75} soft>Lexi's own voice was made with Piper TTS and the public-domain LJ Speech voice.</T>
    </Section>
  );
}

function ChatBrain() {
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
    <ScrollView contentContainerStyle={{ paddingHorizontal: t.pad, paddingTop: 20, paddingBottom: 28, gap: 14 }} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ico e="⚙️" size={36} />
          <T em={1.45} display bold accessibilityRole="header">Settings</T>
        </View>
        <T em={0.85} soft>Make Lexi easy on your eyes and your brain.</T>
      </View>

      <Section icon="🎨" title="Theme" note="Match my device: Orange by day, Ember at night.">
        <ThemePicker />
      </Section>

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

      <VoiceSection />

      <Section icon="✋🏽" title="Skin tone">
        <Row gap={8}>
          {TONES.map(([tn, name]) => (
            <Seg key={name} k="tone" v={tn} label={name} a11y={name + ' skin tone'}>
              <Text style={t.emoji(30)}>{'✋' + tn}</Text>
            </Seg>
          ))}
        </Row>
      </Section>

      <Section icon={S.avatar} title="My avatar">
        <Row gap={8}>
          {AVATARS.map(a => (
            <Seg key={a} k="avatar" v={a} a11y={'Avatar ' + a}>
              <Text style={t.emoji(38)}>{t.toned(a)}</Text>
            </Seg>
          ))}
        </Row>
      </Section>

      <Section icon="🎙" title="Voice typing"
        note={'Tap 🎙 next to 🙂 and say your words. Your phone turns speech into text' + (Platform.OS === 'ios' ? ' with Apple speech recognition.' : ' with its speech service (usually Google).')} />

      <Section icon="🏷️" title="My own words" note={customs.length ? 'Words and emoji you added. Tap ✖️ to remove one.' : 'Add your own feeling words with ➕ My own during a check-in.'}>
        {customs.length ? (
          <Row gap={8}>
            {customs.map(([g, i, m]) => (
              <View key={g + i + m.label} style={[s.custom, { backgroundColor: mix(t.band(m.band).b, t.c.surface, 0.3) }]}>
                <Ico e={m.e} size={26} />
                <T>{m.label}</T>
                <Chip icon="✖️" iconSize={18} words="Remove" a11y={'Remove ' + m.label} onPress={() => removeCustom(g, i)} style={{ minHeight: 40, borderColor: 'transparent', backgroundColor: 'transparent', paddingHorizontal: 6 }} />
              </View>
            ))}
          </Row>
        ) : null}
      </Section>

      <ChatBrain />

      <Section icon="💾" title="Your journal" note="Saved on this device only.">
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
  section: { gap: 10, padding: 14, borderRadius: R.m },
  custom: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 10, paddingRight: 2, borderRadius: 999 },
  confirm: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: 12, borderRadius: R.s },
  voice: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 12, paddingRight: 8, paddingVertical: 4, borderRadius: R.s },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
  play: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center', paddingLeft: 3 },
  tip: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 12, borderRadius: R.s },
  big: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72, paddingVertical: 12, paddingHorizontal: 14, borderRadius: R.m },
  tag: { paddingHorizontal: 8, paddingVertical: 1, borderRadius: 999 },
});
