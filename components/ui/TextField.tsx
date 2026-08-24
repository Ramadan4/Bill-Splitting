import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';

import { Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';

type TextFieldProps = TextInputProps & {
  label: string;
  error?: string | null;
};

/**
 * Shared labeled text input (theme-aware).
 * Number pads set a Done return key; the screen also shows a dismiss bar.
 */
const NUMBER_PADS = new Set<NonNullable<TextInputProps['keyboardType']>>([
  'numeric',
  'number-pad',
  'decimal-pad',
  'phone-pad',
]);

export function TextField({ label, error, style, keyboardType, ...rest }: TextFieldProps) {
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const borderColor = useThemeColor({}, 'border');
  const cardColor = useThemeColor({}, 'card');
  const errorColor = useThemeColor({}, 'danger');
  const usesNumberPad = keyboardType != null && NUMBER_PADS.has(keyboardType);

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: mutedColor }]} numberOfLines={1}>
        {label}
      </Text>
      <TextInput
        placeholderTextColor={mutedColor}
        {...rest}
        keyboardType={keyboardType}
        returnKeyType={usesNumberPad ? 'done' : rest.returnKeyType}
        onSubmitEditing={(event) => {
          rest.onSubmitEditing?.(event);
          if (usesNumberPad) {
            Keyboard.dismiss();
          }
        }}
        style={[
          styles.input,
          {
            color: textColor,
            borderColor: error ? errorColor : borderColor,
            backgroundColor: cardColor,
          },
          style,
        ]}
      />
      {error ? <Text style={[styles.error, { color: errorColor }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.xs + 2,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    minHeight: TOUCH_TARGET,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: 16,
  },
  error: {
    fontSize: 12,
  },
});
