import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type PressableProps,
  type ViewStyle,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { CTA_HEIGHT, PRESS_SCALE, Radius, Spacing } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

type ButtonProps = PressableProps & {
  label: string;
  variant?: ButtonVariant;
  /** Optional leading glyph (mirrors position automatically in RTL). */
  icon?: keyof typeof MaterialIcons.glyphMap;
};

/**
 * Colored glow under the primary pill: a shadow tinted with the brand color
 * reads as "lit" rather than "floating", which is the current CTA trend.
 * Android elevation can't tint, so it falls back to a normal elevation.
 */
function glow(color: string): ViewStyle {
  return Platform.select<ViewStyle>({
    android: { elevation: 4 },
    default: {
      shadowColor: color,
      shadowOpacity: 0.35,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
    },
  }) as ViewStyle;
}

/**
 * Shared CTA atom.
 * - primary:   vivid brand pill + brand glow
 * - secondary: soft tonal fill (lighter than an outline box)
 * - danger:    soft red tint so destructive actions stand out without shouting
 * Meets the 44dp touch minimum and answers every press with a squeeze + haptic.
 */
export function Button({
  label,
  variant = 'primary',
  icon,
  style,
  disabled,
  onPress,
  ...rest
}: ButtonProps) {
  const brand = useThemeColor({}, 'brand');
  const onBrand = useThemeColor({}, 'onBrand');
  const tonal = useThemeColor({}, 'surfaceContainer');
  const textColor = useThemeColor({}, 'text');
  const danger = useThemeColor({}, 'danger');
  const dangerContainer = useThemeColor({}, 'dangerContainer');
  const { trigger } = useHaptics();

  const palette = {
    primary: { bg: brand, fg: onBrand },
    secondary: { bg: tonal, fg: textColor },
    danger: { bg: dangerContainer, fg: danger },
  }[variant];

  const handlePress = (event: GestureResponderEvent) => {
    trigger(variant === 'danger' ? 'warning' : 'light');
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
        { backgroundColor: palette.bg },
        variant === 'primary' && !disabled ? glow(brand) : null,
        {
          opacity: disabled ? 0.45 : state.pressed ? 0.9 : 1,
          transform: [{ scale: state.pressed && !disabled ? PRESS_SCALE : 1 }],
        },
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {icon ? <MaterialIcons name={icon} size={20} color={palette.fg} /> : null}
      <Text style={[styles.label, { color: palette.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: CTA_HEIGHT,
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontWeight: '700',
    fontSize: 16,
  },
});
