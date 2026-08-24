/**
 * Resolves a semantic theme color for the active light/dark scheme.
 */
import { Colors, type ThemeColorName } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColorName,
): string {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  // Allow one-off overrides when a screen needs a special color.
  if (colorFromProps) {
    return colorFromProps;
  }

  return Colors[theme][colorName];
}
