// ⚙️ Settings (DESIGN_WARM_PAPER §10): raised sections for the look, reading comfort, 🔊 voice, and the clearly
// marked optional "Chat brain" API key.
import React, { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { MODEL } from '../ai';
import { AVATARS, FONTS, HIGHLIGHTS, LETTERS, PACES, PITCH_RANGE, RATE_RANGE, SIZES, SPACING, THEME_NAMES, TONES, TOPICS, type Settings, type ThemeKey } from '../content';
import { PrivacyLines, SpeakIcon } from '../components/Help';
import { shareJournalPdf } from '../exportPdf';
import { useField } from '../fields';
import { REMINDER_BODY, applyReminders, askPermission, fmtClock } from '../reminders';
import { intro, quickStart } from '../script';
import { DEVICE_LINE, NATURAL_LINE, SPEED_LINE, TEST_LINE, bestVoice, currentVoice, speak, stopSpeaking, useVoices, type RankedVoice } from '../speech';
import { deleteEverything, removeCustom, setApiKey, setSetting, showView, state, toast, useLexi } from '../store';
import { LOOKS, LOOK_ORDER, type Palette } from '../tokens';
import { R, useTheme, verdanaIsNative } from '../theme';
import { Badge, Btn, Card, Chip, Icon, IconBtn, Ico, Press, Row, T } from '../ui';
import { Box } from '../components/Inputs';

// FEATURES_SOON §14 (both recorded).
const BASIC_NOTE = 'Your device only has basic voices, so they may sound robotic. My own voice still reads my regular lines.';
const CANT_HEAR = "Can't hear anything? Check that your sound is on and silent mode is off.";
const DELETE_ASK = "Delete everything? Your entries, settings and words will be gone. This can't be undone.";

/** A raised section with its heading in `title` (emoji kept). */
function Section({ icon, title, note, children }: { icon: string; title: string; note?: string; children?: React.ReactNode }) {
  const t = useTheme();
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {icon ? <Ico e={icon} size={Math.round(t.fs * 1.5)} /> : null}
        <T v="title" accessibilityRole="header" style={{ flex: 1 }}>{title}</T>
      </View>
      {note ? <T muted>{note}</T> : null}
      {children}
    </Card>
  );
}

function Seg<K extends keyof Settings>({ k, v, label, emoji, emojiSize, labelStyle, children, a11y }: {
  k: K; v: Settings[K]; label?: string; emoji?: string; emojiSize?: number; labelStyle?: object; children?: React.ReactNode; a11y?: string;
}) {
  const st = useLexi();
  return <Chip label={label} emoji={emoji} emojiSize={emojiSize} selected={String(st.settings[k]) === String(v)} onPress={() => setSetting(k, v)} labelStyle={labelStyle} a11y={a11y}>{children}</Chip>;
}

/* ---------- the look ---------- */
/** A look's preview (§10): its canvas, a Lexi turn, a user turn and a dock strip. No bars or rails. */
function MiniPhone({ p, w, h }: { p: Palette; w: number; h: number }) {
  return (
    <View style={{ width: w, height: h, backgroundColor: p.canvas, overflow: 'hidden' }}>
      <View style={{ flex: 1, padding: 7, gap: 6, justifyContent: 'center' }}>
        <View style={{ width: '74%', height: 14, borderRadius: 7, borderBottomLeftRadius: 3, backgroundColor: p.lexi }} />
        <View style={{ width: '56%', height: 14, borderRadius: 7, borderBottomRightRadius: 3, alignSelf: 'flex-end', backgroundColor: p.me, borderWidth: p.meEdge ? 1 : 0, borderColor: p.hairline }} />
        <View style={{ width: 22, height: 10, borderRadius: 5, backgroundColor: p.accent }} />
      </View>
      <View style={{ height: 16, backgroundColor: p.dark ? p.raised : p.surface, borderTopWidth: 1, borderTopColor: p.hairline, justifyContent: 'center', paddingHorizontal: 7 }}>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: p.sunken }} />
      </View>
    </View>
  );
}

