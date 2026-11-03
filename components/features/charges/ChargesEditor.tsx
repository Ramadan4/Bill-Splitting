import { StyleSheet, Text } from 'react-native';

import { ChargesForm } from '@/components/features/charges/ChargesForm';
import { KeyboardScreen } from '@/components/ui/KeyboardScreen';
import { useChargesEditor } from '@/hooks/charges/useChargesEditor';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Tax & service feature UI.
 * Both percentages apply on food subtotal and are split by each person's food share.
 */
export function ChargesEditor() {
  const { values, error, onChange, continueToSummary } = useChargesEditor();
  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <KeyboardScreen contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: titleColor }]}>{t('charges.title')}</Text>
      <Text style={[styles.description, { color: mutedColor }]}>
        {t('charges.description')}
      </Text>
      <ChargesForm
        values={values}
        error={error ? t(error) : null}
        onChange={onChange}
        onContinue={continueToSummary}
      />
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
  },
});
