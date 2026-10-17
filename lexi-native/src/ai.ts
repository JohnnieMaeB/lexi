// OPTIONAL: Lexi's chat brain (free chat, ✨ Tidy spelling, reflections) through the Claude API.
// Off until someone pastes an Anthropic API key in ⚙️ Settings → "Chat brain". The key stays in the phone's
// keychain and requests go straight from the phone to api.anthropic.com. Fine for a personal prototype; a
// public release should call your own server instead so no key ships on devices.
import Anthropic from '@anthropic-ai/sdk';
import { markKeyRejected, state } from './store';

export const MODEL = 'claude-opus-5-5';
// Server-side fallback re-runs a policy-declined request on another model. Claude Haiku models don't take
// the `fallbacks` parameter, so drop it if you switch MODEL to one.
const FALLBACK = { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' as const };

let client: Anthropic | null = null;
let clientKey = '';
function getClient(key: string) {
  if (!client || clientKey !== key) { client = new Anthropic({ apiKey: key, maxRetries: 1, timeout: 60_000 }); clientKey = key; }
  return client;
}

export type Msg = Anthropic.Beta.BetaMessageParam;
export type Reply = { text: string; content: Anthropic.Beta.BetaContentBlock[]; truncated: boolean };
export class LexiAiError extends Error { constructor(public code: 'no_key' | 'refused') { super(code); } }

export async function claude(opts: { system?: string; messages: Msg[]; effort: 'low' | 'medium'; signal?: AbortSignal }): Promise<Reply> {
  const key = state.apiKey;
  if (!key) throw new LexiAiError('no_key');
  const res = await getClient(key).beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    ...(MODEL.includes('haiku') ? {} : FALLBACK),
    output_config: { effort: opts.effort },
    ...(opts.system ? { system: opts.system } : {}),
    messages: opts.messages,
  }, { signal: opts.signal });
  if (res.stop_reason === 'refusal') throw new LexiAiError('refused');
  const text = res.content.map(b => (b.type === 'text' ? b.text : '')).join('').trim();
  return { text, content: res.content, truncated: res.stop_reason === 'max_tokens' };
}

/** Friendly words for anything that went wrong. null = the person cancelled, say nothing. */
export function aiErrorText(e: unknown): string | null {
  if (e instanceof Anthropic.APIUserAbortError) return null;
  if (e instanceof LexiAiError) {
    if (e.code === 'refused') return "I can't help with that one. 🙏🏽";
    return "I can't use my chat brain here. 🔌 Check-ins and writing still work.";
  }
  if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) {
    markKeyRejected();
    return "That API key didn't work. 🔑 Check it in ⚙️ Settings.";
  }
  if (e instanceof Anthropic.RateLimitError) return 'I need a short break. ⏳ Try again in a little while.';
  if (e instanceof Anthropic.APIConnectionError) return "I can't reach my chat brain. 🔌 Check your internet and try again.";
  console.warn('claude', e);
  return 'Something went wrong on my side. 🔌 Try again?';
}
