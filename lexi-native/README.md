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
| 🔊 Voice | **Lexi's own voice (Natural) is the default.** Her 81 fixed lines are pre-recorded clips (the same `v01–v81.mp3` as the web app, made with Piper TTS and the public-domain LJ Speech voice) played with `expo-audio` at the speed setting. Anything without a clip (your writing, chat replies, a few native-only lines) uses the best device voice, and so does any clip that fails to play. The other choice, "📱 A voice from this device", reads everything with a phone voice. Lexi ranks those voices (`Speech.getAvailableVoicesAsync`): Enhanced / Premium quality and Siri, Google, Natural or Neural names come first, English in your locale is preferred, and compact, eSpeak and novelty voices (Zarvox, Bubbles…) go to the bottom. Settings has the two big choices, then the device voices with a ▶ preview each, "Show all voices", speed (0.6–1.4) and pitch (0.8–1.2) sliders with − / + steps, "Test Lexi's voice", a tip on downloading better voices, and the Piper credit. Everything plays from one queue, so Lexi reads her bubbles in order, pausing briefly between them, and a 🔊 tap interrupts. |
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

## Storage

Everything stays on the phone:
- **Journal entries:** SQLite (`lexi.db`, via `expo-sqlite`).
- **Settings, custom words, onboarding flag, free-write draft:** `expo-sqlite/kv-store`.
- **The optional API key:** the OS keychain (`expo-secure-store`).

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

## Verified (after the "Do next" pass)

- `npx tsc --noEmit`: clean.
- `npx expo install --check`: all dependencies match SDK 58. No new packages were needed for the 14 features. `expo-audio` (~58.0.9) and `@react-native-community/slider` came in earlier through `expo install`.
- `npx expo export --platform android --platform ios`: both bundles build, and the Hermes compiler turns both into bytecode without errors, including the `\u{…}` emoji regex in `safety.ts`. The export metadata lists all **81 mp3 clips**, the butterfly and the 4 fonts on each platform. The Hermes step was run by hand on Windows because of the long-path limit above.
- `npx expo start`: Metro serves the Android and iOS dev bundles and the clips, including the new ones (e.g. `v59.mp3`, the AI label: HTTP 200).
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
src/clips.ts            line → clip map for Lexi's own voice (generated from web/lexi.html's CLIPS)
src/safety.ts           riskCheck / styleCheck (ported as-is from the spec), crisis-line table, country default
src/tidy.ts             word-by-word tidy: the prompt, placing fixes, rebuilding from the original
src/components/Help.tsx 🆘 Help pill and sheet, the AI label, crisis lines card, privacy lines
src/ai.ts               optional Claude calls
src/theme.ts            the five DESIGN.md themes, radii, the soft shadow, layout sizes, fonts
src/ui.tsx              text, pills, chips, tiles with ✔ badge, cards, pop-in
src/fields.ts           cursor-aware text fields, emoji picker state
src/components/         ChatLog, Cards, Pickers, Inputs (Box, MicButton, CustomAdder), Composer (bottom dock), FreeWrite, Overlays
src/screens/            Journal (stats, day cards, entries), Settings (themes, voice, ...)
assets/butterfly.png    Ember's engraving (white on transparent, tinted at runtime)
assets/voice/           v01–v58.mp3, Lexi's recorded lines (Piper TTS, public-domain LJ Speech voice)
```
