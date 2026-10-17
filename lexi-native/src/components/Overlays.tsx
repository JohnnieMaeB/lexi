// Things that float above the app: the emoji picker ("any emoji, any time") and the toast.
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EMOJI_SETS } from '../content';
import { closeEmoji, useEmojiTarget } from '../fields';
import { useLexi } from '../store';
import { useTheme } from '../theme';
import { T } from '../ui';

export function EmojiPicker() {
  const t = useTheme();
  const st = useLexi();
  const target = useEmojiTarget();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [tab, setTab] = useState(0);
  if (!target) return null;
  const pick = (em: string) => { target.insert(em); if (target.single) closeEmoji(); };
  const bottom = insets.bottom + (st.sheetOpen ? 96 : 150);
  return (
    <>
      <Pressable style={StyleSheet.absoluteFill} onPress={closeEmoji} accessibilityLabel="Close emoji picker" accessibilityRole="button" />
      <View accessibilityViewIsModal accessibilityLabel="Pick an emoji"
        style={[s.pop, { bottom, maxHeight: Math.min(height * 0.48, 390), borderColor: t.c.line, backgroundColor: t.c.surface, shadowColor: t.c.shadow }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, borderBottomWidth: 2, borderBottomColor: t.c.line }}
          contentContainerStyle={{ gap: 4, padding: 8 }} keyboardShouldPersistTaps="always">
          {EMOJI_SETS.map(([icon, name], i) => (
            <Pressable key={name} onPress={() => setTab(i)} accessibilityRole="tab" accessibilityLabel={name} accessibilityState={{ selected: i === tab }}
              style={[s.tab, { backgroundColor: i === tab ? t.c.sel : 'transparent' }]}>
              <Text style={t.emoji(21)}>{t.toned(icon)}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <T em={0.8} soft style={{ paddingHorizontal: 12, paddingTop: 6 }} raw>{EMOJI_SETS[tab][1]}</T>
        <ScrollView keyboardShouldPersistTaps="always" contentContainerStyle={s.grid}>
          {EMOJI_SETS[tab][2].split(' ').filter(Boolean).map(em => (
            <Pressable key={em} onPress={() => pick(t.toned(em))} accessibilityRole="button" accessibilityLabel={t.toned(em)}
              style={({ pressed }) => [s.cell, { backgroundColor: pressed ? t.c.sel : 'transparent' }]}>
              <Text style={t.emoji(26)}>{t.toned(em)}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </>
  );
}

export function Toast() {
  const t = useTheme();
  const st = useLexi();
  const insets = useSafeAreaInsets();
  if (!st.toast) return null;
  return (
    <View pointerEvents="none" style={[s.toastWrap, { bottom: insets.bottom + 140 }]}>
      <View accessibilityLiveRegion="polite" accessibilityRole="alert" style={[s.toast, { backgroundColor: t.c.ink, shadowColor: t.c.shadow }]}>
        <T em={0.9} color={t.c.bg}>{st.toast.msg}</T>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  pop: { position: 'absolute', left: 16, right: 16, borderWidth: 2, borderRadius: 20, shadowOpacity: 1, shadowRadius: 20, shadowOffset: { width: 0, height: 12 }, elevation: 12, overflow: 'hidden' },
  tab: { minWidth: 44, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8, gap: 2 },
  cell: { width: 46, height: 44, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  toastWrap: { position: 'absolute', left: 16, right: 16, alignItems: 'center' },
  toast: { paddingHorizontal: 18, paddingVertical: 9, borderRadius: 999, shadowOpacity: 1, shadowRadius: 12, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
});
