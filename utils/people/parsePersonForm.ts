/**
 * Parse person form strings into a validated name for the store.
 * Returns i18n error keys so presentation stays locale-aware.
 */
import type { PersonFormValues } from '@/components/features/people/PersonForm';

export type ParsedPersonForm =
  | { ok: true; name: string }
  | { ok: false; errorKey: string };

/**
 * Convert UI form → trimmed person name.
 * Why here: screens must not embed validation rules.
 */
export function parsePersonFormValues(values: PersonFormValues): ParsedPersonForm {
  const name = values.name.trim();

  if (!name) {
    return { ok: false, errorKey: 'errors.personNameRequired' };
  }

  return { ok: true, name };
}

/** Empty form defaults for “add person” mode. */
export function createEmptyPersonFormValues(): PersonFormValues {
  return { name: '' };
}
