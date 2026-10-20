// The cards Lexi puts in the chat: the Home actions and This week, menus, the tab buttons, the check-in steps
// (feelings, "Name it more", topics, one card per topic, recap), Quick start and the crisis lines. Each calls
// finish() once and then folds away, leaving only the answer row (DESIGN_WARM_PAPER §9). Check-in cards finish
// with { action: 'next' | 'back', value } (FEATURES_SOON §6).
import { useState, type ReactNode } from 'react';
import { View } from 'react-native';
import { BANDS, LETTERS, NUANCE, PACES, SIZES, TOPICS, type BandKey, type Pick, type Settings, type Topic } from '../content';
import { addMeEmoji, type ChatItem } from '../chat';
import type { IconName } from '../art';
import { useField } from '../fields';
import { speak } from '../speech';
import { setSetting, showView, useLexi, type TopicAnswer, type Todo } from '../store';
import { R, useTheme } from '../theme';
import { SHORT_DAYS, dayCell, thisWeek } from '../week';
import { Btn, Butterfly, Card, Chip, Icon, IconBtn, Ico, Press, Row, Shape, T, Tile } from '../ui';
import { CrisisLines } from './Help';
import { Box, NoteLine } from './Inputs';
import { MoodPicker, PickGrid, TopicOpts, YouPicked, itemKey, toggled, useTileGrid, type Selected } from './Pickers';
import { WordText } from './WordText';

type CardItem = Extract<ChatItem, { type: 'card' }>;
type Opt = { e: string; label: string; v?: unknown; run?: () => void };
/** Where a check-in card sits: its label ("Step 3 of 6", "Step 1b") and the progress dots. */
export type { StepInfo } from '../steps';
import type { StepInfo } from '../steps';
export type StepResult<T> = { action: 'next' | 'back'; value: T };

/** Tap an option: the card folds away and the answer row stays. */
function answer(item: CardItem, o: Opt) {
  item.finish(o.v);
  addMeEmoji([o.e], o.label);
  o.run?.();
}

/* ---------- Home ---------- */
/** This week (§10): Mon to Sun, each day's main feeling group as its shape. A day with entries but no moods gets a
 *  small dot, an empty or future day a dashed ring, and today a ring in the accent ink. */
