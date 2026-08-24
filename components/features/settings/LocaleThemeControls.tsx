import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PRESS_SCALE, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  usePreferencesStore,
  type LocalePreference,
  type ThemePreference,
} from '@/store/preferencesStore';

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function Chip({ label, selected, onPress }: ChipProps) {
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const card = useThemeColor({}, 'card');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          borderColor: selected ? primary : borderColor,
          backgroundColor: selected ? primary : card,
          transform: [{ scale: pressed ? PRESS_SCALE : 1 }],
        },
      ]}>
      <Text
        numberOfLines={1}
        style={{ color: selected ? onPrimary : textColor, fontWeight: '600' }}>
        {label}
      </Text>
    </Pressable>
  );
}

/**
 * Home settings strip: language (en/ar) + theme (system/light/dark).
 * Why: product requires bilingual + light/dark without burying controls in a separate screen.
 */
export function LocaleThemeControls() {
  const { t, locale } = useI18n();
  const muted = useThemeColor({}, 'muted');
  const localePreference = usePreferencesStore((state) => state.localePreference);
  const themePreference = usePreferencesStore((state) => state.themePreference);
  const setLocalePreference = usePreferencesStore((state) => state.setLocalePreference);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);

  const languages: { value: LocalePreference; label: string }[] = [
    { value: 'en', label: t('settings.english') },
    { value: 'ar', label: t('settings.arabic') },
  ];

  const themes: { value: ThemePreference; label: string }[] = [
    { value: 'system', label: t('settings.themeSystem') },
    { value: 'light', label: t('settings.themeLight') },
    { value: 'dark', label: t('settings.themeDark') },
  ];

  // Prefer resolved locale for selection highlight (covers legacy “system” preference).
  const selectedLocale: LocalePreference =
    localePreference === 'system' ? locale : localePreference;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: muted }]}>{t('settings.language')}</Text>
      <View style={styles.row}>
        {languages.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={selectedLocale === option.value}
            onPress={() => {
              void setLocalePreference(option.value);
            }}
          />
        ))}
      </View>

      <Text style={[styles.label, { color: muted }]}>{t('settings.theme')}</Text>
      <View style={styles.row}>
        {themes.map((option) => (
          <Chip
            key={option.value}
            label={option.label}
            selected={themePreference === option.value}
            onPress={() => {
              void setThemePreference(option.value);
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: TOUCH_TARGET,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
});
