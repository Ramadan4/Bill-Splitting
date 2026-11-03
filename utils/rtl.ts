/**
 * Sync React Native layout direction with the active app locale.
 *
 * Native I18nManager.forceRTL only fully applies on the next cold start.
 * In-app switches rely on the root `direction` style (see app/_layout.tsx)
 * so Arabic/English copy and mirroring update immediately without a reload race.
 */
import { I18nManager, Platform } from 'react-native';

import type { AppLocale } from '@/i18n';

/** Whether Arabic should drive RTL layout. */
export function localeNeedsRtl(locale: AppLocale): boolean {
  return locale === 'ar';
}

/**
 * Align I18nManager + web document direction with the chosen locale.
 * Persists the native RTL flag for the next cold start (Expo Go may ignore until restart).
 */
export function syncLayoutDirection(locale: AppLocale): void {
  const shouldBeRtl = localeNeedsRtl(locale);

  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = shouldBeRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = locale;
    }
    return;
  }

  // Keep RTL allowed so forceRTL(false) can restore LTR on the next launch.
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(shouldBeRtl);
}

/**
 * Whether the native layout flag disagrees with the chosen locale.
 * Native headers/back gestures only pick up `forceRTL` after a cold start,
 * so the UI can surface a restart hint while this returns true.
 */
export function nativeDirectionMismatch(locale: AppLocale): boolean {
  if (Platform.OS === 'web') {
    return false;
  }
  return I18nManager.isRTL !== localeNeedsRtl(locale);
}

/**
 * Letter-spacing that is safe for the active script.
 * Arabic is cursive: extra tracking breaks the joins between letters, so RTL gets 0.
 */
export function trackingFor(isRtl: boolean, value: number): number {
  return isRtl ? 0 : value;
}
