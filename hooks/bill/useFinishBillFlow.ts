/**
 * Clears the active bill and returns to Home after summary.
 * Persists the finished bill so it appears in history.
 */
import { useRouter } from 'expo-router';

import { useBillStore } from '@/store/billStore';
import { useHistoryStore } from '@/store/historyStore';

export function useFinishBillFlow() {
  const router = useRouter();
  const resetBill = useBillStore((state) => state.resetBill);
  const saveBill = useHistoryStore((state) => state.saveBill);

  const finishBill = async () => {
    const bill = useBillStore.getState().bill;
    if (bill) {
      await saveBill(bill);
    }

    resetBill();
    router.replace('/');
  };

  return { finishBill };
}
