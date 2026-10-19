# "Soon" features: shared spec

This spec covers the 14 "Soon" features from [`reports/Dyslexia friendly upgrades for Lexi.md`](../reports/Dyslexia%20friendly%20upgrades%20for%20Lexi.md). Both apps follow it, and copy is exact. Every fixed line below is recorded in Lexi's voice (`tools/voice/lines.json`).

## 1. Word highlight (improve)

While Lexi reads a bubble, the bubble keeps its ring and the word being spoken gets a highlight background.

**Setting: Highlight**, stored as `highlight`:

| Option | Value | Highlight color | Word color |
|---|---|---|---|
| Yellow (default) | `yellow` | #FFE36E | #020000 |
| Mint | `mint` | #79EAB9 | #020000 |
| Off | `off` | none | n/a |

**Where the word timings come from:**
- **Recorded clips:** `timings`. All clips were re-recorded alongside their timings. Each clip has a list of word start times in ms, plus a final end time. Word *i* is the *i*-th whitespace token of the clip's speech key, which is the emoji-free text.
- **Device voices:** word `boundary` events (web `onboundary`, expo-speech `onBoundary`). Map `charIndex` in the spoken part to a word index. If no events arrive, only the bubble ring shows.
- **Bubble words:** a bubble's words are its non-emoji whitespace tokens, in order, which match the speech key.

## 2. Tap a word to hear it (new)

- **Setting: "👆 Tap a word to hear it"** (`tapWord`, on by default).
- Tapping a word in one of Lexi's bubbles or in a journal entry speaks just that word with the device voice and flashes its highlight.
- Words are not separate buttons for screen readers. The bubble's 🔊 stays the accessible control.

## 3. Wider speed range (improve)

The speed slider goes from 0.5× to 2.0× in 0.05 steps. Clips use it as their playback rate (pitch kept).

## 4. Voice entries (native only, new)

- **Recording:** a 🎙️ button records an entry. The audio file is kept, and the transcript (from dictation) is saved next to it.
- **The entry:** saved as `{ kind: 'voice', audio: <file uri>, text: <transcript>, moods? }`.
- **In the journal:** ▶ plays the recording, and the transcript appears under it.
- **Copy:** "🎙️ Speak an entry". The sheet says "Talk about anything. I keep your recording, so mistakes in the words don't matter."

## 5. Cream theme (new)

Add the look **Cream**, from Rello & Bigham 2017's warm backgrounds:

| Token | Value |
|---|---|
| bg | #F5E4CC |
| surface | #FFFAF2 |
| surface-2 | #F3E1C8 |
| ink | #020000 |
| ink-soft | #4A3F35 |
| line | #E0CAAE |
| bars / rails | #E38100, with on-bar #1E1000 |
| bot bubble | #79EAB9, with text #020000 |
| me bubble | #FFFFFF |

All other tokens are the same as the Orange theme.

## 6. Check-in steps (new)

The guided check-in becomes numbered steps:

| Step | What it is |
|---|---|
| 1 | Feelings |
| 1b | "Name it more" (optional, §12) |
| 2 | Topics |
| 3 to N−1 | One step per chosen topic |
| N | Recap |

**Step label:**
- Every step card starts with "Step 1" or "Step 2". Once the topics are chosen, it reads "Step X of N", with N = 2 + topics + 1.
- A row of dots shows progress: filled for done steps, ringed for the current one.

**Moving between steps:**
- Every step after the first has a **⬅️ Back** button. It locks the current card and adds a fresh card for the previous step, pre-filled with the answers given so far.
- **Recap** card: "Here is your check-in. Tap Change to fix anything."
  - One line per step: its icon and title, then the answers.
  - A **Change** button on each line opens that step pre-filled. After it's answered, the flow returns to the recap.
  - **✔️ Save to journal** saves the entry. Nothing is saved before this.

**Autosave:**
- After every step, save the draft (`lexi.checkin` = {step, moods, nuance, keys, answers}).
- **Resuming:** on launch, if a draft exists, Lexi says "You have a check-in you didn't finish." and asks "Want to finish it?"
  - Yes resumes at the saved step.
  - No discards the draft.
- Saving or discarding clears the draft.

## 7. Tap for next (new)

**Setting: "⏩ Message pace"** (`pace`):

| Option | Value | What it does |
|---|---|---|
| Lexi decides (default) | `auto` | Today's typing pause. |
| I tap for next | `tap` | When Lexi has more than one message in a row, a **▸ Next** pill appears under each bubble. The next message waits for a tap. |
| All at once | `fast` | No typing pause and no dots. |

