/**
 * Factory for a person on the bill.
 */
import type { Person } from '@/types';
import { createId } from '@/utils/id';

/**
 * @returns A Person ready to insert into the store
 * @throws if name is empty
 */
export function createPerson(name: string): Person {
  const trimmed = name.trim();

  if (!trimmed) {
    throw new Error('Person name is required.');
  }

  return {
    id: createId('person'),
    name: trimmed,
  };
}
