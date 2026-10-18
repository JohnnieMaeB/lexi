# Reading-support features and TTS for dyslexic adults and teens (applied to the Lexi mobile journaling chatbot)

Evidence-strength key used below: **[Strong]** = meta-analysis or multiple replicated peer-reviewed studies; **[Moderate]** = one peer-reviewed experiment with adequate design, or meta-analysis with caveats; **[Weak]** = small/pilot/poster/conference study; **[Anecdote]** = case report or practitioner blog; **[Vendor]** = vendor documentation or marketing (confirms a feature exists, not that it works). Population tags: **[child]** = under-13 sample only; **[teen]** = 13-19; **[adult/college]**. Method note: several primary pages (PMC, PubMed, IAFOR, Reading Rockets, CAST PDF) blocked automated fetching, so some items rest on search-engine summaries of the source; those are marked "(via search summary)". About 38 searches/fetches were used.

## 1. Does TTS / read-aloud help comprehension, fluency, or both? Who benefits most?

### Takeaway
Best available meta-analytic evidence (Wood et al. 2018) shows a small-to-moderate positive effect of TTS/read-aloud tools on **comprehension** for students with reading disabilities (g = .35, 95% CI .14-.56), spanning roughly grade 3 to college. I found no meta-analytic evidence on **fluency**; the measured outcome is comprehension (and, in Schneps's studies, reading speed). Children with dyslexia alone appear to benefit more than children who also have language impairment; evidence for teens/adults is thinner but directionally consistent.

### Cited Findings
- Wood, Moxley, Tighe & Wagner (2018), *J. Learning Disabilities* 51(1): random-effects average weighted effect size .35, 95% CI .14 to .56, p < .01; "moderator effects of study design were found to explain some of the variance"; authors conclude TTS "may assist students with reading comprehension" but call for more research on moderators. Outcome is reading comprehension only. [Strong, with caveats: modest effect, wide CI] — [PMC5494021 (abstract)](https://pmc.ncbi.nlm.nih.gov/articles/PMC5494021/); DOI [10.1177/0022219416688170](https://doi.org/10.1177/0022219416688170)
- Secondary summaries of Wood 2018: 22 studies (published and unpublished); between-subjects designs showed larger effects (d = 0.61); grade range 3rd through college; earlier reviews were mixed (Li et al. 2014 g = .13; Buzick & Stone 2014 g = .56). Study count and moderator figure not verified in the full text (it blocked fetching). — [ASHA Evidence Map](https://apps.asha.org/EvidenceMaps/Articles/ArticleSummary/8f7b9dd3-41fb-48c6-86a5-3e25ad47bc7b); [Mote summary](https://mote.com/pillar-pages/text-to-speech); [slide-deck summary, FSU symposium](https://cre.fsu.edu/research-symposium/21904) and [IDA slide deck](https://ga.dyslexiaida.org/wp-content/uploads/sites/27/2019/03/Empowering-the-Reader-Nanci-JKSW.pdf) (via search summary; the search tool did not say which of the two decks carried the Li/Buzick comparison)
- Keelor et al. (2023), *Annals of Dyslexia* 73(3):469-486, ages 8-12 with reading and language difficulties, five passages under silent reading / read aloud / listen only / TTS with highlighting / TTS without highlighting: TTS improved comprehension over no-TTS; both TTS conditions beat silent reading; highlighting made no significant difference; students with dyslexia alone scored higher in all conditions and gained significantly more from TTS and listen-only than students with combined reading + language impairment. [Moderate] [child] — [PubMed 37119436](https://pubmed.ncbi.nlm.nih.gov/37119436/); detail on conditions and subgroup (via search summary) from [same record](https://pubmed.ncbi.nlm.nih.gov/37119436/)
- Keelor et al. (2020, *Assistive Technology Outcomes & Benefits*) reported a similar pattern: comprehension higher with TTS vs no TTS, no difference between presentational features. [Moderate] [child] (via search summary) — [ATOB v14 Keelor et al.](https://www.atia.org/wp-content/uploads/2020/06/ATOB-V14-A2-Keelor_etal.pdf)
- Clinton-Lisell (2023) notes Wood et al. 2018 "indicated that readers with disabilities benefit from audio-assisted reading", and that Keelor et al. (2018, 2020) found "large benefits" of reading-while-listening for struggling readers; where struggling readers were a subsample (Alvarez-Alonso 2021; Montali & Lewandowski 1996; Verlaan & Ortlieb 2012), reading-while-listening "appeared to be particularly helpful" for them. The author warns the struggling-reader data are too few for firm generalisation. — [Clinton-Lisell 2023, ERIC EJ1403866](https://files.eric.ed.gov/fulltext/EJ1403866.pdf)
- Mechanism (simple view of reading): if decoding is the bottleneck and aural comprehension is adequate, listening while reading should help comprehension. — [Clinton-Lisell 2023](https://files.eric.ed.gov/fulltext/EJ1403866.pdf)
- Fluency/long-term gains: Clinton-Lisell states her meta-analysis cannot support conclusions about "long-term reading-while-listening interventions to build fluency and comprehension" because it only covered single-text comprehension. — [Clinton-Lisell 2023](https://files.eric.ed.gov/fulltext/EJ1403866.pdf)
- Reading-speed outcome in college students (Schneps et al., 43 college students, typical and impaired readers, handheld device): highest reading speed, controlling for comprehension, came from combining accelerated visual presentation with TTS; readers with dyslexia using the combination matched typical readers' speed on paper/visual/auditory methods with no loss of comprehension. [Weak-Moderate] [adult/college] (via search summary of abstract) — [HKU repository record](https://repository.hku.hk/handle/10722/316509)

### Inferences
- Comprehension support for dyslexic readers via TTS has a defensible meta-analytic base; fluency claims should not be made for Lexi.
- Because Wood's range runs to college and Schneps tested college students, the benefit plausibly extends to teens/adults, but most precise subgroup findings (dyslexia-alone vs language impairment) are from children aged 8-12.
- Lexi's users with dyslexia only (decoding-driven) are the best-supported beneficiaries; users who also have language-comprehension difficulty may benefit less from audio alone.

### Gaps
- Primary full text of Wood 2018 was not retrievable (PMC bot check), so the exact study count, participant total, age moderator and design moderator values are secondary-sourced.
- No meta-analytic or RCT evidence found specifically on TTS and **oral/silent reading fluency** for dyslexic adults/teens.
- No study found of TTS in a **journaling / conversational chatbot** context or on a phone with short messages; all evidence is for passages (typically 200-1000 words).

## 2. Synchronized word/sentence highlighting ("karaoke" / bimodal): evidence and best practice

### Takeaway
Direct comparisons find **no comprehension advantage** for highlighting over plain TTS (Keelor 2020, 2023, children), but small child eye-tracking studies suggest synchronised highlighting makes "reading along" easier and that highlight colour and area alter eye movements. No rigorous evidence exists on best highlight granularity, colour or rate for teens/adults on phones; the industry has converged on offering sentence + word ("dual") highlighting with user-customisable colour.

### Cited Findings
- Keelor 2023: TTS with highlighting vs TTS without highlighting, no significant difference in comprehension; authors say presentational features need more study. [Moderate] [child 8-12] — [PubMed 37119436](https://pubmed.ncbi.nlm.nih.gov/37119436/)
- Keelor 2020 reached the same conclusion on presentational features. [Moderate] [child] (via search summary) — [ATOB v14 Keelor et al.](https://www.atia.org/wp-content/uploads/2020/06/ATOB-V14-A2-Keelor_etal.pdf)
- Ikeshita-Yamazoe and colleagues (iPad eye-tracking, children with dyslexia): a 4-child study found reading along was easier with audio synchronised to highlighting than without; eye-movement responses were affected by the colour and area of highlighting; a 7-child pilot (ages 7-14) found the clearest benefit for a blue band highlighting whole sentences. Outcomes were ease of reading along and eye movements, not comprehension. [Weak] [child] (via search summary; IAFOR PDF returned 403) — [IAFOR ACSET2015 paper](https://papers.iafor.org/wp-content/uploads/papers/acset2015/ACSET2015_20150.pdf); [IAFOR submission page](https://papers.iafor.org/submission20150/)
- Clinton-Lisell 2023 meta-analysis (30 studies, N = 1,945) did not code highlighting as a moderator in the abstract/results I read; its pacing finding (see Q7) is the closest evidence that learner control of timing matters. — [ERIC EJ1403866](https://files.eric.ed.gov/fulltext/EJ1403866.pdf)
- Industry practice (what leading tools offer): Apple iPhone "Highlight Content" marks words, sentences or both with user-chosen colour and style (Mac adds underline vs background colour for sentences) — [Apple iPhone Spoken Content](https://support.apple.com/guide/iphone/spoken-content-iph96b214f0/16.0/ios/16.0), [Apple Mac Read & Speak](https://support.apple.com/guide/mac-help/change-read-speak-settings-for-accessibility-spch638/mac) (via search summary); Read&Write and ClaroRead use dual-colour highlighting (sentence + word) — [Everway ClaroRead](https://www.everway.com/en-gb/products/claroread/), [Everway Read&Write](https://www.everway.com/products/read-and-write-education/); Voice Dream offers sentence, word and line highlighting that can be switched off — [MERLOT listing](https://www.merlot.org/merlot/viewMaterial.htm?id=1170460) (via search summary); Speechify uses karaoke-style word-by-word tracking — [Speechify App Store](https://apps.apple.com/us/app/-/id1209815023); Android Select to Speak highlights follow the speech — [AbilityNet Android 16 guide](https://mcmw.abilitynet.org.uk/how-to-read-selected-text-aloud-using-select-to-speak-in-android-16). All [Vendor].
- Microsoft's Edge Immersive Reader support page lists voice speed/voice/playback controls and does not mention highlighting; I could not confirm word highlighting from the Microsoft pages I could read. — [Microsoft Edge Immersive Reader support](https://support.microsoft.com/en-us/education/learning-accelerators/use-immersive-reader-in-microsoft-edge-1)

### Inferences
- Highlighting is a "comfort/tracking" feature with some child eye-tracking support, not a proven comprehension booster; make it optional and cheap. For Lexi, the current whole-bubble highlight is roughly equivalent to the coarsest sentence-level style; moving to sentence-level (band) with optional word-level is aligned with the vendor consensus.
- Given colour effects on eye movement in the child studies, colour should be user-selectable with a high-contrast default (the "blue band" result is a 7-child pilot and should not be treated as a rule).
- Engineering note (general platform knowledge, not from the sources): word-level sync needs word-boundary timing; device speechSynthesis can supply boundary events on some voices, but Lexi's pre-recorded Piper clips would need word timings generated offline.

### Gaps
- No peer-reviewed study found on highlight granularity (word vs phrase vs sentence), colour, or highlight-lag tolerance for dyslexic adults/teens.
- No study found of highlighting on small phone screens with chat-length text.
- Could not read the IAFOR primary PDFs; details come from a search summary.

## 3. Voice quality (neural vs robotic), preferred speech rate, and pausing

### Takeaway
No study I found tests neural vs robotic voices on **dyslexic** listeners. Adjacent evidence says perceived naturalness and actual comprehension can diverge: a meta-analysis found no reliable human-vs-computer voice difference in reading-while-listening, and neural voices can be rated more natural yet be harder to identify in noise. Rate: the only measured preference data are for adults with aphasia (~150 wpm best as a group) and a practitioner range of 140-180 wpm; individual variation is large, so user-controlled speed is the evidence-supported design. No pause-length evidence found.

### Cited Findings
- Clinton-Lisell 2023: "no reliable differences" in reading-while-listening effects by voice type (human vs computer-generated); the "voice effect" from multimedia-learning research (Mayer et al., 2003) "may not be as robust as once thought" (cites Craig & Schroeder 2019); she concludes this supports using built-in TTS. [Moderate; mostly non-dyslexic, adult/college samples] — [ERIC EJ1403866](https://files.eric.ed.gov/fulltext/EJ1403866.pdf)
- Cohn & Zellou (Interspeech 2020): neural TTS voices rated more natural/human-like than concatenative voices from the same speaker data, but listeners identified target words less accurately with neural TTS at low SNR and for semantically unpredictable sentences; naturalness ratings correlated positively with speech-in-noise accuracy across listeners. [Moderate; general adults, not dyslexia] (via search summary) — [Interspeech 2020 listing](https://papers.cool/venue/cohn20@interspeech_2020@ISCA)
- Aphasia/reading-impairment TTS studies: an older concatenative voice (Ogmios) produced significantly slower reaction times than other artificial voices and a digitised human voice; earlier work (Hux et al.) found a digitised human voice gave better comprehension accuracy than synthetic voices. [Weak-Moderate; aphasia, not dyslexia; voices dated] (via search summary) — [Univ. Barcelona record](https://diposit.ub.edu/items/963494c2-340b-4aba-b491-388d41727e19/full)
- Bione & Cardoso (2020, L2 learners): TTS and human voices were perceived as similarly comprehensible, with comprehension performance similar, but naturalness ratings were unfavourable for the synthetic voice. [Weak-Moderate; L2, not dyslexia] (via search summary) — [Language Learning & Technology](https://www.lltjournal.org/item-detail/944/)
- Speech-rate preference, adults with aphasia (not dyslexia; n = 25; AJSLP 2020): tested 113, 154 and 200 wpm; medium rate most often preferred and most efficient for dual-modality (text + audio) content as a group (~150 wpm), with individual differences. [Moderate; wrong population] — [AJSLP 2019_AJSLP-19-00047](https://pubs.asha.org/doi/10.1044/2019_AJSLP-19-00047)
- Reading Rockets guidance: 140-180 wpm is an "optimal speed for students". [Anecdote/practitioner] (via search summary; page returned 403 on fetch) — [Reading Rockets](https://www.readingrockets.org/topics/assistive-technology/articles/text-speech-tts)
- Practitioner guide suggests starting near 0.9x, slowing to 0.8-0.95x for dense text and 1.05-1.2x if slow speech lets attention drift. [Anecdote] — [read-aloud.com dyslexia/ADHD guide](https://read-aloud.com/guide-dyslexia-adhd.html)
- Fast listening is also valued by some dyslexic adults: a Voice Dream blog profile reports dyslexia researcher Matthew Schneps running voice at ~650 wpm when combined with a dyslexia-augmented visual display, while preferring visual reading when he needs to pause and reflect. [Anecdote] — [Voice Dream blog](https://www.voicedream.com/how-one-dyslexic-speed-reads/)
- Tool speed ranges: Voice Dream 50-700 wpm (MERLOT listing); Speechify up to 4.5x (~900 wpm), recommending a start near 300 wpm. [Vendor] — [MERLOT](https://www.merlot.org/merlot/viewMaterial.htm?id=1170460); [Speechify App Store](https://apps.apple.com/us/app/-/id1209815023)
- Pausing: one Universitat Autonoma de Barcelona repository record (fragmentary, intellectual-disability and control groups, not dyslexia) reports longer pauses between sentences were generally acceptable, longer pauses within sentences were less favoured by controls, and no significant comprehension gain from longer pauses. [Weak] — [UAB record](https://ddd.uab.cat/record/328243?ln=en)
- Mote (vendor blog) says slower speeds help students track words and that pause/rewind/replay matter; gives no pause duration. [Vendor/Anecdote] — [Mote](https://www.mote.com/blogs/text-to-speech-for-dyslexia)

### Inferences
- Upgrading Lexi's non-recorded text to a neural voice is justified on acceptability/consistency grounds, not on proven comprehension gains. The Piper (LJ Speech) clips versus device speechSynthesis voices split is a consistency risk; no evidence was found about voice-switching effects on dyslexic users.
- Lexi's 0.6-1.4x speed range covers the practitioner "140-180 wpm" zone but not the faster end that some dyslexic power users choose (Voice Dream/Speechify go much higher); a wider upper bound and per-user persisted speed are supported by the individual-differences evidence.
- Short, sentence-level pauses are unlikely to harm and may help tracking, but there is no dyslexia-specific evidence on duration; offer as a setting rather than a fixed default.

### Gaps
- No dyslexia-specific study of neural vs robotic voices on comprehension, acceptance, or listening effort.
- No dyslexia-specific measurement of preferred TTS speed or pause duration for adults or teens.
- Cohn & Zellou, Bione & Cardoso and the aphasia studies were read only via search summaries.

## 4. Feature-by-feature survey of leading tools, and which features dyslexic users value most

### Takeaway
All major tools bundle read-aloud with highlighting, plus a subset of: line focus/ruler/mask, syllable splitting, parts of speech, picture dictionary, translation, and distraction-free reading. Microsoft Immersive Reader is the broadest single bundle and can be embedded in web apps. No independent feature-level ranking by dyslexic users was found; the best user-level evidence says TTS (with speech recognition) is among the most-used assistive technologies and that always-available access matters most.

### Cited Findings
**Microsoft Immersive Reader**
- Core features: isolates content to improve readability; picture dictionary for common words; highlights parts of speech (nouns, verbs, pronouns etc.); read aloud; real-time translation; splits words into syllables. Available as a client library to embed in web apps (iframe over the host app; "doesn't store any customer data"). — [Microsoft Learn overview](https://learn.microsoft.com/en-us/azure/ai-services/immersive-reader/overview) [Vendor]
- Edge support page: Line focus highlights 1, 3 or 5 lines (moved with up/down keys); picture dictionary; Translate (can translate the whole page); text size, text spacing, column width, page themes "inspired by Irlen Spectral Filters"; read-aloud speed/voice controls with paragraph skip. — [Microsoft Edge support](https://support.microsoft.com/en-us/education/learning-accelerators/use-immersive-reader-in-microsoft-edge-1) [Vendor]
- Word support page (via search summary): syllables setting shows breaks "to improve word recognition and pronunciation"; clicking a single word reads it aloud and shows a picture; Reading Coach also exists. — [Microsoft Word support](https://support.microsoft.com/en-us/accessibility/word/use-immersive-reader-in-word) [Vendor]

**Apple Speak Screen / Spoken Content (iOS)**
- Settings > Accessibility > Spoken Content: Speak Selection and Speak Screen (two-finger swipe down from top, with pause/rate controls), Highlight Content (words, sentences, or both; user-chosen colour and style), Speaking Rate slider. No syllable, ruler, picture dictionary or parts-of-speech features found for this feature set. — [Apple iPhone Spoken Content](https://support.apple.com/guide/iphone/spoken-content-iph96b214f0/16.0/ios/16.0) (via search summary; tied to iOS 16 guide) [Vendor]

**Google**
- Android Select to Speak: tap or drag-select text to be read; highlighting follows the speech; toolbar controls for speed and paragraph skipping; a blind user's review noted it often reads only what is visible. — [AbilityNet Android 16 guide](https://mcmw.abilitynet.org.uk/how-to-read-selected-text-aloud-using-select-to-speak-in-android-16); [AbilityNet Android 7](https://mcmw.abilitynet.org.uk/android-7-nougat-select-to-speak); [AFB review](https://afb.org/aw/fall2024/android-reading-mode) [Vendor/Anecdote]
- Google Read Along is a **child-only** reading-practice app (sources say ages 5+ or 5-9); reading buddy "Diya" listens as the child reads aloud and offers help with a word or sentence. Not a TTS reading aid for adults/teens. — [TechCrunch 2020](https://techcrunch.com/2020/05/07/google-launches-read-along-a-free-app-that-helps-young-children-practice-reading) [Vendor/press, child]

**Read&Write (Texthelp, now Everway)**
- TTS with word highlighting and natural voices; Screen Masking ("reading spotlight"); Picture & Text Dictionaries; Simplify/Rewordify; word prediction/autocorrect; translation of words/paragraphs/pages; Audio Maker (text to MP3); Vocabulary List with definitions and images; dyslexia-friendly fonts. Platforms: Windows, Mac, Chrome, Edge, iPad/iPhone, Android. Vendor claims: >10 million students, >50,000 schools; Glasgow City Council figures (+77.8% reading fluency, +78% reading confidence) are vendor-cited, self-reported. The page lists no reading ruler. — [Everway Read&Write](https://www.everway.com/products/read-and-write-education/) [Vendor]

**ClaroRead**
- TTS with word-tracking and dual-colour highlighting; ScreenRuler offers Ruler (tinted strip with dark background / screen mask), Underline, and Overlay (full-screen tint); older Newcastle notes call tinting "ClaroView". I found no picture dictionary. Mobile: sources conflict on iOS/Android parity. — [Everway ClaroRead](https://www.everway.com/en-gb/products/claroread/); [ClaroRead ruler/mask how-to](https://academy.texthelp.com/claroread/howtos/apply-a-reading-ruler-or-screen-mask/); [Newcastle University](https://services.ncl.ac.uk/itservice/help-services/accessibility-advice/specialistsoftware/claroread) [Vendor]

**Helperbird (browser extension / iOS)**
- 32 dyslexia fonts (OpenDyslexic, Lexend, Atkinson Hyperlegible, Andika); Dyslexia Ruler (coloured current-line highlight); Focus Ruler (dims page except a band); Reading Guide following the cursor; free TTS in 90+ languages; Speed Reading (one word at a time); translation to 64 languages; includes Microsoft Immersive Reader and Reading Mode; 24-colour overlay; letter/word/line spacing, paragraph width; Dictionary (Pro). Page does not list picture dictionary, syllables, parts of speech, or TTS highlighting/speed controls. No research cited. — [Helperbird features](https://www.helperbird.com/features/) [Vendor]

**Speechify**
- Karaoke-style word-by-word tracking; 200+ voices in 60+ languages; speed up to 4.5x (~900 wpm), recommends starting near 300 wpm; dyslexia claims come mostly from third-party sites. — [Speechify App Store](https://apps.apple.com/us/app/-/id1209815023); [OutilsTICE review](https://outilstice.com/en/2025/04/speechify-aide-lecture-audio-eleves-dyslexiques/) [Vendor/Anecdote]

**NaturalReader**
- AI voices (LLM, Content Aware, HD), voice design by prompt and voice cloning, 90+ languages; camera OCR scanner; offline mode; iOS/Android apps and Chrome extension; mentions a "dyslexia font" and mobile Immersive Reader "Focus mode with highlighted text" with synchronised audio; claims 10M users. — [NaturalReader](https://www.naturalreaders.com/) [Vendor]

**Voice Dream Reader**
- iPhone/iPad/Mac; imports PDF/EPUB/Word/PowerPoint/web; adjustable voices and speed (50-700 wpm per MERLOT); sentence/word/line highlighting that can be switched off; OpenDyslexic font; customisable colour themes; sentence-level rewind/forward; pronunciation dictionary; per-document saved rate. No pause-between-sentences setting found. — [Voice Dream](https://www.voicedream.com/); [MERLOT](https://www.merlot.org/merlot/viewMaterial.htm?id=1170460); [DAISY overview](https://daisy.org/info-help/guidance-training/reading-systems/voice-dream-reader-overview/) [Vendor]

**What dyslexic users value most (user-level evidence)**
- Draffan, Evans & Blenkhorn (2007): telephone survey of 455 UK post-secondary students with dyslexia on equipment/software received via Disabled Students' Allowance; students satisfied with the special-purpose software, but many opted out of training. — [Southampton eprints 264143](https://eprints.soton.ac.uk/264143) [Moderate, UK-only, supplier-client sample]
- Draffan (2014) follow-up (via search summary): TTS and speech recognition used by 54% of respondents; Microsoft Office rated most useful; students valued having assistive technology "at all times" and said it helped them keep pace. — [Draffan 2014](https://eprints.soton.ac.uk/420256/1/Assistive_Technology_and_Associated_Training_Draffan_2014.pdf) [Moderate-Weak]
- A practitioner guide calls TTS the most useful and least controversial category, noting it is built into every major platform. — [e-include reading support](https://e-include.eu/assistive-technology/reading-support/) [Anecdote]

### Inferences
- Feature convergence across tools suggests a core set that users encounter and expect: read-aloud with highlight, speed control, font/spacing customisation, a line-focus option, and word lookup. Syllables and parts of speech are Microsoft-specific differentiators with little independent evidence (see Q5-6).
- Embedding Immersive Reader is technically possible for Lexi's web app (iframe client library) but I found no confirmation of React Native/Expo support; for the native app the practical analogue is Apple Spoken Content / Android Select to Speak or in-app implementation.

### Gaps
- No independent survey (BDA, IDA, Made By Dyslexia, Understood.org) ranking individual features (ruler, syllables, picture dictionary, translation, focus mode) by dyslexic adults/teens was found; the Draffan data are TTS-level only and from UK students.
- Microsoft Edge page did not mention syllables or parts of speech (they appear on Word/PowerPoint/overview pages); Immersive Reader highlighting during read-aloud and any service-lifecycle/retirement status for the Azure client library were not confirmed (a search found no retirement notice).
- Apple, Google Select to Speak, ClaroRead and Voice Dream details are from search summaries of vendor/third-party pages; menu names may differ by OS version.

## 5. Line focus, reading rulers, masking, and spacing

### Takeaway
Direct evidence for digital rulers/line focus is a single small conference poster (peer-review status unclear); stronger evidence concerns **short line length** (Schneps 2013, high-schoolers) and **extra letter spacing** (Zorzi 2012, children), which together suggest narrow columns and extra spacing help dyslexic readers. Coloured overlays/tints have weak or controversial support.

### Cited Findings
- Schneps et al. 2013 (*PLoS ONE*), 27 high-school students aged 15-19 (mean 17.1) with lifelong reading difficulties, eye tracking: reading on a short-line device (iPod Touch, ~2.2 words/12.7 characters per line) vs a long-line device (iPad, ~11.6 words/67 characters) gave 150 vs 118 wpm (~27% faster), ~11% fewer fixations, leftward regressions ~21 vs ~48 (more than halved), with no comprehension cost (device effect on recall marginal, p = .051). Comprehension was near ceiling; line length and device size confounded; no typical-reader comparison. Wider letter spacing slowed reading overall but improved comprehension mainly for weaker readers (~98% vs 85% recall). [Moderate] [teen] — [PMC3734020](https://pmc.ncbi.nlm.nih.gov/articles/PMC3734020/)
- Related larger Schneps study (via search summary): 103 high-school students with dyslexia, paper vs small handheld e-reader; improved speed for those with weakest decoding/sight-word skills and comprehension for those with limited visual attention span. [Moderate] [teen] — [Whiterose eprints 81448](https://eprints.whiterose.ac.uk/81448)
- Zorzi et al. 2012 (*PNAS* 109(28):11455-9): 74 dyslexic children (8-14; Italian and French); extra-large letter spacing (+2.5 pt in 14-pt Times, with word/line spacing scaled) roughly doubled reading accuracy and raised speed more than 20%; interpreted as reduced crowding; typical-reading children showed no speed gain. [Strong-Moderate (replicated across 2 languages)] [child] (via search summary) — [PMC3396504](https://pmc.ncbi.nlm.nih.gov/articles/PMC3396504); [Univ. Padua](https://ccnl.psy.unipd.it/publications/publications_folder/extra-large-letter-spacing-improves-reading-in-dyslexia/view)
- Digital reading rulers (Adobe + UCF Virtual Readability Research Lab, VSS 2021 poster; "initial" results, participant counts internally inconsistent on the blog page: "35" vs 19 dyslexic + 26 non-dyslexic): four conditions (mouse tracking, underline, lightbox, grey line); most dyslexic readers gained ~23 wpm with a fixed underline; some dyslexic readers were ~23 wpm slower with the lightbox while those who benefited gained 111 wpm; non-dyslexic readers gained 29-36 wpm with grey bar or mouse tracking. Authors claim rulers help and that designs by dyslexic designers worked better for dyslexic readers. [Weak; poster, not confirmed peer reviewed] — [Adobe blog](https://blog.adobe.com/en/publish/2021/05/06/hacking-readability-for-dyslexic-readers)
- Line focus in Immersive Reader: 1, 3 or 5 lines; Read&Write: Screen Masking; ClaroRead: Ruler/Underline/Overlay; Helperbird: Dyslexia Ruler, Focus Ruler, Reading Guide. [Vendor] — [Microsoft Edge support](https://support.microsoft.com/en-us/education/learning-accelerators/use-immersive-reader-in-microsoft-edge-1); [Everway Read&Write](https://www.everway.com/products/read-and-write-education/); [ClaroRead how-to](https://academy.texthelp.com/claroread/howtos/apply-a-reading-ruler-or-screen-mask/); [Helperbird](https://www.helperbird.com/features/)
- Coloured overlays: a 2014 critical review in *Frontiers in Psychology* says results for overlay efficacy are "at least controversial"; a practitioner guide says research does not support a specific colour correcting a visual deficit, though some readers report personal benefit; same guide says increased spacing and reduced line length improve reading speed for struggling readers. [Weak/controversial] — [Frontiers in Psychology 2014](https://www.frontiersin.org/articles/10.3389/fpsyg.2014.00833/text); [e-include](https://e-include.eu/assistive-technology/reading-support/)

### Inferences
- Phone chat bubbles already impose short lines; this is consistent with the Schneps benefit, but the study compared extremes (2 words vs 11 words per line) and says nothing about the best intermediate width.
- A line-focus/ruler feature is low-risk, low-cost and user-valued in tooling, but evidence of benefit is thin; it should be an optional toggle. Because overlay/tint evidence is weak, treat colour themes as preference, not treatment.
- Spacing is the best-evidenced typographic lever, though Schneps found wide spacing slowed reading overall and helped mainly weaker readers, so make it adjustable rather than a global default.

### Gaps
- No peer-reviewed RCT of digital reading rulers/line focus on dyslexic adults/teens; the UCF poster's statistical rigour could not be assessed.
- Schneps/Zorzi were read partly through search summaries (Zorzi) and partly full text (Schneps 2013 eye tracking).
- No evidence found on rulers/masks for TTS-synchronised text (e.g., ruler that follows the spoken line).

## 6. Picture dictionaries, inline definitions, and tap-a-word-to-hear

### Takeaway
All leading tools offer tap/click-a-word lookup with audio and often a picture, but I found **no rigorous trial** showing these improve comprehension or vocabulary for dyslexic adults/teens. The case rests on design logic (linking sound, spelling and meaning) and on vendor and practitioner reports.

### Cited Findings
- Immersive Reader: clicking a word reads it aloud and shows a picture to help define it (picture dictionary). [Vendor] — [Microsoft Word support](https://support.microsoft.com/en-us/accessibility/word/use-immersive-reader-in-word) (via search summary); [Microsoft Learn overview](https://learn.microsoft.com/en-us/azure/ai-services/immersive-reader/overview)
- Read&Write offers Picture & Text Dictionaries and a Vocabulary List with definitions and images; its hover-to-hear feature reads a word aloud. [Vendor] — [Everway Read&Write](https://www.everway.com/products/read-and-write-education/); [TRU / Texthelp support-tools PDF](https://www.tru.ca/__shared/assets/Support_Tools_for_Students_with_Dyslexia46289.pdf) (via search summary)
- Helperbird Dictionary (Pro) gives definitions, examples, audio and similar words; no picture dictionary listed. [Vendor] — [Helperbird](https://www.helperbird.com/features/)
- Research prototype: a 2011 conference paper describes a browser add-on multimedia dictionary for readers with dyslexia linking words to video, audio, animation and images; it is a design proposal with no outcome data. [Weak] (via search summary) — [KSU publication record](https://fac.ksu.edu.sa/omalharbi/publication/29615)
- Clinton-Lisell 2023 found only two studies on second-language incidental vocabulary during reading-while-listening, calling any benefit premature to assume. [Weak] — [ERIC EJ1403866](https://files.eric.ed.gov/fulltext/EJ1403866.pdf)

### Inferences
- For Lexi, tap-a-word-to-hear is a natural extension of the existing per-bubble 🔊 button and is aligned with every top tool; a picture/emoji gloss fits Lexi's emoji-first design but is unvalidated for dyslexic comprehension specifically.
- Because emoji are already Lexi's primary meaning channel, an emoji-as-picture-dictionary approach should be framed as a hypothesis to test in user trials, not as evidence-based treatment.

### Gaps
- No controlled study found of picture dictionaries or inline definitions for dyslexic teens/adults. A search summary mentioned a middle-school pop-up dictionary study (Fry & Gosky) in which struggling readers used the dictionary heavily, but I could not verify the citation or outcome, so it is not relied on.
- No data on word-level tap-to-hear usage rates or whether it reduces decoding burden in conversational text.

## 7. Listening while reading vs listening only (does text + audio beat audio alone?)

### Takeaway
For the general population, text + audio beats text alone only when pacing is externally controlled (g = .41 experimenter-paced vs g = .06 self-paced); struggling readers may benefit more but data are sparse. For dyslexic readers, the main evidence (Wood 2018; Keelor 2023) compares TTS against no-TTS rather than text + audio against audio alone, so I found no direct evidence that showing text beats audio only for dyslexic adults/teens; the one relevant child data point shows listen-only was as good as TTS for students with dyslexia alone.

### Cited Findings
- Clinton-Lisell 2023 meta-analysis (30 studies, N = 1,945, 62 effect sizes, robust variance): overall benefit of reading-while-listening vs reading only was trivial (g = .18, SE = .07, p = .01); limited to experimenter-paced studies (g = 0.41, 95% CI [0.13, 0.70]); no reliable effect when self-paced (g = 0.06, 95% CI [-0.07, 0.19]); funnel plot suggests some publication bias; most samples were college students/adults with human voices. She argues the finding supports the dual-channel account over cognitive-load redundancy theory, and concludes students "should not be discouraged" from audio-assisted reading. [Moderate-Strong, but general population] — [ERIC EJ1403866](https://files.eric.ed.gov/fulltext/EJ1403866.pdf)
- Clinton-Lisell 2022 meta-analysis (Review of Educational Research) on reading vs listening: no overall reliable difference; reading was better when reading was self-paced and listening experimenter-paced; no reliable difference when both were experimenter-paced (as summarised in the 2023 paper). [Moderate] — [ERIC EJ1403866](https://files.eric.ed.gov/fulltext/EJ1403866.pdf)
- Keelor 2023 included a listen-only condition: students with dyslexia alone derived significantly more benefit from TTS and from listen-only than students with reading + language impairment (a TTS vs listen-only difference was not reported in the summary I could access). [Moderate] [child 8-12] — [PubMed 37119436](https://pubmed.ncbi.nlm.nih.gov/37119436/)
- Rogowsky et al. (2016, adults): cited in the meta-analysis as an adult study comparing reading, listening and combined formats; a SAGE Open note says adult research is "conflicting". [Weak/Moderate; not dyslexia] — [SAGE Open 2016](https://journals.sagepub.com/doi/reader/10.1177/2158244016669550) (via search summary)

### Inferences
- Because dyslexic readers' bottleneck is decoding, audio carries the linguistic content; showing the text may add little to comprehension but supports word-to-sound mapping and (for a journaling tool) lets the user see and edit their own text. Presenting text + audio together is the safe default and matches all leading tools.
- User-controlled pacing (pause, replay, speed, tap-to-hear) matters: the benefit pattern in general readers depends on who controls timing, and dyslexic users reportedly like to pause and reflect (Schneps anecdote).

### Gaps
- No study directly comparing text + audio vs audio alone for dyslexic adults or teens.
- Keelor's TTS vs listen-only difference and its effect sizes were not available to me.
- The extent to which the general-population pacing moderator applies to dyslexic readers is untested.
