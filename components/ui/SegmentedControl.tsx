import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { depth, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useThemeColor } from '@/hooks/use-theme-color';

export type SegmentOption<T extends string> = {
  value: T;
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
};

type SegmentedControlProps<T extends string> = {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

/**
 * iOS-style segmented picker: a recessed track with the selected segment raised.
 * Segments flow with `row`, so order mirrors automatically in RTL.
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const track = useThemeColor({}, 'surfaceContainer');
  const selectedBg = useThemeColor({}, 'card');
  const textColor = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const shadow = useThemeColor({}, 'shadow');
  const { trigger } = useHaptics();

  return (
    <View accessibilityRole="radiogroup" style={[styles.track, { backgroundColor: track }]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => {
              if (selected) {
                return;
              }
              trigger('light');
              onChange(option.value);
            }}
            style={[
              styles.segment,
              selected && { backgroundColor: selectedBg },
              selected && depth(1, shadow),
            ]}>
            {option.icon ? (
              <MaterialIcons name={option.icon} size={18} color={selected ? primary : muted} />
            ) : null}
            <Text
              numberOfLines={1}
              style={[styles.label, { color: selected ? textColor : muted }]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: Spacing.xs,
    borderRadius: Radius.md,
    gap: Spacing.xs,
  },
  segment: {
    flex: 1,
    minHeight: TOUCH_TARGET,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
