import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { useI18n } from '@/hooks/use-i18n';

type ReceiptCaptureActionsProps = {
  hasPhoto: boolean;
  isBusy: boolean;
  onTakePhoto: () => void;
  onChooseLibrary: () => void;
  onClear: () => void;
  onContinue: () => void;
};

/**
 * Action buttons for receipt capture (camera / gallery / clear / continue).
 */
export function ReceiptCaptureActions({
  hasPhoto,
  isBusy,
  onTakePhoto,
  onChooseLibrary,
  onClear,
  onContinue,
}: ReceiptCaptureActionsProps) {
  const { t } = useI18n();

  return (
    <View style={styles.wrap}>
      <PrimaryButton
        label={isBusy ? t('common.opening') : t('receipt.takePhoto')}
        onPress={onTakePhoto}
        disabled={isBusy}
      />
      <SecondaryButton
        label={t('receipt.chooseGallery')}
        onPress={onChooseLibrary}
        disabled={isBusy}
      />
      {hasPhoto ? (
        <SecondaryButton
          label={t('receipt.removePhoto')}
          tone="danger"
          onPress={onClear}
          disabled={isBusy}
        />
      ) : null}
      <PrimaryButton
        label={hasPhoto ? t('receipt.continueItems') : t('receipt.skipManual')}
        onPress={onContinue}
        disabled={isBusy}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
    marginTop: 'auto',
  },
});
