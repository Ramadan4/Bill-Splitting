import { StyleSheet, Text } from 'react-native';

import { ActionDock } from '@/components/ui/ActionDock';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { SummaryBody } from '@/components/features/summary/SummaryBody';
import { useShareBill } from '@/hooks/share/useShareBill';
import { useBillSummary } from '@/hooks/summary/useBillSummary';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Final summary UI: bill totals + per-person breakdown + WhatsApp share + done.
 */
export function SummaryView() {
  const { bill, result, finishBill, finishError } = useBillSummary();
  const { shareBill, isSharing, error: shareError } = useShareBill();
  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  if (!bill || !result) {
    return (
      <Screen>
        <Text style={[styles.title, { color: titleColor }]}>{t('summary.noBillTitle')}</Text>
        <Text style={[styles.description, { color: mutedColor }]}>
          {t('summary.noBillDescription')}
        </Text>
        <PrimaryButton label={t('summary.backHome')} onPress={() => void finishBill()} />
      </Screen>
    );
  }

  const title = bill.name.trim() ? bill.name : t('summary.title');

  return (
    <SummaryBody
      title={title}
      description={t('summary.description')}
      result={result}
      footer={
        <ActionDock>
          <ErrorBanner message={finishError ? t(finishError) : shareError ? t(shareError) : null} />
          <PrimaryButton
            label={t('summary.shareWhatsApp')}
            disabled={isSharing}
            onPress={() => void shareBill(bill, result)}
          />
          <SecondaryButton label={t('summary.done')} onPress={() => void finishBill()} />
        </ActionDock>
      }
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
  },
});
