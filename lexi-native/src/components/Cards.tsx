// The cards Lexi puts in the chat: answer buttons, the tab legend, the check-in steps (feelings, "Name it more",
// topics, one card per topic, recap), Quick start and the crisis lines. Each calls finish() once; the chat then
// locks it (dimmed, no taps). Check-in cards finish with { action: 'next' | 'back', value } (FEATURES_SOON §6).
import { useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BANDS, LETTERS, NUANCE, PACES, SIZES, TOPICS, type BandKey, type Pick, type Settings, type Topic } from '../content';
import { addMeEmoji, type ChatItem } from '../chat';
import { useField } from '../fields';
import { speak } from '../speech';
import { setSetting, showView, useLexi, type TopicAnswer, type Todo } from '../store';
import { R, mix, useTheme } from '../theme';
import { Btn, Card, Chip, Choice, Ico, Row, T, Tile } from '../ui';
import { CrisisLines } from './Help';
import { Box, NoteLine } from './Inputs';
import { MoodPicker, TopicOpts, itemKey, toggled, type Selected } from './Pickers';
import { WordText } from './WordText';

type CardItem = Extract<ChatItem, { type: 'card' }>;
type Opt = { e: string; label: string; v?: unknown; run?: () => void };
/** Where a check-in card sits: its label ("Step 3 of 6", "Step 1b") and the progress dots. */
export type { StepInfo } from '../steps';
import type { StepInfo } from '../steps';
export type StepResult<T> = { action: 'next' | 'back'; value: T };

/** Menus Lexi offers (Guided check-in / Write on my own / Open journal): big pills. */
function ChoicesCard({ item }: { item: CardItem }) {
  const { options } = item.props as { options: Opt[] };
  return (
    <Row>
      {options.map((o, i) => (
        <Choice key={o.label} label={o.label} icon={o.e}
          dim={item.done && item.picked !== i} disabled={item.done}
          onPress={() => {
            if (o.run) { o.run(); return; }
            item.finish(o.v, i); addMeEmoji([o.e], o.label);
          }} />
      ))}
    </Row>
  );
}

/** The ⚙️ 🏡 📖 legend from the Chat Bot Plan: huge emoji on white tiles. */
function LegendCard() {
  const t = useTheme();
  const w = Math.floor((t.contentW - 20) / 3);
  const tiles: [string, string, 'settings' | 'home' | 'journal'][] = [['⚙️', 'Settings', 'settings'], ['🏡', 'Home', 'home'], ['📖', 'Journal', 'journal']];
  return (
    <View style={{ flexDirection: 'row', gap: 10 }}>
      {tiles.map(([e, name, v]) => (
        <Pressable key={v} onPress={() => showView(v)} accessibilityRole="button" accessibilityLabel={name}
          style={({ pressed }) => [t.shadow, { width: w, paddingVertical: 12, borderRadius: R.m, alignItems: 'center', backgroundColor: t.c.surface, transform: [{ scale: pressed ? 0.96 : 1 }] }]}>
          <Ico e={e} size={Math.min(64, Math.round(w * 0.5))} />
          <T em={0.85} bold>{name}</T>
        </Pressable>
      ))}
    </View>
  );
}

