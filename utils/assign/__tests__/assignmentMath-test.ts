/**
 * Unit tests for assignment math helpers (Step 5).
 */
import type { BillItem, ItemAssignment, Person } from '@/types';
import {
  buildAssignAllToPerson,
  buildEqualSplitQuantities,
  getItemAssignmentStatus,
  getRemainingQuantity,
  replaceItemAssignments,
} from '@/utils/assign/assignmentMath';
import { parseAssignmentQuantity } from '@/utils/assign/parseAssignmentQuantity';

describe('buildEqualSplitQuantities', () => {
  it('splits pizza qty 1 across 3 people equally', () => {
    const parts = buildEqualSplitQuantities(1, 3);
    expect(parts).toHaveLength(3);
    expect(parts.reduce((sum, value) => sum + value, 0)).toBeCloseTo(1, 10);
    expect(parts[0]).toBeCloseTo(1 / 3, 10);
  });

  it('splits cola qty 6 across 3 people as 2 each', () => {
    expect(buildEqualSplitQuantities(6, 3)).toEqual([2, 2, 2]);
  });
});

describe('getItemAssignmentStatus', () => {
  const item: BillItem = { id: 'cola', name: 'Cola', price: 50, quantity: 6 };

  it('marks complete when assigned qty matches', () => {
    const assignments: ItemAssignment[] = [
      { itemId: 'cola', personId: 'a', quantity: 2 },
      { itemId: 'cola', personId: 'b', quantity: 1 },
      { itemId: 'cola', personId: 'c', quantity: 3 },
    ];

    expect(getItemAssignmentStatus(item, assignments)).toBe('complete');
    expect(getRemainingQuantity(item, assignments)).toBe(0);
  });

  it('marks under when leftover remains', () => {
    const assignments: ItemAssignment[] = [
      { itemId: 'cola', personId: 'a', quantity: 2 },
    ];

    expect(getItemAssignmentStatus(item, assignments)).toBe('under');
    expect(getRemainingQuantity(item, assignments)).toBe(4);
  });
});

describe('buildAssignAllToPerson + replaceItemAssignments', () => {
  it('assigns full quantity to one person and clears others', () => {
    const item: BillItem = { id: 'pizza', name: 'Pizza', price: 300, quantity: 1 };
    const people: Person[] = [
      { id: 'm', name: 'Mohamed' },
      { id: 'a', name: 'Ahmed' },
    ];

    const next = buildAssignAllToPerson(item, people, 'm');
    expect(next).toEqual([{ itemId: 'pizza', personId: 'm', quantity: 1 }]);

    const merged = replaceItemAssignments(
      [{ itemId: 'other', personId: 'm', quantity: 2 }],
      'pizza',
      next,
    );

    expect(merged).toEqual([
      { itemId: 'other', personId: 'm', quantity: 2 },
      { itemId: 'pizza', personId: 'm', quantity: 1 },
    ]);
  });
});

describe('parseAssignmentQuantity', () => {
  it('treats blank as zero', () => {
    expect(parseAssignmentQuantity('')).toEqual({ ok: true, quantity: 0 });
  });

  it('parses decimals with comma', () => {
    expect(parseAssignmentQuantity('1,5')).toEqual({ ok: true, quantity: 1.5 });
  });

  it('rejects negatives', () => {
    expect(parseAssignmentQuantity('-1').ok).toBe(false);
  });
});
