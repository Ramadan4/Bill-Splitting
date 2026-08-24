/**
 * Factory for a reusable people group.
 */
import type { PersonGroup } from '@/types';
import { createId } from '@/utils/id';

/**
 * @returns A PersonGroup ready to persist
 * @throws if name is empty or there are no members
 */
export function createPersonGroup(name: string, memberNames: string[]): PersonGroup {
  const trimmedName = name.trim();
  const members = uniqueTrimmedNames(memberNames);

  if (!trimmedName) {
    throw new Error('Group name is required.');
  }

  if (members.length === 0) {
    throw new Error('Group needs at least one member.');
  }

  return {
    id: createId('group'),
    name: trimmedName,
    memberNames: members,
  };
}

/** Trim, drop blanks, and de-dupe names case-insensitively (first spelling wins). */
export function uniqueTrimmedNames(names: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const raw of names) {
    const name = raw.trim();
    if (!name) {
      continue;
    }

    const key = name.toLowerCase();
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    result.push(name);
  }

  return result;
}