/* ---------- check-in steps ---------- */
/** "Step X of N" and a row of dots: filled for done steps, ringed for the current one. */
function StepHeader({ step }: { step: StepInfo }) {
  const t = useTheme();
  const n = step.total ?? step.index;
  return (
    <View style={{ gap: 6 }} accessible accessibilityLabel={step.label}>
      <T em={0.85} bold soft>{step.label}</T>
      <View style={{ flexDirection: 'row', gap: 6 }}>
        {Array.from({ length: n }, (_, i) => {
          const done = i + 1 < step.index, cur = i + 1 === step.index;
          return <View key={i} style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: done || cur ? t.c.ring : t.c.line, backgroundColor: done ? t.c.ring : 'transparent' }} />;
        })}
      </View>
    </View>
  );
}
/** Back (on every step after the first), Skip and the forward button. */
function StepButtons({ step, onBack, onSkip, skipLabel = 'Skip', next }: {
  step: StepInfo; onBack: () => void; onSkip?: () => void; skipLabel?: string; next: ReactNode;
}) {
  return (
    <Row>
      {step.back ? <Btn icon="⬅️" label="Back" onPress={onBack} /> : null}
      <View style={{ flex: 1 }} />
      {onSkip ? <Btn icon={skipLabel === 'Skip' ? '⏭️' : undefined} label={skipLabel} onPress={onSkip} /> : null}
      {next}
    </Row>
  );
}

const asSelected = (picks: Pick[]): Selected => Object.fromEntries(picks.map(p => [itemKey(p), p]));

function MoodCard({ item }: { item: CardItem }) {
  const { step, initial } = item.props as { step: StepInfo; initial: Pick[] };
  const [sel, setSel] = useState<Selected>(() => asSelected(initial || []));
  const picks = Object.values(sel);
  const done = (action: 'next' | 'back', value: Pick[]) => item.finish({ action, value } as StepResult<Pick[]>);
  return (
    <Card done={item.done}>
      <StepHeader step={step} />
      <MoodPicker selected={sel} onChange={setSel} disabled={item.done} />
      <StepButtons step={step} onBack={() => done('back', picks)} onSkip={() => done('next', [])}
        next={<Btn variant="primary" icon="✔️" label="Done" disabled={!picks.length} onPress={() => done('next', picks)} />} />
    </Card>
  );
}

/** "Name it more" (§12): five exact words for each band picked. Tapping one selects it and says it. */
function NuanceCard({ item }: { item: CardItem }) {
  const t = useTheme();
  const { step, bands, initial } = item.props as { step: StepInfo; bands: BandKey[]; initial: Pick[] };
  const [sel, setSel] = useState<Selected>(() => asSelected(initial || []));
  const [w, setW] = useState(0);
  const picks = Object.values(sel);
  const done = (action: 'next' | 'back', value: Pick[]) => item.finish({ action, value } as StepResult<Pick[]>);
  const min = Math.round(Math.max(92, t.fs * 4.6) * Math.min(t.k, 1.6)), gap = 10;
  const cols = w ? Math.max(1, Math.floor((w + gap) / (min + gap))) : 0;
  const tileW = cols ? Math.floor((w - gap * (cols - 1)) / cols) : min;
  return (
    <Card done={item.done}>
      <StepHeader step={step} />
      <View onLayout={e => setW(e.nativeEvent.layout.width)} style={{ gap: 10 }}>
        {w ? BANDS.filter(b => bands.includes(b.key)).map(b => (
          <View key={b.key} style={{ padding: 12, borderRadius: R.m, backgroundColor: mix(t.band(b.key).b, t.c.surface, t.dark ? 0.18 : 0.22), gap: 10 }}>
            <T em={0.85} display bold>{b.name}</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
              {NUANCE[b.key].map(([e, label]) => {
                const p: Pick = { e, label, band: b.key };
                return <Tile key={label} e={e} label={label} width={tileW} on={!!sel[itemKey(p)]} disabled={item.done}
                  onPress={() => { const next = toggled(sel, p); setSel(next); if (next[itemKey(p)]) speak(label); }} />;
              })}
            </View>
          </View>
        )) : null}
      </View>
      <StepButtons step={step} onBack={() => done('back', picks)} onSkip={() => done('next', [])}
        next={<Btn variant="primary" icon="✔️" label="Done" disabled={!picks.length} onPress={() => done('next', picks)} />} />
    </Card>
  );
}

