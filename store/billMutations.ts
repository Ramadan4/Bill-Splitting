/**
 * Pure bill draft mutations (no Zustand).
 * Why separate: easy to unit-test and keeps the store file thin.
 */
import type { Bill, BillItem, ItemAssignment, Person } from '@/types';
import {
  createAssignment,
  createBillItem,
  createPerson,
  type NewAssignmentInput,
  type NewBillItemInput,
} from '@/utils/models';

/** Clamp a percentage into a sane 0–100 range for MVP inputs. */
export function clampPercentage(value: number): number {
  if (Number.isNaN(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, value));
}

/** Add a new item; returns updated bill. */
export function addItem(bill: Bill, input: NewBillItemInput): Bill {
  const item = createBillItem(input);
  return { ...bill, items: [...bill.items, item] };
}

/** Patch an existing item by id; no-op if missing. */
export function updateItem(
  bill: Bill,
  itemId: string,
  patch: Partial<Pick<BillItem, 'name' | 'price' | 'quantity'>>,
): Bill {
  return {
    ...bill,
    items: bill.items.map((item) => {
      if (item.id !== itemId) {
        return item;
      }

      const nextName = patch.name !== undefined ? patch.name.trim() : item.name;
      const nextPrice = patch.price ?? item.price;
      const nextQuantity = patch.quantity ?? item.quantity;

      // Guard invalid edits instead of writing bad data into the draft.
      if (!nextName || nextPrice < 0 || nextQuantity <= 0) {
        return item;
      }

      return {
        ...item,
        name: nextName,
        price: nextPrice,
        quantity: nextQuantity,
      };
    }),
  };
}

/**
 * Remove an item and any assignments pointing at it.
 * Why cascade: orphan assignments would break the calculation engine.
 */
export function removeItem(bill: Bill, itemId: string): Bill {
  return {
    ...bill,
    items: bill.items.filter((item) => item.id !== itemId),
    assignments: bill.assignments.filter((assignment) => assignment.itemId !== itemId),
  };
}

/** Add a person by name. */
export function addPerson(bill: Bill, name: string): Bill {
  const person = createPerson(name);
  return { ...bill, people: [...bill.people, person] };
}

/** Rename a person; no-op if missing / empty name. */
export function updatePerson(bill: Bill, personId: string, name: string): Bill {
  const trimmed = name.trim();

  if (!trimmed) {
    return bill;
  }

  return {
    ...bill,
    people: bill.people.map((person) =>
      person.id === personId ? { ...person, name: trimmed } : person,
    ),
  };
}

/**
 * Remove a person and any assignments for them.
 * Why cascade: same orphan-assignment risk as removeItem.
 */
export function removePerson(bill: Bill, personId: string): Bill {
  return {
    ...bill,
    people: bill.people.filter((person) => person.id !== personId),
    assignments: bill.assignments.filter(
      (assignment) => assignment.personId !== personId,
    ),
  };
}

/**
 * Upsert one assignment row (itemId + personId is the key).
 * quantity === 0 removes that person's share for the item.
 */
export function upsertAssignment(bill: Bill, input: NewAssignmentInput): Bill {
  // Zero means "clear this person's share" — keeps assign UI simple.
  if (input.quantity === 0) {
    return {
      ...bill,
      assignments: bill.assignments.filter(
        (assignment) =>
          !(assignment.itemId === input.itemId && assignment.personId === input.personId),
      ),
    };
  }

  const nextAssignment = createAssignment(input);
  const existingIndex = bill.assignments.findIndex(
    (assignment) =>
      assignment.itemId === input.itemId && assignment.personId === input.personId,
  );

  if (existingIndex === -1) {
    return { ...bill, assignments: [...bill.assignments, nextAssignment] };
  }

  const assignments = [...bill.assignments];
  assignments[existingIndex] = nextAssignment;
  return { ...bill, assignments };
}

/** Remove one assignment row. */
export function removeAssignment(
  bill: Bill,
  itemId: string,
  personId: string,
): Bill {
  return {
    ...bill,
    assignments: bill.assignments.filter(
      (assignment) =>
        !(assignment.itemId === itemId && assignment.personId === personId),
    ),
  };
}

/** Replace all assignments (used when rebuilding equal splits). */
export function setAssignments(bill: Bill, assignments: ItemAssignment[]): Bill {
  return { ...bill, assignments };
}

export function setServicePercentage(bill: Bill, value: number): Bill {
  return { ...bill, servicePercentage: clampPercentage(value) };
}

export function setTaxPercentage(bill: Bill, value: number): Bill {
  return { ...bill, taxPercentage: clampPercentage(value) };
}

/** Set the host-visible bill title (blank names are ignored). */
export function setBillName(bill: Bill, name: string): Bill {
  const trimmed = name.trim();
  if (!trimmed) {
    return bill;
  }

  return { ...bill, name: trimmed };
}

/**
 * Delivery is a flat extra, not a percentage.
 * Why equal-split later in calc: delivery is shared by the table, not by food share.
 */
export function setDelivery(bill: Bill, hasDelivery: boolean, deliveryCost: number): Bill {
  const cost = Number.isFinite(deliveryCost) ? Math.max(0, deliveryCost) : 0;
  return {
    ...bill,
    hasDelivery,
    deliveryCost: hasDelivery ? cost : 0,
  };
}

/** Replace people list wholesale (rare; prefer add/update/remove). */
export function setPeople(bill: Bill, people: Person[]): Bill {
  return { ...bill, people };
}

/** Replace items list wholesale (rare; prefer add/update/remove). */
export function setItems(bill: Bill, items: BillItem[]): Bill {
  return { ...bill, items };
}
