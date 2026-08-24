/**
 * Case-insensitive duplicate check for diner names on a bill.
 * Why: two "Mohamed" entries make assignment screens confusing.
 */
import type { Person } from '@/types';

export function hasDuplicateName(
  people: Person[],
  name: string,
  exceptPersonId?: string | null,
): boolean {
  const normalized = name.trim().toLowerCase();

  return people.some(
    (person) =>
      person.id !== exceptPersonId && person.name.trim().toLowerCase() === normalized,
  );
}
