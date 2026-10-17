// Colors, type, sizes and depth from docs/DESIGN.md (Lexi Miro board, Screens 11-15, Theme frame, Inspo Board).
import { createContext, useContext } from 'react';
import { Platform, type TextStyle, type ViewStyle } from 'react-native';
import type { BandKey, Settings, ThemeKey } from './content';
import { stripEmoji, tone } from './text';
import { SIZES, SPACING } from './content';

export type Palette = {
  bg: string;            // canvas behind everything
  bar: string;           // top bar, side rails and bottom dock ("none" themes use the background)
  onBar: string;
  surface: string;       // tiles, cards, the input pill, the active nav tile
  surface2: string;      // quieter fills (confirm boxes, empty day cards)
  field: string;         // text boxes inside cards
  ink: string; inkSoft: string; line: string;
  ring: string;          // selected tiles, chips and day cards
  yes: string; onYes: string;            // primary pills (the board's 👍🏽 pill)
  bot: string; botInk: string; botLine: string | null;
  me: string; meInk: string;
  bContent: string; bContentInk: string; bStressed: string; bStressedInk: string; bLow: string; bLowInk: string;
  sel: string; scrim: string; danger: string;
  shadowOpacity: number;
};

const BANDS_LIGHT = { bContent: '#E38100', bContentInk: '#1E1000', bStressed: '#79EAB9', bStressedInk: '#06281A', bLow: '#8100E3', bLowInk: '#FFFFFF' };
const BANDS_DARK = { bContent: '#E38100', bContentInk: '#1E1000', bStressed: '#79EAB9', bStressedInk: '#06281A', bLow: '#A866FF', bLowInk: '#1D0038' };
const LIGHT_BASE = {
  bg: '#E6E6E6', surface: '#FFFFFF', surface2: '#F1F1F1', field: '#F6F6F6',
  ink: '#020000', inkSoft: '#474747', line: '#CDCDCD',
  yes: '#8100E3', onYes: '#FFFFFF', botLine: null, me: '#FFFFFF', meInk: '#020000',
  sel: '#FFFFFF', scrim: 'rgba(0,0,0,0.45)', danger: '#C0352B', shadowOpacity: 0.08,
  ...BANDS_LIGHT,
};

export const PALETTES: Record<Exclude<ThemeKey, 'auto'>, Palette> = {
  // Screen 11
  orange: { ...LIGHT_BASE, bar: '#E38100', onBar: '#020000', ring: '#E38100', bot: '#79EAB9', botInk: '#020000' },
  // Screen 13
  purple: { ...LIGHT_BASE, bar: '#8100E3', onBar: '#FFFFFF', ring: '#8100E3', bot: '#79EAB9', botInk: '#020000' },
  // Theme frame. The ring is a deeper mint so a selected white tile still reads as selected.
  mint: { ...LIGHT_BASE, bar: '#79EAB9', onBar: '#06281A', ring: '#1F8F62', bot: '#FFDCC1', botInk: '#2E1500' },
  // Screen 12: black, bars blend into the background, outlined dark bubbles with orange words, mint Yes.
  night: {
    bg: '#020000', bar: '#020000', onBar: '#E38100', surface: '#1A1A1A', surface2: '#262626', field: '#0D0D0D',
    ink: '#F4F4F4', inkSoft: '#BDBDBD', line: '#3A3A3A', ring: '#E38100',
    yes: '#79EAB9', onYes: '#020000', bot: '#1A1A1A', botInk: '#E38100', botLine: '#FFFFFF', me: '#262626', meInk: '#F4F4F4',
    sel: '#262626', scrim: 'rgba(0,0,0,0.6)', danger: '#E5534B', shadowOpacity: 0.35, ...BANDS_DARK,
  },
  // Screen 15: the board's Material 3 dark theme seeded at #E38100, with the butterfly engraving.
  ember: {
    bg: '#201B17', bar: '#201B17', onBar: '#FFB877', surface: '#2B241F', surface2: '#3A302A', field: '#201B17',
    ink: '#ECE0DA', inkSoft: '#D6C3B6', line: '#51443A', ring: '#FFB877',
    yes: '#FFB877', onYes: '#4C2700', bot: '#FFB877', botInk: '#4C2700', botLine: null, me: '#51443A', meInk: '#FFDCC1',
    sel: '#3A302A', scrim: 'rgba(0,0,0,0.6)', danger: '#E5534B', shadowOpacity: 0.35, ...BANDS_DARK,
  },
};
export const OUTLINE_EMBER = '#9E8E82';
export const resolveTheme = (k: ThemeKey, systemDark: boolean): Exclude<ThemeKey, 'auto'> => (k === 'auto' ? (systemDark ? 'ember' : 'orange') : k);

