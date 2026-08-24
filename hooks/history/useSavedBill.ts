/**
 * Read-only saved-bill summary + delete.
 */
import { useMemo } from 'react';
import { useRouter } from 'expo-router';

import { useHistoryStore } from '@/store/historyStore';
import { calculateBill } from '@/utils/calculations';

export function useSavedBill(billId: string | undefined) {
  const router = useRouter();
  const bills = useHistoryStore((state) => state.bills);
  const deleteBill = useHistoryStore((state) => state.deleteBill);

  const bill = useMemo(
    () => bills.find((entry) => entry.id === billId) ?? null,
    [bills, billId],
  );

  const result = useMemo(() => {
    if (!bill) {
      return null;
    }

    return calculateBill(bill);
  }, [bill]);

  const removeAndGoBack = async () => {
    if (!bill) {
      return;
    }

    await deleteBill(bill.id);
    router.replace('/history');
  };

  return {
    bill,
    result,
    removeAndGoBack,
  };
}
