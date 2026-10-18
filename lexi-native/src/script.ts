// Lexi's conversation script: onboarding (Chat Bot Plan), the guided check-in, free chat and reflections.
// Copy and order match lexi.html.
import { BAND_BY, TOPIC_BY, YES_NO, type Pick } from './content';
import { addBot, addCard, addMe, addMeEmoji, ask, say, sayMany, sayQueue, showTyping } from './chat';
import { aiErrorText, claude, parseJsonReply, type Msg } from './ai';
import { asLevel, maxLevel, riskCheck, styleCheck, type Level } from './safety';
import {
  addEntry, aiReady, ready, setOnboarded, setSending, setSheet, showView, state, toast, updateEntry,
  type Entry, type NewEntry, type TopicAnswer,
} from './store';
import { dayKey, sleep } from './text';

/* ---------- helpers ---------- */
export function moodShares(moods: Pick[] | undefined) {
  const c = { content: 0, stressed: 0, low: 0 };
  (moods || []).forEach(m => { if (m.band && c[m.band] != null) c[m.band]++; });
  return c;
}
function reactionFor(moods: Pick[]): string {
  if (!moods.length) return "That's okay. We can keep going. 🙂";
  const c = moodShares(moods);
  const top = Object.entries(c).sort((a, b) => b[1] - a[1]);
  if (top[0][1] === top[1][1]) return 'Mixed days are normal. Thanks for being honest. 🧩';
  if (top[0][0] === 'content') return 'Content is a good place to be. 🌤️';
  if (top[0][0] === 'stressed') return 'Thanks for telling me. That sounds like a lot. 🫂';
  return "I hear you. Low days are real. You don't have to fix it right now. 🤝";
}
export function answerText(a: TopicAnswer): string {
  const bits: string[] = [];
  if (a.picks && a.picks.length) bits.push(a.picks.map(p => p.e + ' ' + p.label).join(' · '));
  if (a.todos && a.todos.length) bits.push(a.todos.map(t => '☐ ' + t.t).join(' · '));
  if (a.note) bits.push(a.note);
  return bits.join(' — ');
}
export function entrySummary(en: NewEntry): string {
  const parts: string[] = [];
  if (en.moods && en.moods.length) parts.push('Mood: ' + en.moods.map(m => m.label + (m.band ? ' (' + BAND_BY[m.band].name + ')' : '')).join(', '));
  (en.topics || []).forEach(tp => {
    const T = TOPIC_BY[tp.key]; const bits: string[] = [];
    if (tp.picks && tp.picks.length) bits.push(tp.picks.map(p => p.label).join(', '));
    if (tp.todos && tp.todos.length) bits.push(tp.todos.map(x => x.t + (x.done ? ' (done)' : '')).join(', '));
    if (tp.note) bits.push(tp.note);
    parts.push((T ? T.name : tp.key) + ': ' + bits.join('. '));
  });
  if (en.text) parts.push('Writing: ' + en.text);
  return parts.join('\n');
}

/* ---------- menus ---------- */
export function offerActions() {
  addCard('choices', {
    options: [
      { e: '🧭', label: 'Guided check-in', run: () => startGuided() },
      { e: '✏️', label: 'Write on my own', run: () => openSheet() },
      { e: '📖', label: 'Open journal', run: () => showView('journal') },
    ],
  }, false);
}
export function openSheet() { setSheet(true); }

/* ---------- guided check-in ---------- */
let guidedActive = false;
export async function startGuided(fromIntro = false) {
  showView('home');
  if (guidedActive) { toast('Your check-in is already open below. 👇'); return; }
  guidedActive = true;
  try {
    if (!fromIntro) await say("Let's check in. 🧭");
    await say('How do you feel? Pick as many as you like.');
    const moods = await addCard<Pick[]>('mood');
    if (moods.length) addMeEmoji(moods.map(m => m.e), moods.map(m => m.label).join(' · ')); else addMeEmoji(['⏭️'], 'Skip');
    await say(reactionFor(moods));
    await say('What do you want to talk about today?');
    const keys = await addCard<string[]>('topics');
    if (keys.length) addMeEmoji(keys.map(k => TOPIC_BY[k].icon), keys.map(k => TOPIC_BY[k].name).join(' · '));
    else addMe('Just my mood today');
    const topics: TopicAnswer[] = [];
    for (const k of keys) {
      const T = TOPIC_BY[k];
      await say(T.icon + ' ' + T.q);
      const a = await addCard<TopicAnswer | null>('topicAnswer', { topic: T });
      // Picks alone show as big emoji; anything typed (notes, to-dos) keeps a bubble.
      if (!a) addMeEmoji(['⏭️'], 'Skip');
      else if (a.picks.length && !a.note && !a.todos.length) addMeEmoji(a.picks.map(p => p.e), a.picks.map(p => p.label).join(' · '));
      else addMe(answerText(a));
      if (a) topics.push(a);
    }
    if (!moods.length && !topics.length) { await say("Nothing to save this time. That's okay. 🏡"); offerActions(); return; }
    const entry: NewEntry = { kind: 'guided', createdAt: Date.now(), day: dayKey(), moods, topics, text: '' };
    const id = await addEntry(entry);
    await say('Saved to your journal. 📖 ✔️');
    // Check-in notes and to-dos get the same crisis check as other writing (§8). No celebration after it fires.
    const notes = topics.flatMap(tp => [tp.note, ...(tp.todos || []).map(td => td.t)]).filter(Boolean).join('\n');
    const level = notes ? await checkSavedWriting(notes) : 'none';
    if (level !== 'none') { await safetyFlow(level); return; }
    await say('👏🏽👏🏽👏🏽👏🏽');
    if (aiReady()) {
      const want = await ask('Want a short reflection on today?', YES_NO, true);
      if (want) await reflect(entry, id);
    }
    offerActions();
  } finally { guidedActive = false; }
}

