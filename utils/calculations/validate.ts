import type { Bill } from '@/types';

import { getAssignedQuantityForItem } from '@/utils/calculations/items';
import { roundMoney } from '@/utils/calculations/money';

export type BillValidationIssue = {
  code:
    | 'NO_PEOPLE'
    | 'NO_ITEMS'
    | 'OVER_ASSIGNED'
    | 'UNDER_ASSIGNED'
    | 'NEGATIVE_VALUE';
  message: string;
  itemId?: string;
};

/**
 * Structural checks for a bill draft.
 * Does not block calculateBill — callers can still compute partial splits —
 * but issues explain why `isBalanced` may be false.
 */
export function validateBill(bill: Bill): BillValidationIssue[] {
  const issues: BillValidationIssue[] = [];

  if (bill.people.length === 0) {
    issues.push({ code: 'NO_PEOPLE', message: 'Add at least one person.' });
  }

  if (bill.items.length === 0) {
    issues.push({ code: 'NO_ITEMS', message: 'Add at least one item.' });
  }

  if (bill.servicePercentage < 0 || bill.taxPercentage < 0) {
    issues.push({
      code: 'NEGATIVE_VALUE',
      message: 'Service and tax percentages cannot be negative.',
    });
  }

  for (const item of bill.items) {
    if (item.price < 0 || item.quantity < 0) {
      issues.push({
        code: 'NEGATIVE_VALUE',
        message: `Item "${item.name}" has a negative price or quantity.`,
        itemId: item.id,
      });
    }

    const assigned = getAssignedQuantityForItem(bill.assignments, item.id);
    const assignedRounded = roundMoney(assigned);
    const quantityRounded = roundMoney(item.quantity);

    // Tiny float slack so 1/3+1/3+1/3 does not false-trigger over-assign.
    if (assignedRounded > quantityRounded + 0.0001) {
      issues.push({
        code: 'OVER_ASSIGNED',
        message: `Assigned quantity for "${item.name}" exceeds ${item.quantity}.`,
        itemId: item.id,
      });
    } else if (assignedRounded + 0.0001 < quantityRounded) {
      issues.push({
        code: 'UNDER_ASSIGNED',
        message: `Item "${item.name}" is not fully assigned.`,
        itemId: item.id,
      });
    }
  }

  return issues;
}
