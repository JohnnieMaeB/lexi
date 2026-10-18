// Emoji tile pickers: the three mood bands and a topic's options, each with ➕ My own.
import React, { useState } from 'react';
import { View } from 'react-native';
import { BANDS, type Pick, type Topic } from '../content';
import { addCustom, useLexi } from '../store';
import { R, mix, useTheme } from '../theme';
import { T, Tile } from '../ui';
import { CustomAdder } from './Inputs';

export type Selected = Record<string, Pick>;
export const itemKey = (m: Pick) => (m.band || '') + '|' + m.e + '|' + m.label;
export function toggled(sel: Selected, m: Pick): Selected {
  const k = itemKey(m), next = { ...sel };
  if (next[k]) delete next[k]; else next[k] = m;
  return next;
}

/** Tiles that stretch to fill each row, like `grid-template-columns: repeat(auto-fill, minmax(4.6em, 1fr))`. */
function TileGrid({ items, selected, onToggle, disabled }: { items: Pick[]; selected: Selected; onToggle: (m: Pick) => void; disabled?: boolean }) {
  const t = useTheme();
  const [w, setW] = useState(0);
  const gap = 10, min = Math.round(Math.max(92, t.fs * 4.6) * Math.min(t.k, 1.6));
  const cols = w ? Math.max(1, Math.floor((w + gap) / (min + gap))) : 0;
  const tileW = cols ? Math.floor((w - gap * (cols - 1)) / cols) : min;
  return (
    <View onLayout={e => setW(e.nativeEvent.layout.width)} style={{ flexDirection: 'row', flexWrap: 'wrap', gap }}>
      {w ? items.map(m => (
        <Tile key={itemKey(m)} e={m.e} label={m.label} on={!!selected[itemKey(m)]} onPress={() => onToggle(m)} disabled={disabled} width={tileW} />
      )) : null}
    </View>
  );
}

export function MoodPicker({ selected, onChange, disabled }: { selected: Selected; onChange: (s: Selected) => void; disabled?: boolean }) {
  const t = useTheme();
  const st = useLexi();
  return (
    <View style={{ gap: 10 }}>
      {BANDS.map(b => {
        const { b: col, ink } = t.band(b.key);
        const items: Pick[] = [...b.items.map(([e, label]) => ({ e, label, band: b.key })), ...(st.custom.mood || []).filter(m => m.band === b.key)];
        return (
          <View key={b.key} style={{ padding: 12, borderRadius: R.m, backgroundColor: mix(col, t.c.surface, t.dark ? 0.18 : 0.22) }}>
            <View style={{ alignSelf: 'flex-start', marginBottom: 10, paddingHorizontal: t.fs * 0.8, paddingVertical: 2, borderRadius: 999, backgroundColor: col }}>
              <T em={0.85} display bold color={ink}>{b.name}</T>
            </View>
            <TileGrid items={items} selected={selected} onToggle={m => onChange(toggled(selected, m))} disabled={disabled} />
          </View>
        );
      })}
      {!disabled ? <CustomAdder withBand onAdd={m => { addCustom('mood', m); onChange({ ...selected, [itemKey(m)]: m }); }} /> : null}
    </View>
  );
}

export function TopicOpts({ topic, selected, onChange, disabled }: { topic: Topic; selected: Selected; onChange: (s: Selected) => void; disabled?: boolean }) {
  const st = useLexi();
  const items: Pick[] = [...(topic.opts || []).map(([e, label]) => ({ e, label })), ...(st.custom[topic.key] || [])];
  return (
    <View style={{ gap: 10 }}>
      <TileGrid items={items} selected={selected} onToggle={m => onChange(toggled(selected, m))} disabled={disabled} />
      {!disabled ? <CustomAdder withBand={false} onAdd={m => { addCustom(topic.key, m); onChange({ ...selected, [itemKey(m)]: m }); }} /> : null}
    </View>
  );
}
