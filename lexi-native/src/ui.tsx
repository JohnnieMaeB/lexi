// Shared building blocks (DESIGN_WARM_PAPER §2, §7, §8, §10): text in the type roles, line icons, band shapes,
// the butterfly presence, buttons, chips, tiles and cards. When icons are off, emoji are hidden and every control
// shows its word (lexi.html's `.ico` / `.only-text` pair).
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Image, Pressable, StyleSheet, Text, View,
  type ImageStyle, type PressableProps, type PressableStateCallbackType, type StyleProp, type TextProps, type TextStyle, type ViewStyle,
} from 'react-native';
import { DUR, EASE, reduceMotion } from './a11y';
import { BUTTERFLY, ICONS, SHAPES, type IconName } from './art';
import type { BandKey } from './content';
import { BAND_SHAPE, LISTEN_RING } from './tokens';
import { R, useTheme, type Role, type Weight } from './theme';

type TProps = TextProps & {
  children?: React.ReactNode; v?: Role; w?: Weight; bold?: boolean; color?: string; muted?: boolean; em?: number;
  /** Words the person typed: keep their emoji and skin tone as they are (word gaps still widen). */
  raw?: boolean; style?: StyleProp<TextStyle>;
};
/** Text in a type role (§2), default `body`. `bold` is 600 for interface roles and 700 (emphasis) for body. */
export function T({ children, v = 'body', w, bold, color, muted, em, raw, style, ...rest }: TProps) {
  const t = useTheme();
  const kids = React.Children.map(children, ch => (typeof ch === 'string' ? (raw ? t.spaced(ch) : t.rich(ch)) : ch));
  const weight = w ?? (bold ? (v === 'body' ? 700 : 600) : undefined);
  return <Text {...rest} style={[t.txt(v, { color: color ?? (muted ? t.c.inkMuted : undefined), w: weight, em }), style]}>{kids}</Text>;
}

/** An emoji that disappears when icons are off. Sizes are pixels. */
export function Ico({ e, size = 30, style }: { e: string; size?: number; style?: StyleProp<TextStyle> }) {
  const t = useTheme();
  if (!t.icons) return null;
  return <Text accessible={false} importantForAccessibility="no" style={[t.emoji(size), style]}>{t.toned(e)}</Text>;
}

/** A line icon (§7): 24 px, 2 px stroke, round caps, tinted. Controls use these; emoji stay for content. */
export function Icon({ name, size = 24, color, style }: { name: IconName; size?: number; color?: string; style?: StyleProp<ImageStyle> }) {
  const t = useTheme();
  const px = Math.round(size * Math.min(t.k, 1.4));
  return <Image source={ICONS[name]} fadeDuration={0} accessible={false} importantForAccessibility="no" style={[{ width: px, height: px, tintColor: color ?? t.c.ink }, style]} />;
}

/** A mood band's shape (§1), in the band's solid colour: a band never shows by colour alone. */
export function Shape({ band, size = 16, color }: { band: BandKey; size?: number; color?: string }) {
  const t = useTheme();
  return <Image source={SHAPES[BAND_SHAPE[band]]} fadeDuration={0} accessible={false} importantForAccessibility="no" style={{ width: size, height: size, tintColor: color ?? t.band(band).solid }} />;
}

/** The butterfly presence (§8). Thinking folds the wings to 78 % width; Listening adds two soft rings. Under Reduce
 *  Motion nothing moves (the caller shows the state's word either way). */
