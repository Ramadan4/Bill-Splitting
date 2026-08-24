/**
 * Fill missing fields when reading older persisted bills.
 */
import type { Bill } from '@/types';

export function normalizeBill(raw: Partial<Bill> & Pick<Bill, 'id'>): Bill {
  return {
    id: raw.id,
    createdAt: raw.createdAt ?? new Date().toISOString(),
    name: raw.name ?? '',
    inputMethod: raw.inputMethod ?? null,
    receiptImageUri: raw.receiptImageUri ?? null,
    items: raw.items ?? [],
    people: raw.people ?? [],
    assignments: raw.assignments ?? [],
    servicePercentage: raw.servicePercentage ?? 0,
    taxPercentage: raw.taxPercentage ?? 0,
    hasDelivery: raw.hasDelivery ?? false,
    deliveryCost: raw.deliveryCost ?? 0,
  };
}
