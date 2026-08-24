/**
 * Persisted user preferences: language + theme (local-only MVP).
 */
import { create } from 'zustand';

import { resolveDeviceLocale, setI18nLocale, type AppLocale } from '@/i18n';
import { readJson, StorageKeys, writeJson } from '@/services/storage';
import { syncLayoutDirection } from '@/utils/rtl';

export type LocalePreference = 'system' | AppLocale;
export type ThemePreference = 'system' | 'light' | 'dark';

type StoredPreferences = {
  localePreference: LocalePreference;
  themePreference: ThemePreference;
};

type PreferencesState = StoredPreferences & {
  /** Resolved locale after applying “system”. */
  locale: AppLocale;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setLocalePreference: (preference: LocalePreference) => Promise<void>;
  setThemePreference: (preference: ThemePreference) => Promise<void>;
};

function resolveLocale(preference: LocalePreference): AppLocale {
  return preference === 'system' ? resolveDeviceLocale() : preference;
}

async function persist(values: StoredPreferences): Promise<void> {
  await writeJson(StorageKeys.preferences, values);
}

/**
 * Apply locale strings + direction flags (no reload — avoids wiping UI back to English).
 */
function applyLocale(locale: AppLocale): void {
  setI18nLocale(locale);
  syncLayoutDirection(locale);
}

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  localePreference: 'system',
  themePreference: 'system',
  locale: resolveDeviceLocale(),
  hydrated: false,

  hydrate: async () => {
    const parsed = await readJson<Partial<StoredPreferences>>(StorageKeys.preferences);

    if (parsed) {
      const localePreference = parsed.localePreference ?? 'system';
      const themePreference = parsed.themePreference ?? 'system';
      const locale = resolveLocale(localePreference);
      applyLocale(locale);
      set({ localePreference, themePreference, locale, hydrated: true });
      return;
    }

    const locale = resolveDeviceLocale();
    applyLocale(locale);
    set({ hydrated: true, locale });
  },

  setLocalePreference: async (localePreference) => {
    const locale = resolveLocale(localePreference);
    const themePreference = get().themePreference;
    await persist({ localePreference, themePreference });
    // Update React state first so all `useI18n()` subscribers re-render with Arabic/English.
    set({ localePreference, locale });
    applyLocale(locale);
  },

  setThemePreference: async (themePreference) => {
    const localePreference = get().localePreference;
    await persist({ localePreference, themePreference });
    set({ themePreference });
  },
}));
