# Quiet the Chrome, Keep the Big Type

Lexi looks "low budget" because of its frame, not its dyslexia support, and most of the fix is subtraction. Every screen today sits inside a 48 px top bar, 14 px side rails and a 91 px dock filled with saturated orange, purple or mint, around a #E6E6E6 canvas inherited from the wireframes. Inside that frame, mint bubbles, purple buttons, nine different corner radii and about a dozen shadow recipes compete for attention, labels shrink to 11–15 px bold next to 44 px emoji, and a robot emoji stands in for a brand. The award-winning wellness apps do the opposite. They carry one signature idea everywhere, use warm off-white surfaces, spend one accent on one primary action, keep shape consistent, and move slowly and with purpose. That recipe fits the dyslexia evidence well. Warm tints read faster than grey or cool backgrounds for dyslexic and typical readers alike (14.85 s per passage on peach against 18.05 s on grey). Text size matters more than line spacing, italics slow reading, and coloured overlays work no better than placebo. Stigma research adds urgency: assistive tools with "large fonts and bright backgrounds" are the ones people are embarrassed to use. So Lexi should keep its large type and lose its bright surround. The fashionable "premium" moves that would hurt are already ruled out by Apple, WCAG, the British Dyslexia Association (BDA) or trial evidence: glass behind text, light font weights, pale grey text, spaced-out capitals, bouncy motion and human-like avatars. The plan below has nine parts:

- Make a warm Cream canvas the default.
- Soften Lexi's bubbles.
- Make the dock neutral.
- Set a 16 px minimum text size with three font weights.
- Use one set of corner radii and shadows everywhere.
- Turn Lexi's butterfly into a calm, four-state "presence".
- Show AI replies one whole sentence at a time.
- Make the chat mic wait for people who pause.
- Ship one token set to both apps, with every colour pair checked against WCAG 2 and APCA.

No study tests premium aesthetics with dyslexic adults, so the redesign should ship behind a switch and be judged with Lexi's own users.

## A loud frame, not dyslexia support, makes Lexi look low budget

Lexi's foundations are the parts a premium app would copy. Body text defaults to 18 px Verdana with a 1.7 line height. Bubbles hold one to three short sentences, emoji always carry a word, and every message can be read aloud. The "Do next" and "Soon" feature work added spacing presets, a Help pill, an AI label, check-in steps and a Cream look. None of that needs to change. The low-budget impression comes from the layer around it. Most of it traces back to one rule in `docs/DESIGN.md`: an accent-coloured top bar, side rails and dock framing a #E6E6E6 canvas ("Light themes use #E6E6E6, not white or cream"). The Miro board used that grey as placeholder fill, and the build kept it.

| Signal | Lexi today (`web/lexi.html`, `lexi-native/src/theme.ts`) | Why it reads as low budget |
|---|---|---|
| Saturated frame | 48 px top bar, 14 px rails and 91 px dock filled with #E38100, #8100E3 or #79EAB9 | A bright surround on every screen is the "special tool" look the stigma research describes. Dock labels on orange reach only APCA Lc 49 at 13 px. |
| Wireframe canvas | Neutral grey #E6E6E6 | Looks unfinished. In Rello & Bigham's study, grey was read 21% slower than peach. |
| Three loud hues at once | Orange chrome, mint Lexi bubbles, and purple Yes pills, rings and selected tiles. The mood bands use the same three colours at full strength. | A high-chroma triad competes for attention. Premium apps use one accent per screen. |
| Bubble fills | Saturated mint behind Lexi's words. Night uses orange text on #1A1A1A, and Ember uses a bright #FFB877 bubble on a dark canvas. | Saturated or cool reading surfaces. Night's message text scores 6.1:1 but only APCA Lc −46.6. |
| Type | Verdana Bold on most labels. Tile labels are 13 px (11 px for words over eight letters), tabs 13 px, journal weekdays 11 px with extra letter spacing, the AI note 14 px. Card titles are the same size as body text. | Tiny bold labels next to huge emoji look unrefined and fall below the BDA's 16 px minimum. When everything is bold, bold no longer adds emphasis. |
| Shape and depth | Nine radii (6, 12, 14, 18, 20, 22, 28 and 30 px, plus fully round). About a dozen shadow recipes. Tiles sit on a 3 px "ledge" shadow. | Inconsistent rhythm is the most common generic cause of a cheap look. |
| Edges and targets | Inputs and chips are outlined in #D2D2D2 (1.5:1). The white composer pill sits on orange at 2.8:1. The speaker button is 34 px. | Below WCAG's 3:1 for component boundaries and below the 44–48 px platform targets. |
| Icons | Operating-system emoji are used for send, mic, speaker, back and the tab bar. | They render differently on every platform. Emoji used for buttons compete with emoji used for feelings. |
| Motion | Typing dots bounce forever, celebration rows hop with an overshoot, and bubbles pop in with a scale effect. | Bounce reads as childish and costs attention. |
| Identity | The robot emoji is both brand and avatar, and the default user avatar is a girl emoji. The butterfly appears only in Ember, as a picture behind the chat. | There is no signature idea, and the child default signals a children's product. A picture behind text goes against BDA guidance. |
| Copy | The Look section of Settings says "The themes from the Lexi wireframes." | Internal language is visible to users. |