## 8. Export and delete (new)

**Settings → 📤 Share my journal:**
- **Make a PDF**, for the last 30 days or for everything.
- **PDF contents:**
  - title "Lexi journal", the date range, and a "Made with Lexi" line
  - then, for each entry: date and time, kind, moods (labels, with nuance words), each topic's picks, notes and to-dos (done or not), writing, and reflection
  - plain text with no emoji, in a sans font, black on white, about 12 pt
- **Saving the file:** the web app uses jsPDF 2.5.1 from cdnjs, loaded only when this button is pressed, then the `downloads` capability (`lexi-journal.pdf`). Native uses expo-print, then expo-sharing.

**Settings → 🗑️ Delete everything** (replaces "Delete all entries"):
- Deletes all entries, settings, my own words, the check-in draft and the free-write draft.
- Asks first: "Delete everything? Your entries, settings and words will be gone. This can't be undone."

## 9. Quick start (new)

In the intro, after the second line ("I speak English…"), Lexi says "Let's set me up so I'm easy for you to read." and shows a **Quick start** card. Every control applies live:

| Control | Options |
|---|---|
| Text size | S, M, L, XL, Huge |
| Letter spacing | Normal, Roomy, Extra roomy |
| Icons | On, Words only |
| Read aloud | On, Off (`autoread`) |
| Message pace | Lexi decides, I tap for next |

- A preview bubble inside the card says "This is how my messages will look." and updates live.
- **✔️ Done**, then Lexi says "You can change these any time in Settings. ⚙️"
- Settings has a **▶ Run quick start** button.

## 10. Sound-alike check (improve)

Tidy JSON adds these fields for `sound-alike` fixes:
- `emoji`: an emoji for the fixed word's meaning
- `wrongHint` and `wrongEmoji`: the meaning of the word as written, and an emoji for it

The fix row shows both words on two lines, each with its emoji, meaning and a 🔊 button:
- "there 📍 a place"
- "their 👥 belongs to them"

## 11. Sentence starters (new)

The free-write sheet shows tappable chips above the text box:
- "Today I felt…"
- "Something good was…"
- "Something hard was…"
- "I'm thankful for…"
- "Tomorrow I want to…"
- "My body feels…"

A tap inserts the chip's text plus a space at the cursor (on a new line if the text doesn't end with one) and plays it aloud when read-aloud is available.

## 12. Name it more (new)

After the feelings step, if moods were picked, Lexi asks "Want to name it more exactly? You can skip this." It then shows tiles for each chosen band, five per band:

| Band | Words |
|---|---|
| Content | 😌 Relieved · 🙂 Satisfied · 🕊️ Peaceful · 😎 Confident · 🤩 Excited |
| Stressed | 😰 Anxious · 🏃🏽‍♀️ Rushed · 🗜️ Pressured · 😵‍💫 Confused · 😩 Worn out |
| Low self-esteem | 😞 Disappointed · 😶 Lonely · 😳 Embarrassed · 🫥 Invisible · 😣 Ashamed |

- Tapping a tile selects it and speaks the word. The 15 words are recorded.
- Picks are saved as `nuance` [{e, label, band}].
- They count toward "Feelings named" and show in the journal after the mood chips.
- The card has Skip and Done.

## 13. Gentle reminders (native only, new)

- **Setting: "🔔 Reminders"**: Off (default), or On at a chosen time. Daily, or every other day.
- **Notification:** title "Lexi", body "Lexi here. 🌱 Want to check in today?"
- **Never** say "you missed".
- **Permission:** asked only when the user turns reminders on.

## 14. Voice help (improve)

- **Basic voices only:** if no device voice has a Natural, Premium, Enhanced or Google tag, show a note above the device-voice list: "Your device only has basic voices, so they may sound robotic. My own voice still reads my regular lines." The "Sounds robotic?" tips open by default.
- **Under the Test button:** "Can't hear anything? Check that your sound is on and silent mode is off."

## New recorded lines

- "Let's set me up so I'm easy for you to read."
- "This is how my messages will look."
- "You can change these any time in Settings. ⚙️"
- "Want to name it more exactly? You can skip this."
- "You have a check-in you didn't finish."
- "Want to finish it?"
- "Here is your check-in. Tap Change to fix anything."
- The six starters (§11).
- "Can't hear anything? Check that your sound is on and silent mode is off."
- "Your device only has basic voices, so they may sound robotic. My own voice still reads my regular lines."
- The 15 "Name it more" words (§12).
