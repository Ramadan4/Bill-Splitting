/**
 * Parse group form strings into a validated name + member list.
 */
export type GroupFormValues = {
  name: string;
  memberDraft: string;
};

export type ParsedGroupForm =
  | { ok: true; name: string; memberNames: string[] }
  | { ok: false; errorKey: string };

/**
 * Members already added to the draft plus an optional in-progress name.
 */
export function parseGroupFormValues(
  values: GroupFormValues,
  memberNames: string[],
): ParsedGroupForm {
  const name = values.name.trim();
  if (!name) {
    return { ok: false, errorKey: 'errors.groupNameRequired' };
  }

  if (memberNames.length === 0) {
    return { ok: false, errorKey: 'errors.groupNeedMember' };
  }

  return { ok: true, name, memberNames };
}

export function createEmptyGroupFormValues(): GroupFormValues {
  return { name: '', memberDraft: '' };
}
