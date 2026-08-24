import {
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type PressableProps,
} from 'react-native';

import { depth, PRESS_SCALE, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
};

/**
 * Shared CTA atom (primary fill, outline, or destructive outline).
 * Meets the 44dp touch minimum and answers every press with a scale squeeze
 * plus haptic so the tap registers before navigation happens.
 */
export function Button({
  label,
  variant = 'primary',
  style,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const backgroundColor = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const dangerColor = useThemeColor({}, 'danger');
  const shadowColor = useThemeColor({}, 'shadow');
  const { trigger } = useHaptics();

  const isPrimary = variant === 'primary';
  const isDanger = variant === 'danger';

  const handlePress = (event: GestureResponderEvent) => {
    trigger(isDanger ? 'warning' : 'light');
    onPress?.(event);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(disabled) }}
      disabled={disabled}
      onPress={handlePress}
      style={(state) => [
        styles.button,
        isPrimary
          ? { backgroundColor, borderWidth: 0 }
          : {
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: isDanger ? dangerColor : borderColor,
            },
        isPrimary ? depth(disabled ? 0 : 1, shadowColor) : null,
        {
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: state.pressed && !disabled ? PRESS_SCALE : 1 }],
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      <Text
        style={[
          styles.label,
          {
            color: isPrimary ? onPrimary : isDanger ? dangerColor : textColor,
            fontSize: isPrimary ? 16 : 15,
          },
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: TOUCH_TARGET,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '600',
  },
});
