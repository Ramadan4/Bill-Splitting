/**
 * Parse percentage strings for service/tax inputs.
 * Returns i18n error keys (locale-agnostic utils).
 */
export type ParsedPercentage =
  | { ok: true; value: number }
  | { ok: false; errorKey: 'errors.servicePercentage' | 'errors.taxPercentage' };

/**
 * Blank → 0. Must be a finite number between 0 and 100.
 */
export function parsePercentage(
  raw: string,
  field: 'service' | 'tax',
): ParsedPercentage {
  const trimmed = raw.trim();

  if (trimmed === '') {
    return { ok: true, value: 0 };
  }

  const value = Number(trimmed.replace(',', '.'));

  if (!Number.isFinite(value) || value < 0 || value > 100) {
    return {
      ok: false,
      errorKey: field === 'service' ? 'errors.servicePercentage' : 'errors.taxPercentage',
    };
  }

  return { ok: true, value };
}
