import { formatBillShareMessage } from '@/utils/share/formatBillShareMessage';
import type { Bill, BillCalculationResult } from '@/types';

const labels = {
  appName: 'SplitEat',
  foodSubtotal: 'Food subtotal',
  service: 'Service',
  tax: 'Tax',
  delivery: 'Delivery',
  grandTotal: 'Grand total',
  perPerson: 'Per person',
  food: 'Food',
  total: 'Total',
  untitled: 'Untitled bill',
};

function makeBill(): Bill {
  return {
    id: 'bill_1',
    createdAt: '2026-01-15T18:30:00.000Z',
    name: 'Friday dinner',
    inputMethod: 'manual',
    receiptImageUri: null,
    items: [{ id: 'pizza', name: 'Pizza', price: 300, quantity: 1 }],
    people: [
      { id: 'm', name: 'Mohamed' },
      { id: 'a', name: 'Ahmed' },
    ],
    assignments: [
      { itemId: 'pizza', personId: 'm', quantity: 0.5 },
      { itemId: 'pizza', personId: 'a', quantity: 0.5 },
    ],
    servicePercentage: 0,
    taxPercentage: 0,
    hasDelivery: true,
    deliveryCost: 20,
  };
}

function makeResult(): BillCalculationResult {
  return {
    subtotal: 300,
    serviceCharge: 0,
    tax: 0,
    delivery: 20,
    grandTotal: 320,
    isBalanced: true,
    balanceDifference: 0,
    people: [
      {
        personId: 'm',
        personName: 'Mohamed',
        foodSubtotal: 150,
        serviceCharge: 0,
        tax: 0,
        deliveryCharge: 10,
        total: 160,
        itemLines: [
          { itemId: 'pizza', itemName: 'Pizza', assignedQuantity: 0.5, amount: 150 },
        ],
      },
      {
        personId: 'a',
        personName: 'Ahmed',
        foodSubtotal: 150,
        serviceCharge: 0,
        tax: 0,
        deliveryCharge: 10,
        total: 160,
        itemLines: [
          { itemId: 'pizza', itemName: 'Pizza', assignedQuantity: 0.5, amount: 150 },
        ],
      },
    ],
  };
}

describe('formatBillShareMessage', () => {
  it('includes bill name, totals, delivery, and per-person lines', () => {
    const message = formatBillShareMessage(makeBill(), makeResult(), labels, 'en');

    expect(message).toContain('*Friday dinner*');
    expect(message).toContain('Grand total');
    expect(message).toContain('Delivery');
    expect(message).toContain('*Mohamed*');
    expect(message).toContain('*Ahmed*');
    expect(message).toContain('Pizza × 0.5');
  });

  it('falls back to untitled when the bill has no name', () => {
    const bill = { ...makeBill(), name: '   ' };
    const message = formatBillShareMessage(bill, makeResult(), labels, 'en');
    expect(message).toContain('*Untitled bill*');
  });
});
