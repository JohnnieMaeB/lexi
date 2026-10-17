// Shared building blocks: themed text, pill buttons, chips and emoji tiles.
// When icons are off, emoji are hidden and the words stay (lexi.html's `.ico` / `.only-text` pair).
import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type TextProps, type TextStyle, type ViewStyle } from 'react-native';
import { mix, useTheme } from './theme';

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

/** An emoji that disappears when icons are off. */
export function Ico({ e, size, style }: { e: string; size?: number; style?: StyleProp<TextStyle> }) {
  const t = useTheme();
  if (!t.icons) return null;
  const px = size ?? Math.round(t.fs * 1.35);
  return <Text accessible={false} importantForAccessibility="no" style={[t.emoji(px), style]}>{t.toned(e)}</Text>;
}

type BtnProps = {
  label?: string; icon?: string; onPress?: () => void; disabled?: boolean;
  variant?: 'plain' | 'primary' | 'danger'; style?: StyleProp<ViewStyle>; a11y?: string;
};
/** `.btn`: a pill with a purple outline; primary is filled. */
export function Btn({ label, icon, onPress, disabled, variant = 'plain', style, a11y }: BtnProps) {
  const t = useTheme();
  const bg = variant === 'primary' ? t.c.accent2 : variant === 'danger' ? t.c.danger : 'transparent';
  const border = variant === 'danger' ? t.c.danger : t.c.accent2;
  const ink = variant === 'primary' ? t.c.onAccent2 : variant === 'danger' ? '#FFFFFF' : t.c.ink;
  return (
    <Pressable
      onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={a11y ?? label}
      accessibilityState={{ disabled: !!disabled }}
      style={({ pressed }) => [s.pill, { minHeight: 48, borderColor: border, backgroundColor: bg, opacity: disabled ? 0.45 : pressed ? 0.8 : 1 }, style]}>
      {icon ? <Ico e={icon} /> : null}
      {label ? <T color={ink}>{label}</T> : null}
    </Pressable>
  );
}

type ChipProps = {
  label?: string; icon?: string; selected?: boolean; onPress?: () => void; disabled?: boolean;
  /** Words to show (and announce) when the chip is icon-only and icons are off. */
  words?: string; a11y?: string; style?: StyleProp<ViewStyle>; labelStyle?: StyleProp<TextStyle>;
  children?: React.ReactNode;
};
/** `.chip`: a smaller pill; selected chips get the purple outline and lilac fill. */
export function Chip({ label, icon, selected, onPress, disabled, words, a11y, style, labelStyle, children }: ChipProps) {
  const t = useTheme();
  const showWords = !label && words && !t.icons;
  return (
    <Pressable
      onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={a11y ?? label ?? words}
      accessibilityState={{ selected: selected == null ? undefined : selected, disabled: !!disabled }}
      style={({ pressed }) => [s.pill, {
        minHeight: 44, paddingHorizontal: t.fs * 0.95, borderColor: selected ? t.c.accent2 : t.c.line,
        backgroundColor: selected ? t.c.sel : t.c.surface, opacity: pressed ? 0.8 : 1,
      }, style]}>
      {icon ? <Ico e={icon} size={Math.round(t.fs * 1.25)} /> : null}
      {children}
      {label ? <T bold={selected} style={labelStyle}>{label}</T> : null}
      {showWords ? <T>{words}</T> : null}
    </Pressable>
  );
}

type ChoiceProps = { label: string; icon?: string; onPress?: () => void; filled?: boolean; dim?: boolean; disabled?: boolean };
/** `.choice`: the big answer buttons in the chat (Yes / No, menus). */
export function Choice({ label, icon, onPress, filled, dim, disabled }: ChoiceProps) {
  const t = useTheme();
  return (
    <Pressable
      onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label}
      style={({ pressed }) => [s.pill, {
        minHeight: 48, paddingHorizontal: t.fs * 1.15, borderColor: t.c.accent2,
        backgroundColor: filled ? t.c.accent2 : t.c.surface, opacity: dim ? 0.4 : pressed ? 0.8 : 1,
      }]}>
      {icon ? <Ico e={icon} /> : null}
      <T color={filled ? t.c.onAccent2 : t.c.ink}>{label}</T>
    </Pressable>
  );
}

/** `.opt`: an emoji tile with its word underneath (mood and topic pickers). */
export function Tile({ e, label, on, onPress, disabled, width }: { e: string; label: string; on: boolean; onPress: () => void; disabled?: boolean; width?: number }) {
  const t = useTheme();
  const w = width ?? Math.round(t.fs * 4.6);
  return (
    <Pressable
      onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: on }}
      style={({ pressed }) => [s.tile, {
        width: w, minHeight: t.icons ? Math.round(t.fs * 4.4) : Math.round(t.fs * 3),
        borderColor: on ? t.c.accent2 : 'transparent', backgroundColor: on ? t.c.sel : t.c.surface,
        justifyContent: t.icons ? 'flex-start' : 'center', opacity: pressed ? 0.8 : 1,
      }]}>
      <Ico e={e} size={Math.round(t.fs * 1.9)} />
      <T em={t.icons ? 0.72 : 0.85} style={{ textAlign: 'center', lineHeight: Math.round(t.fs * (t.icons ? 0.72 : 0.85) * 1.3) }}>{label}</T>
    </Pressable>
  );
}

export const Row = ({ children, style, gap = 10, end }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; gap?: number; end?: boolean }) => (
  <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap, alignItems: 'center' }, end && { justifyContent: 'flex-end' }, style]}>{children}</View>
);

/** `.card`: the bordered panels the check-in steps sit in. */
export function Card({ children, done }: { children: React.ReactNode; done?: boolean }) {
  const t = useTheme();
  return (
    <View pointerEvents={done ? 'none' : 'auto'} style={[s.card, { borderColor: t.c.line, backgroundColor: t.c.surface, opacity: done ? 0.6 : 1 }]}>
      {children}
    </View>
  );
}

/** A dot in the band's color (`.swatch`). */
export function Swatch({ color }: { color: string }) {
  const t = useTheme();
  return <View style={{ width: t.fs * 0.9, height: t.fs * 0.9, borderRadius: 99, borderWidth: 2, borderColor: mix(t.c.ink, t.c.surface, 0.3), backgroundColor: color }} />;
}

const s = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, paddingHorizontal: 20, paddingVertical: 4, borderRadius: 999, borderWidth: 2 },
  tile: { alignItems: 'center', gap: 2, paddingTop: 8, paddingBottom: 6, paddingHorizontal: 4, borderWidth: 2, borderRadius: 16 },
  card: { gap: 14, padding: 14, borderWidth: 2, borderRadius: 22 },
});
