// 📖 Journal (DESIGN_WARM_PAPER §10): the title, two stat cards, the "Last two weeks" grid with each day's main
// feeling group as a shape, the Home buttons, then entries by day.
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BANDS, TOPIC_BY, type BandKey } from '../content';
import { entrySummary, openSheet, openVoiceSheet, startGuided } from '../script';
import { usePlayback } from '../recording';
import { WordText } from '../components/WordText';
import { speak } from '../speech';
import { removeEntry, toast, updateEntry, useLexi, type Entry } from '../store';
import { dayKey, fmtDay, fmtTime, stripEmoji } from '../text';
import { R, useTheme } from '../theme';
import { SHORT_DAYS, bandName, dayCell, mostDays, twoWeeks } from '../week';
import { Btn, Butterfly, Card, Chip, Icon, IconBtn, Ico, Row, Shape, T } from '../ui';

const countWords = (s: string) => stripEmoji(s).split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w)).length;

/** FEATURES_DO_NEXT §11: days journaled, feelings named and entries; streak and words only if switched on.
 *  The streak allows rest days: one missed day doesn't break the run, two in a row do. */
export function stats(all: Entry[], byDay: Map<string, Entry[]>) {
  const days = byDay.size;
  const feelings = all.reduce((n, e) => n + (e.moods || []).length + (e.nuance || []).length, 0);
  let streak = 0, missed = 0;
  const d = new Date();
  for (let i = 0; i < 3660 && missed < 2; i++) {
    if (byDay.has(dayKey(d))) { streak++; missed = 0; } else missed++;
    d.setDate(d.getDate() - 1);
  }
  const words = all.reduce((n, e) => n + countWords(e.text || '') + (e.topics || []).reduce((m, tp) => m + countWords(tp.note || '') + (tp.todos || []).reduce((k, td) => k + countWords(td.t), 0), 0), 0);
  return { days, feelings, entries: all.length, streak, words };
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <Card style={{ flex: 1, gap: 2, alignItems: 'flex-start' }}>
      <View accessible accessibilityLabel={value + ' ' + label}>
        <T v="headline">{String(value)}</T>
        <T v="caption" muted>{label}</T>
      </View>
    </Card>
  );
}

/** Last two weeks (§10): last week and this week, Monday to Sunday, under a weekday row. */
function TwoWeeks({ entries }: { entries: Entry[] }) {
  const t = useTheme();
  const [w, setW] = useState(0);
  const now = new Date();
  const days = twoWeeks(now);
  const cells = days.map(d => dayCell(d, entries, now));
  const most = mostDays(entries, days);
  const gap = 6;
  const cellW = w ? Math.floor((w - gap * 6) / 7) : 0;
  const cap = Math.max(16, t.fs * 0.889) * t.k;
  const short = !!cellW && cellW < cap * 2.3;
  return (
    <View style={{ gap: 12 }}>
      <T v="title" accessibilityRole="header">Last two weeks</T>
      <View onLayout={e => setW(e.nativeEvent.layout.width)} style={{ gap }}>
        <View style={{ flexDirection: 'row', gap }}>
          {SHORT_DAYS.map(d => <T key={d} v="caption" muted style={{ width: cellW || undefined, flex: cellW ? undefined : 1, textAlign: 'center' }}>{short ? d[0] : d}</T>)}
        </View>
        {cellW ? [0, 1].map(row => (
          <View key={row} style={{ flexDirection: 'row', gap }}>
            {cells.slice(row * 7, row * 7 + 7).map(c => {
              const tone = c.band ? t.band(c.band) : null;
              return (
                <View key={c.key} accessible accessibilityLabel={(c.today ? 'Today, ' : '') + c.label}
                  style={[s.cell, {
                    width: cellW, minHeight: Math.max(cellW, Math.round(56 * Math.min(t.k, 1.6))),
                    backgroundColor: c.future ? 'transparent' : tone ? tone.soft : t.c.sunken,
                    borderWidth: c.future ? 1.5 : 0, borderStyle: 'dashed', borderColor: t.c.borderStrong,
                  }, c.today && { outlineWidth: 3, outlineStyle: 'solid', outlineColor: t.c.accentInk, outlineOffset: 0 }]}>
                  <T v="label" w={c.today ? 600 : 500} color={c.future ? t.c.inkMuted : tone ? tone.ink : t.c.ink}>{String(c.date.getDate())}</T>
                  {c.band ? <Shape band={c.band} size={16} />
                    : c.entries ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: t.c.inkMuted }} />
                    : <View style={{ height: 8 }} />}
                </View>
              );
            })}
          </View>
        )) : null}
      </View>
      {most ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessible accessibilityLabel={'Most days: ' + (most === 'mixed' ? 'mixed' : bandName(most))}>
          <T v="label">Most days:</T>
          {most === 'mixed' ? <T v="label" w={600}>mixed</T> : (
            <>
              <Shape band={most} size={20} />
              <T v="label" w={600}>{bandName(most)}</T>
            </>
          )}
        </View>
      ) : null}
      <Row gap={16} style={{ rowGap: 4 }}>
        {BANDS.map(b => (
          <View key={b.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Shape band={b.key as BandKey} size={16} />
            <T v="caption" muted>{b.name}</T>
          </View>
        ))}
      </Row>
    </View>
  );
}

