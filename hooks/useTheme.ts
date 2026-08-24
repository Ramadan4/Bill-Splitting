/**
 * Resolves palette + scheme for the active theme preference.
 */
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();

  return {
    scheme,
    colors: Colors[scheme],
  };
}

export { useThemeColor } from '@/hooks/use-theme-color';
