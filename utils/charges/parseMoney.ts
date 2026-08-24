/**
 * Parse a money amount for delivery (blank → 0 when delivery is off).
 */
export type ParsedMoney =
  | { ok: true; value: number }
  | { ok: false; errorKey: string };

/**
 * Delivery cost must be a finite number ≥ 0.
 * When delivery is enabled we still allow 0 so the host can toggle first.
 */
export function parseMoneyAmount(raw: string, errorKey: string): ParsedMoney {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return { ok: true, value: 0 };
  }

  const value = Number(trimmed.replace(',', '.'));

  if (!Number.isFinite(value) || value < 0) {
    return { ok: false, errorKey };
  }

  return { ok: true, value };
}
