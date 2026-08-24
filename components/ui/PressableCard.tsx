import { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { depth, PRESS_SCALE, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useThemeColor } from '@/hooks/use-theme-color';

type PressableCardProps = {
  children: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Tappable bento tile: same surface treatment as `Card` plus press feedback.
 * Used for navigation tiles and selectable options.
 */
export function PressableCard({
  children,
  onPress,
  accessibilityLabel,
  style,
}: PressableCardProps) {
  const borderColor = useThemeColor({}, 'border');
  const cardColor = useThemeColor({}, 'card');
  const shadowColor = useThemeColor({}, 'shadow');
  const { trigger } = useHaptics();

  const handlePress = (event: GestureResponderEvent) => {
    trigger('light');
    onPress(event);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={handlePress}
      style={(state) => [
        styles.card,
        { borderColor, backgroundColor: cardColor },
        depth(1, shadowColor),
        { transform: [{ scale: state.pressed ? PRESS_SCALE : 1 }] },
        style,
      ]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: TOUCH_TARGET,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
    justifyContent: 'center',
  },
});
