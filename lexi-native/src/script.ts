// Lexi's conversation script: onboarding (Chat Bot Plan), the guided check-in, free chat and reflections.
// Copy and order match lexi.html.
import { BANDS, BAND_BY, TOPIC_BY, YES_NO, type BandKey, type Pick } from './content';
import { addBot, addCard, addMe, addMeEmoji, addWelcome, ask, dropCards, hasCard, say, sayMany, sayQueue, showThinking } from './chat';
import { aiErrorText, claude, parseJsonReply, type Msg } from './ai';
import { asLevel, maxLevel, riskCheck, styleCheck, type Level } from './safety';
import type { RecapLine, StepResult } from './components/Cards';
import { firstPending, order, stepInfo, type StepId } from './steps';
import {
  addEntry, aiReady, clearCheckin, loadCheckin, ready, saveCheckin, setOnboarded, setSending, setSheet, setVoiceSheet, showView, state, toast, updateEntry,
  type CheckinDraft, type Entry, type NewEntry, type TopicAnswer,
} from './store';
import { dayKey, sleep } from './text';
import { greeting } from './week';

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
  if (en.nuance && en.nuance.length) parts.push('Named more exactly: ' + en.nuance.map(m => m.label).join(', '));
  (en.topics || []).forEach(tp => {
    const T = TOPIC_BY[tp.key]; const bits: string[] = [];
    if (tp.picks && tp.picks.length) bits.push(tp.picks.map(p => p.label).join(', '));
    if (tp.todos && tp.todos.length) bits.push(tp.todos.map(x => x.t + (x.done ? ' (done)' : '')).join(', '));
    if (tp.note) bits.push(tp.note);
    parts.push((T ? T.name : tp.key) + ': ' + bits.join('. '));
  });
  if (en.text) parts.push((en.kind === 'voice' ? 'Spoken: ' : 'Writing: ') + en.text);
  return parts.join('\n');
}

/* ---------- menus ---------- */
/** The Home actions (DESIGN_WARM_PAPER §10): 🧭 Guided check-in, ✏️ Write on my own and the This week card.
 *  Like every answered card, it folds away once used and the answer row stays. */
export function offerActions() {
  addCard('actions', { guided: () => startGuided(), write: () => openSheet() });
}
/** Bring the Home actions back when nothing else is waiting, e.g. after the writing sheet closes. */
export function ensureActions() {
  sayQueue.then(() => { if (!guidedActive && !hasCard('actions') && !hasCard('choices')) offerActions(); });
}
export function openSheet() { setSheet(true); }
export function openVoiceSheet() { setVoiceSheet(true); }

/* ---------- Quick start (FEATURES_SOON §9) ---------- */
export async function quickStart() {
  showView('home');
  await say("Let's set me up so I'm easy for you to read.");
  await sayQueue;
  await addCard('quickstart');
  addMeEmoji(['✔️'], 'Done');
  await say('You can change these any time in Settings. ⚙️');
}

/* ---------- guided check-in, in numbered steps (FEATURES_SOON §6, §12) ----------
   Steps: feelings (1), "Name it more" (1b, only if moods were picked), topics (2), one per topic, recap (N).
   N = 2 + topics + 1. The draft is saved after every step; only the recap's Save writes the entry.
   Numbering and "what's next" live in steps.ts. */
const bandsOf = (moods: Pick[]) => BANDS.map(b => b.key).filter(k => moods.some(m => m.band === k)) as BandKey[];
const labels = (ps: Pick[]) => ps.map(p => p.label).join(' · ');
function echo(ps: Pick[], skip = 'Skip') { if (ps.length) addMeEmoji(ps.map(p => p.e), labels(ps)); else addMeEmoji(['⏭️'], skip); }

