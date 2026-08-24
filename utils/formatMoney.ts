/**
 * Display helpers for money amounts (presentation only — not calc engine).
 */
import { roundMoney } from '@/utils/calculations';

/**
 * Format an EGP amount for UI lists.
 * Locale only affects digit/currency presentation — never the calculation.
 */
export function formatMoney(value: number, locale: string = 'en'): string {
  const amount = roundMoney(value);
  try {
    return new Intl.NumberFormat(locale === 'ar' ? 'ar-EG' : 'en-EG', {
      style: 'currency',
      currency: 'EGP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} EGP`;
  }
}
