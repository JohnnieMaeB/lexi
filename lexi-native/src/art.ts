// The drawn art: white PNGs made by tools/make-icons.mjs from the SVG paths in DESIGN_WARM_PAPER §1, §7 and §8.
// Each one is tinted with the look's colours where it's used.
export const ICONS = {
  help: require('../assets/icons/help.png'),
  close: require('../assets/icons/close.png'),
  send: require('../assets/icons/send.png'),
  stop: require('../assets/icons/stop.png'),
  mic: require('../assets/icons/mic.png'),
  emoji: require('../assets/icons/emoji.png'),
  speaker: require('../assets/icons/speaker.png'),
  back: require('../assets/icons/back.png'),
  next: require('../assets/icons/next.png'),
  delete: require('../assets/icons/delete.png'),
  add: require('../assets/icons/add.png'),
  check: require('../assets/icons/check.png'),
  chevron: require('../assets/icons/chevron.png'),
  play: require('../assets/icons/play.png'),
  settings: require('../assets/icons/settings.png'),
  home: require('../assets/icons/home.png'),
  journal: require('../assets/icons/journal.png'),
} as const;
export type IconName = keyof typeof ICONS;

/** Mood-band shapes: round (Content), spiky (Stressed), low dome (Low self-esteem). */
export const SHAPES = {
  round: require('../assets/shapes/round.png'),
  spiky: require('../assets/shapes/spiky.png'),
  low: require('../assets/shapes/low.png'),
} as const;

/** The butterfly, one layer per colour so the wings can fold while Lexi thinks. */
export const BUTTERFLY = {
  upper: require('../assets/butterfly/upper.png'),
  lower: require('../assets/butterfly/lower.png'),
  body: require('../assets/butterfly/body.png'),
} as const;
