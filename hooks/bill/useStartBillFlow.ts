/**
 * Starts a fresh bill session and opens the create step.
 * Keeps HomeScreen free of store + navigation wiring.
 */
import { useRouter } from 'expo-router';

import { useBillStore } from '@/store/billStore';

export function useStartBillFlow() {
  const router = useRouter();
  const startNewBill = useBillStore((state) => state.startNewBill);

  const startBill = () => {
    // Reset draft first so create never inherits a previous session.
    startNewBill();
    router.push('/bill/create');
  };

  return { startBill };
}
