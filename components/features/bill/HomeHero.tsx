import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppTopBar } from '@/components/ui/AppTopBar';
import { HomeBottomNav, type HomeTab } from '@/components/ui/HomeBottomNav';
import { depth, PRESS_SCALE, Radius, Spacing, CTA_HEIGHT } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColor } from '@/hooks/use-theme-color';
import { usePreferencesStore } from '@/store/preferencesStore';

type HomeHeroProps = {
  onCreateBill: () => void;
  onOpenHistory: () => void;
  onOpenGroups: () => void;
};

/**
 * Stitch home: top bar, hero, bento tiles, theme/language chips, CTA, bottom nav.
 */
export function HomeHero({ onCreateBill, onOpenHistory, onOpenGroups }: HomeHeroProps) {
  const { t, locale, isRtl } = useI18n();
  const { isCompact } = useResponsive();
  const insets = useSafeAreaInsets();
  const { trigger } = useHaptics();
  const background = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const card = useThemeColor({}, 'card');
  const shadow = useThemeColor({}, 'shadow');
  const secondaryContainer = useThemeColor({}, 'secondaryContainer');
  const onSecondaryContainer = useThemeColor({}, 'onSecondaryContainer');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const onPrimaryContainer = useThemeColor({}, 'onPrimaryContainer');
  const surfaceContainer = useThemeColor({}, 'surfaceContainer');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');

  const themePreference = usePreferencesStore((s) => s.themePreference);
  const setThemePreference = usePreferencesStore((s) => s.setThemePreference);
  const setLocalePreference = usePreferencesStore((s) => s.setLocalePreference);

  const cycleTheme = () => {
    trigger('light');
    const order = ['system', 'light', 'dark'] as const;
    const idx = order.indexOf(themePreference);
    void setThemePreference(order[(idx + 1) % order.length]);
  };

  const toggleLocale = () => {
    trigger('light');
    void setLocalePreference(locale === 'ar' ? 'en' : 'ar');
  };

  const onTab = (tab: HomeTab) => {
    if (tab === 'history') {
      onOpenHistory();
      return;
    }
    if (tab === 'split') {
      // Split is the elevated primary chip — same entry point as the CTA.
      onCreateBill();
      return;
    }
    if (tab === 'groups') {
      onOpenGroups();
      return;
    }
    if (tab === 'profile') {
      // Profile opens language cycle as a lightweight settings entry point.
      toggleLocale();
    }
  };

  return (
    <View
      style={[
        styles.root,
        {
          backgroundColor: background,
          direction: isRtl ? 'rtl' : 'ltr',
          paddingTop: insets.top,
        },
      ]}>
      <AppTopBar onPressTranslate={toggleLocale} />

      <View style={styles.main}>
        <View style={[styles.hero, isCompact && styles.heroCompact]}>
          <Text style={[styles.brand, { color: textColor }]}>{t('home.brand')}</Text>
          <Text style={[styles.subtitle, { color: muted }]}>{t('home.subtitle')}</Text>
        </View>

        <View style={styles.grid}>
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              trigger('light');
              onOpenHistory();
            }}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: card },
              depth(1, shadow),
              { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
            ]}>
            <View style={[styles.iconCircle, { backgroundColor: secondaryContainer }]}>
              <MaterialIcons name="history" size={36} color={onSecondaryContainer} />
            </View>
            <Text style={[styles.tileLabel, { color: textColor }]} numberOfLines={2}>
              {t('home.history')}
            </Text>
          </Pressable>

          <Pressable
            accessibilityRole="button"
            onPress={() => {
              trigger('light');
              onOpenGroups();
            }}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: card },
              depth(1, shadow),
              { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
            ]}>
            <View style={[styles.iconCircle, { backgroundColor: primaryContainer }]}>
              <MaterialIcons name="group" size={36} color={onPrimaryContainer} />
            </View>
            <Text style={[styles.tileLabel, { color: textColor }]} numberOfLines={2}>
              {t('home.groups')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.chips}>
          <Pressable
            onPress={cycleTheme}
            style={[styles.chip, { backgroundColor: surfaceContainer, borderColor: border }]}>
            <MaterialIcons name="palette" size={16} color={muted} />
            <Text style={[styles.chipLabel, { color: muted }]}>{t('settings.theme')}</Text>
          </Pressable>
          <Pressable
            onPress={toggleLocale}
            style={[styles.chip, { backgroundColor: surfaceContainer, borderColor: border }]}>
            <MaterialIcons name="language" size={16} color={muted} />
            <Text style={[styles.chipLabel, { color: muted }]}>{t('settings.language')}</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.ctaWrap}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            trigger('light');
            onCreateBill();
          }}
          style={({ pressed }) => [
            styles.cta,
            { backgroundColor: primary },
            depth(2, shadow),
            { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
          ]}>
          <MaterialIcons name="add-circle" size={22} color={onPrimary} />
          <Text style={[styles.ctaLabel, { color: onPrimary }]} numberOfLines={1}>
            {t('home.createBill')}
          </Text>
        </Pressable>
      </View>

      <HomeBottomNav active="split" onSelect={onTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  main: {
    flex: 1,
    paddingHorizontal: Spacing.container,
    gap: Spacing.bento,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
    gap: Spacing.sm,
  },
  heroCompact: {
    paddingVertical: Spacing.md,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    gap: Spacing.bento,
  },
  tile: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
    borderWidth: 1,
  },
  chipLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  ctaWrap: {
    paddingHorizontal: Spacing.container,
    paddingBottom: Spacing.md,
  },
  cta: {
    height: CTA_HEIGHT,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ctaLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
});