/** An empty box, or a filled check once done (no strikethrough anywhere). */
function CheckBox({ on }: { on: boolean }) {
  const t = useTheme();
  return (
    <View style={{ width: 28, height: 28, borderRadius: R.sm, borderWidth: on ? 0 : 1.5, borderColor: t.c.borderStrong, backgroundColor: on ? t.c.accentInk : t.c.sunken, alignItems: 'center', justifyContent: 'center' }}>
      {on ? <Icon name="check" size={18} color={t.c.onAccent} /> : null}
    </View>
  );
}

function EntryCard({ en, confirming, setConfirm }: { en: Entry; confirming: boolean; setConfirm: (id: string | null) => void }) {
  const t = useTheme();
  const [showOriginal, setShowOriginal] = useState(false);
  const play = usePlayback(en.audio);
  const kind = en.kind === 'free' ? ['✏️', 'Free writing'] : en.kind === 'voice' ? ['🎙️', 'Voice entry'] : ['🧭', 'Check-in'];
  const toggleTodo = (ti: number, i: number) => {
    const topics = en.topics.map((tp, a) => (a !== ti ? tp : { ...tp, todos: tp.todos.map((td, b) => (b !== i ? td : { ...td, done: !td.done })) }));
    updateEntry(en.id, { topics });
  };
  return (
    <Card style={{ gap: 12 }}>
      {/* The head (shared with web): the time in label 600 with the kind under it; the day is the heading above. */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ico e={kind[0]} size={Math.round(t.fs * 1.5)} />
        <View style={{ flex: 1 }}>
          <T v="label" w={600}>{fmtTime(en.createdAt || Date.now())}</T>
          <T v="caption" muted>{kind[1]}</T>
        </View>
        <IconBtn icon="speaker" label="Read this entry aloud" words="Read" onPress={() => speak(entrySummary(en) + (en.reflection ? '\n' + en.reflection : ''))} />
        <IconBtn icon="delete" label="Delete this entry" words="Delete" onPress={() => setConfirm(en.id)} />
      </View>
      {confirming ? (
        <View style={[s.confirm, { backgroundColor: t.c.sunken }]}>
          <T bold style={{ flexGrow: 1, flexBasis: t.fs * 10 }}>Delete this entry? This can't be undone.</T>
          <Btn label="Keep it" height={48} onPress={() => setConfirm(null)} />
          <Btn variant="danger" label="Delete" height={48} onPress={() => { setConfirm(null); removeEntry(en.id); toast('Entry deleted. 🗑️'); }} />
        </View>
      ) : null}
      {en.moods && en.moods.length ? (
        <Row gap={8}>
          {en.moods.map((m, i) => {
            const tone = t.band(m.band);
            return (
              <View key={i} style={[s.mchip, { backgroundColor: tone.soft }]}>
                <Ico e={m.e} size={Math.round(t.fs * 1.3)} />
                <T v="label" color={tone.ink}>{m.label}</T>
              </View>
            );
          })}
        </Row>
      ) : null}
      {/* "Name it more" words, after the mood chips (FEATURES_SOON §12). */}
      {en.nuance && en.nuance.length ? (
        <Row gap={8}>
          {en.nuance.map((m, i) => (
            <View key={i} style={[s.mchip, { borderWidth: 1, borderColor: t.band(m.band).solid, backgroundColor: t.card }]}>
              <Ico e={m.e} size={Math.round(t.fs * 1.2)} />
              <T v="label">{m.label}</T>
            </View>
          ))}
        </Row>
      ) : null}
      {/* Voice entries (§4): play the recording; the transcript is under it. */}
      {en.audio ? (
        <Row><Chip icon={play.playing ? 'stop' : 'play'} label={play.playing ? 'Stop' : 'Play my recording'} onPress={play.toggle} /></Row>
      ) : null}
      {(en.topics || []).map((tp, ti) => {
        const T0 = TOPIC_BY[tp.key];
        return (
          <View key={ti} style={{ gap: 6 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              {T0 ? <Ico e={T0.icon} size={Math.round(t.fs * 1.3)} /> : null}
              <T v="label" w={600}>{T0 ? T0.name : tp.key}</T>
            </View>
            {tp.picks && tp.picks.length ? (
              <Row gap={12}>
                {tp.picks.map((p, i) => (
                  <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Ico e={p.e} size={Math.round(t.fs * 1.3)} /><T>{p.label}</T>
                  </View>
                ))}
              </Row>
            ) : null}
            {(tp.todos || []).map((td, i) => (
              <Pressable key={i} onPress={() => toggleTodo(ti, i)} accessibilityRole="checkbox" accessibilityState={{ checked: td.done }} accessibilityLabel={td.t}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 }}>
                <CheckBox on={td.done} />
                <T raw muted={td.done} style={{ flex: 1 }}>{td.t}</T>
              </Pressable>
            ))}
            {tp.note ? <WordText text={tp.note} /> : null}
          </View>
        );
      })}
      {/* Tap any word to hear it (§2). */}
      {en.text ? <WordText text={showOriginal && en.original ? en.original : en.text} /> : null}
      {en.original ? (
        <Row><Chip emoji={showOriginal ? '✨' : '📝'} label={showOriginal ? 'See the tidied words' : 'See my original words'} selected={showOriginal} onPress={() => setShowOriginal(!showOriginal)} /></Row>
      ) : null}
      {/* Lexi's reflection, with the butterfly in front of it (§10). */}
      {en.reflection ? (
        <View style={[s.reflection, { backgroundColor: t.c.lexi }]}>
          {t.icons ? <View style={{ paddingTop: 2 }}><Butterfly size={20} /></View> : null}
          <T style={{ flex: 1 }}>{en.reflection}</T>
        </View>
      ) : null}
    </Card>
  );
}

export function JournalScreen() {
  const t = useTheme();
  const st = useLexi();
  const [confirmId, setConfirm] = useState<string | null>(null);
  const pad = { paddingHorizontal: t.gutter, paddingTop: 16, paddingBottom: 32, gap: 32 };
  const head = (where: string) => (
    <View style={{ gap: 4 }}>
      <T v="headline" accessibilityRole="header">Journal</T>
      <T v="caption" muted>{where}</T>
    </View>
  );
  if (!st.loaded) return <ScrollView contentContainerStyle={pad}>{head('Opening your journal…')}</ScrollView>;
  const all = st.entries;
  const byDay = new Map<string, Entry[]>();
  all.forEach(e => { const k = e.day || dayKey(new Date(e.createdAt)); if (!byDay.has(k)) byDay.set(k, []); byDay.get(k)!.push(e); });
  const n = stats(all, byDay);
  return (
    <ScrollView contentContainerStyle={pad} keyboardShouldPersistTaps="handled">
      {head((all.length === 1 ? '1 entry' : all.length + ' entries') + '. Saved on this device only.')}

      <View style={{ gap: 12 }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Stat value={n.days} label={n.days === 1 ? 'day journaled' : 'days journaled'} />
          <Stat value={n.feelings} label={n.feelings === 1 ? 'feeling named' : 'feelings named'} />
        </View>
        {st.settings.showStreak ? (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Stat value={n.streak} label="days in a row (rest days OK)" />
            <Stat value={n.words} label={n.words === 1 ? 'word written' : 'words written'} />
          </View>
        ) : null}
      </View>

      <TwoWeeks entries={all} />

      <View style={{ gap: 12 }}>
        <Btn variant="primary" height={64} full emoji="🧭" label="Guided check-in" iconEnd="next" onPress={() => startGuided()} />
        <Btn height={56} full emoji="✏️" label="Write on my own" onPress={() => openSheet()} />
        <Btn height={56} full emoji="🎙️" label="Speak an entry" onPress={() => openVoiceSheet()} />
      </View>

      {!all.length ? (
        <View style={[s.empty, { borderColor: t.c.borderStrong }]}>
          <Ico e="📖" size={72} />
          <T v="label" w={600} style={{ textAlign: 'center' }}>Your journal is empty.</T>
          <T muted style={{ textAlign: 'center' }}>Do a check-in or write on your own. Your entries will show up here, newest first.</T>
        </View>
      ) : (
        [...byDay.entries()].map(([k, es]) => (
          <View key={k} style={{ gap: 12 }}>
            <T v="title" accessibilityRole="header">{fmtDay(k)}</T>
            {es.map(en => <EntryCard key={en.id} en={en} confirming={confirmId === en.id} setConfirm={setConfirm} />)}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  cell: { alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: 6, borderRadius: R.md },
  confirm: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10, padding: 12, borderRadius: R.md },
  mchip: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingLeft: 10, paddingRight: 14, borderRadius: R.full },
  reflection: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', paddingVertical: 12, paddingHorizontal: 16, borderRadius: R.lg },
  empty: { padding: 24, borderWidth: 1.5, borderStyle: 'dashed', borderRadius: R.xl, alignItems: 'center', gap: 8 },
});
