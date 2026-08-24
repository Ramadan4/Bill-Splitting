import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { TextField } from '@/components/ui/TextField';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

export type PersonFormValues = {
  name: string;
};

type PersonFormProps = {
  values: PersonFormValues;
  error: string | null;
  submitLabel: string;
  onChange: (patch: Partial<PersonFormValues>) => void;
  onSubmit: () => void;
  onCancel?: () => void;
};

/**
 * Presentational form for creating/editing one person.
 * Parsing + store writes live in usePeopleEditor — this file is UI only.
 */
export function PersonForm({
  values,
  error,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: PersonFormProps) {
  const { t } = useI18n();
  const dangerColor = useThemeColor({}, 'danger');

  return (
    <View style={styles.form}>
      <TextField
        label={t('people.nameLabel')}
        value={values.name}
        onChangeText={(name) => onChange({ name })}
        placeholder={t('people.namePlaceholder')}
        autoCapitalize="words"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
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
