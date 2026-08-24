/**
 * People screen logic: form state + store CRUD + continue navigation.
 * Keeps `app/bill/people.tsx` presentational only.
 */
import { useState } from 'react';
import { useRouter } from 'expo-router';

import type { PersonFormValues } from '@/components/features/people/PersonForm';
import { EMPTY_PEOPLE, useBillStore } from '@/store/billStore';
import { EMPTY_GROUPS, useGroupsStore } from '@/store/groupsStore';
import type { Person, PersonGroup } from '@/types';
import { hasDuplicateName } from '@/utils/people/hasDuplicateName';
import {
  createEmptyPersonFormValues,
  parsePersonFormValues,
} from '@/utils/people/parsePersonForm';

export function usePeopleEditor() {
  const router = useRouter();
  const people = useBillStore((state) => state.bill?.people ?? EMPTY_PEOPLE);
  const addPerson = useBillStore((state) => state.addPerson);
  const updatePerson = useBillStore((state) => state.updatePerson);
  const removePerson = useBillStore((state) => state.removePerson);
  const groups = useGroupsStore((state) => state.groups);

  const [values, setValues] = useState<PersonFormValues>(createEmptyPersonFormValues);
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  /** i18n error key — translate in UI with `t(error)`. */
  const [error, setError] = useState<string | null>(null);

  const isEditing = editingPersonId !== null;

  const onChange = (patch: Partial<PersonFormValues>) => {
    setValues((current) => ({ ...current, ...patch }));
    if (error) {
      setError(null);
    }
  };

  const resetForm = () => {
    setValues(createEmptyPersonFormValues());
    setEditingPersonId(null);
    setError(null);
  };

  const startEdit = (person: Person) => {
    setEditingPersonId(person.id);
    setValues({ name: person.name });
    setError(null);
  };

  const submit = () => {
    const parsed = parsePersonFormValues(values);

    if (!parsed.ok) {
      setError(parsed.errorKey);
      return;
    }

    if (hasDuplicateName(people, parsed.name, editingPersonId)) {
      setError('errors.personDuplicate');
      return;
    }

    try {
      if (editingPersonId) {
        updatePerson(editingPersonId, parsed.name);
      } else {
        addPerson(parsed.name);
      }
      resetForm();
    } catch {
      setError('errors.personSaveFailed');
    }
  };

  const onDelete = (personId: string) => {
    // Cascade: store also clears that person's assignments.
    if (editingPersonId === personId) {
      resetForm();
    }
    removePerson(personId);
  };

  const addGroupToBill = (group: PersonGroup) => {
    let added = 0;
    for (const memberName of group.memberNames) {
      if (hasDuplicateName(people, memberName)) {
        continue;
      }

      addPerson(memberName);
      added += 1;
    }

    if (added === 0) {
      setError('errors.groupAlreadyOnBill');
    } else {
      setError(null);
    }
  };

  const canContinue = people.length > 0;

  const continueToAssign = () => {
    if (!canContinue) {
      setError('errors.personNeedOne');
      return;
    }

    router.push('/bill/assign');
  };

  return {
    people,
    groups: groups ?? EMPTY_GROUPS,
    values,
    error,
    isEditing,
    canContinue,
    onChange,
    submit,
    startEdit,
    cancelEdit: resetForm,
    onDelete,
    addGroupToBill,
    continueToAssign,
  };
}
