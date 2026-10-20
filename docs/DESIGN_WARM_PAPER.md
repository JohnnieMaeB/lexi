# Warm paper: the shared UI spec

Direction A from the design canvas ("Lexi UI directions"), built into both apps. The evidence behind every rule is in [`reports/Polished dyslexia friendly UI for Lexi.md`](../reports/Polished%20dyslexia%20friendly%20UI%20for%20Lexi.md). This spec replaces the frame, theme and size rules in [`DESIGN.md`](DESIGN.md). Behaviour in `FEATURES_DO_NEXT.md` and `FEATURES_SOON.md` stays the same, except where this spec says otherwise.

The one-line summary: keep the big type, lose the bright frame. Colour belongs in three places: the emoji, Lexi's warm turn, and one primary button.

## 1. Looks and colour tokens

Every look defines the same roles. Light looks use the shadows in §5. Dark looks use surface tone instead of shadows.

| Role | Cream | Peach (stored key `orange`) | Purple | Mint | Night | Ember |
|---|---|---|---|---|---|---|
| `canvas` | #F6EEE2 | #F9E3CC | #F5F0F8 | #EEF5EC | #17181D | #201B17 |
| `surface` | #FFFBF5 | #FFF9F2 | #FFFCFF | #FBFDF8 | #1F2027 | #2B2520 |
| `sunken` (inputs, tracks) | #EFE5D6 | #F3DDC6 | #ECE6F1 | #E4EDE2 | #121317 | #1A1612 |
| `raised` (dark only; tiles, dock) | = surface | = surface | = surface | = surface | #272932 | #352F2B |
| `lexi` (Lexi's turn) | #FBE2C4 | #FFF9F2 | #FFFCF8 | #FCFCF6 | #2A2B33 | #3A2F27 |
| `me` (user's typed turn) | #FFFBF5 + hairline | #FFF9F2 + hairline | #ECE2F8 | #D8EEE0 | #3A3326 | #4A3A2C |
| `ink` | #17130F | #2A1C12 | #221A2E | #13261D | #ECE7DF | #F0E5DE |
| `inkMuted` | #4E443B | #5E4335 | #574A6B | #3A5346 | #DDD7CE | #E2D2C6 |
| `accent` (primary fill) | #9C4A0B | #A3480A | #6E3BC4 | #1F7A57 | #F2A65A | #FFB877 |
| `onAccent` | #FFFBF5 | #FFF9F2 | #FFFFFF | #FFFFFF | #1E1408 | #4C2700 |
| `accentInk` (rings, active tab, links) | #9C4A0B | #93410A | #6630BB | #1A6A4C | #F6B97A | #FFB877 |
| `accentTint` (selected fill, tab marker) | #F3E6D9 | #F4E4D6 | #EEE5F8 | #E1EDE5 | #38302D | #443729 |
| `borderStrong` (inputs, chips, secondary buttons) | #8C7F70 | #957360 | #857A97 | #6F877A | #7C7A82 | #9E8E82 |
| `hairline` (card edges) | #E3D6C4 | #EBCDB0 | #E3DAEC | #D5E4D7 | #2E3038 | #44392F |
| Default highlight | Mint #79EAB9 | Yellow #FFE36E | Yellow | Yellow | Yellow | Yellow |

- **Highlighted word:** its ink is always #17130F.
- **`danger`:** #B42F1F with #FFFBF5, in every look. Always shown with an icon and a word, and never next to green.
- **Brand:** the butterfly's upper wings are #E38100 and its lower wings #F2B36B. Its body and antennae use `ink`. On dark looks, the upper wings are #F29A2E and the lower wings #FFC98F.
- **Match my device:** this is the default. It shows Cream by day and Ember at night (`prefers-color-scheme`).
- **Renaming:** the "Orange" look is renamed **Peach**. Its stored key stays `orange`, so saved settings keep working.
- **Reading surfaces:** Purple and Mint keep their hue on the canvas and the accent, but Lexi's turn is a warm off-white.
- **Higher contrast** (`prefers-contrast: more` / iOS Increase Contrast): `inkMuted` becomes `ink`, and `hairline` becomes `borderStrong`.

### Mood bands

| Band | Shape | Light soft / ink / solid | Dark soft / ink / solid |
|---|---|---|---|
| Content | round (circle) | #FAE1C0 / #6E3A08 / #C26A06 | #4A3418 / #F7D3A6 / #E8963A |
| Stressed | spiky (12-point star) | #D2EEE2 / #1B5A45 / #2A8A69 | #1E3F35 / #BDEBD8 / #4FC49A |
| Low self-esteem | low dome | #E6DDF4 / #4B2C80 / #7A4FC4 | #352A4D / #DCCCF7 / #A98BEA |

- **Colours:** `soft` is a background, `ink` is the text on it, and `solid` is for shapes and bars only.
- **Never colour alone:** a band always shows its shape and its word.

The shape paths (24 × 24 viewBox):
- **Round:** `<circle cx="12" cy="12" r="9"/>`
- **Spiky:** `<polygon points="12,1.5 14.6,7.6 21.1,6.4 17.6,12 21.1,17.6 14.6,16.4 12,22.5 9.4,16.4 2.9,17.6 6.4,12 2.9,6.4 9.4,7.6"/>`
- **Low:** `<path d="M2.5 19C2.5 12.5 6.8 8.5 12 8.5S21.5 12.5 21.5 19Z"/>`

## 2. Type

- **Interface font:** Lexend at weights 400, 500 and 600. Load the 500 weight.
- **Reading font:** the user's choice, Verdana by default. Native falls back to Atkinson Hyperlegible where Verdana is missing.
- **Font setting:** a font the user picks applies to all text.
- **Banned styles:** never `text-transform`, never negative tracking, never italics or underlines in running text.
- **Bold (700):** used only for emphasis inside text, never for whole labels.
- **Spacing:** every text node inherits the user's letter, word and line spacing. Nothing may override it, including tile labels, Yes/No labels and the AI note.

Sizes scale with the user's text size (the base is 18 px at Medium):

| Token | Size | Weight | Line height | Font | Use |
|---|---|---|---|---|---|
| `caption` | max(16 px, 0.889 em) | 500 | 1.45 | Lexend | AI note, timestamps, stat labels, weekdays, legend, step label |
| `label` | 1 em | 500 | 1.3 | Lexend | Buttons, tile labels, tabs, chips, settings rows |
| `body` | 1 em | 400 | user setting | reading font | Lexi's turns, the user's turns, journal text |
| `title` | 1.222 em | 600 | 1.3 | Lexend | Card and section titles |
| `headline` | 1.556 em | 600 | 1.25 | Lexend | Screen titles (Journal, Settings) |
| `display` | 2 em | 600 | 1.2 | Lexend | Home greeting |

Nothing is ever smaller than 16 px.

## 3. Spacing, size and targets

- **Spacing scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
- **Gutter:** 20 px, or 16 px on screens under 380 px.
- **Turns:** 24 px between speakers and 8 px within a group.
- **Padding and gaps:** cards have 16 px of padding, bubbles 0.75 em × 1 em, and sections a 32 px gap.
- **Targets:** at least 48 × 48. Primary buttons are 56 px tall, and the Home primary is 64 px.
- **Tiles:**
  - At least 88 px tall, with a 2 em emoji and a `label` word.
  - They sit in a grid of `auto-fill, minmax(min(100%, 8.5em), 1fr)` with a 10–12 px gap. That gives 2 columns on a phone at Medium, and fewer as the text grows.
  - Labels wrap only between words, never inside one.
- **Speaker button:** 48 px on every bubble and entry.

## 4. Shape

| Token | px | Use |
|---|---|---|
| `xs` | 6 | Bubble tail corner, word highlight |
| `sm` | 8 | Badges |
| `md` | 12 | Inputs, settings rows, emoji picker cells, day cells |
| `lg` | 20 | Bubbles, tiles, segmented tracks |
| `xl` | 28 | Cards, journal entries, sheet top corners |
| `full` | 999 | Buttons, chips, pills, tab marker, presence |

## 5. Elevation

| Level | Light looks | Dark looks | Used for |
|---|---|---|---|
| `sunken` | `sunken` fill, no shadow | `sunken` fill | Text fields, the composer, segmented tracks |
| `flat` | no shadow | no shadow | Lexi's and the user's turns, answers, lists |
| `raised` | `surface` + 1 px `hairline` + `0 1px 2px rgb(ink/6%), 0 4px 12px rgb(ink/6%)` | `raised` + 1 px `hairline` | Tiles, cards, journal entries, the dock |
| `overlay` | `surface` + `0 2px 6px rgb(ink/8%), 0 12px 32px rgb(ink/12%)` | `raised` + 1 px `borderStrong` + `0 12px 32px rgb(0 0 0/35%)` | Sheets, emoji picker, toasts |
| `scrim` | `rgb(ink/45%)` | `rgb(0 0 0/60%)` | Behind sheets |

On native, the shadow colour is the look's `ink`, never #000. Android elevation is 1 or 4.

## 6. Motion

- **Durations:** 150 ms for press, toggle and tab changes; 250 ms for a whole line appearing (fade plus a 4 px rise); 350 ms for sheets.
- **Easing:** standard (0.2, 0, 0, 1). No overshoot or bounce anywhere.
- **Removed:**
  - the bouncing typing dots
  - the hop and pop-in scale animations
  - the celebration rows (🎉 👏🏽)
  - the tile lift on select
- **The "Saved" moment:** after a save, Lexi says "Saved to your journal." with a ✔️ in a 500 ms fade. Native also plays one light haptic.
- **Reduce motion** (system setting): every movement becomes a fade of 150 ms or less, or nothing. The presence stays still and shows its word.

## 7. The frame

There is no accent frame. The top bar, side rails and dock no longer use accent colours.

### Top bar

- **Background:** `canvas`.
- **Left side:** the butterfly mark (34 px) and "Lexi" in `title` weight 600.
- **Help pill:** on the right. It is 48 px tall, `surface`, with a 1 px `borderStrong` edge, a lifebuoy line icon and "Help" in `label`.

### AI note

On Home only, under the top bar: "Lexi is an AI, not a person or a therapist." It is `caption` text in `inkMuted`, with no box and no emoji.

### Dock

- **Background:** `surface` (`raised` on dark looks), with a 1 px top `hairline` and a soft upward shadow on light looks.
- **Composer:** on Home only, above the tabs.
  - It is a 56 px `sunken` pill with a 1 px `borderStrong` edge and the placeholder "Ask Lexi…".
  - It has a 48 px emoji button (smile line icon) and a 48 px mic or send button.
  - The mic or send button fills with `ink` and uses `canvas` for its icon.
- **Tabs:** Settings, Home and Journal, in that order.
  - Each has a 24 px line icon over a `label` word at 16 px.
  - The active tab's word turns `accentInk` at weight 600, and a 56 × 28 `accentTint` pill sits behind its icon.

### Sheets (free writing, help)

- **Header:** `canvas`, with the title in `title` and a 48 px secondary Close button.
- **Body:** no rails.
- **Footer:** `surface`, with a top `hairline`.

### Icons

Controls use line icons: 24 px, 2 px stroke, round caps. The set:
- help (lifebuoy), close (×), send (arrow up), stop (square), mic, emoji (smile), speaker
- back (arrow left), next (arrow right), delete (trash), add (+), check, chevron
- tab icons: settings (sliders), home (house), journal (open book)

Emoji stay for content: moods, topics, answers, entry kinds, section headings and the two Home actions.

With **Icons off**, the existing words-only rules still apply: every control shows its word.

## 8. The butterfly presence

The butterfly replaces 🤖 everywhere: brand, avatar, reflections and the intro line. The SVG mark (64 × 64 viewBox):

```svg
<path d="M31 31C25 17 13 8 7 12C2 16 6 28 15 31C20 32.6 26 32.4 31 32Z"/>          <!-- upper wing, #E38100 -->
<path d="M33 31C39 17 51 8 57 12C62 16 58 28 49 31C44 32.6 38 32.4 33 32Z"/>       <!-- upper wing -->
<path d="M31 34C24 34 15 37 14 45C13 53 22 54 27 47C29.5 43.5 30.6 39 31 35Z"/>    <!-- lower wing, #F2B36B -->
<path d="M33 34C40 34 49 37 50 45C51 53 42 54 37 47C34.5 43.5 33.4 39 33 35Z"/>    <!-- lower wing -->
<rect x="30.4" y="22" width="3.2" height="25" rx="1.6"/>                            <!-- body, ink -->
<path d="M31 23C29.5 17 27 14 24 12.5M33 23C34.5 17 37 14 40 12.5" stroke-width="1.8" fill="none" stroke-linecap="round"/>
```

### Where it appears

- **In chat:** at 36 px, beside the **first** turn of each Lexi group, top-aligned. The other turns in the group leave the same space empty.
- **On Home:** at 104 px inside a 148 px `lexi` circle (§10).

### States

Each state has a visible word as well as the picture.

| State | Look | Word |
|---|---|---|
| Idle | still | — |
| Thinking | wings fold to 78% width; a Lexi row shows the 36 px mark and "Thinking…" in `caption` `inkMuted` | Thinking… |
| Listening (mic on) | two soft rings around the mark (`#F2B36B`, then `lexi`) | Listening… |
| Speaking | a 2 px `accentInk` ring on the bubble being read (was 4 px), and the spoken word highlighted | — |

The thinking row replaces the typing dots for every Lexi line, keeping today's pacing. With Reduce motion on, nothing animates and the words stay.

## 9. Conversation

### Lexi's turn

- **Bubble:** `lexi` fill and `ink` text, with no shadow. Corners are `lg`, with an `xs` bottom-left corner on the last turn of a group.
- **Width:** unchanged, min(70%, 21 em), or min(86%, 26 em) when spacing is roomy or text is large.
- **Speaker button:** a separate 48 px circle beside the bubble, bottom-aligned. It is `surface`, with a `hairline` edge and a line speaker icon.

### The user's turn

- **Bubble:** `me` fill, with `lg` corners and an `xs` bottom-right corner on the last turn of a group.
- **Avatar:** none by default. Settings › My avatar gains **None** as the first option and the default; the others stay.

### Answers

Emoji answers keep their sizes. The caption under them is `caption` 500.

### Yes / No

- **Size:** pills at least 84 × 56, with the label in `label`.
- **Colours:** Yes is the `accent` fill with `onAccent`. No is `surface` with a 1 px `borderStrong` edge.
- **After a tap:** the buttons go away and the answer row shows below.

### Answered cards fold away

When a card is finished, it is removed from the chat, and only the answer row stays. This covers:
- check-in steps
- action choices
- quick start
- Yes/No

There are no faded, locked cards. You go back with the next card's ⬅️ Back button or the recap's Change buttons, as today.

### AI replies are shown whole

- **No streaming:** the half-written reply never shows. Lexi stays in Thinking (at least 600 ms) until the style-checked reply is ready.
- **Then:** each checked line is shown like any other Lexi line, following the Message pace setting.
- **Stop:** still cancels the reply.

### Scrolling

- **Scrolled up:** if you have scrolled more than 120 px up, new lines don't pull the view down. Instead, a "New message ↓" pill appears above the dock, and tapping it scrolls down.
- **At the bottom:** it scrolls as today.

### Screen readers

- **Web:**
  - The chat log keeps `role="log"`, but with `aria-live="off"`.
  - A separate visually hidden `role="status"` region, present from page load, announces "Lexi says: …" once each line has been added.
- **Native:** `AccessibilityInfo.announceForAccessibility("Lexi says: …")`.
- **Focus:** never moves when a reply arrives. Cards that ask a question may still focus their first control, as today.

## 10. Screens

### Home welcome

When the app opens, the first chat item is a welcome block:
- the 104 px presence in its 148 px `lexi` circle
- the greeting in `display`: "Good morning" before 12:00, "Good afternoon" before 18:00, otherwise "Good evening"

Then Lexi's usual lines follow ("Welcome back!" …).

### Home actions

`offerActions` becomes three parts:
- **Primary button:** "🧭 Guided check-in", 64 px, full width, `accent`, with an arrow-right icon.
- **Secondary button:** "✏️ Write on my own", 56 px, full width, `surface` with a `borderStrong` edge.
- **"This week" card (`raised`):**
  - A title, plus "N check-ins" (or "1 check-in") on the right in `caption`.
  - Seven columns, Mon to Sun, for the current week. Each has its weekday (`caption`) over its day's dominant band shape (26 px, band `solid`).
  - A day with entries but no moods shows a small `inkMuted` circle. Empty and future days show a 22 px dashed `borderStrong` ring. Today gets a 2 px `accentInk` ring.

"Open journal" is removed, because the Journal tab does that. The intro's Settings / Home / Journal tiles become three secondary buttons in a row.

### Check-in, Feelings step

- **Header:** the title "Feelings" in `title`, with "Step 1" and the dots in `caption` on the right of the same row. The question stays as Lexi's line above the card.
- **Group switcher:**
  - A 3-segment control on a `sunken` track (`lg` corners, 4 px padding), one segment per band: the shape (20 px) over the band name (`caption`).
  - The selected segment gets the band's `soft` fill, a 2 px inset band `solid` ring and band `ink` text, with `aria-pressed`. Content is selected first.
- **Tiles:**
  - Only the selected group's tiles show: its first 7, then a dashed **More** tile.
  - More shows the rest of that group, then **➕ My own**. My own adds to the selected group, so its own band chooser goes.
  - Picks stay when you switch groups.
- **"You picked" line:** under the tiles, chips for every pick, each in its band's `soft` fill. It is hidden when nothing is picked.
- **Buttons:** "Skip" (secondary) and "Done (2 picked)" (primary, with the live count). Done is disabled until something is picked.

### Tiles everywhere (moods, nuance, topics, options)

- **Normal:** `surface`, a 1 px `hairline` edge, `lg` corners and the `raised` shadow.
- **Selected:**
  - `accentTint` fill, with a 1 px `accentInk` border and a 2 px `accentInk` ring
  - a 24 px check badge in the corner (`accentInk` fill, `onAccent` check)
  - no lift and no scale
- **"Name it more":** keeps one section per chosen band. Each section is headed by its shape and band name on the band's `soft` pill.

### Buttons and chips

- **Primary:** `accent` fill, `onAccent` text, 56 px tall, `full` corners, 600.
- **Secondary:** `surface`, a 1 px `borderStrong` edge, `ink` text, 500.
- **Danger:** `danger` fill.
- **Chips:**
  - Normal: 48 px tall, `surface`, a 1 px `borderStrong` edge, `full` corners, 500.
  - Pressed: `accentTint` fill, a 2 px `accentInk` border, 600.
- **Inputs:** `sunken` fill, a 1 px `borderStrong` edge, `md` corners.
- **Focus ring:** 3 px `accentInk`, offset 2 px, on every control.

### Journal

- **Title:** "Journal" in `headline`, with the "where it's saved" line in `caption` under it.
- **Stats:** two raised cards, "N days journaled" and "N feelings named". The optional streak and words cards stay.
- **"Last two weeks":** a 7 × 2 grid replaces the side-scrolling day cards.
  - **Rows:** last week and this week, Monday to Sunday, with a weekday row (`caption`) on top.
  - **Day cells:**
    - Days with moods show the date and the dominant band's shape (16 px) on the band's `soft` fill.
    - A past day with no entry shows the date on `sunken`. Entries without moods get a small `inkMuted` dot.
    - Future days have a dashed border and a muted date. Today gets a 3 px `accentInk` ring.
    - Each cell has an accessible label, such as "Tuesday 20 October: Calm, Thankful".
  - **"Most days" line:** "Most days: <shape> Content", using the band with the most picks over the 14 days. On a tie it reads "Most days: mixed", and with no moods it is hidden.
  - **Legend:** a row with each shape and its name.
- **Actions:** Guided check-in and Write on my own, as the Home buttons.
- **Entries:**
  - Raised cards with `xl` corners.
  - **Head:** "Today, 8:40 pm" in `label` 600, with the kind ("Check-in" or "Free writing") in `caption` under it. The 48 px read and delete buttons use line icons.
  - **Mood chips:** the band's `soft` fill with band `ink`.
  - **Reflection:** on a `lexi` fill with the 20 px butterfly in front of it, replacing 🤖.

### Settings

- **Sections:** raised cards, with the heading in `title` (emoji kept).
- **Look:**
  - The description becomes "Pick the colors that feel easiest to read."
  - The options are Match my device (Cream by day, Ember at night), Cream, Peach, Purple, Mint, Night and Ember.
  - Each preview shows the canvas, a Lexi turn, a user turn and a dock strip, with no bars or rails.
- **Reading help › Highlight:** gains **Best for my colors** (`auto`), the new default, which uses the look's default highlight from §1.
- **My avatar:** gains **None** (default).

## 11. Native only: voice-first chat mic

- **Start and stop:** tap the mic to start. Lexi shows Listening… and listens continuously, without stopping at pauses, until you tap **Done**.
- **While listening:** the words appear in the composer as they settle.
- **After Done:** a confirm row offers **Send**, **Say again** and **Fix**. Fix puts the words in the text box to edit.
- **Read-back:** 🔊 reads the words with the device voice. This also happens on its own when "read every message out loud" is on.

## 12. Copy changes

| Where | Before | After |
|---|---|---|
| Intro line 1 | "Hi! I'm Lexi, the journaling chatbot. 🤖 I'm here…" | "Hi! I'm Lexi, the journaling chatbot. 🦋 I'm here…" (the speech is the same, so the clip still matches) |
| Settings › Look | "The themes from the Lexi wireframes." | "Pick the colors that feel easiest to read." |
| Look names | Orange | Peach |
| Help pill and sheet title | 🆘 Help | lifebuoy icon + Help |

No new recorded lines are needed.
