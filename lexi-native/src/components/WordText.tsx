// Text whose words light up while Lexi reads them (FEATURES_SOON §1) and can be tapped to hear one (§2).
// A word is a non-emoji whitespace token, counted the same way as the clip timings and boundary events
// (speechKey(text).split(/\s+/)). Words are nested Text, not buttons, so screen readers still use the 🔊.
import { useEffect, useMemo, useRef, useState } from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { speakWord, useReadingWord } from '../speech';
import { useLexi } from '../store';
import { speechKey, stripEmoji, tokenize } from '../text';
import { R, useTheme } from '../theme';

export function WordText({ text, target, em = 1, bold, color, style }: {
  text: string; target?: string; em?: number; bold?: boolean; color?: string; style?: StyleProp<TextStyle>;
}) {
  const t = useTheme();
  const st = useLexi();
  const reading = useReadingWord(target);
  const [flash, setFlash] = useState(-1);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const tokens = useMemo(() => tokenize(text), [text]);
  const tap = st.settings.tapWord;
  const hl = t.hl;
  const lit = (i: number) => hl && i >= 0 && (i === reading || i === flash);
  return (
    <Text style={[t.txt('body', { em, w: bold ? 700 : undefined, color }), style]}>
      {tokens.map((tk, k) => {
        if (tk.space) return <Text key={k}>{t.rich(tk.s)}</Text>;
        const shown = t.icons ? t.toned(tk.s) : stripEmoji(t.toned(tk.s));
        if (!shown) return null;
        if (tk.word < 0) return <Text key={k}>{shown}</Text>;
        const on = lit(tk.word);
        return (
          <Text key={k}
            onPress={tap ? () => {
              speakWord(speechKey(tk.s));
              setFlash(tk.word);
              if (timer.current) clearTimeout(timer.current);
              timer.current = setTimeout(() => setFlash(-1), 700);
            } : undefined}
            style={on && hl ? { backgroundColor: hl.bg, color: hl.ink, borderRadius: R.xs } : undefined}>
            {shown}
          </Text>
        );
      })}
    </Text>
  );
}
