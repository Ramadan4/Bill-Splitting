/**
 * Web color-scheme hook.
 * Implemented here (not re-exported) to avoid a Metro platform resolve cycle:
 * `use-color-scheme.web.ts` → `@/hooks/use-color-scheme` → back to `.web.ts`.
 */
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { usePreferencesStore } from '@/store/preferencesStore';

export function useColorScheme(): 'light' | 'dark' {
  const preference = usePreferencesStore((state) => state.themePreference);
  const system = useSystemColorScheme();

  if (preference === 'light' || preference === 'dark') {
    return preference;
  }

  return system === 'dark' ? 'dark' : 'light';
}
