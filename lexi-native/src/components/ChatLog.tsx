// The Home chat, laid out like Screens 11-13: a fixed-width column of mint bubbles on the left with 🤖 on the
// last bubble of each group, Yes / No pills inside the question bubble, and emoji answers shown huge on the right.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { addMeEmoji, reduceMotion, useChatItems, type ChatItem } from '../chat';
import type { Option } from '../content';
import { speak } from '../speech';
import { useLexi } from '../store';
import { emojiList, stripEmoji } from '../text';
import { R, useTheme } from '../theme';
import { Choice, PopIn, Row, T } from '../ui';
import { CardView } from './Cards';

const BUTTERFLY = require('../../assets/butterfly.png');
type CardItem = Extract<ChatItem, { type: 'card' }>;

function Ava({ e, show, size }: { e: string; show: boolean; size: number }) {
  const t = useTheme();
  if (!t.icons) return null;
  return (
    <View style={{ width: size, alignItems: 'center', justifyContent: 'flex-end' }} accessible={false} importantForAccessibility="no-hide-descendants">
      {show ? <Text style={t.emoji(size - 4)}>{t.toned(e)}</Text> : null}
    </View>
  );
}

function SpeakButton({ text, color }: { text: string; color: string }) {
  const t = useTheme();
  if (!stripEmoji(text)) return null;
  return (
    <Pressable onPress={() => speak(text)} accessibilityRole="button" accessibilityLabel="Read aloud" hitSlop={10}
      style={({ pressed }) => ({ alignSelf: 'flex-end', marginTop: 2, paddingHorizontal: 4, opacity: pressed ? 1 : 0.75 })}>
      {t.icons ? <Text style={t.emoji(22)}>🔊</Text> : <T em={0.8} color={color}>Read</T>}
    </Pressable>
  );
}

/** Bot bubble shell: fixed width, radius 22, a 6 px corner pointing at 🤖 on the last bubble. */
function BotBubble({ last, info, children }: { last: boolean; info?: boolean; children: React.ReactNode }) {
  const t = useTheme();
  return (
    <View style={[s.bubble, t.shadow, {
      width: t.bubbleW, paddingHorizontal: Math.round(t.fs * 0.85), paddingVertical: Math.round(t.fs * 0.6),
      backgroundColor: info ? t.c.surface : t.c.bot, borderBottomLeftRadius: last && t.icons ? 6 : R.m,
      borderWidth: info ? 2 : t.c.botLine ? 1 : 0, borderStyle: info ? 'dashed' : 'solid', borderColor: info ? t.c.bot : t.c.botLine || 'transparent',
    }]}>
      {children}
    </View>
  );
}

/** 👏🏽👏🏽👏🏽👏🏽 across the width, 64-96 px, with a short bounce. */
function Celebration({ text }: { text: string }) {
  const t = useTheme();
  const n = Math.max(1, emojiList(text).length);
  // Emoji grow with the phone's text size, so the 64-96 px target is divided by it to still fit the width.
  const size = Math.round(Math.max(64, Math.min(96, ((t.contentW - t.avatarBot - 8) / n) * 0.82)) / t.k);
  const y = useRef(new Animated.Value(reduceMotion ? 0 : 18)).current;
  useEffect(() => { if (!reduceMotion) Animated.spring(y, { toValue: 0, friction: 4, tension: 120, useNativeDriver: true }).start(); }, [y]);
  return (
    <Animated.View style={{ flex: 1, transform: [{ translateY: y }] }}>
      <Text style={[t.emoji(size), { textAlign: 'left' }]} accessibilityLabel="Lexi cheers">{t.toned(text)}</Text>
    </Animated.View>
  );
}

function BotRow({ text, info, last }: { text: string; info?: boolean; last: boolean }) {
  const t = useTheme();
  const emojiOnly = !stripEmoji(text);
  // Celebration rows are left out in words-only mode and under Reduce Motion.
  if (emojiOnly && (!t.icons || reduceMotion)) return null;
  return (
    <PopIn style={s.row}>
      <Ava e="🤖" show={last} size={t.avatarBot} />
      {emojiOnly ? <Celebration text={text} /> : (
        <BotBubble last={last} info={info}>
          <T color={info ? t.c.ink : t.c.botInk}>{text}</T>
          <SpeakButton text={text} color={info ? t.c.ink : t.c.botInk} />
        </BotBubble>
      )}
    </PopIn>
  );
}

/** Lexi's question with big Yes / No pills inside the bubble, bottom-left (Screens 11-13). */
function QuestionRow({ item, last }: { item: CardItem; last: boolean }) {
  const t = useTheme();
  const { text, options, yn } = item.props as { text: string; options: Option<unknown>[]; yn?: boolean };
  return (
    <PopIn style={s.row}>
      <Ava e="🤖" show={last} size={t.avatarBot} />
      <BotBubble last={last}>
        <T color={t.c.botInk}>{text}</T>
        <Row gap={10} style={{ marginTop: 10 }}>
          {options.map((o, i) => (
            <Choice key={o.label} big label={o.label} icon={o.e} filled={!!yn && i === 0}
              dim={item.done && item.picked !== i} disabled={item.done}
              onPress={() => { item.finish(o.v, i); addMeEmoji([o.e], o.label); }} />
          ))}
        </Row>
        <SpeakButton text={text} color={t.c.botInk} />
      </BotBubble>
    </PopIn>
  );
}

