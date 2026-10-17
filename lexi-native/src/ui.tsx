// Shared building blocks: themed text, pills, chips, emoji tiles and cards (DESIGN.md size scale and polish rules).
// When icons are off, emoji are hidden and the words stay (lexi.html's `.ico` / `.only-text` pair).
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from 'react-native';
import { reduceMotion } from './chat';
import { R, mix, useTheme } from './theme';

type TProps = TextProps & {
  children?: React.ReactNode; em?: number; bold?: boolean; display?: boolean; color?: string; soft?: boolean;
  /** Skip skin tone and icon handling (for text people typed into an input). */
  raw?: boolean; style?: StyleProp<TextStyle>;
};
export function T({ children, em = 1, bold, display, color, soft, raw, style, ...rest }: TProps) {
  const t = useTheme();
  const kids = raw ? children : React.Children.map(children, ch => (typeof ch === 'string' ? t.rich(ch) : ch));
  return <Text {...rest} style={[t.text(em, { bold, display, color: color ?? (soft ? t.c.inkSoft : undefined) }), style]}>{kids}</Text>;
}

/** An emoji that disappears when icons are off. Sizes are pixels. */
export function Ico({ e, size = 30, style }: { e: string; size?: number; style?: StyleProp<TextStyle> }) {
  const t = useTheme();
  if (!t.icons) return null;
  return <Text accessible={false} importantForAccessibility="no" style={[t.emoji(size), style]}>{t.toned(e)}</Text>;
}

/** Fade and grow from 96 % (220 ms), unless reduce motion is on. */
export function PopIn({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const v = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  useEffect(() => { if (!reduceMotion) Animated.timing(v, { toValue: 1, duration: 220, useNativeDriver: true }).start(); }, [v]);
  return (
    <Animated.View style={[style, { opacity: v, transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) }] }]}>
      {children}
    </Animated.View>
  );
}

type BtnProps = {
  label?: string; icon?: string; onPress?: () => void; disabled?: boolean;
  variant?: 'plain' | 'primary' | 'danger'; style?: StyleProp<ViewStyle>; a11y?: string;
};
/** A pill with an outline in the Yes color; primary is filled. */
export function Btn({ label, icon, onPress, disabled, variant = 'plain', style, a11y }: BtnProps) {
  const t = useTheme();
  const bg = variant === 'primary' ? t.c.yes : variant === 'danger' ? t.c.danger : t.c.surface;
  const border = variant === 'danger' ? t.c.danger : t.c.yes;
  const ink = variant === 'primary' ? t.c.onYes : variant === 'danger' ? '#FFFFFF' : t.c.ink;
  return (
    <Pressable
      onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={a11y ?? label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [s.pill, t.shadow, { minHeight: 52, borderColor: border, backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 }, style]}>
      {icon ? <Ico e={icon} size={26} /> : null}
      {label ? <T color={ink}>{label}</T> : null}
    </Pressable>
  );
}

type ChipProps = {
  label?: string; icon?: string; selected?: boolean; onPress?: () => void; disabled?: boolean;
  /** Words to show (and announce) when the chip is icon-only and icons are off. */
  words?: string; a11y?: string; style?: StyleProp<ViewStyle>; labelStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode; iconSize?: number;
};
/** A smaller pill; selected chips get the theme's ring and a raised surface. */
export function Chip({ label, icon, selected, onPress, disabled, words, a11y, style, labelStyle, children, iconSize = 24 }: ChipProps) {
  const t = useTheme();
  const showWords = !label && words && !t.icons;
  return (
    <Pressable
      onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={a11y ?? label ?? words}
      accessibilityState={{ selected: selected == null ? undefined : selected, disabled: !!disabled }}
      style={({ pressed }) => [s.pill, selected && t.shadow, {
        minHeight: 48, paddingHorizontal: 16, borderWidth: selected ? 3 : 2,
        borderColor: selected ? t.c.ring : t.c.line, backgroundColor: t.c.surface, opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
      }, style]}>
      {icon ? <Ico e={icon} size={iconSize} /> : null}
      {children}
      {label ? <T bold={selected} style={labelStyle}>{label}</T> : null}
      {showWords ? <T>{words}</T> : null}
    </Pressable>
  );
}

