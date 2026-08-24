import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { PRESS_SCALE, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import type { ChargesFormValues } from '@/hooks/charges/useChargesEditor';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

type ChargesFormProps = {
  values: ChargesFormValues;
  error: string | null;
  onChange: (patch: Partial<ChargesFormValues>) => void;
  onContinue: () => void;
};

/**
 * Presentational tax/service % form plus optional delivery cost.
 */
export function ChargesForm({ values, error, onChange, onContinue }: ChargesFormProps) {
  const { t } = useI18n();
  const { trigger } = useHaptics();
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({}, 'border');
  const cardColor = useThemeColor({}, 'card');
  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');

  return (
    <View style={styles.form}>
      <TextField
        label={t('charges.serviceLabel')}
        value={values.servicePercentage}
        onChangeText={(servicePercentage) => onChange({ servicePercentage })}
        placeholder={t('charges.servicePlaceholder')}
        keyboardType="decimal-pad"
      />
      <TextField
        label={t('charges.taxLabel')}
        value={values.taxPercentage}
        onChangeText={(taxPercentage) => onChange({ taxPercentage })}
        placeholder={t('charges.taxPlaceholder')}
        keyboardType="decimal-pad"
      />

      <Pressable
        accessibilityRole="switch"
        accessibilityState={{ checked: values.hasDelivery }}
        onPress={() => {
          trigger('light');
          onChange({ hasDelivery: !values.hasDelivery });
        }}
        style={({ pressed }) => [
          styles.toggle,
          {
            borderColor: values.hasDelivery ? primary : borderColor,
            backgroundColor: values.hasDelivery ? primary : cardColor,
            transform: [{ scale: pressed ? PRESS_SCALE : 1 }],
          },
        ]}>
        <Text
          numberOfLines={1}
          style={{ color: values.hasDelivery ? onPrimary : textColor, fontWeight: '600' }}>
          {values.hasDelivery ? t('charges.deliveryOn') : t('charges.deliveryOff')}
        </Text>
      </Pressable>

      {values.hasDelivery ? (
        <TextField
          label={t('charges.deliveryLabel')}
          value={values.deliveryCost}
          onChangeText={(deliveryCost) => onChange({ deliveryCost })}
          placeholder={t('charges.deliveryPlaceholder')}
          keyboardType="decimal-pad"
        />
      ) : null}

      <ErrorBanner message={error} />
      <PrimaryButton label={t('charges.calculate')} onPress={onContinue} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.md,
  },
  toggle: {
    minHeight: TOUCH_TARGET,
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
