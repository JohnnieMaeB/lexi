// 📖 My journal (DESIGN.md "Journal"): a stats row, day cards for the last 14 days, then entries by day.
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { TOPIC_BY, type Pick } from '../content';
import { entrySummary, moodShares, openSheet, startGuided } from '../script';
import { speak } from '../speech';
import { removeEntry, toast, updateEntry, useLexi, type Entry } from '../store';
import { dayKey, fmtDay, fmtTime, stripEmoji } from '../text';
import { R, mix, useTheme } from '../theme';
import { Btn, Chip, Ico, Row, Swatch, T } from '../ui';

const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const countWords = (s: string) => stripEmoji(s).split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w)).length;

/** FEATURES_DO_NEXT §11: days journaled, feelings named and entries; streak and words only if switched on.
 *  The streak allows rest days: one missed day doesn't break the run, two in a row do. */
export function stats(all: Entry[], byDay: Map<string, Entry[]>) {
  const days = byDay.size;
  const feelings = all.reduce((n, e) => n + (e.moods || []).length, 0);
  let streak = 0, missed = 0;
  const d = new Date();
  for (let i = 0; i < 3660 && missed < 2; i++) {
    if (byDay.has(dayKey(d))) { streak++; missed = 0; } else missed++;
    d.setDate(d.getDate() - 1);
  }
  const words = all.reduce((n, e) => n + countWords(e.text || '') + (e.topics || []).reduce((m, tp) => m + countWords(tp.note || '') + (tp.todos || []).reduce((k, td) => k + countWords(td.t), 0), 0), 0);
  return { days, feelings, entries: all.length, streak, words };
}

/** The day's most-picked mood emoji (latest wins a tie). */
function mainEmoji(es: Entry[]): string | null {
  const counts = new Map<string, number>();
  es.slice().reverse().forEach(e => (e.moods || []).forEach((m: Pick) => counts.set(m.e, (counts.get(m.e) || 0) + 1)));
  let best: string | null = null, n = 0;
  for (const [e, c] of counts) { if (c >= n) { best = e; n = c; } }
  return best ?? (es.length ? '✏️' : null);
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  const t = useTheme();
  return (
    <View style={[s.stat, t.shadow, { backgroundColor: t.c.surface }]} accessible accessibilityLabel={value + ' ' + label}>
      <Ico e={icon} size={34} />
      <T em={1.5} display bold style={{ lineHeight: Math.round(t.fs * 1.9) }}>{String(value)}</T>
      <T em={0.75} soft style={{ textAlign: 'center' }}>{label}</T>
    </View>
  );
}

