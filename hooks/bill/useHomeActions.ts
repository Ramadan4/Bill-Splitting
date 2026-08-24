/**
 * Home actions: new bill + shortcuts to history and groups.
 */
import { useRouter } from 'expo-router';

import { useBillStore } from '@/store/billStore';

export function useHomeActions() {
  const router = useRouter();
  const startNewBill = useBillStore((state) => state.startNewBill);

  const startBill = () => {
    startNewBill();
    router.push('/bill/create');
  };

  const openHistory = () => {
    router.push('/history');
  };

  const openGroups = () => {
    router.push('/groups');
  };

  return { startBill, openHistory, openGroups };
}
