# "Do next" features: shared spec

This spec covers the 14 "Do next" features from [`reports/Dyslexia friendly upgrades for Lexi.md`](../reports/Dyslexia%20friendly%20upgrades%20for%20Lexi.md). Both apps follow it. Copy is exact: new fixed lines are recorded in Lexi's voice (see `tools/voice/lines.json`), so wording must not drift between the web and native apps.

## 1. Letter spacing (new)

Add a **Letter spacing** setting with three values. Word spacing grows with letter spacing, because letter spacing on its own slows reading (Galliussi 2020).

| Value | Letter spacing | Word spacing |
|---|---|---|
| Normal (default) | 0.012 em | 0.08 em |
| Roomy | 0.06 em | 0.16 em |
| Extra roomy | 0.12 em | 0.32 em |

When spacing is not Normal, or the text size is 24 px or more, bot bubbles widen to `min(86%, 26em)`.

## 2. Bigger text (improve)

- Sizes are Small 16, Medium 18, Large 20, Extra large 24 and Huge 28 (px or dp).
- The old 23 px value migrates to Extra large (24).
- **Native:** multiply sizes by the phone's font scale. Never set `allowFontScaling={false}`.

## 3. No slanted text (improve)

- No italics anywhere.
- No ALL CAPS: day cards say "Mon", not "MON", and nothing uses text-transform uppercase.
- No underlines.
- Done to-dos show ✅ and are dimmed, with no line-through.
- Use bold for emphasis.

## 4. Follow phone settings (improve)

When **Reduce motion** is on:
- no typing dots (messages appear after about 150 ms)
- no pop-in animation
- no celebration rows (🎉 / 👏🏽)

Web uses `prefers-reduced-motion`. Native uses `AccessibilityInfo.isReduceMotionEnabled()` and listens for changes.

Web also honors `prefers-contrast: more`: secondary text becomes full ink and borders become stronger.

## 5. "I'm an AI" label (new)

Show a slim line under the top bar on the chat screen at all times: **"🤖 Lexi is an AI, not a person or a therapist."** It has a 🔊 button.

## 6. Help button (new)

- A **🆘 Help** pill at the right of the top bar, in the same spot on every screen, including the free-write sheet header.
- It opens the Help sheet. Each section has a 🔊 button.

**Sections, in order:**

1. **🛟 Need help now?**
   - Body: "If you might hurt yourself, or you are in danger, call your local emergency number now."
   - Then the country's emergency number in big text, the help lines, and a **Your country** picker.
2. **🧭 How to use Lexi.** One tip per line:
   - "🧭 Check in: tap Guided check-in and pick emoji."
   - "✏️ Write: tap Write on my own. Spelling doesn't matter."
   - "🔊 Listen: tap the speaker on any message."
   - "📖 Journal: see your days and your entries."
   - "⚙️ Settings: change text size, spacing, colors and voice."
3. **🛡️ How Lexi keeps you safe**
   - "Lexi looks for words about wanting to die or hurting yourself, even when they are spelled in a different way or written with emoji. If it finds them, it shows you help lines. When Lexi's chat brain is on, Claude checks too. Lexi can make mistakes, so if you need help, please use the help lines."
4. **🔒 Your privacy:** the privacy lines from §13.

## 7. Local crisis lines (improve)

- Default the country from the locale region (for example `en-GB` gives GB). Otherwise default to "Other".
- The user can change it in Help. It's stored as the setting `country`.
- Show numbers as large selectable text. A `tel:`/`sms:` link is a convenience only.

| Code | Emergency | Lines |
|---|---|---|
| US | 911 | 988 Suicide & Crisis Lifeline: call or text **988**. Crisis Text Line: text **HOME** to **741741**. |
| CA | 911 | 9-8-8 Suicide Crisis Helpline: call or text **988**. |
| GB | 999 | Samaritans: call **116 123** (free, any time). Shout: text **SHOUT** to **85258**. |
| IE | 112 or 999 | Samaritans: call **116 123**. Text About It: text **HELLO** to **50808**. |
| AU | 000 | Lifeline: call **13 11 14** or text **0477 13 11 14**. |
| NZ | 111 | Need to talk?: call or text **1737**. Lifeline: **0800 543 354**. |
| Other | your local emergency number | Find a helpline: **findahelpline.com**, a free list of helplines in many countries. |

## 8. Smarter crisis check (improve)

The final level is `max(local, AI)`, where none < check < risk.

**Local check.** Run `riskCheck(text)` (code below) on:
- every free-text chat message
- free-write text on save
- check-in notes when the check-in is saved

**AI check.**
- **Chat:** the model starts every reply with a tag line: `[ok]`, `[check]` or `[risk]`. The tag is stripped before display.
- **Saved writing:** if the AI is on and the text has 3 or more words, make one quick JSON call with this prompt:
  > You check journal text for self-harm or suicide risk. The writer is dyslexic, so expect misspellings, sound-alike spellings and emoji. Reply with only JSON: {"level":"none"|"check"|"risk"}. "risk" = says they want to die, kill or hurt themselves, or has a plan. "check" = sounds hopeless, wants to disappear, or gives unclear dark hints. Otherwise "none".
  >
  > Text:
  > …

