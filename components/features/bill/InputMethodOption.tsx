import { StyleSheet, Text } from 'react-native';

import { PressableCard } from '@/components/ui/PressableCard';
import { useThemeColor } from '@/hooks/use-theme-color';

type InputMethodOptionProps = {
  title: string;
  body: string;
  onPress: () => void;
};

/**
 * Feature UI: one selectable input-method card (manual vs receipt).
 */
export function InputMethodOption({ title, body, onPress }: InputMethodOptionProps) {
  const titleColor = useThemeColor({}, 'text');
  const bodyColor = useThemeColor({}, 'muted');

  return (
    <PressableCard onPress={onPress} accessibilityLabel={title}>
      <Text style={[styles.title, { color: titleColor }]} numberOfLines={2}>
        {title}
      </Text>
      <Text style={[styles.body, { color: bodyColor }]}>{body}</Text>
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
});
