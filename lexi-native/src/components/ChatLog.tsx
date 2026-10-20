// The Home chat (DESIGN_WARM_PAPER §8, §9): the welcome block, then Lexi's turns in a fixed column with the butterfly
// beside the first turn of each group, the person's turns on the right, and cards full width. Answered cards fold
// away. Scrolled up, new lines wait behind a "New message" pill instead of pulling the view down.
import React, { useEffect, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';
import { DUR, reduceMotion } from '../a11y';
import { addMeEmoji, useChatItems, type ChatItem } from '../chat';
import type { Option } from '../content';
import { speak, useReadingWord } from '../speech';
import { useLexi } from '../store';
import { stripEmoji } from '../text';
import { R, useTheme } from '../theme';
import { Btn, Butterfly, Choice, FadeIn, IconBtn, Row, T } from '../ui';
import { CardView } from './Cards';
import { WordText } from './WordText';

type CardItem = Extract<ChatItem, { type: 'card' }>;

/** The presence column: the 36 px butterfly on a group's first turn, the same space left empty on the others. */
function Presence({ show, state = 'idle' }: { show: boolean; state?: 'idle' | 'thinking' }) {
  const t = useTheme();
  if (!t.icons) return null;
  return <View style={{ width: t.presence }}>{show ? <Butterfly size={t.presence} state={state} /> : null}</View>;
}

/** The 48 px speaker button beside a bubble, bottom-aligned. */
function SpeakButton({ text, target }: { text: string; target?: string }) {
  if (!stripEmoji(text)) return null;
  return <View style={{ alignSelf: 'flex-end' }}><IconBtn icon="speaker" label="Read aloud" words="Read" onPress={() => speak(text, { target })} /></View>;
}

/** Lexi's bubble: the `lexi` fill, no shadow, 20 px corners with a 6 px corner on the group's last turn. While Lexi
 *  reads it, it gets a 2 px ring, and the spoken word is highlighted inside by WordText. */
function LexiBubble({ last, info, target, children }: { last: boolean; info?: boolean; target?: string; children: React.ReactNode }) {
  const t = useTheme();
  const reading = useReadingWord(target) !== null;
  return (
    <View style={[s.bubble, {
      width: t.bubbleW, paddingHorizontal: t.fs, paddingVertical: Math.round(t.fs * 0.75),
      backgroundColor: info ? t.c.surface : t.c.lexi, borderBottomLeftRadius: last ? R.xs : R.lg,
      borderWidth: info ? 1 : 0, borderStyle: 'dashed', borderColor: t.c.borderStrong,
    }, reading && { outlineWidth: 2, outlineStyle: 'solid', outlineColor: t.c.accentInk, outlineOffset: 0 }]}>
      {children}
    </View>
  );
}

function LexiRow({ id, text, info, saved, first, last }: { id: string; text: string; info?: boolean; saved?: boolean; first: boolean; last: boolean }) {
  return (
    <FadeIn style={s.row} duration={saved ? DUR.saved : DUR.line}>
      <Presence show={first} />
      <LexiBubble last={last} info={info} target={id}><WordText text={text} target={id} /></LexiBubble>
      <SpeakButton text={text} target={id} />
    </FadeIn>
  );
}

/** Lexi's question, with Yes / No under it. Once answered, the buttons go and the answer row shows below. */
function QuestionRow({ item, first, last }: { item: CardItem; first: boolean; last: boolean }) {
  const t = useTheme();
  const { text, options, yn } = item.props as { text: string; options: Option<unknown>[]; yn?: boolean };
  return (
    <FadeIn style={{ gap: 12 }}>
      <View style={s.row}>
        <Presence show={first} />
        <LexiBubble last={last} target={item.id}><WordText text={text} target={item.id} /></LexiBubble>
        <SpeakButton text={text} target={item.id} />
      </View>
      <Row gap={12} style={{ paddingLeft: t.lexiCol }}>
        {options.map((o, i) => (
          <Choice key={o.label} label={o.label} emoji={o.e} filled={!!yn && i === 0}
            onPress={() => { item.finish(o.v); addMeEmoji([o.e], o.label); }} />
        ))}
      </Row>
    </FadeIn>
  );
}

/** The Thinking row (§8): the mark with folded wings and "Thinking…". Under Reduce Motion it stays still. */
function ThinkingRow() {
  return (
    <FadeIn style={[s.row, { alignItems: 'center' }]}>
      <Presence show state="thinking" />
      <T v="caption" muted accessibilityLabel="Lexi is thinking">Thinking…</T>
    </FadeIn>
  );
}

/** "I tap for next": Next under Lexi's bubble; her next message waits for it. */
function NextPill({ go }: { go: () => void }) {
  const t = useTheme();
  return (
    <View style={{ paddingLeft: t.lexiCol }}>
      <Btn label="Next" iconEnd="next" height={48} onPress={go} a11y="Next message" style={{ alignSelf: 'flex-start' }} />
    </View>
  );
}

function MeRow({ item, last }: { item: Extract<ChatItem, { type: 'me' }>; last: boolean }) {
  const t = useTheme();
  const st = useLexi();
  const avatar = t.icons && st.settings.avatar ? st.settings.avatar : '';
  const emoji = item.emoji && t.icons ? item.emoji : null;
  // One answer at 88 px, several a little smaller, so they still fit the width.
  const size = emoji ? Math.round((emoji.length === 1 ? 88 : emoji.length === 2 ? 68 : emoji.length === 3 ? 56 : 46) / Math.min(t.k, 1.6)) : 0;
  const avatarW = Math.round(40 * Math.min(t.k, 1.6));
  return (
    <FadeIn style={[s.row, { flexDirection: 'row-reverse' }]}>
      {avatar ? (
        <View style={{ width: avatarW, alignSelf: 'flex-end' }} accessible={false} importantForAccessibility="no-hide-descendants">
          {last ? <T raw style={t.emoji(avatarW - 4)}>{t.toned(avatar)}</T> : null}
        </View>
      ) : null}
      {emoji ? (
        <View style={{ maxWidth: t.contentW - (avatar ? avatarW + 8 : 0), alignItems: 'flex-end' }} accessible accessibilityLabel={'You answered ' + (item.caption || '')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 4 }}>
            {emoji.map((e, i) => <T key={i} raw style={t.emoji(size)}>{t.toned(e)}</T>)}
          </View>
          {item.caption ? <T v="caption" muted style={{ textAlign: 'right' }}>{item.caption}</T> : null}
        </View>
      ) : (
        <View style={[s.bubble, {
          maxWidth: t.bubbleW, paddingHorizontal: t.fs, paddingVertical: Math.round(t.fs * 0.75),
          backgroundColor: t.c.me, borderBottomRightRadius: last ? R.xs : R.lg, borderWidth: t.c.meEdge ? 1 : 0, borderColor: t.c.hairline,
        }]}>
          <T raw>{item.text}</T>
        </View>
      )}
    </FadeIn>
  );
}