function TopicsCard({ item }: { item: CardItem }) {
  const { step, initial } = item.props as { step: StepInfo; initial: string[] };
  const [sel, setSel] = useState<string[]>(initial || []);
  const flip = (k: string) => setSel(s => (s.includes(k) ? s.filter(x => x !== k) : [...s, k]));
  const done = (action: 'next' | 'back', value: string[]) => item.finish({ action, value } as StepResult<string[]>);
  const ordered = () => TOPICS.filter(tp => sel.includes(tp.key)).map(tp => tp.key);
  return (
    <Card done={item.done}>
      <StepHeader step={step} />
      <Row gap={8}>
        {TOPICS.map(tp => <Chip key={tp.key} icon={tp.icon} iconSize={30} label={tp.name} selected={sel.includes(tp.key)} onPress={() => flip(tp.key)} />)}
      </Row>
      <StepButtons step={step} onBack={() => done('back', ordered())} onSkip={() => done('next', [])} skipLabel="Just my mood today"
        next={<Btn variant="primary" icon="➜" label="Let's go" disabled={!sel.length} onPress={() => done('next', ordered())} />} />
    </Card>
  );
}

function TopicAnswerCard({ item }: { item: CardItem }) {
  const t = useTheme();
  const { step, topic, initial } = item.props as { step: StepInfo; topic: Topic; initial: TopicAnswer | null };
  const [sel, setSel] = useState<Selected>(() => asSelected(initial?.picks || []));
  const [todos, setTodos] = useState<Todo[]>(initial?.todos || []);
  const note = useField(initial?.note || '');
  const todoIn = useField('');

  /** Adds what's typed in the to-do box; returns the new list. */
  const addTodo = (): Todo[] => {
    const v = todoIn.ref.current.trim();
    if (!v) return todos;
    const list = [...todos, { t: v, done: false }];
    setTodos(list); todoIn.set('');
    return list;
  };
  const answer = (): TopicAnswer | null => {
    if (topic.todo) { const list = addTodo(); return list.length ? { key: topic.key, picks: [], note: '', todos: list } : null; }
    const picks = Object.values(sel), n = note.ref.current.trim();
    return picks.length || n ? { key: topic.key, picks, note: n, todos: [] } : null;
  };
  const done = (action: 'next' | 'back', value: TopicAnswer | null) => item.finish({ action, value } as StepResult<TopicAnswer | null>);

  return (
    <Card done={item.done}>
      <StepHeader step={step} />
      {topic.todo ? (
        <View style={{ gap: 6 }}>
          {todos.map((td, i) => (
            <View key={i + td.t} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 12, padding: 3, borderRadius: 12, backgroundColor: t.c.bg }}>
              <T style={{ flex: 1 }}>{td.t}</T>
              <Chip icon="✖️" words="Remove" a11y={'Remove ' + td.t} onPress={() => setTodos(todos.filter((_, j) => j !== i))} />
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Box field={todoIn} placeholder="Add a to do" accessibilityLabel="Add a to do" maxLength={120} editable={!item.done}
              returnKeyType="done" submitBehavior="submit" onSubmitEditing={() => { addTodo(); }} style={{ flex: 1 }} />
            <Btn icon="➕" label="Add" onPress={() => { addTodo(); }} />
          </View>
        </View>
      ) : (
        <>
          <TopicOpts topic={topic} selected={sel} onChange={setSel} disabled={item.done} />
          <NoteLine field={note} placeholder="A few words (you can skip this)" disabled={item.done} />
        </>
      )}
      <StepButtons step={step} onBack={() => done('back', answer())} onSkip={() => done('next', null)}
        next={<Btn variant="primary" icon="➜" label="Next" onPress={() => done('next', answer())} />} />
    </Card>
  );
}

export type RecapLine = { id: string; icon: string; title: string; text: string };
/** The last step: one line per step with Change, then ✔️ Save to journal. Nothing is saved before this. */
function RecapCard({ item }: { item: CardItem }) {
  const t = useTheme();
  const { step, lines } = item.props as { step: StepInfo; lines: RecapLine[] };
  return (
    <Card done={item.done}>
      <StepHeader step={step} />
      <View style={{ gap: 10 }}>
        {lines.map(l => (
          <View key={l.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10, borderRadius: R.s, backgroundColor: t.c.field }}>
            <Ico e={l.icon} size={28} />
            <View style={{ flex: 1 }}>
              <T bold>{l.title}</T>
              <T em={0.9}>{l.text}</T>
            </View>
            <Chip icon="✏️" label="Change" onPress={() => item.finish({ action: 'change', step: l.id })} />
          </View>
        ))}
      </View>
      <Row end><Btn variant="primary" icon="✔️" label="Save to journal" onPress={() => item.finish({ action: 'save' })} /></Row>
    </Card>
  );
}

