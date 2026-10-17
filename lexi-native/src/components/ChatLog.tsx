// The Home chat: Lexi's mint bubbles on the left, yours on the right, cards in between.
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View, type ScrollViewInstance } from 'react-native';
import { reduceMotion, useChatItems, type ChatItem } from '../chat';
import { speak } from '../speech';
import { useLexi } from '../store';
import { stripEmoji } from '../text';
import { useTheme } from '../theme';
import { T } from '../ui';
import { CardView } from './Cards';

function Ava({ e, hidden }: { e: string; hidden?: boolean }) {
  const t = useTheme();
  if (!t.icons) return null;
  return (
    <View style={[s.ava, { opacity: hidden ? 0 : 1 }]} accessible={false} importantForAccessibility="no-hide-descendants">
      <Text style={t.emoji(26)}>{t.toned(e)}</Text>
    </View>
  );
}

function SpeakButton({ text, color }: { text: string; color: string }) {
  const t = useTheme();
  if (!stripEmoji(text)) return null;
  return (
    <Pressable onPress={() => speak(text)} accessibilityRole="button" accessibilityLabel="Read aloud" hitSlop={10}
      style={({ pressed }) => ({ marginLeft: 6, paddingHorizontal: 3, opacity: pressed ? 1 : 0.8, alignSelf: 'flex-end' })}>
      {t.icons ? <Text style={t.emoji(Math.round(t.fs * 0.85))}>🔊</Text> : <T em={0.8} color={color}>Read</T>}
    </Pressable>
  );
}

/** A bubble that rises 6px into place, unless reduce motion is on. */
function Rise({ children }: { children: React.ReactNode }) {
  const y = useRef(new Animated.Value(reduceMotion ? 0 : 6)).current;
  useEffect(() => { if (!reduceMotion) Animated.timing(y, { toValue: 0, duration: 250, useNativeDriver: true }).start(); }, [y]);
  return <Animated.View style={{ transform: [{ translateY: y }] }}>{children}</Animated.View>;
}

function BotRow({ text, info, cont }: { text: string; info?: boolean; cont: boolean }) {
  const t = useTheme();
  const emojiOnly = !stripEmoji(text);
  if (emojiOnly && !t.icons) return null;
  const maxW = t.narrow ? '86%' : '82%';
  return (
    <Rise>
      <View style={s.row}>
        <Ava e="🤖" hidden={cont} />
        {emojiOnly ? (
          <Text style={[t.emoji(t.fs * 2), { letterSpacing: t.fs * 0.16 }]} accessibilityLabel="Lexi cheers">{t.toned(text)}</Text>
        ) : (
          <View style={[s.bubble, s.botBubble, {
            maxWidth: maxW, paddingHorizontal: t.fs * 0.9, paddingVertical: t.fs * 0.55,
            backgroundColor: info ? t.c.surface : t.c.bot,
            borderWidth: info ? 2 : 0, borderStyle: 'dashed', borderColor: t.c.bot,
          }]}>
            <T color={info ? t.c.ink : t.c.botInk} style={{ flexShrink: 1 }}>{text}</T>
            <SpeakButton text={text} color={info ? t.c.ink : t.c.botInk} />
          </View>
        )}
      </View>
    </Rise>
  );
}

function MeRow({ text, cont }: { text: string; cont: boolean }) {
  const t = useTheme();
  const st = useLexi();
  return (
    <Rise>
      <View style={[s.row, { flexDirection: 'row-reverse' }]}>
        <Ava e={st.settings.avatar} hidden={cont} />
        <View style={[s.bubble, s.meBubble, { maxWidth: t.narrow ? '86%' : '82%', paddingHorizontal: t.fs * 0.9, paddingVertical: t.fs * 0.55, backgroundColor: t.c.me }]}>
          <T color={t.c.meInk}>{text}</T>
        </View>
      </View>
    </Rise>
  );
}

/** Three dots bobbing up and down: the Animated circle from the board's React Native sketch. */
function Typing({ cont }: { cont: boolean }) {
  const t = useTheme();
  const vals = useRef([0, 1, 2].map(() => new Animated.Value(0))).current;
  useEffect(() => {
    if (reduceMotion) return;
    const loops = vals.map((v, i) => Animated.loop(Animated.sequence([
      Animated.delay(i * 150),
      Animated.timing(v, { toValue: -7, duration: 500, useNativeDriver: true }),
      Animated.timing(v, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.delay((2 - i) * 150),
    ])));
    loops.forEach(l => l.start());
    return () => loops.forEach(l => l.stop());
  }, [vals]);
  return (
    <View style={s.row}>
      <Ava e="🤖" hidden={cont} />
      <View accessibilityLabel="Lexi is typing" style={[s.bubble, s.botBubble, { flexDirection: 'row', gap: 6, paddingHorizontal: 15, paddingVertical: 14, backgroundColor: t.c.bot }]}>
        {vals.map((v, i) => <Animated.View key={i} style={[s.dot, { backgroundColor: t.c.botInk, transform: [{ translateY: v }] }]} />)}
      </View>
    </View>
  );
}

const who = (i?: ChatItem) => (!i ? null : i.type === 'typing' ? 'bot' : i.type === 'card' ? 'card' : i.type);

export function ChatLog({ visible }: { visible: boolean }) {
  const t = useTheme();
  const items = useChatItems();
  const ref = useRef<ScrollViewInstance>(null);
  const pending = useRef(true);
  useEffect(() => { pending.current = true; }, [items.length]);
  useEffect(() => {
    if (!visible) return;
    const id = setTimeout(() => ref.current?.scrollToEnd({ animated: false }), 60);
    return () => clearTimeout(id);
  }, [visible]);
  const indent = t.icons && !t.narrow ? 42 : 0;
  return (
    <ScrollView
      ref={ref}
      accessibilityLabel="Chat with Lexi"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ gap: 10, paddingTop: 18, paddingBottom: 28, paddingHorizontal: t.narrow ? 10 : 12 }}
      onContentSizeChange={() => { if (pending.current) { pending.current = false; ref.current?.scrollToEnd({ animated: !reduceMotion }); } }}>
      {items.map((it, i) => {
        const prev = who(items[i - 1]);
        if (it.type === 'bot') return <BotRow key={it.id} text={it.text} info={it.info} cont={prev === 'bot'} />;
        if (it.type === 'typing') return <Typing key={it.id} cont={prev === 'bot'} />;
        if (it.type === 'me') return <MeRow key={it.id} text={it.text} cont={prev === 'me'} />;
        return <View key={it.id} style={{ marginLeft: indent }}><CardView item={it} /></View>;
      })}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  ava: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  bubble: { flexDirection: 'row', alignItems: 'flex-end', borderRadius: 20 },
  botBubble: { borderBottomLeftRadius: 6 },
  meBubble: { borderBottomRightRadius: 6 },
  dot: { width: 10, height: 10, borderRadius: 5 },
});
