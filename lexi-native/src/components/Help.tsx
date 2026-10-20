// Help (FEATURES_DO_NEXT §5, §6, §7, §13; DESIGN_WARM_PAPER §7): the Help pill, the "I'm an AI" note, local crisis
// lines, the plain-words privacy lines and the Help sheet. All fixed lines here are recorded in Lexi's voice.
import type { ReactNode } from 'react';
import { Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COUNTRIES, COUNTRY_KEYS, type Country, type HelpLine } from '../safety';
import { speak, stopSpeaking } from '../speech';
import { setHelp, setSetting, useLexi } from '../store';
import { R, useTheme } from '../theme';
import { Card, Chip, Icon, IconBtn, Ico, Press, Row, T } from '../ui';
import { SheetFrame, SheetHead } from './Sheet';

/** The AI note has no emoji (§7); the recorded clip is the same words. */
export const AI_LABEL = 'Lexi is an AI, not a person or a therapist.';
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

/** The 48 px speaker button that reads a line (in Lexi's recorded voice when there's a clip). */
export function SpeakIcon({ text, label = 'Read aloud', variant = 'surface' }: { text: string | string[]; label?: string; variant?: 'surface' | 'plain' }) {
  return <IconBtn icon="speaker" label={label} words="Read" variant={variant} onPress={() => readAll(text)} />;
}

/** Help, at the right of every header: 48 px, surface, a strong edge, the lifebuoy and the word. */
export function HelpPill() {
  const t = useTheme();
  return (
    <Press onPress={() => setHelp(true)} accessibilityRole="button" accessibilityLabel="Help"
      style={[s.help, { backgroundColor: t.card, borderColor: t.c.borderStrong }]}>
      {t.icons ? <Icon name="help" /> : null}
      <T v="label">Help</T>
    </Press>
  );
}

/** The quiet line under the top bar on Home (§7): caption text, muted, no box and no emoji. */
export function AiLabel() {
  const t = useTheme();
  return (
    <View style={[s.ai, { paddingHorizontal: t.gutter }]}>
      <T v="caption" muted style={{ flex: 1 }}>{AI_LABEL}</T>
      <SpeakIcon text={AI_LABEL} label="Read: Lexi is an AI" variant="plain" />
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
      <View style={[s.emergency, { backgroundColor: t.c.sunken, borderColor: t.danger.bg }]}>
        <T v="label" w={600}>{'🆘 Emergency' + (st.settings.country === 'Other' ? '' : ' · ' + c.name)}</T>
        <Text selectable style={t.txt(isNumber ? 'display' : 'title')}>{c.emergency}</Text>
        {c.dial ? <Row><Chip emoji="📞" label={'Call ' + c.dial} onPress={() => open('tel:' + c.dial)} /></Row> : null}
      </View>
      {emergencyOnly ? null : c.lines.map((l: HelpLine) => (
        <View key={l.name} style={[s.line, { borderColor: t.c.hairline, backgroundColor: t.card }]}>
          <T v="label" w={600}>{l.name}</T>
          <Text selectable style={t.txt('body', { w: 700 })}>{l.how}</Text>
          <Row gap={8}>
            {l.call ? <Chip emoji="📞" label="Call" onPress={() => open('tel:' + l.call)} /> : null}
            {l.text ? <Chip emoji="💬" label="Text" onPress={() => open(smsUrl(l.text!, l.textBody))} /> : null}
            {l.web ? <Chip emoji="🌐" label="Open" onPress={() => open(l.web!)} /> : null}
          </Row>
        </View>
      ))}
      {picker ? (
        <View style={{ gap: 8 }}>
          <T v="label" w={600}>Your country</T>
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

/** The five plain-words privacy lines, each with its speaker button (§13). */
export function PrivacyLines() {
  return (
    <View style={{ gap: 12 }}>
      {PRIVACY.map(l => (
        <View key={l} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
          <T style={{ flex: 1 }}>{l}</T>
          <SpeakIcon text={l} />
        </View>
      ))}
    </View>
  );
}

function Section({ icon, title, read, children }: { icon: string; title: string; read: string[]; children: ReactNode }) {
  return (
    <Card>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ico e={icon} size={30} />
        <T v="title" accessibilityRole="header" style={{ flex: 1 }}>{title}</T>
        <SpeakIcon text={read} label={'Read ' + title} />
      </View>
      {children}
    </Card>
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
    <SheetFrame>
      <SheetHead icon="help" title="Help" onClose={close} />
      <ScrollView contentContainerStyle={{ paddingHorizontal: t.gutter, paddingTop: 16, gap: 20, paddingBottom: insets.bottom + 32 }}>
        <Section icon="🛟" title="Need help now?" read={[HELP_NOW, ...linesRead]}>
          <T bold>{HELP_NOW}</T>
          <CrisisLines picker />
        </Section>
        <Section icon="🧭" title="How to use Lexi" read={HOW_TIPS}>
          <View style={{ gap: 12 }}>
            {HOW_TIPS.map(tip => (
              <View key={tip} style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
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
    </SheetFrame>
  );
}

const s = StyleSheet.create({
  help: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 48, paddingHorizontal: 16, borderRadius: R.full, borderWidth: 1 },
  ai: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingBottom: 2 },
  emergency: { gap: 6, padding: 16, borderRadius: R.md, borderWidth: 2 },
  line: { gap: 6, padding: 16, borderRadius: R.md, borderWidth: 1 },
});
