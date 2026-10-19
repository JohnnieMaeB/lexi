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

The look follows [`../docs/DESIGN.md`](../docs/DESIGN.md) (board Screens 11–15, the Theme frame and the Inspo Board). The copy matches lexi.html.

| Area | Behaviour |
|---|---|
| Layout | A `#E6E6E6` canvas on light themes. A 48 px accent top bar with a small "🤖 Lexi", and 14 px accent rails (10 px under 380 px). At the bottom, an accent dock: the ⚙️ 🏡 📖 nav row (34–36 px emoji, 13 px labels, the active tab on a white tile) above a white input pill. The pill holds the text field, 🙂 and 🎙, and ➤ appears inside it once there's text to send. |
| Chat | Mint bot bubbles in a fixed column about 64 % of the width, 24 px apart, radius 22. 🤖 (46 px) sits on the last bubble of each group, and so does your avatar (52 px). Yes / No are big 👍🏽 👎🏽 pills inside the question bubble. Emoji answers show as huge emoji with no bubble (88 px for one, smaller for several) and a small caption; typed text keeps a bubble. 👏🏽👏🏽👏🏽👏🏽 celebrations are 64–96 px and bounce. Bubbles pop in, and the typing indicator is circles moving up and down. All motion turns off under Reduce Motion. |
| Themes | **Orange** (Screen 11), **Purple** (Screen 13), **Mint** (Theme frame), **Night** (Screen 12: black, outlined dark bubbles with orange words, mint Yes), **Ember** (Screen 15: the Material 3 dark palette, with the butterfly engraving behind the chat tinted `#FFB877` at 18 %). **Match my device** uses Orange in light mode and Ember in dark mode. Older saved accent / light-dark settings migrate automatically. |
| Onboarding | Lexi's intro script, the ℹ️ info bubbles, the ⚙️ 🏡 📖 legend as big white tiles, "Would you like to start?", "Would you like help?". "Welcome back" on later launches. |
| Guided check-in | Mood tiles in **Content / Stressed / Low self-esteem** (no "Happy" on purpose): 44 px emoji in rounded squares, and a picked tile gets a 3 px ring and a ✔ badge. Then the nine topics, each with emoji tiles, a note box (🙂 🎙), or to-dos. **➕ My own** adds custom words and emoji. Lexi reacts without toxic positivity. |
| Free writing | Full-screen sheet: optional mood, your words, 🙂 any emoji, 🎙 voice typing (keeps listening until you tap stop), 🔊 Read it back. The draft is kept while you type. |
| Journal | A stats row (📅 Days journaled, 💬 Feelings named, 📖 Entries). Then horizontally scrolling day cards for the last 14 days, each with the weekday, the date, the day's main mood emoji and a bar split by band. Entries come grouped by day with big emoji. Tick off to-dos (✅ when done), 🔊 read an entry aloud, 🗑️ delete with a confirm, and "See my original words" on tidied entries. |
| Settings | Soft rounded cards: theme (mini previews), icons on / words only, font (Verdana · Lexend · Atkinson Hyperlegible), text size (up to Huge), line spacing (wide by default), letter spacing, 🔊 voice, skin tone, avatar, voice typing, my own words, the optional chat brain, 🔒 your privacy, journal numbers, replay intro, delete all. |
| 🔊 Voice | **Lexi's own voice (Natural) is the default.** Her 111 fixed lines are pre-recorded clips with per-word timings (the same `v01–v111.mp3` as the web app, made with Piper TTS and the public-domain LJ Speech voice), played with `expo-audio` at the speed setting (0.5–2.0×, pitch kept). Anything without a clip (your writing, chat replies, a few native-only lines) uses the best device voice, and so does any clip that fails to play. The other choice, "📱 A voice from this device", reads everything with a phone voice. Lexi ranks those voices (`Speech.getAvailableVoicesAsync`): Enhanced / Premium quality and Siri, Google, Natural or Neural names come first, English in your locale is preferred, and compact, eSpeak and novelty voices (Zarvox, Bubbles…) go to the bottom. Settings has the two big choices, then the device voices with a ▶ preview each, "Show all voices", speed (0.5–2.0) and pitch (0.8–1.2) sliders with − / + steps, "Test Lexi's voice", a tip on downloading better voices, and the Piper credit. Everything plays from one queue, so Lexi reads her bubbles in order, pausing briefly between them, and a 🔊 tap interrupts. |
| Emoji | A picker with seven categories, opened from any 🙂. The chosen skin tone applies everywhere. |

