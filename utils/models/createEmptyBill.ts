/**
 * Factory for a blank bill draft.
 * Why: every new flow must start with identical empty defaults.
 */
import type { Bill } from '@/types';
import { createId } from '@/utils/id';

export function createEmptyBill(): Bill {
  return {
    id: createId('bill'),
    createdAt: new Date().toISOString(),
    name: '',
    inputMethod: null,
    receiptImageUri: null,
    items: [],
    people: [],
    assignments: [],
    servicePercentage: 0,
    taxPercentage: 0,
    hasDelivery: false,
    deliveryCost: 0,
  };
}
