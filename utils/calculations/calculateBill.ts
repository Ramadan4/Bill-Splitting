import type { Bill, BillCalculationResult, PersonBillBreakdown } from '@/types';

import {
  distributeChargeByFoodShare,
  distributeEqually,
  getDeliveryCharge,
  getServiceCharge,
  getTaxCharge,
} from '@/utils/calculations/charges';
import {
  buildPersonFoodBreakdowns,
  getBillSubtotal,
} from '@/utils/calculations/items';
import { reconcileRoundedAmounts, roundMoney } from '@/utils/calculations/money';
import { validateBill } from '@/utils/calculations/validate';

/**
 * Pure SplitEat calculation engine.
 * No React / store imports — safe to reuse on web or backend later.
 *
 * Steps:
 * 1) Food subtotal from items
 * 2) Per-person food from assignments (qty × unit price)
 * 3) Service + tax on food subtotal, split by food share
 * 4) Round to piastres and reconcile so totals balance when fully assigned
 */
export function calculateBill(bill: Bill): BillCalculationResult {
  const issues = validateBill(bill);
  const subtotal = getBillSubtotal(bill.items);
  const serviceCharge = getServiceCharge(subtotal, bill.servicePercentage);
  const tax = getTaxCharge(subtotal, bill.taxPercentage);
  const delivery = getDeliveryCharge(bill.hasDelivery, bill.deliveryCost);
  const grandTotal = roundMoney(subtotal + serviceCharge + tax + delivery);

  const foodBreakdowns = buildPersonFoodBreakdowns(bill);

  // Round each person's food, then reconcile to assigned-food sum
  // (unassigned items stay off person totals on purpose).
  const rawFoodTotals = foodBreakdowns.map((person) => person.foodSubtotal);
  const assignedFoodTotal = roundMoney(
    rawFoodTotals.reduce((sum, value) => sum + value, 0),
  );
  const roundedFoodTotals = reconcileRoundedAmounts(
    rawFoodTotals.map(roundMoney),
    assignedFoodTotal,
  );

  const serviceShares = distributeChargeByFoodShare(
    serviceCharge,
    roundedFoodTotals,
    assignedFoodTotal,
  );
  const taxShares = distributeChargeByFoodShare(
    tax,
    roundedFoodTotals,
    assignedFoodTotal,
  );
  const deliveryShares = distributeEqually(delivery, foodBreakdowns.length);

  const people: PersonBillBreakdown[] = foodBreakdowns.map((person, index) => {
    const foodSubtotal = roundedFoodTotals[index] ?? 0;
    const serviceForPerson = serviceShares[index] ?? 0;
    const taxForPerson = taxShares[index] ?? 0;
    const deliveryForPerson = deliveryShares[index] ?? 0;

    // Round item lines for display; last line absorbs line-level drift.
    const rawLineAmounts = person.itemLines.map((line) => roundMoney(line.amount));
    const reconciledLines = reconcileRoundedAmounts(rawLineAmounts, foodSubtotal);

    return {
      personId: person.personId,
      personName: person.personName,
      foodSubtotal,
      serviceCharge: serviceForPerson,
      tax: taxForPerson,
      deliveryCharge: deliveryForPerson,
      total: roundMoney(
        foodSubtotal + serviceForPerson + taxForPerson + deliveryForPerson,
      ),
      itemLines: person.itemLines.map((line, lineIndex) => ({
        itemId: line.itemId,
        itemName: line.itemName,
        assignedQuantity: line.assignedQuantity,
        amount: reconciledLines[lineIndex] ?? 0,
      })),
    };
  });

  // When every item is fully assigned, person totals must match grandTotal.
  const hasAssignmentGap = issues.some(
    (issue) => issue.code === 'UNDER_ASSIGNED' || issue.code === 'OVER_ASSIGNED',
  );

  if (!hasAssignmentGap && people.length > 0 && grandTotal > 0) {
    const reconciledTotals = reconcileRoundedAmounts(
      people.map((person) => person.total),
      grandTotal,
    );

    reconciledTotals.forEach((total, index) => {
      people[index].total = total;
    });
  }

  const peopleSum = roundMoney(people.reduce((sum, person) => sum + person.total, 0));
  const balanceDifference = roundMoney(peopleSum - grandTotal);
  const isBalanced =
    issues.every(
      (issue) => issue.code !== 'UNDER_ASSIGNED' && issue.code !== 'OVER_ASSIGNED',
    ) && Math.abs(balanceDifference) < 0.009;

  return {
    subtotal,
    serviceCharge,
    tax,
    delivery,
    grandTotal,
    people,
    isBalanced,
    balanceDifference,
  };
}