## The 14 "Do next" features

These follow [`../docs/FEATURES_DO_NEXT.md`](../docs/FEATURES_DO_NEXT.md); the research is in `../reports/Dyslexia friendly upgrades for Lexi.md`. Every new fixed line is recorded in Lexi's voice (v59–v81).

| # | Feature | In the native app |
|---|---|---|
| 1 | Letter spacing | Settings → ↔️ Letter spacing: Normal / Roomy / Extra roomy (0.012 / 0.06 / 0.12 em). RN has no word-spacing style, so Roomy and Extra roomy add a thin space (≈0.2 em) or a thin + hair space (≈0.3 em) after each space in displayed text. Typed text in inputs is left alone. Bot bubbles widen to min(86 %, 26 em) when spacing isn't Normal or the text is 24 px or more. |
| 2 | Bigger text | Sizes 16 / 18 / 20 / 24 / 28 (Huge). The old Extra large 23 becomes 24. The phone's text size scales all text (`allowFontScaling` is never turned off), and layout that holds text or emoji (avatars, tiles, day cards, bubble caps) is multiplied by `useWindowDimensions().fontScale` too. |
| 3 | No slanted text | No italics, ALL CAPS or underlines anywhere (Android voice codes are lower case too). Done to-dos show ✅ and are dimmed, with no line-through. |
| 4 | Follow phone settings | `AccessibilityInfo.isReduceMotionEnabled()` plus its change listener. With Reduce Motion on, Lexi's lines appear after about 150 ms with no typing dots, nothing pops in or bounces, and 🎉 / 👏🏽 rows are left out. While the chat brain is thinking, a still "Lexi is thinking…" line shows instead of dots. |
| 5 | "I'm an AI" label | "🤖 Lexi is an AI, not a person or a therapist." is always shown under the top bar on Home, with 🔊. |
| 6 | Help button | A 🆘 Help pill at the right of the top bar on every screen and in the free-write header. It opens the Help sheet: 🛟 Need help now?, 🧭 How to use Lexi, 🛡️ How Lexi keeps you safe and 🔒 Your privacy, each section with 🔊. |
| 7 | Local crisis lines | The spec's table for US, CA, GB, IE, AU, NZ and Other. The country defaults from the locale region and can be changed under "Your country" in Help. Numbers are large selectable text, and the 📞 Call / 💬 Text buttons only open the phone's dialer or messages. |
| 8 | Smarter crisis check | `src/safety.ts` is the spec's `riskCheck` / `styleCheck` block, ported as-is. It runs on every chat message, on free writing when saved, and on check-in notes and to-dos when the check-in is saved. With the chat brain on, chat replies carry an `[ok]/[check]/[risk]` tag, and saved writing of 3+ words gets the quick JSON check. The final level is max(local, AI). A local **risk** in chat starts the flow at once without waiting for the AI, which can only raise the level. The risk and check flows use the fixed lines and the crisis card. Saved writing is saved first, then the app switches to Home and runs the flow. Lexi never contacts anyone. |
| 9 | Kind, honest replies | The spec's rules are in the chat prompt and the reflection prompt (without the tag rule). Words-only mode adds "Do not use emoji." |
| 10 | Reply style check | `styleCheck` runs on every chat reply and every reflection: at most 3 sentences and 50 words, banned idioms dropped, at most 2 emoji at the end of each sentence and none in words-only mode. Each sentence is its own bubble. Replies aren't streamed on native, so the check runs once on the full reply. |
| 11 | Days journaled, not streaks | Days journaled, Feelings named and Entries. Settings → 📊 Journal numbers → "Show streak and word count" (off by default) adds "Days in a row (rest days OK)", where one missed day doesn't break the run, and Words written. |
| 12 | Tidy word by word | One JSON call with the spec's prompt. Each fix gets a row with **from → to**, 🔊 (the fixed word, then the hint), and Use / Keep mine, plus Use all / Undo all. The text is always rebuilt from the original, applying fixes left to right on whole words (`src/tidy.ts`). Typing after a tidy closes the list. On save, the pre-tidy words are kept as `original`, and the journal shows "See my original words". |
| 13 | Privacy in plain words | The five lines, with the native variants of lines 2 and 3, each with 🔊, in Settings → 🔒 Your privacy and in Help. |
| 14 | Better dictation | `requiresOnDeviceRecognition` when `supportsOnDeviceRecognition()` says yes. If that session fails before any words arrive, it quietly retries once with normal recognition. Also `addsPunctuation: true`, and `contextualStrings` with every mood and topic label plus the user's own words, up to 100. |

