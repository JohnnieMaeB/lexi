// Check-in step numbering (FEATURES_SOON §6), kept free of React so it can be tested on its own.
// Steps: feelings (1), "Name it more" (1b, only if moods were picked), topics (2), one per topic, recap (N).
// N = 2 + topics + 1, known once the topics are chosen.
import type { CheckinDraft } from './store';

export type StepId = string; // 'feelings' | 'nuance' | 'topics' | 't:<key>' | 'recap'
export type StepInfo = { label: string; index: number; total: number | null; back: boolean };

export const order = (d: CheckinDraft): StepId[] =>
  ['feelings', ...(d.moods.length ? ['nuance'] : []), 'topics', ...(d.keys || []).map(k => 't:' + k), 'recap'];

export function stepInfo(d: CheckinDraft, step: StepId): StepInfo {
  const total = d.keys ? d.keys.length + 3 : null;
  const num = step === 'feelings' || step === 'nuance' ? 1 : step === 'topics' ? 2 : step === 'recap' ? (total ?? 3) : 3 + (d.keys || []).indexOf(step.slice(2));
  const name = step === 'nuance' ? '1b' : String(num);
  return { label: 'Step ' + name + (total ? ' of ' + total : ''), index: num, total, back: step !== 'feelings' };
}

/** The first step still to answer, or the recap (where Change returns to). */
export function firstPending(d: CheckinDraft): StepId {
  if (d.moods.length && d.nuance === null) return 'nuance';
  if (d.keys === null) return 'topics';
  const k = d.keys.find(key => !(key in d.answers));
  return k ? 't:' + k : 'recap';
}
