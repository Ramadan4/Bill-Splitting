/**
 * Parse a quantity string from the assign UI.
 * Returns i18n error keys (not hard-coded English).
 */
export type ParsedAssignmentQuantity =
  | { ok: true; quantity: number }
  | { ok: false; errorKey: string };

/**
 * Empty / blank → 0 (clears that person's share).
 * Invalid number → error key.
 */
export function parseAssignmentQuantity(raw: string): ParsedAssignmentQuantity {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return { ok: true, quantity: 0 };
  }

  const quantity = Number(trimmed.replace(',', '.'));

  if (!Number.isFinite(quantity) || quantity < 0) {
    return { ok: false, errorKey: 'errors.quantityInvalid' };
  }

  return { ok: true, quantity };
}
