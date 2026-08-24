/**
 * Zustand store for the active bill draft (local-only MVP).
 * Screens should prefer feature hooks; mutations live in billMutations.ts.
 */
import { create } from 'zustand';

import type { Bill, BillItem, InputMethod, ItemAssignment, Person } from '@/types';
import {
  addItem as addItemMutation,
  addPerson as addPersonMutation,
  removeAssignment as removeAssignmentMutation,
  removeItem as removeItemMutation,
  removePerson as removePersonMutation,
  setAssignments as setAssignmentsMutation,
  setItems as setItemsMutation,
  setPeople as setPeopleMutation,
  setServicePercentage as setServicePercentageMutation,
  setTaxPercentage as setTaxPercentageMutation,
  setBillName as setBillNameMutation,
  setDelivery as setDeliveryMutation,
  updateItem as updateItemMutation,
  updatePerson as updatePersonMutation,
  upsertAssignment as upsertAssignmentMutation,
} from '@/store/billMutations';
import type { NewAssignmentInput, NewBillItemInput } from '@/utils/models';
import { createEmptyBill } from '@/utils/models';

/**
 * Stable empty arrays for Zustand selectors.
 * Why: `?? []` inside a selector allocates a new array every getSnapshot and
 * React 19 throws “getSnapshot should be cached” (infinite loop).
 */
export const EMPTY_ITEMS: BillItem[] = [];
export const EMPTY_PEOPLE: Person[] = [];
export const EMPTY_ASSIGNMENTS: ItemAssignment[] = [];

type BillStore = {
  bill: Bill | null;

  // Session
  startNewBill: () => void;
  resetBill: () => void;

  // Setup
  setInputMethod: (method: InputMethod) => void;
  setReceiptImageUri: (uri: string | null) => void;

  // Items CRUD
  addItem: (input: NewBillItemInput) => void;
  updateItem: (
    itemId: string,
    patch: Partial<Pick<BillItem, 'name' | 'price' | 'quantity'>>,
  ) => void;
  removeItem: (itemId: string) => void;
  setItems: (items: BillItem[]) => void;

  // People CRUD
  addPerson: (name: string) => void;
  updatePerson: (personId: string, name: string) => void;
  removePerson: (personId: string) => void;
  setPeople: (people: Person[]) => void;

  // Assignments
  upsertAssignment: (input: NewAssignmentInput) => void;
  removeAssignment: (itemId: string, personId: string) => void;
  setAssignments: (assignments: ItemAssignment[]) => void;

  // Charges
  setServicePercentage: (value: number) => void;
  setTaxPercentage: (value: number) => void;
  setBillName: (name: string) => void;
  setDelivery: (hasDelivery: boolean, deliveryCost: number) => void;
};

/**
 * Apply a pure mutation only when a bill session exists.
 * Why: avoids writing after reset / before startNewBill.
 */
function applyBillUpdate(
  bill: Bill | null,
  updater: (current: Bill) => Bill,
): Bill | null {
  if (!bill) {
    return null;
  }

  return updater(bill);
}

export const useBillStore = create<BillStore>((set) => ({
  bill: null,

  startNewBill: () => set({ bill: createEmptyBill() }),

  resetBill: () => set({ bill: null }),

  setInputMethod: (method) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) => ({ ...bill, inputMethod: method })),
    })),

  setReceiptImageUri: (uri) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) => ({
        ...bill,
        receiptImageUri: uri,
      })),
    })),

  addItem: (input) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) => addItemMutation(bill, input)),
    })),

  updateItem: (itemId, patch) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) =>
        updateItemMutation(bill, itemId, patch),
      ),
    })),

  removeItem: (itemId) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) => removeItemMutation(bill, itemId)),
    })),

  setItems: (items) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) => setItemsMutation(bill, items)),
    })),

  addPerson: (name) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) => addPersonMutation(bill, name)),
    })),

  updatePerson: (personId, name) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) =>
        updatePersonMutation(bill, personId, name),
      ),
    })),

  removePerson: (personId) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) =>
        removePersonMutation(bill, personId),
      ),
    })),

  setPeople: (people) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) => setPeopleMutation(bill, people)),
    })),

  upsertAssignment: (input) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) =>
        upsertAssignmentMutation(bill, input),
      ),
    })),

  removeAssignment: (itemId, personId) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) =>
        removeAssignmentMutation(bill, itemId, personId),
      ),
    })),

  setAssignments: (assignments) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) =>
        setAssignmentsMutation(bill, assignments),
      ),
    })),

  setServicePercentage: (value) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) =>
        setServicePercentageMutation(bill, value),
      ),
    })),

  setTaxPercentage: (value) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) =>
        setTaxPercentageMutation(bill, value),
      ),
    })),

  setBillName: (name) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) => setBillNameMutation(bill, name)),
    })),

  setDelivery: (hasDelivery, deliveryCost) =>
    set((state) => ({
      bill: applyBillUpdate(state.bill, (bill) =>
        setDeliveryMutation(bill, hasDelivery, deliveryCost),
      ),
    })),
}));