/* ---------- AI rules shared by chat and reflections (§9) ---------- */
function kindRules(): string[] {
  return [
    '- Accept the feeling. Never agree with harsh words the user says about themselves (like "I\'m stupid" or "I\'m useless"). Gently disagree with the label, not the feeling. Example: "Reading is hard for you. That doesn\'t make you stupid."',
    "- Don't flatter or just agree. Be honest and kind.",
    "- You are an AI. Never say you are a person or a therapist. Don't use therapy words like therapy, diagnosis, treatment or disorder.",
    '- When things sound heavy, suggest a real person: a friend, family, a doctor or a helpline.',
    '- No idioms or sayings (like "hang in there" or "silver lining").',
    ...(state.settings.icons ? [] : ['- Do not use emoji.']),
  ];
}
const TAG_RULE = '- Start your reply with exactly one tag on its own line: [ok], [check] if the user might be unsafe or very hopeless, or [risk] if they talk about wanting to die or hurt themselves.';

async function reflect(entry: NewEntry, id: string) {
  const done = showTyping();
  try {
    const { text } = await claude({
      effort: 'medium',
      messages: [{
        role: 'user',
        content: 'Write a short reflection for a dyslexic person about their journal check-in below.\n' +
          'Rules: 2 or 3 very short sentences, each on its own line. Simple, common words. ' + (state.settings.icons ? '1 or 2 emoji. ' : '') + 'Talk to them as "you". ' +
          'Name what they shared without judging it. No toxic positivity: never say "be happy", "cheer up" or "look on the bright side". ' +
          'No advice unless the entry asks for it. No lists, no markdown.\n' + kindRules().join('\n') + '\n\nCheck-in:\n' + entrySummary(entry),
      }],
    });
    done();
    // Every reflection goes through the reply style check (§10); each sentence is its own bubble.
    const { lines } = styleCheck(text, { icons: state.settings.icons });
    lines.forEach(l => addBot(l));
    updateEntry(id, { reflection: lines.join('\n') });
  } catch (e) {
    done();
    const m = aiErrorText(e); if (m) addBot(m, { info: true });
  }
}

/* ---------- safety (§8): the fixed, recorded lines. Lexi never contacts anyone. ---------- */
const SAVED_CHECK_PROMPT = 'You check journal text for self-harm or suicide risk. The writer is dyslexic, so expect misspellings, sound-alike spellings and emoji. Reply with only JSON: {"level":"none"|"check"|"risk"}. "risk" = says they want to die, kill or hurt themselves, or has a plan. "check" = sounds hopeless, wants to disappear, or gives unclear dark hints. Otherwise "none".\n\nText:\n';

/** Local check plus, when the chat brain is on and there are 3+ words, one quick AI check. Final = max. */
export async function checkSavedWriting(text: string): Promise<Level> {
  const local = riskCheck(text);
  if (local === 'risk' || !aiReady() || text.trim().split(/\s+/).length < 3) return local;
  try {
    const { text: out } = await claude({ effort: 'low', messages: [{ role: 'user', content: SAVED_CHECK_PROMPT + text }] });
    return maxLevel(local, asLevel((parseJsonReply(out) as { level?: unknown } | null)?.level));
  } catch (e) { console.warn('safety check', e); return local; }
}

