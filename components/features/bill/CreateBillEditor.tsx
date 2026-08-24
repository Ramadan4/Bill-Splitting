import { StyleSheet, Text } from 'react-native';

import { KeyboardScreen } from '@/components/ui/KeyboardScreen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { TextField } from '@/components/ui/TextField';
import { useCreateBill } from '@/hooks/bill/useCreateBill';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Create-step UI: name the bill before choosing how to enter items.
 */
export function CreateBillEditor() {
  const { name, error, onChangeName, continueToInputMethod } = useCreateBill();
  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <KeyboardScreen contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: titleColor }]}>{t('create.title')}</Text>
      <Text style={[styles.description, { color: mutedColor }]}>
        {t('create.description')}
      </Text>
      <TextField
        label={t('create.nameLabel')}
        value={name}
        onChangeText={onChangeName}
        placeholder={t('create.namePlaceholder')}
        autoCapitalize="sentences"
        returnKeyType="done"
        onSubmitEditing={continueToInputMethod}
        error={error ? t(error) : null}
      />
      <PrimaryButton label={t('common.continue')} onPress={continueToInputMethod} />
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
  },
});
