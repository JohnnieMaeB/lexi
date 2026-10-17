// 📖 My journal: the 14-day mood strip, then entries grouped by day, newest first.
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { TOPIC_BY } from '../content';
import { entrySummary, moodShares, openSheet, startGuided } from '../script';
import { speak } from '../speech';
import { removeEntry, toast, updateEntry, useLexi, type Entry } from '../store';
import { dayKey, fmtDay, fmtTime, narrowDay } from '../text';
import { mix, useTheme, type Theme } from '../theme';
import { Btn, Ico, Row, T } from '../ui';

type Shares = ReturnType<typeof moodShares>;

/** One day's dot: a pie of Content / Stressed / Low, like the conic-gradient in lexi.html. */
function DayPie({ c, has, size, t }: { c: Shares; has: boolean; size: number; t: Theme }) {
  const total = c.content + c.stressed + c.low;
  const r = size / 2, stroke = has ? mix(t.c.ink, t.c.surface, 0.3) : t.c.line;
  const parts = ([['content', t.c.bContent], ['stressed', t.c.bStressed], ['low', t.c.bLow]] as const).filter(([k]) => c[k]);
  let at = 0;
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => [r + (r - 1) * Math.sin(a * 2 * Math.PI), r - (r - 1) * Math.cos(a * 2 * Math.PI)];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${r},${r} L${x0},${y0} A${r - 1},${r - 1} 0 ${a1 - a0 > 0.5 ? 1 : 0} 1 ${x1},${y1} Z`;
  };
  return (
    <Svg width={size} height={size}>
      {total > 0 && parts.length === 1 ? <Circle cx={r} cy={r} r={r - 1} fill={parts[0][1]} /> : null}
      {total > 0 && parts.length > 1 ? parts.map(([k, col]) => { const a0 = at; at += c[k] / total; return <Path key={k} d={arc(a0, at)} fill={col} />; }) : null}
      {!total && has ? <Circle cx={r} cy={r} r={r - 1} fill={t.c.surface2} /> : null}
      <Circle cx={r} cy={r} r={r - 1} stroke={stroke} strokeWidth={2} fill="none" />
    </Svg>
  );
}

function MoodStrip({ byDay }: { byDay: Map<string, Entry[]> }) {
  const t = useTheme();
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); return d; });
  const legend: [string, string][] = [[t.c.bContent, 'Content'], [t.c.bStressed, 'Stressed'], [t.c.bLow, 'Low self-esteem'], ['transparent', 'No entry']];
  return (
    <View style={[s.strip, { backgroundColor: t.c.surface }]}>
      <T em={0.9} display bold style={{ marginBottom: 8 }}>Last 14 days</T>
      <View style={{ flexDirection: 'row', gap: 3 }} accessible accessibilityLabel="Mood over the last 14 days">
        {days.map((d, i) => {
          const es = byDay.get(dayKey(d)) || [];
          const today = i === 13;
          return (
            <View key={i} style={{ flex: 1, alignItems: 'center', gap: 2 }}>
              <DayPie c={moodShares(es.flatMap(e => e.moods || []))} has={!!es.length} size={20} t={t} />
              <Text style={[t.text(0.66, { bold: today, color: today ? t.c.ink : t.c.inkSoft }), { lineHeight: undefined }]}>{narrowDay(d)}</Text>
              <Text style={[t.text(0.66, { bold: today, color: today ? t.c.ink : t.c.inkSoft }), { lineHeight: undefined }]}>{d.getDate()}</Text>
            </View>
          );
        })}
      </View>
      <Row gap={14} style={{ marginTop: 10, rowGap: 4 }}>
        {legend.map(([col, name]) => (
          <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: mix(t.c.ink, t.c.surface, 0.3), backgroundColor: col }} />
            <T em={0.75} soft>{name}</T>
          </View>
        ))}
      </Row>
    </View>
  );
}

function CheckBox({ on }: { on: boolean }) {
  const t = useTheme();
  return (
    <View style={{ width: 22, height: 22, borderRadius: 5, borderWidth: 2, borderColor: t.c.accent2, backgroundColor: on ? t.c.accent2 : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
      {on ? <Text style={{ color: t.c.onAccent2, fontSize: 14, lineHeight: 16, fontWeight: '700' }}>✓</Text> : null}
    </View>
  );
}

function EntryCard({ en, confirming, setConfirm }: { en: Entry; confirming: boolean; setConfirm: (id: string | null) => void }) {
  const t = useTheme();
  const kind = en.kind === 'free' ? ['✏️', 'Free writing'] : ['🧭', 'Check-in'];
  const toggleTodo = (ti: number, i: number) => {
    const topics = en.topics.map((tp, a) => (a !== ti ? tp : { ...tp, todos: tp.todos.map((td, b) => (b !== i ? td : { ...td, done: !td.done })) }));
    updateEntry(en.id, { topics });
  };
  const headBtn = { minHeight: 40, paddingHorizontal: 8, borderRadius: 10, justifyContent: 'center' as const };
  return (
    <View style={[s.entry, { borderColor: t.c.line, backgroundColor: t.c.surface }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ico e={kind[0]} size={Math.round(t.fs)} />
        <T em={0.85} soft style={{ flex: 1 }}>{kind[1] + ' · ' + fmtTime(en.createdAt || Date.now())}</T>
        <Pressable onPress={() => speak(entrySummary(en) + (en.reflection ? '\n' + en.reflection : ''))} accessibilityRole="button" accessibilityLabel="Read this entry aloud" style={headBtn}>
          {t.icons ? <Text style={t.emoji(Math.round(t.fs * 0.95))}>🔊</Text> : <T em={0.85}>Read</T>}
        </Pressable>
        <Pressable onPress={() => setConfirm(en.id)} accessibilityRole="button" accessibilityLabel="Delete this entry" style={headBtn}>
          {t.icons ? <Text style={t.emoji(Math.round(t.fs * 0.95))}>🗑️</Text> : <T em={0.85}>Delete</T>}
        </Pressable>
      </View>
      {confirming ? (
        <View style={[s.confirm, { backgroundColor: t.c.surface2 }]}>
          <T bold style={{ flexGrow: 1, flexBasis: t.fs * 10 }}>Delete this entry? This can't be undone.</T>
          <Btn label="Keep it" onPress={() => setConfirm(null)} />
          <Btn variant="danger" label="Delete" onPress={() => { setConfirm(null); removeEntry(en.id); toast('Entry deleted. 🗑️'); }} />
        </View>
      ) : null}
      {en.moods && en.moods.length ? (
        <Row gap={6}>
          {en.moods.map((m, i) => (
            <View key={i} style={[s.mchip, { backgroundColor: mix(t.band(m.band).b, t.c.surface, 0.3) }]}>
              <T em={0.85}>{(t.icons ? m.e + ' ' : '') + m.label}</T>
            </View>
          ))}
        </Row>
      ) : null}
      {(en.topics || []).map((tp, ti) => {
        const T0 = TOPIC_BY[tp.key];
        return (
          <View key={ti} style={{ gap: 2 }}>
            <T em={0.9} bold>{T0 ? T0.icon + ' ' + T0.name : tp.key}</T>
            {tp.picks && tp.picks.length ? <T>{tp.picks.map(p => p.e + ' ' + p.label).join(' · ')}</T> : null}
            {(tp.todos || []).map((td, i) => (
              <Pressable key={i} onPress={() => toggleTodo(ti, i)} accessibilityRole="checkbox" accessibilityState={{ checked: td.done }} accessibilityLabel={td.t}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 36 }}>
                <CheckBox on={td.done} />
                <T style={td.done ? { textDecorationLine: 'line-through', opacity: 0.65 } : undefined}>{td.t}</T>
              </Pressable>
            ))}
            {tp.note ? <T>{tp.note}</T> : null}
          </View>
        );
      })}
      {en.text ? <T>{en.text}</T> : null}
      {en.reflection ? (
        <View style={[s.reflection, { backgroundColor: t.c.bot }]}><T color={t.c.botInk}>{'🤖 ' + en.reflection}</T></View>
      ) : null}
    </View>
  );
}

export function JournalScreen() {
  const t = useTheme();
  const st = useLexi();
  const [confirmId, setConfirm] = useState<string | null>(null);
  const pad = { paddingHorizontal: t.narrow ? 10 : 12, paddingTop: 18, paddingBottom: 28 };
  if (!st.loaded) {
    return (
      <ScrollView contentContainerStyle={pad}>
        <T em={1.45} display bold accessibilityRole="header">📖 My journal</T>
        <T em={0.85} soft>Opening your journal…</T>
      </ScrollView>
    );
  }
  const all = st.entries;
  const byDay = new Map<string, Entry[]>();
  all.forEach(e => { const k = e.day || dayKey(new Date(e.createdAt)); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k)!.push(e); });
  return (
    <ScrollView contentContainerStyle={pad} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 4 }}>
        <T em={1.45} display bold accessibilityRole="header">📖 My journal</T>
        <T em={0.85} soft>{all.length + (all.length === 1 ? ' entry' : ' entries') + ' · 💾 Saved on this device only.'}</T>
      </View>
      <MoodStrip byDay={byDay} />
      <Row style={{ marginTop: 16 }}>
        <Btn variant="primary" icon="🧭" label="Guided check-in" onPress={() => startGuided()} />
        <Btn icon="✏️" label="Write on my own" onPress={() => openSheet()} />
      </Row>
      {!all.length ? (
        <View style={[s.empty, { borderColor: t.c.line }]}>
          <Ico e="📖" size={Math.round(t.fs * 2.6)} />
          <T bold style={{ textAlign: 'center' }}>Your journal is empty.</T>
          <T em={0.85} soft style={{ textAlign: 'center' }}>Do a check-in or write on your own. Your entries will show up here, newest first.</T>
        </View>
      ) : (
        [...byDay.entries()].map(([k, es]) => (
          <View key={k}>
            <T display bold soft style={{ marginTop: 24, marginBottom: 8 }} accessibilityRole="header">{fmtDay(k)}</T>
            <View style={{ gap: 12 }}>
              {es.map(en => <EntryCard key={en.id} en={en} confirming={confirmId === en.id} setConfirm={setConfirm} />)}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  strip: { marginTop: 16, padding: 12, borderRadius: 18 },
  entry: { gap: 10, paddingVertical: 12, paddingHorizontal: 14, borderWidth: 2, borderRadius: 20 },
  confirm: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: 10, borderRadius: 14 },
  mchip: { paddingHorizontal: 11, paddingVertical: 1, borderRadius: 999 },
  reflection: { paddingVertical: 8, paddingHorizontal: 13, borderRadius: 16 },
  empty: { marginTop: 24, padding: 20, borderWidth: 2, borderStyle: 'dashed', borderRadius: 20, alignItems: 'center', gap: 6 },
});
