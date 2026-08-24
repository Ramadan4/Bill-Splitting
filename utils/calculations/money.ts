/**
 * Money helpers — keep all currency math at 2 decimal places (piastres).
 */

/** Round half-up to 2 decimal places (EGP piastres). */
export function roundMoney(value: number): number {
  // Why multiply via Number: avoids most IEEE float noise before rounding.
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * Adjust the last entry so the array sums exactly to `target`.
 * Why: independent per-person rounding can leave ±0.01 leftovers.
 */
export function reconcileRoundedAmounts(amounts: number[], target: number): number[] {
  if (amounts.length === 0) {
    return amounts;
  }

  const rounded = amounts.map(roundMoney);
  const currentSum = roundMoney(rounded.reduce((sum, value) => sum + value, 0));
  const diff = roundMoney(target - currentSum);

  if (diff === 0) {
    return rounded;
  }

  const next = [...rounded];
  next[next.length - 1] = roundMoney(next[next.length - 1] + diff);
  return next;
}
