/**
 * Pure helpers for assignment quantities (no React).
 * Used by the assign screen and unit tests.
 */
import type { BillItem, ItemAssignment, Person } from '@/types';
import { getAssignedQuantityForItem, roundMoney } from '@/utils/calculations';

export type ItemAssignmentStatus = 'complete' | 'under' | 'over' | 'empty';

/** How much of an item is still unassigned (negative if over-assigned). */
export function getRemainingQuantity(
  item: BillItem,
  assignments: ItemAssignment[],
): number {
  const assigned = getAssignedQuantityForItem(assignments, item.id);
  return roundMoney(item.quantity - assigned);
}

/** Status badge for one item’s assignment progress. */
export function getItemAssignmentStatus(
  item: BillItem,
  assignments: ItemAssignment[],
): ItemAssignmentStatus {
  const assigned = getAssignedQuantityForItem(assignments, item.id);

  if (assigned <= 0) {
    return 'empty';
  }

  const remaining = item.quantity - assigned;

  if (remaining > 0.0001) {
    return 'under';
  }

  if (remaining < -0.0001) {
    return 'over';
  }

  return 'complete';
}

/**
 * Split `totalQty` equally across N people.
 * Last person absorbs float remainder so the sum equals `totalQty` exactly.
 */
export function buildEqualSplitQuantities(
  totalQty: number,
  personCount: number,
): number[] {
  if (personCount <= 0) {
    return [];
  }

  const share = totalQty / personCount;
  const quantities = Array.from({ length: personCount }, () => share);
  const sumExceptLast = share * (personCount - 1);
  quantities[personCount - 1] = totalQty - sumExceptLast;

  return quantities;
}

/**
 * Build assignment rows that give the full item quantity to one person.
 */
export function buildAssignAllToPerson(
  item: BillItem,
  people: Person[],
  personId: string,
): ItemAssignment[] {
  return people
    .map((person) => ({
      itemId: item.id,
      personId: person.id,
      quantity: person.id === personId ? item.quantity : 0,
    }))
    .filter((assignment) => assignment.quantity > 0);
}

/**
 * Replace all assignments for one item; keep other items untouched.
 */
export function replaceItemAssignments(
  assignments: ItemAssignment[],
  itemId: string,
  nextForItem: ItemAssignment[],
): ItemAssignment[] {
  const others = assignments.filter((assignment) => assignment.itemId !== itemId);
  return [
    ...others,
    ...nextForItem.filter((assignment) => assignment.quantity > 0),
  ];
}
