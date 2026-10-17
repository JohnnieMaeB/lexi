// The cards Lexi puts in the chat: answer buttons, the tab legend, the mood picker, topic chips and
// one card per topic. Each calls finish() once; the chat then locks it (dimmed, no taps).
import React, { useState } from 'react';
import { View } from 'react-native';
import { TOPICS, type Pick, type Topic } from '../content';
import { addMe, type ChatItem } from '../chat';
import { useField } from '../fields';
import { showView, type TopicAnswer, type Todo } from '../store';
import { useTheme } from '../theme';
import { Btn, Card, Chip, Choice, Row, T } from '../ui';
import { Box, NoteLine } from './Inputs';
import { MoodPicker, TopicOpts, type Selected } from './Pickers';

type CardItem = Extract<ChatItem, { type: 'card' }>;
type Opt = { e: string; label: string; v?: unknown; run?: () => void };

function ChoicesCard({ item }: { item: CardItem }) {
  const { options, yn } = item.props as { options: Opt[]; yn?: boolean };
  return (
    <Row>
      {options.map((o, i) => (
        <Choice key={o.label} label={o.label} icon={o.e} filled={!!yn && i === 0}
          dim={item.done && item.picked !== i} disabled={item.done}
          onPress={() => {
            if (o.run) { o.run(); return; }
            item.finish(o.v, i); addMe(o.e + ' ' + o.label);
          }} />
      ))}
    </Row>
  );
}

function LegendCard() {
  return (
    <Row gap={8}>
      <Chip icon="⚙️" label="Settings" onPress={() => showView('settings')} />
      <Chip icon="🏡" label="Home" onPress={() => showView('home')} />
      <Chip icon="📖" label="Journal" onPress={() => showView('journal')} />
    </Row>
  );
}

function MoodCard({ item }: { item: CardItem }) {
  const [sel, setSel] = useState<Selected>({});
  const picks = Object.values(sel);
  return (
    <Card done={item.done}>
      <MoodPicker selected={sel} onChange={setSel} disabled={item.done} />
      <Row end>
        <Btn icon="⏭️" label="Skip" onPress={() => item.finish([] as Pick[])} />
        <Btn variant="primary" icon="✔️" label="Done" disabled={!picks.length} onPress={() => item.finish(picks)} />
      </Row>
    </Card>
  );
}

function TopicsCard({ item }: { item: CardItem }) {
  const [sel, setSel] = useState<string[]>([]);
  const flip = (k: string) => setSel(s => (s.includes(k) ? s.filter(x => x !== k) : [...s, k]));
  return (
    <Card done={item.done}>
      <Row gap={8}>
        {TOPICS.map(tp => <Chip key={tp.key} icon={tp.icon} label={tp.name} selected={sel.includes(tp.key)} onPress={() => flip(tp.key)} />)}
      </Row>
      <Row end>
        <Btn label="Just my mood today" onPress={() => item.finish([])} />
        <Btn variant="primary" icon="➜" label="Let's go" disabled={!sel.length} onPress={() => item.finish(TOPICS.filter(tp => sel.includes(tp.key)).map(tp => tp.key))} />
      </Row>
    </Card>
  );
}

function TopicAnswerCard({ item }: { item: CardItem }) {
  const t = useTheme();
  const topic = (item.props as { topic: Topic }).topic;
  const [sel, setSel] = useState<Selected>({});
  const [todos, setTodos] = useState<Todo[]>([]);
  const note = useField('');
  const todoIn = useField('');

  /** Adds what's typed in the to-do box; returns the new list. */
  const addTodo = (): Todo[] => {
    const v = todoIn.ref.current.trim();
    if (!v) return todos;
    const list = [...todos, { t: v, done: false }];
    setTodos(list); todoIn.set('');
    return list;
  };
  const next = () => {
    if (topic.todo) {
      const list = addTodo();
      item.finish(list.length ? ({ key: topic.key, picks: [], note: '', todos: list } as TopicAnswer) : null);
      return;
    }
    const picks = Object.values(sel), n = note.ref.current.trim();
    item.finish(picks.length || n ? ({ key: topic.key, picks, note: n, todos: [] } as TopicAnswer) : null);
  };

  return (
    <Card done={item.done}>
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
      <Row end>
        <Btn icon="⏭️" label="Skip" onPress={() => item.finish(null)} />
        <Btn variant="primary" icon="➜" label="Next" onPress={next} />
      </Row>
    </Card>
  );
}

export function CardView({ item }: { item: CardItem }) {
  switch (item.card) {
    case 'choices': return <ChoicesCard item={item} />;
    case 'legend': return <LegendCard />;
    case 'mood': return <MoodCard item={item} />;
    case 'topics': return <TopicsCard item={item} />;
    case 'topicAnswer': return <TopicAnswerCard item={item} />;
  }
}
