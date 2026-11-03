import { StyleSheet, Text } from 'react-native';
import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { SummaryBody } from '@/components/features/summary/SummaryBody';
import { ActionDock } from '@/components/ui/ActionDock';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { Modal } from '@/components/ui/Modal';
import { Screen } from '@/components/ui/Screen';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { useSavedBill } from '@/hooks/history/useSavedBill';
import { useShareBill } from '@/hooks/share/useShareBill';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Read-only saved bill with WhatsApp share + delete.
 */
export function HistoryDetail() {
  const { id: rawId } = useLocalSearchParams<{ id: string | string[] }>();
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { bill, result, removeAndGoBack } = useSavedBill(id);
  const { shareBill, isSharing, error: shareError } = useShareBill();
  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!bill || !result) {
    return (
      <Screen>
        <Text style={[styles.title, { color: titleColor }]}>{t('history.missingTitle')}</Text>
        <Text style={[styles.description, { color: mutedColor }]}>
          {t('history.missingDescription')}
        </Text>
      </Screen>
    );
  }

  return (
    <>
      <SummaryBody
        title={bill.name.trim() || t('history.untitled')}
        description={t('summary.description')}
        result={result}
        footer={
          <ActionDock>
            <ErrorBanner message={shareError ? t(shareError) : null} />
            <SecondaryButton
              label={t('summary.shareWhatsApp')} icon="share"
              disabled={isSharing}
              onPress={() => void shareBill(bill, result)}
            />
            <SecondaryButton
              label={t('history.deleteBill')} icon="delete-outline"
              tone="danger"
              onPress={() => setConfirmDelete(true)}
            />
          </ActionDock>
        }
      />
      <Modal
        visible={confirmDelete}
        title={t('common.confirmTitle')}
        message={t('common.confirmDeleteBill')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        tone="danger"
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          void removeAndGoBack();
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
  },
});