export function ThisWeek() {
  const t = useTheme();
  const st = useLexi();
  const [w, setW] = useState(0);
  const now = new Date();
  const days = thisWeek(now).map(d => dayCell(d, st.entries, now));
  const n = days.reduce((a, d) => a + d.entries, 0);
  const cap = Math.max(16, t.fs * 0.889) * t.k;
  const short = !!w && w / 7 < cap * 2.3; // big text: one letter per day
  return (
    <Card style={{ gap: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
        <T v="title" accessibilityRole="header">This week</T>
        <T v="caption" muted>{n === 1 ? '1 check-in' : n + ' check-ins'}</T>
      </View>
      <View onLayout={e => setW(e.nativeEvent.layout.width)} style={{ flexDirection: 'row' }}>
        {days.map((d, i) => (
          <View key={d.key} accessible accessibilityLabel={(d.today ? 'Today, ' : '') + d.label} style={{ flex: 1, alignItems: 'center', gap: 6 }}>
            <T v="caption" muted={!d.today} w={d.today ? 600 : 500}>{short ? SHORT_DAYS[i][0] : SHORT_DAYS[i]}</T>
            <View style={{ width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', borderWidth: d.today ? 2 : 0, borderColor: t.c.accentInk }}>
              {d.band ? <Shape band={d.band} size={26} />
                : d.entries ? <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: t.c.inkMuted }} />
                : <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderStyle: 'dashed', borderColor: t.c.borderStrong }} />}
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

/** Guided check-in (the one primary, 64 px), Write on my own, and This week. */
function ActionsCard({ item }: { item: CardItem }) {
  const { guided, write } = item.props as { guided: () => void; write: () => void };
  return (
    <View style={{ gap: 12 }}>
      <Btn variant="primary" height={64} full emoji="🧭" label="Guided check-in" iconEnd="next" onPress={() => answer(item, { e: '🧭', label: 'Guided check-in', run: guided })} />
      <Btn height={56} full emoji="✏️" label="Write on my own" onPress={() => answer(item, { e: '✏️', label: 'Write on my own', run: write })} />
      <ThisWeek />
    </View>
  );
}

/** Menus Lexi offers in the intro (Start writing / Guided check-in). */
function ChoicesCard({ item }: { item: CardItem }) {
  const { options } = item.props as { options: Opt[] };
  return (
    <View style={{ gap: 12 }}>
      {options.map(o => <Btn key={o.label} full emoji={o.e} label={o.label} onPress={() => answer(item, o)} />)}
    </View>
  );
}

/** The intro's Settings / Home / Journal: three secondary buttons in a row, with the tab icons. */
function LegendCard() {
  const t = useTheme();
  const tabs: [IconName, string, 'settings' | 'home' | 'journal'][] = [['settings', 'Settings', 'settings'], ['home', 'Home', 'home'], ['journal', 'Journal', 'journal']];
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {tabs.map(([icon, name, v]) => (
        <Press key={v} onPress={() => showView(v)} accessibilityRole="button" accessibilityLabel={name}
          style={{ flex: 1, minHeight: 72, alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 10, paddingHorizontal: 4, borderRadius: R.lg, borderWidth: 1, borderColor: t.c.borderStrong, backgroundColor: t.card }}>
          {t.icons ? <Icon name={icon} /> : null}
          <T v="label">{name}</T>
        </Press>
      ))}
    </View>
  );
}

/* ---------- check-in steps ---------- */
/** The step's title, with "Step X of N" and the dots on the right of the same row (§10). */
function StepHeader({ title, step, emoji }: { title: string; step: StepInfo; emoji?: string }) {
  const t = useTheme();
  const n = step.total ?? step.index;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
        {emoji ? <Ico e={emoji} size={Math.round(t.fs * 1.5)} /> : null}
        <T v="title" accessibilityRole="header" style={{ flexShrink: 1 }}>{title}</T>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessible accessibilityLabel={step.label}>
        <T v="caption" muted>{step.label}</T>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {Array.from({ length: n }, (_, i) => {
            const done = i + 1 < step.index, cur = i + 1 === step.index;
            return <View key={i} style={{ width: 10, height: 10, borderRadius: 5, borderWidth: 2, borderColor: done || cur ? t.c.accentInk : t.c.borderStrong, backgroundColor: done ? t.c.accentInk : 'transparent' }} />;
          })}
        </View>
      </View>
    </View>
  );
}
/** Back (on every step after the first), Skip and the forward button. */
function StepButtons({ step, onBack, onSkip, skipLabel = 'Skip', next }: {
  step: StepInfo; onBack: () => void; onSkip?: () => void; skipLabel?: string; next: ReactNode;
}) {
  return (
    <Row end gap={8}>
      {step.back ? <Btn icon="back" label="Back" onPress={onBack} /> : null}
      <View style={{ flexGrow: 1 }} />
      {onSkip ? <Btn label={skipLabel} onPress={onSkip} /> : null}
      {next}
    </Row>
  );
}
/** "Done (2 picked)", disabled until something is picked. */
const doneLabel = (n: number) => (n ? 'Done (' + n + ' picked)' : 'Done');

const asSelected = (picks: Pick[]): Selected => Object.fromEntries(picks.map(p => [itemKey(p), p]));

function MoodCard({ item }: { item: CardItem }) {
  const { step, initial } = item.props as { step: StepInfo; initial: Pick[] };
  const [sel, setSel] = useState<Selected>(() => asSelected(initial || []));
  const picks = Object.values(sel);
  const done = (action: 'next' | 'back', value: Pick[]) => item.finish({ action, value } as StepResult<Pick[]>);
  return (
    <Card>
      <StepHeader title="Feelings" step={step} />
      <MoodPicker selected={sel} onChange={setSel} />
      <StepButtons step={step} onBack={() => done('back', picks)} onSkip={() => done('next', [])}
        next={<Btn variant="primary" label={doneLabel(picks.length)} disabled={!picks.length} onPress={() => done('next', picks)} />} />
    </Card>
  );
}

/** "Name it more" (§12): five exact words for each band picked, one section per band headed by its shape and name. */
function NuanceCard({ item }: { item: CardItem }) {
  const t = useTheme();
  const { step, bands, initial } = item.props as { step: StepInfo; bands: BandKey[]; initial: Pick[] };
  const [sel, setSel] = useState<Selected>(() => asSelected(initial || []));
  const picks = Object.values(sel);
  const done = (action: 'next' | 'back', value: Pick[]) => item.finish({ action, value } as StepResult<Pick[]>);
  return (
    <Card>
      <StepHeader title="Name it more" step={step} />
      {BANDS.filter(b => bands.includes(b.key)).map(b => {
        const tone = t.band(b.key);
        return (
          <View key={b.key} style={{ gap: 12 }}>
            <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 40, paddingHorizontal: 14, borderRadius: R.full, backgroundColor: tone.soft }}>
              <Shape band={b.key} size={20} />
              <T v="label" color={tone.ink} accessibilityRole="header">{b.name}</T>
            </View>
            <PickGrid items={NUANCE[b.key].map(([e, label]) => ({ e, label, band: b.key }))} selected={sel}
              onToggle={p => { const next = toggled(sel, p); setSel(next); if (next[itemKey(p)]) speak(p.label); }} />
          </View>
        );
      })}
      <YouPicked picks={picks} />
      <StepButtons step={step} onBack={() => done('back', picks)} onSkip={() => done('next', [])}
        next={<Btn variant="primary" label={doneLabel(picks.length)} disabled={!picks.length} onPress={() => done('next', picks)} />} />
    </Card>
  );
}

function TopicsCard({ item }: { item: CardItem }) {
  const { step, initial } = item.props as { step: StepInfo; initial: string[] };
  const [sel, setSel] = useState<string[]>(initial || []);
  const grid = useTileGrid();
  const flip = (k: string) => setSel(s => (s.includes(k) ? s.filter(x => x !== k) : [...s, k]));
  const done = (action: 'next' | 'back', value: string[]) => item.finish({ action, value } as StepResult<string[]>);
  const ordered = () => TOPICS.filter(tp => sel.includes(tp.key)).map(tp => tp.key);
  return (
    <Card>
      <StepHeader title="Topics" step={step} />
      <View onLayout={grid.onLayout} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: grid.gap }}>
        {grid.ready ? TOPICS.map(tp => <Tile key={tp.key} e={tp.icon} label={tp.name} width={grid.tileW} on={sel.includes(tp.key)} onPress={() => flip(tp.key)} />) : null}
      </View>
      <StepButtons step={step} onBack={() => done('back', ordered())} onSkip={() => done('next', [])} skipLabel="Just my mood today"
        next={<Btn variant="primary" iconEnd="next" label="Let's go" disabled={!sel.length} onPress={() => done('next', ordered())} />} />
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
  const answerNow = (): TopicAnswer | null => {
    if (topic.todo) { const list = addTodo(); return list.length ? { key: topic.key, picks: [], note: '', todos: list } : null; }
    const picks = Object.values(sel), n = note.ref.current.trim();
    return picks.length || n ? { key: topic.key, picks, note: n, todos: [] } : null;
  };
  const done = (action: 'next' | 'back', value: TopicAnswer | null) => item.finish({ action, value } as StepResult<TopicAnswer | null>);

  return (
    <Card>
      <StepHeader title={topic.name} emoji={topic.icon} step={step} />
      {topic.todo ? (
        <View style={{ gap: 8 }}>
          {todos.map((td, i) => (
            <View key={i + td.t} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingLeft: 14, padding: 4, borderRadius: R.md, backgroundColor: t.c.sunken }}>
              <T raw style={{ flex: 1 }}>{td.t}</T>
              <IconBtn icon="close" label={'Remove ' + td.t} words="Remove" variant="plain" onPress={() => setTodos(todos.filter((_, j) => j !== i))} />
            </View>
          ))}
          <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
            <Box field={todoIn} placeholder="Add a to do" accessibilityLabel="Add a to do" maxLength={120}
              returnKeyType="done" submitBehavior="submit" onSubmitEditing={() => { addTodo(); }} style={{ flex: 1 }} />
            <Btn icon="add" label="Add" height={48} onPress={() => { addTodo(); }} />
          </View>
        </View>
      ) : (
        <>
          <TopicOpts topic={topic} selected={sel} onChange={setSel} />
          <NoteLine field={note} placeholder="A few words (you can skip this)" />
        </>
      )}
      <StepButtons step={step} onBack={() => done('back', answerNow())} onSkip={() => done('next', null)}
        next={<Btn variant="primary" iconEnd="next" label="Next" onPress={() => done('next', answerNow())} />} />
    </Card>
  );
}

