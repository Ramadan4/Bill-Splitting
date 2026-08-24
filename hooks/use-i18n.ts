/**
 * Subscribe to locale changes and expose `t` for presentational components.
 */
import { useCallback } from 'react';

import { t as translate } from '@/i18n';
import type { AppLocale } from '@/i18n';
import { usePreferencesStore } from '@/store/preferencesStore';

export function useI18n() {
  const locale = usePreferencesStore((state) => state.locale);
  const localePreference = usePreferencesStore((state) => state.localePreference);
  const setLocalePreference = usePreferencesStore((state) => state.setLocalePreference);

  // Bind translations to the store locale so copy updates even if global i18n lags.
  const t = useCallback(
    (scope: string, options?: Record<string, string | number>) =>
      translate(scope, { ...options, locale }),
    [locale],
  );

  return {
    t,
    locale,
    localePreference,
    setLocalePreference,
    isRtl: locale === 'ar',
  };
}

export type { AppLocale };
