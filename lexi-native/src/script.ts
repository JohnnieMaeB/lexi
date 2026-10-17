// Lexi's conversation script: onboarding (Chat Bot Plan), the guided check-in, free chat and reflections.
// Copy and order match lexi.html.
import { BAND_BY, TOPIC_BY, YES_NO, type Pick } from './content';
import { addBot, addCard, addMe, ask, say, sayMany, sayQueue, showTyping } from './chat';
import { aiErrorText, claude, type Msg } from './ai';
import {
  addEntry, aiReady, ready, setOnboarded, setSending, setSheet, showView, state, toast, updateEntry,
  type Entry, type NewEntry, type TopicAnswer,
} from './store';
import { speak } from './speech';
import { cleanLines, dayKey, sleep } from './text';

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
    addMe(moods.length ? moods.map(m => m.e + ' ' + m.label).join(' · ') : '⏭️ Skip');
    await say(reactionFor(moods));
    await say('What do you want to talk about today?');
    const keys = await addCard<string[]>('topics');
    addMe(keys.length ? keys.map(k => TOPIC_BY[k].icon + ' ' + TOPIC_BY[k].name).join(' · ') : 'Just my mood today');
    const topics: TopicAnswer[] = [];
    for (const k of keys) {
      const T = TOPIC_BY[k];
      await say(T.icon + ' ' + T.q);
      const a = await addCard<TopicAnswer | null>('topicAnswer', { topic: T });
      addMe(a ? answerText(a) : '⏭️ Skip');
      if (a) topics.push(a);
    }
    if (!moods.length && !topics.length) { await say("Nothing to save this time. That's okay. 🏡"); offerActions(); return; }
    const entry: NewEntry = { kind: 'guided', createdAt: Date.now(), day: dayKey(), moods, topics, text: '' };
    const id = await addEntry(entry);
    await say('Saved to your journal. 📖 ✔️');
    await say('👏🏽👏🏽👏🏽👏🏽');
    if (aiReady()) {
      const want = await ask('Want a short reflection on today?', YES_NO, true);
      if (want) await reflect(entry, id);
    }
    offerActions();
  } finally { guidedActive = false; }
}

async function reflect(entry: NewEntry, id: string) {
  const done = showTyping();
  try {
    const { text } = await claude({
      effort: 'medium',
      messages: [{
        role: 'user',
        content: 'Write a short reflection for a dyslexic person about their journal check-in below.\n' +
          'Rules: 2 or 3 very short sentences, each on its own line. Simple, common words. 1 or 2 emoji. Talk to them as "you". ' +
          'Name what they shared without judging it. No toxic positivity: never say "be happy", "cheer up" or "look on the bright side". ' +
          'No advice unless the entry asks for it. No lists, no markdown.\n\nCheck-in:\n' + entrySummary(entry),
      }],
    });
    done();
    const lines = cleanLines(text);
    lines.forEach(l => addBot(l, { quiet: true }));
    if (state.settings.autoread) speak(text, { queue: true });
    updateEntry(id, { reflection: lines.join('\n') });
  } catch (e) {
    done();
    const m = aiErrorText(e); if (m) addBot(m, { info: true });
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
    '- Use 1 or 2 emoji per reply to carry meaning. The user reads emoji easily.',
    '- No toxic positivity. Never say "be happy", "cheer up", "look on the bright side" or "everything happens for a reason". Accept feelings as they are. Content is the goal, not happy.',
    '- You are not a therapist and you do not diagnose. If the user mentions hurting themselves or being in danger, say you care and tell them to contact someone they trust or their local emergency number now (in the US, call or text 988). Keep it short.',
    'What the app can do (use this to answer questions about the app):',
    '- 🧭 Guided check-in on the 🏡 Home tab: pick mood emoji in three groups (Content, Stressed, Low self-esteem), then topics: physical health, diet, self-esteem, relationships, financial health, stressors, to dos, hobbies and passions, gratitude. There is no "Happy" option on purpose. ➕ My own adds custom words and emoji.',
    '- 🎙 The mic next to 🙂 turns speech into words, in the chat box and when writing.',
    '- ✏️ Write on my own: free writing with an emoji button, 🎙 voice typing, ✨ Tidy spelling and 🔊 Read it back.',
    '- 📖 Journal tab: entries by day, a 14-day mood strip, tick off to dos, 🔊 read entries aloud, 🗑 delete entries.',
    '- ⚙️ Settings tab: turn icons off, font (Verdana, Lexend, Atkinson Hyperlegible), text size, line spacing, colors (orange, purple, mint), light or dark, skin tone, avatar, read Lexi out loud, replay the intro.',
    "The user's recent journal entries are below. Mention them only when the user asks about their journal or feelings. Newer entries may arrive later in the chat as system notes.",
    journalContext(),
    'The conversation follows.',
  ].join('\n');
}
function fallbackReply(t: string): string[] | null {
  const s = t.toLowerCase();
  if (/suicid|kill myself|hurt myself|self.?harm|end it all|want to die/.test(s)) return ["I'm really glad you told me. 💛", 'Please reach out to someone you trust or your local emergency number now.', 'In the US you can call or text 988.'];
  if (/delete|remove|erase/.test(s)) return ['To delete an entry, open 📖 Journal.', 'Then tap 🗑️ on that entry.'];
  if (/icon|emoji/.test(s)) return ['You can turn icons on or off in ⚙️ Settings. 🧠'];
  if (/\bmic\b|microphone|dictat|voice typ|speech to text/.test(s)) return ['Tap 🎙 next to 🙂 and say your words. I type them for you.'];
  if (/font|size|spacing|dark|colou?r|read|voice/.test(s)) return ['Fonts, text size, spacing, colors and read aloud are in ⚙️ Settings.'];
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
  try {
    const res = await claude({ system: s.system, messages: s.messages, effort: 'low', signal: ctl.signal });
    done();
    s.messages.push({ role: 'assistant', content: res.content as Msg['content'] });
    cleanLines(res.text).forEach(l => addBot(l, { quiet: true }));
    if (state.settings.autoread) speak(res.text, { queue: true });
    if (res.truncated) addBot('That got cut short. Ask me for less at a time. ✂️', { info: true });
  } catch (e) {
    done();
    // Nothing answered this turn, so take it back out; the history stays user/assistant pairs.
    s.messages.splice(s.messages.length - (stamp !== prevStamp ? 2 : 1));
    s.seenEntries = prevStamp;
    const m = aiErrorText(e); if (m) addBot(m, { info: true });
  } finally {
    if (chatCtl === ctl) { chatCtl = null; setSending(false); }
  }
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
  const today = state.entries.filter((e: Entry) => e.day === dayKey()).length;
  await say(today ? "Welcome back! 🏡 You've saved " + today + (today === 1 ? ' entry' : ' entries') + ' today. ✔️' : 'Welcome back! 🏡');
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
