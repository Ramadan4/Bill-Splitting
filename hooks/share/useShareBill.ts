/**
 * Share the active/saved bill summary through WhatsApp.
 */
import { useState } from 'react';

import { useI18n } from '@/hooks/use-i18n';
import type { Bill, BillCalculationResult } from '@/types';
import { formatBillShareMessage } from '@/utils/share/formatBillShareMessage';
import { shareViaWhatsApp } from '@/utils/share/shareViaWhatsApp';

export function useShareBill() {
  const { t, locale } = useI18n();
  const [isSharing, setIsSharing] = useState(false);
  /** i18n error key when share fails completely. */
  const [error, setError] = useState<string | null>(null);

  const shareBill = async (bill: Bill, result: BillCalculationResult) => {
    setIsSharing(true);
    setError(null);

    try {
      const message = formatBillShareMessage(
        bill,
        result,
        {
          appName: t('home.brand'),
          foodSubtotal: t('summary.foodSubtotal'),
          service: t('summary.service'),
          tax: t('summary.tax'),
          delivery: t('summary.delivery'),
          grandTotal: t('summary.grandTotal'),
          perPerson: t('summary.perPerson', { count: result.people.length }),
          food: t('summary.food'),
          total: t('summary.total'),
          untitled: t('history.untitled'),
        },
        locale,
      );

      await shareViaWhatsApp(message);
    } catch {
      setError('errors.shareFailed');
    } finally {
      setIsSharing(false);
    }
  };

  return {
    shareBill,
    isSharing,
    error,
  };
}
