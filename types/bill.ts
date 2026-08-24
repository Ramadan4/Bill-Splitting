import type { BillItem, ItemAssignment } from './item';
import type { Person } from './person';

export type InputMethod = 'manual' | 'receipt';

/**
 * In-progress bill draft held in local Zustand state (no backend yet).
 */
export type Bill = {
  id: string;
  createdAt: string;
  /** Host-chosen label shown in history (optional until create step). */
  name: string;
  inputMethod: InputMethod | null;
  /** Local URI for receipt photo (OCR-ready later; unused by calc engine) */
  receiptImageUri: string | null;
  items: BillItem[];
  people: Person[];
  assignments: ItemAssignment[];
  servicePercentage: number;
  taxPercentage: number;
  /** When true, `deliveryCost` is added and split equally among people. */
  hasDelivery: boolean;
  deliveryCost: number;
};

/** Per-person money breakdown shown on the summary screen */
export type PersonBillBreakdown = {
  personId: string;
  personName: string;
  foodSubtotal: number;
  serviceCharge: number;
  tax: number;
  deliveryCharge: number;
  total: number;
  itemLines: {
    itemId: string;
    itemName: string;
    assignedQuantity: number;
    amount: number;
  }[];
};

/** Output of the pure calculation engine */
export type BillCalculationResult = {
  subtotal: number;
  serviceCharge: number;
  tax: number;
  delivery: number;
  grandTotal: number;
  people: PersonBillBreakdown[];
  isBalanced: boolean;
  balanceDifference: number;
};
