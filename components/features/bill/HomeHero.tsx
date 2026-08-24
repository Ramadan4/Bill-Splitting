import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { LocaleThemeControls } from '@/components/features/settings/LocaleThemeControls';
import { ActionDock } from '@/components/ui/ActionDock';
import { Card } from '@/components/ui/Card';
import { PressableCard } from '@/components/ui/PressableCard';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
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
 * Home bento layout: brand hero, navigation tiles, settings card.
 * The create-bill CTA is docked at the bottom so the most frequent action
 * stays inside the thumb-reach zone on tall devices.
 */
export function HomeHero({ onCreateBill, onOpenHistory, onOpenGroups }: HomeHeroProps) {
  const { t } = useI18n();
  const { isCompact } = useResponsive();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <Screen>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, isCompact && styles.heroCompact]}>
          {/* Shrink the display type on small phones so it never wraps oddly. */}
          <Text style={[styles.brand, isCompact && styles.brandCompact, { color: titleColor }]}>
            {t('home.brand')}
          </Text>
          <Text style={[styles.subtitle, { color: mutedColor }]}>{t('home.subtitle')}</Text>
        </View>

        <View style={styles.grid}>
          <PressableCard style={styles.tile} onPress={onOpenHistory}>
            <Text style={[styles.tileLabel, { color: titleColor }]} numberOfLines={2}>
              {t('home.history')}
            </Text>
          </PressableCard>
          <PressableCard style={styles.tile} onPress={onOpenGroups}>
            <Text style={[styles.tileLabel, { color: titleColor }]} numberOfLines={2}>
              {t('home.groups')}
            </Text>
          </PressableCard>
        </View>

        <Card>
          <LocaleThemeControls />
        </Card>
      </ScrollView>

      <ActionDock>
        <PrimaryButton label={t('home.createBill')} onPress={onCreateBill} />
      </ActionDock>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    gap: Spacing.lg,
    paddingBottom: Spacing.lg,
  },
  hero: {
    gap: Spacing.sm,
    paddingTop: Spacing.xl,
  },
  heroCompact: {
    paddingTop: Spacing.md,
  },
  brand: {
    fontSize: 36,
    fontWeight: '800',
  },
  brandCompact: {
    fontSize: 28,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  // Equal-width tiles keep the bento row balanced on any screen size.
  tile: {
    flex: 1,
  },
  tileLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
});
