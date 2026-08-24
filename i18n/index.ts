/**
 * i18n bootstrap: English + Arabic catalogs via i18n-js + expo-localization.
 * UI should prefer `useI18n()` so components re-render when locale changes.
 */
import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

import { ar } from '@/i18n/locales/ar';
import { en } from '@/i18n/locales/en';

export type AppLocale = 'en' | 'ar';

export const i18n = new I18n({ en, ar });

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

/** Map device language → supported app locale. */
export function resolveDeviceLocale(): AppLocale {
  const code = getLocales()[0]?.languageCode?.toLowerCase();
  return code === 'ar' ? 'ar' : 'en';
}

/** Apply an explicit locale to the shared i18n instance. */
export function setI18nLocale(locale: AppLocale): void {
  i18n.locale = locale;
}

/**
 * Translate a dotted key.
 * Pass `locale` so UI never depends on a stale global `i18n.locale` after a reload.
 */
export function t(
  scope: string,
  options?: Record<string, string | number> & { locale?: AppLocale },
): string {
  return i18n.t(scope, options);
}

// Seed from device until preferences hydrate.
setI18nLocale(resolveDeviceLocale());
