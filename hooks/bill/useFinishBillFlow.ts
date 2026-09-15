/**
 * Clears the active bill and returns to Home after summary.
 * Persists the finished bill so it appears in history.
 */
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useBillStore } from '@/store/billStore';
import { useHistoryStore } from '@/store/historyStore';

export function useFinishBillFlow() {
  const router = useRouter();
  const resetBill = useBillStore((state) => state.resetBill);
  const saveBill = useHistoryStore((state) => state.saveBill);
  const [error, setError] = useState<string | null>(null);

  const finishBill = async () => {
    const bill = useBillStore.getState().bill;

    if (bill) {
      try {
        await saveBill(bill);
      } catch {
        // Storage write failed: keep the draft bill and let the user retry
        // instead of silently discarding it and navigating away.
        setError('errors.billSaveFailed');
        return;
      }
    }

    setError(null);
    resetBill();
    router.replace('/');
  };

  return { finishBill, finishError: error };
}
