# Premium wellness, mood-tracking and journaling apps: design teardown and dyslexia transfer assessment

Research date: 19 October 2026. Apps covered in depth: How We Feel, Apple State of Mind and Apple Journal, Headspace, Calm, Finch, Gentler Streak, Daylio, Reflectly, Day One, Stoic, Opal. Covered more lightly: Ahead, Wysa, Rosebud, Breathwrk, Bearable, Bears Gratitude. Woebot was not researched (no time budget left; see Gaps).

Source-quality note for the report writer: official design documentation is rare for these apps. The strongest primary sources are Apple's Design Award pages, Apple's newsroom, Google's Material research write-up, the How We Feel team's own Substack, It's Nice That on the Headspace rebrand, Opal's blog, Gentler Stories' site, and NN/g. Several detailed token-level breakdowns (hex codes, type scales, animation timings) come from **unofficial reverse-engineering sites** (blakecrosley.com, webdesignhot.com DESIGN.md pages). They are flagged wherever used and should be presented as approximate.

---

## 1. For each app, what defines its visual language and what makes it feel premium?

### Takeaway
The apps that reviewers and award juries call polished share restraint, not decoration: a single signature idea carried consistently (How We Feel's emotion shapes, Headspace's orange smile and breath-paced motion, Calm's navy twilight, Opal's gem, Gentler Streak's "subtle and consistently pleasing design language"), high-quality bespoke assets, slow eased motion, and a non-judgmental tone. Apps get criticised as cluttered or cheap when the home screen mixes too many things (Finch's shop and premium prompts, Day One's text-heavy Today page, Ahead's equal-weight dashboard).

### Cited Findings

