// 🆘 Help (FEATURES_DO_NEXT §5, §6, §7, §13): the Help pill, the "I'm an AI" line, local crisis lines,
// the plain-words privacy lines and the Help sheet. All fixed lines here are recorded in Lexi's voice.
import type { ReactNode } from 'react';
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COUNTRIES, COUNTRY_KEYS, type Country, type HelpLine } from '../safety';
import { speak, stopSpeaking } from '../speech';
import { setHelp, setSetting, useLexi } from '../store';
import { R, useTheme } from '../theme';
import { Chip, Ico, Row, T } from '../ui';

export const AI_LABEL = '🤖 Lexi is an AI, not a person or a therapist.';
export const HELP_NOW = 'If you might hurt yourself, or you are in danger, call your local emergency number now.';
export const HOW_TIPS = [
  '🧭 Check in: tap Guided check-in and pick emoji.',
  "✏️ Write: tap Write on my own. Spelling doesn't matter.",
  '🔊 Listen: tap the speaker on any message.',
  '📖 Journal: see your days and your entries.',
  '⚙️ Settings: change text size, spacing, colors and voice.',
];
export const SAFE_TEXT = "Lexi looks for words about wanting to die or hurting yourself, even when they are spelled in a different way or written with emoji. If it finds them, it shows you help lines. When Lexi's chat brain is on, Claude checks too. Lexi can make mistakes, so if you need help, please use the help lines.";
// Native variants of lines 2 and 3 (§13).
export const PRIVACY = [
  '🔒 Your journal is private. Only you can see it.',
  '💾 It is saved on this phone only.',
  '🤖 When you chat with me, tidy your spelling, or ask for a reflection, your words go to Claude, an AI made by Anthropic, using your API key.',
  "🛟 If you write about hurting yourself, I show you help lines. I can't call anyone, and nobody is told.",
  '🗑️ You can delete one entry, or everything, in Settings.',
];

/** Read lines one after another, so each one can use its own recorded clip. */
function readAll(text: string | string[]) {
  (Array.isArray(text) ? text : [text]).forEach((p, i) => speak(p, { queue: i > 0 }));
}

/** A small 🔊 that reads a line (in Lexi's recorded voice when there's a clip). */
export function SpeakIcon({ text, label = 'Read aloud', color }: { text: string | string[]; label?: string; color?: string }) {
  const t = useTheme();
  return (
    <Pressable onPress={() => readAll(text)} accessibilityRole="button" accessibilityLabel={label} hitSlop={10}
      style={({ pressed }) => [s.speak, { opacity: pressed ? 1 : 0.8 }]}>
      {t.icons ? <Text style={t.emoji(22)}>🔊</Text> : <T em={0.8} color={color}>Read</T>}
    </Pressable>
  );
}

/** 🆘 Help, at the right of every header. */
export function HelpPill() {
  const t = useTheme();
  return (
    <Pressable onPress={() => setHelp(true)} accessibilityRole="button" accessibilityLabel="Help"
      style={({ pressed }) => [s.help, t.shadow, { backgroundColor: t.c.surface, borderColor: t.c.danger, transform: [{ scale: pressed ? 0.95 : 1 }] }]}>
      {t.icons ? <Text style={t.emoji(20)}>🆘</Text> : null}
      <T em={0.8} bold>Help</T>
    </Pressable>
  );
}

/** The slim line always shown under the top bar on the chat screen (§5). */
export function AiLabel() {
  const t = useTheme();
  return (
    <View style={[s.ai, { backgroundColor: t.dark ? t.c.surface : t.c.surface2, borderBottomColor: t.c.line }]}>
      <T em={0.75} soft style={{ flex: 1 }}>{AI_LABEL}</T>
      <SpeakIcon text={AI_LABEL} label="Read: Lexi is an AI" />
    </View>
  );
}

function open(url: string) { Linking.openURL(url).catch(() => {}); }
const smsUrl = (to: string, body?: string) => 'sms:' + to + (body ? (Platform.OS === 'ios' ? '&' : '?') + 'body=' + encodeURIComponent(body) : '');

/** Emergency number and help lines for the chosen country, as large selectable text (§7). The Call / Text
 *  buttons are only a convenience: Lexi never calls or texts anyone itself. */
