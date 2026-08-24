import { StyleSheet, Text, View } from 'react-native';

import { Radius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

type ErrorBannerProps = {
  message: string | null;
};

/**
 * Non-blocking inline error strip.
 * Renders nothing when there is no message so callers can drop it inline
 * without conditional wrappers.
 */
export function ErrorBanner({ message }: ErrorBannerProps) {
  const dangerColor = useThemeColor({}, 'danger');

  if (!message) {
    return null;
  }

  return (
    <View
      accessibilityRole="alert"
      style={[styles.banner, { borderColor: dangerColor }]}>
      <Text style={[styles.text, { color: dangerColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
  },
});