The owner's instinct is supported by research on assistive technology, not just by taste. In interviews with 20 people with disabilities, particular devices marked their users as disabled, though the practical benefit usually outweighed the self-consciousness ([Shinohara & Wobbrock 2011](https://faculty.washington.edu/wobbrock/pubs/chi-11.03.pdf)). A systematic review of assistive tools for children with dyslexia names the look precisely: tools with **large fonts and bright backgrounds can draw social stigma and discourage use** ([arXiv 2412.13241](https://arxiv.org/pdf/2412.13241)). The cost is that people stop using the tool. In a classic survey, about 29% of assistive devices were abandoned, and one predictor was that users' opinions were not considered when the device was chosen ([Phillips & Zhao 1993](https://doi.org/10.1080/10400435.1993.10132205)). Lexi's large type is backed by evidence and must stay, so the bright surround is what has to go. The polish should also remove friction rather than add decoration. In an ATM experiment, perceived beauty shaped usability judgements even after people had used the machine ([Tractinsky et al. 2000](https://academic.oup.com/iwc/article-abstract/13/2/127/898608)). A later study that varied beauty and usability independently found the opposite direction: poor usability lowered perceived beauty, while beauty did not raise perceived usability ([Tuch et al. 2012, via InfoQ](https://www.infoq.com/news/2012/05/Aesthetics-Usability)). Because the direction of cause is disputed, the safest polish is the kind that also simplifies.

Lexi does not have a contrast crisis. Ink on the light canvas is 16.8:1, well beyond WCAG AAA. The weak spots are at the edges, and APCA, the perceptual contrast model drafted for WCAG 3, exposes them better than the WCAG 2 ratio does. The figures below were computed for this report:

- Night's orange message text on #1A1A1A passes WCAG AA at 6.1:1 but scores APCA Lc −46.6, a level APCA reserves for headlines, not reading text.
- The dock labels on orange are 6.6:1 but only Lc 49 at 13 px.
- Ember's bubble text reaches Lc 66.8, below APCA's Lc 75 minimum for body text ([APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell)).
- Input and chip outlines in #D2D2D2 reach 1.5:1 against white, and the composer pill sits on the orange dock at 2.8:1. Both fall below the 3:1 that WCAG 1.4.11 requires for component boundaries ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)).
- The speaker button on every bubble is arguably Lexi's most important control, yet it is 34 px, under Apple's 44 pt default and Android's 48 dp minimum ([Apple HIG](https://developer.apple.com/design/human-interface-guidelines/accessibility); [Android Developers](https://developer.android.com/guide/topics/ui/accessibility/apps)).

## Warm paper, dark ink and one accent fit both the research and the polish

### Warm tints help every reader, white was never tested, and overlays fail

The only large study of screen backgrounds and dyslexia supports a warm canvas and counts against Lexi's grey. Rello and Bigham tested ten background colours with 341 people, 89 of them dyslexic, always with black text. **Peach, orange and yellow gave the fastest reading. Neutral grey took 21% longer than peach (18.05 s against 14.85 s), blue 30% longer and blue-grey 45% longer** ([Rello & Bigham 2017](https://www.changedyslexia.org/publications/pdfs/2017-ASSETS-Good%20Background%20Colors.pdf)). Readers without dyslexia ranked the colours almost identically (rho = 0.964), so the effect is not specific to dyslexia. That helps Lexi's positioning: a warm canvas is universal design, not a "special" setting. Three caveats limit the claim. White and off-white were never tested. Every tested pair had contrast between 7.5:1 and 19.4:1. And the authors measured speed, not preference, writing that their results "do not necessarily mean that warm colors are recommended". Lexi's #E6E6E6 is lighter than the study's grey but neutral rather than warm. A 2026 conference poster found that readers with dyslexia consistently preferred cream backgrounds, though only one measure was significant ([Open University of Israel 2026](https://www.openu.ac.il/chais_2026/244/)). The pale creams that premium apps use are lighter than Rello's peach, so moving to them is consistent with the evidence and low-risk, but not proven.

Dyslexia guidance and WCAG seem to clash on contrast, but the clash disappears in practice. The BDA asks for "dark coloured text on a light (not white) background" and warns that "white can appear too dazzling" ([BDA style guide](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)). An older BDA wording told designers to "avoid using contrast colours". Dyslexia Scotland has acknowledged the tension with WCAG's 4.5:1 minimum without resolving it ([Dyslexia Scotland 2023](https://dyslexiascotland.org.uk/contrasting-advice-what-colours-are-best-for-accessibility/)). An earlier Rello study found that dyslexic readers preferred smaller brightness and colour differences between text and background than typical readers ([Rello et al. 2012](https://w3.org/WAI/RD/2012/text-customization/r11)). **Off-white canvases with off-black ink at 13–18:1 satisfy both sides.** They avoid pure white and pure black, yet sit far above WCAG AAA. Pastels belong on surfaces, never in text.

Coloured overlays are not a reason to keep many tinted looks. Systematic reviews find overlay effects "generally small and/or similar to placebo", and most of the studies were at high or uncertain risk of bias ([Griffiths et al. 2016](https://eprints.whiterose.ac.uk/104441/)). Three of four reviews found the evidence insufficient ([Suttle et al. 2018](https://city-test.eprints-hosting.org/id/eprint/19242/1/Efficacy%20of%20Coloured%20Overlays%20and%20Lenses%20for%20the%20Treatment%20of%20Reading%20Difficulty.pdf)). Lexi's looks should be presented as comfort choices, which also keeps clinical claims out of the copy.

Dark mode has no dyslexia data at all. In the general population, dark text on a light background is read faster and more accurately than the reverse, especially at small sizes ([Piepenbrock et al.](https://documentacion.fundacionmapfre.org/documentacion/publico/es/bib/150136.do)). That supports a light default, with dark looks as options. For those dark looks, Material's long-standing advice is a dark grey such as #121212 and text at about 87% white, rather than pure black and white ([Material Design](https://m2.material.io/design/color/dark-theme.html)). Lexi's Night look uses #020000 behind #F4F4F4. APCA adds a specific warning: its authors argue that WCAG 2 "overstates contrast for dark colors" ([APCA in a Nutshell](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell)). Night's secondary text #B8B8B8 shows the problem: 10.6:1 by WCAG 2, yet only Lc −64 by APCA. Colour must also never carry meaning on its own ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)). Lexi's journal breaks this rule today: the bar under each day card shows mood bands by colour only, with a separate legend.

### Size, weight and space carry hierarchy; thin strokes and capitals do not

Text size is the typographic variable with the clearest effect. In an eye-tracking study of 28 dyslexic readers, **font size changed readability and comprehension while line spacing did not, and the authors recommended 18 points** ([Rello et al. 2013](https://unpaywall.org/10.1145%2F2461121.2461125)). A 92-person follow-up found that larger text and wider character spacing both sped up dyslexic and non-dyslexic readers ([Rello & Baeza-Yates 2017](https://repositori.upf.edu/items/e0ca6f40-a0fa-490f-9d03-53d043270deb)). Guidance clusters just below that size. The BDA asks for 16–19 px ([BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)), GOV.UK sets body text at 19 px ([GOV.UK type scale](https://design-system.service.gov.uk/styles/type-scale/)), and Apple's default body size is 17 pt ([Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)). Lexi's 18 px default fits. Its smallest text does not: labels at 11–15 px fall below the BDA range. A single 16 px minimum fixes both the guidance gap and the visual clash of tiny type next to large emoji. The BDA also asks for headings at least 20% larger than body text. Lexi's card and settings titles are 1.0–1.02 times body size, so they miss that rule.

The rules on text style have unusually firm support. Arial Italic was the slowest font in Rello's comparison, at 123% of Arial's reading time ([Rello & Baeza-Yates 2013](https://www.changedyslexia.org/publications/pdfs/2013-ASSETS-Good%20Fonts%20for%20Dyslexia.pdf)). The BDA advises against italics, underlining and capitals in running text, with bold as the only emphasis ([BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)). The "Do next" work already removed italics, capitals and underlines. The remaining problem is the opposite of thin type. Verdana Bold sits on almost every label, button, tab, stat and caption, so bold no longer marks anything. Apple advises against the Ultralight, Thin and Light weights ([Apple HIG Typography](https://developer.apple.com/design/human-interface-guidelines/typography)). APCA ties weight to required size: body text at Lc 75 needs 18 px at weight 400 but 24 px at weight 300 ([APCA](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell)). The premium answer is in the middle: regular (400) for reading, medium (500) for labels and semibold (600) for headings. Lexend, already Lexi's heading font, has a 500 weight. Verdana does not, which is an argument for Lexend on labels and Verdana for reading.

Font choice should not be oversold. OpenDyslexic and Dyslexie gave no reading benefit in controlled studies ([Wery & Diliberto 2017](https://doi.org/10.1007/s11881-016-0127-1); [Kuster et al. 2018](https://doi.org/10.1007/s11881-017-0154-6)). Lexend and Atkinson Hyperlegible have no peer-reviewed dyslexia trials ([Lexend](https://lexend.com/)). Verdana was the font dyslexic readers preferred in Rello's study, so it stays the default reading font where it is available. It is not available on Android: the native app already falls back to Atkinson Hyperlegible there, so the two platforms already show different fonts. Atkinson Hyperlegible Next, released in 2025 with seven weights ([Ophthalmology Management](https://ophthalmologymanagement.com/news/2025/applied-design-and-braille-institute-partner-to-launch-typeface-for-making-reading-easier/)), is the strongest candidate for a single font on every platform and is worth testing against Verdana.

### Spacing is a setting because the same gap helps one reader and slows another

Short lines and wide spacing help some dyslexic readers a great deal and others not at all. On a small handheld screen, short lines **cut backward eye movements by more than half without hurting comprehension** ([Schneps et al. 2013](https://doaj.org/article/497468bb821f4887ae8f17e195b471f9)). In a 103-student follow-up, though, the gains appeared only in subgroups, such as students with a limited visual attention span ([Smithsonian](https://dashboard.si.edu/newsdesk/releases/smithsonian-experts-find-e-readers-can-make-reading-easier-those-dyslexia)). Extra-large letter spacing roughly halved reading errors in dyslexic children ([Zorzi et al. 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3396535)). A later study found the benefit was not explained by sensitivity to visual crowding, and that **wider spacing slowed fast readers** ([Korinth et al. 2020](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7090332/)). Lexi already handles this well, with Normal, Roomy and Extra roomy presets and narrow bubbles, so the evidence changes tuning rather than features. WCAG 1.4.12 requires layouts to keep working when users apply 0.12 em letter spacing and 0.16 em word spacing ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)). Today three components ignore the user's choice:

- tile labels hard-code zero letter and word spacing
- the AI note hard-codes the Normal values
- the Yes/No labels set their own letter spacing

Those overrides exist to stop long words overflowing narrow tiles. The right fix is wider tiles that wrap labels between words. The crowding research is about letters and words, but the same logic argues for gaps of at least 8–12 px between tiles and their labels. That is an extrapolation, not a tested rule.

### Motion and clutter cost attention many users do not have

Attention is a real constraint for Lexi's audience. In a community sample of 494 twins with reading disability and 373 without, those with reading disability were significantly more likely to meet ADHD criteria, especially for inattention ([Willcutt & Pennington 2000](https://vivo.colorado.edu/display/pubid_52783)). Adults with dyslexia also show weaker working memory ([Smith-Spark & Fisk 2007](https://doi.org/10.1080/09658210601043384)). The standards respond to this:

- WCAG requires a pause control for anything that moves on its own for more than five seconds, and at level AAA lets users turn off motion triggered by interaction ([WCAG 2.2](https://www.w3.org/TR/WCAG22/)).
- Apple asks that Reduce Motion replace slides and zooms with fades and tighten springs to reduce bounce ([Apple HIG Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility)).
- Nielsen Norman Group (NN/g) puts most interface animation between 100 and 500 ms ([NN/g](https://www.nngroup.com/articles/animation-duration/)).

Lexi honours Reduce Motion, but its default motion is the bouncy kind. The W3C's guidance for people with cognitive and learning disabilities (COGA) includes the patterns "Ensure Controls and Content Do Not Move Unexpectedly", "Limit Interruptions" and "Avoid Too Much Content" ([W3C COGA](https://www.w3.org/TR/coga-usable/)). These point to the same fixes as premium calm: shorter, eased, purposeful motion, fewer things per screen, and one primary action. Minimal should mean fewer things, not fewer cues. Icon-only buttons and hidden labels conflict with COGA's "Use Clear Visible Labels".

## Premium wellness apps win with one idea, applied with restraint

The polish that award juries and reviewers praise comes from consistency more than decoration. How We Feel, a 2024 Apple Design Award finalist, builds everything on one rule from its designer: "Sharp, jagged edges for high-energy, stormy emotions and soft, smooth curves for moments of calm and serenity" ([How We Feel](https://howwefeel.substack.com/p/we-feelgrateful)). A reviewer praised it because "all assets are of high quality", while noting that "the beautiful visualisation wasn't enough for me to spot patterns" ([Problem2Product](https://problem2product.substack.com/p/does-how-we-feel-solve-a-problem)). Headspace's 2024 rebrand added a custom typeface designed to "flex from playful to clinical". It gave its faces stress and sadness, not only joy, kept its breath-driven animations, and aimed for a "more professional persona" ([It's Nice That](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)). Gentler Streak won its 2024 Apple Design Award for a "subtle and consistently pleasing design language", with progress framed without "hard comparisons" ([Apple Design Awards 2024](https://developer.apple.com/design/awards/2024/)). Opal simplified a home screen that users found "too complex and hard to read" down to a plain bar chart, and its team wrote that "guilt-tripping or scary screen time stats are counter productive" ([Opal](https://opal.so/blog/introducing-the-new-opal-home-screen-track-your-screen-time-and-improve-your-focus); [Opal blog](https://opalapp.com/blog/designing-for-wellbeing)).

Critics punish the opposite habits. Finch's home screen mixes the checklist with shops, journeys, community and "frequent premium prompts". Its journaling sometimes plays no animation, "leaving users unsure whether their input was saved" ([Pratt IXD on Finch](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/)). Day One is called "sleek, responsive, and intuitive", but its Today page carries too much text ([Pratt IXD on Day One](https://ixd.prattsi.org/2026/09/design-critique-day-one-iphone-app/)). Ahead's dashboard gives completed and new lessons equal visual weight ([Screensdesign](https://screensdesign.com/showcase/ahead-emotions-coach)). The common cheap signals are clutter, elements of equal weight competing with each other, and missing feedback, not a lack of effects.

Bright colour is not banned, and the best case for it deserves a hearing. Headspace chose deliberately bright colours to stand out from the "dreary sea of blues and greys" in mental healthcare, and checked its combinations for accessibility ([It's Nice That](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)). Google's research for Material 3 Expressive ran 46 studies with more than 18,000 participants. **Larger, higher-contrast, clearly bounded controls were found up to 4 times faster, and users aged 45 and over were as fast as younger users.** The same research found that "a strong minority preferred calmer, less intense designs" and that removing labels hurt usability ([Google Design](https://design.google/library/expressive-material-design-google-research)). Put together: colour belongs in content and in the one primary control, not in the surround. Lexi's emoji already supply plenty of colour. Calm sits at the other pole. Unofficial breakdowns of its website describe a dark-first navy system with slowly animated twilight gradients and star-field dots, but also small uppercase labels with wide letter spacing ([webdesignhot, unofficial](https://www.webdesignhot.com/design.md/calm-app/)). That is exactly the "sophisticated" detail the BDA rules out.

Mood input shows which premium ideas suit low readers. Apple's State of Mind starts with "multidimensional shapes" on a scale from Very Unpleasant to Very Pleasant, and then falls back to word lists ([Apple Newsroom](https://www.apple.com/newsroom/2023/06/apple-provides-powerful-insights-into-new-areas-of-health/)). How We Feel narrows first by pleasantness, then by energy, then to an emotion word with a definition ([Problem2Product](https://problem2product.substack.com/p/does-how-we-feel-solve-a-problem)). The first steps need almost no reading. The word lists are where dyslexic users would struggle. Lexi's emoji tiles and its "Name it more" step, with emoji and audio on each word, already avoid that trap. What transfers is non-verbal encoding: a shape plus a colour per mood band, so that the bands stop relying on colour alone.

Companions can be cute without being childish. Bears Gratitude won the 2024 Apple Design Award for Delight and Fun ([Apple Design Awards 2024](https://developer.apple.com/design/awards/2024/)), and Creative Review argues that the current wave of cute self-care apps is "far from infantile" ([Creative Review](https://www.creativereview.co.uk/self-care-app-design-cute/)). The companions that work share four traits: a minimal drawing style, an emotional range, a supporting role that never nags (Gentler Streak's mascot is "Always there, never judging, just cheering you on", per [Gentler Stories](https://gentlerstories.com/gentlerstreak/)), and a grown-up system of type and colour around them. Childishness comes from bright primary colours everywhere, constant bouncing, shops and forced customisation up front.

The platform trends need care. Apple's Liquid Glass guidance says plainly, "Don't use Liquid Glass in the content layer" ([Apple HIG Materials](https://developer.apple.com/design/human-interface-guidelines/materials)). NN/g's review of iOS 26 found translucent text losing contrast over busy imagery, text layered over text that became an "illegible mess", and animated controls bringing distraction "with a side of nausea" ([NN/g](https://www.nngroup.com/articles/liquid-glass/)). Apple then added a more opaque "Tinted" option in iOS 26.1 ([TidBITS](https://talk.tidbits.com/t/ios-26-1-to-add-optional-opacity-to-liquid-glass/32182)). Axess Lab adds that heavy blur (20 px and up) strains the eyes and that essential information should stay off textured or animated backgrounds ([Axess Lab](https://axesslab.com/?p=5111)).

| Technique | Seen in | Verdict for Lexi |
|---|---|---|
| One signature idea, applied everywhere | How We Feel's shapes, Headspace's dot, Opal's gem | **Adopt.** The butterfly, a warm Lexi turn and big emoji |
| Warm off-white surfaces and colour-tinted soft shadows | Headspace ([third-party analysis](https://blakecrosley.com/guides/design/headspace)) | **Adopt.** Matches Rello & Bigham and the BDA |
| One primary action on arrival | Headspace's single recommended session, Gentler Streak | **Adopt.** One large "Check in" on Home |
| Large, high-contrast, clearly bounded controls | Material 3 Expressive | **Adopt** for the primary button and tiles |
| Emotion shown by shape plus colour | How We Feel, State of Mind | **Adopt** for mood bands and the journal |
| Slow, eased motion for emotional moments | Headspace (unofficially 500–1,000 ms against a typical 250–300 ms) | **Adopt** for "saved", gated by Reduce Motion |
| A companion that appears at moments and has emotional range | Headspace faces, Gentler Streak's Yorhart | **Adopt**, kept restrained |
| Dark-first navy, gradients, star fields | Calm (unofficial) | **Limit.** Dark stays an option; nothing animated or textured behind text |
| Bright, expressive palette | Headspace, Material 3 Expressive | **Limit** to emoji, the presence and the primary button |
| Glass or translucency | iOS 26 Liquid Glass | **Avoid** on content; chrome only, with an opaque fallback |
| Negative letter spacing, small uppercase labels, light weights | Calm (unofficial) | **Avoid** |
| Long word lists for emotions | How We Feel (144 words), Apple's adjectives | **Avoid** unless every word has an emoji and audio |
| Shops, upsells, dashboards of equal-weight cards | Finch, Ahead | **Avoid** |

## Conversation and voice feel premium when nothing moves under the reader

### Lexi's turns should stay contained, chunked and revealed whole

Design systems have settled on a pattern: the user's turns sit in bubbles, and the assistant's turns are open text with a capped width. Toyota's AI chat guidance caps messages at about 558 px so they "never span the full width" ([Toyota DX Playbook](https://dx-playbook-prev.toyota-europe.com/cds/components/chat-messages-pages/design/)), and Siemens iX sets assistant messages at 45–80% of the container ([Siemens iX](https://ix.siemens.io/docs/components/ai-message/guide)). No study compares bubble and bubble-less layouts for anyone, and dyslexia guidance points the other way: boxes and borders "can help highlight important information" ([Ako Aotearoa 2023](https://ako.ac.nz/assets/Knowledge-centre/ALNACC-Resources/Dyslexia-resources/230907-Dyslexia-Friendly-Style-Guide.pdf)). Lexi should therefore keep a contained turn, which helps chunking and makes it clear who is speaking, but make that container soft: a warm tint, no shadow, and the existing fixed-width column. That keeps the calm of the bubble-less look without losing the box.

Pace matters more than layout. COGA's "Keep Text Succinct", "Break Media into Chunks" and "Let Users Control When the Content Moves or Changes" ([W3C COGA](https://www.w3.org/TR/coga-usable/)) are already reflected in Lexi's three-sentence cap and its "tap for next" pace setting. Streaming is the remaining gap. A 2025 study found that complex content "may be streamed faster than users can comfortably read" ([Streaming, Fast and Slow](https://arxiv.org/pdf/2504.17999)), and a common implementation reveals a chunk every 33 ms ([Microsoft](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/the-importance-of-streaming-for-llm-powered-chat-applications/4459574)), which is pacing for fast readers. Today Lexi shows the raw lines as they stream, then swaps them for the style-checked sentences. **The text changes under the reader**, which runs against COGA's rule that content must not move unexpectedly. The calmer pattern is a short "thinking" state of about 600–1,200 ms, followed by each checked sentence fading in whole. Typing indicators raise the sense of social presence, but only for novice users ([Gnewuch et al. 2018](https://aisel.aisnet.org/sighci2018/14/)). In a 202-person experiment, response delays raised social presence but could lower willingness to keep using the chatbot ([Gnewuch et al. 2022](https://aisel.aisnet.org/bise/vol64/iss6/5)). The APA's 2025 advisory asks wellness tools to limit human-like features ([APA](https://www.apa.org/news/press/releases/2025/11/ai-wellness-apps-mental-health)). Replacing the three bouncing dots with a non-human "thinking" state keeps the cue that a reply is coming without mimicking a person typing.

Two further details complete the picture. When the user has scrolled up to reread, new messages should not pull the view down. A "New message" pill should appear instead; this is common messaging practice, not a tested rule. For screen readers, the recommended pattern is a chat history with the log role and live announcements turned off, plus a separate, always-present status region that announces each finished chunk ([azukiazusa](https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui)). Lexi's web chat is currently one polite live region, so assistive technology can read streaming fragments aloud.

### Answered choices should fold away into the answer

Buttons beat free text for ease. In a randomised within-subjects experiment, button interaction gave better practical and emotional user experience than typing ([Haugeland et al. 2022](https://www.sciencedirect.com/science/article/pii/S1071581922000179)). A four-week diary study of mental-health chatbots found people valued free text for self-expression and became frustrated when the bot misunderstood them ([JMIR Mental Health 2025](https://mental.jmir.org/2025/1/e76642)). Lexi's mix of tiles, a mic and "Write on my own" covers both needs. Google's older conversation-design guidance caps suggestion chips at eight per turn ([Google](https://developers.google.cn/assistant/conversation-design/chips)), and Watermark's AI chat pattern advises removing options once they stop being relevant ([Watermark](https://ripple.watermarkinsights.com/patterns/ai-chat-experience/)). Lexi does the opposite. It locks used cards at 55% opacity and leaves unpicked Yes/No pills at 35%, so the conversation log fills with faded controls. The fix is to collapse each answered card into the answer Lexi already draws (a big emoji with its caption) and offer "Change" on the latest answer only. The check-in recap already has Change buttons, so this only cleans up the chat log.

### A calm, clearly non-human presence beats typing dots and a robot

The leading AI products give the assistant an abstract, non-human presence:

- Gemini is built on a circle, chosen for "simplicity, harmony, and comfort". Its motion visualises thinking, and each animation has a defined start and end ([Google Design](https://design.google/library/gemini-ai-visual-design)).
- Pi's agency briefed an interface that felt "calm, curious, and human" ([ustwo](https://ustwo.com/work/inflection-ai/)).
- Duolingo drives its character Lily with a state machine. She tilts her head to cover processing delays and has more than 64 idle variations so she never loops visibly. The team toned down her expressions after wide-open eyes read as oddly happy, and the whole animation file is under 1 MB ([Rive](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life)).

The evidence on human-like embodiment is unfavourable. In a randomised trial on mental-health questions, a text-only chatbot scored significantly higher on usability than a digital human (P = .01), with no difference in anxiety ([JMIR Human Factors 2024](https://www.sciencedirect.com/org/science/article/pii/S2292949524000543)). In OpenAI and MIT's studies, heavier daily use was associated with more loneliness and emotional dependence ([Fortune](https://fortune.com/2025/03/24/chatgpt-making-frequent-users-more-lonely-study-openai-mit-media-lab)). An audit of companion apps found manipulative tactics in 37% of farewells ([MediaWell on De Freitas et al.](https://mediawell.ssrc.org/?p=513790)). California's SB 243 requires a clear disclosure when a bot could be mistaken for a human ([Skadden](https://skadden.com/insights/publications/2025/10/new-california-companion-chatbot-law)).

The butterfly that Ember draws behind the chat is Lexi's natural signature. It should move out from behind the text, where it breaks the BDA's "avoid background patterns or pictures", and become a small mark with four states: idle, listening, thinking and speaking. Each state needs a text label and a still version for Reduce Motion. It should appear at 32–40 px beside the first turn of each Lexi group, and at 96–160 px on Home and in voice mode. The robot emoji did signal "AI", so the existing AI label must stay clearly visible.

### Voice input must wait for people who pause to think

Read-aloud remains the best-supported feature: a meta-analysis found a comprehension effect of g = 0.35 for readers with reading disabilities ([Wood et al. 2018](https://pmc.ncbi.nlm.nih.gov/articles/PMC5494021/)). Synchronised highlighting added no measurable comprehension gain over plain text-to-speech ([Keelor et al. 2023](https://pubmed.ncbi.nlm.nih.gov/37119436/)). A seven-child eye-tracking pilot found a whole-sentence band easier to follow than other highlight styles ([i-JET](https://online-journals.org/index.php/i-jet/article/view/8736)). Lexi's highlight therefore only needs a calmer default, not more features.

Speech input is where the voice-first upgrade lies. A 2026 review of 37 studies of conversational agents for people with intellectual and developmental disabilities reports that some users "require additional time to formulate their questions", and that devices often stop listening during those pauses ([IJHCI 2026](https://www.tandfonline.com/doi/full/10.1080/10447318.2026.2634975)). ChatGPT users who are interrupted too often have asked for hold-to-talk back ([OpenAI Community](https://community.openai.com/t/chatgpt-live-voice-still-interupts-too-much-what-happened-to-hold-to-talk/1386172)), and OpenAI's 2026 voice model is built to wait through mid-sentence pauses and to "hold on" when asked ([Android Headlines](https://www.androidheadlines.com/2026/07/chatgpt-gpt-live-1-voice-mode-update-features.html)). Dyslexic adults report that dictation "can add complexity and time" ([LaMPost](https://arxiv.org/pdf/2207.02308)). In native Lexi, voice entries keep listening until the user taps stop, but **the chat mic uses non-continuous recognition and ends at the first pause**. It should work like voice entries:

- the user taps to start and taps Done to stop, with a generous allowance for silence
- the transcript settles phrase by phrase instead of reflowing
- a confirm row offers Send, Say again and Fix, and Lexi reads the transcript back

ChatGPT now keeps voice inside the normal chat thread with a live transcript ([Tom's Guide](https://www.tomsguide.com/ai/chatgpt-now-lets-you-enable-voice-mode-directly-inside-your-chat-without-switching-heres-how)), which Lexi already does.

Research on low-literacy users supports Lexi's overall model. In a study of an animated virtual nurse, patients with low health literacy found it easy to use, and most preferred it to their doctor or nurse ([Bickmore et al. 2009](https://khoury.northeastern.edu/home/laurap/pub/CHI09.VirtualNurse.pdf)). Chatbot surveys reduced low-effort answering compared with web forms ([Kim et al. 2019](https://www.springerprofessional.de/doi/10.1145/3290605.3300316)), although a separate longitudinal comparison found the web survey often gave better data quality ([KU Leuven](https://lirias.kuleuven.be/retrieve/697279)). In a four-week field study, patients with depression using an LLM journaling app made their daily records consistently richer ([MindfulDiary](https://arxiv.org/html/2310.05231v2)). A chat wrapper around structured check-in data is the right architecture, and Lexi already has it.

## Standards set the minimums, and one token file can enforce them in both apps

| Property | Minimum or target | Lexi today | Draft token |
|---|---|---|---|
| Body text | 16–19 px ([BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx)); 17 pt ([Apple](https://developer.apple.com/design/human-interface-guidelines/typography)); 18 pt best in [Rello 2013](https://unpaywall.org/10.1145%2F2461121.2461125) | 18 px default; user steps 16–28 | Keep |
| Smallest text | 16 px (BDA) | 11–15 px labels | `type.caption` = max(16 px, 0.889 em) |
| Headings | At least 20% larger than body, bold (BDA) | Card titles at 1.0–1.02 × body | Steps of 1.22 × body and up |
| Line height | At least 1.5 (BDA; [WCAG 1.4.8](https://www.w3.org/TR/WCAG22/)) | 1.5 / 1.7 / 2.0 | Keep |
| Spacing tolerance | 0.12 em letters, 0.16 em words, 2 em paragraphs ([WCAG 1.4.12](https://www.w3.org/TR/WCAG22/)) | Presets reach 0.12 / 0.32 em, but three components override them | Inherit everywhere |
| Text contrast | 4.5:1 AA, 7:1 AAA; APCA Lc 75 minimum, Lc 90 preferred for body ([APCA](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell)) | 14–17:1 mostly; Night's Lexi text 6.1:1, Lc −47 | 10:1 or more; Lc 88+ light, −85 or stronger dark |
| Non-text contrast | 3:1 for component boundaries ([WCAG 1.4.11](https://www.w3.org/TR/WCAG22/)) | Inputs 1.5:1 | `border.strong` at 3.4:1 or more |
| Targets | 24 px AA, 44 px AAA ([WCAG](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)); 44 pt Apple; 48 dp Android | Speaker 34 px, composer buttons 46 px | 48 minimum, 56 for primary, tiles 96 or more |
| Focus | At least a 2 px perimeter with 3:1 change (WCAG 2.4.13) | 3 px accent outline | Keep 3 px in `accent.ink` |
| Motion | Pausable if longer than 5 s; interaction motion can be turned off; fades under Reduce Motion | Infinite dots, overshooting hop | 150–400 ms, no overshoot |
| Colour as signal | Never the only signal ([WCAG 1.4.1](https://www.w3.org/TR/WCAG22/)) | Day bars use colour only | Shape plus label |

The contrast standard is in flux, so Lexi should check every colour pair against two measures. The April 2026 WCAG 3 draft says "the contrast algorithm used in WCAG 3 is yet to be determined", APCA was removed from the draft in 2023, and WCAG 3 is expected around 2030 at the earliest ([Adrian Roselli](https://adrianroselli.com/2026/04/wcag3-contrast-as-of-april-2026.html)). Roselli's advice is that colours chosen with APCA should still meet WCAG 2. Passing WCAG 2 is required. APCA then acts as a second, perceptual check that catches the dark-mode cases WCAG 2 over-rates, as it does for Night's orange text.

The token structure itself is well established. Radix Colors assigns fixed jobs to a 12-step colour scale: steps 1–2 for backgrounds, 3–5 for component fills, 6–8 for borders, 9–10 for solid fills and 11–12 for text. Steps 11 and 12 are guaranteed to reach Lc 60 and Lc 90 on step 2 ([Radix Colors](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale)). Adobe's Leonardo generates colours from target contrast ratios, so a theme can be regenerated at runtime ([Leonardo](https://leonardocolor.io/)). Atlassian pairs each elevation surface with a shadow and relies on surface colour in dark mode ([Atlassian](https://atlassian.design/foundations/elevation)), and IBM Carbon lightens each layer by one step in dark themes ([Carbon](https://carbondesignsystem.com/elements/color/overview/)). Lexi already has semantic CSS variables and a typed `Palette` in `theme.ts`. The gap is that many values live inside components instead: inline ring styles in the settings code, a dozen shadow recipes, and `--bot` reused for bubbles, the Tidy panel and reflections. One tokens file that generates both the web custom properties and the native palettes closes that gap. A check in CI that fails on any text and surface pair below target keeps it closed.

## Conclusion

The research turns a vague complaint into a short, testable diagnosis. Lexi does not need to give anything up to look premium, because the evidence-backed choices (large type, warm surfaces, high contrast, short chunks, labelled emoji, user control over pace and spacing) are the same ones award-winning wellness apps make for their own reasons. The only real conflicts are a handful of fashionable details: thin type, pale text, spaced-out capitals, glass and bounce. The biggest visual gain comes from deleting colour rather than adding effects. Lexi's colour should move out of the frame and into three places: the emoji, Lexi's warm turn and one primary button. The identity should move from the board's colourful chrome to a single signature, the butterfly presence.

The second takeaway is about evidence. Every finding here comes from children, from general readers, from guidelines or from product practice. None comes from dyslexic adults using a calm, premium-looking chat journal. The open questions are concrete. Does emoji-first read as childish once the surround is calm? Does pale cream beat the existing Cream look's stronger tint? Does Atkinson Hyperlegible Next beat Verdana? Lexi can answer them itself. It can ship the new tokens behind a "new look" switch and test with dyslexic teens and adults, using the 11-item Chatbot Usability Scale (BUS-11) ([Borsci et al.](https://link.springer.com/article/10.1007/s00779-021-01582-9)), task success, which looks people choose and whether they keep journaling. Asking users is also what the device-abandonment research says keeps people using a tool.

## Prioritised upgrades for Lexi

Evidence labels: **Strong** = meta-analysis or several replicated studies. **Moderate** = one or more good controlled studies. **Limited** = small, single, indirect or non-dyslexic studies. **Standard** = WCAG, BDA, COGA, platform guidelines or other expert consensus without trials behind the number. **Precedent** = what leading or award-winning products do, which shows feasibility and taste rather than effect. Effort: **S** = a few days, **M** = one to three weeks. "Both" means the web app and the native app. Changing fixed copy means re-recording the line in `tools/voice/lines.json`.

### 1. Do first: mostly token swaps, highest visual return

| Upgrade | What changes from today | Rationale and evidence | Where, effort |
|---|---|---|---|
| **Remove the accent frame** | The top bar takes the canvas colour, the 14 px rails go, and the dock becomes one opaque raised surface with neutral tabs. Accent appears only on the active-tab marker and the primary button. Update the board rule in `DESIGN.md`. | A bright surround is the clearest "cheap" and "special tool" signal, and dock labels on orange are Lc 49. **Standard** ([Home Office autism poster](https://ukhomeoffice.github.io/accessibility-posters/autism): "Don't use bright contrasting colours"; [COGA](https://www.w3.org/TR/coga-usable/) "Limit Interruptions"). **Limited** ([stigma review](https://arxiv.org/pdf/2412.13241)). **Precedent** ([Gentler Streak](https://developer.apple.com/design/awards/2024/)). | Both, S |
| **Warm paper canvas, with Cream as the default** | #E6E6E6 becomes #F6EEE2. "Match my device" becomes Cream by day and Ember by night. Orange becomes "Peach", the stronger tint. Purple and Mint canvases shift slightly warm. | Grey was read 21% slower than peach, for every reader. **Moderate** ([Rello & Bigham 2017](https://www.changedyslexia.org/publications/pdfs/2017-ASSETS-Good%20Background%20Colors.pdf)). **Standard** ([BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx): not white). Pale cream itself is untested. | Both, S |
| **Soft, warm Lexi turns** | The mint #79EAB9 bubble becomes peach #FBE2C4 (Cream) or warm paper (other looks). Night's orange text becomes off-white ink, and Ember's bright bubble becomes #3A2F27. Bubble shadows go. | Saturated, cool reading surfaces are replaced. Night's Lexi text goes from 6.1:1, Lc −46.6 to 11.4:1, Lc −88.5. **Moderate** (warm versus cool, [Rello & Bigham](https://www.changedyslexia.org/publications/pdfs/2017-ASSETS-Good%20Background%20Colors.pdf)). **Standard** ([APCA](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell); [WCAG 1.4.6](https://www.w3.org/TR/WCAG22/)). | Both, S |
| **Graphite Night, nothing behind text** | Night's canvas goes from #020000 to #17181D, and its ink from #F4F4F4 to #ECE7DF. Ember's butterfly picture leaves the chat background. | **Standard** ([Material dark theme](https://m2.material.io/design/color/dark-theme.html); [BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx): no background pictures; [COGA](https://www.w3.org/TR/coga-usable/) 4.4.11). There is no dyslexia evidence on dark mode either way. | Both, S |
| **16 px minimum, three weights** | All labels go to 16 px or more: tiles (13 or 11 px today), tabs (13), weekdays (11, letter-spaced), stats, legend and AI note (14). Labels use Lexend 500, headings 600, and bold is kept for emphasis only. Titles get at least 1.22 × body. | **Standard** ([BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx) 16–19 px and headings 20% larger; [Apple](https://developer.apple.com/design/human-interface-guidelines/typography) avoid light weights). **Moderate** (size matters most, [Rello 2013](https://unpaywall.org/10.1145%2F2461121.2461125)). | Both, S |
| **Spacing reaches every label** | Remove the fixed letter and word spacing on tile labels, the AI note and the Yes/No labels. Tiles go three to a row on phones and wrap labels between words. | **Standard** ([WCAG 1.4.12](https://www.w3.org/TR/WCAG22/)). **Moderate** (spacing helps some readers, [Zorzi 2012](https://pmc.ncbi.nlm.nih.gov/articles/PMC3396535)). | Both, S |
| **One radius and elevation scale** | Nine radii become six (6, 8, 12, 20 and 28 px, plus fully round). About a dozen shadows become three levels with warm-tinted shadows. Bubbles become flat, and the tile "ledge" goes. Dark looks use surface tone instead of shadow. | **Standard** ([COGA](https://www.w3.org/TR/coga-usable/) "Use a Consistent Visual Design"; [Atlassian](https://atlassian.design/foundations/elevation); [Carbon](https://carbondesignsystem.com/elements/color/overview/)). **Precedent** (tinted shadows, [Headspace, unofficial](https://blakecrosley.com/guides/design/headspace)). | Both, S–M |
| **Visible edges, bigger hit areas** | Input and chip borders go from #D2D2D2 (1.5:1) to `border.strong` (3.4:1 or more). The speaker button goes from 34 to 48 px, composer buttons from 46 to 48 px, and the Help pill from 42 to 48 px. | **Standard** ([WCAG 1.4.11 and 2.5.5](https://www.w3.org/TR/WCAG22/); [Apple 44 pt](https://developer.apple.com/design/human-interface-guidelines/accessibility); [Android 48 dp](https://developer.android.com/guide/topics/ui/accessibility/apps)). | Both, S |
| **Calm motion** | Bouncing dots, the overshooting hop and the pop-in scale become 150 / 250 / 400 ms motion with standard easing and no overshoot on text. Celebration rows are off by default and replaced by one consistent "saved" moment. | **Standard** ([WCAG 2.2.2 and 2.3.3](https://www.w3.org/TR/WCAG22/); [Apple](https://developer.apple.com/design/human-interface-guidelines/accessibility); [Material motion](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md): effects should not overshoot). **Moderate** (ADHD co-occurrence, [Willcutt & Pennington](https://vivo.colorado.edu/display/pubid_52783)). **Precedent** (Finch's missing save feedback, [Pratt IXD](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/)). | Both, S |
| **Copy that sounds finished** | "The themes from the Lexi wireframes." becomes something like "Pick the colours that feel easiest to read." The Look section is presented as reading comfort, not a fix. | **Limited** (stigma, [Shinohara & Wobbrock](https://faculty.washington.edu/wobbrock/pubs/chi-11.03.pdf)). **Standard** ([COGA](https://www.w3.org/TR/coga-usable/) "Use Clear Words"). | Both, S |

### 2. Next: components and the presence

| Upgrade | What changes from today | Rationale and evidence | Where, effort |
|---|---|---|---|
| **One primary action on Home** | Three equal tiles (Guided check-in, Write on my own, Open journal) become one large "Check in" button with a quieter "Write". "Open journal" goes, because the Journal tab already does that job. | **Standard** ([COGA](https://www.w3.org/TR/coga-usable/) 4.3.4 and 4.6.3). **Moderate**, from one large industry programme ([Material 3 Expressive research](https://design.google/library/expressive-material-design-google-research): bounded controls found up to 4 times faster). **Precedent** (Headspace; the [Ahead critique](https://screensdesign.com/showcase/ahead-emotions-coach)). | Both, S–M |
| **Butterfly presence** | The robot emoji, used as brand and avatar, becomes the butterfly mark with four states (idle, listening, thinking, speaking). Each state has a text label and a still version. It is small on the first turn of each group and larger on Home and in voice mode. The AI label stays. | **Limited** (text-only beat a digital human, [JMIR HF 2024](https://www.sciencedirect.com/org/science/article/pii/S2292949524000543)). **Precedent** ([Gemini](https://design.google/library/gemini-ai-visual-design), [Lily](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life)). **Standard** ([APA](https://www.apa.org/news/press/releases/2025/11/ai-wellness-apps-mental-health); [SB 243](https://skadden.com/insights/publications/2025/10/new-california-companion-chatbot-law)). | Both, M |
| **"Thinking" state and whole-sentence reveal** | The typing dots become the presence's "thinking" state. Instead of raw streamed lines that are later swapped, each checked sentence fades in whole. The view does not jump when the user has scrolled up; a "New message" pill appears instead. | **Standard** ([COGA](https://www.w3.org/TR/coga-usable/) 4.5.1 and 4.9.1). **Limited** ([Streaming, Fast and Slow](https://arxiv.org/pdf/2504.17999); [Gnewuch 2022](https://aisel.aisnet.org/bise/vol64/iss6/5)). | Both, M |
| **Answered cards fold away** | Locked cards at 55% opacity and unpicked pills at 35% become the collapsed answer, with "Change" on the latest answer only. | **Standard** ([COGA](https://www.w3.org/TR/coga-usable/) "Avoid Too Much Content"). **Precedent** ([Watermark](https://ripple.watermarkinsights.com/patterns/ai-chat-experience/)). | Both, M |
| **One emoji set, line icons for controls** | Operating-system emoji become one bundled emoji set with skin tones. Send, mic, speaker, back and close become sturdy line icons with words on the primary actions. The tabs keep bundled emoji at 28 px with 16 px labels. | **Moderate** (people read the same emoji differently 25% of the time, more so across platforms, [Miller et al. 2016](https://ojs.aaai.org/index.php/ICWSM/article/view/14757)). **Standard** ([NN/g](https://www.nngroup.com/articles/icon-usability/) on labels). The earlier report rated this "Later"; the premium consistency case moves it up. | Both, M |
| **Mood bands get a shape** | Saturated band pills and bars become soft tints with a shape for each band: round for content, spiky for stressed, low and drooping for low self-esteem. The day bars no longer rely on colour alone. | **Standard** ([WCAG 1.4.1](https://www.w3.org/TR/WCAG22/); [BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx): avoid red and green). **Precedent** ([How We Feel](https://howwefeel.substack.com/p/we-feelgrateful)). | Both, M |
| **Two weeks at a glance** | The 14-day horizontal scroller becomes a 7 × 2 grid visible all at once, plus one plain-words line such as "Most days: Content". | **Standard** ([COGA](https://www.w3.org/TR/coga-usable/): do not rely on memory). **Precedent** (How We Feel's visuals alone did not reveal patterns, [Problem2Product](https://problem2product.substack.com/p/does-how-we-feel-solve-a-problem)). | Both, M |
| **Voice-first chat mic** | The chat mic stops ending at the first pause. Instead the user taps to start and taps Done, with a generous allowance for silence. The transcript settles, then a confirm row offers Send, Say again and Fix, with read-back. | **Limited** ([IDD review 2026](https://www.tandfonline.com/doi/full/10.1080/10447318.2026.2634975); [LaMPost](https://arxiv.org/pdf/2207.02308)). **Precedent** ([GPT-Live-1](https://www.androidheadlines.com/2026/07/chatgpt-gpt-live-1-voice-mode-update-features.html); [hold-to-talk requests](https://community.openai.com/t/chatgpt-live-voice-still-interupts-too-much-what-happened-to-hold-to-talk/1386172)). | Native, M |
| **Quieter screen-reader announcements** | The web chat, currently one polite live region, becomes a log with live announcements off plus a persistent status region that says "Lexi says: …" once each sentence finishes. Native uses `announceForAccessibility`. | **Standard** ([WCAG 4.1.3](https://www.w3.org/TR/WCAG22/); [azukiazusa](https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui)). | Both, S–M |
| **Neutral default avatar** | The default girl emoji becomes no user avatar, since alignment already shows who is speaking. The avatar picker stays. | **Limited** (stigma and identity, [Shinohara & Wobbrock](https://faculty.washington.edu/wobbrock/pubs/chi-11.03.pdf); [arXiv review](https://arxiv.org/pdf/2412.13241)). | Both, S |

### 3. Test with dyslexic users first

| Upgrade | What changes from today | Rationale and evidence | Where, effort |
|---|---|---|---|
| **Calmer read-aloud highlight** | Highlight colour follows the look (Mint on Cream's peach turns, Yellow elsewhere). The 4 px reading ring becomes 2 px. An optional sentence band is added. | **Moderate** (highlighting added no comprehension, [Keelor 2023](https://pubmed.ncbi.nlm.nih.gov/37119436/)). **Limited** (sentence band easier, n = 7, [i-JET](https://online-journals.org/index.php/i-jet/article/view/8736)). | Both, S |
| **One reading font on every platform** | Test Atkinson Hyperlegible Next against Verdana as the default. Android already falls back to Atkinson. | **Moderate** (dyslexic readers preferred Verdana, [Rello & Baeza-Yates 2013](https://www.changedyslexia.org/publications/pdfs/2013-ASSETS-Good%20Fonts%20for%20Dyslexia.pdf)) against **Standard** (one consistent design, [COGA](https://www.w3.org/TR/coga-usable/)). | Both, S |
| **Emoji-first with adults and teens** | Once the frame is calm, check whether emoji tiles still read as childish, and whether pale Cream or the stronger Peach is preferred. | No evidence exists. Measure with [BUS-11](https://link.springer.com/article/10.1007/s00779-021-01582-9) and task success. | Both, M |

### 4. Do not adopt

| Idea | Why not |
|---|---|
| Liquid Glass or glassmorphism on bubbles, tiles or journal text | Apple: "Don't use Liquid Glass in the content layer" ([HIG](https://developer.apple.com/design/human-interface-guidelines/materials)). Translucency loses contrast ([NN/g](https://www.nngroup.com/articles/liquid-glass/)). If native navigation ever uses glass, keep it to the chrome and honour Reduce Transparency. |
| Text over photos, gradients, grain or star fields | BDA: single-colour backgrounds. Axess Lab: keep essential information off textured or animated backgrounds ([Axess Lab](https://axesslab.com/?p=5111)). |
| Light or thin weights, negative letter spacing, uppercase "eyebrow" labels | [Apple](https://developer.apple.com/design/human-interface-guidelines/typography); [BDA](https://www.bumc.bu.edu/jmedday/files/2025/05/Dyslexia-friendly-style-guide.docx); [APCA](https://git.apcacontrast.com/documentation/APCA_in_a_Nutshell) weight-to-size pairing. |
| Pale grey secondary text | WCAG 1.4.3 and APCA Lc 75. Muted text stays at 7:1 or more. |
| Looping ambient motion, parallax, shimmering placeholders | [WCAG 2.2.2](https://www.w3.org/TR/WCAG22/); [Apple](https://developer.apple.com/design/human-interface-guidelines/accessibility) Reduce Motion; [NN/g](https://www.nngroup.com/articles/liquid-glass/) on motion without purpose. |
| Full-screen confetti or sound by default | The evidence for neurodivergent users is anecdotal; keep it optional. |
| A realistic or 3D human avatar | [JMIR HF 2024](https://www.sciencedirect.com/org/science/article/pii/S2292949524000543); [SB 243](https://skadden.com/insights/publications/2025/10/new-california-companion-chatbot-law) disclosure; [APA](https://www.apa.org/news/press/releases/2025/11/ai-wellness-apps-mental-health). |
| Cool-hued reading surfaces | Cool tints were read slowest ([Rello & Bigham](https://www.changedyslexia.org/publications/pdfs/2017-ASSETS-Good%20Background%20Colors.pdf)). Purple and Mint keep their hue in the canvas and accent, not under Lexi's words. |

## Draft design tokens

### How the tokens are organised

There are three tiers. **Primitives** are hue ramps such as `orange.1–12`. **Semantic roles** are the names below (`canvas`, `lexi`, `ink`, `accent`). **Component tokens** point to roles, for example `bubble.lexi.bg → lexi` and `tile.selected.ring → accent.ink`. One `tokens.json` generates the web app's `:root` and `.app[data-look]` custom properties and the native app's `PALETTES` in `lexi-native/src/theme.ts`. A CI script computes WCAG 2 contrast (must pass) and APCA (second check) for every text and surface pair. Today's names map as follows:

| Today | New role |
|---|---|
| `--bg` | `canvas` |
| `--bot` | `lexi` |
| `--me` | `me` |
| `--ink-soft` | `ink.muted` |
| `--line` | `hairline` (plus a new `border.strong`) |
| `--yes` / `--accent` | `accent` |
| `--bar` / `--rail` | Retired |

Sizes stay in em/rem on web and in font-scaled units on native, so the user's text size and the phone's text size still compound.

### Type

The reading font defaults to Verdana, with Atkinson Hyperlegible Next as the fallback (Android). The interface font is Lexend at 400, 500 and 600; native needs the Medium (500) face added. A font the user picks in Settings applies to all text. `text-transform` is always none. Letter spacing is 0 at every level, plus the user's preset, with no negative tracking.

| Token | At Medium (18 px) | Rule | Weight | Line height | Font | Use | Today |
|---|---|---|---|---|---|---|---|
| `type.caption` | 16 px | max(16 px, 0.889 em) | 500 | 1.45 | Interface | AI note, timestamps, stat labels, weekdays, legend | 11–15 px, mostly bold |
| `type.label` | 18 px | 1 em | 500 | 1.3 | Interface | Buttons, tile labels, tabs, chips, settings rows | 13–15 px Verdana 700 |
| `type.body` | 18 px | User size | 400; 700 only for emphasis | User setting (1.5 / 1.7 / 2.0) | Reading | Lexi's turns, the user's turns, journal text | Unchanged |
| `type.body-lg` | 20 px | 1.111 em | 400 | User setting | Reading | Journal reading view | New |
| `type.title` | 22 px | 1.222 em | 600 | 1.3 | Interface | Card and section titles | 1.0–1.02 em |
| `type.headline` | 28 px | 1.556 em | 600 | 1.25 | Interface | Screen titles | 1.55 em at 700 |
| `type.display` | 36 px | 2 em | 600 | 1.2 | Interface | Home greeting, empty states | New |

Emoji sizes do not scale down with text. `emoji.inline` is 1.3 em, `emoji.tile` 44 px (unchanged), `emoji.nav` 28 px (34 today), `emoji.answer` 88 px for one and 64 px for several (unchanged), and `emoji.hero` 80 px (64 today). `presence.sm` is 36 px and `presence.lg` 128 px. `measure.lexi` keeps today's fixed column, min(70%, 21 em), widening to min(86%, 26 em) for Roomy spacing or large text. `measure.reading` is 65ch for journal text.

### Spacing, size and targets

| Token | Value | Today |
|---|---|---|
| `space.1–10` | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 | Ad hoc values |
| `gutter` | 20 px on phones (16 px under 380 px), 24 px on tablets | 14 px painted rail plus 14 px padding |
| `gap.turn` / `gap.group` | 24 px between speakers / 8 px within a group | 22 / 14 |
| `pad.card` / `pad.bubble` | 16 px / 0.75 em × 1 em | 14 px / 0.7 em × 1 em |
| `gap.section` | 32 px | 16–26 |
| `size.target.min` | 48 | Speaker 34, composer 46, Help 42 |
| `size.target.primary` | 56 (composer pill, primary button) | Composer 56 |
| `size.tile` | 96 px or wider × 104 px tall, 3 columns on phones, 12 px gap | Auto-fill at 84 px or wider, 10 px gap |
| `size.yesno` | 84 × 58 or larger | Unchanged |
| Spacing presets | Normal 0.012 / 0.08 em, Roomy 0.06 / 0.16 em, Extra roomy 0.12 / 0.32 em, applied to every text node | Overridden on tiles, the AI note and Yes/No labels |

### Shape

| Token | Value | Use | Today |
|---|---|---|---|
| `radius.xs` | 6 | Bubble tail corner, word highlight | 6 |
| `radius.sm` | 8 | Badges, the selected check | 12–14 |
| `radius.md` | 12 | Inputs, settings rows, emoji-picker cells | 14 |
| `radius.lg` | 20 | Bubbles, tiles, day cells | 18 / 20 / 22 |
| `radius.xl` | 28 | Cards, journal entries, sheet top corners | 28 |
| `radius.full` | Fully round | Buttons, pills, tab marker, avatars, presence | 999 / 30 |

### Elevation

| Level | Light looks | Dark looks | Used for |
|---|---|---|---|
| `sunken` | `surface.sunken`, no shadow | One step darker than the canvas | Text fields, the free-write writing area |
| `flat` | Canvas or turn fill, no shadow | Same | Lexi's and the user's turns, emoji answers, lists |
| `raised` | `surface`, 1 px `hairline`, shadow `0 1px 2px rgb(ink / 6%), 0 4px 12px rgb(ink / 6%)` | `surface.raised` tone, no shadow | Tiles, cards, journal entries, the dock, the Help pill |
| `overlay` | `surface`, shadow `0 2px 6px rgb(ink / 8%), 0 12px 32px rgb(ink / 12%)` | `surface.raised` plus 1 px `border.strong` plus `0 12px 32px rgb(0 0 0 / 35%)` | Sheets, emoji picker, toasts |
| `scrim` | `rgb(ink / 45%)` | `rgb(0 0 0 / 60%)` | Behind sheets |

On native, `shadowColor` is the look's ink (not #000), with opacity 0.06–0.10, radius 12 or 32, and Android elevation 1 or 4. Selection uses a 3 px `accent.ink` ring, a check badge and an `accent`-tinted fill, so it never relies on colour or a lift alone.

### Colour per look

These are draft values. Every pair below was computed for this report with the WCAG 2 formula and the APCA 0.0.98G constants. The targets: ink 10:1 or more and APCA Lc 88 or more in light looks (−85 or stronger in dark looks); muted text 7:1 or more and Lc 75 or more; borders 3:1 or more. The bright brand orange #E38100 remains as `brand.signature`, but only for the presence glow and decoration (2.5:1 on the Cream canvas).

| Look | `canvas` | `surface` / `sunken` | `lexi` (Lexi's turn) | `me` (user's typed turn) | `ink` | `ink.muted` | `accent` / `on.accent` | `accent.ink` | `border.strong` | `hairline` | Highlight |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Cream** (default by day) | #F6EEE2 | #FFFBF5 / #EFE5D6 | #FBE2C4 | #FFFBF5 + hairline | #17130F | #4E443B | #9C4A0B / #FFFBF5 | #9C4A0B | #8C7F70 | #E3D6C4 | Mint #79EAB9 |
| **Peach** (was Orange) | #F9E3CC | #FFF9F2 / #F3DDC6 | #FFF9F2 | #FFF9F2 + hairline | #2A1C12 | #5E4335 | #A3480A / #FFF9F2 | #93410A | #957360 | #EBCDB0 | Yellow #FFE36E |
| **Purple** | #F5F0F8 | #FFFCFF / #ECE6F1 | #FFFCF8 | #ECE2F8 | #221A2E | #574A6B | #6E3BC4 / #FFFFFF | #6630BB | #857A97 | #E3DAEC | Yellow #FFE36E |
| **Mint** | #EEF5EC | #FBFDF8 / #E4EDE2 | #FCFCF6 | #D8EEE0 | #13261D | #3A5346 | #1F7A57 / #FFFFFF | #1A6A4C | #6F877A | #D5E4D7 | Yellow #FFE36E |
| **Night** | #17181D | #1F2027 / #121317 (raised #272932) | #2A2B33 | #3A3326 | #ECE7DF | #DDD7CE | #F2A65A / #1E1408 | #F6B97A | #7C7A82 | #2E3038 | Yellow #FFE36E |
| **Ember** (default by night) | #201B17 | #2B2520 / #1A1612 (raised #352F2B) | #3A2F27 | #4A3A2C | #F0E5DE | #E2D2C6 | #FFB877 / #4C2700 | #FFB877 | #9E8E82 | #44392F | Yellow #FFE36E |

In every look, the highlighted word's ink is #17130F (14.5:1 on yellow, 12.6:1 on mint).

| Look | Ink on canvas | Ink on Lexi's turn | Ink on user's turn | Muted on canvas | Muted on Lexi's turn | Label on accent | `accent.ink` on canvas | Border on surface / canvas |
|---|---|---|---|---|---|---|---|---|
| Cream | 16.1:1, Lc 95.5 | 14.8:1, Lc 90.2 | 17.9:1, Lc 103.0 | 8.2:1, Lc 82.4 | 7.6:1, Lc 77.0 | 6.0:1, Lc −83.1 | 5.4:1, Lc 70.7 | 3.8 / 3.4:1 |
| Peach | 13.3:1, Lc 88.9 | 15.8:1, Lc 100.3 | 15.8:1, Lc 100.3 | 7.3:1, Lc 76.1 | 8.6:1, Lc 87.5 | 5.8:1, Lc −81.2 | 5.6:1, Lc 69.1 | 4.1 / 3.5:1 |
| Purple | 14.9:1, Lc 95.7 | 16.4:1, Lc 102.0 | 13.4:1, Lc 88.8 | 7.2:1, Lc 80.0 | 7.9:1, Lc 86.4 | 6.8:1, Lc −87.8 | 6.9:1, Lc 78.1 | 3.9 / 3.6:1 |
| Mint | 14.3:1, Lc 95.6 | 15.4:1, Lc 100.7 | 13.0:1, Lc 89.5 | 7.6:1, Lc 81.7 | 8.1:1, Lc 86.8 | 5.3:1, Lc −81.2 | 5.9:1, Lc 74.9 | 3.8 / 3.5:1 |
| Night | 14.4:1, Lc −91.5 | 11.4:1, Lc −88.5 | 10.2:1, Lc −86.5 | 12.4:1, Lc −81.6 | 9.8:1, Lc −78.6 | 9.0:1, Lc 63.6 | 10.3:1, Lc −70.4 | 3.8 / 4.2:1 |
| Ember | 13.8:1, Lc −90.7 | 10.5:1, Lc −86.8 | 8.8:1, Lc −83.4 | 11.6:1, Lc −79.4 | 8.8:1, Lc −75.5 | 7.8:1, Lc 66.8 | 10.1:1, Lc −71.1 | 4.8 / 5.4:1 |

The table leaves three cautions. First, labels on Night's and Ember's accent fills reach Lc 63–67, so those fills carry only 18 px or larger labels at weight 500 or more, never body text. Second, muted text on the light `sunken` wells drops to about Lc 71–75, so muted text should stay off the wells or switch to `ink` there. Third, the existing "Higher contrast" handling (`prefers-contrast: more`) should keep swapping `ink.muted` for `ink` and `hairline` for `border.strong`, and native should do the same when iOS Increase Contrast is on.

### Mood bands and status

| Band | Shape | Light soft / ink / solid | Contrast (ink on soft; solid on surface) | Dark soft / ink / solid | Contrast |
|---|---|---|---|---|---|
| Content | Round, smooth | #FAE1C0 / #6E3A08 / #C26A06 | 7.3:1; 3.8:1 | #4A3418 / #F7D3A6 / #E8963A | 8.3:1; 6.8:1 |
| Stressed | Spiky | #D2EEE2 / #1B5A45 / #2A8A69 | 6.6:1; 4.1:1 | #1E3F35 / #BDEBD8 / #4FC49A | 8.8:1; 7.5:1 |
| Low self-esteem | Low, drooping | #E6DDF4 / #4B2C80 / #7A4FC4 | 8.1:1; 5.4:1 | #352A4D / #DCCCF7 / #A98BEA | 8.8:1; 5.9:1 |

The band hues keep Lexi's orange, mint and purple families for continuity, but at low saturation. The "solid" colour is used only for bars and shape glyphs, which need 3:1 against neighbouring colours (WCAG 1.4.11). Every band appearance also carries its word. `danger` is #B42F1F with #FFFBF5 (6.1:1), always paired with an icon and a word, and never set next to a green "success" (the BDA's advice on red and green).

### Motion

| Token | Value | Use | Today |
|---|---|---|---|
| `motion.fast` | 150 ms, standard easing | Press, hover, toggle, tab change | 120–150 ms transitions |
| `motion.base` | 250 ms, enter easing, opacity plus a 4 px rise | A whole sentence appearing, tile selection | 220 ms pop with scale 0.96 |
| `motion.slow` | 350 ms | Sheets opening and closing | — |
| `motion.page` | 400 ms | Screen changes | — |
| `motion.settle` | 500 ms, effects spring (damping 1.0) | The single "saved" moment: the presence settles, a light haptic plays on native, "Saved" shows | Celebration rows with overshoot |
| `motion.think` | A 600–1,200 ms pause before a reply, then reveal | The presence's "thinking" state | Bouncing dots repeating every 1 s, forever |
| `motion.breath` | A 4–5 s scale of 2% or less, one cycle per state change, then rest | The presence when idle or listening | — |
| Easing | standard (0.2, 0, 0, 1); enter (0.05, 0.7, 0.1, 1); exit (0.3, 0, 0.8, 0.15) | All motion ([Material](https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md)) | `ease-out` and an overshoot curve (0.3, 1.4, 0.5, 1) |
| Springs | Spatial damping 0.9 and stiffness 700 (1,400 for fast); effects damping 1.0 and stiffness 1,600; never below 0.9 on anything that holds text | Native movement | — |
| Reduced motion | Every spatial animation becomes an opacity fade of 150 ms or less, or nothing. The presence is still and shows its text label. No blur, parallax or shimmer. Celebrations are off. | Web `prefers-reduced-motion`, native `isReduceMotionEnabled`, plus an in-app "Calm motion" switch | Most animation is switched off |

The breath cycle is capped at one run per state change, so nothing loops longer than 5 s without a pause control (WCAG 2.2.2).

### Focus and states

`focus.ring` is 3 px in `accent.ink`, offset by 2 px, shown with `:focus-visible` on web. It reaches 5.4–6.9:1 against the light canvases and 9.4–10.3:1 against the dark ones, which clears WCAG 2.4.13's 3:1. The sticky composer and dock must never cover a focused tile (WCAG 2.4.11). On web that means `scroll-padding-bottom` equal to the dock's height; on native it means scroll insets. A selected tile combines a ring, a check badge and an `accent`-tinted fill. Disabled controls appear only while a card is active. Once answered, the card folds into the answer, so the conversation log never shows faded controls.
