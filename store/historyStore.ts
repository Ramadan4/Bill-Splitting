/**
 * Persisted finished-bill history (local AsyncStorage).
 */
import { create } from 'zustand';

import { readJson, StorageKeys, writeJson } from '@/services/storage';
import type { Bill } from '@/types';
import { normalizeBill } from '@/utils/history/normalizeBill';

export const EMPTY_HISTORY: Bill[] = [];

type HistoryState = {
  bills: Bill[];
  hydrated: boolean;
  hydrate: () => Promise<void>;
  saveBill: (bill: Bill) => Promise<void>;
  deleteBill: (billId: string) => Promise<void>;
};

async function persist(bills: Bill[]): Promise<void> {
  await writeJson(StorageKeys.history, bills);
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  bills: EMPTY_HISTORY,
  hydrated: false,

  hydrate: async () => {
    const parsed = await readJson<Partial<Bill>[]>(StorageKeys.history);

    if (Array.isArray(parsed)) {
      // Older payloads may predate fields like name/delivery, so normalize each.
      const bills = parsed
        .filter((entry): entry is Partial<Bill> & Pick<Bill, 'id'> => Boolean(entry?.id))
        .map(normalizeBill);
      set({ bills, hydrated: true });
      return;
    }

    set({ bills: EMPTY_HISTORY, hydrated: true });
  },

  saveBill: async (bill) => {
    const existing = get().bills.filter((entry) => entry.id !== bill.id);
    // Newest first so Home/history opens on the latest session.
    const bills = [bill, ...existing];
    set({ bills });
    await persist(bills);
  },

  deleteBill: async (billId) => {
    const bills = get().bills.filter((entry) => entry.id !== billId);
    set({ bills });
    await persist(bills);
  },
}));
