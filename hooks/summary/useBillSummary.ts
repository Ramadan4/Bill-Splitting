/**
 * Summary screen logic: run calculateBill on the active draft.
 */
import { useMemo } from 'react';

import { useFinishBillFlow } from '@/hooks/bill/useFinishBillFlow';
import { useBillStore } from '@/store/billStore';
import { calculateBill } from '@/utils/calculations';

export function useBillSummary() {
  const bill = useBillStore((state) => state.bill);
  const { finishBill, finishError } = useFinishBillFlow();

  const result = useMemo(() => {
    if (!bill) {
      return null;
    }

    // Pure engine — safe to call during render via useMemo.
    return calculateBill(bill);
  }, [bill]);

  return {
    bill,
    result,
    finishBill,
    finishError,
  };
}
