/**
 * Root navigation for SplitEat.
 * Bill stack hides its own nested headers via the bill layout.
 */
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useI18n } from '@/hooks/use-i18n';
import { stackScreenOptions, useNavigationTheme } from '@/hooks/useNavigationTheme';
import { useGroupsStore } from '@/store/groupsStore';
import { useHistoryStore } from '@/store/historyStore';
import { usePreferencesStore } from '@/store/preferencesStore';

function RootStack() {
  const { t, locale } = useI18n();
  const scheme = useColorScheme();
  const navigationTheme = useNavigationTheme();

  // Remount stack when locale changes so header titles pick up the new language.
  return (
    <ThemeProvider value={navigationTheme}>
      <Stack key={locale} screenOptions={stackScreenOptions}>
        {/* Home draws its own top bar; a native header here would stack a second bar on top. */}
        <Stack.Screen name="index" options={{ title: t('nav.home'), headerShown: false }} />
        <Stack.Screen name="bill" options={{ headerShown: false }} />
        <Stack.Screen name="history" options={{ headerShown: false }} />
        {/* No app/groups/_layout.tsx, so the route registers as "groups/index". */}
        <Stack.Screen name="groups/index" options={{ title: t('nav.groups') }} />
      </Stack>
      {/* Follow the in-app theme, not the OS, so icons stay legible after a manual override. */}
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const locale = usePreferencesStore((state) => state.locale);
  const hydrate = usePreferencesStore((state) => state.hydrate);
  const hydrateHistory = useHistoryStore((state) => state.hydrate);
  const hydrateGroups = useGroupsStore((state) => state.hydrate);
  const isRtl = locale === 'ar';

  useEffect(() => {
    void hydrate();
    void hydrateHistory();
    void hydrateGroups();
  }, [hydrate, hydrateHistory, hydrateGroups]);

  return (
    <SafeAreaProvider>
      <View style={[styles.root, { direction: isRtl ? 'rtl' : 'ltr' }]}>
        <RootStack />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