function DayCards({ byDay }: { byDay: Map<string, Entry[]> }) {
  const t = useTheme();
  const ref = useRef<ScrollViewInstance>(null);
  const days = Array.from({ length: 14 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (13 - i)); return d; });
  return (
    <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator={false} accessibilityLabel="Your last 14 days"
      onContentSizeChange={() => ref.current?.scrollToEnd({ animated: false })}
      contentContainerStyle={{ gap: 10, paddingVertical: 8, paddingHorizontal: 2 }} style={{ marginHorizontal: -2 }}>
      {days.map((d, i) => {
        const es = byDay.get(dayKey(d)) || [];
        const today = i === 13;
        const c = moodShares(es.flatMap(e => e.moods || []));
        const total = c.content + c.stressed + c.low;
        const em = mainEmoji(es);
        const bands = ([['content', t.c.bContent], ['stressed', t.c.bStressed], ['low', t.c.bLow]] as const).filter(([k]) => c[k]);
        const desc = SHORT_DAYS[d.getDay()] + ' ' + d.getDate() + ': ' + (es.length ? es.length + (es.length === 1 ? ' entry' : ' entries') : 'no entry');
        return (
          <View key={i} accessible accessibilityLabel={desc} style={[s.day, es.length ? t.shadow : null, { width: Math.round(84 * Math.min(t.k, 1.6)),
            backgroundColor: es.length ? t.c.surface : mix(t.c.surface, t.c.bg, 0.45),
            borderWidth: today ? 3 : es.length ? 0 : 2, borderStyle: es.length || today ? 'solid' : 'dashed',
            borderColor: today ? t.c.ring : t.c.line,
          }]}>
            <T em={0.75} bold={today} soft={!today}>{today ? 'Today' : SHORT_DAYS[d.getDay()]}</T>
            <T display bold em={1.25} style={{ lineHeight: Math.round(t.fs * 1.6) }}>{String(d.getDate())}</T>
            <View style={{ height: 50, justifyContent: 'center' }}>
              {em && t.icons ? <Text style={t.emoji(40)}>{t.toned(em)}</Text> : <T soft em={1.4}>{em ? '•' : '·'}</T>}
            </View>
            <View style={[s.bar, { backgroundColor: total ? 'transparent' : t.c.line }]}>
              {bands.map(([k, col]) => <View key={k} style={{ flex: c[k], backgroundColor: col }} />)}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

/** An empty box, or ✅ once done (no strikethrough anywhere, §3). */
function CheckBox({ on }: { on: boolean }) {
  const t = useTheme();
  if (on) return <Text style={[t.emoji(26), { width: 30 }]}>✅</Text>;
  return <View style={{ width: 26, height: 26, marginHorizontal: 2, borderRadius: 8, borderWidth: 2, borderColor: t.c.yes }} />;
}

function EntryCard({ en, confirming, setConfirm }: { en: Entry; confirming: boolean; setConfirm: (id: string | null) => void }) {
  const t = useTheme();
  const [showOriginal, setShowOriginal] = useState(false);
  const kind = en.kind === 'free' ? ['✏️', 'Free writing'] : ['🧭', 'Check-in'];
  const toggleTodo = (ti: number, i: number) => {
    const topics = en.topics.map((tp, a) => (a !== ti ? tp : { ...tp, todos: tp.todos.map((td, b) => (b !== i ? td : { ...td, done: !td.done })) }));
    updateEntry(en.id, { topics });
  };
  const headBtn = { minWidth: 44, minHeight: 44, paddingHorizontal: 6, borderRadius: R.s, alignItems: 'center' as const, justifyContent: 'center' as const };
  return (
    <View style={[s.entry, t.shadow, { backgroundColor: t.c.surface }, t.dark && { borderWidth: 1, borderColor: t.c.line }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ico e={kind[0]} size={30} />
        <T em={0.85} soft style={{ flex: 1 }}>{kind[1] + ' · ' + fmtTime(en.createdAt || Date.now())}</T>
        <Pressable onPress={() => speak(entrySummary(en) + (en.reflection ? '\n' + en.reflection : ''))} accessibilityRole="button" accessibilityLabel="Read this entry aloud" style={headBtn}>
          {t.icons ? <Text style={t.emoji(28)}>🔊</Text> : <T em={0.85}>Read</T>}
        </Pressable>
        <Pressable onPress={() => setConfirm(en.id)} accessibilityRole="button" accessibilityLabel="Delete this entry" style={headBtn}>
          {t.icons ? <Text style={t.emoji(28)}>🗑️</Text> : <T em={0.85}>Delete</T>}
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
        <Row gap={8}>
          {en.moods.map((m, i) => (
            <View key={i} style={[s.mchip, { backgroundColor: mix(t.band(m.band).b, t.c.surface, t.dark ? 0.25 : 0.3) }]}>
              <Ico e={m.e} size={28} />
              <T em={0.85}>{m.label}</T>
            </View>
          ))}
        </Row>
      ) : null}
      {(en.topics || []).map((tp, ti) => {
        const T0 = TOPIC_BY[tp.key];
        return (
          <View key={ti} style={{ gap: 4 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              {T0 ? <Ico e={T0.icon} size={26} /> : null}
              <T em={0.9} bold>{T0 ? T0.name : tp.key}</T>
            </View>
            {tp.picks && tp.picks.length ? (
              <Row gap={8}>
                {tp.picks.map((p, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ico e={p.e} size={26} /><T>{p.label}</T>
                  </View>
                ))}
              </Row>
            ) : null}
            {(tp.todos || []).map((td, i) => (
              <Pressable key={i} onPress={() => toggleTodo(ti, i)} accessibilityRole="checkbox" accessibilityState={{ checked: td.done }} accessibilityLabel={td.t}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 44 }}>
                <CheckBox on={td.done} />
                <T style={td.done ? { opacity: 0.6 } : undefined}>{td.t}</T>
              </Pressable>
            ))}
            {tp.note ? <T>{tp.note}</T> : null}
          </View>
        );
      })}
      {en.text ? <T>{showOriginal && en.original ? en.original : en.text}</T> : null}
      {en.original ? (
        <Row><Chip icon={showOriginal ? '✨' : '📝'} label={showOriginal ? 'See the tidied words' : 'See my original words'} selected={showOriginal} onPress={() => setShowOriginal(!showOriginal)} /></Row>
      ) : null}
      {en.reflection ? (
        <View style={[s.reflection, { backgroundColor: t.c.bot, borderWidth: t.c.botLine ? 1 : 0, borderColor: t.c.botLine || 'transparent' }]}>
          <Ico e="🤖" size={28} />
          <T color={t.c.botInk} style={{ flex: 1 }}>{en.reflection}</T>
        </View>
      ) : null}
    </View>
  );
}

export function JournalScreen() {
  const t = useTheme();
  const st = useLexi();
  const [confirmId, setConfirm] = useState<string | null>(null);
  const pad = { paddingHorizontal: t.pad, paddingTop: 20, paddingBottom: 28 };
  const head = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
      <Ico e="📖" size={36} />
      <T em={1.45} display bold accessibilityRole="header">My journal</T>
    </View>
  );
  if (!st.loaded) {
    return <ScrollView contentContainerStyle={pad}>{head}<T em={0.85} soft>Opening your journal…</T></ScrollView>;
  }
  const all = st.entries;
  const byDay = new Map<string, Entry[]>();
  all.forEach(e => { const k = e.day || dayKey(new Date(e.createdAt)); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k)!.push(e); });
  const n = stats(all, byDay);
  return (
    <ScrollView contentContainerStyle={pad} keyboardShouldPersistTaps="handled">
      <View style={{ gap: 4 }}>
        {head}
        <T em={0.85} soft>{all.length + (all.length === 1 ? ' entry' : ' entries') + ' · 💾 Saved on this device only.'}</T>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <Stat icon="📅" value={n.days} label={n.days === 1 ? 'Day journaled' : 'Days journaled'} />
        <Stat icon="💬" value={n.feelings} label={n.feelings === 1 ? 'Feeling named' : 'Feelings named'} />
        <Stat icon="📖" value={n.entries} label={n.entries === 1 ? 'Entry' : 'Entries'} />
      </View>
      {st.settings.showStreak ? (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <Stat icon="🌱" value={n.streak} label="Days in a row (rest days OK)" />
          <Stat icon="✏️" value={n.words} label={n.words === 1 ? 'Word written' : 'Words written'} />
        </View>
      ) : null}

      <T display bold style={{ marginTop: 20 }} accessibilityRole="header">Last 14 days</T>
      <DayCards byDay={byDay} />
      <Row gap={14} style={{ rowGap: 4, marginTop: 4 }}>
        {([[t.c.bContent, 'Content'], [t.c.bStressed, 'Stressed'], [t.c.bLow, 'Low self-esteem']] as const).map(([col, name]) => (
          <View key={name} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Swatch color={col} size={14} />
            <T em={0.75} soft>{name}</T>
          </View>
        ))}
      </Row>

      <Row style={{ marginTop: 18 }}>
        <Btn variant="primary" icon="🧭" label="Guided check-in" onPress={() => startGuided()} />
        <Btn icon="✏️" label="Write on my own" onPress={() => openSheet()} />
      </Row>

      {!all.length ? (
        <View style={[s.empty, { borderColor: t.c.line }]}>
          <Ico e="📖" size={72} />
          <T bold style={{ textAlign: 'center' }}>Your journal is empty.</T>
          <T em={0.85} soft style={{ textAlign: 'center' }}>Do a check-in or write on your own. Your entries will show up here, newest first.</T>
        </View>
      ) : (
        [...byDay.entries()].map(([k, es]) => (
          <View key={k}>
            <T display bold soft style={{ marginTop: 24, marginBottom: 10 }} accessibilityRole="header">{fmtDay(k)}</T>
            <View style={{ gap: 14 }}>
              {es.map(en => <EntryCard key={en.id} en={en} confirming={confirmId === en.id} setConfirm={setConfirm} />)}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  stat: { flex: 1, alignItems: 'center', paddingVertical: 12, paddingHorizontal: 6, borderRadius: R.m },
  day: { width: 84, alignItems: 'center', paddingTop: 10, paddingBottom: 12, paddingHorizontal: 8, borderRadius: R.m },
  bar: { flexDirection: 'row', alignSelf: 'stretch', height: 8, borderRadius: 4, overflow: 'hidden', marginTop: 6 },
  entry: { gap: 12, paddingVertical: 14, paddingHorizontal: 16, borderRadius: R.m },
  confirm: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: 12, borderRadius: R.s },
  mchip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingLeft: 8, paddingRight: 12, paddingVertical: 2, borderRadius: 999 },
  reflection: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 14, borderRadius: R.m },
  empty: { marginTop: 24, padding: 24, borderWidth: 2, borderStyle: 'dashed', borderRadius: R.l, alignItems: 'center', gap: 6 },
});