**How We Feel (Yale Center for Emotional Intelligence and Ben Silbermann; ADA 2024 Social Impact finalist)**
- Designed by Andreas Helin, Sara Strand, Ben Powell and Patrik Goethe over four years. It was a 2024 Apple Design Award finalist in Social Impact (post dated 31 May 2024). — [How We Feel Substack, "we feel grateful"](https://howwefeel.substack.com/p/we-feelgrateful)
- Its visual language is abstract geometric shapes on a "tactile emotional landscape". Helin's rule: "Sharp, jagged edges for high-energy, stormy emotions and soft, smooth curves for moments of calm and serenity." — [How We Feel Substack](https://howwefeel.substack.com/p/we-feelgrateful)
- The interactive Mood Meter was built with Metal and SceneKit predecessors, using a vector approach so more shapes could be added later. The engineer praised the iOS haptics API. — [How We Feel Substack](https://howwefeel.substack.com/p/we-feelgrateful)
- The "Emotions 101" videos combine figurative line illustration with the colourful geometric shapes. Strand says the shapes act as "canvases" for expressive characters. — [How We Feel Substack](https://howwefeel.substack.com/p/we-feelgrateful)
- Based on Marc Brackett's Mood Meter, which is built on the circumplex model of emotion. The How We Feel version was built with Pinterest co-founder Ben Silbermann and Pinterest volunteers, "now with 144 words". — [Marc Brackett, How We Feel app](https://marcbrackett.com/how-we-feel-app-3/)
- Yale calls the design "visually stunning ... inspired by the Mood Meter" (Dec 2022). — [Yale School of Medicine](https://medicine.yale.edu/news-article/the-how-we-feel-app-helping-emotions-work-for-us-not-against-us/)
- A reviewer says "the app is simple and beautifully designed" and "all assets are of high quality", and calls navigation "a true delight". But "the beautiful visualisation wasn't enough for me to spot patterns" (Jul 2024). — [Problem2Product, Dalma Szabo](https://problem2product.substack.com/p/does-how-we-feel-solve-a-problem)
- A user who is a designer said most apps are "functional but devoid of character" and that this one keeps ease of use while adding personality (App Store review, via aggregator). — [iCulture App listing](https://iculture.nl/app/1562706384/8)

**Headspace (2024 rebrand)**
- April 2024 rebrand done in-house with Italic Studio. Colophon Foundry made a proprietary typeface adapted from its Aperçu, "friendly but functional", with curves that mimic the Headspace smile. It was chosen to "flex from playful to clinical". — [It's Nice That, 25 Apr 2024](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)
- Signature orange stays as the lead, plus a wider palette for "the full range of human emotions". The colours are deliberately bright, against the "dreary sea of blues and greys" in mental healthcare. Combinations were chosen "with accessibility in mind". — [It's Nice That](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)
- It keeps the orange smiley and animated illustration, but the faces now show stress, sadness and contentment, not only joy. It adds more photography for coaching services. Breath-driven animations are kept throughout. The aim is a "more professional persona" while staying playful. — [It's Nice That](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)
- Headspace has no official mascot. The logo is the orange orb ("The Dot"). — [Made Good Designs](https://madegooddesigns.com/headspace-font/) (secondary)
- Unofficial analysis: warm, low-contrast palette avoiding pure #000/#FFF and grey, with colour-tinted shadows. Rounded forms only (24px containers, circle characters). Minimal faces (two dots and a curve, no nose or teeth), with emotion carried by posture and colour. One recommended session with a large start button on arrival. Rejects photorealism and aggressive gamification. — [Blake Crosley, Headspace design guide (third-party, illustrative values)](https://blakecrosley.com/guides/design/headspace)
- Former head of design Anna Charity (joined 2011) set the illustration and animation art direction. She had been put off by the "hippy vibe" of meditation and saw her job as making the practice feel ordinary. — [Creative Lives in Progress](https://creativelivesinprogress.com/articles/anna-charity)
- Brand illustrator Karen Hong: "it's a cool challenge figuring out how to communicate abstract ideas and tougher topics through the brand lens" and "Visual metaphors are key!" (Mar 2020). — [Dribbble Stories](https://dribbble.com/stories/2020/03/27/headspace-design-karen-hong)

**Calm**
- An unofficial extraction of the **calm.com website** (not the app) describes a "dark-first" navy system. Canvas #0a1f3a, cards #13294a, brand blue #0066ff, text #fafafa. A twilight gradient (navy to purple #7c5fb8 to dawn blue) animates slowly as the hero. Nature photography is colour-graded toward navy-purple, with 2–4px star-field dots. Radii run 16px cards, 24px modals, pill buttons. Typeface is Aktiv Grotesk (Dalton Maag), display weight 600 "never 800+", body 16px/1.6 and large body 18px/1.6. — [webdesignhot DESIGN.md, Calm (unofficial)](https://www.webdesignhot.com/design.md/calm-app/)
- **Conflict:** other unofficial breakdowns name Visby Round Bold or Figtree 700 as Calm's display face, with a blue-to-purple gradient reserved for the primary CTA. No official Calm design documentation was found. — [webdesignhot calm-app.md](https://www.webdesignhot.com/api/design-md/calm-app.md); [shadcn.io Calm](https://www.shadcn.io/design/calm/raw)

**Gentler Streak (ADA 2024 Social Impact winner)**
- Apple's jury: "powered not by insistent reminders but an optimistic and encouraging vibe ... relies on a subtle and consistently pleasing design language. Its health data is smartly organized, and its Monthly Summary view ... is less about hard comparisons and more about progress." — [Apple Design Awards 2024](https://developer.apple.com/design/awards/2024/)
- App Store editors praised "delightfully designed charts and graphics". Mascot Yorhart is a "gentle companion ... Always there, never judging, just cheering you on". Streaks reward consistency, not perfection, so a break doesn't reset progress. Users can set an activity status for injury, illness or a break. Awards: ADA 2024 winner (Social Impact), Apple Watch App of the Year 2022, ADA 2023 finalist (Visuals and Graphics). — [Gentler Stories, Gentler Streak](https://gentlerstories.com/gentlerstreak/)

**Finch (self-care pet)**
- Founded by Thomas Aquinas Nugraha Budi ("Nino") and Stephanie Yuan, who both lived with depression and anxiety. They drew on game designer Jane McGonigal. Yuan wanted to "make self-care fun and accessible". Budi: "Motivation is as important as what you do" (Jan 2023). — [Paste Magazine](https://www.pastemagazine.com/article/finch-app-mental-health-virtual-pet-self-care)
- A Finch job listing says the product "straddles the line between wellness and gaming". — [Finch job posting via Wellfound](https://wellfound.com/jobs/3075267-product-designer)
- Design critique (Sept 2025): the Tamagotchi concept is strong. Weaknesses are onboarding overload (colours, traits and naming all at once), a cluttered home that mixes the checklist with shops, journeys, community and "frequent premium prompts", rigid mood categories, and journaling that sometimes triggers no animation, "leaving users unsure whether their input was saved". — [Pratt IXD, Design Critique: Finch](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/)

**Apple State of Mind and Apple Journal**
- State of Mind (iOS 17 / watchOS 10, June 2023): users "scroll through engaging, multidimensional shapes and choose how they are feeling in a range from Very Pleasant to Very Unpleasant", then choose associations (e.g. Travel, Family) and descriptors (e.g. Grateful, Worried). — [Apple Newsroom, June 2023](https://www.apple.com/newsroom/2023/06/apple-provides-powerful-insights-into-new-areas-of-health/)
- iOS 18 Journal lets users attach their State of Mind to an entry, with the same very-pleasant-to-very-unpleasant picker. — [Yahoo Tech](https://tech.yahoo.com/apps/articles/apples-journal-app-write-feelings-163822490.html); [9to5Mac iOS 18 Journal](https://9to5mac.com/heres-everything-new-in-the-journal-app-for-ios-18/)
- iOS 26 Journal (2025): Liquid Glass redesign, multiple journals, inline images, and iPad and Mac versions with a collapsible sidebar. A BGR reviewer said it felt "inviting to write in". Coverage is from the WWDC and beta period. — [TechRadar](https://www.techradar.com/phones/ios/apple-journal-is-finally-coming-to-the-ipad-and-mac-with-6-new-features-and-they-could-be-the-reason-i-switch-from-notes); [9to5Mac](https://9to5mac.com/2025/06/17/apples-journal-app-is-coming-to-ipad-and-mac-with-big-upgrades/); [BGR](https://bgr.com/1922123/ios-26-journal-preview-ipad-mac-app/)

**Daylio**
- Five default moods (rad, good, meh, bad, awful). Emoji, name, colour and style can be changed, and Premium has 300+ emojis. Custom moods still sit under the 5 categories. — [Daylio FAQ](https://daylio.net/faq/docs/daylio-faq/tutorials/create-and-manage-moods/); [Headway review](https://makeheadway.com/blog/daylio-review/)
- A reviewer praised its "cheerful, bright and colorful design" but warned that "super simple design won't be adequate for everyone". — [Food & Nutrition Magazine](https://foodandnutrition.org/from-the-magazine/daylio-ios-version-1-5-1/)

**Reflectly (older, 2019)**
- Won Google's 2019 Material Design Award (Innovation) for "artfully executed motion choreography", a "novel elevation model" (raising carousel items to build hierarchy), custom components, custom typography and colour supporting a conversational UI, and a warm, playful tone. — [Google Design, Material Design Awards 2019](https://design.google/library/material-design-awards-2019)
- "Dominated by vibrant colours on white backgrounds", with rounded corners, large tappable buttons and a user-chosen primary colour (Apr 2019). — [MobileSyrup](https://mobilesyrup.com/2019/04/07/reflectly-journaling-app-review/)

**Day One**
- Version 3.4 (older) added Hoefler fonts (Whitney, Ideal Sans, Sentinel), in the editor only. — [The Sweet Setup](https://thesweetsetup.com/day-one-3-4-introduces-new-fonts-drawing-and-apple-watch-improvements/)
- In 2023 users pushed back on an entry preview layout with "wasted space" that was harder to scan. — [Day One forums](https://forums.dayoneapp.com/forums/topic/please-change-the-entry-preview-layout-to-how-it-was-before/)
- A Sept 2026 critique calls it "sleek, responsive, and intuitive". The editor is "plain" and "tightly-constrained", like Notes. The Today page has too much text, none of it about writing. — [Pratt IXD, Day One critique (2026)](https://ixd.prattsi.org/2026/09/design-critique-day-one-iphone-app/)

**Stoic**
- "Almost entirely black and white, and deceptively simple". The evening mode switches to white on black (2019 review). — [MobileSyrup, Stoic review](https://mobilesyrup.com/2019/06/09/stoic-self-reflection-journaling-app-review/)
- A June 2025 update redesigned the Library and smoothed animations and transitions. An iOS 26 "Liquid Design" overhaul was in progress as of August 2025, so the look has likely changed since 2019. — [Stoic blog, 2025 update](https://www.getstoic.com/blog/stoic-journal-update-2025-18); [Stoic blog, Aug 2025](https://www.getstoic.com/blog/stoic-journal-update-august-2025-25)
- Apple Editors' Choice. No ADA confirmed. — [Headway Stoic review](https://makeheadway.com/blog/stoic-app-review/)

**Opal (screen time)**
- The name and gem metaphor come from opal: "Blue Opal is said to calm the mind". The phone is plastic, glass and heat, while opal is "mineral, organic, and cool". Users are called "gems". "Guilt-tripping or scary screen time stats are counter productive." The team likes "the idea of Opal evolving based on how you're feeling" (Apr 2022). — [Opal blog, Designing for Wellbeing](https://opalapp.com/blog/designing-for-wellbeing)
- The home-screen gem becomes "brighter, more vibrant, and more intricate as focus improves". Green means positive focus and red means distraction time. Apple's Screen Time sandbox prevented animating it. Users found an earlier version "too complex and hard to read", which drove a redesign around a simple hourly bar chart. — [Opal blog, new home screen](https://opal.so/blog/introducing-the-new-opal-home-screen-track-your-screen-time-and-improve-your-focus)

**Others (lighter coverage)**
- Ahead: Emotions Coach was a 2024 ADA Social Impact finalist ("Duolingo for emotional intelligence"). Its mascot is a friendly ghost. Users draw a checkmark or happy face as kinesthetic commitments, and lessons unlock treasure chests with comics. — [Apple Design Awards 2024](https://developer.apple.com/design/awards/2024/); [appgefahren.de](https://www.appgefahren.de/?p=358864); [Screensdesign, Ahead](https://screensdesign.com/showcase/ahead-emotions-coach)
- Bears Gratitude won the ADA 2024 Delight and Fun award: "a warm and welcoming way to establish — and ... maintain — a daily gratitude practice". — [Apple Design Awards 2024](https://developer.apple.com/design/awards/2024/)
- Rosebud (AI journal) has little design coverage. Users call it "well-designed and easy to interact with", with voice transcription and a "Dig deeper" follow-up. — [Trustpilot, Rosebud](https://www.trustpilot.com/review/rosebud.app?page=2)
- Breathwrk offers customisable sounds, visuals, haptic vibrations and breath coaches. A UX showcase calls its exercise screen "clean and focused". It is now owned by Peloton. — [Screensdesign, Breathwrk](https://screensdesign.com/showcase/breathwrk-breathing-exercises); [Toolradar](https://toolradar.com/logo/breathwrk); [Hunted.space](https://hunted.space/product/breathwrk)
- Bearable is highly customisable with unlimited metrics, rated about 4.8 from 4K reviews. A user asked for clearer meaning behind its 0–4 rating scale. — [Choosing Therapy](https://www.choosingtherapy.com/bearable-app-review/); [r/BearableApp](https://reddit.sudovanilla.org/r/BearableApp/new)

### Inferences
- "Premium" in this category comes from **one memorable system idea executed consistently**, plus bespoke assets and restraint in what appears on each screen. It does not come from added effects. Lexi's butterfly, emoji tiles and five themes risk reading as "low budget" if each theme, illustration and tile style feels like a separate idea. The fix is unifying them into one shape and colour grammar, the way How We Feel ties shape, colour and energy together.
- Premium apps put **one primary action** on arrival: Headspace's single recommended session, Gentler Streak's readiness view, Opal's gem and score. Lexi's chat screen should likewise show one clear next step, not a grid of competing choices.
- Clutter and monetisation prompts are the most common "cheap" signals reviewers cite (Finch, Day One Today page, Ahead dashboard).

### Gaps
- No official design-system documentation was found for Calm, Finch, How We Feel, Gentler Streak or Daylio. Exact typefaces and type scales for these apps' in-app UIs could not be confirmed. Calm's sources conflict.
- Woebot was not researched. Note that Woebot Health shut down its consumer app in mid-2025 (from background knowledge, not verified in this session). Verify before including.
- Wysa: why a penguin and how it is gendered could not be confirmed. The founder interview was blocked (403).
- Mobbin and Behance case studies were not accessible (login-gated or not surfaced).

---

## 2. How do they do mood input, and which patterns are easiest for low-reading users?

### Takeaway
Four main patterns exist: (a) a short emoji or face row (Daylio 5 moods, Stoic 1–5 faces); (b) a single continuous slider with a morphing shape and colour (Apple State of Mind, Reflectly's labelled scale); (c) two-axis narrowing (How We Feel: pleasant or unpleasant, then energy, then a named emotion); (d) preset categories feeding a pet (Finch). For low-reading users, the first step of (a) and (b) needs almost no reading. The richer steps all fall back to **word lists**: Apple's fixed adjectives, How We Feel's 144 words with definitions, Finch's categories. That is exactly where dyslexic users would struggle without icons and read-aloud.

### Cited Findings
- **Apple State of Mind:** users scroll through "multidimensional shapes" from Very Unpleasant to Very Pleasant. Then they pick from Apple's associations and descriptors. — [Apple Newsroom](https://www.apple.com/newsroom/2023/06/apple-provides-powerful-insights-into-new-areas-of-health/)
- The screen colour shifts as you slide: a reviewer reports blue toward unpleasant and orange toward pleasant. Another guide describes very unpleasant as purple, neutral as blue and very pleasant as orange. You "cannot input your own adjective". — [MacRumors iOS 17 Health guide](https://macrumors.com/guide/ios-17-health) and press coverage, via search summary (the two colour descriptions differ slightly)
- On Apple Watch, you turn the Digital Crown to adjust the animation to your mood: up is more positive, down more negative. Optional emotions and "what's having the greatest impact" follow. — [iPhone Life, Log your State of Mind](https://iphonelife.com/content/log-your-state-mind); [Borsainside (Italian)](https://www.borsainside.com/tecnologia/come-monitorare-lo-stato-danimo-con-watchos-10-su-apple-watch/)
- **How We Feel check-in:** (1) pleasant or unpleasant, (2) high or low energy, (3) pick an emotion from a list where "each entry includes a definition", (4) a short reflection on what you were doing, with an optional photo. The first check-in happens in onboarding. — [Problem2Product](https://problem2product.substack.com/p/does-how-we-feel-solve-a-problem)
- A UX analysis says the four-quadrant model "avoids overwhelming users with a long list of feelings" by narrowing progressively. — [Screensdesign, How We Feel](https://screensdesign.com/showcase/how-we-feel)
- User complaint: an update "forced you to open the Reason entry page". — [appfollow, How We Feel reviews](https://apps.appfollow.io/ios/how-we-feel/1562706384?country=mt)
- The Mood Meter's axes are "high or low energy, and pleasant or unpleasant". — [Common Sense Media, The Mood Meter](https://www.commonsensemedia.org/app-reviews/the-mood-meter)
- Hopelab's earlier Mood Meter research with teens found they wanted actionable strategies, not just labels, plus quick sign-up. — [Hopelab, Mood Meter](https://hopelab.org/stories/mood-meter)
- **Daylio:** a row of 5 moods (rad, good, meh, bad, awful), customisable emoji. — [Daylio FAQ](https://daylio.net/faq/docs/daylio-faq/tutorials/create-and-manage-moods/)
- **Stoic:** "faces to judge how 'good' you feel (1-5)". — [Headway Stoic review](https://makeheadway.com/blog/stoic-app-review/)
- **Reflectly (2019):** a sliding scale from "Super Awesome" to "Really Terrible", then "why?". — [MobileSyrup](https://mobilesyrup.com/2019/04/07/reflectly-journaling-app-review/)
- **Finch:** you reflect on how you feel before reaching the pet's home. Preset emotion categories are efficient but fail mixed feelings such as "restless but hopeful". The critic suggests presets plus optional free text or sliders. — [Paste](https://www.pastemagazine.com/article/finch-app-mental-health-virtual-pet-self-care); [Pratt IXD](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/)
- **Ahead:** users draw a happy face as a kinesthetic action instead of tapping. — [Screensdesign, Ahead](https://screensdesign.com/showcase/ahead-emotions-coach)
- Google's Material research found that removing text labels from email actions reduced usability. — [Google Design, Expressive research](https://design.google/library/expressive-material-design-google-research)

### Inferences
- **Easiest for low-reading users:** a 5-item face or emoji row (Daylio/Stoic) and a single slider whose shape and colour change (State of Mind). Both work without reading and give instant visual feedback. How We Feel's two-step narrowing (pleasant/unpleasant then energy) is also readable without words if each step is a large coloured tile. Its third step, a word list with definitions, is reading-heavy.
- Lexi's emoji-first tiles are already the right foundation. To feel premium, Lexi could borrow (1) State of Mind's **continuous morph**: the selected emoji, or a soft blob behind it, changes shape and colour as the user moves between pleasant and unpleasant. It could also borrow (2) How We Feel's **shape grammar**: spiky shapes for high-energy feelings, round for calm. Both encode feeling non-verbally.
- Keep a short text label under every emoji and offer read-aloud. Google's finding that removing labels hurts usability argues against emoji-only tiles.
- Avoid forcing a "reason" step, which drew complaints for How We Feel. Make reflection optional and offer voice input or emoji topics instead of typing.

### Gaps
- I couldn't verify from a primary source the How We Feel quadrant colours that are widely described (yellow for high-energy pleasant, green for low-energy pleasant, blue for low-energy unpleasant, red for high-energy unpleasant).
- No usability study comparing these mood-input patterns with dyslexic or low-literacy users was found.

---

## 3. What typography do they use, and does any use generous sizes by default?

### Takeaway
The best-documented choice is Headspace's custom Aperçu-derived sans (Colophon, 2024), picked for curves that echo its smile and a range "from playful to clinical". The common pattern is a friendly grotesque or geometric-humanist sans at moderate weights (Calm's site displays at 600, "never 800+"). No source showed any of these apps using unusually large body text by default. The dyslexia research favours roughly 18pt or larger, sans or roman, and no italics, which premium apps don't do by default.

### Cited Findings
- Headspace: custom Colophon typeface adapted from Aperçu, "playful... friendly but functional", with curves mimicking the smile (2024). — [It's Nice That](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)
- Calm's website (unofficial): Aktiv Grotesk, display 600 with negative tracking (-2.5px at 72px), body 16px/400 at 1.6 line height, large body 18px, uppercase eyebrows at 12px with +0.16em tracking. — [webdesignhot DESIGN.md (unofficial)](https://www.webdesignhot.com/design.md/calm-app/). Conflicting unofficial sources name Visby Round or Figtree. — [shadcn.io Calm](https://www.shadcn.io/design/calm/raw)
- Day One offers Hoefler faces (Whitney, Ideal Sans, Sentinel) in the editor (older release). — [The Sweet Setup](https://thesweetsetup.com/day-one-3-4-introduces-new-fonts-drawing-and-apple-watch-improvements/)
- Reflectly's custom type was cited as part of its award-winning distinctiveness. — [Google Design 2019](https://design.google/library/material-design-awards-2019)
- Material 3 Expressive includes "emphasized typography" (via a community package summary, not official docs). — [pub.dev material_expressive](https://pub.dev/packages/material_expressive)
- Dyslexia research: sans serif, roman and monospaced fonts (Helvetica, Arial, Verdana, Courier, CMU) are good for dyslexic readers, and italics hurt (Rello and Baeza-Yates, ASSETS 2013). — [Change Dyslexia publications](https://www.changedyslexia.org/publications/pdfs/2013-ASSETS-An iOS Reader Dyslexia.pdf); [summary](https://a11y-paradise.onrender.com/reviews/69c089c6b56623a3e201b1ee)
- "Size Matters (Spacing Not)" (W4A 2013, 28 dyslexic participants, 10–26pt): font size significantly affected readability and comprehension, line spacing did not, and it recommends 18pt for web text. Another study found dyslexic participants preferred 22–26pt, the largest offered. — [Size Matters summary](https://a11y-paradise.onrender.com/reviews/69c083aebb27ccd8963e779f)

### Inferences
- A premium feel comes from **one well-crafted sans family used at a disciplined scale with few weights**, not from novelty fonts. Lexi can get a "Headspace-like" warmth from a rounded or humanist sans at weights 500–700, set large (body around 18–20pt equivalent, with 22pt+ options).
- Some premium tactics conflict with dyslexia guidance and should **not** be copied: tight negative tracking on display type (Calm), small uppercase tracked "eyebrow" labels (11–12px caps), italics for quotes, and thin light weights. Letter-spacing guidance for dyslexia, such as the British Dyslexia Association Style Guide's wider spacing, was not fetched in this session. Verify it against the dyslexia-typography researcher's notes.
- Large type can still look premium if hierarchy comes from weight, colour and space rather than many sizes.

### Gaps
- In-app typefaces for How We Feel, Finch, Gentler Streak, Daylio, Opal, Stoic and Apple Journal were not confirmed. Apple's apps presumably use SF Pro and SF Rounded, but that wasn't verified here.
- No evidence was found of any of these apps defaulting to large body sizes, or about how they respond to iOS Dynamic Type.

---

## 4. Colour and surface: gradients, shadows, glass, grain, dark-first, illustration styles; 2025–26 trends and their accessibility

### Takeaway
The category splits into warm, bright and illustrated (Headspace orange and cream, Reflectly vibrant on white, Daylio cheerful) versus dark, deep and atmospheric (Calm's navy twilight gradients and colour-graded nature photos, Stoic black and white, Opal's dark UI with a gem). Both 2025 platform trends matter. Apple's Liquid Glass (iOS 26) drew strong legibility criticism from NN/g, and Apple added a "Tinted" opacity option in iOS 26.1. Google's Material 3 Expressive is backed by research showing larger, high-contrast, contained controls are found up to 4x faster. Expressive colour, size and containment transfer well. Translucency over busy content is risky.

### Cited Findings
- Headspace's palette is deliberately bright, against the "dreary sea of blues and greys", with accessibility-checked combinations. — [It's Nice That](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)
- Unofficial: Headspace avoids pure black and white and uses colour-tinted (not grey) shadows. It has palettes per state: calm (blue and sage), focus (orange), sleep (deep navy with stars). — [Blake Crosley (third-party)](https://blakecrosley.com/guides/design/headspace)
- Unofficial: Calm.com uses a navy canvas, slowly animated twilight gradients, a navy overlay of about 60–70% on photo heroes, star-field dots, colour-tinted glow shadows, and "dark-first" app styling. — [webdesignhot (unofficial)](https://www.webdesignhot.com/design.md/calm-app/)
- Opal uses a gem that grows brighter and more intricate with progress. A third-party walkthrough shows dark onboarding screens. — [Opal blog](https://opal.so/blog/introducing-the-new-opal-home-screen-track-your-screen-time-and-improve-your-focus); [Screensdesign, Opal](https://screensdesign.com/apps/opal-screen-time-control/?vs=132825)
- Reflectly's "novel elevation model" raises items to show hierarchy. — [Google Design 2019](https://design.google/library/material-design-awards-2019)
- **Liquid Glass (June 2025):** Apple says it "uses real-time rendering and dynamically reacts to movement with specular highlights", and its colour adapts to surrounding content and light or dark environments. — [Apple press release reprint, Silicon UK](https://www.silicon.co.uk/press-release/apple-introduces-a-delightful-and-elegant-new-software-design)
- HIG guidance (via secondary summaries): Liquid Glass is a functional layer for controls and navigation above content, with the instruction "Don't use Liquid Glass in the content layer". Regular glass is for text-heavy surfaces and Clear glass for media-rich backgrounds. Avoid stacking glass on glass. — [RVS Media](https://www.rvsmedia.co.uk/?p=11229); [Blake Crosley, Liquid Glass patterns](https://blakecrosley.com/blog/liquid-glass-swiftui-patterns); [Apple Developer Forums](https://developer.apple.com/forums/topics/design-topic)
- **NN/g critique** (Raluca Budiu, 10 Oct 2025, "Liquid Glass Is Cracked, and Usability Suffers in iOS 26"): translucent text and icons lose contrast over busy imagery. Text over text in Mail is an "illegible mess". Pale translucent search bars fade away. Controls bubble, wiggle and pulsate, so the UI is "shouting". Shimmering titles bring distraction "with a side of nausea". Tap targets are cramped. — [NN/g](https://www.nngroup.com/articles/liquid-glass/)
- iOS 26.1 added Settings > Display & Brightness > Liquid Glass with Clear and Tinted options. Tinted raises opacity and contrast after readability complaints. Reduce Transparency remains the stronger fix. — [TidBITS](https://talk.tidbits.com/t/ios-26-1-to-add-optional-opacity-to-liquid-glass/32182); [Cult of Mac](https://www.cultofmac.com/guide/ios-26-1-new-features); [Six Colors](https://sixcolors.com/?p=37413)
- Fast Company reported UX specialists saying Liquid Glass "creates accessibility issues where there were none in the OS before". — [Fast Company ME](https://fastcompanyme.com/?p=41660)
- **Glassmorphism accessibility** (Axess Lab, Jun 2025): semi-transparent text backgrounds often fail WCAG 4.5:1. Blur alone doesn't guarantee legibility, so add overlays. Avoid heavy blur (20px and up), which strains the eyes and costs GPU. Honour `prefers-reduced-transparency` and `prefers-reduced-motion`. Keep critical info off textured or animated backgrounds. Busy or moving backgrounds are hard for people with cognitive or focus difficulties. — [Axess Lab](https://axesslab.com/?p=5111)
- **Material 3 Expressive** (Google, 2025): 46 studies, 18,000+ participants, about 3 years of work. Key elements were spotted up to 4x faster. Users aged 45+ were as fast as younger users. It was more appealing and easier for people with "varying movement and visual abilities" thanks to larger buttons and high-contrast containment. Preference peaked at 87% among 18–24s. Cautions: "a strong minority preferred calmer, less intense designs", breaking familiar patterns hurt usability, removing labels hurt, and "No amount of expressive design will beat basic functionality." — [Google Design](https://design.google/library/expressive-material-design-google-research)
- Community implementations cite M3 Expressive spring motion and a 35-shape morph library (heart, flower, cookie, burst, gem). These are not official numbers. — [pub.dev material_expressive](https://pub.dev/packages/material_expressive)
- **Dyslexia and background colour** (Rello and Bigham, ASSETS 2017; 341 participants, 89 with dyslexia; Spanish speakers): warm backgrounds (peach, orange, yellow) significantly improved reading performance over cool ones (blue, blue-grey, green), for both groups. — [Change Dyslexia, Good Background Colors PDF](https://www.changedyslexia.org/publications/pdfs/2017-ASSETS-Good%20Background%20Colors.pdf)
- A 2026 Open University of Israel poster found a consistent preference for cream backgrounds among readers with dyslexia, though only one measure was significant. — [OpenU Chais 2026](https://www.openu.ac.il/chais_2026/244/)

### Inferences
- **Transfers well:** warm tinted surfaces (cream, peach) instead of stark white; colour-tinted soft shadows; a large-radius rounded shape language; M3-Expressive-style large, high-contrast containers for primary actions; a signature accent colour. Lexi's cream and orange themes already match both premium practice and the warm-background research.
- **Mixed:** the mint and purple themes. Cool backgrounds were associated with slower reading in Rello and Bigham. Keep cool hues as accents and illustration colour, not reading surfaces, or warm them slightly.
- **Risky:** Liquid Glass or glassmorphism on chat bubbles, journal entries or any text-bearing surface. HIG itself says not in the content layer. Animated gradients behind text. Text over photos. Grain and noise textures under body text (Axess Lab: keep critical information off textured backgrounds). If Lexi uses glass, limit it to the tab bar or toolbar, use an opaque fallback, and honour Reduce Transparency.
- The night theme should follow Calm's navy-not-black approach (#0a1f3a-style deep blue, off-white #fafafa text) rather than pure black, while keeping contrast high. No dyslexia-specific dark-mode evidence was found.

### Gaps
- I found no source showing which of these apps use grain or noise textures.
- I found no dyslexia-specific research on dark mode, gradients behind text, or Liquid Glass.
- The official Apple HIG Materials page was not fetched directly. The guidance above is quoted through secondary sources.

---

## 5. Micro-interactions: haptics, sound, celebrations, streaks, transitions, loading states. What's calming and what's overstimulating?

### Takeaway
Premium calm apps use **slow, breath-paced motion**: Headspace kept "breath-driven animations" in its rebrand, and unofficial analyses put Headspace transitions at 500–1000ms with eased curves, against the typical 250–300ms. They also use gentle haptics and **non-punitive streaks** (Gentler Streak never resets on a break, Opal avoids guilt). The overstimulating failures are purposeless motion (NN/g on Liquid Glass "shouting"), parallax that can cause nausea, and missing feedback, as when Finch journaling sometimes shows no animation.

### Cited Findings
- Headspace kept "breath-driven animations" throughout the 2024 rebrand to simplify complex ideas. — [It's Nice That](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)
- Unofficial Headspace analysis: breathing circle with a 4s inhale (scale 40% to 100%, blue to orange), 2s hold with a glow pulse, and a 6s exhale. Page transitions take 500ms. Entering a meditation takes 800ms with `cubic-bezier(0.16,1,0.3,1)`, scaling 0.95 to 1. Session complete takes 1000ms with a 1.02 overshoot. Sleep controls fade out over 30s. The author contrasts this with typical 250–300ms. — [Blake Crosley (third-party, illustrative)](https://blakecrosley.com/guides/design/headspace)
- Unofficial Calm analysis: breathing pulse scale 1.0 to 1.15 over 5000ms, a 12s gradient cycle, 2.4s star twinkle, 400ms page fade, button press to 0.97. Reduced motion collapses these to opacity or static. — [webdesignhot (unofficial)](https://www.webdesignhot.com/design.md/calm-app/)
- How We Feel's engineer singled out the haptics API as a joy to work with in the Mood Meter. — [How We Feel Substack](https://howwefeel.substack.com/p/we-feelgrateful)
- Finch: completing tasks makes the bird gain energy, play joyful animations or show messages like "Your Finch feels calmer". But journaling sometimes triggers no animation, so users aren't sure input was saved. — [Pratt IXD](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/)
- One commentator notes that Finch's bird grows when you care for yourself instead of showing a red mark for missed days. — [Screenwise](https://screenwiseapp.com/media/finch-app)
- Gentler Streak: streaks reward consistency, not perfection, and a break doesn't reset progress. You can set a status for injury, illness or rest. — [Gentler Stories](https://gentlerstories.com/gentlerstreak/)
- Opal: "Guilt-tripping or scary screen time stats are counter productive." — [Opal blog](https://opalapp.com/blog/designing-for-wellbeing)
- Ahead uses treasure chests with collectible comics on lesson completion. — [Screensdesign, Ahead](https://screensdesign.com/showcase/ahead-emotions-coach)
- Reflectly won for "artfully executed motion choreography" in how elements appear on screen. — [Google Design 2019](https://design.google/library/material-design-awards-2019)
- NN/g: Liquid Glass controls animate "without a clear user benefit" (bubbling, wiggling, pulsating), and shimmering text causes distraction "with a side of nausea". — [NN/g](https://www.nngroup.com/articles/liquid-glass/)
- Axess Lab: parallax and layered transitions can cause lightheadedness or nausea for vestibular users. Shorten them and honour `prefers-reduced-motion`. — [Axess Lab](https://axesslab.com/?p=5111)
- Breathwrk pairs breathing pacing with haptic vibrations and sound. Academic work notes that most paced-breathing apps rely on audio and visual cues rather than haptic ones. — [Toolradar](https://toolradar.com/logo/breathwrk); [SIGGRAPH, Bumatay and Seo](https://history.siggraph.org/?p=88385)
- Opinion (neurodivergent blog, not research): visual and audio notifications can feel "invasive and overstimulating" for ADHD users, while a gentle haptic buzz is low-stimulation. — [Muddle Mend ADHD Substack](https://muddlemendadhd.substack.com/p/the-grounding-buzz-why-haptic-feedback)
- Some ADHD-targeted habit apps market "confetti" and "satisfying animations" as features, which is developer copy rather than evidence. — [Dopamine Counter, App Store](https://apps.apple.com/us/app/tally-counter-widget-tracker/id6480589201)

### Inferences
- For Lexi: use **one consistent, gentle confirmation** for every save (a soft haptic tick, the emoji settling with a slight overshoot, a short "Saved" read aloud). Finch shows that inconsistent feedback undermines trust.
- Prefer slow, eased transitions (400–800ms) on emotional moments, and quick ones (about 200ms) on routine taps. Avoid looping ambient motion behind text.
- The butterfly could "breathe" or flutter only on meaningful events (a check-in done) and rest otherwise. Gate all motion behind reduced-motion settings.
- Streaks: copy Gentler Streak and Finch's non-punitive framing, with no broken-streak alarms and rest days that count. Celebrations should be small and optional, since evidence on confetti for neurodivergent users is anecdotal and mixed.
- Sound: optional, soft, and never auto-playing alongside read-aloud. No sound-design specifics were found for the premium apps.

### Gaps
- No primary source detailed the haptic patterns or sound design of Calm, Headspace, How We Feel or Finch.
- No peer-reviewed evidence was found on celebratory animations or confetti for dyslexic or ADHD users.
- No info was found on these apps' loading states, except Opal's dark spinner screen.

---

## 6. Characters and mascots: how do companions feel premium rather than childish, and what makes adults and teens accept them?

### Takeaway
The successful companions are **simple, emotionally ranged, non-judgmental and reactive to the user's own actions**. Finch's bird grows with your self-care. Gentler Streak's Yorhart is "never judging, just cheering you on". Headspace's faces now show stress and sadness, not just joy. Wysa is a "pocket penguin which learns and grows wiser with you". Opal evolves "based on how you're feeling". The premium versions sit inside a grown-up typographic and colour system (Headspace's rebrand aimed for a "more professional persona" with a typeface that flexes "from playful to clinical"). Childishness creeps in through clutter, shops and cosmetics, and over-customisation up front.

### Cited Findings
- Headspace's 2024 rebrand: a more professional persona while keeping playfulness. Faces show stress, sadness and contentment, plus photography for clinical services. — [It's Nice That](https://www.itsnicethat.com/articles/italic-studio-headspace-graphic-design-project-250424)
- Headspace's earlier characters "were never meant to be brand mascots". The brand mark is the orange Dot. — [Made Good Designs](https://madegooddesigns.com/headspace-font/)
- Anna Charity's goal was making meditation feel ordinary, not "hippy". — [Creative Lives in Progress](https://creativelivesinprogress.com/articles/anna-charity)
- Unofficial: Headspace characters have minimal faces (two dots and a curve, no nose, ears or teeth), with emotion carried by posture and colour, and are always doing something. — [Blake Crosley (third-party)](https://blakecrosley.com/guides/design/headspace)
- How We Feel uses abstract shapes as "canvases" for expressive characters, keeping "feelings at the center" rather than a mascot. — [How We Feel Substack](https://howwefeel.substack.com/p/we-feelgrateful)
- Finch: the bird reflects your self-care. A reviewer says breathing exercises feel like "a favor for the pet rather than a chore". The name comes from Atticus Finch and finches' social nature. — [Disha Bhatia Substack](https://dishabhatia.substack.com/p/the-self-care-bird-app-finch); [Android Authority](https://cellphoneplans.androidauthority.com/CellPhones/Guides/finch-self-care-app-review)
- Finch's critique: front-loaded customisation (colours, traits, naming) crowds out users who just want to start. It suggests meeting the Finch first and customising later. Cosmetics and shops clutter the home screen. — [Pratt IXD](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/)
- Wysa calls its bot "a pocket penguin which learns and grows wiser with you". The cofounder wanted "something empathetic, something that felt like a friend". — [Wysa FAQ](https://www.wysa.io/faq); [AppsHunter interview (snippet)](https://appshunter.io/editorials/1614514977)
- Gentler Streak's Yorhart: "Always there, never judging, just cheering you on." — [Gentler Stories](https://gentlerstories.com/gentlerstreak/)
- Ahead's friendly ghost mascot "softens the topic of mental health". — [Screensdesign, Ahead](https://screensdesign.com/showcase/ahead-emotions-coach)
- Opal: "the friend you want by your side". The mascot is meant to evolve with how users feel. — [Opal blog](https://opalapp.com/blog/designing-for-wellbeing)
- Creative Review (Ellie Howard, 6 Jan 2026) on the wave of deliberately cute self-care apps (Focus Friend's knitting bean, Quabble's duck in a strawberry hat, Aloe Bud). It ties the trend to "Labubu mania", claims "growing evidence that cuteness is a reliable design strategy" (studies not visible in the excerpt), and argues these apps are "far from infantile". — [Creative Review](https://www.creativereview.co.uk/self-care-app-design-cute/)
- Bears Gratitude (cute bears) won ADA 2024 Delight and Fun as "a warm and welcoming way" to keep a gratitude habit, showing Apple rewards cute-but-crafted. — [Apple Design Awards 2024](https://developer.apple.com/design/awards/2024/)
- Hopelab's teen research: teens wanted actionable strategies, not just labels. — [Hopelab](https://hopelab.org/stories/mood-meter)
- Academic: chatbots are more accepted in mental health than physical health, and the dissertation recommends humanised entities for mental-health chatbots. — [Universidade Católica Portuguesa repository](https://repositorio.ucp.pt/entities/publication/27200656-4dae-4300-b901-aa9d2e20e7e4/full)

### Inferences
- What reads as premium and adult: a **minimal, consistent drawing style** (few features, one line weight, limited palette); an **emotional range** (the companion can be tired, sad or calm, not just cheerful); a **supporting role** (reacts to the user and never nags or guilts); and a mature surrounding system (typography, spacing). What reads as childish: bright primaries everywhere, constant bouncing, shops and cosmetics on the main path, baby talk, and forced customisation up front.
- Lexi's butterfly could follow the Headspace and How We Feel model. Make it an elegant, simple mark: a few smooth shapes, maybe built from the same rounded shape language as the mood tiles, tinted by the active theme. Let it mirror the user's chosen mood colour and appear at moments (greeting, saved, read-aloud) rather than as permanent decoration. That also keeps visual noise down for dyslexic readers.
- Butterflies come with a ready visual metaphor (calm, change, lightness), which suits the "visual metaphors are key" approach.

### Gaps
- No peer-reviewed study was found on adult or teen acceptance versus rejection of cute mascots in wellness apps. The Creative Review article's evidence was paywalled.
- I couldn't confirm Finch's art-direction specifics (palette, line style) or demographics.
- Wysa's reasoning for a non-gendered penguin is unverified.

---

## 7. What do design critiques, case studies, awards and user reviews say about polish?

### Takeaway
Award juries praise **consistency, subtlety and a kind tone**: Apple on Gentler Streak, and Google on Reflectly's motion and elevation. Reviewers praise **asset quality and character**: How We Feel's "all assets are of high quality". Critics penalise **clutter, text-heavy screens, upsell prompts and feedback gaps** (Finch, Day One, Ahead, Opal before its redesign). Beauty alone isn't enough: How We Feel's visualisations looked great but didn't produce insight.

### Cited Findings
- Apple ADA 2024 on Gentler Streak: "subtle and consistently pleasing design language", with data "smartly organized" and progress framed without "hard comparisons". — [Apple Design Awards 2024](https://developer.apple.com/design/awards/2024/)
- Wellness apps among 2024 ADA finalists: How We Feel and Ahead (Social Impact), Tiimo (Inclusivity, a neurodivergent-focused planner), and Meditate (Visuals and Graphics). — [Apple Design Awards 2024](https://developer.apple.com/design/awards/2024/)
- Google 2019 on Reflectly: motion choreography, elevation model, custom components and type, and a "recognizable, usable, and enjoyable" product. — [Google Design](https://design.google/library/material-design-awards-2019)
- How We Feel: "simple and beautifully designed... all assets are of high quality", but "the beautiful visualisation wasn't enough for me to spot patterns". — [Problem2Product](https://problem2product.substack.com/p/does-how-we-feel-solve-a-problem)
- Day One: "sleek, responsive, and intuitive", but the Today page is too text-heavy. The 2023 entry-preview change was criticised for "wasted space". — [Pratt IXD 2026](https://ixd.prattsi.org/2026/09/design-critique-day-one-iphone-app/); [Day One forums](https://forums.dayoneapp.com/forums/topic/please-change-the-entry-preview-layout-to-how-it-was-before/)
- Day One later brought back journal background colours in headers after feedback (2024). — [Day One, Nov 2024](https://dayoneapp.com/?p=76330)
- Opal: an earlier home screen was "too complex and hard to read" and was simplified to a bar chart. — [Opal blog](https://opal.so/blog/introducing-the-new-opal-home-screen-track-your-screen-time-and-improve-your-focus)
- Finch: clutter and frequent premium prompts; journaling feedback is inconsistent. — [Pratt IXD](https://ixd.prattsi.org/2025/09/design-critique-finch-ios-app-2/)
- Ahead: completed and new lessons get equal visual weight on the dashboard, which is confusing. The AI chat entry is hidden. — [Screensdesign, Ahead](https://screensdesign.com/showcase/ahead-emotions-coach)
- Stoic's "stark user interface" drew a reviewer in. — [MobileSyrup](https://mobilesyrup.com/2019/06/09/stoic-self-reflection-journaling-app-review/)

### Inferences
- Polish signals Lexi can control cheaply: one primary action per screen; bespoke, consistent illustration (one butterfly style, one tile style); clear selected states; consistent save feedback; no upsell interruptions in the check-in flow; and the journal history shown visually (colour and shape per entry, like How We Feel's emotion colours and Day One's journal colours), not as text-heavy lists.

### Gaps
- Mobbin flows, Behance and Dribbble official case studies, and Fast Company coverage of these apps were not accessed.

---

## 8. Which premium techniques transfer well to a dyslexia-friendly app, and which are risky?

### Takeaway
Most of what makes these apps feel premium (restraint, warm tinted surfaces, rounded consistent shape language, large high-contrast primary controls, slow purposeful motion, non-judgmental companions, consistent feedback) is compatible with, or actively helpful for, dyslexic and neurodivergent users. The risky techniques are the ones that degrade text: translucency or glass behind words, text over photos or animated gradients, tight or uppercase-tracked small type, italics, thin weights, word-heavy emotion lists, purposeless or looping motion, and clutter.

### Cited Findings
- Warm backgrounds (peach, orange, yellow) improved reading over cool (blue, blue-grey, green). — [Rello and Bigham 2017](https://www.changedyslexia.org/publications/pdfs/2017-ASSETS-Good%20Background%20Colors.pdf)
- 18pt or larger improves dyslexic readability. Sans and roman fonts are good, italics are bad. — [Size Matters summary](https://a11y-paradise.onrender.com/reviews/69c083aebb27ccd8963e779f); [Good fonts summary](https://a11y-paradise.onrender.com/reviews/69c089c6b56623a3e201b1ee)
- Larger buttons and high-contrast containment made controls up to 4x faster to find and closed the age gap. Removing labels hurt. A strong minority prefers calmer designs. — [Google Design](https://design.google/library/expressive-material-design-google-research)
- Translucent UI over busy content loses contrast. Purposeless motion "shouts". — [NN/g](https://www.nngroup.com/articles/liquid-glass/)
- Keep critical info off textured or animated backgrounds, avoid blur of 20px or more, and honour reduced transparency and reduced motion. — [Axess Lab](https://axesslab.com/?p=5111)
- Apple's own guidance keeps Liquid Glass out of the content layer. — [RVS Media summary of HIG](https://www.rvsmedia.co.uk/?p=11229)
- How We Feel's progressive narrowing keeps users from being overwhelmed. Its word list with definitions is the reading-heavy step. — [Screensdesign, How We Feel](https://screensdesign.com/showcase/how-we-feel); [Problem2Product](https://problem2product.substack.com/p/does-how-we-feel-solve-a-problem)
- Non-punitive streaks and guilt-free tone. — [Gentler Stories](https://gentlerstories.com/gentlerstreak/); [Opal blog](https://opalapp.com/blog/designing-for-wellbeing)

### Inferences

**Transfers well (adopt):**
1. **Warm tinted surfaces** (cream, peach, soft orange) with off-white rather than pure white, and deep navy rather than pure black for night. This matches both Headspace and Calm practice and the warm-background research.
2. **One rounded shape language** used for tiles, bubbles, buttons and the butterfly (generous radii, 20–28px on tiles), plus **soft colour-tinted shadows** for depth instead of borders or glass.
3. **Large, high-contrast, contained primary actions** (M3 Expressive). One per screen.
4. **Non-verbal emotion encoding:** colour plus shape plus emoji (How We Feel's spiky versus round, State of Mind's morph) so mood can be picked without reading, with labels kept and read-aloud available.
5. **Slow, eased, breath-paced motion** for emotional moments, consistent save feedback (soft haptic, a settle animation, a spoken confirmation), all respecting reduced motion.
6. **Kind, non-judgmental tone and streaks** (Gentler Streak, Opal, Finch).
7. **A simple, emotionally ranged companion** that reacts to the user and appears at moments, not constantly (Headspace faces, Yorhart, Wysa).
8. **A disciplined type system**: one sans family, few weights (500–700), large body size, with hierarchy from weight, colour and space.

**Risky (avoid or constrain):**
1. Glassmorphism or Liquid Glass on chat bubbles, journal entries or tiles with text. Limit it to the navigation chrome, with opaque fallbacks.
2. Text over photos, animated gradients, grain or noise, or star fields.
3. Negative letter-spacing on headings, small uppercase tracked labels, italics, and thin or light weights (common "premium" tells in Calm-style systems).
4. Word-list-heavy emotion pickers (Apple's adjective lists, How We Feel's 144 words) unless each word has an emoji or icon and read-aloud.
5. Looping ambient motion, parallax, shimmering text, and bouncy controls without purpose (NN/g's Liquid Glass critique).
6. Full-screen confetti or sound bursts by default. Make celebrations small and optional.
7. Cool-hued reading surfaces (mint, purple) as body-text backgrounds. Use those hues as accents.
8. Clutter: shops, cosmetics, upsell prompts or multiple equal-weight cards on the main screen (Finch, Ahead critiques).

### Gaps
- No study was found that tests premium aesthetic techniques (glass, gradients, dark mode, mascots) specifically with dyslexic users. The transfer assessment combines general dyslexia reading research, WCAG-style contrast guidance and usability critiques.
- Dark mode and dyslexia, and OpenDyslexic versus standard fonts, were outside what this session verified. Check the parallel dyslexia-typography notes.