/** One step: Lexi's question, then its card, pre-filled with the answers so far. */
async function runStep(step: StepId, d: CheckinDraft): Promise<'next' | 'back'> {
  const info = stepInfo(d, step);
  if (step === 'feelings') {
    await say('How do you feel? Pick as many as you like.');
    const r = await addCard<StepResult<Pick[]>>('mood', { step: info, initial: d.moods });
    if (r.action === 'back') return 'back';
    d.moods = r.value; echo(d.moods);
    // Exact words only make sense for the bands still picked.
    if (d.nuance) d.nuance = d.nuance.filter(n => d.moods.some(m => m.band === n.band));
    if (!d.moods.length) d.nuance = null;
    await say(reactionFor(d.moods));
    return 'next';
  }
  if (step === 'nuance') {
    await say('Want to name it more exactly? You can skip this.');
    const r = await addCard<StepResult<Pick[]>>('nuance', { step: info, bands: bandsOf(d.moods), initial: d.nuance || [] });
    if (r.action === 'back') return 'back';
    d.nuance = r.value; echo(d.nuance);
    return 'next';
  }
  if (step === 'topics') {
    await say('What do you want to talk about today?');
    const r = await addCard<StepResult<string[]>>('topics', { step: info, initial: d.keys || [] });
    if (r.action === 'back') return 'back';
    d.keys = r.value;
    for (const k of Object.keys(d.answers)) if (!d.keys.includes(k)) delete d.answers[k];
    if (d.keys.length) addMeEmoji(d.keys.map(k => TOPIC_BY[k].icon), d.keys.map(k => TOPIC_BY[k].name).join(' · '));
    else addMe('Just my mood today');
    return 'next';
  }
  const T = TOPIC_BY[step.slice(2)];
  await say(T.icon + ' ' + T.q);
  const r = await addCard<StepResult<TopicAnswer | null>>('topicAnswer', { step: info, topic: T, initial: d.answers[T.key] ?? null });
  if (r.action === 'back') return 'back';
  const a = r.value;
  d.answers[T.key] = a;
  // Picks alone show as big emoji; anything typed (notes, to-dos) keeps a bubble.
  if (!a) addMeEmoji(['⏭️'], 'Skip');
  else if (a.picks.length && !a.note && !a.todos.length) echo(a.picks);
  else addMe(answerText(a));
  return 'next';
}
function recapLines(d: CheckinDraft): RecapLine[] {
  const lines: RecapLine[] = [{ id: 'feelings', icon: '🌡️', title: 'Feelings', text: labels(d.moods) || 'Skipped' }];
  if (d.moods.length) lines.push({ id: 'nuance', icon: '🔎', title: 'Name it more', text: labels(d.nuance || []) || 'Skipped' });
  lines.push({ id: 'topics', icon: '🗂️', title: 'Topics', text: (d.keys || []).map(k => TOPIC_BY[k].name).join(' · ') || 'Just my mood today' });
  for (const k of d.keys || []) {
    const a = d.answers[k];
    lines.push({ id: 't:' + k, icon: TOPIC_BY[k].icon, title: TOPIC_BY[k].name, text: a ? answerText(a) : 'Skipped' });
  }
  return lines;
}

