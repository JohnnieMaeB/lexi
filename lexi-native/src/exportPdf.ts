// 📤 Share my journal (FEATURES_SOON §8): a plain PDF (no emoji, sans font, black on white, about 12 pt) made
// with expo-print, then handed to the share sheet with expo-sharing. Nothing leaves the phone unless the person
// picks somewhere to send it.
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import type { Entry } from './store';
import { journalHtml } from './pdfHtml';

/** Make the PDF and open the share sheet. Returns false if sharing isn't available on this device. */
export async function shareJournalPdf(entries: Entry[], range: 'month' | 'all'): Promise<boolean> {
  const { uri } = await Print.printToFileAsync({ html: journalHtml(entries, range) });
  // Give the file a friendly name before sharing it.
  let shareUri = uri;
  try {
    const named = new File(Paths.cache, 'lexi-journal.pdf');
    if (named.exists) named.delete();
    new File(uri).move(named);
    shareUri = named.uri;
  } catch (e) { console.warn('pdf rename', e); }
  if (!(await Sharing.isAvailableAsync())) return false;
  await Sharing.shareAsync(shareUri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: 'Lexi journal' });
  return true;
}
