import type { Bill, BillItem, ItemAssignment } from '@/types';

import { roundMoney } from '@/utils/calculations/money';

/** Line total for one menu item: unit price × quantity. */
export function getItemTotal(price: number, quantity: number): number {
  return price * quantity;
}

/** Sum of assigned quantities for one item across all people. */
export function getAssignedQuantityForItem(
  assignments: Pick<ItemAssignment, 'itemId' | 'quantity'>[],
  itemId: string,
): number {
  return assignments
    .filter((assignment) => assignment.itemId === itemId)
    .reduce((sum, assignment) => sum + assignment.quantity, 0);
}

/** Restaurant food subtotal = sum of all item line totals. */
export function getBillSubtotal(items: BillItem[]): number {
  return roundMoney(
    items.reduce((sum, item) => sum + getItemTotal(item.price, item.quantity), 0),
  );
}

export type PersonFoodLine = {
  itemId: string;
  itemName: string;
  assignedQuantity: number;
  amount: number;
};

export type PersonFoodBreakdown = {
  personId: string;
  personName: string;
  foodSubtotal: number;
  itemLines: PersonFoodLine[];
};

/**
 * Build each person's food share from assignments.
 * Amount for an assignment = assignedQty × unit price
 * (covers solo, equal share, and uneven quantity splits).
 */
export function buildPersonFoodBreakdowns(bill: Bill): PersonFoodBreakdown[] {
  const itemsById = new Map(bill.items.map((item) => [item.id, item]));

  return bill.people.map((person) => {
    const personAssignments = bill.assignments.filter(
      (assignment) => assignment.personId === person.id,
    );

    const itemLines: PersonFoodLine[] = [];

    for (const assignment of personAssignments) {
      const item = itemsById.get(assignment.itemId);

      // Skip orphan assignments (item removed but assignment left behind).
      if (!item) {
        continue;
      }

      itemLines.push({
        itemId: item.id,
        itemName: item.name,
        assignedQuantity: assignment.quantity,
        // Exact share before final money rounding in calculateBill.
        amount: assignment.quantity * item.price,
      });
    }

    const foodSubtotal = itemLines.reduce((sum, line) => sum + line.amount, 0);

    return {
      personId: person.id,
      personName: person.name,
      foodSubtotal,
      itemLines,
    };
  });
}
