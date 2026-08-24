import { StyleSheet, View } from 'react-native';

import { InputMethodOption } from '@/components/features/bill/InputMethodOption';
import { FlowScreen } from '@/components/ui/FlowScreen';
import { Spacing } from '@/constants/layout';
import { useSelectInputMethod } from '@/hooks/bill/useSelectInputMethod';
import { useI18n } from '@/hooks/use-i18n';

/**
 * Choose how items enter the bill (manual vs receipt reference photo).
 */
export default function InputMethodScreen() {
  const { selectMethod } = useSelectInputMethod();
  const { t } = useI18n();

  return (
    <FlowScreen
      title={t('inputMethod.title')}
      description={t('inputMethod.description')}>
      <View style={styles.actions}>
        <InputMethodOption
          title={t('inputMethod.manualTitle')}
          body={t('inputMethod.manualBody')}
          onPress={() => selectMethod('manual')}
        />
        <InputMethodOption
          title={t('inputMethod.receiptTitle')}
          body={t('inputMethod.receiptBody')}
          onPress={() => selectMethod('receipt')}
        />
      </View>
    </FlowScreen>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
});
