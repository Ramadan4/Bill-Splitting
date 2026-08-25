/**
 * Parse OCR plain text from a restaurant receipt into bill line items.
 * Heuristic only — user must review on the Items screen.
 */
import type { NewBillItemInput } from '@/utils/models';

/** Labels that mark totals / charges, not food lines. */
const SKIP_LINE_LATIN =
  /\b(total|subtotal|sub\s*total|grand\s*total|tax|vat|gst|service|tip|delivery|change|cash|card|balance|amount\s*due|thank|visa|mastercard|debit|credit|invoice|receipt|order|table|date|time|tel|phone|www\.|http)\b/i;

/** Arabic skip phrases (\b is unreliable on Arabic script). */
const SKIP_LINE_ARABIC =
  /(مجموع|الإجمالي|اجمالي|ضريبة|خدمة|توصيل|شكر|فاتورة|رقم الطلب|تاريخ)/;

function shouldSkipLine(line: string): boolean {
  return SKIP_LINE_LATIN.test(line) || SKIP_LINE_ARABIC.test(line);
}

/** Money at end of line: 85, 85.50, 1,250.00, Arabic digits. */
const TRAILING_MONEY =
  /(?<![A-Za-z0-9])(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{1,2})|\d+(?:[.,]\d{1,2})?)\s*(?:EGP|LE|ج\.?م\.?|جنيه)?\s*$/i;

/** Quantity cues: 2x, x2, × 2, 2 × */
const QTY_PREFIX = /^(?:(\d+)\s*[x×]\s*|\s*[x×]\s*(\d+)\s+)/i;
const QTY_INLINE = /\b(\d+)\s*[x×]\s+/i;

function toAsciiDigits(value: string): string {
  return value.replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
}

function parseMoneyToken(raw: string): number | null {
  const normalized = toAsciiDigits(raw).replace(/\s/g, '');
  // European: 1.250,50 → drop thousand dots then comma to dot
  let token = normalized;
  if (/^\d{1,3}(\.\d{3})+(,\d{1,2})?$/.test(token)) {
    token = token.replace(/\./g, '').replace(',', '.');
  } else if (token.includes(',') && !token.includes('.')) {
    token = token.replace(',', '.');
  } else {
    token = token.replace(/,/g, '');
  }

  const value = Number(token);
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }

  return value;
}

function cleanName(raw: string): string {
  return raw
    .replace(QTY_PREFIX, '')
    .replace(QTY_INLINE, '')
    .replace(/[|•·]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractQuantity(line: string): number {
  const prefix = line.match(QTY_PREFIX);
  if (prefix) {
    const qty = Number(toAsciiDigits(prefix[1] ?? prefix[2] ?? '1'));
    return qty > 0 ? qty : 1;
  }

  const inline = line.match(QTY_INLINE);
  if (inline) {
    const qty = Number(toAsciiDigits(inline[1]));
    return qty > 0 ? qty : 1;
  }

  return 1;
}

/**
 * Convert OCR text into `{ name, price, quantity }` rows.
 * Skips header/footer/total lines; takes the last money token as unit/line price.
 */
export function parseReceiptText(rawText: string): NewBillItemInput[] {
  const lines = toAsciiDigits(rawText)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length >= 2);

  const items: NewBillItemInput[] = [];

  for (const line of lines) {
    if (shouldSkipLine(line)) {
      continue;
    }

    const moneyMatch = line.match(TRAILING_MONEY);
    if (!moneyMatch) {
      continue;
    }

    const price = parseMoneyToken(moneyMatch[1]);
    if (price === null || price <= 0) {
      continue;
    }

    const namePart = line.slice(0, moneyMatch.index ?? line.length);
    const quantity = extractQuantity(namePart);
    const name = cleanName(namePart);

    // Need a real item name (not only numbers / symbols).
    if (name.length < 2 || !/[A-Za-z\u0600-\u06FF]/.test(name)) {
      continue;
    }

    // Receipts usually print the line total on the right; convert to unit price.
    const unitPrice = quantity > 1 ? price / quantity : price;

    items.push({ name, price: unitPrice, quantity });
  }

  return items;
}
