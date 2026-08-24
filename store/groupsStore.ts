/**
 * Persisted people groups for one-tap add on the People step.
 */
import { create } from 'zustand';

import { readJson, StorageKeys, writeJson } from '@/services/storage';
import type { PersonGroup } from '@/types';
import { createPersonGroup } from '@/utils/models';

export const EMPTY_GROUPS: PersonGroup[] = [];

type GroupsState = {
  groups: PersonGroup[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  addGroup: (name: string, memberNames: string[]) => Promise<void>;
  updateGroup: (groupId: string, name: string, memberNames: string[]) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
};

async function persist(groups: PersonGroup[]): Promise<void> {
  await writeJson(StorageKeys.groups, groups);
}

export const useGroupsStore = create<GroupsState>((set, get) => ({
  groups: EMPTY_GROUPS,
  hydrated: false,

  hydrate: async () => {
    const parsed = await readJson<PersonGroup[]>(StorageKeys.groups);

    if (Array.isArray(parsed)) {
      set({ groups: parsed, hydrated: true });
      return;
    }

    set({ groups: EMPTY_GROUPS, hydrated: true });
  },

  addGroup: async (name, memberNames) => {
    const group = createPersonGroup(name, memberNames);
    const groups = [group, ...get().groups];
    set({ groups });
    await persist(groups);
  },

  updateGroup: async (groupId, name, memberNames) => {
    const next = createPersonGroup(name, memberNames);
    const groups = get().groups.map((group) =>
      group.id === groupId ? { ...next, id: groupId } : group,
    );
    set({ groups });
    await persist(groups);
  },

  deleteGroup: async (groupId) => {
    const groups = get().groups.filter((group) => group.id !== groupId);
    set({ groups });
    await persist(groups);
  },
}));
