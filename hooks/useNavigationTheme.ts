/**
 * Navigation theme + shared stack header options derived from SplitEat tokens.
 *
 * Why: without a ThemeProvider the native stack keeps its default white header
 * and screen background, so dark mode (and in-app theme overrides) would only
 * recolor our own views while headers and transitions flashed white.
 */
import { useMemo } from 'react';
import { DarkTheme, DefaultTheme, type Theme } from 'expo-router';

import { renderAppHeader } from '@/components/ui/AppHeader';
import { Colors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** React Navigation theme mapped from the active palette. */
export function useNavigationTheme(): Theme {
  const scheme = useColorScheme();

  return useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
    const palette = Colors[scheme];

    return {
      ...base,
      dark: scheme === 'dark',
      colors: {
        ...base.colors,
        primary: palette.primary,
        background: palette.background,
        // Headers sit on the page color so they blend into the screen (modern flat header).
        card: palette.background,
        text: palette.text,
        border: palette.border,
        notification: palette.tertiary,
      },
    };
  }, [scheme]);
}

/**
 * Stack defaults shared by every navigator so all screens get the same header:
 * our JS `AppHeader` (round back button, RTL-aware) instead of the native bar.
 */
export const stackScreenOptions = {
  header: renderAppHeader,
  // Must be explicit: when unset, the native stack falls back to the iOS 26
  // system (Liquid Glass) appearance, which is transparent and lets screen
  // content slide underneath the header.
  headerTransparent: false,
} as const;
