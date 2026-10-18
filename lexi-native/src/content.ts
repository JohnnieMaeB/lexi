// Content from the Lexi Miro board, carried over unchanged from lexi.html.
import type { Country } from './safety';

export type BandKey = 'content' | 'stressed' | 'low';
export type Pick = { e: string; label: string; band?: BandKey };
export type Band = { key: BandKey; name: string; items: [string, string][] };
export type Topic = { key: string; icon: string; name: string; q: string; opts?: [string, string][]; todo?: boolean };

// Mood descriptors: the App Plan "Guided Categories" table. No "Happy" on purpose: Content is the goal.
export const BANDS: Band[] = [
  { key: 'content', name: 'Content', items: [['🙌🏽','Proud'],['🥰','Loved'],['🤗','Cared for'],['🙏🏽','Thankful'],['😂','Amused'],['😇','At peace'],['🧘🏽‍♀️','Calm'],['👏🏽','Did it'],['🎓','Learning'],['🔮','Hopeful'],['👩🏽‍🔬','Curious'],['👩🏽‍🎨','Creative'],['🎨','Inspired'],['👩🏽‍💻','Focused'],['⚒️','Productive'],['👷🏽‍♀️','Building'],['👩🏽‍🔧','Fixing things']] },
  { key: 'stressed', name: 'Stressed', items: [['🧗🏽‍♀️','Uphill'],['🕵🏽‍♀️','Searching'],['😖','Tense'],['😭','Overwhelmed'],['🤦🏽‍♀️','Frustrated'],['🤦🏽‍♂️','Fed up'],['💪🏽','Pushing through'],['🥊','Fighting it'],['👩🏽‍⚖️','Judged']] },
  { key: 'low', name: 'Low self-esteem', items: [['🥺','Fragile'],['😔','Down'],['😓','Drained'],['🤯','Overloaded'],['😤','Annoyed'],['🤬','Angry'],['🤥','Like a fraud'],['🙃','Upside down'],['💩','Rubbish']] },
];
export const BAND_BY = Object.fromEntries(BANDS.map(b => [b.key, b])) as Record<BandKey, Band>;

export const TOPICS: Topic[] = [
  { key: 'body', icon: '🫀', name: 'Physical health', q: 'How is your body today?', opts: [['💪🏽','Strong'],['😴','Tired'],['🤕','Sore'],['🤒','Unwell'],['🏃🏽‍♀️','Moved'],['🛋️','Rested']] },
  { key: 'diet', icon: '🥗', name: 'Diet', q: 'How did you eat and drink?', opts: [['🥗','Fresh food'],['🍔','Quick food'],['💧','Drank water'],['☕','Lots of coffee'],['🍽️','Skipped a meal'],['🍫','Treats']] },
  { key: 'esteem', icon: '🪞', name: 'Self-esteem', q: 'How do you see yourself today?', opts: [['🌱','Growing'],['🧱','Solid'],['🦁','Brave'],['🌫️','Unsure'],['🥺','Fragile'],['🤥','Like a fraud']] },
  { key: 'people', icon: '🫂', name: 'Relationships', q: 'How are things with people?', opts: [['🫂','Close'],['💬','Talking'],['🏝️','Alone time'],['🌵','Distant'],['⚡','Tension'],['💔','Hurt']] },
  { key: 'money', icon: '💰', name: 'Financial health', q: 'How do you feel about money?', opts: [['🧘🏽','Steady'],['📊','Planning'],['😬','Tight'],['🆘','Worried'],['🤷🏽','Not thinking about it']] },
  { key: 'stress', icon: '🌋', name: 'Stress(ors)', q: 'What is weighing on you?', opts: [['💼','Work'],['📚','School'],['📝','Reading and writing'],['🏠','Home'],['🫂','People'],['💰','Money'],['🩺','Health'],['⏰','Time']] },
  { key: 'todo', icon: '✅', name: 'To dos', q: 'What do you need to do?', todo: true },
  { key: 'joy', icon: '🎨', name: 'Hobbies and passions', q: 'What did you enjoy?', opts: [['🎨','Art'],['🎮','Games'],['🎵','Music'],['⚽','Sport'],['🌿','Outdoors'],['🍳','Cooking'],['📺','Shows'],['📚','Stories']] },
  { key: 'thanks', icon: '🙏🏽', name: 'Gratitude', q: 'One thing you are thankful for?', opts: [['🫂','A person'],['🏠','A place'],['🐾','A pet'],['🍲','Food'],['🌤️','A moment'],['🧠','Myself']] },
];
export const TOPIC_BY = Object.fromEntries(TOPICS.map(t => [t.key, t])) as Record<string, Topic>;

