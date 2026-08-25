/**
 * Unit tests for receipt OCR text → item parsing.
 */
import { parseReceiptText } from '@/utils/receipt/parseReceiptText';

describe('parseReceiptText', () => {
  it('extracts name, price, and quantity from typical lines', () => {
    const items = parseReceiptText(`
      Restaurant ABC
      2x Pizza Margherita 170.00
      Cola 25.50
      Tax 15.00
      TOTAL 210.50
    `);

    expect(items).toEqual([
      { name: 'Pizza Margherita', price: 85, quantity: 2 },
      { name: 'Cola', price: 25.5, quantity: 1 },
    ]);
  });

  it('supports Arabic item names and trailing EGP', () => {
    const items = parseReceiptText(`
      برجر لحم 95.00 ج.م
      خدمة 10
      المجموع 105
    `);

    expect(items).toHaveLength(1);
    expect(items[0]?.name).toContain('برجر');
    expect(items[0]?.price).toBe(95);
  });

  it('returns empty when no priced food lines exist', () => {
    expect(parseReceiptText('Thank you\nVisit again')).toEqual([]);
  });
});