function LookPicker() {
  const t = useTheme();
  const st = useLexi();
  const [w0, setW0] = useState(0);
  const cols = w0 && w0 / 3 >= t.em * 5.5 ? 3 : 2;
  const w = w0 ? Math.floor((w0 - 12 * (cols - 1)) / cols) : 0;
  const h = Math.round(w * 0.9);
  return (
    <View onLayout={e => setW0(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
      {w ? LOOK_ORDER.map((k: ThemeKey) => {
        const on = st.settings.theme === k;
        return (
          <Press key={k} onPress={() => setSetting('theme', k)} accessibilityRole="radio" accessibilityLabel={THEME_NAMES[k] + ' look'} accessibilityState={{ checked: on }}
            style={{ width: w, alignItems: 'center', gap: 8 }}>
            <View style={[{ borderRadius: R.md, overflow: 'hidden', flexDirection: 'row', borderWidth: 1, borderColor: t.c.hairline },
              on && { outlineWidth: 2, outlineStyle: 'solid', outlineColor: t.c.accentInk, outlineOffset: 2 }]}>
              {k === 'auto' ? (
                <>
                  <MiniPhone p={LOOKS.cream} w={Math.floor((w - 2) / 2)} h={h} />
                  <MiniPhone p={LOOKS.ember} w={Math.ceil((w - 2) / 2)} h={h} />
                </>
              ) : <MiniPhone p={LOOKS[k]} w={w - 2} h={h} />}
              {on ? <Badge /> : null}
            </View>
            <T v="label" w={on ? 600 : 500} style={{ textAlign: 'center' }}>{THEME_NAMES[k]}</T>
          </Press>
        );
      }) : null}
    </View>
  );
}

/* ---------- voice ---------- */
/** One of the two big "how does Lexi sound" choices. */
function BigChoice({ icon, title, tag, detail, on, onPress }: { icon: string; title: string; tag?: string; detail: string; on: boolean; onPress: () => void }) {
  const t = useTheme();
  return (
    <Press onPress={onPress} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={title + (tag ? ', ' + tag : '') + '. ' + detail}
      style={[s.big, on
        ? { borderWidth: 1, borderColor: t.c.accentInk, backgroundColor: t.c.accentTint, outlineWidth: 2, outlineStyle: 'solid', outlineColor: t.c.accentInk, outlineOffset: 0 }
        : { borderWidth: 1, borderColor: t.c.hairline, backgroundColor: t.card }]}>
      <Ico e={icon} size={Math.round(t.fs * 1.8)} />
      <View style={{ flex: 1, gap: 2 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
          <T v="label" w={600}>{title}</T>
          {tag ? <View style={[s.tag, { backgroundColor: t.c.lexi }]}><T v="caption">{tag}</T></View> : null}
        </View>
        <T v="caption" muted>{detail}</T>
      </View>
      {on ? <Badge /> : null}
    </Press>
  );
}

function VoiceRow({ v, title, detail, on, onPick }: { v?: RankedVoice; title: string; detail: string; on: boolean; onPick: () => void }) {
  const t = useTheme();
  return (
    <View style={[s.voice, { borderColor: on ? t.c.accentInk : t.c.hairline, borderWidth: on ? 2 : 1, backgroundColor: on ? t.c.accentTint : t.card }]}>
      <Pressable onPress={onPick} accessibilityRole="radio" accessibilityState={{ checked: on }} accessibilityLabel={title + ', ' + detail}
        style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 }}>
        <View style={[s.radio, { borderColor: on ? t.c.accentInk : t.c.borderStrong }]}>{on ? <View style={[s.radioDot, { backgroundColor: t.c.accentInk }]} /> : null}</View>
        <View style={{ flex: 1 }}>
          <T v="label" w={on ? 600 : 500} raw>{title}</T>
          <T v="caption" muted raw>{detail}</T>
        </View>
      </Pressable>
      <IconBtn icon="play" label={'Play a sample of ' + title} words="Play" onPress={() => speak(NATURAL_LINE, { voice: v?.identifier ?? bestVoice()?.identifier })} />
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
    <View style={{ gap: 4 }}>
      <T v="label" w={600}>{label + ': ' + v.toFixed(2).replace(/0$/, '') + '×'}</T>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Chip emoji="➖" label={t.icons ? undefined : 'Less'} a11y={label + ' down'} onPress={() => set(v - step)} style={{ paddingHorizontal: 12 }} />
        <Slider style={{ flex: 1, height: 48 }} minimumValue={range[0]} maximumValue={range[1]} step={step} value={v}
          onValueChange={x => setV(Math.round(x * 100) / 100)} onSlidingComplete={x => set(x)}
          minimumTrackTintColor={t.c.accentInk} maximumTrackTintColor={t.c.borderStrong} thumbTintColor={t.c.accent} accessibilityLabel={label} />
        <Chip emoji="➕" label={t.icons ? undefined : 'More'} a11y={label + ' up'} onPress={() => set(v + step)} style={{ paddingHorizontal: 12 }} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <T v="caption" muted>{low}</T><T v="caption" muted>{high}</T>
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
  // Basic voices only (§14): nothing tagged Natural, Premium, Enhanced or Google.
  const basicOnly = !!voices && voices.length > 0 && !voices.some(v => /natural|neural|premium|enhanced|google/i.test(v.identifier + ' ' + v.name + ' ' + v.detail) || v.quality === 'Enhanced');
  const [tipsOpen, setTipsOpen] = useState<boolean | null>(null);
  const tipsShown = tipsOpen ?? basicOnly;
  const tip = Platform.OS === 'ios'
    ? 'For a more natural voice on iPhone: open Settings › Accessibility › Spoken Content › Voices › English, and download an Enhanced or Premium voice. Then come back here and pick it.'
    : 'For a more natural voice on Android: install or update "Speech Services by Google", then open Settings › Accessibility › Text-to-speech output and download a voice. Then come back here and pick it.';
  const natural = S.lexiVoice !== 'device';
  const pickLexi = (v: Settings['lexiVoice']) => { setSetting('lexiVoice', v); speak(v === 'device' ? DEVICE_LINE : NATURAL_LINE); };
  return (
    <Section icon="🔊" title="Voice" note="Pick how Lexi sounds when she reads out loud.">
      <View style={{ gap: 12 }} accessibilityRole="radiogroup">
        <BigChoice icon="🎙️" title="Lexi's own voice" tag="Natural" on={natural} onPress={() => pickLexi('natural')}
          detail="Lexi's words are recorded. Your writing and her chat replies use a voice from this device." />
        <BigChoice icon="📱" title="A voice from this device" on={!natural} onPress={() => pickLexi('device')}
          detail="Everything is read by the voice you pick below." />
      </View>

      <T v="label" w={600} style={{ marginTop: 4 }}>{natural ? 'Device voice (for everything else)' : 'Device voice'}</T>
      {/* Voice help (§14): say so when the phone only has basic voices. */}
      {basicOnly ? (
        <View style={[s.tip, { backgroundColor: t.c.sunken }]}>
          <Ico e="🤖" size={28} />
          <T style={{ flex: 1 }}>{BASIC_NOTE}</T>
          <SpeakIcon text={BASIC_NOTE} />
        </View>
      ) : null}
      {voices === null ? <T muted>Looking for voices…</T> : null}
      {voices && !voices.length ? <T muted>This phone didn't list any voices. Lexi will use its default voice.</T> : null}
      {voices && voices.length ? (
        <View style={{ gap: 8 }} accessibilityRole="radiogroup">
          <VoiceRow title="⭐ Best on this phone" detail={best ? best.label + ' · ' + best.detail : 'Default voice'} on={autoPick} onPick={() => setSetting('voice', '')} />
          {list.map(v => (
            <VoiceRow key={v.identifier} v={v} title={v.label} detail={v.detail} on={S.voice === v.identifier} onPick={() => setSetting('voice', v.identifier)} />
          ))}
          {voices.length > top.length ? (
            <Row><Chip icon="chevron" label={all ? 'Show fewer voices' : 'Show all voices (' + voices.length + ')'} onPress={() => setAll(!all)} /></Row>
          ) : null}
        </View>
      ) : null}

      <Stepper label="Speed" value={S.rate} range={RATE_RANGE} step={0.05} low="🐢 Slower" high="🐇 Faster"
        onChange={v => { setSetting('rate', v); speak(SPEED_LINE); }} />
      <Stepper label="Pitch" value={S.pitch} range={PITCH_RANGE} step={0.05} low="Lower" high="Higher"
        onChange={v => { setSetting('pitch', v); speak(SPEED_LINE, { voice: currentVoice()?.identifier }); }} />
      {natural ? <T v="caption" muted>Pitch changes the device voice only. Speed changes both.</T> : null}
      <Row><Btn variant="primary" icon="speaker" label="Test Lexi's voice" onPress={() => speak(TEST_LINE)} /></Row>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
        <T muted style={{ flex: 1 }}>{CANT_HEAR}</T>
        <SpeakIcon text={CANT_HEAR} />
      </View>

      <T v="label" w={600} style={{ marginTop: 4 }}>Read Lexi out loud?</T>
      <Row gap={8}><Seg k="autoread" v={true} label="Read every message" /><Seg k="autoread" v={false} label="Only when I tap 🔊" /></Row>

      {/* "Sounds robotic?" tips, open by default when the phone only has basic voices. */}
      <Press onPress={() => setTipsOpen(!tipsShown)} accessibilityRole="button" accessibilityState={{ expanded: tipsShown }}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 48 }}>
        <Ico e="💡" size={26} />
        <T v="label" w={600} style={{ flex: 1 }}>Sounds robotic?</T>
        <Icon name="chevron" style={tipsShown ? { transform: [{ rotate: '180deg' }] } : undefined} />
      </Press>
      {tipsShown ? (
        <View style={[s.tip, { backgroundColor: t.c.sunken }]}>
          <T style={{ flex: 1 }}>{tip}</T>
        </View>
      ) : null}
      <T v="caption" muted>Lexi's own voice was made with Piper TTS and the public-domain LJ Speech voice.</T>
    </Section>
  );
}

/** 🔔 Reminders (§13): off by default; permission is asked only when they're turned on. */
function Reminder() {
  const t = useTheme();
  const st = useLexi();
  const r = st.settings.reminders;
  const set = (next: Settings['reminders']) => { setSetting('reminders', next); applyReminders(next); };
  const turnOn = async () => {
    if (!(await askPermission())) { toast('Turn on notifications for Lexi in your phone settings to get reminders.'); return; }
    set({ ...r, on: true });
  };
  const shift = (mins: number) => {
    const total = (((r.hour * 60 + r.minute + mins) % 1440) + 1440) % 1440;
    set({ ...r, hour: Math.floor(total / 60), minute: total % 60 });
  };
  return (
    <Section icon="🔔" title="Reminders" note={'A kind nudge at a time you pick: "' + REMINDER_BODY + '"'}>
      <Row gap={8}>
        <Chip label="Off" selected={!r.on} onPress={() => set({ ...r, on: false })} />
        <Chip label="On" selected={r.on} onPress={turnOn} />
      </Row>
      {r.on ? (
        <>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Chip emoji="➖" label="Earlier" a11y="Earlier by 15 minutes" onPress={() => shift(-15)} />
            <T v="headline" style={{ minWidth: t.fs * 6, textAlign: 'center' }} accessibilityLabel={'Reminder time ' + fmtClock(r.hour, r.minute)}>
              {fmtClock(r.hour, r.minute)}
            </T>
            <Chip emoji="➕" label="Later" a11y="Later by 15 minutes" onPress={() => shift(15)} />
          </View>
          <Row gap={8}>
            <Chip label="Daily" selected={r.every === 'daily'} onPress={() => set({ ...r, every: 'daily' })} />
            <Chip label="Every other day" selected={r.every === 'alternate'} onPress={() => set({ ...r, every: 'alternate' })} />
          </Row>
        </>
      ) : null}
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
        <T v="caption" muted>{'Model: ' + MODEL + '. What you send to the chat brain goes to Anthropic.'}</T>
        <Row gap={8}><Chip icon="delete" label="Remove key" onPress={() => { setApiKey(null); toast('Chat brain turned off. 🔌'); }} /></Row>
      </Section>
    );
  }
  return (
    <Section icon="🔑" title="Chat brain (optional)"
      note="Off. Free chat, ✨ Tidy spelling and reflections need Claude, an AI from Anthropic. Paste your own Anthropic API key to turn them on. Check-ins, writing, voice typing and your journal work without it.">
      <Box field={key} placeholder="sk-ant-…" accessibilityLabel="Anthropic API key" secureTextEntry autoCapitalize="none" autoCorrect={false} />
      <Row gap={8}>
        <Btn variant="primary" icon="check" label="Save key" disabled={!key.value.trim()}
          onPress={() => { setApiKey(key.ref.current); key.set(''); toast('Chat brain is on. 🤖'); }} />
      </Row>
      <T v="caption" muted>What you send to the chat brain goes to Anthropic. Get a key at console.anthropic.com.</T>
    </Section>
  );
}

export function SettingsScreen() {
  const t = useTheme();
  const st = useLexi();
  const S = st.settings;
  const [wipeAsk, setWipeAsk] = useState(false);
  const [exporting, setExporting] = useState(false);
  const makePdf = async (range: 'month' | 'all') => {
    setExporting(true);
    try { if (!(await shareJournalPdf(st.entries, range))) toast("Sharing isn't available on this phone."); }
    catch (e) { console.warn('pdf', e); toast("I couldn't make the PDF. Try again."); }
    finally { setExporting(false); }
  };
  const customs: [string, number, { e: string; label: string; band?: string }][] = [];
  (st.custom.mood || []).forEach((m, i) => customs.push(['mood', i, m]));
  TOPICS.forEach(tp => (st.custom[tp.key] || []).forEach((m, i) => customs.push([tp.key, i, m])));
  const hlLook = t.c.highlight;

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: t.gutter, paddingTop: 16, paddingBottom: 32, gap: 32 }} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 4 }}>
        <T v="headline" accessibilityRole="header">Settings</T>
        <T v="caption" muted>Make Lexi easy on your eyes and your brain.</T>
      </View>

      <Section icon="🎨" title="Look" note="Pick the colors that feel easiest to read.">
        <LookPicker />
        {S.theme === 'auto' ? <T v="caption" muted>Match my device: Cream by day, Ember at night.</T> : null}
      </Section>

      <Section icon="🧠" title="Icons and emoji" note="If icons don't work for your brain, turn them off. Words will show instead.">
        <Row gap={8}><Seg k="icons" v={true} label="Icons on" /><Seg k="icons" v={false} label="Words only" /></Row>
      </Section>

      <Section icon="🔤" title="Font" note={verdanaIsNative ? undefined : "Android phones don't have Verdana, so Lexi shows Atkinson Hyperlegible for it."}>
        <Row gap={8}>{(Object.keys(FONTS) as Settings['font'][]).map(k => <Seg key={k} k="font" v={k} label={FONTS[k]} labelStyle={t.fontPreview(k)} />)}</Row>
      </Section>

      <Section icon="🔠" title="Text size" note="Your phone's own text size makes everything bigger too.">
        <Row gap={8}>{(Object.keys(SIZES) as Settings['size'][]).map(k => <Seg key={k} k="size" v={k} label={SIZES[k][0]} />)}</Row>
      </Section>

      <Section icon="↕️" title="Line spacing" note="Wider gaps between lines can make reading easier.">
        <Row gap={8}>{(Object.keys(SPACING) as Settings['spacing'][]).map(k => <Seg key={k} k="spacing" v={k} label={SPACING[k][0]} />)}</Row>
      </Section>

      <Section icon="↔️" title="Letter spacing" note="More space between letters and words can make reading easier.">
        <Row gap={8}>{(Object.keys(LETTERS) as Settings['letters'][]).map(k => <Seg key={k} k="letters" v={k} label={LETTERS[k][0]} labelStyle={{ letterSpacing: t.fs * LETTERS[k][1] }} />)}</Row>
      </Section>

      <Section icon="🖍️" title="Highlight" note="While Lexi reads, the word she's saying lights up.">
        <Row gap={8}>
          {(Object.keys(HIGHLIGHTS) as Settings['highlight'][]).map(k => {
            const color = k === 'auto' ? hlLook : HIGHLIGHTS[k][1];
            return (
              <Seg key={k} k="highlight" v={k} label={HIGHLIGHTS[k][0]}>
                {color ? <View style={{ width: 20, height: 20, borderRadius: R.xs, backgroundColor: color, borderWidth: 1, borderColor: t.c.borderStrong }} /> : null}
              </Seg>
            );
          })}
        </Row>
      </Section>

      <Section icon="👆" title="Tap a word to hear it" note="Tap any word in Lexi's messages or your journal to hear just that word.">
        <Row gap={8}><Seg k="tapWord" v={true} label="On" /><Seg k="tapWord" v={false} label="Off" /></Row>
      </Section>

      <Section icon="⏩" title="Message pace">
        <Row gap={8}>{(Object.keys(PACES) as Settings['pace'][]).map(k => <Seg key={k} k="pace" v={k} label={PACES[k]} />)}</Row>
      </Section>

      <VoiceSection />

      <Section icon="✋🏽" title="Skin tone">
        <Row gap={8}>
          {TONES.map(([tn, name]) => <Seg key={name} k="tone" v={tn} emoji={'✋' + tn} label={name} a11y={name + ' skin tone'} />)}
        </Row>
      </Section>

      <Section icon={S.avatar || '🙂'} title="My avatar" note="Shown beside your messages. None keeps the chat simple.">
        <Row gap={8}>
          {AVATARS.map(a => (a
            ? <Seg key={a} k="avatar" v={a} emoji={t.toned(a)} emojiSize={34} a11y={'Avatar ' + a} />
            : <Seg key="none" k="avatar" v="" label="None" a11y="No avatar" />))}
        </Row>
      </Section>

      <Section icon="🎙" title="Voice typing"
        note={'In the chat, tap the mic and talk. Lexi listens until you tap Done, then you can Send, Say again or Fix the words. Your phone turns speech into text' + (Platform.OS === 'ios' ? ' with Apple speech recognition.' : ' with its speech service (usually Google).')} />

      <Section icon="🏷️" title="My own words" note={customs.length ? 'Words and emoji you added. Tap × to remove one.' : 'Add your own feeling words with ➕ My own during a check-in.'}>
        {customs.length ? (
          <Row gap={8}>
            {customs.map(([g, i, m]) => {
              const tone = t.band(m.band);
              return (
                <View key={g + i + m.label} style={[s.custom, { backgroundColor: tone.soft }]}>
                  <Ico e={m.e} size={Math.round(t.fs * 1.3)} />
                  <T v="label" color={tone.ink}>{m.label}</T>
                  <IconBtn icon="close" label={'Remove ' + m.label} words="Remove" variant="plain" onPress={() => removeCustom(g, i)} />
                </View>
              );
            })}
          </Row>
        ) : null}
      </Section>

      <ChatBrain />

      <Section icon="🔒" title="Your privacy">
        <PrivacyLines />
      </Section>

      <Section icon="📊" title="Journal numbers" note="The journal always shows days journaled and feelings named. You can also show a streak, where rest days are OK, and a word count.">
        <Row gap={8}><Seg k="showStreak" v={false} label="Hide them" /><Seg k="showStreak" v={true} label="Show streak and word count" /></Row>
      </Section>

      <Reminder />

      <Section icon="📤" title="Share my journal" note="Make a PDF of your journal, then choose where to send or save it.">
        <Row gap={8}>
          <Chip emoji="📄" label="Make a PDF: last 30 days" disabled={exporting} onPress={() => makePdf('month')} />
          <Chip emoji="📚" label="Make a PDF: everything" disabled={exporting} onPress={() => makePdf('all')} />
        </Row>
      </Section>

      <Section icon="💾" title="Your journal" note="Saved on this device only.">
        <Row gap={8}>
          <Chip icon="play" label="Run quick start" onPress={() => quickStart()} />
          <Chip emoji="🔁" label="Replay Lexi's intro" onPress={() => { showView('home'); intro(); }} />
          <Chip icon="delete" label="Delete everything" onPress={() => setWipeAsk(true)} />
        </Row>
        {wipeAsk ? (
          <View style={[s.confirm, { backgroundColor: t.c.sunken }]}>
            <T bold style={{ flexGrow: 1, flexBasis: t.fs * 10 }}>{DELETE_ASK}</T>
            <Btn label="Keep everything" height={48} onPress={() => setWipeAsk(false)} />
            <Btn variant="danger" label="Delete everything" height={48} onPress={async () => { setWipeAsk(false); await deleteEverything(); applyReminders(state.settings.reminders); toast('Everything is deleted. 🗑️'); }} />
          </View>
        ) : null}
      </Section>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  custom: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 12, borderRadius: R.full },
  confirm: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: 12, borderRadius: R.md },
  voice: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 14, paddingRight: 6, paddingVertical: 4, borderRadius: R.md },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6 },
  tip: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', padding: 12, borderRadius: R.md },
  big: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 72, paddingVertical: 12, paddingHorizontal: 16, borderRadius: R.lg },
  tag: { paddingHorizontal: 10, borderRadius: R.full },
});