export const EMOJI_SETS: [string, string, string][] = [
  ['😀', 'Feelings', '😀 😃 😄 😁 😆 😅 😂 🤣 🥲 😊 😇 🙂 🙃 😉 😌 😍 🥰 😘 😋 😛 😜 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😔 😟 😕 🙁 😣 😖 😫 😩 🥺 😢 😭 😤 😠 😡 🤬 🤯 😳 🥵 🥶 😱 😨 😰 😥 😓 🫣 🤗 🫡 🤔 🫢 🤭 🤫 🤥 😶 😐 😑 😬 🫠 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵‍💫 🤐 🥴 🤢 🤮 🤧 😷 🤒 🤕'],
  ['✋🏽', 'People', '👋🏽 ✋🏽 👌🏽 ✌🏽 🤞🏽 🫰🏽 🤟🏽 🤙🏽 👈🏽 👉🏽 👆🏽 👇🏽 👍🏽 👎🏽 ✊🏽 👊🏽 👏🏽 🙌🏽 🫶🏽 👐🏽 🤲🏽 🤝 🙏🏽 ✍🏽 💪🏽 🧠 🫀 👀 👧🏽 👦🏽 🧒🏽 👩🏽 🧑🏽 👨🏽 👵🏽 🧓🏽 👴🏽 🙋🏽‍♀️ 🙆🏽‍♀️ 🙅🏽‍♀️ 💁🏽‍♀️ 🤷🏽‍♀️ 🤷🏽‍♂️ 🤦🏽‍♀️ 🤦🏽‍♂️ 🧘🏽‍♀️ 🧗🏽‍♀️ 🏃🏽‍♀️ 🚶🏽‍♀️ 💃🏽 🕺🏽 👩🏽‍🎨 👩🏽‍💻 👩🏽‍🔬 👩🏽‍🔧 👷🏽‍♀️ 👩🏽‍🎓 👩🏽‍🍳 👩🏽‍⚖️ 🕵🏽‍♀️ 🫂 👪'],
  ['⚽', 'Activities', '⚽ 🏀 🏈 ⚾ 🎾 🏐 🏓 🏸 🥊 🥋 ⛳ 🛹 ⛸️ 🎿 🏋🏽‍♀️ 🤸🏽‍♀️ 🚴🏽‍♀️ 🏊🏽‍♀️ 🎮 🕹️ 🎲 🧩 ♟️ 🎯 🎳 🎨 🖌️ 🎭 🎤 🎧 🎼 🎹 🥁 🎸 🎻 📚 📖 ✏️ 📝 📸 🎬 📺 🧶 🧵 🪴'],
  ['🌿', 'Nature', '🐶 🐱 🐭 🐹 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐔 🐧 🐦 🦄 🐝 🦋 🐢 🐬 🐳 🐾 🌱 🌿 ☘️ 🍀 🌵 🌴 🌳 🍁 🍂 🌷 🌹 🌻 🌼 🌸 💐 🍄 🌍 🌙 ⭐ 🌟 ✨ ⚡ 🔥 🌈 ☀️ 🌤️ ⛅ 🌧️ ⛈️ ❄️ ☃️ 🌊 💧 🌫️'],
  ['🍎', 'Food', '🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🫐 🍒 🍑 🥭 🍍 🥥 🥝 🍅 🥑 🥦 🥕 🌽 🥔 🍞 🥐 🧀 🥚 🍳 🥞 🍗 🍔 🍟 🍕 🌭 🥪 🌮 🥗 🍝 🍜 🍲 🍣 🍱 🍚 🍪 🍩 🍰 🎂 🍫 🍬 🍿 ☕ 🍵 🧃 🥤 🧋 🍽️'],
  ['💡', 'Things', '📱 💻 ⌨️ 🖥️ 📷 💡 🕯️ 📓 📒 📅 ⏰ ⌛ 🎁 🎈 🎉 🎊 🏠 🏡 🏫 🏢 🏥 🚗 🚌 🚲 ✈️ 🧳 💰 💳 🪙 💊 🩺 🛏️ 🛋️ 🚿 🧸 🔑 🧭 🗺️ ⚙️ 🧰 🔧 🔨 ⚒️ 🏷️'],
  ['❤️', 'Symbols', '❤️ 🧡 💛 💚 💙 💜 🖤 🤍 🤎 💔 ❣️ 💕 💞 💗 💖 ✅ ✔️ ❌ ✖️ ❓ ❗ ⚠️ ℹ️ 💤 💭 💬 🔆 🆘 🚫 ⭕ 🔴 🟠 🟡 🟢 🔵 🟣 ⚫ ⚪ ➕ ➖ 💯 🔁 ▶️ ⏸️'],
];

