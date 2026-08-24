import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

export type BadgeTone = 'neutral' | 'success' | 'danger' | 'info';

type BadgeProps = {
  label: string;
  tone?: BadgeTone;
};

/**
 * Compact status pill (assignment state, balance state).
 * Tinted background is derived from the tone color at low opacity so it stays
 * readable on both the light zinc and dark slate surfaces.
 */
export function Badge({ label, tone = 'neutral' }: BadgeProps) {
  const muted = useThemeColor({}, 'muted');
  const success = useThemeColor({}, 'success');
  const danger = useThemeColor({}, 'danger');
  const info = useThemeColor({}, 'primary');
  const border = useThemeColor({}, 'border');

  const color = { neutral: muted, success, danger, info }[tone];

  return (
    <View style={[styles.badge, { borderColor: tone === 'neutral' ? border : color }]}>
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
  },
});