/* ---------- fonts ----------
   Lexend and Atkinson Hyperlegible ship with the app (Google Fonts, OFL). Verdana is a Microsoft font that
   iOS includes and Android does not, so on Android "Verdana" falls back to Atkinson Hyperlegible, the next
   font in lexi.html's stack. Custom fonts pick the bold face by family name, not fontWeight. */
const FACE = {
  lexend: ['Lexend_400Regular', 'Lexend_600SemiBold'],
  atkinson: ['AtkinsonHyperlegible_400Regular', 'AtkinsonHyperlegible_700Bold'],
};
export const verdanaIsNative = Platform.OS === 'ios';
function face(font: Settings['font'], bold: boolean): TextStyle {
  if (font === 'verdana' && verdanaIsNative) return { fontFamily: 'Verdana', fontWeight: bold ? '700' : '400' };
  const f = font === 'lexend' ? FACE.lexend : FACE.atkinson;
  return { fontFamily: f[bold ? 1 : 0] };
}

/** `color-mix(in srgb, a pct%, b)` from the CSS. */
export function mix(a: string, b: string, pct: number): string {
  const p = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v * pct + B[i] * (1 - pct)).toString(16).padStart(2, '0')).join('');
}

/** Radii 14 / 22 / 28 (DESIGN.md "Polish rules"). Tiles use 20. */
export const R = { s: 14, tile: 20, m: 22, l: 28, pill: 999 } as const;

export type Theme = ReturnType<typeof makeTheme>;

export function makeTheme(S: Settings, systemDark: boolean, windowWidth: number) {
  const key = resolveTheme(S.theme, systemDark);
  const c = PALETTES[key];
  const dark = key === 'night' || key === 'ember';
  const fs = (SIZES[S.size] || SIZES.m)[1];
  const lh = (SPACING[S.spacing] || SPACING.wide)[1];
  const icons = S.icons;
  // 14 px rails (10 px under 380 px), 10 px of breathing room inside them.
  const rail = windowWidth < 380 ? 10 : 14;
  const pad = 10;
  const contentW = windowWidth - rail * 2 - pad * 2;
  const shadow: ViewStyle = { shadowColor: '#000000', shadowOpacity: c.shadowOpacity, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: dark ? 3 : 2 };
  const t = {
    c, key, dark, fs, lh, icons, rail, pad, contentW,
    narrow: windowWidth < 380,
    /** Bot bubbles are a fixed column, about 64 % of the content width (board: 222 of 347 px). */
    bubbleW: Math.round(Math.min(contentW * 0.64, fs * 26)),
    avatarBot: 46, avatarMe: 52,
    /** Ember draws the butterfly engraving behind the chat. */
    butterfly: key === 'ember',
    barsBlend: c.bar === c.bg,
    shadow,
    /** Text style at `em` times the base size, in the body font (or Lexend for headings). */
    text(em = 1, o: { bold?: boolean; display?: boolean; color?: string } = {}): TextStyle {
      const size = Math.round(fs * em * 10) / 10;
      return {
        ...(o.display ? { fontFamily: FACE.lexend[o.bold ? 1 : 0] } : face(S.font, !!o.bold)),
        fontSize: size, lineHeight: Math.round(size * lh), letterSpacing: size * 0.012,
        color: o.color ?? c.ink,
      };
    },
    /** Emoji at a fixed pixel size (they don't shrink with the text size: emoji are how Lexi talks). */
    emoji(px: number): TextStyle { return { fontSize: px, lineHeight: Math.round(px * 1.22), color: c.ink, textAlign: 'center' }; },
    fontPreview(font: Settings['font']): TextStyle { return face(font, false); },
    /** Apply the skin tone, and hide emoji when icons are off (lexi.html's `.ico` spans). */
    rich(s: string): string { const toned = tone(s, S.tone); return icons ? toned : stripEmoji(toned); },
    toned(s: string): string { return tone(s, S.tone); },
    band(k: BandKey | string | undefined): { b: string; ink: string } {
      if (k === 'content') return { b: c.bContent, ink: c.bContentInk };
      if (k === 'stressed') return { b: c.bStressed, ink: c.bStressedInk };
      if (k === 'low') return { b: c.bLow, ink: c.bLowInk };
      return { b: c.line, ink: c.ink };
    },
  };
  return t;
}

export const ThemeContext = createContext<Theme | null>(null);
export function useTheme(): Theme {
  const t = useContext(ThemeContext);
  if (!t) throw new Error('ThemeContext missing');
  return t;
}