/** The Home welcome (§10): the 104 px butterfly in a 148 px `lexi` circle, and the greeting. */
function Welcome({ greeting }: { greeting: string }) {
  const t = useTheme();
  return (
    <FadeIn style={{ alignItems: 'center', gap: 16, paddingTop: 8 }}>
      <View style={{ width: 148, height: 148, borderRadius: 74, backgroundColor: t.c.lexi, alignItems: 'center', justifyContent: 'center' }}>
        <Butterfly size={104} />
      </View>
      <T v="display" accessibilityRole="header" style={{ textAlign: 'center' }}>{greeting}</T>
    </FadeIn>
  );
}

const side = (i?: ChatItem) =>
  !i ? null : i.type === 'bot' || i.type === 'thinking' || (i.type === 'card' && i.card === 'question') ? 'lexi'
    : i.type === 'me' ? 'me' : i.type === 'next' ? 'lexi' : i.type === 'welcome' ? 'welcome' : 'card';

export function ChatLog({ visible }: { visible: boolean }) {
  const t = useTheme();
  const items = useChatItems();
  const ref = useRef<ScrollViewInstance>(null);
  const pending = useRef(true);
  const atBottom = useRef(true);
  const [pill, setPill] = useState(false);
  useEffect(() => { pending.current = true; }, [items.length, items[items.length - 1]?.id]);
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => ref.current?.scrollToEnd({ animated: false }), 60);
    return () => clearTimeout(id);
  }, [visible]);
  const toEnd = () => { setPill(false); atBottom.current = true; ref.current?.scrollToEnd({ animated: !reduceMotion }); };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    // More than 120 px up counts as "scrolled up" (§9).
    atBottom.current = contentSize.height - (contentOffset.y + layoutMeasurement.height) <= 120;
    if (atBottom.current && pill) setPill(false);
  };
  const onGrow = () => {
    if (!pending.current) return;
    pending.current = false;
    // Your own message always brings you down; anything else does only when you're at the bottom.
    if (atBottom.current || items[items.length - 1]?.type === 'me') toEnd();
    else setPill(true);
  };
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={ref}
        accessibilityLabel="Chat with Lexi"
        keyboardShouldPersistTaps="handled"
        onScroll={onScroll}
        scrollEventThrottle={32}
        onLayout={() => { if (atBottom.current) ref.current?.scrollToEnd({ animated: false }); }}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24, paddingHorizontal: t.gutter }}
        onContentSizeChange={onGrow}>
        {items.map((it, i) => {
          const prev = side(items[i - 1]), me = side(it);
          const first = prev !== me, last = side(items[i + 1]) !== me;
          // 24 px between speakers, 8 px within a group (§3).
          const gap = { marginTop: i === 0 ? 0 : first ? 24 : 8 };
          let node: React.ReactNode;
          if (it.type === 'welcome') node = <Welcome greeting={it.greeting} />;
          else if (it.type === 'bot') node = <LexiRow id={it.id} text={it.text} info={it.info} saved={it.saved} first={first} last={last} />;
          else if (it.type === 'next') node = <NextPill go={it.go} />;
          else if (it.type === 'thinking') node = <ThinkingRow />;
          else if (it.type === 'me') node = <MeRow item={it} last={last} />;
          else if (it.card === 'question') node = <QuestionRow item={it} first={first} last={last} />;
          else node = <FadeIn><CardView item={it} /></FadeIn>;
          return <View key={it.id} style={gap}>{node}</View>;
        })}
      </ScrollView>
      {pill ? (
        <View style={s.pillWrap} pointerEvents="box-none">
          <Btn label="New message ↓" height={48} onPress={toEnd} style={[t.overlay, { borderWidth: t.dark ? 1 : 0 }]} />
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  bubble: { borderRadius: R.lg },
  pillWrap: { position: 'absolute', left: 0, right: 0, bottom: 12, alignItems: 'center' },
});
