# Lexi

Lexi is an emoji-first journaling chatbot for dyslexic people. It's built from the Miro board **"Lexi – My Dyslexic Journal"**.

Lexi talks in short bubbles and leans on emoji. It guides you through a check-in, and your journal stays private. There's no "Happy" button on purpose: the goal is *content*, not toxic positivity.

| Folder | What it is |
|---|---|
| [`web/`](web/) | `lexi.html`, a single-file web app published as a claude.ai artifact. The journal is private to each person, and Lexi's chat runs on Claude through the artifact runtime. |
| [`lexi-native/`](lexi-native/) | A React Native / Expo port that adds 🎙 voice typing. See its [README](lexi-native/README.md) to run it. |

## Design source

All copy, flows and colors come from the Miro board:
- **Chat Bot Plan:** the onboarding script.
- **App Plan → Guided Categories:** the mood bands and the nine topics.
- **Screens 11–15:** layout and themes.
- **Theme:** the Material palette seeded at `#E38100`.
- **Board comments:** Verdana, wider line spacing, any emoji at any time, custom descriptors, and an invert/dark mode.