/* ---------- Quick start (§9): every control applies live ---------- */
function QuickStartCard({ item }: { item: CardItem }) {
  const t = useTheme();
  const st = useLexi();
  const S = st.settings;
  const seg = <K extends keyof Settings>(k: K, v: Settings[K], label: string) => (
    <Chip key={String(v)} label={label} selected={S[k] === v} onPress={() => setSetting(k, v)} />
  );
  const sizeNames: Record<Settings['size'], string> = { s: 'S', m: 'M', l: 'L', xl: 'XL', xxl: 'Huge' };
  const PREVIEW = 'This is how my messages will look.';
  return (
    <Card done={item.done}>
      <T display bold>Quick start</T>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
        {t.icons ? <Text style={t.emoji(t.avatarBot - 4)}>🤖</Text> : null}
        <View style={[t.shadow, { flex: 1, padding: Math.round(t.fs * 0.7), borderRadius: R.m, borderBottomLeftRadius: t.icons ? 6 : R.m, backgroundColor: t.c.bot }]}>
          <WordText text={PREVIEW} target={item.id + '-preview'} color={t.c.botInk} />
        </View>
        <Chip icon="🔊" words="Read" a11y="Read the preview" onPress={() => speak(PREVIEW, { target: item.id + '-preview' })} />
      </View>
      <T bold>Text size</T>
      <Row gap={8}>{(Object.keys(SIZES) as Settings['size'][]).map(k => seg('size', k, sizeNames[k]))}</Row>
      <T bold>Letter spacing</T>
      <Row gap={8}>{(Object.keys(LETTERS) as Settings['letters'][]).map(k => seg('letters', k, LETTERS[k][0]))}</Row>
      <T bold>Icons</T>
      <Row gap={8}>{seg('icons', true, 'On')}{seg('icons', false, 'Words only')}</Row>
      <T bold>Read aloud</T>
      <Row gap={8}>{seg('autoread', true, 'On')}{seg('autoread', false, 'Off')}</Row>
      <T bold>Message pace</T>
      <Row gap={8}>{seg('pace', 'auto', PACES.auto)}{seg('pace', 'tap', PACES.tap)}</Row>
      <Row end><Btn variant="primary" icon="✔️" label="Done" onPress={() => item.finish(true)} /></Row>
    </Card>
  );
}

export function CardView({ item }: { item: CardItem }) {
  switch (item.card) {
    case 'question': return null; // drawn as a bot bubble by ChatLog
    case 'crisis': return <Card><CrisisLines emergencyOnly={!!(item.props as { emergencyOnly?: boolean }).emergencyOnly} /></Card>;
    case 'choices': return <ChoicesCard item={item} />;
    case 'legend': return <LegendCard />;
    case 'mood': return <MoodCard item={item} />;
    case 'nuance': return <NuanceCard item={item} />;
    case 'topics': return <TopicsCard item={item} />;
    case 'topicAnswer': return <TopicAnswerCard item={item} />;
    case 'recap': return <RecapCard item={item} />;
    case 'quickstart': return <QuickStartCard item={item} />;
  }
}
