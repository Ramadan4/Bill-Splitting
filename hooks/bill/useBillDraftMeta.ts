/**
 * Read-only bill draft snapshots for placeholder screens.
 * Avoids repeating store selectors inside every route file.
 */
import { useBillStore } from '@/store/billStore';

export function useBillDraftMeta() {
  const itemCount = useBillStore((state) => state.bill?.items.length ?? 0);
  const peopleCount = useBillStore((state) => state.bill?.people.length ?? 0);
  const assignmentCount = useBillStore((state) => state.bill?.assignments.length ?? 0);
  const inputMethod = useBillStore((state) => state.bill?.inputMethod ?? null);
  const servicePercentage = useBillStore((state) => state.bill?.servicePercentage ?? 0);
  const taxPercentage = useBillStore((state) => state.bill?.taxPercentage ?? 0);
  const hasBill = useBillStore((state) => state.bill !== null);

  return {
    hasBill,
    itemCount,
    peopleCount,
    assignmentCount,
    inputMethod,
    servicePercentage,
    taxPercentage,
  };
}
