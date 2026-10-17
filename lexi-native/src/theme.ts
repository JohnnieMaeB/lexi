// Colors, type and spacing. Palettes are the CSS tokens from lexi.html (Material theme seeded at #E38100,
// purple #8100E3 and mint #79EAB9 from the board's Theme frame).
import { createContext, useContext } from 'react';
import { Platform, type TextStyle } from 'react-native';
import { FONTS, SIZES, SPACING, type BandKey, type Settings } from './content';
import { stripEmoji, tone } from './text';

export type Palette = {
  bg: string; surface: string; surface2: string; ink: string; inkSoft: string; line: string;
  accent: string; onAccent: string; accent2: string; onAccent2: string;
  bot: string; botInk: string; me: string; meInk: string;
  bContent: string; bContentInk: string; bStressed: string; bStressedInk: string; bLow: string; bLowInk: string;
  sel: string; scrim: string; shadow: string; danger: string;
};

const LIGHT: Palette = {
  bg: '#FAEFE8', surface: '#FFF8F5', surface2: '#F2DFD1', ink: '#201B17', inkSoft: '#51443A', line: '#D6C3B6',
  accent: '#E38100', onAccent: '#1E1000', accent2: '#8100E3', onAccent2: '#FFFFFF',
  bot: '#79EAB9', botInk: '#06281A', me: '#FFDCC1', meInk: '#2E1500',
  bContent: '#E38100', bContentInk: '#1E1000', bStressed: '#79EAB9', bStressedInk: '#06281A', bLow: '#8100E3', bLowInk: '#FFFFFF',
  sel: '#EBD9F7', scrim: 'rgba(32,27,23,0.5)', shadow: 'rgba(32,27,23,0.22)', danger: '#C0352B',
};
const DARK: Palette = {
  bg: '#201B17', surface: '#2B241F', surface2: '#3A302A', ink: '#ECE0DA', inkSoft: '#D6C3B6', line: '#51443A',
  accent: '#E38100', onAccent: '#1E1000', accent2: '#C99BFF', onAccent2: '#24004A',
  bot: '#FFB877', botInk: '#4C2700', me: '#5A422D', meInk: '#FFDCC1',
  bContent: '#F29A2E', bContentInk: '#1E1000', bStressed: '#79EAB9', bStressedInk: '#06281A', bLow: '#A866FF', bLowInk: '#1D0038',
  sel: '#3E2F55', scrim: 'rgba(0,0,0,0.6)', shadow: 'rgba(0,0,0,0.5)', danger: '#C0352B',
};

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

export type Theme = ReturnType<typeof makeTheme>;

export function makeTheme(S: Settings, systemDark: boolean, windowWidth: number) {
  const dark = S.mode === 'dark' || (S.mode === 'auto' && systemDark);
  const c: Palette = { ...(dark ? DARK : LIGHT) };
  if (S.accent === 'purple') { c.accent = '#8100E3'; c.onAccent = '#FFFFFF'; }
  if (S.accent === 'mint') { c.accent = '#79EAB9'; c.onAccent = '#06281A'; c.bot = '#FFDCC1'; c.botInk = '#2E1500'; }
  const fs = (SIZES[S.size] || SIZES.m)[1];
  const lh = (SPACING[S.spacing] || SPACING.wide)[1];
  const icons = S.icons;
  const t = {
    c, dark, fs, lh, icons, accent: S.accent,
    narrow: windowWidth <= 420,
    /** Text style at `em` times the base size, in the body font (or Lexend for headings). */
    text(em = 1, o: { bold?: boolean; display?: boolean; color?: string } = {}): TextStyle {
      const size = Math.round(fs * em * 10) / 10;
      return {
        ...(o.display ? { fontFamily: FACE.lexend[o.bold ? 1 : 0] } : face(S.font, !!o.bold)),
        fontSize: size, lineHeight: Math.round(size * lh), letterSpacing: size * 0.012,
        color: o.color ?? c.ink,
      };
    },
    /** Same text with emoji at a fixed line height (tiles, avatars). */
    emoji(px: number): TextStyle { return { fontSize: px, lineHeight: Math.round(px * 1.25), color: c.ink }; },
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

export const fontLabel = (k: Settings['font']) => FONTS[k];
export const ThemeContext = createContext<Theme | null>(null);
export function useTheme(): Theme {
  const t = useContext(ThemeContext);
  if (!t) throw new Error('ThemeContext missing');
  return t;
}
