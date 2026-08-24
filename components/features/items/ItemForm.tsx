import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { TextField } from '@/components/ui/TextField';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

export type ItemFormValues = {
  name: string;
  price: string;
  quantity: string;
};

type ItemFormProps = {
  values: ItemFormValues;
  error: string | null;
  submitLabel: string;
  onChange: (patch: Partial<ItemFormValues>) => void;
  onSubmit: () => void;
  onCancel?: () => void;
};

/**
 * Presentational form for creating/editing one bill item.
 * Parsing + store writes live in useItemsEditor — this file is UI only.
 */
export function ItemForm({
  values,
  error,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: ItemFormProps) {
  const { t } = useI18n();
  const dangerColor = useThemeColor({}, 'danger');

  return (
    <View style={styles.form}>
      <TextField
        label={t('items.nameLabel')}
        value={values.name}
        onChangeText={(name) => onChange({ name })}
        placeholder={t('items.namePlaceholder')}
        autoCapitalize="sentences"
        returnKeyType="next"
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <TextField
            label={t('items.priceLabel')}
            value={values.price}
            onChangeText={(price) => onChange({ price })}
            placeholder="0"
            keyboardType="decimal-pad"
          />
        </View>
        <View style={styles.half}>
          <TextField
            label={t('items.quantityLabel')}
            value={values.quantity}
            onChangeText={(quantity) => onChange({ quantity })}
            placeholder="1"
            keyboardType="decimal-pad"
          />
        </View>
      </View>
      {error ? <Text style={[styles.error, { color: dangerColor }]}>{error}</Text> : null}
      <View style={styles.actions}>
        <PrimaryButton label={submitLabel} onPress={onSubmit} style={styles.flex} />
        {onCancel ? (
          <SecondaryButton label={t('common.cancel')} onPress={onCancel} style={styles.flex} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  half: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
  error: {
    fontSize: 13,
  },
});
