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
| Journal | A stats row (🧭 check-ins, 🔥 days in a row, ✏️ words written). Then horizontally scrolling day cards for the last 14 days, each with the weekday, the date, the day's main mood emoji and a bar split by band. Entries come grouped by day with big emoji. Tick off to-dos, 🔊 read an entry aloud, 🗑️ delete with a confirm. |
| Settings | Soft rounded cards: theme (mini previews), icons on / words only, font (Verdana · Lexend · Atkinson Hyperlegible), text size, line spacing (wide by default), 🔊 voice, skin tone, avatar, my own words, the optional chat brain, replay intro, delete all. |
| 🔊 Voice | **Lexi's own voice (Natural) is the default.** Her 58 fixed lines are pre-recorded clips (the same `v01–v58.mp3` as the web app, made with Piper TTS and the public-domain LJ Speech voice) played with `expo-audio` at the speed setting. Anything without a clip (your writing, chat replies, a few native-only lines) uses the best device voice, and so does any clip that fails to play. The other choice, "📱 A voice from this device", reads everything with a phone voice. Lexi ranks those voices (`Speech.getAvailableVoicesAsync`): Enhanced / Premium quality and Siri, Google, Natural or Neural names come first, English in your locale is preferred, and compact, eSpeak and novelty voices (Zarvox, Bubbles…) go to the bottom. Settings has the two big choices, then the device voices with a ▶ preview each, "Show all voices", speed (0.6–1.4) and pitch (0.8–1.2) sliders with − / + steps, "Test Lexi's voice", a tip on downloading better voices, and the Piper credit. Everything plays from one queue, so Lexi reads her bubbles in order, pausing briefly between them, and a 🔊 tap interrupts. |
| Emoji | A picker with seven categories, opened from any 🙂. The chosen skin tone applies everywhere. |

## Storage

Everything stays on the phone:
- **Journal entries:** SQLite (`lexi.db`, via `expo-sqlite`).
- **Settings, custom words, onboarding flag, free-write draft:** `expo-sqlite/kv-store`.
- **The optional API key:** the OS keychain (`expo-secure-store`).

## Stubbed / optional

- **Lexi's chat brain is off by default.** Free chat, ✨ Tidy spelling and post-check-in reflections only work after someone pastes an Anthropic API key in **⚙️ Settings → 🔑 Chat brain (optional)**.
  - Without a key, typed messages get the same canned replies as lexi.html (help, delete, icons, settings, mic, and a crisis line), and the Tidy button and reflection offer are hidden.
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

## Verified (after the recorded-voice pass)

- `npx tsc --noEmit`: clean.
- `npx expo install --check`: all dependencies match SDK 58. `expo-audio` (~58.0.9) and `@react-native-community/slider` were added through `expo install`, so both are in Expo Go. `react-native-svg` was removed when the old pie strip went.
- `npx expo export --platform android --platform ios`: both bundles build, and the Hermes compiler turns both into bytecode without errors. The export metadata lists all **58 mp3 clips**, the butterfly and the 4 fonts on each platform. The Hermes step was run by hand on Windows because of the long-path limit above.
- `npx expo start`: Metro serves the Android and iOS dev bundles and the clips themselves (e.g. `v13.mp3`, "Welcome back!": HTTP 200).
- `npx expo config --type prebuild`: the expo-audio plugin is listed before expo-speech-recognition with the same microphone message, so the iOS prompt keeps Lexi's wording. Background audio is off. Android gets `RECORD_AUDIO` and `MODIFY_AUDIO_SETTINGS`.
- **Clip coverage** (a Node script running the same `speechKey` over every quoted line in the native script, error messages and settings lines): 57 of the 58 clips match a native line. The 58th, "Please sign in again…", is web-only. Native lines that use the device voice instead are the 🎙 mic help and two native-only chat-brain errors (bad API key, no internet).
- The pure logic was copied out and run in Node against sample inputs:
  - **Sentence splitting:** works as expected, and punctuation-only pieces are dropped.
  - **Voice ranking:** iOS Premium / Enhanced / Siri voices rank above compact Samantha, Zarvox ranks near the bottom, and a French voice ranks last. An en-GB locale puts the UK voice first. On Android, `-network` voices outrank `-local`.
  - **Settings migration:** orange + auto → auto, purple + auto → purple, mint + light → mint, any accent + dark → ember, and an existing `theme` is kept.

## Not verified

- **Nothing has been run on a phone, simulator or emulator, and there are no screenshots.** The new layout, themes, butterfly tint, shadows, animations, sliders and keyboard behaviour (`KeyboardAvoidingView`: `padding` on iOS, none on Android) are type-checked and bundled, not seen.
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
src/ai.ts               optional Claude calls
src/theme.ts            the five DESIGN.md themes, radii, the soft shadow, layout sizes, fonts
src/ui.tsx              text, pills, chips, tiles with ✔ badge, cards, pop-in
src/fields.ts           cursor-aware text fields, emoji picker state
src/components/         ChatLog, Cards, Pickers, Inputs (Box, MicButton, CustomAdder), Composer (bottom dock), FreeWrite, Overlays
src/screens/            Journal (stats, day cards, entries), Settings (themes, voice, ...)
assets/butterfly.png    Ember's engraving (white on transparent, tinted at runtime)
assets/voice/           v01–v58.mp3, Lexi's recorded lines (Piper TTS, public-domain LJ Speech voice)
```
