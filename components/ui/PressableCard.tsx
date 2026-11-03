import { type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { depth, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useThemeColor } from '@/hooks/use-theme-color';

type PressableCardProps = {
  children: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

/**
 * Tappable card: same surface as `Card`, plus a tint + gentle squeeze on press.
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
  const pressedColor = useThemeColor({}, 'surfaceContainerLow');
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
        { borderColor, backgroundColor: state.pressed ? pressedColor : cardColor },
        depth(1, shadowColor),
        // Gentler squeeze than buttons: large cards shrinking 4% feels jumpy.
        { transform: [{ scale: state.pressed ? 0.98 : 1 }] },
        style,
      ]}>
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: TOUCH_TARGET,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    gap: Spacing.xs,
    justifyContent: 'center',
  },
});
