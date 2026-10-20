// Warm paper colour tokens (docs/DESIGN_WARM_PAPER.md §1). Plain data with no React Native imports, so the
// logic tests can check every text pair for contrast. theme.ts turns these into styles.
import type { BandKey, ThemeKey } from './content';

export type LookKey = Exclude<ThemeKey, 'auto'>;
export type Palette = {
  canvas: string;        // behind everything, and the top bar
  surface: string;       // cards, tiles, secondary buttons, the dock on light looks
  sunken: string;        // inputs, the composer, segmented tracks
  raised: string;        // dark looks: tiles, cards and the dock (light looks use surface)
  lexi: string;          // Lexi's turn
  me: string;            // the user's typed turn
  meEdge: boolean;       // Cream and Peach give the user's turn a hairline edge
  ink: string; inkMuted: string;
  accent: string; onAccent: string;   // the one primary fill
  accentInk: string;     // rings, the active tab, links
  accentTint: string;    // selected fills, the tab marker
  borderStrong: string;  // inputs, chips, secondary buttons
  hairline: string;      // card edges
  highlight: string;     // "Best for my colors" word highlight
  dark: boolean;
};

const YELLOW = '#FFE36E', MINT = '#79EAB9';
export const LOOKS: Record<LookKey, Palette> = {
  cream: {
    canvas: '#F6EEE2', surface: '#FFFBF5', sunken: '#EFE5D6', raised: '#FFFBF5', lexi: '#FBE2C4', me: '#FFFBF5', meEdge: true,
    ink: '#17130F', inkMuted: '#4E443B', accent: '#9C4A0B', onAccent: '#FFFBF5', accentInk: '#9C4A0B', accentTint: '#F3E6D9',
    borderStrong: '#8C7F70', hairline: '#E3D6C4', highlight: MINT, dark: false,
  },
  // "Peach" in the app; the stored key stays `orange` so saved settings keep working.
  orange: {
    canvas: '#F9E3CC', surface: '#FFF9F2', sunken: '#F3DDC6', raised: '#FFF9F2', lexi: '#FFF9F2', me: '#FFF9F2', meEdge: true,
    ink: '#2A1C12', inkMuted: '#5E4335', accent: '#A3480A', onAccent: '#FFF9F2', accentInk: '#93410A', accentTint: '#F4E4D6',
    borderStrong: '#957360', hairline: '#EBCDB0', highlight: YELLOW, dark: false,
  },
  purple: {
    canvas: '#F5F0F8', surface: '#FFFCFF', sunken: '#ECE6F1', raised: '#FFFCFF', lexi: '#FFFCF8', me: '#ECE2F8', meEdge: false,
    ink: '#221A2E', inkMuted: '#574A6B', accent: '#6E3BC4', onAccent: '#FFFFFF', accentInk: '#6630BB', accentTint: '#EEE5F8',
    borderStrong: '#857A97', hairline: '#E3DAEC', highlight: YELLOW, dark: false,
  },
  mint: {
    canvas: '#EEF5EC', surface: '#FBFDF8', sunken: '#E4EDE2', raised: '#FBFDF8', lexi: '#FCFCF6', me: '#D8EEE0', meEdge: false,
    ink: '#13261D', inkMuted: '#3A5346', accent: '#1F7A57', onAccent: '#FFFFFF', accentInk: '#1A6A4C', accentTint: '#E1EDE5',
    borderStrong: '#6F877A', hairline: '#D5E4D7', highlight: YELLOW, dark: false,
  },
  night: {
    canvas: '#17181D', surface: '#1F2027', sunken: '#121317', raised: '#272932', lexi: '#2A2B33', me: '#3A3326', meEdge: false,
    ink: '#ECE7DF', inkMuted: '#DDD7CE', accent: '#F2A65A', onAccent: '#1E1408', accentInk: '#F6B97A', accentTint: '#38302D',
    borderStrong: '#7C7A82', hairline: '#2E3038', highlight: YELLOW, dark: true,
  },
  ember: {
    canvas: '#201B17', surface: '#2B2520', sunken: '#1A1612', raised: '#352F2B', lexi: '#3A2F27', me: '#4A3A2C', meEdge: false,
    ink: '#F0E5DE', inkMuted: '#E2D2C6', accent: '#FFB877', onAccent: '#4C2700', accentInk: '#FFB877', accentTint: '#443729',
    borderStrong: '#9E8E82', hairline: '#44392F', highlight: YELLOW, dark: true,
  },
};
/** The Look picker's order (§10). */
export const LOOK_ORDER: ThemeKey[] = ['auto', 'cream', 'orange', 'purple', 'mint', 'night', 'ember'];

/** A highlighted word is always this ink, on any highlight colour. */
export const HIGHLIGHT_INK = '#17130F';
/** Danger is the same in every look, and always comes with an icon and a word. */
export const DANGER = '#B42F1F', ON_DANGER = '#FFFBF5';

export type BandTone = { soft: string; ink: string; solid: string };
/** `soft` is a background, `ink` the text on it, `solid` only for shapes and bars. */
export const BAND_TONES: Record<'light' | 'dark', Record<BandKey, BandTone>> = {
  light: {
    content: { soft: '#FAE1C0', ink: '#6E3A08', solid: '#C26A06' },
    stressed: { soft: '#D2EEE2', ink: '#1B5A45', solid: '#2A8A69' },
    low: { soft: '#E6DDF4', ink: '#4B2C80', solid: '#7A4FC4' },
  },
  dark: {
    content: { soft: '#4A3418', ink: '#F7D3A6', solid: '#E8963A' },
    stressed: { soft: '#1E3F35', ink: '#BDEBD8', solid: '#4FC49A' },
    low: { soft: '#352A4D', ink: '#DCCCF7', solid: '#A98BEA' },
  },
};
/** Each band's shape (assets/shapes): never colour alone. */
export const BAND_SHAPE: Record<BandKey, 'round' | 'spiky' | 'low'> = { content: 'round', stressed: 'spiky', low: 'low' };

/** The butterfly's wings; its body and antennae use the look's ink. */
export const BRAND = { light: { upper: '#E38100', lower: '#F2B36B' }, dark: { upper: '#F29A2E', lower: '#FFC98F' } };
/** The inner Listening ring (the outer one is the look's `lexi`). */
export const LISTEN_RING = '#F2B36B';

/** Match my device: Cream by day, Ember at night. */
export const resolveLook = (k: ThemeKey, systemDark: boolean): LookKey => (k === 'auto' ? (systemDark ? 'ember' : 'cream') : k);

/** Higher contrast (iOS Increase Contrast, Android high-contrast text): muted ink becomes ink, hairlines get strong. */
export function withContrast(p: Palette, more: boolean): Palette {
  return more ? { ...p, inkMuted: p.ink, hairline: p.borderStrong } : p;
}

/** `rgb(a / pct)` for shadows and scrims, from a #RRGGBB colour. */
export function alpha(hex: string, pct: number): string {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
  return 'rgba(' + r + ',' + g + ',' + b + ',' + pct + ')';
}

/** WCAG 2 contrast ratio between two #RRGGBB colours. */
export function contrast(a: string, b: string): number {
  const lum = (hex: string) => {
    const [r, g, bl] = [1, 3, 5].map(i => {
      const c = parseInt(hex.slice(i, i + 2), 16) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
