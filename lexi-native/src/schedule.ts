// Reminder times (FEATURES_SOON §13), kept free of native modules so they can be tested on their own.

/** The next `count` times at hour:minute, every `stepDays` days, starting today if that time is still ahead. */
export function nextTimes(hour: number, minute: number, stepDays: number, count: number, now = new Date()): Date[] {
  const first = new Date(now); first.setHours(hour, minute, 0, 0);
  if (first.getTime() <= now.getTime()) first.setDate(first.getDate() + 1);
  return Array.from({ length: count }, (_, i) => { const d = new Date(first); d.setDate(first.getDate() + i * stepDays); return d; });
}

export function fmtClock(hour: number, minute: number) {
  return (hour % 12 || 12) + ':' + String(minute).padStart(2, '0') + ' ' + (hour < 12 ? 'AM' : 'PM');
}
