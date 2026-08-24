/**
 * Factory for an item↔person assignment row.
 */
import type { ItemAssignment } from '@/types';

export type NewAssignmentInput = {
  itemId: string;
  personId: string;
  quantity: number;
};

/**
 * @returns An ItemAssignment
 * @throws if quantity is negative
 */
export function createAssignment(input: NewAssignmentInput): ItemAssignment {
  if (input.quantity < 0) {
    throw new Error('Assignment quantity cannot be negative.');
  }

  return {
    itemId: input.itemId,
    personId: input.personId,
    quantity: input.quantity,
  };
}
