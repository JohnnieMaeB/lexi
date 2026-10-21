# Design guidelines and design-system tokens for a premium, dyslexia-friendly Lexi UI

Research date: 19 Oct 2026. Scope: web app + React Native app, themes (orange, purple, mint, cream, night), user-adjustable font/size/letter and line spacing, chat bubbles, emoji tiles, settings, journal.

Note on method: some Apple, Material and BDA pages are JavaScript-rendered or have moved. Apple HIG content was read from Apple's JSON data endpoints for the same pages. Material numbers were read from Google's own source code (androidx Compose Material 3 tokens, Material Components Android docs). The BDA web page now returns 404 at its old URL, so its text was read from a verbatim copy hosted by Boston University (the copy includes the BDA URL and says "The Dyslexia Style Guide 2023 is available as: Dyslexia Style Guide 2023 (PDF)"). Contrast numbers marked "computed" were calculated by the researcher with the WCAG 2 relative-luminance formula and the APCA 0.0.98G constants. Black on white came out at 21:1 and Lc 106.0, and white on black at Lc −107.9, which match published APCA reference values.

## 1. British Dyslexia Association (BDA) Dyslexia Style Guide 2023: what applies to digital UI

### Takeaway
The BDA asks for sans-serif text at 16–19 px (12–14 pt), headings at least 20% larger than body text and bold, line spacing of 1.5, wider letter spacing ("ideally around 35% of the average letter width"), word spacing at least 3.5× letter spacing, dark text on a light background that is not white, plain single-colour backgrounds, left-aligned text in one column, lines of 60–70 characters, and no italics, underlining or all-caps. Bold is the only emphasis. Several of these figures go beyond WCAG, and the BDA wording on contrast sits uneasily with WCAG (see section 7).

