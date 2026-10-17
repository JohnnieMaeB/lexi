// Lexi: an emoji-first journaling chatbot for dyslexic people (React Native port of lexi.html).
// Layout from the board's wireframes: accent top bar, one chat column held between two colored rails,
// the composer, then the three-icon nav (Settings / Home / Journal).
import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler, Keyboard, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, View, useColorScheme, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
// Per-weight imports so only the four faces Lexi uses are bundled.
import { Lexend_400Regular } from '@expo-google-fonts/lexend/400Regular';
import { Lexend_600SemiBold } from '@expo-google-fonts/lexend/600SemiBold';
import { AtkinsonHyperlegible_400Regular } from '@expo-google-fonts/atkinson-hyperlegible/400Regular';
import { AtkinsonHyperlegible_700Bold } from '@expo-google-fonts/atkinson-hyperlegible/700Bold';
import { ChatLog } from './src/components/ChatLog';
import { Composer } from './src/components/Composer';
import { FreeWriteSheet } from './src/components/FreeWrite';
import { EmojiPicker, Toast } from './src/components/Overlays';
import { closeEmoji, getEmojiTarget } from './src/fields';
import { JournalScreen } from './src/screens/Journal';
import { SettingsScreen } from './src/screens/Settings';
import { boot } from './src/script';
import { initStore, setSheet, showView, state, useLexi, type View as ViewName } from './src/store';
import { shortDate } from './src/text';
import { ThemeContext, makeTheme, useTheme } from './src/theme';
import { T } from './src/ui';
import { stopVoice } from './src/voice';

SplashScreen.preventAutoHideAsync().catch(() => {});
initStore();

export default function App() {
  const [loaded, error] = useFonts({ Lexend_400Regular, Lexend_600SemiBold, AtkinsonHyperlegible_400Regular, AtkinsonHyperlegible_700Bold });
  useEffect(() => { if (loaded || error) SplashScreen.hideAsync().catch(() => {}); }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <SafeAreaProvider>
      <Themed />
    </SafeAreaProvider>
  );
}

function Themed() {
  const st = useLexi();
  const scheme = useColorScheme();
  const { width } = useWindowDimensions();
  const theme = useMemo(() => makeTheme(st.settings, scheme === 'dark', width), [st.settings, scheme, width]);
  useEffect(() => { boot(); }, []);
  return (
    <ThemeContext.Provider value={theme}>
      <Shell />
    </ThemeContext.Provider>
  );
}

function useKeyboardOpen() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const a = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setOpen(true));
    const b = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setOpen(false));
    return () => { a.remove(); b.remove(); };
  }, []);
  return open;
}

/** Android back: close the emoji picker, then the writing sheet, then go back Home. */
function useBackButton() {
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (getEmojiTarget()) { closeEmoji(); return true; }
      if (state.sheetOpen) { stopVoice('fw'); setSheet(false); return true; }
      if (state.view !== 'home') { showView('home'); return true; }
      return false;
    });
    return () => sub.remove();
  }, []);
}

function Shell() {
  const t = useTheme();
  const st = useLexi();
  const insets = useSafeAreaInsets();
  const kb = useKeyboardOpen();
  useBackButton();
  const rail = t.narrow ? 7 : 10;
  const home = st.view === 'home';
  return (
    <View style={{ flex: 1, backgroundColor: t.c.bg }}>
      <StatusBar style={t.accent === 'purple' ? 'light' : 'dark'} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[s.topbar, { paddingTop: insets.top + 10, backgroundColor: t.c.accent }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            {t.icons ? <Text style={t.emoji(Math.round(t.fs * 1.4))}>🤖</Text> : null}
            <T em={1.15} display bold color={t.c.onAccent} accessibilityRole="header">Lexi</T>
          </View>
          <T em={0.8} color={t.c.onAccent}>{shortDate()}</T>
        </View>

        <View style={{ flex: 1, borderLeftWidth: rail, borderRightWidth: rail, borderColor: t.c.accent, backgroundColor: t.c.bg }}>
          {/* Home stays mounted so the conversation and half-done cards survive tab switches. */}
          <View style={{ flex: 1, display: home ? 'flex' : 'none' }}><ChatLog visible={home} /></View>
          {st.view === 'journal' ? <JournalScreen /> : null}
          {st.view === 'settings' ? <SettingsScreen /> : null}
        </View>

        {home ? <Composer /> : null}
        {kb ? null : <Tabs bottomInset={insets.bottom} />}
      </KeyboardAvoidingView>
      <FreeWriteSheet />
      <EmojiPicker />
      <Toast />
    </View>
  );
}

const TABS: [ViewName, string, string][] = [['settings', '⚙️', 'Settings'], ['home', '🏡', 'Home'], ['journal', '📖', 'Journal']];
function Tabs({ bottomInset }: { bottomInset: number }) {
  const t = useTheme();
  const st = useLexi();
  return (
    <View accessibilityRole="tablist" style={[s.tabs, { paddingBottom: bottomInset, backgroundColor: t.c.surface, borderTopColor: t.c.line }]}>
      {TABS.map(([v, icon, name]) => {
        const on = st.view === v;
        return (
          <Pressable key={v} onPress={() => { closeEmoji(); showView(v); }} accessibilityRole="tab" accessibilityLabel={name} accessibilityState={{ selected: on }}
            style={[s.tab, { borderTopColor: on ? t.c.accent : 'transparent', paddingVertical: t.icons ? 6 : 14 }]}>
            {t.icons ? <Text style={t.emoji(Math.round(t.fs * 1.65))}>{icon}</Text> : null}
            <T em={t.icons ? 0.8 : 0.9} bold={on} color={on ? t.c.ink : t.c.inkSoft}>{name}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingHorizontal: 16, paddingBottom: 10 },
  tabs: { flexDirection: 'row', borderTopWidth: 2 },
  tab: { flex: 1, alignItems: 'center', borderTopWidth: 4, marginTop: -2 },
});