**Flows.** These are fixed lines, all recorded.

- **risk:**
  1. "I'm really glad you told me. 💛"
  2. "Your safety matters most right now."
  3. Show the help-lines card for the country.
  4. "Please talk to someone now. You can call or text these lines."
  5. Ask "Are you safe right now?" with Yes / No.
     - **Yes:** "Thank you for telling me. I'm here if you want to talk." Then "Tap Help at the top any time. 🆘"
     - **No:** "Please call your local emergency number now. 🆘" Then show the emergency card again.
- **check:**
  1. "That sounds really hard. 💛"
  2. Ask "Are you safe right now?"
     - **Yes:** "Okay. I'm glad. I'm here if you want to talk."
     - **No:** run the risk flow from step 2.
- For saved writing, the entry is saved first, the app switches to Home, and then the flow runs.
- Lexi never contacts anyone.

```js
// Shared safety + style logic (web: inline in lexi.html; native: port to src/safety.ts)
const RISK_PHRASES = ['kill myself','killing myself','kill my self','suicide','suicidal','end my life','end it all','take my life','want to die','wanna die','wish i was dead','wish i were dead','better off dead','better off without me','hang myself','self harm','hurt myself','hurting myself','harm myself','cut myself','cutting myself','dont want to live','no reason to live','unalive myself'];
const CHECK_PHRASES = ['want to disappear','cant go on','give up on everything','no point in anything','hopeless','worthless','hate my life','dead inside','overdose','nobody would care','cant do this anymore','dont want to be here'];
const RISK_TOKENS = ['kms','kys','unalive','sewerslide'];
const RISK_EMOJI = /[\u{1F52A}\u{1FA78}\u{26B0}\u{1FAA6}\u{1FAA2}]/u; // 🔪 🩸 ⚰ 🪦 🪢
function soundKey(s) {
  return String(s).toLowerCase()
    .replace(/\bd[yi]e\s+(my|your|his|her|their|the|it|this|that|a)\b/g, 'colour $1') // "dye my hair" is not "die"
    .replace(/[’']/g, '').replace(/[^a-z0-9\s]/g, ' ')
    .replace(/ph/g, 'f').replace(/ck/g, 'k').replace(/c(?=[eiy])/g, 's').replace(/c/g, 'k')
    .replace(/z/g, 's').replace(/y/g, 'i').replace(/wh/g, 'w').replace(/kn/g, 'n')
    .replace(/([a-z])\1+/g, '$1').replace(/\s+/g, ' ').trim();
}
function lev(a, b, max) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i]; let best = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      if (cur[j] < best) best = cur[j];
    }
    if (best > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}
// phrase match: starts at a word start with the same first letter; exact prefix, or ~1 typo per 6 letters ending on a word end
function fuzzyHas(hay, starts, phrase) {
  const p = soundKey(phrase).replace(/ /g, '');
  const max = p.length >= 10 ? 2 : p.length >= 6 ? 1 : 0;
  const ends = new Set(starts.slice(1)); ends.add(hay.length);
  for (const i of starts) {
    if (hay[i] !== p[0]) continue;
    if (hay.startsWith(p, i)) return true;
    for (let len = p.length - max; max && len <= p.length + max; len++) {
      if (ends.has(i + len) && lev(hay.slice(i, i + len), p, max) <= max) return true;
    }
  }
  return false;
}
function riskCheck(text) {
  const raw = String(text || '');
  const key = soundKey(raw);
  const words = key ? key.split(' ') : [];
  if (words.some(w => RISK_TOKENS.includes(w))) return 'risk';
  let hay = '', starts = [];
  words.forEach(w => { starts.push(hay.length); hay += w; });
  if (RISK_PHRASES.some(p => fuzzyHas(hay, starts, p))) return 'risk';
  if (CHECK_PHRASES.some(p => fuzzyHas(hay, starts, p))) return 'check';
  if (RISK_EMOJI.test(raw) && words.length <= 4) return 'check';
  return 'none';
}
const LEVEL = { none: 0, check: 1, risk: 2 };
const maxLevel = (a, b) => (LEVEL[a] >= LEVEL[b] ? a : b);

// Reply style check for every AI reply (chat + reflections)
const BANNED = ['hang in there','silver lining','bright side','everything happens for a reason','cheer up','be happy','stay positive','just be positive','good vibes','could be worse','piece of cake','every cloud','it is what it is','chin up','under the weather','beat yourself up','tough it out','man up','snap out of it'];
function styleCheck(text, { icons = true } = {}) {
  let tag = 'ok';
  const lines = cleanLines(text).map(l => l.replace(/^\[(ok|check|risk)\]\s*/i, (_, t) => { tag = t.toLowerCase(); return ''; })).filter(Boolean);
  let sentences = [];
  lines.forEach(l => (l.match(/[^.!?…]+(?:[.!?…]+["')\]]*)?/g) || [l]).map(s => s.trim()).filter(Boolean).forEach(s => {
    if (!stripEmoji(s) && sentences.length) sentences[sentences.length - 1] += ' ' + s; else sentences.push(s);
  }));
  const kept = sentences.filter(s => !BANNED.some(b => s.toLowerCase().includes(b)));
  if (kept.length) sentences = kept;
  const out = []; let count = 0;
  for (const s of sentences) {
    const w = stripEmoji(s).split(/\s+/).filter(Boolean).length;
    if (out.length === 3) break;
    if (count + w > 50) { if (!out.length) out.push(stripEmoji(s).split(/\s+/).slice(0, 50).join(' ') + '…'); break; }
    out.push(s); count += w;
  }
  const lines2 = out.map(s => {
    const emo = [...new Set(s.match(EMOJI_RE) || [])].slice(0, 2);
    const body = stripEmoji(s);
    return icons && emo.length ? body + ' ' + emo.join(' ') : body;
  }).filter(Boolean);
  return { tag, lines: lines2 };
}
```

