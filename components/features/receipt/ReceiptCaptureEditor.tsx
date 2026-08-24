import { ScrollView, StyleSheet, Text } from 'react-native';

import { ReceiptCaptureActions } from '@/components/features/receipt/ReceiptCaptureActions';
import { ReceiptPreview } from '@/components/features/receipt/ReceiptPreview';
import { Screen } from '@/components/ui/Screen';
import { useReceiptCapture } from '@/hooks/receipt/useReceiptCapture';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Receipt capture UI: take/select photo, preview, then continue to manual items.
 */
export function ReceiptCaptureEditor() {
  const {
    receiptImageUri,
    error,
    isBusy,
    takePhoto,
    chooseFromLibrary,
    clearPhoto,
    continueToItems,
  } = useReceiptCapture();

  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const dangerColor = useThemeColor({}, 'danger');

  return (
    <Screen style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: titleColor }]}>{t('receipt.title')}</Text>
        <Text style={[styles.description, { color: mutedColor }]}>
          {t('receipt.description')}
        </Text>

        {receiptImageUri ? <ReceiptPreview uri={receiptImageUri} /> : null}
        {error ? (
          <Text style={[styles.error, { color: dangerColor }]}>{t(error)}</Text>
        ) : null}

        <ReceiptCaptureActions
          hasPhoto={Boolean(receiptImageUri)}
          isBusy={isBusy}
          onTakePhoto={takePhoto}
          onChooseLibrary={chooseFromLibrary}
          onClear={clearPhoto}
          onContinue={continueToItems}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 16,
  },
  content: {
    gap: 14,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
  },
  error: {
    fontSize: 13,
  },
});
