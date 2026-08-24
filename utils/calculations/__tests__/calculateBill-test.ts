import type { Bill } from '@/types';
import { calculateBill, getItemTotal, validateBill } from '@/utils/calculations';

/** Helper: build a minimal bill draft for tests. */
function makeBill(overrides: Partial<Bill>): Bill {
  return {
    id: 'bill_test',
    createdAt: '2026-01-01T00:00:00.000Z',
    name: 'Test bill',
    inputMethod: 'manual',
    receiptImageUri: null,
    items: [],
    people: [],
    assignments: [],
    servicePercentage: 0,
    taxPercentage: 0,
    hasDelivery: false,
    deliveryCost: 0,
    ...overrides,
  };
}

describe('getItemTotal', () => {
  it('multiplies unit price by quantity', () => {
    expect(getItemTotal(50, 6)).toBe(300);
  });
});

describe('calculateBill — PDF examples', () => {
  it('assigns a solo item fully to one person', () => {
    const bill = makeBill({
      items: [{ id: 'burger', name: 'Burger', price: 180, quantity: 1 }],
      people: [{ id: 'mohamed', name: 'Mohamed' }],
      assignments: [{ itemId: 'burger', personId: 'mohamed', quantity: 1 }],
    });

    const result = calculateBill(bill);

    expect(result.subtotal).toBe(180);
    expect(result.people[0].foodSubtotal).toBe(180);
    expect(result.people[0].total).toBe(180);
    expect(result.isBalanced).toBe(true);
  });

  it('splits a shared pizza equally across three people', () => {
    // Pizza 300 shared by Mohamed, Ahmed, Ali → 100 each
    const bill = makeBill({
      items: [{ id: 'pizza', name: 'Pizza', price: 300, quantity: 1 }],
      people: [
        { id: 'mohamed', name: 'Mohamed' },
        { id: 'ahmed', name: 'Ahmed' },
        { id: 'ali', name: 'Ali' },
      ],
      assignments: [
        { itemId: 'pizza', personId: 'mohamed', quantity: 1 / 3 },
        { itemId: 'pizza', personId: 'ahmed', quantity: 1 / 3 },
        { itemId: 'pizza', personId: 'ali', quantity: 1 / 3 },
      ],
    });

    const result = calculateBill(bill);

    expect(result.subtotal).toBe(300);
    expect(result.people.map((person) => person.foodSubtotal)).toEqual([100, 100, 100]);
    expect(result.isBalanced).toBe(true);
  });

  it('supports uneven quantity assignment for cola', () => {
    // Cola 50 × 6: Mohamed 2, Ahmed 1, Ali 3 → 100 / 50 / 150
    const bill = makeBill({
      items: [{ id: 'cola', name: 'Cola', price: 50, quantity: 6 }],
      people: [
        { id: 'mohamed', name: 'Mohamed' },
        { id: 'ahmed', name: 'Ahmed' },
        { id: 'ali', name: 'Ali' },
      ],
      assignments: [
        { itemId: 'cola', personId: 'mohamed', quantity: 2 },
        { itemId: 'cola', personId: 'ahmed', quantity: 1 },
        { itemId: 'cola', personId: 'ali', quantity: 3 },
      ],
    });

    const result = calculateBill(bill);

    expect(result.subtotal).toBe(300);
    expect(result.people.find((p) => p.personId === 'mohamed')?.foodSubtotal).toBe(100);
    expect(result.people.find((p) => p.personId === 'ahmed')?.foodSubtotal).toBe(50);
    expect(result.people.find((p) => p.personId === 'ali')?.foodSubtotal).toBe(150);
    expect(result.isBalanced).toBe(true);
  });

  it('distributes service and tax by food share (PDF Mohamed example)', () => {
    // Subtotal 2500, service 10%, tax 14%
    // Mohamed food 500 (20%) → service 50, tax 70, total 620
    const bill = makeBill({
      servicePercentage: 10,
      taxPercentage: 14,
      items: [
        { id: 'm_food', name: 'Mohamed Food', price: 500, quantity: 1 },
        { id: 'others', name: 'Others Food', price: 2000, quantity: 1 },
      ],
      people: [
        { id: 'mohamed', name: 'Mohamed' },
        { id: 'others', name: 'Others' },
      ],
      assignments: [
        { itemId: 'm_food', personId: 'mohamed', quantity: 1 },
        { itemId: 'others', personId: 'others', quantity: 1 },
      ],
    });

    const result = calculateBill(bill);
    const mohamed = result.people.find((person) => person.personId === 'mohamed');

    expect(result.subtotal).toBe(2500);
    expect(result.serviceCharge).toBe(250);
    expect(result.tax).toBe(350);
    expect(result.grandTotal).toBe(3100);

    expect(mohamed?.foodSubtotal).toBe(500);
    expect(mohamed?.serviceCharge).toBe(50);
    expect(mohamed?.tax).toBe(70);
    expect(mohamed?.total).toBe(620);
    expect(result.isBalanced).toBe(true);
  });

  it('adds delivery and splits it equally among people', () => {
    const bill = makeBill({
      hasDelivery: true,
      deliveryCost: 30,
      items: [{ id: 'pizza', name: 'Pizza', price: 300, quantity: 1 }],
      people: [
        { id: 'mohamed', name: 'Mohamed' },
        { id: 'ahmed', name: 'Ahmed' },
        { id: 'ali', name: 'Ali' },
      ],
      assignments: [
        { itemId: 'pizza', personId: 'mohamed', quantity: 1 / 3 },
        { itemId: 'pizza', personId: 'ahmed', quantity: 1 / 3 },
        { itemId: 'pizza', personId: 'ali', quantity: 1 / 3 },
      ],
    });

    const result = calculateBill(bill);

    expect(result.delivery).toBe(30);
    expect(result.grandTotal).toBe(330);
    expect(result.people.map((person) => person.deliveryCharge)).toEqual([10, 10, 10]);
    expect(result.people.map((person) => person.total)).toEqual([110, 110, 110]);
    expect(result.isBalanced).toBe(true);
  });
});

describe('calculateBill — validation / balance', () => {
  it('marks bill unbalanced when an item is under-assigned', () => {
    const bill = makeBill({
      items: [{ id: 'pizza', name: 'Pizza', price: 300, quantity: 1 }],
      people: [{ id: 'mohamed', name: 'Mohamed' }],
      assignments: [{ itemId: 'pizza', personId: 'mohamed', quantity: 0.5 }],
    });

    const issues = validateBill(bill);
    const result = calculateBill(bill);

    expect(issues.some((issue) => issue.code === 'UNDER_ASSIGNED')).toBe(true);
    expect(result.isBalanced).toBe(false);
  });

  it('flags over-assigned quantities', () => {
    const bill = makeBill({
      items: [{ id: 'cola', name: 'Cola', price: 50, quantity: 2 }],
      people: [
        { id: 'mohamed', name: 'Mohamed' },
        { id: 'ahmed', name: 'Ahmed' },
      ],
      assignments: [
        { itemId: 'cola', personId: 'mohamed', quantity: 2 },
        { itemId: 'cola', personId: 'ahmed', quantity: 1 },
      ],
    });

    const issues = validateBill(bill);

    expect(issues.some((issue) => issue.code === 'OVER_ASSIGNED')).toBe(true);
  });
});
