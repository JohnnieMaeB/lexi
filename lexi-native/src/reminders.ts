// 🔔 Gentle reminders (FEATURES_SOON §13, native only): local scheduled notifications, nothing from a server.
// Permission is asked only when reminders are turned on. The words never say "you missed".
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { Reminders } from './content';
import { fmtClock, nextTimes } from './schedule';

export const REMINDER_TITLE = 'Lexi';
export const REMINDER_BODY = 'Lexi here. 🌱 Want to check in today?';
const CHANNEL = 'reminders';
// "Every other day" has no repeating trigger, so the next ones are scheduled as single dates and topped up each
// time the app opens. iOS keeps at most 64 pending notifications; 30 is plenty.
const ALTERNATE_AHEAD = 30;

async function ensureChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, { name: 'Reminders', importance: Notifications.AndroidImportance.DEFAULT });
  }
}

/** Asks for permission (only when the person turns reminders on). */
export async function askPermission(): Promise<boolean> {
  await ensureChannel(); // Android 13 shows the prompt only after a channel exists
  const cur = await Notifications.getPermissionsAsync();
  if (cur.granted) return true;
  if (!cur.canAskAgain) return false;
  const res = await Notifications.requestPermissionsAsync();
  return res.granted;
}

/** Replace whatever is scheduled with the current setting (or nothing when reminders are off). */
export async function applyReminders(r: Reminders) {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!r.on) return;
    const perm = await Notifications.getPermissionsAsync();
    if (!perm.granted) return;
    await ensureChannel();
    const content = { title: REMINDER_TITLE, body: REMINDER_BODY };
    if (r.every === 'daily') {
      await Notifications.scheduleNotificationAsync({
        content, trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour: r.hour, minute: r.minute, channelId: CHANNEL },
      });
      return;
    }
    for (const date of nextTimes(r.hour, r.minute, 2, ALTERNATE_AHEAD)) {
      await Notifications.scheduleNotificationAsync({ content, trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId: CHANNEL } });
    }
  } catch (e) { console.warn('reminders', e); }
}

export { fmtClock };
