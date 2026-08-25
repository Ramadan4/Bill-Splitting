import { ScrollView, StyleSheet, Text } from 'react-native';

import { ReceiptCaptureActions } from '@/components/features/receipt/ReceiptCaptureActions';
import { ReceiptPreview } from '@/components/features/receipt/ReceiptPreview';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Screen } from '@/components/ui/Screen';
import { Spacing } from '@/constants/layout';
import { useReceiptCapture } from '@/hooks/receipt/useReceiptCapture';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Receipt capture UI: take/select photo, run OCR, then continue to review items.
 */
export function ReceiptCaptureEditor() {
  const {
    receiptImageUri,
    error,
    isBusy,
    extractedCount,
    takePhoto,
    chooseFromLibrary,
    clearPhoto,
    continueToItems,
  } = useReceiptCapture();

  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const successColor = useThemeColor({}, 'success');

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: titleColor }]}>{t('receipt.title')}</Text>
        <Text style={[styles.description, { color: mutedColor }]}>
          {t('receipt.description')}
        </Text>

        {receiptImageUri ? <ReceiptPreview uri={receiptImageUri} /> : null}

        {isBusy ? (
          <Text style={[styles.status, { color: mutedColor }]}>{t('receipt.extracting')}</Text>
        ) : null}

        {extractedCount > 0 ? (
          <Text style={[styles.status, { color: successColor }]}>
            {t('receipt.extractedCount', { count: extractedCount })}
          </Text>
        ) : null}

        <ErrorBanner message={error ? t(error) : null} />

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
  content: {
    gap: Spacing.md,
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
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
});