export type PresenceState = 'idle' | 'thinking' | 'listening';
export function Butterfly({ size = 36, state = 'idle' }: { size?: number; state?: PresenceState }) {
  const t = useTheme();
  const fold = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (state !== 'thinking') { fold.setValue(1); return; }
    if (reduceMotion) { fold.setValue(0.78); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(fold, { toValue: 0.78, duration: 700, easing: EASE, useNativeDriver: true }),
      Animated.timing(fold, { toValue: 1, duration: 700, easing: EASE, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [state, fold]);
  useEffect(() => {
    if (state !== 'listening' || reduceMotion) { glow.setValue(1); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(glow, { toValue: 0.4, duration: 900, easing: EASE, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 1, duration: 900, easing: EASE, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [state, glow]);
  const layer = { position: 'absolute' as const, left: 0, top: 0, width: size, height: size };
  const ring = (d: number, color: string, w: number) => ({
    position: 'absolute' as const, left: (size - d) / 2, top: (size - d) / 2, width: d, height: d, borderRadius: d / 2, borderWidth: w, borderColor: color,
  });
  return (
    <View style={{ width: size, height: size }} pointerEvents="none" accessible={false} importantForAccessibility="no-hide-descendants">
      {state === 'listening' ? (
        <>
          <Animated.View style={[ring(Math.round(size * 1.56), t.c.lexi, Math.max(3, size * 0.09)), { opacity: glow }]} />
          <View style={ring(Math.round(size * 1.24), LISTEN_RING, Math.max(2, size * 0.06))} />
        </>
      ) : null}
      <Animated.Image source={BUTTERFLY.lower} fadeDuration={0} style={[layer, { tintColor: t.brand.lower, transform: [{ scaleX: fold }] }]} />
      <Animated.Image source={BUTTERFLY.upper} fadeDuration={0} style={[layer, { tintColor: t.brand.upper, transform: [{ scaleX: fold }] }]} />
      <Image source={BUTTERFLY.body} fadeDuration={0} style={[layer, { tintColor: t.c.ink }]} />
    </View>
  );
}

/** A line fades in and rises 4 px over 250 ms (§6). Reduce Motion: a 150 ms fade, no movement. */
export function FadeIn({ children, style, duration = DUR.line }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; duration?: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: reduceMotion ? Math.min(150, duration) : duration, easing: EASE, useNativeDriver: true }).start();
  }, [v, duration]);
  const rise = reduceMotion ? [] : [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }];
  return <Animated.View style={[style, { opacity: v, transform: rise }]}>{children}</Animated.View>;
}

type PressProps = Omit<PressableProps, 'style'> & { style?: StyleProp<ViewStyle> | ((s: PressableStateCallbackType) => StyleProp<ViewStyle>) };
/** Every control: pressed and disabled states, and the 3 px focus ring with a 2 px offset (§10). No scale or lift. */
export function Press({ style, onFocus, onBlur, disabled, ...rest }: PressProps) {
  const t = useTheme();
  const [focus, setFocus] = useState(false);
  return (
    <Pressable {...rest} disabled={disabled}
      onFocus={e => { setFocus(true); onFocus?.(e); }}
      onBlur={e => { setFocus(false); onBlur?.(e); }}
      style={st => [
        typeof style === 'function' ? style(st) : style,
        st.pressed && { opacity: 0.8 },
        disabled && { opacity: 0.45 },
        focus && { outlineWidth: 3, outlineStyle: 'solid', outlineColor: t.c.accentInk, outlineOffset: 2 },
      ]} />
  );
}

type BtnProps = {
  label: string; onPress?: () => void; disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  /** A line icon before the word, an emoji before the word (content), or a line icon after it. */
  icon?: IconName; emoji?: string; iconEnd?: IconName;
  /** 48 for tight rows, 56 normally, 64 for the Home primary. */
  height?: 48 | 56 | 64; full?: boolean; style?: StyleProp<ViewStyle>; a11y?: string;
};
/** Buttons (§10): primary is the accent fill; secondary is surface with a strong edge; danger always shows an icon. */
export function Btn({ label, onPress, disabled, variant = 'secondary', icon, emoji, iconEnd, height = 56, full, style, a11y }: BtnProps) {
  const t = useTheme();
  const bg = variant === 'primary' ? t.c.accent : variant === 'danger' ? t.danger.bg : t.card;
  const ink = variant === 'primary' ? t.c.onAccent : variant === 'danger' ? t.danger.ink : t.c.ink;
  const lead = variant === 'danger' ? icon ?? 'delete' : icon;
  return (
    <Press onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={a11y ?? label} accessibilityState={{ disabled: !!disabled }}
      style={[s.pill, {
        minHeight: height, backgroundColor: bg, borderWidth: variant === 'secondary' ? 1 : 0, borderColor: t.c.borderStrong,
        paddingHorizontal: variant === 'secondary' ? 20 : 21, alignSelf: full ? 'stretch' : undefined,
      }, style]}>
      {emoji ? <Ico e={emoji} size={Math.round(t.fs * 1.3)} /> : null}
      {lead && (t.icons || variant === 'danger') ? <Icon name={lead} color={ink} /> : null}
      <T v="label" w={variant === 'secondary' ? 500 : 600} color={ink} style={{ flexShrink: 1, textAlign: 'center' }}>{label}</T>
      {iconEnd && t.icons ? <Icon name={iconEnd} color={ink} /> : null}
    </Press>
  );
}

type ChipProps = {
  label?: string; emoji?: string; icon?: IconName; selected?: boolean; onPress?: () => void; disabled?: boolean;
  a11y?: string; style?: StyleProp<ViewStyle>; labelStyle?: StyleProp<TextStyle>; children?: React.ReactNode; emojiSize?: number;
};
/** Chips (§10): 48 px, surface, a 1 px strong edge. Pressed: the tint fill and a 2 px ring-coloured edge, at 600. */
export function Chip({ label, emoji, icon, selected, onPress, disabled, a11y, style, labelStyle, children, emojiSize }: ChipProps) {
  const t = useTheme();
  return (
    <Press onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={a11y ?? label}
      accessibilityState={{ selected: selected == null ? undefined : selected, disabled: !!disabled }}
      style={[s.pill, {
        minHeight: 48, paddingHorizontal: selected ? 15 : 16, borderWidth: selected ? 2 : 1,
        borderColor: selected ? t.c.accentInk : t.c.borderStrong, backgroundColor: selected ? t.c.accentTint : t.card,
      }, style]}>
      {emoji ? <Ico e={emoji} size={emojiSize ?? Math.round(t.fs * 1.3)} /> : null}
      {icon && t.icons ? <Icon name={icon} /> : null}
      {children}
      {label ? <T v="label" w={selected ? 600 : 500} style={labelStyle}>{label}</T> : null}
    </Press>
  );
}

/** A round 48 px icon button. `surface` (speaker buttons) has a hairline edge; `ink` (the composer's mic and send)
 *  fills with ink. With icons off it becomes a pill with its word. */
export function IconBtn({ icon, label, onPress, variant = 'surface', size = 48, selected, disabled, words }: {
  icon: IconName; label: string; onPress?: () => void; variant?: 'surface' | 'ink' | 'plain' | 'accent';
  size?: number; selected?: boolean; disabled?: boolean; words?: string;
}) {
  const t = useTheme();
  const bg = variant === 'ink' ? t.c.ink : variant === 'accent' ? t.c.accent : variant === 'plain' ? 'transparent' : t.card;
  const ink = variant === 'ink' ? t.c.canvas : variant === 'accent' ? t.c.onAccent : t.c.ink;
  return (
    <Press onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={label}
      accessibilityState={{ selected: selected == null ? undefined : selected, disabled: !!disabled }} hitSlop={4}
      style={{
        minWidth: size, height: size, borderRadius: R.full, alignItems: 'center', justifyContent: 'center',
        paddingHorizontal: t.icons ? 0 : 14, backgroundColor: bg,
        borderWidth: variant === 'surface' ? 1 : 0, borderColor: t.c.hairline,
      }}>
      {t.icons ? <Icon name={icon} color={ink} /> : <T v="label" color={ink}>{words ?? label}</T>}
    </Press>
  );
}

/** Yes / No (§9): pills at least 84 × 56. Yes is the accent fill; No is surface with a strong edge. */
export function Choice({ label, emoji, onPress, filled }: { label: string; emoji?: string; onPress?: () => void; filled?: boolean }) {
  const t = useTheme();
  return (
    <Press onPress={onPress} accessibilityRole="button" accessibilityLabel={label}
      style={[s.pill, {
        minHeight: 56, minWidth: 84, paddingHorizontal: 20, backgroundColor: filled ? t.c.accent : t.card,
        borderWidth: filled ? 0 : 1, borderColor: t.c.borderStrong,
      }]}>
      {emoji ? <Ico e={emoji} size={Math.round(t.fs * 1.3)} /> : null}
      <T v="label" w={filled ? 600 : 500} color={filled ? t.c.onAccent : t.c.ink}>{label}</T>
    </Press>
  );
}

/** The 24 px check badge on picked tiles and look previews. */
export function Badge({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return (
    <View style={[s.badge, { backgroundColor: t.c.accentInk }, style]}>
      <Icon name="check" size={16} color={t.c.onAccent} />
    </View>
  );
}

/** A mood, nuance, topic or option tile (§3, §10): at least 88 px tall, a 2 em emoji and its word. Picked: the tint
 *  fill, a ring and the check badge, with no lift. `dashed` is the More tile. */
export function Tile({ e, label, on, onPress, disabled, width, dashed, icon, a11y }: {
  e?: string; label: string; on?: boolean; onPress: () => void; disabled?: boolean; width?: number; dashed?: boolean; icon?: IconName; a11y?: string;
}) {
  const t = useTheme();
  return (
    <Press onPress={onPress} disabled={disabled} accessibilityRole="button" accessibilityLabel={a11y ?? label}
      accessibilityState={on == null ? undefined : { selected: on }}
      style={[s.tile, dashed
        ? { borderWidth: 1.5, borderStyle: 'dashed', borderColor: t.c.borderStrong, backgroundColor: 'transparent' }
        : on
          ? { borderWidth: 1, borderColor: t.c.accentInk, backgroundColor: t.c.accentTint, outlineWidth: 2, outlineStyle: 'solid', outlineColor: t.c.accentInk, outlineOffset: 0 }
          : t.raised,
      { width: width ?? 120, minHeight: t.icons ? Math.round(88 * Math.min(t.k, 1.6)) : 64, justifyContent: t.icons ? 'flex-start' : 'center' }]}>
      {e ? <Ico e={e} size={Math.round(t.fs * 2)} /> : null}
      {icon && t.icons ? <View style={{ height: Math.round(t.fs * 2 * 1.22), justifyContent: 'center' }}><Icon name={icon} size={28} /></View> : null}
      <T v="label" style={{ textAlign: 'center' }}>{label}</T>
      {on ? <Badge /> : null}
    </Press>
  );
}

export const Row = ({ children, style, gap = 12, end }: { children: React.ReactNode; style?: StyleProp<ViewStyle>; gap?: number; end?: boolean }) => (
  <View style={[{ flexDirection: 'row', flexWrap: 'wrap', gap, alignItems: 'center' }, end && { justifyContent: 'flex-end' }, style]}>{children}</View>
);

/** A raised card (§5): 28 px corners, 16 px padding. */
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTheme();
  return <View style={[s.card, t.raised, style]}>{children}</View>;
}

const s = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 6, borderRadius: R.full },
  tile: { alignItems: 'center', gap: 4, paddingTop: 12, paddingBottom: 10, paddingHorizontal: 6, borderRadius: R.lg },
  card: { gap: 16, padding: 16, borderRadius: R.xl },
  badge: { position: 'absolute', top: 6, right: 6, width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
