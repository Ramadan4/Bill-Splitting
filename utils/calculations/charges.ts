import { reconcileRoundedAmounts, roundMoney } from '@/utils/calculations/money';

/**
 * Service + tax rules (SplitEat MVP):
 * - serviceTotal = subtotal × service%
 * - taxTotal     = subtotal × tax%   (tax on food subtotal only — matches PDF example)
 * - each person pays the same % of service/tax as their % of food subtotal
 */

export function getServiceCharge(subtotal: number, servicePercentage: number): number {
  return roundMoney(subtotal * (servicePercentage / 100));
}

export function getTaxCharge(subtotal: number, taxPercentage: number): number {
  // Intentionally NOT applied on (subtotal + service). PDF example:
  // food 500 / 2500 = 20% → tax 70 of 2500×14%.
  return roundMoney(subtotal * (taxPercentage / 100));
}

/**
 * Split a bill-level charge across people by food-share ratio.
 * Returns one rounded amount per person (same order as `foodSubtotals`).
 */
export function distributeChargeByFoodShare(
  chargeTotal: number,
  foodSubtotals: number[],
  billFoodSubtotal: number,
): number[] {
  if (foodSubtotals.length === 0) {
    return [];
  }

  // No food yet → nobody owes a share of service/tax.
  if (billFoodSubtotal <= 0 || chargeTotal === 0) {
    return foodSubtotals.map(() => 0);
  }

  const rawShares = foodSubtotals.map((food) =>
    roundMoney(chargeTotal * (food / billFoodSubtotal)),
  );

  // Fix ±0.01 drift so person shares always sum to the bill charge.
  return reconcileRoundedAmounts(rawShares, chargeTotal);
}

/**
 * Split a flat cost (delivery) equally among everyone on the bill.
 * Why not food-share: delivery is a table fee, not tied to what each person ate.
 */
export function distributeEqually(chargeTotal: number, personCount: number): number[] {
  if (personCount <= 0) {
    return [];
  }

  if (chargeTotal === 0) {
    return Array.from({ length: personCount }, () => 0);
  }

  const share = roundMoney(chargeTotal / personCount);
  const rawShares = Array.from({ length: personCount }, () => share);
  return reconcileRoundedAmounts(rawShares, roundMoney(chargeTotal));
}

/** Delivery amount used by the engine (0 when the host did not order delivery). */
export function getDeliveryCharge(hasDelivery: boolean, deliveryCost: number): number {
  if (!hasDelivery || !Number.isFinite(deliveryCost) || deliveryCost <= 0) {
    return 0;
  }

  return roundMoney(deliveryCost);
}