export type Option<T> = { v: T; e: string; label: string };
export const YES_NO: Option<boolean>[] = [{ v: true, e: '👍🏽', label: 'Yes' }, { v: false, e: '👎🏽', label: 'No' }];

/* ---------- settings ---------- */
export type FontKey = 'verdana' | 'lexend' | 'atkinson';
export type SizeKey = 's' | 'm' | 'l' | 'xl' | 'xxl';
export type SpacingKey = 'normal' | 'wide' | 'xwide';
/** Letter spacing (FEATURES_DO_NEXT §1). Word spacing grows with it, because letter spacing alone slows reading. */
export type LettersKey = 'normal' | 'roomy' | 'xroomy';
/** docs/DESIGN.md "Themes". `auto` = Orange in light mode, Ember in dark mode. */
export type ThemeKey = 'auto' | 'orange' | 'purple' | 'mint' | 'night' | 'ember';
export type Settings = {
  icons: boolean; font: FontKey; size: SizeKey; spacing: SpacingKey; letters: LettersKey; theme: ThemeKey;
  tone: string; avatar: string; autoread: boolean;
  /** Crisis lines to show (FEATURES_DO_NEXT §7). Defaults from the phone's region. */
  country: Country;
  /** Journal: also show "Days in a row (rest days OK)" and "Words written" (off by default, §11). */
  showStreak: boolean;
  /** 'natural' plays Lexi's recorded clips for her fixed lines; 'device' reads everything with a phone voice. */
  lexiVoice: 'natural' | 'device';
  /** Read-aloud voice identifier from expo-speech; '' = the best voice on this phone. */
  voice: string; rate: number; pitch: number;
};
export const DEFAULTS: Settings = {
  icons: true, font: 'verdana', size: 'm', spacing: 'wide', letters: 'normal', theme: 'auto', tone: '\u{1F3FD}', avatar: '👧🏽', autoread: false,
  country: 'Other', showStreak: false,
  lexiVoice: 'natural', voice: '', rate: 0.95, pitch: 1,
};
export const FONTS: Record<FontKey, string> = { verdana: 'Verdana', lexend: 'Lexend', atkinson: 'Atkinson Hyperlegible' };
// The phone's own text size multiplies these (Text keeps allowFontScaling on everywhere).
export const SIZES: Record<SizeKey, [string, number]> = { s: ['Small', 16], m: ['Medium', 18], l: ['Large', 20], xl: ['Extra large', 24], xxl: ['Huge', 28] };
export const SPACING: Record<SpacingKey, [string, number]> = { normal: ['Normal', 1.5], wide: ['Wide', 1.7], xwide: ['Extra wide', 2] };
/** [label, letter spacing em, extra word spacing em] */
export const LETTERS: Record<LettersKey, [string, number, number]> = { normal: ['Normal', 0.012, 0.08], roomy: ['Roomy', 0.06, 0.16], xroomy: ['Extra roomy', 0.12, 0.32] };
export const THEME_NAMES: Record<ThemeKey, string> = { auto: 'Match my device', orange: 'Orange', purple: 'Purple', mint: 'Mint', night: 'Night', ember: 'Ember' };
export const RATE_RANGE = [0.6, 1.4] as const;
export const PITCH_RANGE = [0.8, 1.2] as const;
export const TONES: [string, string][] = [['', 'Yellow'], ['\u{1F3FB}', 'Light'], ['\u{1F3FC}', 'Medium light'], ['\u{1F3FD}', 'Medium'], ['\u{1F3FE}', 'Medium dark'], ['\u{1F3FF}', 'Dark']];
export const AVATARS = ['👧🏽', '🧒🏽', '👦🏽', '👩🏽', '🧑🏽', '👨🏽', '🦊', '🐱', '🌻', '⭐'];
