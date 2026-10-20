// Full-screen sheets (free writing, speak an entry, help), DESIGN_WARM_PAPER §7: a canvas header with the title and a
// 48 px secondary Close button, a body with no rails, and a surface footer with a top hairline. Sheets come in over
// 350 ms (a 150 ms fade under Reduce Motion).
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DUR, EASE, reduceMotion } from '../a11y';
import { useTheme } from '../theme';
import type { IconName } from '../art';
import { Btn, Icon, Ico, T } from '../ui';

export function SheetFrame({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: reduceMotion ? 150 : DUR.sheet, easing: EASE, useNativeDriver: true }).start();
  }, [v]);
  const rise = reduceMotion ? [] : [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [32, 0] }) }];
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: t.scrim }]}>
      <Animated.View accessibilityViewIsModal style={{ flex: 1, backgroundColor: t.c.canvas, opacity: v, transform: rise }}>
        {children}
      </Animated.View>
    </View>
  );
}

export function SheetHead({ emoji, icon, title, onClose, extra }: { emoji?: string; icon?: IconName; title: string; onClose: () => void; extra?: React.ReactNode }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.head, { paddingTop: insets.top + 8, paddingHorizontal: t.gutter, backgroundColor: t.c.canvas, borderBottomColor: t.c.hairline }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 }}>
        {emoji ? <Ico e={emoji} size={Math.round(t.fs * 1.5)} /> : null}
        {icon && t.icons ? <Icon name={icon} /> : null}
        <T v="title" accessibilityRole="header" style={{ flexShrink: 1 }}>{title}</T>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {extra}
        <Btn icon="close" label="Close" height={48} onPress={onClose} />
      </View>
    </View>
  );
}

export function SheetFoot({ children }: { children: React.ReactNode }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.foot, { paddingBottom: insets.bottom + 12, paddingHorizontal: t.gutter, borderTopColor: t.c.hairline, backgroundColor: t.card }]}>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10, paddingBottom: 10, borderBottomWidth: 1 },
  foot: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'flex-end', paddingTop: 12, borderTopWidth: 1 },
});
