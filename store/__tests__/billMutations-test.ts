/**
 * Unit tests for pure bill mutations (Step 2 store polish).
 */
import {
  addItem,
  addPerson,
  clampPercentage,
  removeItem,
  removePerson,
  setBillName,
  setDelivery,
  setServicePercentage,
  upsertAssignment,
} from '@/store/billMutations';
import { createEmptyBill } from '@/utils/models';

describe('clampPercentage', () => {
  it('clamps into 0–100', () => {
    expect(clampPercentage(-5)).toBe(0);
    expect(clampPercentage(40)).toBe(40);
    expect(clampPercentage(150)).toBe(100);
  });
});

describe('billMutations', () => {
  it('adds items and people to an empty bill', () => {
    let bill = createEmptyBill();
    bill = addItem(bill, { name: 'Pizza', price: 300, quantity: 1 });
    bill = addPerson(bill, 'Mohamed');

    expect(bill.items).toHaveLength(1);
    expect(bill.items[0].name).toBe('Pizza');
    expect(bill.people).toHaveLength(1);
    expect(bill.people[0].name).toBe('Mohamed');
  });

  it('cascades assignment cleanup when removing an item', () => {
    let bill = createEmptyBill();
    bill = addItem(bill, { name: 'Cola', price: 50, quantity: 2 });
    bill = addPerson(bill, 'Ali');

    const itemId = bill.items[0].id;
    const personId = bill.people[0].id;

    bill = upsertAssignment(bill, { itemId, personId, quantity: 2 });
    expect(bill.assignments).toHaveLength(1);

    bill = removeItem(bill, itemId);
    expect(bill.items).toHaveLength(0);
    expect(bill.assignments).toHaveLength(0);
  });

  it('cascades assignment cleanup when removing a person', () => {
    let bill = createEmptyBill();
    bill = addItem(bill, { name: 'Burger', price: 180, quantity: 1 });
    bill = addPerson(bill, 'Ahmed');

    const itemId = bill.items[0].id;
    const personId = bill.people[0].id;

    bill = upsertAssignment(bill, { itemId, personId, quantity: 1 });
    bill = removePerson(bill, personId);

    expect(bill.people).toHaveLength(0);
    expect(bill.assignments).toHaveLength(0);
  });

  it('upserts assignment and clears when quantity is 0', () => {
    let bill = createEmptyBill();
    bill = addItem(bill, { name: 'Pizza', price: 300, quantity: 1 });
    bill = addPerson(bill, 'Mohamed');

    const itemId = bill.items[0].id;
    const personId = bill.people[0].id;

    bill = upsertAssignment(bill, { itemId, personId, quantity: 0.5 });
    expect(bill.assignments[0].quantity).toBe(0.5);

    bill = upsertAssignment(bill, { itemId, personId, quantity: 1 });
    expect(bill.assignments).toHaveLength(1);
    expect(bill.assignments[0].quantity).toBe(1);

    bill = upsertAssignment(bill, { itemId, personId, quantity: 0 });
    expect(bill.assignments).toHaveLength(0);
  });

  it('clamps service percentage updates', () => {
    let bill = createEmptyBill();
    bill = setServicePercentage(bill, 120);
    expect(bill.servicePercentage).toBe(100);
  });

  it('sets bill name and delivery', () => {
    let bill = createEmptyBill();
    bill = setBillName(bill, '  Friday dinner  ');
    bill = setDelivery(bill, true, 25);

    expect(bill.name).toBe('Friday dinner');
    expect(bill.hasDelivery).toBe(true);
    expect(bill.deliveryCost).toBe(25);

    bill = setDelivery(bill, false, 99);
    expect(bill.hasDelivery).toBe(false);
    expect(bill.deliveryCost).toBe(0);
  });

  it('rejects blank item names', () => {
    const bill = createEmptyBill();
    expect(() => addItem(bill, { name: '   ', price: 10, quantity: 1 })).toThrow(
      /name/i,
    );
  });
});
