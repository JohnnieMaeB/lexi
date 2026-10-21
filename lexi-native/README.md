# Lexi (native)

An emoji-first journaling chatbot for dyslexic people. This is the React Native (Expo SDK 58) port of `../web/lexi.html`, built from the Miro board "Lexi" ("My Dyslexic Journal"). It does everything the web version does and adds the feature the web artifact couldn't have: **🎙 voice-to-text**. As on board Screens 11–15, the mic sits beside 🙂 in the composer. It's also in the free-write sheet and in the note box on each check-in topic.

## Setup

1. Install **Node 22.13 or newer** (Expo SDK 58 doesn't run on Node 18).
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the dev server:
   ```bash
   npx expo start
   ```
4. Scan the QR code with **Expo Go** (it must support SDK 58). Everything works in Expo Go except the mic, which shows a short message there.
5. **For voice typing**, make a development build. `expo-speech-recognition` is native code that Expo Go doesn't include. Either:
   ```bash
   npx expo run:android
   ```
   or `npx expo run:ios` on a Mac, or a cloud build with `npx eas-cli@latest build --profile development`. Then `npx expo start` serves that build too.

**On Windows, keep the project at a short path** (for example `C:\dev\lexi-native`). The Hermes compiler and React Native DevTools can't be launched from paths longer than 260 characters.

## What's in it

The look follows [`../docs/DESIGN_WARM_PAPER.md`](../docs/DESIGN_WARM_PAPER.md) ("Warm paper", direction A), which replaces the frame, theme and size rules in `DESIGN.md`: keep the big type, lose the bright frame. The copy matches lexi.html.

| Area | Behaviour |
|---|---|
| Layout | No accent frame. The top bar is the canvas colour with the butterfly mark (34 px), "Lexi" in the title style and a 48 px Help pill (lifebuoy + "Help"). Home shows the quiet AI note under it. A 20 px gutter (16 px under 380 px), no rails. The dock is a surface strip with a top hairline: on Home, a 56 px sunken composer ("Ask Lexi…", the smile button and one ink button: mic, send, or stop) sits above the Settings / Home / Journal tabs (24 px line icons over 16 px words; the active tab is in the accent ink at 600 with a 56 × 28 tint pill). |
| Chat | Opens with the welcome block: the 104 px butterfly in a 148 px circle and "Good morning / afternoon / evening". Lexi's turns use the `lexi` fill with no shadow, in a fixed column (min(70 %, 21 em), wider for roomy or large text), 24 px between speakers and 8 px within a group. The 36 px butterfly sits beside the first turn of each Lexi group, and every bubble has a 48 px speaker button. The Thinking row (folded wings and "Thinking…") replaces the typing dots. Yes / No are 84 × 56 pills under the question. Answered cards fold away and leave only the answer row. Scrolled more than 120 px up, new lines wait behind a "New message ↓" pill. Each new Lexi line is announced to screen readers as "Lexi says: …". No bounce, no celebration rows; Reduce Motion turns every movement into a short fade. |
| Looks | **Cream**, **Peach** (stored key `orange`), **Purple**, **Mint**, **Night** and **Ember**, all with the same colour roles (`src/tokens.ts`). **Match my device** (the default) is Cream by day and Ember at night. iOS Increase Contrast / Android high-contrast text turn muted ink into ink and hairlines into strong edges. Light looks use soft ink-tinted shadows; dark looks use surface tone. Older saved accent / light-dark settings still migrate. |
| Onboarding | Lexi's intro script (now with 🦋), Quick start, the ℹ️ info bubbles, Settings / Home / Journal as three buttons in a row, "Would you like to start?", "Would you like help?". "Welcome back" on later launches. |
| Home | Guided check-in (the one 64 px primary button), Write on my own (secondary), and the This week card: Mon to Sun, each day's main feeling group as its shape, a dot for entries without moods, a dashed ring for empty days, and a ring on today. |
| Guided check-in | Feelings: a three-group switcher (shape over name) for **Content / Stressed / Low self-esteem** (no "Happy" on purpose), the group's first 7 tiles, then More, then **➕ My own** (adds to the group on show). Picks stay across groups, a "You picked" line shows them, and Done counts them ("Done (2 picked)"). Then Name it more, the topics as tiles, one card per topic (tiles, a note with emoji and mic, or to-dos), and the recap. Step titles are short ("Feelings", "Name it more", "Topics", "🫀 Physical health", "Your check-in") with "Step X of N" and dots on the same row. |
| Free writing | Full-screen sheet (canvas header, 48 px Close, surface footer): optional mood, sentence starters, your words, any emoji, voice typing, ✨ Tidy spelling and Read it back. The draft is kept while you type. |
| Journal | "Journal", two stat cards (days journaled, feelings named; streak and words if switched on), the **Last two weeks** grid (7 × 2, last week and this week, each day's main group as its shape on the band's soft fill, today ringed), the "Most days" line and a shape legend, the Home buttons plus Speak an entry, then entries by day. Each entry is a raised card: the time in label 600 with the kind under it, 48 px read and delete buttons, mood chips in the band's soft fill, to-dos, and Lexi's reflection on her own fill with the butterfly. |
| Settings | Raised sections: Look ("Pick the colors that feel easiest to read.", previews of each look's canvas, Lexi turn, user turn and dock), icons on / words only, font, text size, line and letter spacing, highlight (Best for my colors by default), tap a word, message pace, 🔊 voice, skin tone, my avatar (None by default), voice typing, my own words, the optional chat brain, privacy, journal numbers, reminders, share as PDF, quick start, replay intro, delete everything. |
| 🔊 Voice | **Lexi's own voice (Natural) is the default.** Her 111 fixed lines are pre-recorded clips with per-word timings (the same `v01–v111.mp3` as the web app, made with Piper TTS and the public-domain LJ Speech voice), played with `expo-audio` at the speed setting (0.5–2.0×, pitch kept). Anything without a clip (your writing, chat replies, a few native-only lines) uses the best device voice, and so does any clip that fails to play. The other choice, "📱 A voice from this device", reads everything with a phone voice. Lexi ranks those voices (`Speech.getAvailableVoicesAsync`): Enhanced / Premium quality and Siri, Google, Natural or Neural names come first, English in your locale is preferred, and compact, eSpeak and novelty voices (Zarvox, Bubbles…) go to the bottom. Settings has the two big choices, then the device voices with a ▶ preview each, "Show all voices", speed (0.5–2.0) and pitch (0.8–1.2) sliders with − / + steps, "Test Lexi's voice", a tip on downloading better voices, and the Piper credit. Everything plays from one queue, so Lexi reads her bubbles in order, pausing briefly between them, and a 🔊 tap interrupts. |
| Emoji | A picker with seven categories, opened from any 🙂. The chosen skin tone applies everywhere. |

## The 14 "Do next" features

These follow [`../docs/FEATURES_DO_NEXT.md`](../docs/FEATURES_DO_NEXT.md); the research is in `../reports/Dyslexia friendly upgrades for Lexi.md`. Every new fixed line is recorded in Lexi's voice (v59–v81).

| # | Feature | In the native app |
|---|---|---|
| 1 | Letter spacing | Settings → ↔️ Letter spacing: Normal / Roomy / Extra roomy (0.012 / 0.06 / 0.12 em). RN has no word-spacing style, so Roomy and Extra roomy add a thin space (≈0.2 em) or a thin + hair space (≈0.3 em) after each space in displayed text. Typed text in inputs is left alone. Bot bubbles widen to min(86 %, 26 em) when spacing isn't Normal or the text is 24 px or more. |
| 2 | Bigger text | Sizes 16 / 18 / 20 / 24 / 28 (Huge). The old Extra large 23 becomes 24. The phone's text size scales all text (`allowFontScaling` is never turned off), and layout that holds text or emoji (avatars, tiles, day cards, bubble caps) is multiplied by `useWindowDimensions().fontScale` too. |
| 3 | No slanted text | No italics, ALL CAPS or underlines anywhere (Android voice codes are lower case too). Done to-dos show ✅ and are dimmed, with no line-through. |
| 4 | Follow phone settings | `AccessibilityInfo.isReduceMotionEnabled()` plus its change listener (`src/a11y.ts`). With Reduce Motion on, Lexi's lines appear after about 150 ms, every movement becomes a fade of 150 ms or less, and the butterfly stays still while the Thinking and Listening words stay. Celebration rows are gone for everyone (Warm paper §6). |
| 5 | "I'm an AI" label | "Lexi is an AI, not a person or a therapist." is always shown under the top bar on Home in the caption style, with no box or emoji, plus a speaker button. |
| 6 | Help button | A Help pill (lifebuoy + "Help") at the right of the top bar on every screen and in the writing sheets' headers. It opens the Help sheet: 🛟 Need help now?, 🧭 How to use Lexi, 🛡️ How Lexi keeps you safe and 🔒 Your privacy, each section with 🔊. |
| 7 | Local crisis lines | The spec's table for US, CA, GB, IE, AU, NZ and Other. The country defaults from the locale region and can be changed under "Your country" in Help. Numbers are large selectable text, and the 📞 Call / 💬 Text buttons only open the phone's dialer or messages. |
| 8 | Smarter crisis check | `src/safety.ts` is the spec's `riskCheck` / `styleCheck` block, ported as-is. It runs on every chat message, on free writing when saved, and on check-in notes and to-dos when the check-in is saved. With the chat brain on, chat replies carry an `[ok]/[check]/[risk]` tag, and saved writing of 3+ words gets the quick JSON check. The final level is max(local, AI). A local **risk** in chat starts the flow at once without waiting for the AI, which can only raise the level. The risk and check flows use the fixed lines and the crisis card. Saved writing is saved first, then the app switches to Home and runs the flow. Lexi never contacts anyone. |
| 9 | Kind, honest replies | The spec's rules are in the chat prompt and the reflection prompt (without the tag rule). Words-only mode adds "Do not use emoji." |
| 10 | Reply style check | `styleCheck` runs on every chat reply and every reflection: at most 3 sentences and 50 words, banned idioms dropped, at most 2 emoji at the end of each sentence and none in words-only mode. Each sentence is its own bubble. Replies aren't streamed: Lexi stays in Thinking for at least 600 ms until the checked reply is ready, then the lines come at the Message pace, and Stop still cuts the rest. |
| 11 | Days journaled, not streaks | Two stat cards: days journaled and feelings named. Settings → 📊 Journal numbers → "Show streak and word count" (off by default) adds "Days in a row (rest days OK)", where one missed day doesn't break the run, and Words written. |
| 12 | Tidy word by word | One JSON call with the spec's prompt. Each fix gets a row with **from → to**, 🔊 (the fixed word, then the hint), and Use / Keep mine, plus Use all / Undo all. The text is always rebuilt from the original, applying fixes left to right on whole words (`src/tidy.ts`). Typing after a tidy closes the list. On save, the pre-tidy words are kept as `original`, and the journal shows "See my original words". |
| 13 | Privacy in plain words | The five lines, with the native variants of lines 2 and 3, each with 🔊, in Settings → 🔒 Your privacy and in Help. |
| 14 | Better dictation | `requiresOnDeviceRecognition` when `supportsOnDeviceRecognition()` says yes. If that session fails before any words arrive, it quietly retries once with normal recognition. Also `addsPunctuation: true`, and `contextualStrings` with every mood and topic label plus the user's own words, up to 100. |

## The 14 "Soon" features

These follow [`../docs/FEATURES_SOON.md`](../docs/FEATURES_SOON.md). Every new fixed line is recorded in Lexi's voice: all 111 clips were re-recorded with word timings.

| # | Feature | In the native app |
|---|---|---|
| 1 | Word highlight | Settings → 🖍️ Highlight: Best for my colors (default: Mint on Cream, Yellow on the other looks), Yellow (#FFE36E), Mint (#79EAB9) or Off, with #17130F words. While Lexi reads a bubble it gets a 2 px ring, and the spoken word is highlighted. For clips, the word comes from the clip's timings (`src/clips.ts`, polled every 50 ms from the player's `currentTime`). For device voices it comes from expo-speech `onBoundary` (`charIndex` mapped to a word); with no events, only the ring shows. A bubble's words are its non-emoji tokens, which match the speech key. |
| 2 | Tap a word to hear it | Settings → 👆 Tap a word to hear it (`tapWord`, on by default). A tapped word in Lexi's bubbles or in a journal entry is spoken alone in the device voice and briefly highlighted. Words are nested text, not buttons, so screen readers keep using the bubble's 🔊. |
| 3 | Wider speed range | 0.5× to 2.0× in 0.05 steps. Clips use it as their playback rate with pitch kept (`setPlaybackRate(rate, 'high')`). |
| 4 | Voice entries | "🎙️ Speak an entry" (in the Journal; Home now has just the two Warm paper buttons) opens a sheet that says "Talk about anything. I keep your recording, so mistakes in the words don't matter." The recording comes from expo-speech-recognition's `recordingOptions.persist`, saved into the app's documents folder, while dictation fills the transcript. Saved as `{ kind: 'voice', audio, text, moods }`. The journal shows ▶ Play my recording with the transcript under it. Deleting the entry (or Delete everything) deletes the file. On phones that can't keep recordings (Android 12 and older), only the words are saved, and the sheet says so. |
| 5 | Cream theme | Now one of the six Warm paper looks, and the daytime half of Match my device. |
| 6 | Check-in steps | Feelings (Step 1), Name it more (1b), Topics (Step 2), one step per topic, then the Recap. Each card shows "Step X of N" (N = 2 + topics + 1, once topics are chosen) and progress dots. Back folds the card away and opens the previous step pre-filled. The recap has Change on every line and ✔️ Save to journal; nothing is saved before that. The draft (`lexi.checkin`) is saved after every step; on launch Lexi asks "Want to finish it?". Yes resumes and No discards. |
| 7 | Tap for next | Settings → ⏩ Message pace: Lexi decides / I tap for next / All at once. "I tap for next" puts a Next button under a bubble whenever Lexi has another message waiting. |
| 8 | Export and delete | Settings → 📤 Share my journal → Make a PDF for the last 30 days or everything. It's plain text with no emoji, Verdana or another sans font, black on white at 12 pt, made with expo-print and shared with expo-sharing as `lexi-journal.pdf`. 🗑️ Delete everything (with the spec's confirm line) deletes entries and recordings, settings, my own words and both drafts. The onboarding flag and the optional API key are kept. |
| 9 | Quick start | After "I speak English…" in the intro: text size, letter spacing, icons, read aloud and message pace, all applied live, with a preview bubble. Settings has ▶ Run quick start. |
| 10 | Sound-alike check | The tidy prompt also asks for `emoji`, `wrongHint` and `wrongEmoji`. A sound-alike fix shows both words on their own lines, each with its emoji, meaning and 🔊. |
| 11 | Sentence starters | Six chips above the text box. Each inserts at the cursor (on a new line if needed) and plays its recorded clip. |
| 12 | Name it more | Five tiles per chosen band. Tapping one selects it and says the recorded word. Saved as `nuance`, counted in Feelings named, shown in the journal after the mood chips, and included in the PDF. |
| 13 | Gentle reminders | Settings → 🔔 Reminders: Off (default) or On at a chosen time, Daily or Every other day. These are local expo-notifications only, titled "Lexi" with the body "Lexi here. 🌱 Want to check in today?". Permission is asked only when reminders are turned on. Every other day is scheduled as single dates 30 ahead and topped up each launch. |
| 14 | Voice help | If no device voice is Natural, Premium, Enhanced or Google, a note appears above the device voices and "Sounds robotic?" opens by default. Under the Test button: "Can't hear anything? Check that your sound is on and silent mode is off." |

## Warm paper, how it's built

[`../docs/DESIGN_WARM_PAPER.md`](../docs/DESIGN_WARM_PAPER.md) is the source of truth; the evidence is in `../reports/Polished dyslexia friendly UI for Lexi.md`.
- **Tokens** (`src/tokens.ts`): every look's roles from §1, the band soft / ink / solid colours, the brand wings, danger, and the higher-contrast swap. Plain data, so the logic tests check each text pair's contrast.
- **Type** (`src/theme.ts` `txt(role)`): caption, label, body, title, headline and display, Lexend 400 / 500 / 600 (the 500 face is now loaded), never under 16 px. Every role keeps the person's letter spacing and word gaps; body keeps their line spacing. A font picked other than the default Verdana applies to all text.
- **Icons and shapes without an SVG library.** react-native-svg isn't a dependency, so `tools/make-icons.mjs` (no dependencies) draws the spec's SVG paths into white PNGs: 17 line icons (24 px, 2 px stroke, round caps), the three band shapes and the butterfly in three layers. The app tints them with `tintColor`, so one file serves every look. Run `node tools/make-icons.mjs` after changing a path.
- **The butterfly presence** (`Butterfly` in `src/ui.tsx`): Thinking folds the wing layers to 78 % width, and Listening adds the two rings (#F2B36B, then the look's `lexi`). Under Reduce Motion it stays still and the word shows.
- **Elevation:** light looks use the spec's two soft ink-tinted shadows (`boxShadow`) on iOS and elevation 1 or 4 with an ink shadow colour on Android; dark looks use surface tone and a hairline. The dark overlay shadow is black at 35 %, as in the spec's table.
- **Focus and selection rings** use RN's `outline` styles, so nothing shifts when a tile is picked.
- **The "Saved" moment** plays one light haptic (`expo-haptics`; on Android it uses the view's own haptic feedback, so `VIBRATE` stays blocked).
- **Voice-first chat mic** (§11): tap the mic, Lexi shows Listening… and keeps listening through pauses until Done. Then Send, Say again or Fix (the words go into the box to edit), plus a speaker button that reads them back in the device voice, automatically when "Read every message" is on.

## Storage

Everything stays on the phone:
- **Journal entries:** SQLite (`lexi.db`, via `expo-sqlite`). Voice-entry recordings are files in the app's documents folder.
- **Settings, custom words, onboarding flag, free-write draft, check-in draft:** `expo-sqlite/kv-store`.
- **The optional API key:** the OS keychain (`expo-secure-store`).
- **Android:** `READ_EXTERNAL_STORAGE` and `WRITE_EXTERNAL_STORAGE` are blocked in `app.json`, because Lexi only writes inside its own folders. `VIBRATE` is blocked too: the Saved haptic doesn't need it.

## Stubbed / optional

- **Lexi's chat brain is off by default.** Free chat, ✨ Tidy spelling and post-check-in reflections only work after someone pastes an Anthropic API key in **⚙️ Settings → 🔑 Chat brain (optional)**.
  - Without a key, typed messages get the same canned replies as lexi.html (help, delete, voice, icons, settings, mic), and the Tidy button and reflection offer are hidden. The local crisis check and safety flows always work, key or not.
  - With a key, `src/ai.ts` calls Claude through `@anthropic-ai/sdk`: model `claude-opus-5-5`, low effort for chat and tidy, medium for reflections, server-side refusal fallback on.
  - The chat history is append-only: the system prompt is frozen for each session, journal changes go in as system notes, and a long session restarts instead of trimming.
  - The key and requests go straight from the phone to Anthropic. That's fine for a personal prototype; a public app should route through its own server instead.
- **Voice typing** uses the phone's built-in recognizer, set to `en-US` in `src/voice.ts`. Apple or Google may process the audio on their servers.

## Lexi's recorded voice: updating the clips

`assets/voice/` and `src/clips.ts` are copies of `../web/voice/` and the web's `CLIPS` table. Each key is `speechKey(line)` from `src/text.ts`, which is the web's `speechText()`: emoji stripped, "Stress(ors)" read as "Stressors", newlines turned into ". ", spaces collapsed. When a line changes:
1. Regenerate the clips with `../tools/voice/README.md`.
2. Copy the new mp3s here.
3. Rebuild `src/clips.ts` with one `require()` per clip. Metro needs the requires to be static.

A line whose text no longer matches its key falls back to the device voice, so a mismatch makes Lexi sound different but never breaks anything.

## Verified (after the Warm paper pass)

- `npx tsc --noEmit`: clean.
- `npx expo export` for iOS and Android: both bundles build, and the Hermes compiler (run by hand from a short path, because of the Windows long-path limit) turns both into bytecode without errors. Each platform's export lists **111 mp3 clips, 23 PNGs** (17 icons, 3 shapes, 3 butterfly layers) and **5 font faces**.
- `npx expo config --type prebuild`: the plugins resolve. Android still ends up with only `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS` and `INTERNET`; `VIBRATE` (from expo-haptics) is blocked.
- **Warm paper logic (115/115 checks)**, on code transpiled from the real `src/tokens.ts`, `src/week.ts` and `src/content.ts`:
  - Match my device is Cream by day and Ember at night; Peach keeps the key `orange`; the look order; each look's default highlight; the higher-contrast swap; only Cream and Peach edge the user's turn.
  - Contrast in every look: ink on every surface at 7:1 or more, muted ink, the accent pairs and highlighted words at 4.5:1 or more, strong edges at 3:1 or more, and every band's ink on its soft fill at 4.5:1 or more.
  - The greeting by hour, Monday-to-Sunday weeks, the two-week grid, each day's main band (a tie goes to the newest pick), "Most days" (with "mixed" on a tie and hidden with no moods), and the day cells' screen-reader labels ("Tuesday 20 October: Calm, Thankful").
  - The new defaults: Best for my colors, and no avatar.
- **Recorded lines:** the lines this pass changed (the 🦋 intro line, the AI note without its emoji, "Saved to your journal. ✔️") still match their clips.
- **Regression:** the safety port matches the spec block on 26/26 inputs, the Do-next logic tests pass 29/29, and the Soon logic tests pass 28/28.

## Verified earlier (the "Soon" pass)

- `npx tsc --noEmit`: clean.
- `npx expo install --check`: all dependencies match SDK 58. The Soon pass added `expo-print`, `expo-sharing`, `expo-notifications` and `expo-file-system` through `expo install`. Earlier passes added `expo-audio` and `@react-native-community/slider`.
- `npx expo export --platform android --platform ios`: both bundles build (about 1,200 modules), and the Hermes compiler turns both into bytecode without errors. The export metadata lists all **111 mp3 clips**, the butterfly and the 4 fonts on each platform. The Hermes step was run by hand on Windows because of the long-path limit above.
- `npx expo config --type prebuild`: the plugins resolve, including expo-notifications and expo-sharing.
  - iOS keeps Lexi's microphone wording and has no background modes.
  - Android ends up with only `RECORD_AUDIO`, `MODIFY_AUDIO_SETTINGS` and `INTERNET`.
- **Soon logic (28/28 checks)**, run in Node on code transpiled from the real files:
  - **Highlight alignment:** for all 111 recorded lines, the words `WordText` numbers match the clip's timing marks exactly. `wordAt` maps clip time to the right word.
  - **Step labels:** "Step 1", "Step 1b" and "Step 2" before topics are chosen, then "Step X of N" with N = 2 + topics + 1. "Just my mood today" gives "Step 3 of 3". Back is on every step after the first, and the first-pending step logic is correct.
  - **Content:** 5 Name it more words per band and 6 starters.
  - **Every-other-day reminders:** they start today or tomorrow correctly and step 2 days.
  - **Sound-alike fixes:** they keep both meanings and both emoji.
  - **PDF HTML:** no emoji, the title, range and Made with Lexi lines, nuance, to-dos marked done or not done, voice entries, reflections, and the 30-day filter.
- **Recorded lines:** all 30 new lines (82–111) appear word for word in the native source and are keyed to their clips. Across all 111, 108 match a native line. The other 3 are expected: the two old US-only crisis lines replaced by the Do-next safety flow, and "Please sign in again…", which is web-only.
- **Spec copy:** a script checked every name and copy string in `docs/FEATURES_SOON.md` §1–§14 against the native source, and all are present. "You missed" appears only in a code comment.
- **Do-next regression:** the safety port still matches the spec block on 26/26 inputs, and the Do-next logic tests pass 29/29.
- **From the Do-next pass:** `npx expo start` served both dev bundles and the clips (HTTP 200).
- **Safety port parity:** the spec's own JS block (pulled from `docs/FEATURES_DO_NEXT.md` and run with the web's helpers) and `src/safety.ts` (transpiled from the real file) were run on the same inputs. All **26/26** gave identical results:
  - 23 crisis-check cases: misspellings ("suiside", "suicidle", "hurt myslf", "end it al", "better of without me"), slang ("kms", "unalive"), emoji-only messages (🔪, 🪦🪦), and false alarms ("dye my hair", "killing me lol", "to die for", "cut my hair").
  - 3 style-check cases.
- **Tidy logic** (`src/tidy.ts`, transpiled and run in Node): fixes are found left to right on whole words only ("therefore" isn't touched when fixing "their"), unfound fixes are dropped, and Use all, keep-some and Undo all rebuild the text correctly. Undo all gives back the exact original.
- **Recorded lines:** all 23 new lines in `tools/voice/lines.json` (59–81) appear word for word in the native source, or are web-only variants, and each is keyed to its clip. 78 native lines now have a clip. The unused clips are web-only (sign-in, Claude-account storage, "to make a reply") and the two old 988 crisis lines the new flow replaced.
- From earlier passes: `npx expo config --type prebuild` keeps Lexi's microphone wording on iOS, background audio is off, and Android gets `RECORD_AUDIO` and `MODIFY_AUDIO_SETTINGS`.
- The pure logic was copied out and run in Node against sample inputs:
  - **Sentence splitting:** works as expected, and punctuation-only pieces are dropped.
  - **Voice ranking:** iOS Premium / Enhanced / Siri voices rank above compact Samantha, Zarvox ranks near the bottom, and a French voice ranks last. An en-GB locale puts the UK voice first. On Android, `-network` voices outrank `-local`.
  - **Settings migration:** orange + auto → auto, purple + auto → purple, mint + light → mint, any accent + dark → ember, and an existing `theme` is kept.

## Not verified

- **The Warm paper redesign hasn't been seen on a device.** The looks, the generated icons' tinting, the butterfly's fold and rings, `boxShadow` and `outline` rendering, the New message pill, screen-reader announcements, the haptic and the voice-first mic flow are type-checked and bundled only.
- One spec pair sits under the report's 10:1 aim: Ember's ink on the user's turn is 8.8:1 (it passes WCAG AAA).
- **Nothing has been run on a phone, simulator or emulator, and there are no screenshots.** The layout, themes, butterfly tint, shadows, animations, sliders and keyboard behaviour (`KeyboardAvoidingView`: `padding` on iOS, none on Android) are type-checked and bundled, not seen. The same goes for the new pieces:
  - the Help sheet, the 🆘 pill, the AI label and the crisis card
  - Reduce Motion switching live
  - large system text sizes
  - the word-gap approximation for letter spacing
- **None of the Soon features has been used on a device:**
  - the word highlight timing against real playback, and whether a phone's engine sends `onBoundary` events at all
  - tap-to-hear
  - the check-in steps, Back, Change and resuming
  - the ▸ Next pace and Quick start
  - recording and playing back voice entries, including where expo-speech-recognition writes the file
  - the PDF's look and the share sheet
  - notifications firing, including Android 13's permission prompt
  - Delete everything
- **The tidy prompt's sound-alike fields aren't from the web yet.** I added `emoji`, `wrongHint` and `wrongEmoji` to the prompt myself, since `web/lexi.html` didn't have them. The web should use the same wording.
- **The safety flows haven't been walked through on a device.** Neither have the 📞 / 💬 links: they use `Linking.openURL('tel:…' / 'sms:…')`, and the sms body form differs by platform.
- **The AI parts of the new features haven't been called:** the `[ok]/[check]/[risk]` tag, the saved-writing JSON check, and the word-by-word tidy JSON. No API key was used, so how well the model follows those prompts is untested.
- **Better dictation is untested on a device:** on-device mode, the quiet fallback, punctuation and `contextualStrings`.
- **Two spec behaviors to know about.** They're in the spec's own code, and the port keeps them on purpose:
  - Swapped letters such as "kil myslef" aren't caught, because plain Levenshtein counts a swap as 2 edits.
  - An emoji right before a full stop leaves a space, e.g. "heavy 💛." becomes "heavy . 💛".
- **No clip has been heard on a phone.**
  - Playback, the speed applied as the playback rate, and the order of read-aloud have only been type-checked, bundled and served.
  - The silent-switch and ducking behaviour come from `setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'duckOthers' })` and are untested.
  - expo-audio has no error event, so a clip that hasn't started within 4 s is treated as failed and the line is spoken with the device voice.
- **Real voice lists haven't been tested.** The ranking runs on the voice shapes expo-speech documents (iOS identifiers such as `com.apple.voice.premium.en-US.Zoe`, Android names such as `en-us-x-tpf-local`), not on a device's actual list. Whether `pitch` is honoured depends on the voice engine.
- **The native build with `expo-speech-recognition` is untested.** Its latest release (57.1.1) was built against SDK 56. If `expo run:android` fails in that module, check for a newer release.
- **The Claude calls haven't been made** (no API key was used).
- **There are no automated UI tests.** A jest-expo smoke test was attempted earlier but not kept.

## Notes

- **Verdana:** iOS ships Verdana. Android doesn't, and its license doesn't allow bundling it, so on Android the Verdana setting renders in Atkinson Hyperlegible (the next font in lexi.html's stack), and Settings says so.
- **Navigation:** the app is a single screen with its own three-tab bar, as in the board's wireframes. The template's Expo Router suggestion isn't used. Home stays mounted, so the conversation and half-finished cards survive tab switches.

## Code map

```
App.tsx                 shell: fonts, theme, top bar, views, dock, overlays, Android back
src/content.ts          moods, topics, emoji sets, setting options
src/script.ts           onboarding, check-in, free chat, reflections (Lexi's words)
src/chat.ts             say / ask / card queue behind the chat log; cards fold away when answered
src/store.ts            state + SQLite / kv-store / SecureStore
src/tokens.ts           Warm paper colour tokens: six looks, band colours, brand, contrast helper
src/theme.ts            type roles, shape, elevation, layout sizes, fonts, highlight
src/a11y.ts             Reduce Motion, higher contrast, motion timings, the Saved haptic
src/art.ts              the generated icons, band shapes and butterfly layers
src/week.ts             This week, Last two weeks, Most days, greeting
src/voice.ts            🎙 speech-to-text
src/speech.ts           🔊 one read-aloud queue: recorded clips (expo-audio) + ranked device voices (expo-speech)
src/clips.ts            line → { clip, word timings } for Lexi's own voice (generated from web/lexi.html's CLIPS)
src/safety.ts           riskCheck / styleCheck (ported as-is from the spec), crisis-line table, country default
src/tidy.ts             word-by-word tidy: the prompt (with sound-alike fields), placing fixes, rebuilding from the original
src/steps.ts            check-in step order, "Step X of N" labels, what's still to answer
src/recording.ts        ▶ playing voice-entry recordings
src/exportPdf.ts        📤 PDF with expo-print, shared with expo-sharing (HTML in src/pdfHtml.ts)
src/reminders.ts        🔔 local reminder notifications (times in src/schedule.ts)
src/ai.ts               optional Claude calls
src/ui.tsx              text roles, line icons, shapes, the butterfly, buttons, chips, tiles, cards
src/fields.ts           cursor-aware text fields, emoji picker state
src/components/         ChatLog, Cards (Home actions, This week, check-in steps, quick start), Pickers, Inputs,
                        Composer (dock, tabs, voice-first mic), Sheet, Help, FreeWrite, VoiceEntry, WordText, Overlays
src/screens/            Journal (stats, two-week grid, entries), Settings (looks, voice, reminders, export, ...)
tools/make-icons.mjs    draws assets/icons, assets/shapes and assets/butterfly from the spec's SVG paths
assets/voice/           v01–v111.mp3, Lexi's recorded lines (Piper TTS, public-domain LJ Speech voice)
```