### Cited Findings
**Fonts and size**
- "Use sans serif fonts, such as Arial and Comic Sans, as letters can appear less crowded. Alternatives include Verdana, Tahoma, Century Gothic, Trebuchet, Calibri, Open Sans." — [BDA style guide (original URL, now 404)](https://www.bdadyslexia.org.uk/advice/employers/creating-a-dyslexia-friendly-workplace/dyslexia-friendly-style-guide), verbatim copy at [Boston University](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)
- "Font size should be 12-14 point or equivalent (e.g. 1-1.2em / 16-19 px). Some dyslexic readers may request a larger font." — [BDA via BU copy](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)

**Spacing**
- Letter spacing: "Larger inter-letter / character spacing (sometimes called tracking) improves readability, ideally around 35% of the average letter width. If letter spacing is excessive it can reduce readability." — [BDA via BU copy](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)
- Word spacing: "Inter-word spacing should be at least 3.5 times the inter-letter spacing." — [same](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)
- Line spacing: "Some dyslexic people find that larger line spacing improves readability. It should be proportional to inter-word spacing; 1.5/150% is preferable." — [same](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)
- The 35% letter-spacing figure was already in the BDA's 2018 guide, so it is long-standing advice rather than new in 2023 — [Smashing Magazine, 2021](https://smashingmagazine.com/2021/11/dyslexia-friendly-mode-website)

**Emphasis and case**
- "Avoid underlining and italics as this can make the text appear to run together and cause crowding. Use bold for emphasis." — [BDA via BU copy](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)
- "Avoid using all capital letters and uppercase letters for continuous text. Lower case letters are easier to read." — [same](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)

**Headings and structure**
- "For headings, use a font size that is at least 20% larger than the normal text. If further emphasis is required, then use bold." Also: "Add extra space around headings and between paragraphs." and "Ensure hyperlinks look different from headings and normal text." — [same](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)

**Colour**
- "Use single colour backgrounds. Avoid background patterns or pictures and distracting surrounds." / "Use sufficient contrast levels between background and text." / "Use dark coloured text on a light (not white) background." — [same](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)
- "Avoid green and red/pink, as these colours are difficult for those who have colour vision deficiencies (colour blindness)." — [same](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)
- "White can appear too dazzling. Use cream or a soft pastel colour. Some dyslexic people will have their own colour preference." — [same](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)
- An older BDA wording, quoted by Dyslexia Scotland in July 2023, told designers to "avoid using contrast colours", to "Use dark (not black) text on a light (not white) background", and warned against "yellow-black, white-blue, and combination of grey". It wanted colours that are "not overly contrasted". — [Dyslexia Scotland, 25 Jul 2023](https://dyslexiascotland.org.uk/contrasting-advice-what-colours-are-best-for-accessibility/)

**Layout**
- "Left align text, without justification." / "Avoid multiple columns (as used in newspapers)." / "Write short simple sentences: 60 to 70 characters is optimal." / "Use white space to remove clutter near text and group related content." — [BDA via BU copy](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)

**Writing style**
- Use active voice, be concise, use "every day words", support text with images ("Pictograms and graphics can help to locate and support information"), use bullets and numbering rather than continuous prose, avoid double negatives, and avoid or expand abbreviations. — [same](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)
- The guide says it should be used alongside WCAG: "Consider these principles in combination with other accessibility guidance such as the Web Accessibility Content Guidelines (WCAG)." — [same](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)

**A parallel 2023 guide**
- Ako Aotearoa's July 2023 guide repeats several BDA points: sans serif (Arial, Century Gothic, Calibri, Helvetica, Verdana), 12–14 pt or larger, limit capitals, single-colour backgrounds (example: dark text on yellow), headings "at least 20% larger", line spacing 1.5, boxes and borders to highlight key information, and icons and flowcharts. — [Ako Aotearoa Dyslexia-Friendly Style Guide, Jul 2023](https://ako.ac.nz/assets/Knowledge-centre/ALNACC-Resources/Dyslexia-resources/230907-Dyslexia-Friendly-Style-Guide.pdf)

### Inferences
- The "60 to 70 characters" figure sits under Layout, so it reads as a line-length (measure) target, not sentence length. In CSS, a reading measure of about `max-width: 65ch` fits it and also stays under WCAG 1.4.8's 80-character AAA limit (section 3).
- "35% of the average letter width" is not CSS letter-spacing. An average lowercase advance in Arial-like fonts is roughly 0.5 em, which suggests a total inter-letter gap of about 0.17 em. That gap includes the font's built-in sidebearings, so the added `letter-spacing` needed is probably about 0.05–0.10 em depending on the font. A "BDA" spacing preset should therefore be tuned per font family, not set as one global em value.
- "Word spacing ≥ 3.5× letter spacing" means added word-spacing should grow with added letter-spacing, otherwise words visually merge. Tie the two together with a token formula (section 6) rather than exposing two independent sliders.
- For Lexi this means: a cream theme as the default "reading" surface; no pure #FFFFFF page backgrounds in light themes; bold (600–700) as the only emphasis; sentence case everywhere; and a user-selectable colour theme. Lexi already has themes, which matches "Some dyslexic people will have their own colour preference."

### Gaps
- The BDA 2023 PDF itself could not be opened (its URL has moved and the CDN PDF was not found). The digital-specific wording above comes from the BDA web page text, via a verbatim third-party copy. The PDF may contain extra digital guidance, such as on web forms or alt text, that is not captured here.
- The BDA gives no numeric contrast threshold and no guidance on dark mode.

## 2. W3C COGA "Making Content Usable for People with Cognitive and Learning Disabilities": patterns that apply to a chat and journaling app

### Takeaway
COGA is a W3C Working Group Note (29 April 2021), not a standard. It defines 8 objectives and about 50 design patterns. For Lexi the most relevant are: familiar and consistent design (4.2.2, 4.2.3); icons that help (4.2.7); critical features easy to find (4.3.1, 4.3.4); clear, literal, short content with white space (4.4.1–4.4.10); content that does not move unexpectedly (4.5.1); undo and avoiding data loss (4.5.2, 4.5.5, 4.5.9); clear visible labels (4.5.6); feedback (4.5.10); limiting interruptions (4.6.1); not relying on memory (4.7.x); easy-to-find help (4.8.5); reminders (4.8.7); and personalisation (4.9.x).

### Cited Findings
**Document status and structure**
- COGA is a W3C Working Group Note, *Making Content Usable for People with Cognitive and Learning Disabilities*, published 29 April 2021. It supplements WCAG 2.2 and is not a Recommendation. — [W3C COGA](https://www.w3.org/TR/coga-usable/)
- Its 8 objectives are:
  1. Help users understand what things are and how to use them
  2. Help users find what they need
  3. Use clear and understandable content
  4. Help users avoid mistakes and know how to correct them
  5. Help users focus
  6. Ensure processes do not rely on memory
  7. Provide help and support
  8. Support adaptation and personalization

  — [W3C COGA](https://www.w3.org/TR/coga-usable/)

**Patterns by objective**
- Objective 1: 4.2.1 Make the Purpose of Your Page Clear; 4.2.2 Use a Familiar Hierarchy and Design; 4.2.3 Use a Consistent Visual Design; 4.2.4 Make Each Step Clear; 4.2.5 Clearly Identify Controls and Their Use; 4.2.6 Make the Relationship Clear Between Controls and the Content They Affect; 4.2.7 Use Icons that Help the User. — [W3C COGA](https://www.w3.org/TR/coga-usable/)
- Objective 2: 4.3.1 Make it Easy to Find the Most Important Tasks and Features; 4.3.3 Use a Clear and Understandable Page Structure; 4.3.4 Make it easy to find the most important actions; 4.3.5 Break Media into Chunks; 4.3.6 Provide Search. — [W3C COGA](https://www.w3.org/TR/coga-usable/)
- Objective 3: 4.4.1 Use Clear Words; 4.4.2 Use a Simple Tense and Voice; 4.4.3 Avoid Double Negatives or Nested Clauses; 4.4.4 Use Literal Language; 4.4.5 Keep Text Succinct; 4.4.6 Use Clear, Unambiguous Formatting and Punctuation; 4.4.8 Provide Summary of Long Documents; 4.4.9 Separate Each Instruction; 4.4.10 Use White Spacing; 4.4.11 Ensure Foreground Content is not Obscured by Background. — [W3C COGA](https://www.w3.org/TR/coga-usable/)
- Objective 4: 4.5.1 Ensure Controls and Content Do Not Move Unexpectedly; 4.5.2 Let Users Go Back; 4.5.4 Design Forms to Prevent Mistakes; 4.5.5 Make it Easy to Undo Form Errors; 4.5.6 Use Clear Visible Labels; 4.5.8 Accept different input formats; 4.5.9 Avoid Data Loss and "Timeouts"; 4.5.10 Provide Feedback; 4.5.11 Help the user stay safe. — [W3C COGA](https://www.w3.org/TR/coga-usable/)
- Objective 5: 4.6.1 Limit Interruptions; 4.6.2 Make Short Critical Paths; 4.6.3 Avoid Too Much Content. — [W3C COGA](https://www.w3.org/TR/coga-usable/)
- Objective 6: 4.7.1 Provide a Login that Does Not Rely on Memory or Other Cognitive Skills; 4.7.2 Allow the User a Simple, Single Step, Login; 4.7.5 Do Not Rely on Users Calculations or Memorizing Information. — [W3C COGA](https://www.w3.org/TR/coga-usable/)
- Objective 7: 4.8.1 Provide Human Help; 4.8.3 Clearly State the Results and Disadvantages of Actions; 4.8.4 Provide Help for Forms and Non-standard Controls; 4.8.5 Make It Easy to Find Help and Give Feedback; 4.8.7 Provide Reminders. — [W3C COGA](https://www.w3.org/TR/coga-usable/)
- Objective 8: 4.9.1 Let Users Control When the Content Moves or Changes; 4.9.2 Enable APIs and Extensions; 4.9.3 Support Simplification; 4.9.4 Support a Personalized and Familiar Interface. — [W3C COGA](https://www.w3.org/TR/coga-usable/)

**Related platform guidance**
- Apple's cognitive guidance overlaps:
  - "Keep actions simple and intuitive"
  - "Minimize use of time-boxed interface elements"
  - "Prefer dismissing views with an explicit action"
  - In Assistive Access, break multistep workflows so each screen has a single interaction, and "Always ask for confirmation twice" before actions that are hard to recover from, such as deleting.

  — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

### Inferences
How the patterns map to Lexi:
- **Chat (4.2.2 familiar design, 4.5.1 no unexpected movement, 4.9.1 user controls change)**
  - Use the conventional layout: Lexi on the left, the user on the right, the composer pinned at the bottom.
  - Do not let incoming messages push the composer or the user's reading position.
  - Offer a setting to show Lexi's reply only when it is complete, instead of streaming token by token, because streaming text moves while the user reads.
  - Keep the typing indicator static or a gentle fade, not bouncing dots, when Reduce Motion is on.
- **Emoji tiles (4.2.7 icons that help, 4.4.7 symbols)**
  - Always pair each emoji with a visible text label.
  - Keep emoji meanings consistent app-wide.
- **Journal (4.5.9 no data loss, 4.5.2/4.5.5 undo, 4.5.10 feedback, 4.8.3 state consequences)**
  - Autosave drafts continuously and show a calm "Saved" status.
  - Offer undo after delete and a "Recently deleted" area rather than hard deletion.
  - Confirm destructive actions in plain words.
- **Settings (4.9.3/4.9.4 personalisation, 4.5.6 clear visible labels)**
  - Show a live preview of font, size and spacing changes.
  - Use visible labels, not placeholder-only fields.
  - Provide one-tap "Reset to Lexi default".
- **Navigation and help (4.3.1, 4.8.5, plus WCAG 3.2.6)**
  - Keep help or the "Ask a person" entry point in the same place on every screen.
- **Focus (4.6.1 limit interruptions, 4.6.3 avoid too much content)**
  - No promotional badges; one primary action per screen.
  - Reminders must be user-controlled (4.8.7).
- **Visual language (4.4.10 white spacing, 4.2.3 consistent visual design)**
  - These are COGA's direct links to design tokens: generous spacing scales, and one radius, one elevation and one icon style used consistently.

### Gaps
- Only the pattern list and summary-level guidance were extracted. The full text of each pattern (469k characters) was not read, so pattern-level examples are not quoted.
- COGA gives no numeric values (sizes, spacing), so it cannot set token values directly.

## 3. WCAG 2.2 criteria that matter, plus WCAG 3 and APCA status

### Takeaway
WCAG 2.2 has been a W3C Recommendation since 5 Oct 2023 and remains the operative baseline. The key numbers for Lexi:
- Text contrast 4.5:1 at AA and 7:1 at AAA; non-text contrast 3:1.
- Text-spacing tolerance: line-height 1.5×, paragraph spacing 2×, letter spacing 0.12×, word spacing 0.16×.
- Resize text to 200%.
- Reflow at 320 CSS px.
- Targets 24×24 CSS px at AA and 44×44 at AAA.
- Focus appearance (AAA): a 2 CSS px perimeter and 3:1 change.

Correction to the brief: 2.4.11 is Focus Not Obscured (Minimum, AA); Focus Appearance is 2.4.13 (AAA).

WCAG 3 is still a Working Draft, and its contrast algorithm is "yet to be determined". APCA was removed from the WCAG 3 draft in July 2023. APCA is still useful as a second check for tinted and dark surfaces, but colours should also pass WCAG 2.

### Cited Findings
**Status and new criteria**
- WCAG 2.2 was published 5 October 2023 as a W3C Recommendation. 4.1.1 Parsing is obsolete and was removed. — [W3C What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- New in 2.2:

  | Criterion | Level | Requirement |
  |---|---|---|
  | 2.4.11 Focus Not Obscured (Minimum) | AA | Focused item must be at least partly visible |
  | 2.4.12 Focus Not Obscured (Enhanced) | AAA | No part hidden |
  | 2.4.13 Focus Appearance | AAA | Indicator area at least a 2 CSS px thick perimeter, 3:1 contrast between focused and unfocused states |
  | 2.5.7 Dragging Movements | AA | Single-pointer alternative to dragging |
  | 2.5.8 Target Size (Minimum) | AA | At least 24×24 CSS px, or spaced so a 24 px circle around each does not overlap another target |
  | 3.2.6 Consistent Help | A | Help mechanisms in the same relative order across pages |
  | 3.3.7 Redundant Entry | A | Previously entered info auto-populated or selectable |
  | 3.3.8 Accessible Authentication (Minimum) | AA | No cognitive function test unless an alternative or assistance exists |
  | 3.3.9 Accessible Authentication (Enhanced) | AAA | |

  — [W3C What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)

**Contrast and text size**
- 1.4.3 Contrast (Minimum), AA: "at least 4.5:1", with large-scale text "at least 3:1". 1.4.6 Contrast (Enhanced), AAA: "at least 7:1", with large-scale text "at least 4.5:1". Large-scale means "at least 18 point or 14 point bold" (about 24 px, or 18.66 px bold). — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 1.4.11 Non-text Contrast, AA: UI component and graphical object visuals need "a contrast ratio of at least 3:1 against adjacent color(s)". — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 1.4.4 Resize Text, AA: text resizable "up to 200 percent without loss of content or functionality". — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

**Spacing, presentation and reflow**
- 1.4.12 Text Spacing, AA: no loss of content or function when the user sets:
  - line height to "at least 1.5 times the font size"
  - "Spacing following paragraphs to at least 2 times the font size"
  - "Letter spacing (tracking) to at least 0.12 times the font size"
  - "Word spacing to at least 0.16 times the font size"

  — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 1.4.8 Visual Presentation, AAA: a mechanism so that "Line spacing (leading) is at least space-and-a-half within paragraphs". The same criterion also requires user-selectable foreground and background colours, width no more than 80 characters, no justified text, paragraph spacing at least 1.5× line spacing, and 200% resize without horizontal scrolling. — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 1.4.10 Reflow, AA: no two-dimensional scrolling at "a width equivalent to 320 CSS pixels" (or a height of 256 CSS px for horizontally scrolling content). — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

**Motion and focus**
- 2.3.3 Animation from Interactions, AAA: "Motion animation triggered by interaction can be disabled, unless the animation is essential". — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 2.2.2 Pause, Stop, Hide, A: moving or blinking content that starts automatically, lasts more than 5 seconds and runs in parallel with other content needs a pause, stop or hide mechanism. — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- 2.4.13 Focus Appearance, AAA: the indicator "is at least as large as the area of a 2 CSS pixel thick perimeter of the unfocused component" and "has a contrast ratio of at least 3:1 between the same pixels in the focused and unfocused states." — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

**Targets**
- 2.5.5 Target Size (Enhanced), AAA: "at least 44 by 44 CSS pixels". Exceptions are Equivalent, Inline, User Agent Control and Essential. The Understanding doc recommends larger targets for controls that are used often, have irreversible results, sit near screen edges, or are part of a sequential task. — [W3C Understanding 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html)

**WCAG 3 status**
- WCAG 3 contrast: the 8 April 2026 Editor's Draft marks the contrast-ratio test "Exploratory" and says "The contrast algorithm used in WCAG 3 is yet to be determined". APCA was pulled from the July 2023 Working Draft after it lacked working-group support. Roselli expects WCAG 3 to be "years away from being done", around 2030 at the earliest. He advises that colours chosen with APCA should still meet WCAG 2, or that teams document the decision. — [Adrian Roselli, Apr 2026](https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html)
- A WCAG 3.0 Working Draft is dated 3 March 2026. The W3C charter states "WCAG 3 will not be brought to Recommendation during this charter period" (charter ran to 28 Aug 2026). WCAG 2.2 AA remains the legal baseline. (This is a secondary source; the W3C draft itself was not fetched.) — [ADA Compliance Pros](https://www.adacompliancepros.com/blog/wcag-3-draft-status-procurement)

**APCA thresholds and claims**
- APCA Lc thresholds (draft guidance):

  | Lc | Use |
  |---|---|
  | 90 | "Preferred level for fluent text and columns of body text" |
  | 75 | Minimum for body-text columns |
  | 60 | Minimum for other content text |
  | 45 | Headlines, larger or heavier text, fine pictograms |
  | 30 | "absolute minimum for any text", such as placeholder or disabled |
  | 15 | Minimum for discernible non-text, such as dividers; below this treat as "invisible" |

  Size and weight pairings: Lc 75 body needs 18 px at weight 400, 16 px at 500, or 14 px at 700. Lc 90 needs 14 px at 400 or 18 px at 300. — [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell)
- APCA argues that WCAG 2.x "overstates contrast for dark colors… WCAG 2.x contrast cannot be used for guidance designing 'dark mode'". APCA still describes itself as "the candidate contrast method for the future WCAG 3". That conflicts with W3C draft history, which removed it in 2023. — [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell); contradicted by [Roselli](https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html)
- Radix Colors builds APCA into its scales: text steps 11 and 12 "are guaranteed to reach Lc 60 and Lc 90" on step 2 of the same scale. — [Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)

**Computed checks (researcher, WCAG 2 ratio and APCA Lc)**
- Tailwind-style grey-400 #9CA3AF on white is 2.54:1, Lc 49.8, which fails AA. #A3A3A3 on #FAFAFA is 2.42:1, Lc 46.5, which fails. #6B7280 on white is 4.83:1, Lc 73.6: it passes AA but sits just under the APCA body minimum of Lc 75.
- A dark-mode muted text #B5AEA4 on #17181D is 8.06:1, which passes WCAG AAA, yet only Lc −57.8, below the APCA body minimum. Raising it to #D6D0C7 gives 11.57:1 and Lc −77.3. This shows APCA's dark-mode point in Lexi's own "night" theme.

### Inferences
- Target AA as the legal floor and AAA where it is cheap. Lexi should meet 1.4.6 (7:1) for body ink, 2.5.5 (44 px) for all touch targets, and 2.4.13 for focus. 2.3.3 (motion can be disabled) and 1.4.8 (≤80 characters, no justification, user colours, 1.5 leading) are already Lexi features, so meeting them costs little.
- 1.4.12's test values (0.12 em letter, 0.16 em word, 1.5 line height, 2 em paragraph) are the minimum amount of user spacing the layout must survive. Lexi's spacing sliders should go at least that far, and chat bubbles, emoji-tile labels and buttons must not clip or overflow at those values. That means no fixed heights on text containers and no `numberOfLines` truncation of meaningful text in React Native.
- How to use APCA on tinted surfaces: pass WCAG 2 first (required), then use APCA Lc as a perceptual second gate, especially for the night theme and for text on accent-tinted bubbles. APCA catches cases where WCAG 2 over-reports dark-mode contrast. This dual gate matches Roselli's advice and gets APCA's dark-mode benefit without leaning on a non-standard.
- The sticky composer and bottom tab bar must not fully cover a focused element (2.4.11 AA). Use `scroll-padding-bottom` equal to the composer height on web, and `KeyboardAvoidingView` plus scroll insets in React Native.
- Accessible authentication (3.3.8): passkeys, magic links or OAuth; allow paste and password managers; no CAPTCHAs that rely on transcription. Redundant entry (3.3.7): never ask again for a name or mood entered earlier in the same flow.

### Gaps
- The W3C WCAG 3 Working Draft (March 2026) was not fetched directly, and any draft after April 2026 is unknown.
- The Understanding documents for 1.4.12 and 2.4.13 were not read in full, so their specific techniques are not quoted.
- Whether WCAG 2.2 has been adopted as an ISO standard was not verified.

## 4. Apple Human Interface Guidelines and Material Design 3 / M3 Expressive

### Takeaway
Apple:
- Default control 44×44 pt (minimum 28×28 pt).
- Default body text 17 pt (minimum 11 pt), with text enlargeable to at least 200%.
- Avoid Ultralight, Thin and Light weights.
- Reduce Motion means replacing slides and zooms with fades.
- Liquid Glass belongs only on the navigation and control layer, never on content. Its appearance changes under Reduce Transparency and Increase Contrast.

Android and Material:
- Touch targets of at least 48×48 dp.
- M3 body large is 16/24 sp (a 1.5 line-height ratio).
- Shape scale 0/4/8/12/16/20/28/32/48 dp plus full.
- Springs with damping 0.9 for spatial motion and 1.0 for effects.

48 dp satisfies both platforms and WCAG 2.5.5.

### Cited Findings
**Apple: controls, text and contrast**
- Apple control sizes (default / minimum):

  | Platform | Default | Minimum |
  |---|---|---|
  | iOS / iPadOS | 44×44 pt | 28×28 pt |
  | macOS | 28×28 | 20×20 |
  | visionOS | 60×60 | 28×28 |
  | watchOS | 44×44 | 28×28 |

  "Consider spacing between controls as important as size": about 12 pt of padding around bezeled elements and about 24 pt around elements without a bezel. — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- Text must be enlargeable "at least 200 percent". The iOS default is 17 pt and the minimum 11 pt. "If you're using a custom font with a thin weight, aim for larger than the recommended sizes." — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- Apple contrast table (WCAG AA values): text up to 17 pt needs 4.5:1; 18 pt and larger, or bold, needs 3:1. Provide a higher-contrast scheme when Increase Contrast is on, and check both light and dark appearances. "Convey information with more than color alone." — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

**Apple: motion**
- Reduce Motion: reduce "automatic and repetitive animations, including zooming, scaling, and peripheral motion". Tighten springs to reduce bounce, avoid z-axis depth animation, replace x/y/z transitions with fades, and "Avoid animating into and out of blurs." — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)

**Apple: typography**
- "In general, avoid light font weights." Prefer Regular, Medium, Semibold or Bold; avoid Ultralight, Thin and Light. Use loose leading for long passages. "If you need to display three or more lines of text, avoid tight leading." Custom fonts must implement Dynamic Type behaviours, including responding to Bold Text. — [Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)
- iOS Dynamic Type at the default "Large" setting (size / leading in pt):

  | Style | Size / leading |
  |---|---|
  | Large Title | 34/41 |
  | Title 1 | 28/34 |
  | Title 2 | 22/28 |
  | Title 3 | 20/25 |
  | Headline (Semibold) | 17/22 |
  | Body | 17/22 |
  | Callout | 16/21 |
  | Subhead | 15/20 |
  | Footnote | 13/18 |
  | Caption 1 | 12/16 |
  | Caption 2 | 11/13 |

  Accessibility sizes for Body: AX1 28/34, AX2 33/40, AX3 40/48, AX4 47/56, AX5 53/62. — [Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)

**Apple: Liquid Glass and materials**
- Liquid Glass "forms a distinct functional layer for controls and navigation elements… that floats above the content layer". The rules:
  - "Don't use Liquid Glass in the content layer."
  - Apply it "sparingly" to custom controls.
  - The Regular variant "blurs and adjusts the luminosity of background content to maintain legibility" and suits text-heavy components such as alerts, sidebars and popovers.
  - The Clear variant is "highly translucent". "Only use clear Liquid Glass for components that appear over visually rich backgrounds", and "consider adding a dark dimming layer of 35% opacity" over bright content.
  - Appearance "can differ in response to… a preferred look for Liquid Glass in their device's settings, or… accessibility settings that reduce transparency or increase contrast".

  — [Apple HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- Thicker materials are "more opaque" and give "better contrast for text and other elements with fine features". Avoid quaternary label vibrancy on thin and ultraThin materials "because the contrast is too low". — [Apple HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials)

**Android and Material: targets and type**
- Android: "each interactive UI element have a focusable area, or touch target size, of at least 48dp×48dp. Larger is even better." Text smaller than 18 sp, or bold and smaller than 14 sp, needs 4.5:1; other text 3:1. — [Android Developers: Make apps more accessible](https://developer.android.com/guide/topics/ui/accessibility/apps)
- M3 type scale tokens (size / line height / tracking, in sp):

  | Role | Large | Medium | Small |
  |---|---|---|---|
  | Display | 57/64/−0.2 | 45/52/0 | 36/44/0 |
  | Headline | 32/40/0 | 28/36/0 | 24/32/0 |
  | Title (Medium weight for M and S) | 22/28/0 | 16/24/0.2 | 14/20/0.1 |
  | Body (Regular) | 16/24/0.5 | 14/20/0.2 | 12/16/0.4 |
  | Label (Medium) | 14/20/0.1 | 12/16/0.5 | 11/16/0.5 |

  M3 Expressive adds "Emphasized" variants that are one weight step heavier (for example Body Large Emphasized is Medium weight, Title Medium Emphasized is Bold). — [androidx Compose Material 3 TypeScaleTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TypeScaleTokens.kt)

**Material: shape and motion**
- M3 shape corner tokens (dp): None 0, ExtraSmall 4, Small 8, Medium 12, Large 16, LargeIncreased 20, ExtraLarge 28, ExtraLargeIncreased 32, ExtraExtraLarge 48, Full (circle). There are also "Top/Start/End" variants that round only some corners. — [androidx Compose Material 3 ShapeTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ShapeTokens.kt)
- Material spring presets:

  | Speed | Spatial (damping / stiffness) | Effects (damping / stiffness) |
  |---|---|---|
  | Fast | 0.9 / 1400 | 1 / 3800 |
  | Default | 0.9 / 700 | 1 / 1600 |
  | Slow | 0.9 / 300 | 1 / 800 |

  Fast springs suit small components, default springs partial-screen elements such as sheets, and slow springs full-screen transitions. Effects springs (colour, opacity) "should not overshoot".
- Legacy easing tokens: standard (0.2, 0, 0, 1), emphasized decelerate (0.05, 0.7, 0.1, 1), emphasized accelerate (0.3, 0, 0.8, 0.15). Duration tokens run from Short1 50 ms through ExtraLong4 1000 ms in 50 ms steps (Medium2 = 300 ms).

  — [Material Components Android: Motion](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)
- Third-party Flutter implementations of M3 Expressive describe "35 morphable shapes", spring physics and "emphasized typography". This is not Google's official spec. — [material_expressive (pub.dev)](https://pub.dev/packages/material_expressive)

### Inferences
- **Targets:** use 48 dp/pt minimum everywhere, which covers Apple 44 pt, Android 48 dp and WCAG 2.5.5's 44 px. Give emoji tiles at least 72 dp because they are the primary input. Keep at least 8 dp between adjacent targets, in line with Apple's padding guidance.
- **Body size:** Apple 17 pt, Material 16 sp, GOV.UK 19 px and BDA 16–19 px converge on about 18 px as Lexi's default body (section 5). Use the platform scaling hooks in React Native: `allowFontScaling` on, `maxFontSizeMultiplier` either unset or at least 2 for body text, and test at AX5.
- **Line height:** M3's 1.5 body ratio matches BDA and WCAG. Apple's 17/22 (1.29) is too tight for dyslexic readers, so override it with 1.5–1.6 for body.
- **Tracking:** M3's 0.5 sp on 16 sp body (about 0.03 em) is a useful "premium-but-open" default tracking. It is below the 1.4.12 test value, which the user can raise.
- **Motion:** follow M3's "standard" springs (damping ≥0.9) and avoid bouncy expressive overshoot on anything containing text. Under Reduce Motion, use effects springs or cross-fades only, per Apple.
- **Glass:** if Lexi adopts translucent material, confine it to the tab bar and top bar, use the Regular (blurred, luminosity-adjusted) style, never put it behind chat bubbles or the journal text, and fall back to an opaque surface under Reduce Transparency or Increase Contrast.

### Gaps
- Official M3 Expressive pages (m3.material.io) could not be read because they are JavaScript-rendered. The Expressive spring values (lower damping, "expressive" motion scheme) and any Expressive accessibility guidance remain unverified.
- Material's own contrast and accessibility page (m3.material.io/foundations/accessible-design) and its dynamic-colour tone-contrast rules were not retrieved.
- Apple's Color page ("Liquid Glass color") and its description of exactly what Reduce Transparency changes were not read.

## 5. Neurodiversity design guidance: Home Office posters, GOV.UK, Microsoft, NHS, Atlassian/Carbon tokens, and font research (Atkinson Hyperlegible, Lexend, dyslexia studies)

### Takeaway
The government and neurodiversity guidance agrees on a few points:
- Plain, literal language.
- Left-aligned, consistent, uncluttered layouts.
- No underline, italics or caps.
- Images that support text.
- Letting users change contrast.
- Simple rather than "bright contrasting" colours (for autistic users).
- Clear next steps, time and reassurance (for anxiety).

Research supports larger text (around 18 pt) and extra letter spacing for dyslexic readers, and warm backgrounds. It does not support any single "dyslexia font"; claims for Lexend and Atkinson Hyperlegible are mostly vendor claims.

### Cited Findings
**UK Home Office posters**
- Dyslexia poster:
  - Dos: "Use images and diagrams to support text"; "Align text to the left and keep a consistent layout"; "Consider producing materials in other formats (for example, audio or video)"; "Keep content short and simple, make clear prompts"; "Let users change the contrast between the background and text".
  - Don'ts: "Don't use large blocks of heavy text"; "Don't underline words, use italics or write in capitals"; "Don't force users to remember things from previous pages - give reminders and prompts"; "Don't rely on accurate spelling. Use autocorrect or provide suggestions"; "Don't put too much information in one place".

  — [UK Home Office accessibility posters: Dyslexia](https://ukhomeoffice.github.io/accessibility-posters/dyslexia)
- Autism poster:
  - Dos: "Use simple colours"; "Write in plain English"; "Use simple sentences and bullets"; "Make buttons descriptive"; "Build simple and consistent layouts".
  - Don'ts: "Don't use bright contrasting colours"; "Don't use figures of speech and idioms"; "Don't create a wall of text"; "Don't make buttons vague and unpredictable"; "Don't build complex and cluttered layouts".

  — [Home Office: Autism](https://ukhomeoffice.github.io/accessibility-posters/autism)
- Anxiety poster: "Give users enough time to complete an action" / "Don't rush users or set impractical time limits"; "Explain what will happen after completing a service" / "Don't leave users confused about next steps or timeframes"; "Make important information clear" / "Don't leave users uncertain about the consequences of their actions"; "Give users the support they need" / "Don't make support or help hard to access"; "Let users check their answers before they submit them". — [Home Office: Anxiety](https://ukhomeoffice.github.io/accessibility-posters/anxiety)
- Low vision poster: "Use a font with a high colour contrast and a readable font size" / "Don't use low colour contrasts and small font sizes"; "Use a combination of colour, shapes and text" / "Don't only use colour to convey meaning"; "Follow a linear, logical layout" / "Don't spread content all over a page"; "Put buttons and notifications in context" / "Don't separate actions from their context". — [Home Office: Low vision](https://ukhomeoffice.github.io/accessibility-posters/lowvision)

**GOV.UK and system tokens**
- GOV.UK type scale (large / small screens, px):

  | Point | Large screens | Small screens |
  |---|---|---|
  | 48 | 48/50 | 32/35 |
  | 36 | 36/40 | 27/30 |
  | 24 | 24/30 | 21/25 |
  | 19 (body, `govuk-body`) | 19/25 | 19/25 |
  | 16 (`govuk-body-s`) | 16/20 | 16/20 |

  Line heights are multiples of 5 px, the breakpoint is 640 px, and CSS is output "in relative units such as em or rem". — [GOV.UK Design System: Type scale](https://design-system.service.gov.uk/styles/type-scale/)
- Atlassian elevation has four levels (sunken, default, raised, overlay). The top two pair a surface token with a shadow token (`elevation.surface.raised` with `elevation.shadow.raised`, and `elevation.surface.overlay` with `elevation.shadow.overlay`). In dark mode, "elevations also rely on different surface colors" because shadows are harder to see. — [Atlassian Design: Elevation](https://atlassian.design/foundations/elevation)
- IBM Carbon layering: in light themes, layers alternate between White and Gray 10; in dark themes, "layers become one step lighter with each added layer". Tokens are role-based, for example `$layer`, `$border-subtle`, `$support-error`. — [Carbon Design System: Color](https://carbondesignsystem.com/elements/color/overview/)

**Inclusive-design method**
- Microsoft Inclusive Design principles: recognise exclusion, "solve for one, extend to many", learn from human diversity. The persona spectrum (Kat Holmes) frames disability as permanent, temporary or situational. (This is a secondary summary; the Microsoft toolkit itself was not fetched.) — [CareerFoundry on persona spectrums](https://careerfoundry.com/blog/ux-design/persona-spectrums)

**Dyslexia reading research**
- Rello & Baeza-Yates (2013), "Size matters (spacing not): 18 points for a dyslexic-friendly Wikipedia": 28 participants with dyslexia, sizes 10–26 pt, line spacings 0.8–1.8. They recommend 18 pt; line spacing showed no significant effect, and they say the result differs from prior recommendations. — [Rello & Baeza-Yates, W4A 2013](https://unpaywall.org/10.1145%2F2461121.2461125); related range 18–26 pt in [Rello et al., ASSETS 2013](https://www.changedyslexia.org/publications/pdfs/2013-ASSETS-An%20iOS%20Reader%20Dyslexia.pdf)
- Zorzi et al. (2012, PNAS 109(28):11455–9), "Extra-large letter spacing improves reading in dyslexia": extra-large letter spacing improved reading speed and accuracy in children with dyslexia (reported n = 74, ages 8–14, per a secondary summary). — [Zorzi et al. 2012](https://ccnl.psy.unipd.it/publications/publications_folder/extra-large-letter-spacing-improves-reading-in-dyslexia/view); [ScienceDaily summary](https://sciencedaily.com/releases/2012/06/120607105712.htm)
- Background colour (Rello & Bigham, ASSETS 2017): warm backgrounds (peach, orange, yellow) significantly improved reading performance over cool ones (blue, blue-grey, green), as reported in a search summary. — [Rello & Bigham 2017](https://www.changedyslexia.org/publications/pdfs/2017-ASSETS-Good%20Background%20Colors.pdf)
- An earlier W3C symposium paper found that people with dyslexia "prefer lower brightness and color differences among text and background compared to the average reader". It noted this preference had not been studied against W3C's minimum ratio. — [Rello et al., W3C 2012 text-customization symposium](https://w3.org/WAI/RD/2012/text-customization/r11)
- Dyslexia Scotland (July 2023) acknowledged the conflict between dyslexia-sector low-contrast advice (it recommends dark blue on cream, pastel or off-white) and WCAG's 4.5:1. It launched a survey; no published results were found. — [Dyslexia Scotland](https://dyslexiascotland.org.uk/contrasting-advice-what-colours-are-best-for-accessibility/)
- Dyslexia Scotland also states that evidence does not show a consistent reading advantage for specialised "dyslexia fonts", and treats size and spacing as the main levers. (Search summary.) — [Dyslexia Scotland: typed formats](https://dyslexiascotland.org.uk/dyslexia-friendly-typed-formats)

**Fonts**
- Atkinson Hyperlegible (Braille Institute) is designed for low-vision readers through "letterform distinction" rather than uniformity. For example, uppercase I, lowercase l and the numeral 1 are drawn differently. A 2024 CSUN session presented a quantitative low-vision study, but its results were not found. — [GDUSA on Braille Institute launch](https://gdusa.com/news/fresh/braille-institute-launches-typeface-for-low-vision); [CSUN 2024 session](https://www.csun.edu/cod/conference/sessions/2024/index.php/public/presentations/view/3108.html)
- Lexend (Bonnie Shaver-Troup) claims to be "empirically shown to significantly improve reading-proficiency". No independent peer-reviewed study was found. Lexend is OFL-licensed and maintained by Google Fonts. — [Lexend](https://lexend.com/)

### Inferences
- **Fonts:** offer two or three high-legibility sans families rather than a "dyslexia font" default.
  - Default: Atkinson Hyperlegible (Next), or a humanist sans with open apertures and distinct I, l and 1.
  - Option: Lexend, for users who like wider letterforms.
  - Option: the system font (SF Pro / Roboto).
  - Option: Verdana-like or OpenDyslexic, as user choice only.

  This follows the evidence (no font is proven best) and BDA ("Some dyslexic readers may request…") while keeping the app's visual identity consistent.
- **Size:** Rello's 18 pt finding, BDA's 16–19 px and GOV.UK's 19 px all support a default body of 18–19 px. Rello's "points" were probably on-screen points, which may be larger than 18 CSS px, so make 20–24 px easy to reach in settings.
- **Spacing:** Zorzi's evidence for extra letter spacing supports Lexi's letter-spacing control. Rello found no effect of line spacing, yet BDA and WCAG still require 1.5. Keep 1.5–1.6 as the default; it costs nothing.
- **Warm themes:** the background-colour study supports Lexi's cream and orange themes as the default reading surfaces. Mint and purple are cooler, so keep their canvases very light and slightly warm-shifted (for example a mint with a little yellow, a lavender with a little red).
- **Autism and anxiety posters:** "Don't use bright contrasting colours" argues against saturated accent fills behind text and multi-colour screens. Use one accent per screen, used sparingly. The anxiety guidance maps to calm confirmations, visible "what happens next" text, no countdowns, and review-before-save for shared or exported entries.

### Gaps
- NHS digital service manual design principles, Shopify Polaris tokens and the Microsoft Inclusive Design toolkit's primary pages were not fetched (tool budget), so no claims are made from them.
- The Readability Group's large font-preference study (Gareth Ford Williams and others) was not found or verified.
- Atkinson Hyperlegible Next (the newer release) features and any peer-reviewed results for Atkinson or Lexend remain unverified.

## 6. How design systems structure tokens for user-adjustable type and spacing, contrast-safe multi-theme colour, and elevation. Concrete token recommendations for Lexi

### Takeaway
Use a three-tier token model: primitive, then semantic, then component. Express type and spacing in rem/sp so that both user settings and OS text size scale everything. Define line height as a unitless multiplier derived from the user's letter and word spacing. Generate each theme's colours from a 12-step scale (the Radix model) or from target contrast ratios (the Leonardo model), and validate every text and surface pair against WCAG 2 (required) and APCA (perceptual check). Build elevation from surface-tone steps plus soft shadows, with lighter surfaces instead of shadows in dark mode (the Atlassian and Carbon models).

### Cited Findings
**Colour generation**
- Radix 12-step scale:
  - Steps 1–2: app and subtle backgrounds.
  - Steps 3–5: component backgrounds (normal, hover, pressed or selected).
  - Steps 6–8: borders (subtle non-interactive, interactive, strong/focus).
  - Steps 9–10: solid fills (9 has the highest chroma; 10 is its hover).
  - Steps 11–12: text (low and high contrast), guaranteed Lc 60 and Lc 90 on step 2.
  - Use a mutable `AppBg` alias per mode.

  — [Radix Colors: Understanding the scale](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)
- Leonardo (Adobe) generates swatches from target contrast ratios against a defined background. Themes are adjusted by a lightness value (0–100), and colours are recalculated so ratios hold. Engineers can "define the theme as a function" so users regenerate colours at runtime, for example via brightness and contrast sliders. The library `@adobe/leonardo-contrast-colors` supports LCH, OKLCH and CAM02. — [leonardocolor.io](https://leonardocolor.io/); [UX Collective, Leonardo themes](https://uxdesign.cc/creating-contrast-based-themes-with-leonardo-32b6219a090f); [LogRocket](https://blog.logrocket.com/6-javascript-tools-color-generation)

**Fluid type and zoom**
- Fluid type with `clamp()` can fail WCAG 1.4.4 when the maximum caps zoom. The fix is to combine `rem` and `vw` terms and test at 200% zoom. Utopia's `utopia-core` `calculateTypeScale()` returns `wcagViolation` viewports where a step cannot reach 200%. A font size driven only by `vw` does not grow with zoom. — [Smashing Magazine 2023](https://smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type); [utopia-core (npm)](https://npmjs.com/utopia-core); [LogRocket / dev.to](https://dev.to/logrocket/fluid-vs-responsive-typography-with-css-clamp-4j13)
- GOV.UK outputs its scale in rem/em, with line heights on a 5 px grid. — [GOV.UK Type scale](https://design-system.service.gov.uk/styles/type-scale/)

**Elevation**
- Atlassian pairs each elevation surface token with a shadow token, and relies on surface colour in dark mode. Carbon steps layers one tone lighter per level in dark themes. — [Atlassian Elevation](https://atlassian.design/foundations/elevation); [Carbon Color](https://carbondesignsystem.com/elements/color/overview/)

### Inferences
All values below are researcher recommendations derived from the cited sources. Contrast numbers were computed (WCAG 2 / APCA Lc).

#### 6a. Typography tokens (rem on web, scaled sp/pt in React Native)

**Families**
- `font.family.ui` and `font.family.reading` default to one high-legibility sans. User options: Atkinson Hyperlegible Next, Lexend, system. Keep display headings in the same family, using weight rather than a decorative face (BDA: sans; Apple: avoid light weights).

**Weights**
- `font.weight.regular` 400, `font.weight.medium` 500, `font.weight.strong` 600–700.
- No tokens below 400 exist, which removes thin and light weights from the system (Apple HIG Typography).
- Emphasis = `strong`. There is no italic token, and `text-decoration: underline` is not used for emphasis (BDA, Home Office).

**User text-size steps**
- `font.size.base` sets the root. Steps: 16 / 18 (default) / 20 / 22 / 24 / 28 px. Users can also go further through OS text size and browser zoom, up to 200% and beyond.
- In React Native, multiply by `PixelRatio.getFontScale()`, or simply keep `allowFontScaling`.
- Sources: BDA 16–19 px; Rello 18 pt; Apple ≥200%; WCAG 1.4.4.

**Semantic scale (default base 18 px; every step is a multiple of base)**

| Token | Size | Weight | Line height | Use |
|---|---|---|---|---|
| `type.caption` | 0.889 rem ≈ 16 px | 400 | 1.45 | Timestamps, helper text. Never smaller than 16 px at default (BDA lower bound). Never all caps. |
| `type.label` | 1 rem = 18 px | 500 | 1.3 | Buttons, tile labels, settings rows |
| `type.body` | 1 rem = 18 px | 400 | 1.6 | Chat bubbles, journal (BDA/WCAG ≥1.5) |
| `type.body-lg` | 1.111 rem ≈ 20 px | 400 | 1.6 | Journal reading mode |
| `type.title` | 1.222 rem ≈ 22 px | 600 | 1.3 | Section headings, ≥20% above body (BDA) |
| `type.headline` | 1.556 rem ≈ 28 px | 600 | 1.25 | Screen titles |
| `type.display` | 2 rem ≈ 36 px | 600 | 1.2 | Hero and empty states; emoji glyphs sized separately (`emoji.size.tile` 40–48 px, `emoji.size.hero` 64–80 px) |

The ratio between body and the first heading is 1.22, which meets BDA's "at least 20% larger". From there the steps run at about 1.27 each, which gives a confident hierarchy without needing many sizes.

**Reading measure**
- `measure.reading` = 65ch, clamped between 60ch and 70ch (BDA 60–70; WCAG 1.4.8 ≤80).
- `bubble.maxWidth` = min(36em, 85%), roughly 60–70 characters.
- Text is left-aligned, never justified (BDA, WCAG 1.4.8).

**Spacing-coupled line height and word spacing**

The user picks a single "Spacing" preset; the tokens derive from it.

| Preset | letter-spacing | word-spacing | line-height | Paragraph gap |
|---|---|---|---|---|
| Standard | 0.01 em | 0.03 em | 1.5 | 0.75 em |
| Relaxed | 0.05 em | 0.12 em | 1.6 | 1.0 em |
| Roomy (≥ WCAG 1.4.12 test values) | 0.12 em | 0.28 em | 1.75 | 1.5 em |
| Extra (Zorzi-style) | 0.18 em | 0.42 em | 1.9 | 2.0 em |

- The underlying rules: word-spacing ≈ 2.3–3.5× added letter-spacing, preserving BDA's word-to-letter proportion; line-height = 1.5 + 2 × letter-spacing(em), clamped to ≤2.0, so lines open up as letters spread (BDA "proportional"); paragraph gap grows with each preset.
- Components must be tested at the Roomy preset plus a 2 em paragraph gap (WCAG 1.4.12).
- The Extra preset is optional, and its values need user testing.

**Case**
- `text-transform: none` globally; sentence case for all labels (BDA, Home Office). Remove any letter-spaced uppercase "eyebrow" styles.

#### 6b. Spacing, size and target tokens

- **Spacing scale:** `space.1`–`space.10` = 4, 8, 12, 16, 20, 24, 32, 40, 48, 64.
  - Component-internal padding is in rem, so it grows with text size.
  - Screen gutters are fixed at 16 (phone) or 24 (tablet) dp.
  - Section gaps of at least 32 support white space (COGA 4.4.10, BDA).
- **Targets:**
  - `size.target.min` = 48 (Android 48 dp; covers Apple 44 pt and WCAG 2.5.5's 44 px).
  - `size.target.comfortable` = 56 for the composer, send and primary buttons.
  - `size.tile.emoji` = 72–88 square, with an 8–12 gap.
  - `space.target.gap` ≥ 8 (Apple padding guidance).

#### 6c. Shape tokens (adapted from the M3 scale)

| Token | Value | Use |
|---|---|---|
| `radius.xs` | 4 | Focus-ring offset corners, chips inside text |
| `radius.sm` | 8 | Small badges |
| `radius.md` | 12 | Inputs, settings rows |
| `radius.lg` | 16 | Buttons, if not pills |
| `radius.xl` | 20 | Cards, emoji tiles, chat bubbles |
| `radius.2xl` | 28 | Sheets, dialogs |
| `radius.3xl` | 32 | Hero cards |
| `radius.full` | — | Pills, avatars |

- Chat bubbles: 20 px with a 6 px "tail" corner on the sender side.
- Rule: one radius per component type, applied everywhere (COGA 4.2.3).
- Source scale: [M3 ShapeTokens.kt](https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/ShapeTokens.kt)

#### 6d. Elevation tokens (Atlassian model)

| Level | Light themes | Night theme |
|---|---|---|
| `elevation.sunken` | Canvas minus about 4% lightness; inputs, journal page well | Darker than canvas |
| `elevation.default` | Canvas | Canvas |
| `elevation.raised` | Surface + `shadow.raised` = `0 1px 2px rgb(ink / 6%), 0 4px 12px rgb(ink / 6%)`, plus a 1 px `border.hairline` | One tone lighter, minimal shadow |
| `elevation.overlay` | Surface + `shadow.overlay` = `0 2px 6px rgb(ink / 8%), 0 12px 32px rgb(ink / 12%)`; sheets, menus | Two tones lighter, minimal shadow |

- Use warm-tinted shadows (ink colour at low alpha), not grey #000.
- In dark mode, lighter surfaces replace shadows (Atlassian, Carbon).
- Hairlines are decorative (no 3:1 needed). Interactive boundaries such as input fields, unselected tiles and toggles use `border.strong`, which needs ≥3:1 (WCAG 1.4.11).

#### 6e. Colour tokens per theme (computed contrast; all pass WCAG AA, and ink passes AAA)

Semantic roles in every theme:
- Surfaces: `canvas`, `surface`, `surface.sunken`, `surface.raised`.
- Text: `ink` (body, target ≥7:1 and Lc ≥90), `ink.muted` (target ≥6:1 and Lc ≥75; never below 4.5:1).
- Accent: `accent` (fills), `on.accent`, `accent.ink` (links and icons, ≥4.5:1).
- Borders: `border.strong` (≥3:1), `border.hairline` (decorative).
- Status: `focus.ring`, and `success` / `warning` / `danger` each with an `on.*` pair.

Draft values, checked by the researcher's computation:

| Theme | canvas | surface | ink | ink.muted | accent / on.accent | border.strong |
|---|---|---|---|---|---|---|
| Cream (default reading) | #FBF6EC | #FFFDF8 | #1F1B16: 15.9:1, Lc 98.9 on canvas | #5C5349: 7.0:1, Lc 81.0 on canvas; 6.4:1, Lc 74.7 on sunken #F3EBDC | #9A4A12 / #FFFDF8: 6.1:1, Lc 84.5; accent as link on canvas 5.8:1 | #8C8172: 3.8:1 |
| Orange | #FFF3E8 | #FFFAF5 | #2B1B10: 15.2:1, Lc 97.4 | #6A4630: 7.6:1, Lc 82.5 | #B4470A / #FFFAF5: 5.3:1, Lc 78.9; as link 5.0:1 | #9A7559: 4.0:1 |
| Purple | #F6F2FB | #FCFAFF | #221A30: 15.1:1, Lc 96.7 | #574A6E: 7.3:1, Lc 81.0 | #6B3FC0 / #FCFAFF: 6.5:1, Lc 85.0; as link 6.1:1 | #857A99: 3.9:1 |
| Mint | #EEF7F2 | #FAFDFB | #13261E: 14.5:1, Lc 96.7 | #3F5A4E: 6.9:1, Lc 80.1 | #1C6E52 / #FAFDFB: 6.0:1, Lc 83.8; as link 5.7:1 | #6F8A7E: 3.7:1 |
| Night | #17181D | #1F2027 (raised #272932) | #ECE7DF: 14.4:1, Lc −91.5; 11.8:1, Lc −88.9 on raised | #D6D0C7: 11.6:1, Lc −77.3. The first draft #B5AEA4 was 8.1:1 but only Lc −57.8, so it was rejected | #F2A65A / #1E1408: 9.0:1, Lc 63.6, so use only for bold labels or large text. For accent text on night use #F6B97A: 10.3:1, Lc −70.4 | #7C7A82: 3.8:1 |

- No light theme uses #FFFFFF as the page background, and no theme uses #000000 ink (BDA "dark (not black) text on a light (not white) background"). Contrast still sits at 14–16:1, well above WCAG AAA. This is how Lexi can satisfy both BDA and WCAG.
- Muted text on `surface.sunken` hovers around Lc 75. Either keep muted text off sunken wells or darken it one step there.
- Generate the full 12-step ramps per hue with Radix-style roles, or with Leonardo using target ratios [1.05, 1.15, 1.3, 1.5, 3, 4.5, 7, 12] against canvas. Re-verify each pair in CI with both WCAG 2 and APCA.
- Add a "Higher contrast" toggle per theme that swaps `ink.muted` to `ink` and `border.strong` to about 4.5:1. Map it to iOS Increase Contrast, Android high-contrast text, and web `prefers-contrast: more` (Apple HIG; Home Office: "Let users change the contrast").
- Status colours must never be the only signal: pair them with an icon and text (Apple; Home Office low vision). Avoid red/green pairs (BDA): use danger red-orange plus a warning icon, and success teal or blue plus a check.

#### 6f. Motion tokens

| Token | Value | Use |
|---|---|---|
| `motion.duration.fast` | 150 ms | Press and hover state changes |
| `motion.duration.base` | 250 ms | Bubble appear, tile select |
| `motion.duration.slow` | 350 ms | Sheets |
| `motion.duration.page` | 400 ms | Screen transitions |
| `motion.easing.standard` | cubic-bezier(0.2, 0, 0, 1) | Default |
| `motion.easing.enter` | cubic-bezier(0.05, 0.7, 0.1, 1) | Entering |
| `motion.easing.exit` | cubic-bezier(0.3, 0, 0.8, 0.15) | Exiting |
| `motion.spring.spatial` | damping 0.9, stiffness 700 (fast: 1400) | Movement |
| `motion.spring.effects` | damping 1.0, stiffness 1600 | Colour and opacity; no overshoot |

Easing and spring values come from Material Components Android (Motion).

- No damping below 0.9 on anything containing text.
- Under `prefers-reduced-motion` or iOS Reduce Motion or Android "Remove animations": all spatial transitions become opacity fades of ≤150 ms or none. No blur-in or blur-out, no parallax, no shimmer skeletons; use static placeholders instead. This follows Apple HIG and meets WCAG 2.3.3 AAA.
- Lexi should also offer an in-app "Calm motion" toggle, so web users without the OS setting can opt out.
- Nothing auto-animates longer than 5 s without a pause control (WCAG 2.2.2).

#### 6g. Focus tokens

- `focus.ring.width` = 3 px (≥2 px per WCAG 2.4.13); `focus.ring.offset` = 2 px.
- `focus.ring.color` = `ink`, or a dedicated `focus` colour at ≥3:1 against both the component and the canvas.
- On web, show it on `:focus-visible`. On React Native, use the platform focus for keyboard and switch users.
- Never let the sticky composer cover focus (WCAG 2.4.11).

### Gaps
- Material's HCT "tone" contrast rule (tone differences that guarantee 3:1 or 4.5:1) was not retrieved, so it is not stated.
- Browser support for CSS `prefers-reduced-transparency` was not verified.
- Recommended values for the Extra spacing preset, and the word-to-letter spacing multiplier, are inferences from BDA and Zorzi; they need testing with dyslexic users.
- Shadow values are researcher proposals; none of the cited systems publish numeric shadow values on the pages retrieved.

## 7. Conflicts between "premium" trends and the guidelines, and each guideline's stance

### Takeaway
Most "premium" shortcuts (thin weights, light grey text, pastel-on-pastel, glass behind text, tiny captions, letter-spaced all-caps, justified editorial layouts, parallax and bouncy motion) are explicitly discouraged by Apple, BDA, the Home Office posters, WCAG or APCA. A sophisticated look can instead come from restraint, consistent rhythm, warm off-white surfaces, high-quality sans type at 400 and 600, soft layered elevation, one accent per screen, and calm, no-overshoot motion. The real unresolved conflict is high versus low contrast. BDA and Dyslexia Scotland favour softer pairings; WCAG requires at least 4.5:1. Off-white and off-black pairings around 14–16:1 satisfy both.

### Cited Findings
**Typography trends**
- Thin and light weights: Apple says "In general, avoid light font weights" (Ultralight, Thin, Light), and thin custom fonts need larger sizes. — [Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography); [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility). APCA also ties weight to required size: Lc 75 body needs 24 px at weight 300 but 18 px at weight 400. — [APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell)
- Tiny captions: the Home Office says "Don't use low colour contrasts and small font sizes". — [Home Office: Low vision](https://ukhomeoffice.github.io/accessibility-posters/lowvision). The BDA minimum is 12–14 pt / 16–19 px. — [BDA via BU copy](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx). Apple's absolute minimum is 11 pt. — [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility)
- All-caps labels, italics, underline: BDA says avoid all capitals, underlining and italics. — [BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx). The Home Office dyslexia poster says "Don't underline words, use italics or write in capitals". — [Home Office: Dyslexia](https://ukhomeoffice.github.io/accessibility-posters/dyslexia)
- Justified, multi-column editorial layouts: BDA says left-align without justification and avoid multiple columns. — [BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx). WCAG 1.4.8 (AAA) says text is not justified and width is ≤80 characters. — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- Placeholder-only inputs and icon-only buttons: COGA 4.5.6 "Use Clear Visible Labels" and 4.2.5 "Clearly Identify Controls". — [COGA](https://www.w3.org/TR/coga-usable/). The autism poster says "Don't make buttons vague and unpredictable". — [Home Office: Autism](https://ukhomeoffice.github.io/accessibility-posters/autism)

**Colour trends**
- Light grey text: WCAG 1.4.3 AA requires 4.5:1. Computed: #9CA3AF on white = 2.54:1, which fails. — [WCAG 2.2](https://www.w3.org/TR/WCAG22/). APCA treats Lc 30 as the floor even for placeholder or disabled text, and Lc 75 for body. — [APCA](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell)
- Low-contrast pastels: BDA calls for "sufficient contrast" but also pastel backgrounds and no pure white. — [BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx). The autism poster says "Don't use bright contrasting colours". — [Home Office: Autism](https://ukhomeoffice.github.io/accessibility-posters/autism). Pastels are fine as surfaces but not as text colours.
- High contrast versus dyslexia-sector advice: Dyslexia Scotland flags the conflict and leaves it unresolved; older BDA wording says "avoid using contrast colours". — [Dyslexia Scotland](https://dyslexiascotland.org.uk/contrasting-advice-what-colours-are-best-for-accessibility/). Research found that dyslexic readers prefer lower brightness and colour differences. — [Rello et al. 2012](https://w3.org/WAI/RD/2012/text-customization/r11). WCAG still requires at least 4.5:1. — [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

**Material and motion trends**
- Glass and blur: "Don't use Liquid Glass in the content layer". Use Regular, not Clear, glass when there is text. Appearance adapts to Reduce Transparency and Increase Contrast. — [Apple HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials). COGA 4.4.11: "Ensure Foreground Content is not Obscured by Background". — [COGA](https://www.w3.org/TR/coga-usable/). BDA: avoid "background patterns or pictures and distracting surrounds". — [BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)
- Bouncy, expressive motion and parallax: Apple says tighten springs to reduce bounce, avoid z-axis animation and blur transitions, and use fades under Reduce Motion. — [Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility). Material: effects should not overshoot. — [MDC Motion](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md). WCAG 2.3.3 (AAA): interaction-triggered motion can be disabled. — [WCAG 2.2](https://www.w3.org/TR/WCAG22/). COGA 4.5.1: content should not move unexpectedly. — [COGA](https://www.w3.org/TR/coga-usable/)
- Colour-only states (for example a selected tile shown only by tint): Apple says "Convey information with more than color alone", and the Home Office says "Don't only use colour to convey meaning". — [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility); [Home Office: Low vision](https://ukhomeoffice.github.io/accessibility-posters/lowvision)

### Inferences
**Premium-compatible replacements**
- Instead of thin type, use 400 body and 600 headings with slightly negative tracking only at display sizes (−0.01 em at 36 px and above). Elegance comes from size contrast, not weight thinness.
- Instead of light grey secondary text, use a warm `ink.muted` at ≥6:1 or Lc ≥75, and create hierarchy with size, weight and space rather than paleness.
- Instead of glass behind content, use an opaque `surface.raised` with a hairline and a soft warm shadow. If any translucency is used, limit it to the top and tab bars with heavy blur, an opaque fallback, and ink at full contrast.
- Instead of letter-spaced all-caps eyebrows, use sentence-case `type.label` in `accent.ink`, optionally with a small emoji or icon.
- Instead of tiny metadata, use 16 px captions, and fewer of them (timestamps grouped per day rather than per bubble).
- Instead of bouncy motion, use one consistent 250 ms standard ease or a damping-0.9 spring, with fade-only under reduced motion.
- Instead of colour-only selection, selected emoji tiles get a 3 px `border.strong` or accent ring, a check badge and a tinted fill.

**Why the original felt "low budget"**
- The likely causes are generic, not dyslexia-specific: inconsistent radii, shadows and spacing; too many saturated colours; default system controls mixed with custom ones; uneven type sizes. A strict token set fixes these without touching any accessibility guarantee. This is an inference; Lexi's current UI was not inspected.

**Settling the contrast conflict**
- Default to off-white canvases and off-black ink (about 14–16:1), which is high enough for WCAG AAA and low-vision users and avoids BDA's "dazzling white".
- Let users pick softer themes, but never ship a theme whose body text falls below 7:1 (or below Lc 90 in light themes, or Lc 75 in dark mode).
- This honours BDA's personal-preference principle and the Home Office "Let users change the contrast" advice without failing WCAG.

### Gaps
- No primary source quantifies how much contrast dyslexic readers prefer in WCAG terms. The Dyslexia Scotland survey results were not found.
- There is no guideline-level stance on gradients or noise textures. BDA's "single colour backgrounds" implies avoiding them behind text.
- Whether the owner's "low budget" perception comes from these specific issues is unverified, because Lexi's current UI was not inspected in this research.
