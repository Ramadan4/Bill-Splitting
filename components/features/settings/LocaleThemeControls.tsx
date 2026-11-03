import { StyleSheet, Text, View } from 'react-native';

import { SegmentedControl, type SegmentOption } from '@/components/ui/SegmentedControl';
import { Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import {
  usePreferencesStore,
  type LocalePreference,
  type ThemePreference,
} from '@/store/preferencesStore';

/**
 * Language (en/ar) + theme (system/light/dark) pickers.
 * Segmented controls keep the current choice visible at a glance — the old
 * "cycle on tap" chip hid which theme was active.
 */
export function LocaleThemeControls() {
  const { t, locale } = useI18n();
  const muted = useThemeColor({}, 'muted');
  const localePreference = usePreferencesStore((state) => state.localePreference);
  const themePreference = usePreferencesStore((state) => state.themePreference);
  const setLocalePreference = usePreferencesStore((state) => state.setLocalePreference);
  const setThemePreference = usePreferencesStore((state) => state.setThemePreference);

  const languages: SegmentOption<LocalePreference>[] = [
    { value: 'en', label: t('settings.english') },
    { value: 'ar', label: t('settings.arabic') },
  ];

  const themes: SegmentOption<ThemePreference>[] = [
    { value: 'system', label: t('settings.themeSystem'), icon: 'brightness-auto' },
    { value: 'light', label: t('settings.themeLight'), icon: 'light-mode' },
    { value: 'dark', label: t('settings.themeDark'), icon: 'dark-mode' },
  ];

  // Prefer resolved locale for selection highlight (covers legacy “system” preference).
  const selectedLocale: LocalePreference =
    localePreference === 'system' ? locale : localePreference;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: muted }]}>{t('settings.language')}</Text>
      <SegmentedControl
        options={languages}
        value={selectedLocale}
        onChange={(value) => void setLocalePreference(value)}
      />

      <Text style={[styles.label, { color: muted }]}>{t('settings.theme')}</Text>
      <SegmentedControl
        options={themes}
        value={themePreference}
        onChange={(value) => void setThemePreference(value)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: Spacing.sm,
  },
});
