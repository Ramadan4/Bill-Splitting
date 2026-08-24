import { type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

type ActionDockProps = {
  children: ReactNode;
};

/**
 * Bottom-anchored container for a screen's primary actions.
 * Keeps high-frequency CTAs inside the thumb-reach zone; the hairline divider
 * separates them from scrolling content above.
 */
export function ActionDock({ children }: ActionDockProps) {
  const borderColor = useThemeColor({}, 'border');

  return <View style={[styles.dock, { borderTopColor: borderColor }]}>{children}</View>;
}

const styles = StyleSheet.create({
  dock: {
    marginTop: 'auto',
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: Spacing.sm,
  },
});
