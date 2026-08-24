import { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { depth, Radius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

type CardProps = {
  children: ReactNode;
  /** 0 = flat, 1 = resting bento tile, 2 = focused/primary tile. */
  level?: 0 | 1 | 2;
  style?: StyleProp<ViewStyle>;
};

/**
 * Bento-grid surface: soft dynamic border, generous padding, depth elevation.
 * Atomic and stateless — feature layouts compose these into grids.
 */
export function Card({ children, level = 1, style }: CardProps) {
  const borderColor = useThemeColor({}, 'border');
  const cardColor = useThemeColor({}, 'card');
  const surfaceColor = useThemeColor({}, 'surface');
  const shadowColor = useThemeColor({}, 'shadow');

  return (
    <View
      style={[
        styles.card,
        { borderColor, backgroundColor: level === 2 ? surfaceColor : cardColor },
        depth(level, shadowColor),
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
});
