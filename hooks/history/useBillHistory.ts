/**
 * History list: hydrate + delete + open a saved bill.
 */
import { useRouter } from 'expo-router';

import { EMPTY_HISTORY, useHistoryStore } from '@/store/historyStore';

export function useBillHistory() {
  const router = useRouter();
  const bills = useHistoryStore((state) => state.bills);
  const hydrated = useHistoryStore((state) => state.hydrated);
  const deleteBill = useHistoryStore((state) => state.deleteBill);

  const openBill = (billId: string) => {
    router.push(`/history/${billId}`);
  };

  return {
    bills: bills ?? EMPTY_HISTORY,
    // Drives skeletons while AsyncStorage is still being read.
    isLoading: !hydrated,
    deleteBill,
    openBill,
  };
}
