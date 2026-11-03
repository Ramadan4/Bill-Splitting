import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HeroCard } from '@/components/features/home/HeroCard';
import { QuickActionRow } from '@/components/features/home/QuickActionRow';
import { SettingsSheet } from '@/components/features/settings/SettingsSheet';
import { AppTopBar } from '@/components/ui/AppTopBar';
import { HomeBottomNav, type HomeTab } from '@/components/ui/HomeBottomNav';
import { Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColor } from '@/hooks/use-theme-color';

type HomeHeroProps = {
  onCreateBill: () => void;
  onOpenHistory: () => void;
  onOpenGroups: () => void;
};

/**
 * Home layout: top bar, hero CTA card, quick actions, bottom nav + settings sheet.
 * Navigation lives in `useHomeActions`; this file only arranges UI.
 */
export function HomeHero({ onCreateBill, onOpenHistory, onOpenGroups }: HomeHeroProps) {
  const { t, locale, setLocalePreference } = useI18n();
  const { contentMaxWidth } = useResponsive();
  const insets = useSafeAreaInsets();
  const background = useThemeColor({}, 'background');
  const muted = useThemeColor({}, 'muted');
  const [settingsOpen, setSettingsOpen] = useState(false);

  const toggleLocale = () => {
    void setLocalePreference(locale === 'ar' ? 'en' : 'ar');
  };

  const onTab = (tab: HomeTab) => {
    // Map each tab to its destination; "split" mirrors the hero CTA.
    const actions: Record<HomeTab, () => void> = {
      split: onCreateBill,
      history: onOpenHistory,
      groups: onOpenGroups,
      settings: () => setSettingsOpen(true),
    };
    actions[tab]();
  };

  return (
    <View style={[styles.root, { backgroundColor: background, paddingTop: insets.top }]}>
      <AppTopBar onPressLanguage={toggleLocale} onPressSettings={() => setSettingsOpen(true)} />

      <ScrollView
        contentContainerStyle={[styles.main, { maxWidth: contentMaxWidth }]}
        showsVerticalScrollIndicator={false}>
        <HeroCard onCreateBill={onCreateBill} />

        <Text style={[styles.section, { color: muted }]}>{t('home.quickActions')}</Text>
        <QuickActionRow
          icon="history"
          title={t('home.history')}
          subtitle={t('home.historyHint')}
          tone="primary"
          onPress={onOpenHistory}
        />
        <QuickActionRow
          icon="group"
          title={t('home.groups')}
          subtitle={t('home.groupsHint')}
          tone="tertiary"
          onPress={onOpenGroups}
        />
      </ScrollView>

      <HomeBottomNav active="split" onSelect={onTab} />
      <SettingsSheet visible={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  main: {
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.container,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl,
    gap: Spacing.bento,
  },
  section: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: Spacing.md,
  },
});
