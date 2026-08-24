/**
 * Groups screen: form + CRUD against the persisted groups store.
 */
import { useState } from 'react';

import type { GroupFormValues } from '@/utils/groups/parseGroupForm';
import {
  createEmptyGroupFormValues,
  parseGroupFormValues,
} from '@/utils/groups/parseGroupForm';
import { uniqueTrimmedNames } from '@/utils/models';
import { EMPTY_GROUPS, useGroupsStore } from '@/store/groupsStore';
import type { PersonGroup } from '@/types';

export function useGroupsEditor() {
  const groups = useGroupsStore((state) => state.groups);
  const hydrated = useGroupsStore((state) => state.hydrated);
  const addGroup = useGroupsStore((state) => state.addGroup);
  const updateGroup = useGroupsStore((state) => state.updateGroup);
  const deleteGroup = useGroupsStore((state) => state.deleteGroup);

  const [values, setValues] = useState<GroupFormValues>(createEmptyGroupFormValues);
  const [members, setMembers] = useState<string[]>([]);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isEditing = editingGroupId !== null;

  const onChange = (patch: Partial<GroupFormValues>) => {
    setValues((current) => ({ ...current, ...patch }));
    if (error) {
      setError(null);
    }
  };

  const resetForm = () => {
    setValues(createEmptyGroupFormValues());
    setMembers([]);
    setEditingGroupId(null);
    setError(null);
  };

  const addMemberDraft = () => {
    const name = values.memberDraft.trim();
    if (!name) {
      setError('errors.personNameRequired');
      return;
    }

    const next = uniqueTrimmedNames([...members, name]);
    if (next.length === members.length) {
      setError('errors.personDuplicate');
      return;
    }

    setMembers(next);
    setValues((current) => ({ ...current, memberDraft: '' }));
    setError(null);
  };

  const removeMember = (name: string) => {
    setMembers((current) =>
      current.filter((member) => member.toLowerCase() !== name.toLowerCase()),
    );
  };

  const startEdit = (group: PersonGroup) => {
    setEditingGroupId(group.id);
    setValues({ name: group.name, memberDraft: '' });
    setMembers([...group.memberNames]);
    setError(null);
  };

  const submit = async () => {
    const parsed = parseGroupFormValues(values, members);
    if (!parsed.ok) {
      setError(parsed.errorKey);
      return;
    }

    try {
      if (editingGroupId) {
        await updateGroup(editingGroupId, parsed.name, parsed.memberNames);
      } else {
        await addGroup(parsed.name, parsed.memberNames);
      }
      resetForm();
    } catch {
      setError('errors.groupSaveFailed');
    }
  };

  return {
    groups: groups ?? EMPTY_GROUPS,
    // Drives skeletons while AsyncStorage is still being read.
    isLoading: !hydrated,
    values,
    members,
    error,
    isEditing,
    onChange,
    addMemberDraft,
    removeMember,
    submit,
    startEdit,
    cancelEdit: resetForm,
    onDelete: deleteGroup,
  };
}
