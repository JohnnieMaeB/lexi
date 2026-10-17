# Lexi design spec

This spec comes from the Lexi Miro board. Measurements are taken from the board's 375 × 812 phone frames (Screens 11, 12, 13 and 15), the Chat Bot Plan flow, the Theme frame and the Inspo Board. The web app (`web/lexi.html`) and the native app (`lexi-native/`) both follow it.

## Layout (Screens 11 and 13)

| Part | Wireframe | Build rule |
|---|---|---|
| Canvas | 375 × 812, background `#E6E6E6` | Light themes use `#E6E6E6`, not white or cream. |
| Top bar | Accent color, 48 px tall | Accent bar, 48 px plus the safe area. Small "🤖 Lexi" on the left. |
| Side rails | Accent color, 14 px wide, running between the two bars | 14 px on both sides (10 px on phones narrower than 380 px). |
| Bottom bar | Accent color, 91 px tall, holding a white input pill (312 × 48) with 🙂 and 🎙 inside its right end | Accent dock. The white pill holds the text field, then 🙂, then ➤ / 🎙 inside the pill. There is no separate send button outside the pill. |
| Bot bubbles | Mint `#79EAB9`, a fixed 222 px wide (59 %), left edge at x = 46, about 24 px apart, Arial 18 px `#020000` | Fixed-width column of about 64 % of the content width, not shrink-to-fit. 18 px text, 24 px gap, radius 22. |
| Bot avatar | 🤖 at 49 px, bottom-left of the conversation | 🤖 at 44–48 px, shown once per group of bubbles, on the **last** bubble. |
| User avatar | 👧🏽 at 56 px, bottom-right | User avatar at 48–56 px, on the last item of each group. |
| Yes / No | Inside the question bubble, bottom-left: 👍🏽 on a filled purple pill, 👎🏽 on a white pill with a purple outline | Two big pills (at least 76 × 52, emoji at least 30 px) inside the question bubble. |
| User's emoji answer | One huge 👍🏽 (95 px), no bubble | Emoji answers show as huge emoji with no bubble (88 px for one, smaller for several), with a small word caption under them. Typed text still uses a bubble. |

## Themes

| Theme | Source | Background | Bars and rails | Bot bubble / text | Yes pill | Decoration |
|---|---|---|---|---|---|---|
| **Orange** (default by day) | Screen 11 | `#E6E6E6` | `#E38100` | `#79EAB9` / `#020000` | `#8100E3` | none |
| **Purple** | Screen 13 | `#E6E6E6` | `#8100E3` | `#79EAB9` / `#020000` | `#8100E3` | none |
| **Mint** | Theme frame | `#E6E6E6` | `#79EAB9` | `#FFDCC1` / `#2E1500` | `#8100E3` | none |
| **Night** | Screen 12 | `#020000` | none: the bars are the background color | `#1A1A1A` / `#E38100` | `#79EAB9` | none |
| **Ember** (default at night) | Screen 15 | `#201B17` | none | `#FFB877` / `#4C2700` | `#FFB877` | Butterfly engraving centered behind the chat, tinted `#FFB877` at about 18 % opacity |

- "Match my device" means Orange in light mode and Ember in dark mode.
- The Ember palette is the board's Material 3 theme seeded at `#E38100`. Dark: primary `#FFB877`, on-primary `#4C2700`, surface `#201B17`, on-surface `#ECE0DA`, surface-variant `#51443A`, outline `#9E8E82`.
- Mood band colors are Content `#E38100`, Stressed `#79EAB9` and Low self-esteem `#8100E3` (`#A866FF` on dark themes).

## Size scale

The Chat Bot Plan flow draws its icons huge: ⚙️ 🏡 📖 at 137 px on white 203 × 101 tiles, 👍🏽 👎🏽 at 109 px, and 👏🏽 × 4 at 97 px. Emoji are the main way Lexi talks, so they're never small.

| Element | Size |
|---|---|
| Nav icons (⚙️ 🏡 📖) | 34–36 px emoji with a 13 px label. The active tab sits on a white (or surface) rounded tile. |
| Mood and topic tiles | 44 px emoji in a rounded square (radius 20, at least 80 px tall), with the label under it. Selected: raised surface plus a 3 px accent ring and a ✔ badge. |
| Celebrations | 👏🏽👏🏽👏🏽👏🏽 or 🎉🎉🎉 at 64–96 px across the width, with a short bounce. |
| Body text | 18 px Verdana (the board comment prefers Verdana). Line height 1.7 by default. |
| Headings | Lexend 600. |

## Polish rules (from the Inspo Board)

The inspo shows soft rounded cards on black with a glowing orange or purple accent, emoji tiles in rounded squares, day cards with one emoji per day, and big friendly type.

- **Radii:** 14 / 22 / 28. Bubbles 22, with a 6 px corner pointing at the avatar.
- **Depth:** one soft shadow (`0 6px 18px rgba(0,0,0,.08)` light, `.35` dark) on bubbles, tiles and cards. Nothing flat-grey and nothing heavy.
- **Motion:**
  - Bubbles pop in (scale .96 to 1 and fade, 220 ms).
  - The typing indicator is circles moving up and down (the board's "Move a Circle up/down" code).
  - Celebration emoji bounce.
  - Everything is off under reduced motion.
- **Journal:**
  - A stats row: check-ins, days in a row, words written.
  - Horizontally scrolling day cards for the last 14 days. Each shows the weekday, the date, the day's main mood emoji, and a bar split by band.
  - Entry cards use big emoji.

## Voice (read aloud)

- **Default to the most natural voice the device has.** Rank voices whose names contain Natural, Neural, Premium, Enhanced, Siri or Google above others. Prefer English in the user's locale. Push compact or eSpeak voices to the bottom.
- **Settings → 🔊 Voice:**
  - a list of the best voices, each with a ▶ preview
  - "Show all voices"
  - speed (0.6–1.4) and pitch (0.8–1.2) sliders
  - a "Test Lexi's voice" button
  - a tip on installing better voices: Edge's Natural voices on Windows; Enhanced or Premium voices on iPhone (Settings › Accessibility › Spoken Content › Voices); Google speech voices on Android
- **Speaking:**
  - Strip emoji first.
  - Speak sentence by sentence, which avoids long-utterance cutoffs and sounds more natural.
  - Pause briefly between bubbles.
