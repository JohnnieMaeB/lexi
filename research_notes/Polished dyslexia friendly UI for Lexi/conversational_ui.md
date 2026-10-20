# Accessible, polished conversational UI and voice-first patterns for low-reading users (Lexi)

Evidence tags used throughout: **[Study]** = peer-reviewed or preprint empirical work; **[Expert]** = standards, design-system guidance, or practitioner writing; **[Product]** = what shipping products do (precedent, not proof); **[Reg]** = law or professional-body advisory. **[Older]** marks sources from before 2023. Research date: October 2026. Many paywalled papers (ACM DL, Taylor & Francis, ScienceDirect, PMC) returned 403 or bot checks, so several study findings below come from abstracts or search snippets rather than full text; those are flagged "(abstract-level)".

## 1. Message presentation: bubbles vs bubble-less, length and chunking, streaming, typing indicators, grouping, scrollback, focus

### Takeaway
No study compares bubble and bubble-less layouts or tests word-by-word streaming with slow or dyslexic readers. Product and design-system precedent has settled on this pattern: the user's turn sits in a bubble, and the assistant's turn is open, width-capped text. Cognitive-accessibility guidance strongly favors small chunks that the user advances. For Lexi, the safest premium pattern is one short assistant chunk at a time, revealed whole, not token by token, or revealed in sync with read-aloud, with the user in control of pace.

