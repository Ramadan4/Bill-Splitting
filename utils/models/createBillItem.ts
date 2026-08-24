/**
 * Factory for a bill line item.
 * Keeps id generation out of UI screens.
 */
import type { BillItem } from '@/types';
import { createId } from '@/utils/id';

export type NewBillItemInput = {
  name: string;
  price: number;
  quantity: number;
};

/**
 * @returns A BillItem ready to insert into the store
 * @throws if name is empty or price/quantity are invalid
 */
export function createBillItem(input: NewBillItemInput): BillItem {
  const name = input.name.trim();

  if (!name) {
    throw new Error('Item name is required.');
  }

  if (input.price < 0 || input.quantity <= 0) {
    throw new Error('Item price must be ≥ 0 and quantity must be > 0.');
  }

  return {
    id: createId('item'),
    name,
    price: input.price,
    quantity: input.quantity,
  };
}
