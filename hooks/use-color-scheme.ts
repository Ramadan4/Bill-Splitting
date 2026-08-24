/**
 * Color scheme that respects in-app theme preference (system / light / dark).
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