## 9. Kind, honest replies (improve)

Add these rules to the chat prompt (and the reflection prompt, minus the tag rule):

- Accept the feeling. Never agree with harsh words the user says about themselves (like "I'm stupid" or "I'm useless"). Gently disagree with the label, not the feeling. Example: "Reading is hard for you. That doesn't make you stupid."
- Don't flatter or just agree. Be honest and kind.
- You are an AI. Never say you are a person or a therapist. Don't use therapy words like therapy, diagnosis, treatment or disorder.
- When things sound heavy, suggest a real person: a friend, family, a doctor or a helpline.
- No idioms or sayings (like "hang in there" or "silver lining").
- Start your reply with exactly one tag on its own line: [ok], [check] if the user might be unsafe or very hopeless, or [risk] if they talk about wanting to die or hurt themselves.
- In words-only mode, add: Do not use emoji.

## 10. Reply style check (improve)

Run `styleCheck` on every AI reply after it finishes streaming, and on every reflection:
- up to 3 sentences and 50 words
- banned idioms dropped
- emoji moved to the end of each sentence (at most 2)
- no emoji in words-only mode

Each kept sentence becomes its own bubble. While a reply is streaming, show the raw lines with the tag stripped; when it finishes, replace them with the checked lines.

## 11. Days journaled, not streaks (improve)

- Journal stats are **Days journaled** (distinct days with an entry), **Feelings named** (total mood picks) and **Entries**.
- A new setting, **Show streak and word count** (off by default), adds two more stats:
  - **Days in a row (rest days OK):** a single missed day doesn't break the run.
  - **Words written**

## 12. Tidy word by word (improve)

Make one JSON call with this prompt:

> Find spelling mistakes and sound-alike word mix-ups (like there/their or here/hear) in the journal text. Do not change style, grammar, slang, emoji or capital letters. Reply with only JSON: {"fixes":[{"from":"the wrong word exactly as written","to":"the fixed word","kind":"spelling" or "sound-alike","hint":"sound-alike only: 2 to 4 simple words about the meaning"}]}. At most 20 fixes. If there are none, reply {"fixes":[]}.
>
> Text:
> …

**UI:**
- One row per fix: **from → to**, a 🔊 button (it says the fixed word, then the hint), and **Use** / **Keep mine**.
- **Use all** and **Undo all** buttons.
- **Build the text from the original.** Apply the accepted fixes from left to right; each one replaces the first whole-word match of `from` after the previous fix.
- **Keep the original.** On save, if the text differs from the pre-tidy original, store it as `original` on the entry. The journal entry shows a **See my original words** toggle.

## 13. Privacy in plain words (new)

Show these lines in Settings → 🔒 Your privacy and in Help, each one recorded:

1. "🔒 Your journal is private. Only you can see it."
2. Storage, which differs by app:
   - **Web:** "💾 It is saved to your Claude account, so it is there on your other devices."
   - **Native:** "💾 It is saved on this phone only."
3. The AI, which also differs by app:
   - **Web:** "🤖 When you chat with me, tidy your spelling, or ask for a reflection, your words go to Claude, an AI made by Anthropic, to make a reply."
   - **Native:** "🤖 When you chat with me, tidy your spelling, or ask for a reflection, your words go to Claude, an AI made by Anthropic, using your API key."
4. "🛟 If you write about hurting yourself, I show you help lines. I can't call anyone, and nobody is told."
5. "🗑️ You can delete one entry, or everything, in Settings."

## 14. Better dictation (native only, improve)

In expo-speech-recognition, turn on:
- `requiresOnDeviceRecognition` where it's supported, falling back to normal recognition
- `addsPunctuation: true`
- `contextualStrings`: every mood and topic label plus the user's own custom words, up to 100

## New recorded lines

All of these are added to `tools/voice/lines.json`.

- **AI label:** "Lexi is an AI, not a person or a therapist."
- **Safety flows:** every line in §8.
- **Help sheet:** the §6 body, the five tips and the safety paragraph.
- **Privacy:** the five §13 lines, both variants of lines 2 and 3.