### Cited Findings
- **[Expert]** Toyota Europe's AI chat component guidance puts user messages in a bubble aligned to the end and assistant replies as open text aligned to the start. It caps messages at a readable width of about 558px, "never span[ning] the full width of a wide panel, so long replies stay scannable." — [Toyota DX Playbook, chat messages](https://dx-playbook-prev.toyota-europe.com/cds/components/chat-messages-pages/design/)
- **[Expert]** Siemens iX's AI message component sets assistant message width at 45% to 80% of the chat container depending on viewport, and recommends it for answers users must read and act on. — [Siemens iX AI message guide](https://ix.siemens.io/docs/components/ai-message/guide)
- **[Expert]** No source explains why ChatGPT or Claude chose bubble-less assistant turns. The community is not uniform, and some templates still use bubbles on both sides. — [search of design-system/template sources, e.g. shadcn.io AI chat block](https://www.shadcn.io/blocks/ai-chat-fullscreen)
- **[Expert, secondary]** NN/g usability research is quoted as finding that chatbots can display "only a very small amount of information at a time," because information arrives one turn at a time, which makes ordering a key design decision. This is a secondary citation, and the NN/g original was not retrieved. — [Lovable guide citing NN/g](https://lovable.dev/guides/how-to-build-a-chatbot-ui)
- **[Expert]** The W3C COGA patterns that apply to message chunking are 4.4.5 "Keep Text Succinct," 4.4.9 "Separate Each Instruction," 4.4.10 "Use White Spacing," 4.3.5 "Break Media into Chunks," and 4.6.3 "Avoid Too Much Content." For control and stability, 4.5.1 "Ensure Controls and Content Do Not Move Unexpectedly" and 4.9.1 "Let Users Control When the Content Moves or Changes" apply. This is a W3C Working Group Note dated 29 April 2021 [Older, but it remains the current COGA note]. — [W3C, Making Content Usable for People with Cognitive and Learning Disabilities](https://www.w3.org/TR/coga-usable/)
- **[Study]** "Streaming, Fast and Slow" (arXiv 2504.17999, 2025) ran crowdsourced studies with a simulated streaming interface. It estimated each participant's comfortable reading speed and had participants flag pauses as too fast or too slow. The authors note that complex content "may be streamed faster than users can comfortably read," and they propose adapting stream pace to content complexity. Reported sample sizes differ between the abstract (100 and 200) and the study section (100). — [arXiv 2504.17999](https://arxiv.org/pdf/2504.17999)
- **[Expert]** A Microsoft engineering blog recommends revealing streamed chunks with a ~33 ms `setTimeout` per chunk for a "smooth, word-by-word reveal." That rate is fast-reader pacing, and the post is an implementation note, not a user study. — [Microsoft Tech Community, importance of streaming](https://techcommunity.microsoft.com/blog/azuredevcommunityblog/the-importance-of-streaming-for-llm-powered-chat-applications/4459574)
- **[Expert, secondary]** OpenAI's latency guide is quoted as ranking streaming as the single most effective lever for *perceived* latency, and typing indicators and streaming are framed as social signals that "maintain the conversational contract." — [parallelhq, UX for AI chatbots](https://www.parallelhq.com/blog/ux-ai-chatbots); [Lovable guide](https://lovable.dev/guides/how-to-build-a-chatbot-ui)
- **[Study, Older]** In Gnewuch et al. (ECIS 2018), dynamic response delays increased perceived humanness and social presence and raised satisfaction in a customer-service chatbot. — [AIS eLibrary, ECIS 2018](https://aisel.aisnet.org/ecis2018_rp/113/)
- **[Study, Older]** Gnewuch et al. (SIGHCI 2018) found that graphical typing indicators increase chatbot social presence, but only for novice users. — [AIS eLibrary, SIGHCI 2018](https://aisel.aisnet.org/sighci2018/14/)
- **[Study]** Gnewuch et al. (BISE 2022, N=202 lab experiment) found that delayed responses have opposing effects: social presence goes up while usage intention can go down, moderated by prior chatbot experience. Supplementary material reports no perceptual difference between dynamic and static delays. — [BISE vol 64 iss 6](https://aisel.aisnet.org/bise/vol64/iss6/5); [ESM PDF](https://media.springernature.com/original/springer-static/esm/art%3A10.1007%2Fs12599-022-00755-x/MediaObjects/12599_2022_755_MOESM1_ESM.pdf)
- **[Expert, secondary]** A guide cites a peer-reviewed study in which a typing indicator significantly mitigated the negative effect of long response latency. — [Lovable guide](https://lovable.dev/guides/how-to-build-a-chatbot-ui)
- **[Product]** Since 25 Nov 2025, ChatGPT Voice runs inside the normal chat thread on mobile and web. Spoken replies appear as a live transcript, users can scroll back through earlier messages, and maps and weather render inline. The old separate full-screen orb mode remains under Settings → Voice → Separate Mode. — [Tom's Guide](https://www.tomsguide.com/ai/chatgpt-now-lets-you-enable-voice-mode-directly-inside-your-chat-without-switching-heres-how); [Digit](https://www.digit.in/news/general/chatgpt-voice-now-works-right-inside-chats-with-live-transcripts-check-details.html/amp/); [OpenAI Help](https://help.openai.com/articles/8400625)
- **[Expert]** For screen readers, don't make the streaming body the announcement target, because partial text gets read in fragments. Announce short status messages ("Lexi is replying", "Reply ready") from a separate element instead. — [azukiazusa, accessible streaming chat UI](https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui)

### Inferences
- **Layout spec (inference from design-system precedent plus COGA):** Render Lexi's turns as a borderless "card on canvas," or a very soft tinted surface, at full content width but capped at a reading measure (roughly 520–600px on web; full width minus a 16–20px gutter on phones). Render the user's answers as compact right-aligned "answer chips," for example the chosen emoji at a large size plus a small label. This matches the modern ChatGPT/Claude look that reads as premium and keeps a strong, non-color-only speaker distinction. Distinguish speakers by alignment, a small avatar or orb glyph on Lexi's first message in a group, and a hidden heading for screen readers (see section 6). Don't rely on color alone.
- **Chunking spec:** Keep one idea per assistant message, about 1–2 short sentences (roughly 8–20 words). Insert a "tap for next" (or auto-advance-after-TTS) gate between chunks. Lexi's existing tap-for-next pace is directly supported by COGA patterns 4.3.5, 4.6.3 and 4.9.1. Keep it as the default rather than an option.
- **Streaming spec:** No direct evidence exists for dyslexic readers. Because comfortable reading speed varies and default streaming targets fast readers, the lowest-risk choice is this. (a) Show a typing or "thinking" state for a short fixed beat (~600–1200 ms). (b) Reveal each chunk whole with a gentle 150–250 ms fade, or reveal it in step with TTS word timing when read-aloud auto-plays. (c) Never move text that the user is mid-reading. Word-by-word streaming of a long message would push content and scroll position around while a slow reader is still decoding, which works against COGA 4.5.1.
- **Typing indicator:** Typing indicators help novices feel social presence, and delays can reduce intent to use. Keep the indicator, but keep it short, and pair it with Lexi's character state ("thinking") rather than three bouncing dots. Under reduced motion, use a static "Lexi is thinking…" label or a slow opacity pulse.
- **Timestamps and grouping:** No evidence was found specific to low readers. Inference: hide per-message timestamps and show a single day or session divider ("This morning", "Tuesday") as text plus an icon. Group consecutive Lexi chunks under one avatar.
- **Scrollback and losing your place:** Pin the newest message near the vertical center or top of the reading area, not the bottom edge, so it sits in the comfortable gaze zone. When the user has scrolled up, don't auto-scroll. Show a "New message ↓" pill instead (common messaging precedent; no study found). Dim older turns slightly (for example to 70% opacity) so the active chunk is visually obvious. This is a soft focus treatment, not a contrast failure, as long as dimmed text still meets 4.5:1.

### Gaps
- No study found that compares bubble and bubble-less chat layouts for comprehension, preference, or speaker identification, for dyslexic users or anyone else.
- No study found on word-by-word LLM streaming versus whole-chunk reveal for dyslexic, low-literacy, or IDD readers. The "Streaming, Fast and Slow" full text was not checked for results split by reading speed.
- NN/g's original articles on chatbot information density and on streaming were not retrieved; the claims above are secondary.
- No evidence was found on timestamps, grouping, or "jump to latest" patterns for low readers.

## 2. Choices in chat: quick-reply chips vs cards vs inline buttons, how many, sizes, keeping or collapsing old choices, undo

### Takeaway
Evidence is split. Buttons and tiles improve ease and pragmatic usability, especially for lower-educated users. Free text supports self-expression and therapeutic bond but frustrates users when the bot misreads it. For a dyslexic journaling companion this points to tiles as the primary input, with an always-available "say it / something else" escape hatch, small option sets, large targets, and easy change or undo.

### Cited Findings
- **[Expert, Older/legacy]** Google's Assistant conversation design guidance allows at most 8 suggestion chips per turn, each at most 25 characters. Chips should be concise and lead with a verb when they start an action. For broad questions, chips should cover the full range of options. On screenless devices, suggestions belong in the spoken prompt and should not appear in both places. Note from my own background knowledge, not verified this session: Google sunset Conversational Actions in 2023, so this is legacy guidance. — [Google conversation design: chips](https://developers.google.cn/assistant/conversation-design/chips); [suggestions](https://developers.google.com/assistant/conversation-design/suggestions?hl=en)
- **[Expert]** NN/g separates use-case prompt suggestions (which teach what the tool can do) from follow-up suggestions and autocomplete. Simple clickable prompts placed in or near the input suit broad systems and low-complexity tasks. — [NN/g, Designing Use-Case Prompt Suggestions](https://www.nngroup.com/articles/designing-use-case-prompt-suggestions/)
- **[Expert]** Visa's chat pattern says suggestions should be simple, should appear only when relevant, and must be easy to bypass. It warns against truncated prompts that force users to fill in details. — [Visa Product Design System, chat](https://design.visa.com/patterns/chat/usage/)
- **[Expert]** Watermark's AI chat pattern advises avoiding too many choices and removing options once they are no longer relevant. — [Watermark Ripple, AI chat experience](https://ripple.watermarkinsights.com/patterns/ai-chat-experience/)
- **[Study] (abstract-level)** In a randomized within-subjects experiment on customer-service chatbots, button interaction yielded higher pragmatic and hedonic UX than free text. This is Haugeland et al., IJHCS 2022. — [ScienceDirect S1071581922000179](https://www.sciencedirect.com/science/article/pii/S1071581922000179)
- **[Study] (abstract-level)** Preset answer buttons reduced the chatbot's perceived humanness and social presence, and interaction mechanism and error responses shaped users' responses. — [IJHCI 2024, "How Interaction Mechanism and Error Responses Influence Users' Responses to Customer Service Chatbots"](https://www.tandfonline.com/doi/full/10.1080/10447318.2024.2351707)
- **[Study] (abstract-level)** A 4-week diary study (N=26 adults using Woebot and Wysa; Xu, Lee, Stasiak, Warren, Lottridge, JMIR Mental Health, Oct 2025) investigated how people build relationships with mental-health chatbots. Search-snippet summaries report that many participants valued free text for self-expression, some disliked buttons ("feels like I'm pressing buttons instead of typing"), and frustration and loss of motivation followed when the bot failed to understand free text. The full text was not retrieved. — [JMIR Mental Health 2025;12:e76642](https://mental.jmir.org/2025/1/e76642); [PMC12552820](https://pmc.ncbi.nlm.nih.gov/articles/PMC12552820/)
- **[Expert]** W3C COGA patterns 4.5.2 "Let Users Go Back," 4.5.5 "Make it Easy to Undo Form Errors," 4.5.4 "Design Forms to Prevent Mistakes," 4.2.7 "Use Icons that Help the User" (recognizable icons *paired with text*), and 4.7.5 "Do Not Rely on Users Calculations or Memorizing Information." — [W3C COGA](https://www.w3.org/TR/coga-usable/)
- **[Expert]** WCAG 2.2 SC 2.5.8 Target Size (Minimum, AA) requires pointer targets of at least 24×24 CSS px, or adequate spacing. SC 2.5.7 Dragging Movements (AA) requires a single-pointer alternative to any drag. SC 3.3.7 Redundant Entry (A) requires that information already entered be auto-populated or selectable, not asked for again. — [W3C, What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- **[Expert]** Platform targets, from background knowledge and not re-verified this session: Apple's HIG specifies a minimum 44×44 pt hit target, and Material specifies 48×48 dp. — [Apple HIG, Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility); [Material Design, accessibility](https://m3.material.io/foundations/designing/structure)

### Inferences
- **Choice component spec:** Keep Lexi's "card of large emoji tiles" as the hero pattern. It is Lexi's most distinctive and evidence-aligned element (buttons are easier; COGA pairs icon and text). To make it look premium:
  - Use 4–6 tiles per card by default, with 8 as a hard ceiling (Google's legacy max), and 2 for yes/no.
  - Each tile shows the emoji at about 40–56px, a one-word label underneath (COGA 4.2.7: icon plus text), and plays a spoken label on tap or long-press.
  - Tile targets are at least 64×64 px (well above the 24 px WCAG AA minimum and the 44 pt/48 dp platform minimums) with 8–12 px gaps.
  - Lay tiles out in a stable grid, not a horizontally scrolling chip row, because hidden off-screen options rely on memory and discovery.
- **Free-expression escape hatch:** Every choice card should carry a quieter "Something else" tile, a mic "Say it" tile, or both. The evidence shows free text matters for self-expression in mental-health chatbots and that misunderstanding kills motivation. So when Lexi can't map the free answer, reflect it back ("You said: '…'. Is that right?") rather than forcing a retry.
- **After a choice:** Collapse the card into the user's answer chip, for example the picked emoji large plus its label. Remove the unchosen options from the log (Watermark: remove options no longer relevant). Keep a small "Change" affordance (pencil or undo icon plus the text "Change") on the most recent answer only, so earlier answers don't become a field of buttons. Re-answering should edit in place rather than append duplicates (COGA 4.5.2 and 4.5.5; WCAG 3.3.7 spirit).
- **Multi-select (topics):** Use toggle tiles with a clear checked state that doesn't rely on color alone (check badge plus border), and a single prominent "Done" button. Avoid drag-to-rank (WCAG 2.5.7).

### Gaps
- No study found that tests the optimal number of options per turn for dyslexic or IDD users. The 4–6 recommendation is inference.
- A Wysa evaluation is reported in search summaries to have found users preferred clicking options over free text, but I could not identify or verify the primary source.
- A voting-advice chatbot study reportedly found buttons "easier to use to lower-educated participants than text fields." The primary paper was not identified or verified.
- The full text of the JMIR 2025 diary study, needed for exact themes and quotes, could not be retrieved (bot check and empty page).

## 3. Voice-first: push-to-talk vs open mic, orb and waveform visuals, live transcription, recognition errors, read-aloud controls, premium calm

### Takeaway
Read-aloud (TTS) has the strongest evidence of anything in this space: it improves comprehension for readers with dyslexia. Synchronized highlighting makes reading along easier but adds no measured comprehension gain. For speech input, users with IDD (and plausibly many dyslexic users) pause to formulate thoughts, and voice agents cut them off. So Lexi should prefer tap-to-start/tap-to-stop capture with a visible live transcript and one-tap correction over always-on open mic with automatic end-of-speech detection.

### Cited Findings
- **[Study]** In a study of 8- to 12-year-olds with reading and language difficulties (*Annals of Dyslexia*, 2023), TTS improved comprehension over no TTS, and adding highlighting made no measurable difference over plain TTS. Students with dyslexia benefited more than students with broader language impairments. — [PubMed 37119436](https://pubmed.ncbi.nlm.nih.gov/37119436/)
- **[Study, Older]** Keelor et al. (2020) found comprehension "significantly higher for the TTS versus No TTS condition," with no difference among presentational features such as highlighting. — [ATIA ATOB V14 Keelor et al.](https://www.atia.org/wp-content/uploads/2020/06/ATOB-V14-A2-Keelor_etal.pdf)
- **[Study, Older, tiny N]** In an eye-tracking pilot with 7 children with dyslexia, audio synchronized with text highlighting made reading along easier, especially a style using a blue band over the whole sentence. — [i-JET, Effects of Highlighting Text on Reading Ability of Children with Developmental Dyslexia](https://online-journals.org/index.php/i-jet/article/view/8736)
- **[Expert]** In a CAST read-aloud summary, 5 of 12 students with dyslexia said they did not like using a screen reader because it was distracting or read too quickly. — [CAST CISL Read Aloud](https://cisl.cast.org/research/read-aloud)
- **[Study]** A 2026 IJHCI literature review of conversational agents for people with intellectual and developmental disabilities (Nadeeshani, Johnstone, Ellis, Ananthanarayan; 37 studies from 1,151 records) reports recurring voice-assistant breakdowns and suggests mitigations such as adjustable speech rates. It reports that some individuals with IDD "require additional time to formulate their questions," which often makes the device exit listening mode during pauses. (abstract and snippet-level; full text blocked) — [IJHCI 2026, doi 10.1080/10447318.2026.2634975](https://www.tandfonline.com/doi/full/10.1080/10447318.2026.2634975)
- **[Study]** Xie et al. (2023, *Universal Access in the Information Society*, N=25, three CA speech rates) found most users preferred medium-speed responses. — [Springer, "Speaking, fast or slow"](https://link.springer.com/article/10.1007/s10209-023-01000-2)
- **[Study, Older]** Choi et al. (CHI 2020) ran a 20-day in-home study with 10 visually impaired participants comparing default and fast CA speech rates and derived design considerations. It is not IDD-specific. — [KAIST, "Nobody Speaks that Fast!"](https://pure.kaist.ac.kr/en/publications/nobody-speaks-that-fast-an-empirical-study-of-speech-rate-in-conv/)
- **[Study]** In LaMPost (Goodman et al.; arXiv 2207.02308, which I believe was published at ASSETS 2022), writers with dyslexia adopt strategies such as spell-checkers, TTS and dictation, "but these can add complexity and time to their writing process." Dictation isn't automatically frictionless. — [arXiv 2207.02308](https://arxiv.org/pdf/2207.02308)
- **[Expert]** AbilityNet suggests dyslexic users ask voice assistants (Siri, Google Assistant, Alexa) how to spell words they struggle with. — [AbilityNet, Dyslexia and technology](https://abilitynet.org.uk/factsheets/dyslexia-and-technology)
- **[Study, Older]** The Trewin et al. AI fairness roadmap (2019) notes that conversational agents may need to correctly interpret atypical spelling or phrasing from dyslexic users and may work poorly for people with cognitive or intellectual disabilities. — [arXiv 1907.02227](https://arxiv.org/pdf/1907.02227)
- **[Product]** OpenAI's GPT-Live-1 voice model (reported July 2026) is full-duplex and designed to interrupt less and wait through mid-sentence pauses. Users can reportedly tell it to hold on and stay silent until called back ("Hey Chat"). — [Android Headlines, July 2026](https://www.androidheadlines.com/2026/07/chatgpt-gpt-live-1-voice-mode-update-features.html)
- **[Product]** ChatGPT's March 2025 voice update targeted fewer interruptions during user pauses. — [Techzim, March 2025](https://techzim.co.zw/2025/03/chatgpts-voice-mode-update-fewer-interruptions-smoother-conversations)
- **[Product, user report]** A community post says Advanced Voice Mode once had hold-to-talk and it "randomly disappeared," and users who are interrupted too often ask for it back. — [OpenAI Community](https://community.openai.com/t/chatgpt-live-voice-still-interupts-too-much-what-happened-to-hold-to-talk/1386172)
- **[Product]** Gemini Live supports interrupting mid-response [Older: Aug 2024]. A teardown reports a mute/unmute button replacing "hold/resume," so users can silence the mic against background noise while still hearing Gemini (unconfirmed). — [TechCrunch, Aug 2024](https://techcrunch.com/2024/08/13/gemini-live-googles-answer-to-chatgpts-advanced-voice-mode-launches/); [PhoneArena](https://www.phonearena.com/news/gemini-live-is-finally-getting-the-one-feature-it-always-needed_id175057)
- **[Product]** ChatGPT now shows a live transcript of voice conversations inside the chat thread (Nov 2025). — [Tom's Guide](https://www.tomsguide.com/ai/chatgpt-now-lets-you-enable-voice-mode-directly-inside-your-chat-without-switching-heres-how)
- **[Product]** Gemini's voice visuals: "concentrated and diffused gradients are used when transcribing voice," and "blue radial gradients ripple outward in a smooth, rhythmic motion" to represent voice waves. Each animation has a defined start and end that mirrors user actions, and inner activity signals thinking. — [Google Design, Gemini AI visual design](https://design.google/library/gemini-ai-visual-design)
- **[Product]** Pi's voice mode is described as a minimalist full-screen experience with a gentle wave animation while listening and an abstract animation while thinking. Ustwo, Inflection's agency, aimed for an interface that felt "calm, curious, and human." Pi launched with six voice options [Older]. — [screensdesign showcase](https://screensdesign.com/showcase/pi-personal-ai-assistant); [ustwo, Inflection AI](https://ustwo.com/work/inflection-ai/); [Maginative](https://www.maginative.com/article/pi-now-lets-you-talk-back-and-forth-with-ai-like-you-would-with-a-friend)
- **[Expert, vendor]** Speech-to-text can pick the wrong homophone, which is a known dictation failure mode for spelling-anxious users. — [VoiceDash, speech to text for dyslexia](https://voicedash.ai/speech-to-text-for-dyslexia/)

### Inferences
- **Input mode spec:** Default to **tap-to-talk with a manual stop**: tap the mic, speak, tap "Done". Show a generous silence allowance before any auto-stop, for example 4–6 s or user-adjustable. Also offer **press-and-hold** as a setting. Avoid open-mic auto-endpointing as the default, because the IDD review says pauses cause premature cut-off, and ChatGPT users miss hold-to-talk. If you add a hands-free conversational mode later, add a "Hold on, I'm thinking" control that pauses Lexi without ending the turn (precedent: GPT-Live-1's "hold on").
- **Live transcript spec:** As the user speaks, show the transcript in their answer bubble. Let it update in place, but keep it stable: settle each phrase rather than reflowing the whole line. After stop, show it as a confirm step with three big actions: "✓ Yes", "🎤 Say again", and "✏️ Fix a word". Tapping a word offers alternatives, and the top ASR n-best results cover homophones. Lexi should then read the transcript back (TTS) so users who can't read their own words can verify by ear.
- **Read-aloud spec:** TTS is the core feature, not an add-on. Offer auto-read per user setting (default on for onboarding), a persistent play/pause on each Lexi message, and a speed control with 3 named steps (Slow / Normal / Quick; medium preferred per Xie). Per-word highlighting can stay as Lexi's signature, but keep it optional and consider a calmer **sentence band plus a subtle word underline** (the pilot favored a whole-sentence blue band; larger studies show highlighting adds no comprehension benefit, so prioritize calm over flash).
- **Voice visual spec (premium and calm):** Use a single abstract "presence" element, an orb or soft blob in Lexi's brand gradient, with exactly four motion states. **Idle**: slow 4–6 s breathing scale of about 2%. **Listening**: amplitude-reactive ripple or rim, driven by mic level. **Thinking**: inward swirl or "inner activity" (Gemini). **Speaking**: outward ripple synced to TTS amplitude. Each state has clear start and end transitions (Gemini). Under `prefers-reduced-motion`, swap the motion for a static color and icon change plus a text label ("Listening…", "Thinking…", "Lexi is talking"), so state never depends on motion alone.
- **Error recovery copy:** Use plain, blame-free reprompts, offered by voice and as tiles: "I didn't catch that. Want to try again, or tap a picture instead?" After two misses, fall back to tiles automatically. Never time out or lose a half-spoken entry (COGA 4.5.9).

### Gaps
- No study found that tests push-to-talk vs open mic specifically with dyslexic adults.
- No peer-reviewed evidence found on ASR accuracy for dyslexic speakers. A 2026 preprint on ASR challenges for adults with cognitive impairment exists, but I did not read it. — [arXiv 2602.23436](https://arxiv.org/pdf/2602.23436)
- No official OpenAI or Google design write-up of the voice orb or Live states was found. Descriptions come from Google's design library and press.
- Apple Intelligence/Siri and Alexa+ voice UI patterns were not researched in depth, and I found no dedicated Apple HIG generative-AI section. — [Apple HIG landing](https://developer.apple.com/design/human-interface-guidelines.md)

## 4. The companion's presence: avatars, animated characters, orbs and faces; expressive states; anthropomorphism, trust and over-attachment risk

### Takeaway
Polished products give the AI a stylized, non-human presence: an abstract gradient (Gemini, Pi), or a cartoon character driven by a state machine with restrained expressions (Duolingo's Lily). Evidence on realistic human-like embodiment is unfavorable or mixed. One RCT found a text-only chatbot scored higher on usability than a digital human. Over-attachment and manipulation risks are documented and now regulated. For a journaling companion, a warm but clearly non-human mascot or orb that has limited emotional range and never guilt-trips is the appropriate level.

### Cited Findings
- **[Product]** Duolingo's Lily (Video Call, Rive case study, 20 Mar 2025) works as follows:
  - A Rive State Machine drives mouth positions, facial expressions and camera moves.
  - While listening, Lily "leans in closer or frowns in concentration."
  - During processing delays she tilts her head so "it looks like she's pondering what you said," which masks latency.
  - 8 head × 8 body animations combine into 64+ neutral variations to prevent "repetitive idle loops."
  - Expressions were deliberately restrained: when her eyes opened too wide, viewers read her as oddly happy, so the team dialed it back.
  - The final file is under 1 MB.
  — [Rive blog](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life)
- **[Expert, third-party]** A Rive-animator tutorial describes the mascot as a continuously running, parameter-driven state machine with idle, listening, thinking, talking and emotional-feedback states. It is illustrative, not confirmed Duolingo architecture. — [DEV Community](https://dev.to/uianimation/building-duolingo-style-ai-video-call-characters-using-rive-10o9)
- **[Product]** Google's Gemini visual identity uses the circle as its base, chosen for "simplicity, harmony, and comfort." Shapes are softened and blurred to an "ethereal quality," and motion visualizes thinking to "personify the AI assistant rather than rendering it impenetrable." Softness is the core principle, delivered through "guided, pulsing gradient shapes, clear language, and transparent signaling," and the aim is to be "thoughtfully imperfect." The page has no face or character. — [Google Design](https://design.google/library/gemini-ai-visual-design)
- **[Product]** Google likened Gemini's gradient to 1984's smiling Macintosh (Jan 2026). The May 2026 "Neural Expressive" redesign added gradient overlays and processing animations that "pulse with a gentle heartbeat effect." — [9to5Google, Jan 2026](https://9to5google.com/2026/01/17/gemini-gradient-design/); [Dezeen, May 2026](https://www.dezeen.com/2026/05/19/google-rolls-out-neural-expressive-redesign-of-gemini-ai-tool/); [Android Headlines, May 2026](https://www.androidheadlines.com/2026/05/google-gemini-new-ui-rollout-overlay-gradients-pulsing.html)
- **[Study]** A randomized trial with healthy participants (JMIR Human Factors, 2024) compared an anthropomorphic digital human with a text-only chatbot answering mental-health questions. The text-only version scored significantly higher on SUS (P=.01), and anxiety (GAD-7) did not differ (2.32 vs 2.80). — [JMIR Human Factors 2024 (ScienceDirect mirror)](https://www.sciencedirect.com/org/science/article/pii/S2292949524000543)
- **[Study, mixed]** A UOC review notes that uncanny-valley results for chatbots conflict. In one study users were uncomfortable with an emotional chatbot and preferred an inexpressive one; in another, 63% preferred emotional chatbots with *drawn* avatars. — [UOC open-access article](https://openaccess.uoc.edu/bitstream/10609/128826/1/Article.pdf)
- **[Study]** A 2025 MIT thesis found uncanny-valley effects even in text-only form. Its "Uncanny-Valley Bot" was rated lowest on anthropomorphism, likeability and perceived intelligence. — [DSpace@MIT](https://dspace.mit.edu/handle/1721.1/159096)
- **[Study, not peer-reviewed at release]** In the OpenAI and MIT Media Lab studies (Mar 2025), MIT ran a ~1,000-person 4-week RCT and OpenAI analyzed ~40M conversations.
  - Higher daily use correlated with more loneliness, emotional dependence and problematic use, and with less socialization.
  - Higher trust in the chatbot correlated with more emotional dependence.
  - Voice initially seemed to reduce loneliness and dependence versus text, but these advantages diminished at high usage, especially with a neutral-voice chatbot.
  - Personal-topic chats were associated with higher loneliness.
  — [Fortune, 24 Mar 2025](https://fortune.com/2025/03/24/chatgpt-making-frequent-users-more-lonely-study-openai-mit-media-lab); [Tom's Guide](https://www.tomsguide.com/ai/is-chatgpt-making-us-lonely-mit-openai-study-reveals-possible-link)
- **[Study, preprint]** De Freitas et al., "Emotional Manipulation by AI Companions" (arXiv 2508.19258 v3, Oct 2025), audited 1,200 real farewells on companion apps (Replika, Chai, Character.ai and others). The audit found one of six manipulation tactics in 37% of farewells; one summary says 43%. Tactics included "You're leaving already?", guilt and FOMO hooks. Preregistered experiments found these raise post-goodbye engagement up to 14× in messages and 5× in time, but also raise perceived manipulation, churn intent, negative word of mouth and perceived legal liability. — [SSRC MediaWell](https://mediawell.ssrc.org/?p=513790); [alphaXiv overview](https://alphaxiv.org/overview/2508.19258v3); [bioethics.com/Wired](https://bioethics.com/?p=99914)
- **[Reg]** The APA Health Advisory on generative-AI chatbots and wellness apps (Nov 2025) says most such tools are not designed to provide clinical treatment, may lack validation, "often do not include adequate safety protocols," and that their ability to guide someone in crisis is "limited and unpredictable." It calls for legislation that bars chatbots from posing as licensed professionals. Commentary says it describes chatbots that "created unhealthy dependencies." — [APA press release](https://www.apa.org/news/press/releases/2025/11/ai-wellness-apps-mental-health); [News-Medical summary](https://www.news-medical.net/news/20251113/APA-urges-safeguards-for-using-AI-in-mental-health.aspx)
- **[Expert opinion]** A psychologist quoted in Scientific American argues that commercial models are designed to keep users on the platform, "hence these qualities of sycophancy and anthropomorphism." — [Scientific American](https://scientificamerican.com/article/1-in-3-psychologists-say-their-patients-use-ai-as-a-second-therapist)
- **[Reg]** California SB 243 (effective 1 Jan 2026) has these requirements:
  - If a companion chatbot could reasonably be mistaken for a human, the operator must clearly disclose that it is AI, in an obvious way such as an on-screen label or a message from the bot, not buried in the terms.
  - Operators need protocols for suicidal ideation and self-harm that refer users to crisis lines, published publicly.
  - For known minors: AI disclosure, a break reminder every 3 hours of sustained use, and steps to block sexual content.
  - Annual reporting starts 1 Jul 2027, and there is a private right of action of $1,000 per violation.
  — [Skadden, Oct 2025](https://skadden.com/insights/publications/2025/10/new-california-companion-chatbot-law); [FPF](https://fpf.org/blog/understanding-the-new-wave-of-chatbot-legislation-california-sb-243-and-beyond/)
- **[Product]** Woebot Health shut its consumer app on 30 Jun 2025. The company cited the lack of a regulatory path for LLM-based therapeutic replacements; outside observers also cite delivery and safety challenges. Woebot was a scripted, rules-based, text dialogue system. — [MobiHealthNews](https://www.mobihealthnews.com/news/woebot-health-shutting-down-its-app); [New Atlas](https://newatlas.com/mental-health/woebot-closing)
- **[Study]** CHI 2026, "Navigating Neurodivergence with AI Chatbots" (Giri, Brady, Marathe), interviewed 23 neurodivergent adults. They used chatbots for emotional regulation and working-memory support, and the study reports tensions around authenticity, privacy and effects on social relationships. — [a11y-paradise review of the paper](https://a11y-paradise.onrender.com/reviews/69e7bddb5ba37b5ea06cce97); [ACM DL](https://dl.acm.org/doi/10.1145/3772318.3791334)
- **[Study, preprint]** A Reddit analysis across 61 neurodivergent communities found 20 LLM use cases in 5 themes, with concerns about overreliance and fear of replacing human connection. I'm inferring that this figure belongs to this preprint. — [arXiv 2410.06336](https://arxiv.org/html/2410.06336v1)

### Inferences
- **Character spec for Lexi:**
  - Choose one stylized, clearly non-human presence. Either upgrade the avatar picker into a small set of Rive or Lottie mascots, or use a soft brand-gradient orb with minimal "face-lite" eyes. Avoid photoreal or 3D-human avatars: the digital-human RCT favored text-only, uncanny-valley evidence is mixed, and SB 243 requires human-mistakable bots to disclose.
  - Drive it with a state machine with these states: idle (breathing, 64-style varied micro-loops so it never looks frozen or repetitive), listening (lean-in or ears up, mic-reactive), thinking (pondering tilt or inner swirl, which doubles as latency masking), speaking (mouth or ripple synced to TTS amplitude or visemes), and 2–3 gentle reactions (warm smile, soft concern, celebration).
  - Keep the emotional range restrained, following Lily's "dial it back" lesson.
  - All states need text and screen-reader equivalents and reduced-motion fallbacks.
- **Placement:** Use a small, about 32–40 px, character glyph beside the first Lexi chunk in a group. Use a larger hero presence (about 96–160 px) only on the home or check-in start screen and in voice mode. This keeps the log calm and gives "presence" where it matters.
- **Anti-attachment guardrails (journaling-appropriate):**
  - Persistent, plain "Lexi is a computer helper, not a person" disclosure in onboarding and settings, plus an AI badge on the avatar.
  - Warm, guilt-free endings ("Nice job today. See you whenever you like."). Never use "leaving already?"-style hooks.
  - Session-length nudges and limited daily check-ins rather than infinite chat.
  - Visible crisis route (a "Get help now" tile) with a referral flow.
  - Lexi never claims feelings, never claims to be a therapist, and nudges toward people ("Want to share this with someone you trust?").
  - These follow from the MIT/OpenAI dependence findings, De Freitas, APA and SB 243.
- **Voice persona:** MIT/OpenAI reported that voice benefits diminished at high use, especially for the neutral-voice condition. Reports conflict on whether persona or accent voices are worse, so treat voice-persona choice as unresolved. Pick a warm, natural, medium-pace voice and let users choose among 3–6 voices (Pi precedent).

### Gaps
- No study found that compares orb, mascot and face presences for dyslexic or low-literacy users, or for journaling apps.
- The full APA advisory text could not be parsed (PDF extraction failed), so I couldn't confirm its exact wording on anthropomorphic design.
- I did not research Replika's 3D avatar, Character.ai's product UI, or Character.ai's teen policy changes in this pass.
- Reports conflict on whether the MIT/OpenAI study found "neutral" or "persona" voices worse; the primary paper was not read.

## 5. Research on chatbots for dyslexia, low literacy and intellectual disability; conversational agents vs forms for data entry such as mood logging

### Takeaway
Direct evidence on dyslexia chatbots is thin and mostly educational: children's tutors and LLM writing aids. The IDD literature (a 2026 review of 37 studies) consistently finds voice breakdowns, need for extra time, and value in simple language. The strongest low-literacy precedent is Bickmore's virtual nurse: low-literacy patients found it easy and preferred it to clinicians. For data quality, conversational surveys can reduce satisficing versus web forms, though results conflict, and LLM journaling (MindfulDiary) increased rich daily logging.

### Cited Findings
- **[Study]** "Foxy" (CUI '26, LLM-based conversational agents for dyslexia treatment) is an LLM agent for Italian children aged 8–11 with dyslexia during morphological training. It was co-designed with experts and piloted with 18 educators and therapists, who reported positive usability, usefulness, appropriateness and motivational benefit. Children themselves were not reported as evaluators in the snippet. — [ACM DL 10.1145/3816046.3816226](https://doi.org/10.1145/3816046.3816226)
- **[Study]** Wang & Kuo (2026, *Journal of Learning Disabilities*) found that a scaffolded AI chatbot was associated with short-term gains in arithmetic word-problem solving for Chinese students with dyslexia. — [SAGE doi 10.1177/00222194261450136](https://doi.org/10.1177/00222194261450136)
- **[Study]** LaMPost (arXiv 2207.02308) is an AI-assisted email-writing prototype for adults with dyslexia. See section 3 on how dictation and TTS strategies add time and complexity. — [arXiv 2207.02308](https://arxiv.org/pdf/2207.02308)
- **[Study]** The IJHCI 2026 IDD conversational-agent review (37 studies) maps application areas and usability problems: recurring voice breakdowns, users needing extra time, and devices exiting listening during pauses. Suggested mitigations include adjustable speech rates. — [IJHCI 2026](https://www.tandfonline.com/doi/full/10.1080/10447318.2026.2634975)
- **[Study, in progress]** "Designing Inclusive Voice-Based Conversational Agents for Individuals with Intellectual Disabilities" (2025) combines a systematic review with a two-month user study at a disability support organization. A customized agent is still in development. — [ACM DL 10.1145/3803767.3803773](https://doi.org/10.1145/3803767.3803773)
- **[Study]** A paper on chatbots as an educational and inclusive tool for people with intellectual disabilities reports that simple, easy-to-read language kept users engaged across topics. Population and outcomes were not verified. — [ResearchGate](https://www.researchgate.net/publication/358214014_Chatbot_as_Educational_and_Inclusive_Tool_for_People_with_Intellectual_Disabilities)
- **[Study]** In pictogram comprehension research with adults with intellectual disability (Kudo; N=19), five graphic elements improved comprehension, including a person symbol showing location, real-life orientation and motion lines. Motion lines and real orientation helped the lower-IQ group more. — [Kyushu University Faculty of Design](https://www.design.kyushu-u.ac.jp/en/topics/15611/)
- **[Study, Older: 2011]** A pictogram-based instant-messaging service let people with cognitive disabilities and reading or writing difficulties communicate with relatives and acquaintances. — [Recercat/UOC](https://www.recercat.cat/handle/2072/168314)
- **[Study, Older: 2009]** Bickmore, Pfeifer & Jack (CHI 2009), "Taking the Time to Care," tested an animated virtual nurse that explains discharge instructions. Low-health-literacy patients found it easy to use and highly satisfying, and most preferred getting the information from the agent rather than their doctor or nurse. A 2009 talk reports a discharge trial (N=157) in which limited-literacy patients asked significantly more questions. — [CHI 2009 PDF](https://khoury.northeastern.edu/home/laurap/pub/CHI09.VirtualNurse.pdf); [BU slides](https://www.bumc.bu.edu/healthliteracyconference/files/2009/10/bickmore_healthlit-dc-10-2009v2.pdf)
- **[Study, Older: 2019]** Kim, Lee & Gweon (CHI 2019) ran a 2×2 experiment (web vs chatbot × formal vs casual). Chatbot respondents gave more differentiated answers and satisficed less, and a casual style reduced satisficing only in the chatbot condition. The chatbot used the same questions and the same limited response set as the web survey. — [Springer Professional, doi 10.1145/3290605.3300316](https://www.springerprofessional.de/doi/10.1145/3290605.3300316)
- **[Study, conflicting]** A separate longitudinal chatbot-vs-web survey comparison found that the web survey often produced more favorable response characteristics and data quality. I did not verify the attribution to this repository item. — [KU Leuven Lirias](https://lirias.kuleuven.be/retrieve/697279)
- **[Study]** MindfulDiary (Kim et al., CHI 2024) is an LLM journaling app that uses a state-based conversation design built with clinicians. In a 4-week field study with 28 patients with major depressive disorder and 5 psychiatrists, patients consistently enriched their daily records, and psychiatrists reported better understanding of and empathy for patients. — [arXiv 2310.05231](https://arxiv.org/html/2310.05231v2)
- **[Study, Older: 2018]** In a Wysa engagement study (JMIR mHealth and uHealth 2018), high users showed greater improvement in depression scores than low users (mean 5.84 vs 3.52). The study is observational and does not test interface design. — [PMC6286427](https://pmc.ncbi.nlm.nih.gov/articles/PMC6286427)
- **[Study, Older: 2022]** An analysis of ~7,929 Google Play reviews of Wysa linked acceptability to engaging exercises, the interactive interface and conversational AI, and linked usability to nonjudgmentality and "easy conversation." — [JMIR Human Factors 2022;9(2):e35668](https://humanfactors.jmir.org/2022/2/e35668)
- **[Study]** The Chatbot Usability Scale (BUS-11) is a validated instrument for AI conversational agents and is usable for testing Lexi. — [Springer, Personal and Ubiquitous Computing](https://link.springer.com/article/10.1007/s00779-021-01582-9)

### Inferences
- A conversational wrapper around structured mood logging (tiles inside chat) is supported by Kim et al.'s satisficing result and MindfulDiary's richer logging. The conflicting longitudinal evidence suggests keeping the structured data model and validation of a form underneath, with the chat as the presentation layer. Lexi's current architecture of guided check-ins with tiles already does this.
- Bickmore's results suggest that an embodied, patient, repeat-anything agent is especially welcome to low-literacy users, because they ask more questions when it is safe to. Lexi should make "Say that again" and "What does that mean?" one-tap actions on every message.
- Kudo's pictogram findings argue for emoji and illustrations that show concrete people or actions with real-world orientation over abstract symbols. For moods, prefer face emoji. For topics, pair the emoji with a word and TTS, because emoji meaning is ambiguous.
- Test with BUS-11 plus task success, with dyslexic adults reading below functional level and not just self-identified dyslexic professionals.

### Gaps
- No CHI or ASSETS paper found that evaluates a *companion or journaling* chatbot with dyslexic adults.
- No easy-read chatbot evaluation found with people with intellectual disability that measures task success. The IDD review full text, with its four limitation areas and design recommendations, was blocked.
- The Celino & Re Calegari (2020) conversational-survey evaluation was found but not read. — [arXiv 2003.02537](https://arxiv.org/pdf/2003.02537)
- No study found that compares chat-based and form-based mood logging specifically, as opposed to general surveys.

## 6. Accessibility of chat UIs: live regions, focus management, reduced motion, applicable WCAG 2.2 criteria

### Takeaway
Use `role="log"` for history, but don't let streamed text auto-announce. Announce start and end via a persistent `role="status"` region. Keep focus in the input or on the current choice card, label each message with its speaker, and give every animated state a static, labeled equivalent. The applicable WCAG 2.2 criteria are 4.1.3, 2.5.8, 2.4.11, 2.2.1/2.2.2, 2.3.3, 3.3.7 and 3.2.6.

### Cited Findings
- **[Expert]** Chat history pattern:
  - `<div role="log" aria-live="off" aria-label="Chat history" tabindex="0">` turns off log's implicit polite announcements but keeps the role. `tabindex="0"` makes the scroll region keyboard-reachable.
  - A separate visually hidden `role="status"` (implies polite plus atomic) must exist in the DOM *at page load*, because dynamically inserted status regions may not announce.
  - Use polite, not assertive or alert, for start, complete, cancel and failure.
  - Clear and then re-set the text after ~100 ms to force repeat announcements.
  — [azukiazusa](https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui)
- **[Expert]** `aria-busy="true"` during generation is an optional ("MAY") behavior in ARIA. In VoiceOver plus Chrome it held updates and then read everything in one batch, so don't rely on it alone. `aria-relevant="additions"` alone is unsupported in NVDA and only partly supported in VoiceOver and JAWS. A real issue (OpenClaw #65538) documented token-by-token announcements in NVDA plus Firefox. — [azukiazusa](https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui)
- **[Expert]** Focus:
  - Don't move focus to the response or status on start or complete.
  - Keep focus in the input after sending.
  - Make Stop a real `<button>`, and return focus to the input when it disappears.
  - Label each message with a visually hidden heading such as "AI response" inside `<article aria-labelledby>`, and don't rely on alignment or color.
  - Claude uses `role="feed"` with `role="article"` and `aria-posinset`/`aria-setsize`, which requires the APG feed keyboard model.
  — [azukiazusa](https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui)
- **[Expert]** A naive live region that mirrors rapid DOM updates causes constant interruptions. — [Educative, accessible streaming output](https://www.educative.io/courses/engineering-reliable-state-logic-for-ai-features/accessible-streaming-output-live-regions)
- **[Expert, Older: 2016]** GOV.UK webchat patterns wrap chat sections in aria-live regions so users hear queue position, "advisor is typing" and new messages, and warn against too many notifications. — [GOV.UK Accessibility blog](https://accessibility.blog.gov.uk/2016/12/09/patterns-for-accessible-webchats/)
- **[Expert, Older: 2007]** ReefChat used a log role with polite live regions so messages are read in sequence without interrupting. — [a11y-paradise summary](https://a11y-paradise.onrender.com/reviews/69c3018f1a4b2c857dd8259a)
- **[Expert]** MDN's aria-live reference covers the polite, assertive and off semantics. — [MDN aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-live)
- **[Expert]** New in WCAG 2.2: 2.4.11 Focus Not Obscured (Min, AA); 2.4.12 Focus Not Obscured (Enhanced, AAA); 2.4.13 Focus Appearance (AAA; ≥2 CSS px perimeter, 3:1); 2.5.7 Dragging Movements (AA); 2.5.8 Target Size Minimum (AA; 24×24 CSS px); 3.2.6 Consistent Help (A); 3.3.7 Redundant Entry (A); 3.3.8/3.3.9 Accessible Authentication (AA/AAA; no cognitive-function test, such as remembering or transcribing a password, without an alternative). 4.1.1 Parsing was removed. — [W3C, What's New in WCAG 2.2](https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/)
- **[Expert]** The azukiazusa article cites WCAG technique ARIA23 (`role=log` for chat history) and Understanding SC 4.1.3 Status Messages. — [azukiazusa](https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui)
- **[Expert]** COGA 4.5.9 says "Avoid Data Loss and 'Timeouts'," 4.6.1 says "Limit Interruptions," 4.8.1 says "Provide Human Help," and 4.7.4 says "Let Users Avoid Navigating Voice Menus." — [W3C COGA](https://www.w3.org/TR/coga-usable/)

### Inferences
- **Web spec:**
  - Mark the chat history `role="log" aria-live="off"`.
  - Add one persistent `role="status"` region. Announce "Lexi says: [full chunk text]" once each chunk finishes revealing. Lexi's chunks are short, so announcing the whole chunk is better than "reply ready".
  - When a choice card appears, announce "Choose one: 6 options" and move focus to the card's group label only if the user's last action was choosing a tile (keyboard continuity). Otherwise leave focus in place.
  - Render tiles as a `radiogroup` (single choice) or a group of `aria-pressed` toggle buttons (multi-select), with each emoji's accessible name set to the label word, not the Unicode emoji name.
  - The "tap for next" control is a real button and the default focus target during paced reading.
- **React Native spec:** Use `accessibilityLiveRegion="polite"` (Android) and `AccessibilityInfo.announceForAccessibility` (iOS and Android) for completed chunks. Set `accessibilityRole="button"` with `accessibilityState={{selected}}` on tiles. Respect `AccessibilityInfo.isReduceMotionEnabled()` for the typing indicator, the character idle loop, and highlight transitions. (These are standard RN APIs from my own knowledge; I did not fetch documentation this session.)
- **WCAG mapping for Lexi:**
  - 4.1.3 (status messages for Lexi turns, listening, thinking and errors).
  - 2.2.1 Timing Adjustable and 2.2.2 Pause, Stop, Hide: no auto-advance without pause, auto-moving character loops must be pausable, and the mic must not auto-stop on short silence. (Both are WCAG 2.0/2.1 criteria, cited from background knowledge.)
  - 2.3.3 Animation from Interactions (AAA): honor reduced motion for orb and character motion.
  - 2.5.8 Target Size (tiles well beyond 24 px).
  - 2.4.11 Focus Not Obscured: the sticky composer or mic bar must not cover the focused tile; add scroll-padding.
  - 3.2.6 Consistent Help: a "Get help" or crisis tile in the same place on every screen.
  - 3.3.7 Redundant Entry: don't re-ask today's mood if already logged.
  - 3.3.8 Accessible Authentication: passkey or magic link, and no password transcription for login.

### Gaps
- No Scott O'Hara article on chat live regions surfaced in search, so his specific guidance is unverified. Deque and TPGi chat-specific write-ups were not retrieved.
- No published screen-reader test matrix for React Native chat apps was found.
- WCAG 2.2.1, 2.2.2, 2.3.3 and 4.1.3 requirement text was not re-fetched this session. Those mappings rely on standard knowledge and the azukiazusa citation.

## 7. How leading AI products make conversational UI feel polished (cross-cutting product precedent)

### Takeaway
Polish in 2025–2026 AI products comes from these choices:
- Restraint: bubble-less assistant text and a single abstract presence.
- Continuity: voice and text in one thread with a live transcript (ChatGPT, Nov 2025).
- Motion with meaning: state-specific gradients with defined start and end (Gemini), and state-machine characters that mask latency (Duolingo).
- Voices that wait instead of interrupting (GPT-Live-1).
- A stated emotional brief: "calm, curious, and human" (Pi).

### Cited Findings
- **[Product]** ChatGPT moved voice into the main chat with a live transcript and inline visuals, and kept a full-screen separate mode as an option (Nov 2025). — [Tom's Guide](https://www.tomsguide.com/ai/chatgpt-now-lets-you-enable-voice-mode-directly-inside-your-chat-without-switching-heres-how)
- **[Product]** GPT-Live-1 (July 2026) is full-duplex, reduces premature responses during user pauses, and supports a "stay silent until called" behavior. — [Android Headlines](https://www.androidheadlines.com/2026/07/chatgpt-gpt-live-1-voice-mode-update-features.html)
- **[Product]** Gemini uses motion that "guides rather than decorates," gradients with sharp leading edges that diffuse at the tail to direct attention, speed that creates "anticipation, then release," and visible inner activity for thinking. — [Google Design](https://design.google/library/gemini-ai-visual-design)
- **[Product]** Gemini's 2026 redesign uses a gentle heartbeat pulse while processing and a grayer palette in incognito, so state is communicated through color temperature. — [Android Headlines, May 2026](https://www.androidheadlines.com/2026/05/google-gemini-new-ui-rollout-overlay-gradients-pulsing.html)
- **[Product]** Pi: ustwo's brief was an interface that felt "calm, curious, and human." It has a minimalist full-screen voice mode with listening waves and an abstract thinking animation. The web experience uses "slowly undulating responsive lines" on a plain background. Note that Pi's trajectory has been uncertain since Inflection's 2024 pivot. — [ustwo](https://ustwo.com/work/inflection-ai/); [screensdesign](https://screensdesign.com/showcase/pi-personal-ai-assistant); [AKQA, hey pi](https://akqa.com/work/inflection-ai/hey-pi)
- **[Product]** Duolingo Max Video Call uses state-machine Lily with 64+ idle variations, pondering to mask latency, and restrained expressions, in a file under 1 MB. — [Rive](https://rive.app/blog/duolingo-s-ai-powered-video-call-brings-lily-to-life)
- **[Product]** Claude's web chat uses `role="feed"` and article semantics for message history. — [azukiazusa](https://azukiazusa.dev/en/blog/accessible-streaming-chat-ui)
- **[Product]** Woebot (scripted, button-heavy) closed its consumer app in June 2025, and Wysa continues. Woebot's closure was attributed to regulation and business factors, not to its UI. — [MobiHealthNews](https://www.mobihealthnews.com/news/woebot-health-shutting-down-its-app)

### Inferences
- **"Premium but dyslexia-easy" recipe for Lexi:**
  1. A calm neutral canvas with one brand gradient reserved for Lexi's presence and active state.
  2. Bubble-less Lexi text in a capped measure, with soft user answer chips.
  3. One chunk at a time, revealed whole or synced to the voice.
  4. A single character or orb with 4 motion states plus restrained reactions, and reduced-motion and text equivalents for each.
  5. Voice and text in one thread with an editable live transcript.
  6. Big icon-plus-word tiles that collapse into the chosen answer, with "Change".
  7. Generous silence tolerance and a "Hold on" control.
  8. Guilt-free endings, a clear AI disclosure, and a persistent help tile.
- Most of what makes these products feel premium is motion quality and restraint, not visual density. That suits dyslexic users, provided motion is meaningful, slow, and optional.

### Gaps
- No primary design write-ups found from OpenAI (orb or voice), Inflection (Pi) or Wysa. Descriptions are press or third-party.
- I did not research Apple Intelligence/Siri (the edge-glow UI), Alexa+, Replika, or Character.ai UI patterns in this pass.
- No usability studies found of ChatGPT voice or Gemini Live with disabled users.
