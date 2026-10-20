// Emoji tile pickers (DESIGN_WARM_PAPER §10): the Feelings group switcher with its tiles, More and ➕ My own, the
// "You picked" line, and a topic's options.
import React, { useState } from 'react';
import { View, type LayoutChangeEvent } from 'react-native';
import { BANDS, BAND_BY, type BandKey, type Pick, type Topic } from '../content';
import { addCustom, useLexi } from '../store';
import { R, useTheme } from '../theme';
import { Icon, Ico, Press, Shape, T, Tile } from '../ui';
import { CustomAdder } from './Inputs';

export type Selected = Record<string, Pick>;
export const itemKey = (m: Pick) => (m.band || '') + '|' + m.e + '|' + m.label;
export function toggled(sel: Selected, m: Pick): Selected {
  const k = itemKey(m), next = { ...sel };
  if (next[k]) delete next[k]; else next[k] = m;
  return next;
}

/** A tile grid like `repeat(auto-fill, minmax(min(100%, 8.5em), 1fr))` with a 12 px gap (§3): two columns on a
 *  phone at Medium, fewer as the text grows. */
export function useTileGrid(gap = 12) {
  const t = useTheme();
  const [w, setW] = useState(0);
  const min = Math.min(w, Math.round(t.em * 8.5));
  const cols = w ? Math.max(1, Math.floor((w + gap) / (min + gap))) : 0;
  return {
    gap, ready: w > 0,
    tileW: cols ? Math.floor((w - gap * (cols - 1)) / cols) : 0,
    onLayout: (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width),
  };
}

function Grid({ children, grid }: { children: React.ReactNode; grid: ReturnType<typeof useTileGrid> }) {
  return <View onLayout={grid.onLayout} style={{ flexDirection: 'row', flexWrap: 'wrap', gap: grid.gap }}>{grid.ready ? children : null}</View>;
}

/** The three-group switcher: a sunken track, one segment per band with its shape over its name. The picked group
 *  gets the band's soft fill, an inset ring in its solid colour and its ink. Stacks when the text is large. */
function GroupSwitcher({ group, onPick }: { group: BandKey; onPick: (b: BandKey) => void }) {
  const t = useTheme();
  const [w, setW] = useState(0);
  const cap = Math.max(16, t.fs * 0.889) * t.k;
  // Three across while the longest word ("Stressed") still fits a third of the track.
  const across = !w || (w - 16) / 3 >= cap * 8 * 0.62 + 8;
  return (
    <View onLayout={e => setW(e.nativeEvent.layout.width)}
      style={{ flexDirection: across ? 'row' : 'column', gap: 4, padding: 4, borderRadius: R.lg, backgroundColor: t.c.sunken }}>
      {BANDS.map(b => {
        const on = b.key === group, tone = t.band(b.key);
        return (
          <Press key={b.key} onPress={() => onPick(b.key)} accessibilityRole="togglebutton" accessibilityLabel={b.name} accessibilityState={{ checked: on }}
            style={{
              flex: across ? 1 : undefined, flexDirection: across ? 'column' : 'row', alignItems: 'center', justifyContent: 'center',
              gap: across ? 4 : 10, minHeight: 56, paddingVertical: 8, paddingHorizontal: across ? 2 : 14, borderRadius: R.lg - 4,
              borderWidth: 2, borderColor: on ? tone.solid : 'transparent', backgroundColor: on ? tone.soft : 'transparent',
            }}>
            <Shape band={b.key} size={20} />
            <T v="caption" color={on ? tone.ink : t.c.ink} style={{ textAlign: 'center' }}>{b.name}</T>
          </Press>
        );
      })}
    </View>
  );
}