export async function safetyFlow(level: Level) {
  if (level === 'risk') { await riskFlow(true); return; }
  if (level !== 'check') return;
  await say('That sounds really hard. 💛');
  const safe = await ask('Are you safe right now?', YES_NO, true);
  if (safe) await say("Okay. I'm glad. I'm here if you want to talk.");
  else await riskFlow(false);
}
async function riskFlow(fromStart: boolean) {
  if (fromStart) await say("I'm really glad you told me. 💛");
  await say('Your safety matters most right now.');
  await sayQueue; addCard('crisis', {}, false);
  await say('Please talk to someone now. You can call or text these lines.');
  const safe = await ask('Are you safe right now?', YES_NO, true);
  if (safe) {
    await say("Thank you for telling me. I'm here if you want to talk.");
    await say('Tap Help at the top any time. 🆘');
  } else {
    await say('Please call your local emergency number now. 🆘');
    await sayQueue; addCard('crisis', { emergencyOnly: true }, false);
  }
}

/* ---------- free chat with Lexi (needs the optional API key) ---------- */
function journalContext(): string {
  const es = state.entries.slice(0, 5);
  if (!es.length) return 'No entries yet.';
  return es.map(e => e.day + ' (' + (e.kind === 'free' ? 'free writing' : 'check-in') + '): ' + entrySummary(e).replace(/\n/g, ' | ').slice(0, 300)).join('\n');
}
function lexiRules(): string {
  return [
    'You are Lexi, a friendly journaling chatbot inside an app made for dyslexic people. Stay in character.',
    'How you write:',
    '- Reply in 1 to 3 very short lines. Each line is one short sentence on its own line.',
    '- Use simple, common words. No lists, no markdown, no headings.',
    ...(state.settings.icons ? ['- Use 1 or 2 emoji per reply to carry meaning. The user reads emoji easily.'] : []),
    '- No toxic positivity. Never say "be happy", "cheer up", "look on the bright side" or "everything happens for a reason". Accept feelings as they are. Content is the goal, not happy.',
    '- If the user mentions hurting themselves or being in danger, say you care and tell them to contact someone they trust or their local emergency number now. The app shows them help lines for their country. Keep it short.',
    ...kindRules(),
    TAG_RULE,
    'What the app can do (use this to answer questions about the app):',
    '- 🧭 Guided check-in on the 🏡 Home tab: pick mood emoji in three groups (Content, Stressed, Low self-esteem), then topics: physical health, diet, self-esteem, relationships, financial health, stressors, to dos, hobbies and passions, gratitude. There is no "Happy" option on purpose. ➕ My own adds custom words and emoji.',
    '- 🎙 The mic next to 🙂 turns speech into words, in the chat box and when writing.',
    '- ✏️ Write on my own: free writing with an emoji button, 🎙 voice typing, ✨ Tidy spelling (one word at a time, the original is kept) and 🔊 Read it back.',
    '- 📖 Journal tab: days journaled, feelings named, day cards for the last 14 days, entries by day, tick off to dos, 🔊 read entries aloud, 🗑 delete entries.',
    '- 🆘 Help at the top of every screen: help lines for their country, how to use Lexi, how Lexi keeps them safe, and privacy.',
    "- ⚙️ Settings tab: theme (Orange, Purple, Mint, Night, Ember, or match the device), turn icons off, font (Verdana, Lexend, Atkinson Hyperlegible), text size, line spacing, letter spacing, Lexi's voice (her own recorded voice or a device voice, with speed and pitch), skin tone, avatar, read Lexi out loud, privacy, replay the intro.",
    "The user's recent journal entries are below. Mention them only when the user asks about their journal or feelings. Newer entries may arrive later in the chat as system notes.",
    journalContext(),
    'The conversation follows.',
  ].join('\n');
}
function fallbackReply(t: string): string[] | null {
  // Crisis words never get here: sendChat runs riskCheck first and starts the safety flow.
  const s = t.toLowerCase();
  if (/delete|remove|erase/.test(s)) return ['To delete an entry, open 📖 Journal.', 'Then tap 🗑️ on that entry.'];
  if (/\bmic\b|microphone|dictat|voice typ|speech to text/.test(s)) return ['Tap 🎙 next to 🙂 and say your words. I type them for you.'];
  if (/voice|robot|speak|read/.test(s)) return ['You can pick my voice in ⚙️ Settings. 🔊', 'There is a speed slider too.'];
  if (/icon|emoji/.test(s)) return ['You can turn icons on or off in ⚙️ Settings. 🧠'];
  if (/font|size|spacing|dark|colou?r|theme|look/.test(s)) return ['Colors, fonts, text size and spacing are in ⚙️ Settings. 🎨'];
  if (/check|guide|start|help|how/.test(s)) return ["Tap 🧭 Guided check-in and I'll go step by step with you.", 'Or tap ✏️ to write on your own.'];
  return null;
}