export type RecapLine = { id: string; icon: string; title: string; text: string };
/** The last step: one row per step with Change, then Save to journal. Nothing is saved before this. */
function RecapCard({ item }: { item: CardItem }) {
  const t = useTheme();
  const { step, lines } = item.props as { step: StepInfo; lines: RecapLine[] };
  return (
    <Card>
      <StepHeader title="Your check-in" step={step} />
      <View style={{ gap: 8 }}>
        {lines.map(l => (
          <View key={l.id} style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 12, padding: 12, borderRadius: R.md, backgroundColor: t.c.sunken }}>
            <Ico e={l.icon} size={Math.round(t.fs * 1.5)} />
            <View style={{ flex: 1, minWidth: t.fs * 8 }}>
              <T v="label" w={600}>{l.title}</T>
              <T>{l.text}</T>
            </View>
            <Btn label="Change" height={48} a11y={'Change ' + l.title} onPress={() => item.finish({ action: 'change', step: l.id })} />
          </View>
        ))}
      </View>
      <Row end><Btn variant="primary" icon="check" label="Save to journal" onPress={() => item.finish({ action: 'save' })} /></Row>
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
    <Card>
      <T v="title" accessibilityRole="header">Quick start</T>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 8 }}>
        {t.icons ? <View style={{ alignSelf: 'flex-start' }}><Butterfly size={t.presence} /></View> : null}
        <View style={{ flex: 1, paddingVertical: Math.round(t.fs * 0.75), paddingHorizontal: t.fs, borderRadius: R.lg, borderBottomLeftRadius: R.xs, backgroundColor: t.c.lexi }}>
          <WordText text={PREVIEW} target={item.id + '-preview'} />
        </View>
        <IconBtn icon="speaker" label="Read the preview" words="Read" onPress={() => speak(PREVIEW, { target: item.id + '-preview' })} />
      </View>
      <T v="label" w={600}>Text size</T>
      <Row gap={8}>{(Object.keys(SIZES) as Settings['size'][]).map(k => seg('size', k, sizeNames[k]))}</Row>
      <T v="label" w={600}>Letter spacing</T>
      <Row gap={8}>{(Object.keys(LETTERS) as Settings['letters'][]).map(k => seg('letters', k, LETTERS[k][0]))}</Row>
      <T v="label" w={600}>Icons</T>
      <Row gap={8}>{seg('icons', true, 'On')}{seg('icons', false, 'Words only')}</Row>
      <T v="label" w={600}>Read aloud</T>
      <Row gap={8}>{seg('autoread', true, 'On')}{seg('autoread', false, 'Off')}</Row>
      <T v="label" w={600}>Message pace</T>
      <Row gap={8}>{seg('pace', 'auto', PACES.auto)}{seg('pace', 'tap', PACES.tap)}</Row>
      <Row end><Btn variant="primary" icon="check" label="Done" onPress={() => item.finish(true)} /></Row>
    </Card>
  );
}

export function CardView({ item }: { item: CardItem }) {
  switch (item.card) {
    case 'question': return null; // drawn as a Lexi bubble by ChatLog
    case 'crisis': return <Card><CrisisLines emergencyOnly={!!(item.props as { emergencyOnly?: boolean }).emergencyOnly} /></Card>;
    case 'actions': return <ActionsCard item={item} />;
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