function MeRow({ item, last }: { item: Extract<ChatItem, { type: 'me' }>; last: boolean }) {
  const t = useTheme();
  const st = useLexi();
  const emoji = item.emoji && t.icons ? item.emoji : null;
  // One answer at 88 px, several a little smaller, so they still fit the width.
  const size = emoji ? Math.round((emoji.length === 1 ? 88 : emoji.length === 2 ? 68 : emoji.length === 3 ? 56 : 46) / Math.min(t.k, 1.6)) : 0;
  return (
    <PopIn style={[s.row, { flexDirection: 'row-reverse' }]}>
      <Ava e={st.settings.avatar} show={last} size={t.avatarMe} />
      {emoji ? (
        <View style={{ maxWidth: t.contentW - t.avatarMe - 8, alignItems: 'flex-end' }} accessible accessibilityLabel={'You answered ' + (item.caption || '')}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 4 }}>
            {emoji.map((e, i) => <Text key={i} style={t.emoji(size)}>{t.toned(e)}</Text>)}
          </View>
          {item.caption ? <T em={0.8} soft style={{ textAlign: 'right' }}>{item.caption}</T> : null}
        </View>
      ) : (
        <View style={[s.bubble, t.shadow, {
          maxWidth: t.bubbleW, paddingHorizontal: Math.round(t.fs * 0.85), paddingVertical: Math.round(t.fs * 0.6),
          backgroundColor: t.c.me, borderBottomRightRadius: last && t.icons ? 6 : R.m, borderWidth: t.dark ? 1 : 0, borderColor: t.c.line,
        }]}>
          <T color={t.c.meInk}>{item.text}</T>
        </View>
      )}
    </PopIn>
  );
}

/** Circles moving up and down: the board's "Move a Circle up/down" React Native sketch. */
function Typing({ last }: { last: boolean }) {
  const t = useTheme();
  const vals = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    if (reduceMotion) return;
    const loops = vals.map((v, i) => Animated.loop(Animated.sequence([
      Animated.delay(i * 150),
      Animated.timing(v, { toValue: -8, duration: 420, useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 420, useNativeDriver: true }),
      Animated.delay((2 - i) * 150),
    ])));
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [vals]);
  return (
    <View style={s.row}>
      <Ava e="🤖" show={last} size={t.avatarBot} />
      <View accessibilityLabel="Lexi is typing" style={[s.bubble, t.shadow, {
        flexDirection: 'row', gap: 8, paddingHorizontal: 18, paddingVertical: reduceMotion ? 10 : 18, backgroundColor: t.c.bot,
        borderBottomLeftRadius: last && t.icons ? 6 : R.m, borderWidth: t.c.botLine ? 1 : 0, borderColor: t.c.botLine || 'transparent',
      }]}>
        {reduceMotion
          ? <T em={0.85} color={t.c.botInk}>Lexi is thinking…</T>
          : vals.map((v, i) => <Animated.View key={i} style={[s.dot, { backgroundColor: t.c.botInk, transform: [{ translateY: v }] }]} />)}
      </View>
    </View>
  );
}

const side = (i?: ChatItem) =>
  !i ? null : i.type === 'bot' || i.type === 'typing' || (i.type === 'card' && i.card === 'question') ? 'bot' : i.type === 'me' ? 'me' : 'card';

export function ChatLog({ visible }: { visible: boolean }) {
  const t = useTheme();
  const items = useChatItems();
  const ref = useRef<ScrollViewInstance>(null);
  const pending = useRef(true);
  const [h, setH] = useState(0);
  useEffect(() => { pending.current = true; }, [items.length]);
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => ref.current?.scrollToEnd({ animated: false }), 60);
    return () => clearTimeout(id);
  }, [visible]);
  const bw = Math.round(t.contentW * 0.82), bh = Math.round(bw * (1076 / 560));
  return (
    <View style={{ flex: 1 }} onLayout={e => setH(e.nativeEvent.layout.height)}>
      {t.butterfly && h ? (
        <Image source={BUTTERFLY} resizeMode="contain" accessible={false} pointerEvents="none"
          style={{ position: 'absolute', alignSelf: 'center', top: Math.max(0, (h - Math.min(bh, h * 0.92)) / 2), width: bw, height: Math.min(bh, h * 0.92), tintColor: '#FFB877', opacity: 0.18 }} />
      ) : null}
      <ScrollView
        ref={ref}
        accessibilityLabel="Chat with Lexi"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ gap: 24, paddingTop: 20, paddingBottom: 28, paddingHorizontal: t.pad }}
        onContentSizeChange={() => { if (pending.current) { pending.current = false; ref.current?.scrollToEnd({ animated: !reduceMotion }); } }}>
        {items.map((it, i) => {
          const last = side(items[i + 1]) !== side(it);
          if (it.type === 'bot') return <BotRow key={it.id} text={it.text} info={it.info} last={last} />;
          if (it.type === 'typing') return <Typing key={it.id} last={last} />;
          if (it.type === 'me') return <MeRow key={it.id} item={it} last={last} />;
          if (it.card === 'question') return <QuestionRow key={it.id} item={it} last={last} />;
          return <PopIn key={it.id}><CardView item={it} /></PopIn>;
        })}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  bubble: { borderRadius: R.m },
  dot: { width: 12, height: 12, borderRadius: 6 },
});
