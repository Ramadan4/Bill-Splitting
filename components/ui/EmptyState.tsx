import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

type EmptyStateProps = {
  title: string;
  description?: string;
};

/**
 * Friendly placeholder for empty lists.
 * Dashed border signals "nothing here yet" without looking like a broken card.
 */
export function EmptyState({ title, description }: EmptyStateProps) {
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const borderColor = useThemeColor({}, 'border');

  return (
    <View style={[styles.wrap, { borderColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      {description ? (
        <Text style={[styles.description, { color: mutedColor }]}>{description}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
