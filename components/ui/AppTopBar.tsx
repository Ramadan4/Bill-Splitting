import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { HIT_SLOP, PRESS_SCALE, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

type AppTopBarProps = {
  onPressLanguage: () => void;
  onPressSettings: () => void;
};

/**
 * Home top bar: brand mark + name on the leading edge, language switch and
 * settings on the trailing edge (both edges mirror in RTL via `row`).
 *
 * The brand mark is a vector glyph on a primary tile — the previous hot-linked
 * remote logo rendered blank offline.
 */
export function AppTopBar({ onPressLanguage, onPressSettings }: AppTopBarProps) {
  const { t, locale } = useI18n();
  const primary = useThemeColor({}, 'brand');
  const onPrimary = useThemeColor({}, 'onBrand');
  const textColor = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const chip = useThemeColor({}, 'surfaceContainer');
  const { trigger } = useHaptics();

  // Label the switch with the language it will switch TO — the common pattern users expect.
  const otherLanguage = locale === 'ar' ? t('settings.english') : t('settings.arabic');

  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <View style={[styles.mark, { backgroundColor: primary }]}>
          <MaterialIcons name="restaurant" size={18} color={onPrimary} />
        </View>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {t('home.brand')}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('settings.language')}
          hitSlop={HIT_SLOP}
          onPress={() => {
            trigger('light');
            onPressLanguage();
          }}
          style={({ pressed }) => [
            styles.langPill,
            { backgroundColor: chip, transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
          ]}>
          <MaterialIcons name="translate" size={16} color={muted} />
          <Text style={[styles.langLabel, { color: textColor }]}>{otherLanguage}</Text>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('settings.title')}
          hitSlop={HIT_SLOP}
          onPress={() => {
            trigger('light');
            onPressSettings();
          }}
          style={({ pressed }) => [
            styles.iconBtn,
            { backgroundColor: chip, transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
          ]}>
          <MaterialIcons name="tune" size={20} color={textColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.container,
    paddingVertical: Spacing.md,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flexShrink: 1,
  },
  mark: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  langPill: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.pill,
  },
  langLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  iconBtn: {
    width: TOUCH_TARGET - 8,
    height: TOUCH_TARGET - 8,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