/** "You picked": a chip for every pick in its band's soft fill. Hidden when nothing is picked. */
export function YouPicked({ picks }: { picks: Pick[] }) {
  const t = useTheme();
  if (!picks.length) return null;
  return (
    <View style={{ gap: 8 }} accessible accessibilityLabel={'You picked: ' + picks.map(p => p.label).join(', ')}>
      <T v="caption" muted>You picked</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {picks.map(p => {
          const tone = t.band(p.band);
          return (
            <View key={itemKey(p)} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 40, paddingHorizontal: 12, borderRadius: R.full, backgroundColor: tone.soft }}>
              <Ico e={p.e} size={Math.round(t.fs * 1.2)} />
              <T v="label" color={tone.ink}>{p.label}</T>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/** Feelings: pick a group, see its first 7 tiles and a dashed More; More shows the rest, then ➕ My own, which adds
 *  to the group on show. Picks stay when you switch groups. */
export function MoodPicker({ selected, onChange, disabled }: { selected: Selected; onChange: (s: Selected) => void; disabled?: boolean }) {
  const st = useLexi();
  const grid = useTileGrid();
  const [group, setGroup] = useState<BandKey>('content');
  const [open, setOpen] = useState<Partial<Record<BandKey, boolean>>>({});
  const [adding, setAdding] = useState(false);
  const band = BAND_BY[group];
  const items: Pick[] = [...band.items.map(([e, label]) => ({ e, label, band: group })), ...(st.custom.mood || []).filter(m => m.band === group)];
  const all = open[group] || items.length <= 7;
  const shown = all ? items : items.slice(0, 7);
  return (
    <View style={{ gap: 16 }}>
      <GroupSwitcher group={group} onPick={b => { setGroup(b); setAdding(false); }} />
      <Grid grid={grid}>
        {shown.map(m => (
          <Tile key={itemKey(m)} e={m.e} label={m.label} width={grid.tileW} on={!!selected[itemKey(m)]} disabled={disabled}
            onPress={() => onChange(toggled(selected, m))} />
        ))}
        {!all ? (
          <Tile dashed icon="chevron" label="More" a11y={'More ' + band.name + ' feelings'} width={grid.tileW} disabled={disabled}
            onPress={() => setOpen({ ...open, [group]: true })} />
        ) : !disabled ? (
          <Tile dashed e="➕" label="My own" a11y={'Add my own ' + band.name + ' feeling'} width={grid.tileW} on={adding} onPress={() => setAdding(!adding)} />
        ) : null}
      </Grid>
      {adding && !disabled ? (
        <CustomAdder onClose={() => setAdding(false)} onAdd={m => {
          const p = { ...m, band: group };
          addCustom('mood', p); onChange({ ...selected, [itemKey(p)]: p }); setAdding(false);
        }} />
      ) : null}
      <YouPicked picks={Object.values(selected)} />
    </View>
  );
}

/** A grid of tiles for any list of picks (Name it more, topic options). */
export function PickGrid({ items, selected, onToggle, disabled, extra }: {
  items: Pick[]; selected: Selected; onToggle: (m: Pick) => void; disabled?: boolean; extra?: (w: number) => React.ReactNode;
}) {
  const grid = useTileGrid();
  return (
    <Grid grid={grid}>
      {items.map(m => <Tile key={itemKey(m)} e={m.e} label={m.label} width={grid.tileW} on={!!selected[itemKey(m)]} disabled={disabled} onPress={() => onToggle(m)} />)}
      {extra ? extra(grid.tileW) : null}
    </Grid>
  );
}

export function TopicOpts({ topic, selected, onChange, disabled }: { topic: Topic; selected: Selected; onChange: (s: Selected) => void; disabled?: boolean }) {
  const st = useLexi();
  const [adding, setAdding] = useState(false);
  const items: Pick[] = [...(topic.opts || []).map(([e, label]) => ({ e, label })), ...(st.custom[topic.key] || [])];
  return (
    <View style={{ gap: 16 }}>
      <PickGrid items={items} selected={selected} onToggle={m => onChange(toggled(selected, m))} disabled={disabled}
        extra={w => (disabled ? null : <Tile dashed e="➕" label="My own" a11y={'Add my own ' + topic.name + ' word'} width={w} on={adding} onPress={() => setAdding(!adding)} />)} />
      {adding && !disabled ? (
        <CustomAdder onClose={() => setAdding(false)} onAdd={m => { addCustom(topic.key, m); onChange({ ...selected, [itemKey(m)]: m }); setAdding(false); }} />
      ) : null}
    </View>
  );
}

/** The optional mood on the writing sheets: a raised box that opens to the Feelings picker. */
export function MoodBox({ selected, onChange }: { selected: Selected; onChange: (s: Selected) => void }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  const n = Object.keys(selected).length;
  return (
    <View style={[{ borderRadius: R.xl, overflow: 'hidden' }, t.raised]}>
      <Press onPress={() => setOpen(!open)} accessibilityRole="button" accessibilityState={{ expanded: open }}
        style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, minHeight: 56, paddingHorizontal: 16, paddingVertical: 8 }}>
        <Ico e="🌡️" size={Math.round(t.fs * 1.4)} />
        <T v="label" w={600}>How do you feel?</T>
        <T v="caption" muted>{n ? n + ' picked' : '(you can skip this)'}</T>
        <View style={{ flex: 1 }} />
        <Icon name="chevron" style={open ? { transform: [{ rotate: '180deg' }] } : undefined} />
      </Press>
      {open ? (
        <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: t.c.hairline }}>
          <MoodPicker selected={selected} onChange={onChange} />
        </View>
      ) : null}
    </View>
  );
}