export function CrisisLines({ emergencyOnly, picker }: { emergencyOnly?: boolean; picker?: boolean }) {
  const t = useTheme();
  const st = useLexi();
  const c = COUNTRIES[st.settings.country] || COUNTRIES.Other;
  const isNumber = !!c.dial;
  return (
    <View style={{ gap: 12 }}>
      <View style={[s.emergency, { backgroundColor: t.c.surface2, borderColor: t.c.danger }]}>
        <T em={0.85} bold>{'🆘 Emergency' + (st.settings.country === 'Other' ? '' : ' · ' + c.name)}</T>
        <Text selectable style={[t.text(isNumber ? 2 : 1.1, { display: true, bold: true }), { lineHeight: undefined }]}>{c.emergency}</Text>
        {c.dial ? <Row><Chip icon="📞" label={'Call ' + c.dial} onPress={() => open('tel:' + c.dial)} /></Row> : null}
      </View>
      {emergencyOnly ? null : c.lines.map((l: HelpLine) => (
        <View key={l.name} style={[s.line, { borderColor: t.c.line, backgroundColor: t.c.surface }]}>
          <T bold>{l.name}</T>
          <Text selectable style={t.text(1.15, { bold: true })}>{l.how}</Text>
          <Row gap={8}>
            {l.call ? <Chip icon="📞" label="Call" onPress={() => open('tel:' + l.call)} /> : null}
            {l.text ? <Chip icon="💬" label="Text" onPress={() => open(smsUrl(l.text!, l.textBody))} /> : null}
            {l.web ? <Chip icon="🌐" label="Open" onPress={() => open(l.web!)} /> : null}
          </Row>
        </View>
      ))}
      {picker ? (
        <View style={{ gap: 6 }}>
          <T bold>Your country</T>
          <Row gap={8}>
            {COUNTRY_KEYS.map((k: Country) => (
              <Chip key={k} label={COUNTRIES[k].name} selected={st.settings.country === k} onPress={() => setSetting('country', k)} />
            ))}
          </Row>
        </View>
      ) : null}
    </View>
  );
}

/** The five plain-words privacy lines, each with 🔊 (§13). */
export function PrivacyLines() {
  return (
    <View style={{ gap: 8 }}>
      {PRIVACY.map(l => (
        <View key={l} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
          <T style={{ flex: 1 }}>{l}</T>
          <SpeakIcon text={l} />
        </View>
      ))}
    </View>
  );
}

function Section({ icon, title, read, children }: { icon: string; title: string; read: string[]; children: ReactNode }) {
  const t = useTheme();
  return (
    <View style={[s.section, t.shadow, { backgroundColor: t.c.surface }, t.dark && { borderWidth: 1, borderColor: t.c.line }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ico e={icon} size={32} />
        <T display bold accessibilityRole="header" style={{ flex: 1 }}>{title}</T>
        <SpeakIcon text={read} label={'Read ' + title} />
      </View>
      {children}
    </View>
  );
}

export function HelpSheet() {
  const st = useLexi();
  if (!st.helpOpen) return null;
  return <Sheet />;
}

function Sheet() {
  const t = useTheme();
  const st = useLexi();
  const insets = useSafeAreaInsets();
  const c = COUNTRIES[st.settings.country] || COUNTRIES.Other;
  const close = () => { stopSpeaking(); setHelp(false); };
  const linesRead = [c.dial ? 'Emergency: ' + c.emergency + '.' : '', ...c.lines.map(l => l.name + ': ' + l.how + '.')].filter(Boolean);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: t.c.bg }]} accessibilityViewIsModal>
      <View style={[s.head, { paddingTop: insets.top, height: 56 + insets.top, backgroundColor: t.c.bar, borderBottomWidth: t.barsBlend ? 1 : 0, borderBottomColor: t.c.line }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexShrink: 1 }}>
          <Ico e="🆘" size={28} />
          <T em={1.1} display bold color={t.c.onBar} accessibilityRole="header">Help</T>
        </View>
        <Chip icon="✖️" label="Close" onPress={close} style={{ borderColor: 'transparent' }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: insets.bottom + 24 }}>
        <Section icon="🛟" title="Need help now?" read={[HELP_NOW, ...linesRead]}>
          <T bold>{HELP_NOW}</T>
          <CrisisLines picker />
        </Section>
        <Section icon="🧭" title="How to use Lexi" read={HOW_TIPS}>
          <View style={{ gap: 8 }}>
            {HOW_TIPS.map(tip => (
              <View key={tip} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                <T style={{ flex: 1 }}>{tip}</T>
                <SpeakIcon text={tip} />
              </View>
            ))}
          </View>
        </Section>
        <Section icon="🛡️" title="How Lexi keeps you safe" read={[SAFE_TEXT]}>
          <T>{SAFE_TEXT}</T>
        </Section>
        <Section icon="🔒" title="Your privacy" read={PRIVACY}>
          <PrivacyLines />
        </Section>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  speak: { alignSelf: 'flex-start', paddingHorizontal: 4, minWidth: 32, minHeight: 32, alignItems: 'center', justifyContent: 'center' },
  help: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 36, paddingHorizontal: 12, borderRadius: R.pill, borderWidth: 2 },
  ai: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 3, borderBottomWidth: 1 },
  emergency: { gap: 4, padding: 12, borderRadius: R.s, borderWidth: 2 },
  line: { gap: 4, padding: 12, borderRadius: R.s, borderWidth: 1.5 },
  section: { gap: 10, padding: 14, borderRadius: R.m },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingHorizontal: 16 },
});