// The history is append-only: the system prompt is frozen for a chat session, journal changes are added as
// mid-conversation system notes, and assistant turns go back exactly as the API returned them. Editing
// earlier turns would invalidate Claude's earlier thinking. A long session restarts fresh instead of trimming.
const MAX_TURNS = 40;
let session: { system: string; messages: Msg[]; seenEntries: string } | null = null;
let chatCtl: AbortController | null = null;
const entriesStamp = () => state.entries.slice(0, 5).map(e => e.id + ':' + (e.reflection ? 1 : 0)).join(',');

export function stopChat() { chatCtl?.abort(); }

export async function sendChat(text: string) {
  addMe(text);
  // Local crisis check on every message (§8). A local "risk" starts the safety flow straight away: the AI can
  // only raise the level, never lower it, so waiting for its reply would just delay the help lines.
  const local = riskCheck(text);
  if (local === 'risk' || (local === 'check' && !aiReady())) { await safetyFlow(local); return; }
  if (!aiReady()) {
    const r = fallbackReply(text);
    if (r) await sayMany(r);
    else { await sayMany(["I can't chat freely right now. 🔌", 'You can still do a check-in or write on your own.']); offerActions(); }
    return;
  }
  if (!session || session.messages.length >= MAX_TURNS) session = { system: lexiRules(), messages: [], seenEntries: entriesStamp() };
  const s = session;
  s.messages.push({ role: 'user', content: text });
  const stamp = entriesStamp(), prevStamp = s.seenEntries;
  if (stamp !== s.seenEntries) {
    s.messages.push({ role: 'system', content: "The user's journal changed. Recent entries now:\n" + journalContext() } as unknown as Msg);
    s.seenEntries = stamp;
  }
  await sayQueue;
  const ctl = new AbortController(); chatCtl = ctl; setSending(true);
  const done = showTyping();
  let level: Level = local;
  try {
    const res = await claude({ system: s.system, messages: s.messages, effort: 'low', signal: ctl.signal });
    done();
    // The reply goes back into the history exactly as returned (tag and all); what's shown is checked (§10).
    s.messages.push({ role: 'assistant', content: res.content as Msg['content'] });
    const { tag, lines } = styleCheck(res.text, { icons: state.settings.icons });
    lines.forEach(l => addBot(l));
    if (res.truncated) addBot('That got cut short. Ask me for less at a time. ✂️', { info: true });
    level = maxLevel(local, asLevel(tag));
  } catch (e) {
    done();
    // Nothing answered this turn, so take it back out; the history stays user/assistant pairs.
    s.messages.splice(s.messages.length - (stamp !== prevStamp ? 2 : 1));
    s.seenEntries = prevStamp;
    const m = aiErrorText(e); if (m) addBot(m, { info: true });
  } finally {
    if (chatCtl === ctl) { chatCtl = null; setSending(false); }
  }
  if (level !== 'none') await safetyFlow(level);
}

/* ---------- onboarding (Chat Bot Plan) ---------- */
export async function intro() {
  await say("Hi! I'm Lexi, the journaling chatbot. 🤖 I'm here to make journaling easy and fun.");
  await say("I speak English, but I'm better at emoji. 😉");
  await say('ℹ️ This means information.', { info: true });
  await say('ℹ️ My developer created me to help dyslexic people journal.', { info: true });
  await say("ℹ️ Text blocks will never be too large, and I'll rely a lot on icons and emojis.", { info: true });
  await say("🧠 If icons don't work for your brain, you can turn them off in settings.", { info: true });
  await sayQueue; addCard('legend', {}, false);
  await say('📖 This is your journal. Everything you save goes there.');
  const go = await ask('Would you like to start?', YES_NO, true);
  setOnboarded();
  if (!go) { await say("No problem. I'll be right here. 🏡"); offerActions(); return; }
  await say('👏🏽👏🏽👏🏽👏🏽');
  const help = await ask('Would you like help?', YES_NO, true);
  if (help) {
    await say('You can choose to journal with me by selecting the guided experience. 🧭');
    startGuided(true);
  } else {
    await say("If you're feeling frisky and want to tackle it on your own, I'll be waiting to answer any questions you may have.");
    addCard('choices', {
      options: [
        { e: '✏️', label: 'Start writing', run: () => openSheet() },
        { e: '🧭', label: 'Guided check-in', run: () => startGuided() },
      ],
    }, false);
  }
}
async function welcomeBack() {
  // No count, so both lines can be in Lexi's own recorded voice.
  const today = state.entries.some((e: Entry) => e.day === dayKey());
  await say('Welcome back! 🏡');
  if (today) await say("You've already saved something today. ✔️");
  await say('What would you like to do?');
  offerActions();
}

let booted = false;
export async function boot() {
  if (booted) return;
  booted = true;
  const done = showTyping();
  await Promise.race([ready, sleep(2500)]);
  done();
  if (state.onboarded) welcomeBack(); else intro();
}