## The 14 "Soon" features

These follow [`../docs/FEATURES_SOON.md`](../docs/FEATURES_SOON.md). Every new fixed line is recorded in Lexi's voice: all 111 clips were re-recorded with word timings.

| # | Feature | In the native app |
|---|---|---|
| 1 | Word highlight | Settings → 🖍️ Highlight: Yellow (default, #FFE36E), Mint (#79EAB9) or Off, with #020000 words. While Lexi reads a bubble it gets a 3 px ring, and the spoken word is highlighted. For clips, the word comes from the clip's timings (`src/clips.ts`, polled every 50 ms from the player's `currentTime`). For device voices it comes from expo-speech `onBoundary` (`charIndex` mapped to a word); with no events, only the ring shows. A bubble's words are its non-emoji tokens, which match the speech key. |
| 2 | Tap a word to hear it | Settings → 👆 Tap a word to hear it (`tapWord`, on by default). A tapped word in Lexi's bubbles or in a journal entry is spoken alone in the device voice and briefly highlighted. Words are nested text, not buttons, so screen readers keep using the bubble's 🔊. |
| 3 | Wider speed range | 0.5× to 2.0× in 0.05 steps. Clips use it as their playback rate with pitch kept (`setPlaybackRate(rate, 'high')`). |
| 4 | Voice entries | "🎙️ Speak an entry" (in Lexi's menu and the Journal) opens a sheet that says "Talk about anything. I keep your recording, so mistakes in the words don't matter." The recording comes from expo-speech-recognition's `recordingOptions.persist`, saved into the app's documents folder, while dictation fills the transcript. Saved as `{ kind: 'voice', audio, text, moods }`. The journal shows ▶ Play my recording with the transcript under it. Deleting the entry (or Delete everything) deletes the file. On phones that can't keep recordings (Android 12 and older), only the words are saved, and the sheet says so. |
| 5 | Cream theme | A seventh theme tile with the spec's tokens; everything else matches Orange. |
| 6 | Check-in steps | Feelings (Step 1), Name it more (1b), Topics (Step 2), one step per topic, then the Recap. Each card shows "Step X of N" (N = 2 + topics + 1, once topics are chosen) and progress dots. ⬅️ Back locks the card and opens the previous step pre-filled. The recap has Change on every line and ✔️ Save to journal; nothing is saved before that. The draft (`lexi.checkin`) is saved after every step; on launch Lexi asks "Want to finish it?". Yes resumes and No discards. |
| 7 | Tap for next | Settings → ⏩ Message pace: Lexi decides / I tap for next / All at once. "I tap for next" puts a ▸ Next pill under a bubble whenever Lexi has another message waiting. |
| 8 | Export and delete | Settings → 📤 Share my journal → Make a PDF for the last 30 days or everything. It's plain text with no emoji, Verdana or another sans font, black on white at 12 pt, made with expo-print and shared with expo-sharing as `lexi-journal.pdf`. 🗑️ Delete everything (with the spec's confirm line) deletes entries and recordings, settings, my own words and both drafts. The onboarding flag and the optional API key are kept. |
| 9 | Quick start | After "I speak English…" in the intro: text size, letter spacing, icons, read aloud and message pace, all applied live, with a preview bubble. Settings has ▶ Run quick start. |
| 10 | Sound-alike check | The tidy prompt also asks for `emoji`, `wrongHint` and `wrongEmoji`. A sound-alike fix shows both words on their own lines, each with its emoji, meaning and 🔊. |
| 11 | Sentence starters | Six chips above the text box. Each inserts at the cursor (on a new line if needed) and plays its recorded clip. |
| 12 | Name it more | Five tiles per chosen band. Tapping one selects it and says the recorded word. Saved as `nuance`, counted in Feelings named, shown in the journal after the mood chips, and included in the PDF. |
| 13 | Gentle reminders | Settings → 🔔 Reminders: Off (default) or On at a chosen time, Daily or Every other day. These are local expo-notifications only, titled "Lexi" with the body "Lexi here. 🌱 Want to check in today?". Permission is asked only when reminders are turned on. Every other day is scheduled as single dates 30 ahead and topped up each launch. |
| 14 | Voice help | If no device voice is Natural, Premium, Enhanced or Google, a note appears above the device voices and "Sounds robotic?" opens by default. Under the Test button: "Can't hear anything? Check that your sound is on and silent mode is off." |

## Storage

Everything stays on the phone:
- **Journal entries:** SQLite (`lexi.db`, via `expo-sqlite`). Voice-entry recordings are files in the app's documents folder.
- **Settings, custom words, onboarding flag, free-write draft, check-in draft:** `expo-sqlite/kv-store`.
- **The optional API key:** the OS keychain (`expo-secure-store`).
- **Android:** `READ_EXTERNAL_STORAGE` and `WRITE_EXTERNAL_STORAGE` are blocked in `app.json`, because Lexi only writes inside its own folders.

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

## Verified (after the "Soon" pass)

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
App.tsx                 shell: fonts, theme, top bar, rails, views, composer, tabs, overlays, Android back
src/content.ts          moods, topics, emoji sets, setting options
src/script.ts           onboarding, check-in, free chat, reflections (Lexi's words)
src/chat.ts             say / ask / card queue behind the chat log
src/store.ts            state + SQLite / kv-store / SecureStore
src/voice.ts            🎙 speech-to-text
src/speech.ts           🔊 one read-aloud queue: recorded clips (expo-audio) + ranked device voices (expo-speech)
src/clips.ts            line → { clip, word timings } for Lexi's own voice (generated from web/lexi.html's CLIPS)
src/safety.ts           riskCheck / styleCheck (ported as-is from the spec), crisis-line table, country default
src/tidy.ts             word-by-word tidy: the prompt (with sound-alike fields), placing fixes, rebuilding from the original
src/steps.ts            check-in step order, "Step X of N" labels, what's still to answer
src/recording.ts        ▶ playing voice-entry recordings
src/exportPdf.ts        📤 PDF with expo-print, shared with expo-sharing (HTML in src/pdfHtml.ts)
src/reminders.ts        🔔 local reminder notifications (times in src/schedule.ts)
src/components/Help.tsx 🆘 Help pill and sheet, the AI label, crisis lines card, privacy lines
src/components/WordText.tsx  words that highlight while read and can be tapped to hear
src/components/VoiceEntry.tsx 🎙️ Speak an entry
src/ai.ts               optional Claude calls
src/theme.ts            the DESIGN.md themes plus Cream, radii, the soft shadow, layout sizes, fonts, highlight colors
src/ui.tsx              text, pills, chips, tiles with ✔ badge, cards, pop-in
src/fields.ts           cursor-aware text fields, emoji picker state
src/components/         ChatLog, Cards (check-in steps, recap, quick start), Pickers, Inputs, Composer (bottom dock), FreeWrite, Overlays
src/screens/            Journal (stats, day cards, entries), Settings (themes, voice, reminders, export, ...)
assets/butterfly.png    Ember's engraving (white on transparent, tinted at runtime)
assets/voice/           v01–v111.mp3, Lexi's recorded lines (Piper TTS, public-domain LJ Speech voice)
```
