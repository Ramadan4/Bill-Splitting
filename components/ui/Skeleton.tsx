import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Radius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

type SkeletonProps = {
  height?: number;
  width?: number | `${number}%`;
  style?: StyleProp<ViewStyle>;
};

/**
 * Shimmering placeholder block.
 * Context-aware skeletons replace full-screen spinners so the layout does not
 * jump when persisted data finishes hydrating.
 */
export function Skeleton({ height = 16, width = '100%', style }: SkeletonProps) {
  const skeletonColor = useThemeColor({}, 'skeleton');
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );

    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { height, width, backgroundColor: skeletonColor, opacity: pulse },
        styles.block,
        style,
      ]}
    />
  );
}

type SkeletonCardProps = {
  /** How many placeholder rows to render. */
  count?: number;
};

/** Stack of card-shaped skeletons matching the list rows they stand in for. */
export function SkeletonList({ count = 3 }: SkeletonCardProps) {
  const borderColor = useThemeColor({}, 'border');

  return (
    <View style={styles.list}>
      {Array.from({ length: count }, (_, index) => (
        <View key={index} style={[styles.row, { borderColor }]}>
          <Skeleton width="60%" height={18} />
          <Skeleton width="35%" height={13} />
          <Skeleton width="45%" height={15} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    borderRadius: Radius.sm,
  },
  list: {
    gap: Spacing.md,
  },
  row: {
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
});