type ChoiceProps = { label: string; icon?: string; onPress?: () => void; filled?: boolean; dim?: boolean; disabled?: boolean; big?: boolean };
/** The big answer pills in the chat (Yes / No inside the question bubble, menus). */
export function Choice({ label, icon, onPress, filled, dim, disabled, big }: ChoiceProps) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label}
      style={({ pressed }) => [s.pill, t.shadow, {
        minHeight: big ? 56 : 52, minWidth: big ? 84 : undefined, paddingHorizontal: big ? 18 : 18, borderColor: t.c.yes,
        backgroundColor: filled ? t.c.yes : t.c.surface, opacity: dim ? 0.4 : pressed ? 0.85 : 1,
        transform: [{ scale: pressed ? 0.97 : 1 }],
      }]}>
      {icon ? <Ico e={icon} size={big ? 32 : 28} /> : null}
      {!big || !t.icons ? <T color={filled ? t.c.onYes : t.c.ink}>{label}</T> : null}
    </Pressable>
  );
}

/** A mood or topic tile: 44 px emoji in a rounded square, the word underneath, ✔ badge when picked. */
export function Tile({ e, label, on, onPress, disabled, width }: { e: string; label: string; on: boolean; onPress: () => void; disabled?: boolean; width?: number }) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: on }}
      style={({ pressed }) => [s.tile, on && t.shadow, {
        width: width ?? 96, minHeight: t.icons ? 84 : 56,
        borderWidth: 3, borderColor: on ? t.c.ring : 'transparent', backgroundColor: on ? t.c.sel : mix(t.c.surface, t.c.bg, 0.7),
        justifyContent: t.icons ? 'flex-start' : 'center', transform: [{ scale: pressed ? 0.96 : on ? 1.02 : 1 }],
      }]}>
      <Ico e={e} size={44} />
      <T em={t.icons ? 0.75 : 0.85} bold={on} style={{ textAlign: 'center', lineHeight: Math.round(t.fs * (t.icons ? 0.75 : 0.85) * 1.3) }}>{label}</T>
      {on ? <Badge /> : null}
    </Pressable>
  );
}

/** The ✔ badge on picked tiles, chips and theme cards. */
export function Badge() {
  const t = useTheme();
  return (
    <View style={[s.badge, { backgroundColor: t.c.ring, borderColor: t.c.surface }]}>
      <Text style={{ color: t.dark || t.key === 'mint' || t.key === 'orange' ? '#020000' : '#FFFFFF', fontSize: 13, lineHeight: 16, fontWeight: '700' }}>✔</Text>
    </View>
  );
}

export const Row = ({ children, style, gap = 10, end }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; gap?: number; end?: boolean }) => (
  <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap, alignItems: 'center' }, end && { justifyContent: 'flex-end' }, style]}>{children}</View>
);

/** A soft rounded card (radius 22, one soft shadow). */
export function Card({ children, done, style }: { children: React.ReactNode; done?: boolean; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <View pointerEvents={done ? 'none' : 'auto'} style={[s.card, t.shadow, { backgroundColor: t.c.surface, opacity: done ? 0.6 : 1 }, t.dark && { borderWidth: 1, borderColor: t.c.line }, style]}>
      {children}
    </View>
  );
}

/** A dot in a band's color. */
export function Swatch({ color, size = 16 }: { color: string; size?: number }) {
  const t = useTheme();
  return <View style={{ width: size, height: size, borderRadius: 99, borderWidth: 2, borderColor: mix(t.c.ink, t.c.surface, 0.3), backgroundColor: color }} />;
}

const s = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 4, borderRadius: R.pill, borderWidth: 2 },
  tile: { alignItems: 'center', gap: 2, paddingTop: 10, paddingBottom: 8, paddingHorizontal: 4, borderRadius: R.tile },
  card: { gap: 14, padding: 14, borderRadius: R.m },
  badge: { position: 'absolute', top: -6, right: -6, width: 24, height: 24, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
});