let guidedActive = false;
export async function startGuided(fromIntro = false, resume: CheckinDraft | null = null) {
  showView('home');
  if (guidedActive) { toast('Your check-in is already open below. 👇'); return; }
  guidedActive = true;
  // Started from the Journal tab: the Home actions waiting above would be out of date.
  dropCards('actions');
  try {
    const d: CheckinDraft = resume ? { ...resume, answers: { ...resume.answers } } : { step: 'feelings', moods: [], nuance: null, keys: null, answers: {} };
    if (!fromIntro && !resume) await say("Let's check in. 🧭");
    let step: StepId = resume ? (order(d).includes(resume.step) ? resume.step : firstPending(d)) : 'feelings';
    let toRecap = !!resume && step === 'recap';
    for (;;) {
      saveCheckin({ ...d, step });
      if (step === 'recap') {
        await say('Here is your check-in. Tap Change to fix anything.');
        const r = await addCard<{ action: 'save' } | { action: 'change'; step: StepId }>('recap', { step: stepInfo(d, 'recap'), lines: recapLines(d) });
        if (r.action === 'save') break;
        step = r.step; toRecap = true;
        continue;
      }
      const went = await runStep(step, d);
      const o = order(d);
      if (went === 'back') { step = o[Math.max(0, o.indexOf(step) - 1)]; continue; }
      // After a Change from the recap, answer anything new (like a newly added topic), then back to the recap.
      step = toRecap ? firstPending(d) : o[o.indexOf(step) + 1] ?? 'recap';
    }
    clearCheckin();
    const moods = d.moods, nuance = d.nuance || [];
    const topics = (d.keys || []).map(k => d.answers[k]).filter((a): a is TopicAnswer => !!a);
    if (!moods.length && !topics.length) { await say("Nothing to save this time. That's okay. 🏡"); offerActions(); return; }
    const entry: NewEntry = { kind: 'guided', createdAt: Date.now(), day: dayKey(), moods, topics, text: '', ...(nuance.length ? { nuance } : {}) };
    const id = await addEntry(entry);
    // The calm "Saved" moment (DESIGN_WARM_PAPER §6): a slow fade and one light haptic, no celebration row.
    await say('Saved to your journal. ✔️', { saved: true });
    // Check-in notes and to-dos get the same crisis check as other writing (§8).
    const notes = topics.flatMap(tp => [tp.note, ...(tp.todos || []).map(td => td.t)]).filter(Boolean).join('\n');
    const level = notes ? await checkSavedWriting(notes) : 'none';
    if (level !== 'none') { await safetyFlow(level); return; }
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

/** AI replies are shown whole (DESIGN_WARM_PAPER §9): Lexi stays in Thinking for at least 600 ms, until the
 *  style-checked reply is ready. Then each line comes like any other Lexi line, at the Message pace. */
async function thinkAtLeast<T>(work: Promise<T>): Promise<T> {
  const [r] = await Promise.all([work, sleep(600)]);
  return r;
}
async function showLines(lines: string[], stopped: () => boolean = () => false) {
  for (let i = 0; i < lines.length && !stopped(); i++) {
    if (i === 0) addBot(lines[0]); // the Thinking row was this line's pause
    else await say(lines[i]);
  }
}

async function reflect(entry: NewEntry, id: string) {
  await sayQueue;
  const done = showThinking();
  try {
    const { text } = await thinkAtLeast(claude({
      effort: 'medium',
      messages: [{
        role: 'user',
        content: 'Write a short reflection for a dyslexic person about their journal check-in below.\n' +
          'Rules: 2 or 3 very short sentences, each on its own line. Simple, common words. ' + (state.settings.icons ? '1 or 2 emoji. ' : '') + 'Talk to them as "you". ' +
          'Name what they shared without judging it. No toxic positivity: never say "be happy", "cheer up" or "look on the bright side". ' +
          'No advice unless the entry asks for it. No lists, no markdown.\n' + kindRules().join('\n') + '\n\nCheck-in:\n' + entrySummary(entry),
      }],
    }));
    done();
    // Every reflection goes through the reply style check (§10); each sentence is its own bubble.
    const { lines } = styleCheck(text, { icons: state.settings.icons });
    updateEntry(id, { reflection: lines.join('\n') });
    await showLines(lines);
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
  await sayQueue; addCard('crisis', {});
  await say('Please talk to someone now. You can call or text these lines.');
  const safe = await ask('Are you safe right now?', YES_NO, true);
  if (safe) {
    await say("Thank you for telling me. I'm here if you want to talk.");
    await say('Tap Help at the top any time. 🆘');
  } else {
    await say('Please call your local emergency number now. 🆘');
    await sayQueue; addCard('crisis', { emergencyOnly: true });
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
    '- 🎙 The mic in the chat box listens until they tap Done, then they can Send, Say again or Fix the words. There is a mic when writing too.',
    '- ✏️ Write on my own: free writing with an emoji button, 🎙 voice typing, ✨ Tidy spelling (one word at a time, the original is kept) and 🔊 Read it back.',
    '- 📖 Journal tab: days journaled, feelings named, a grid of the last two weeks with a shape for each day\'s main feeling group, entries newest first, tick off to dos, 🔊 read entries aloud, 🗑 delete entries, 🎙️ speak an entry.',
    '- 🛟 Help at the top of every screen: help lines for their country, how to use Lexi, how Lexi keeps them safe, and privacy.',
    "- ⚙️ Settings tab: look (Cream, Peach, Purple, Mint, Night, Ember, or match the device), turn icons off, font (Verdana, Lexend, Atkinson Hyperlegible), text size, line spacing, letter spacing, Lexi's voice (her own recorded voice or a device voice, with speed and pitch), skin tone, avatar, read Lexi out loud, privacy, replay the intro.",
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
  const done = showThinking();
  let level: Level = local;
  try {
    const res = await thinkAtLeast(claude({ system: s.system, messages: s.messages, effort: 'low', signal: ctl.signal }));
    done();
    // The reply goes back into the history exactly as returned (tag and all); what's shown is checked (§10).
    s.messages.push({ role: 'assistant', content: res.content as Msg['content'] });
    const { tag, lines } = styleCheck(res.text, { icons: state.settings.icons });
    level = maxLevel(local, asLevel(tag));
    // Stop still works while the lines come in: the rest of the reply isn't shown.
    await showLines(lines, () => ctl.signal.aborted);
    if (res.truncated && !ctl.signal.aborted) await say('That got cut short. Ask me for less at a time. ✂️', { info: true });
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
  // The butterfly replaces 🤖 (DESIGN_WARM_PAPER §12); the spoken words, and so the clip, are the same.
  await say("Hi! I'm Lexi, the journaling chatbot. 🦋 I'm here to make journaling easy and fun.");
  await say("I speak English, but I'm better at emoji. 😉");
  await quickStart();
  await say('ℹ️ This means information.', { info: true });
  await say('ℹ️ My developer created me to help dyslexic people journal.', { info: true });
  await say("ℹ️ Text blocks will never be too large, and I'll rely a lot on icons and emojis.", { info: true });
  await say("🧠 If icons don't work for your brain, you can turn them off in settings.", { info: true });
  await sayQueue; addCard('legend', {});
  await say('📖 This is your journal. Everything you save goes there.');
  const go = await ask('Would you like to start?', YES_NO, true);
  setOnboarded();
  if (!go) { await say("No problem. I'll be right here. 🏡"); offerActions(); return; }
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
    });
  }
}
async function welcomeBack() {
  // No count, so both lines can be in Lexi's own recorded voice.
  const today = state.entries.some((e: Entry) => e.day === dayKey());
  await say('Welcome back! 🏡');
  if (today) await say("You've already saved something today. ✔️");
  // An unfinished check-in (§6): finish it, or let it go.
  const draft = loadCheckin();
  if (draft) {
    await say("You have a check-in you didn't finish.");
    const finish = await ask('Want to finish it?', YES_NO, true);
    if (finish) { startGuided(false, draft); return; }
    clearCheckin();
  }
  await say('What would you like to do?');
  offerActions();
}

let booted = false;
export async function boot() {
  if (booted) return;
  booted = true;
  // The welcome block comes first (DESIGN_WARM_PAPER §10), then Lexi's usual lines.
  addWelcome(greeting());
  const done = showThinking();
  await Promise.race([ready, sleep(2500)]);
  done();
  if (state.onboarded) welcomeBack(); else intro();
}
