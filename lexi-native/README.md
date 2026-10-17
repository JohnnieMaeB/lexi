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

| Area | Behaviour (copy matches lexi.html) |
|---|---|
| Onboarding | Lexi's intro script, the ℹ️ info bubbles, the ⚙️ 🏡 📖 legend, "Would you like to start?", "Would you like help?". "Welcome back" on later launches. |
| Guided check-in | Mood tiles in **Content / Stressed / Low self-esteem** (no "Happy" on purpose). Then the nine topics, each with emoji tiles, a note box (🙂 🎙), or to-dos. **➕ My own** adds custom words and emoji, with a band for moods. Lexi reacts without toxic positivity. |
| Free writing | Full-screen sheet: optional mood, your words, 🙂 any emoji, 🎙 voice typing (keeps listening until you tap stop), 🔊 Read it back. The draft is kept while you type. |
| Journal | Entries grouped by day, newest first. A **14-day mood strip**: one pie per day showing that day's mix of bands. Tick off to-dos, 🔊 read an entry aloud, 🗑️ delete with a confirm. |
| Settings | Icons on / words only, font (Verdana · Lexend · Atkinson Hyperlegible), text size, line spacing (wide by default), orange / purple / mint, light / dark / match device, skin tone, avatar, read Lexi out loud, my own words, replay intro, delete all. |
| Emoji | A picker with seven categories, opened from any 🙂. The chosen skin tone applies everywhere. |
| Read aloud | `expo-speech`, with emoji stripped first. Lexi's own messages are queued, not cut off. |

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

## Verified

- `npx tsc --noEmit`: clean.
- `npx expo install --check`: all dependencies match SDK 58.
- `npx expo start`: Metro starts (`packager-status:running`) and serves the Android and iOS dev bundles (HTTP 200, about 1,200 modules each).
- `npx expo export --platform android --platform ios`: both bundles build, and the Hermes compiler turns them into bytecode without errors. That step was run by hand on Windows because of the long-path limit above.
- `npx expo config --type prebuild`: the plugins resolve. iOS gets the microphone and speech-recognition prompts, and Android gets `RECORD_AUDIO`.

## Not verified

- **Nothing has been run on a phone, simulator or emulator.** Layout, keyboard behaviour (`KeyboardAvoidingView`: `padding` on iOS, none on Android), fonts, animations and the SQLite and keychain calls have only been type-checked and bundled.
- **The native build with `expo-speech-recognition` is untested.** Its latest release (57.1.1) was built against SDK 56. If `expo run:android` fails in that module, check for a newer release.
- **The Claude calls haven't been made** (no API key was used).
- **There are no automated UI tests.** A jest-expo smoke test was attempted but not kept.

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
src/speech.ts           🔊 text-to-speech
src/ai.ts               optional Claude calls
src/theme.ts, ui.tsx    palettes, type scale, buttons, chips, tiles
src/fields.ts           cursor-aware text fields, emoji picker state
src/components/         ChatLog, Cards, Pickers, Inputs (Box, MicButton, CustomAdder), Composer, FreeWrite, Overlays
src/screens/            Journal, Settings
```
