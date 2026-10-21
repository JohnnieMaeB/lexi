// Lexi: an emoji-first journaling chatbot for dyslexic people (React Native port of web/lexi.html).
// Layout from docs/DESIGN_WARM_PAPER.md §7: no accent frame. A canvas-coloured top bar with the butterfly and the
// Help pill, the chat on the canvas, and a surface dock with the composer above the Settings / Home / Journal tabs.
import React, { useEffect, useMemo, useState } from 'react';
import { BackHandler, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View, useColorScheme, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
// Per-weight imports so only the five faces Lexi uses are bundled.
import { Lexend_400Regular } from '@expo-google-fonts/lexend/400Regular';
import { Lexend_500Medium } from '@expo-google-fonts/lexend/500Medium';
import { Lexend_600SemiBold } from '@expo-google-fonts/lexend/600SemiBold';
import { AtkinsonHyperlegible_400Regular } from '@expo-google-fonts/atkinson-hyperlegible/400Regular';
import { AtkinsonHyperlegible_700Bold } from '@expo-google-fonts/atkinson-hyperlegible/700Bold';
import { ChatLog } from './src/components/ChatLog';
import { Dock } from './src/components/Composer';
import { FreeWriteSheet } from './src/components/FreeWrite';
import { AiLabel, HelpPill, HelpSheet } from './src/components/Help';
import { VoiceEntrySheet } from './src/components/VoiceEntry';
import { applyReminders } from './src/reminders';
import { EmojiPicker, Toast } from './src/components/Overlays';
import { closeEmoji, getEmojiTarget } from './src/fields';
import { JournalScreen } from './src/screens/Journal';
import { SettingsScreen } from './src/screens/Settings';
import { boot } from './src/script';
import { loadVoices } from './src/speech';
import { initStore, setHelp, setSheet, setVoiceSheet, showView, state, useLexi } from './src/store';
import { ThemeContext, makeTheme, useTheme } from './src/theme';
import { Butterfly, T } from './src/ui';
import { stopVoice } from './src/voice';
import { moreContrast, reduceMotion } from './src/a11y';

SplashScreen.preventAutoHideAsync().catch(() => {});
initStore();
loadVoices(); // so the first message is already read in the best voice
// Every-other-day reminders are single dates, so top them up on each launch (this never asks for permission).
if (state.settings.reminders.on) applyReminders(state.settings.reminders);

export default function App() {
  const [loaded, error] = useFonts({ Lexend_400Regular, Lexend_500Medium, Lexend_600SemiBold, AtkinsonHyperlegible_400Regular, AtkinsonHyperlegible_700Bold });
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
  // fontScale is the phone's text size; it changes live when the person changes it in system settings.
  const { width, fontScale } = useWindowDimensions();
  // Reduce Motion and higher contrast are read live (a11y.ts); a change makes a new theme so everything redraws.
  const theme = useMemo(() => makeTheme(st.settings, scheme === 'dark', width, fontScale, moreContrast),
    [st.settings, scheme, width, fontScale, moreContrast, reduceMotion]);
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
      if (state.helpOpen) { setHelp(false); return true; }
      if (state.sheetOpen) { stopVoice('fw'); setSheet(false); return true; }
      if (state.voiceOpen) { stopVoice('voice-entry'); setVoiceSheet(false); return true; }
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
  const home = st.view === 'home';
  return (
    <View style={{ flex: 1, backgroundColor: t.c.canvas }}>
      <StatusBar style={t.dark ? 'light' : 'dark'} />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={[s.topbar, { paddingTop: insets.top + 6, paddingBottom: 6, paddingHorizontal: t.gutter, backgroundColor: t.c.canvas }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Butterfly size={34} />
            <T v="title" accessibilityRole="header">Lexi</T>
          </View>
          <HelpPill />
        </View>
        {home ? <AiLabel /> : null}

        <View style={{ flex: 1, backgroundColor: t.c.canvas }}>
          {/* Home stays mounted so the conversation and half-done cards survive tab switches. */}
          <View style={{ flex: 1, display: home ? 'flex' : 'none' }}><ChatLog visible={home} /></View>
          {st.view === 'journal' ? <JournalScreen /> : null}
          {st.view === 'settings' ? <SettingsScreen /> : null}
        </View>

        <Dock bottomInset={insets.bottom} keyboardOpen={kb} />
      </KeyboardAvoidingView>
      <FreeWriteSheet />
      <VoiceEntrySheet />
      <HelpSheet />
      <EmojiPicker />
      <Toast />
    </View>
  );
}

const s = StyleSheet.create({
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, minHeight: 60 },
});
