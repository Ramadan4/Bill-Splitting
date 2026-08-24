import { Keyboard, Pressable, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '@/hooks/use-i18n';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Bar above the keyboard so the user can dismiss it (number pads have no return key).
 * Rendered inside KeyboardAvoidingView so it sits just above the keyboard.
 */
export function KeyboardDoneBar() {
  const visible = useKeyboardVisible();
  const { t } = useI18n();
  const textColor = useThemeColor({}, 'tint');
  const barColor = useThemeColor({}, 'card');
  const borderColor = useThemeColor({}, 'border');

  if (!visible) {
    return null;
  }

  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: barColor, borderTopColor: borderColor },
      ]}>
      <Pressable
        accessibilityRole="button"
        onPress={() => Keyboard.dismiss()}
        hitSlop={8}>
        <Text style={[styles.label, { color: textColor }]}>
          {t('common.dismissKeyboard')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 4,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
});
