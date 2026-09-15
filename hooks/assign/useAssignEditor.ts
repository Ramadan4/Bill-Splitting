/**
 * Assign-screen logic: per-person qty updates, equal split, continue gate.
 * Keeps `app/bill/assign.tsx` presentational only.
 */
import { useMemo, useState } from 'react';
import { useRouter } from 'expo-router';

import {
  EMPTY_ASSIGNMENTS,
  EMPTY_ITEMS,
  EMPTY_PEOPLE,
  useBillStore,
} from '@/store/billStore';
import type { BillItem, Person } from '@/types';
import {
  buildAssignAllToPerson,
  buildEqualSplitQuantities,
  getItemAssignmentStatus,
  getRemainingQuantity,
  replaceItemAssignments,
} from '@/utils/assign/assignmentMath';
import { parseAssignmentQuantity } from '@/utils/assign/parseAssignmentQuantity';

export function useAssignEditor() {
  const router = useRouter();
  const items = useBillStore((state) => state.bill?.items ?? EMPTY_ITEMS);
  const people = useBillStore((state) => state.bill?.people ?? EMPTY_PEOPLE);
  const assignments = useBillStore(
    (state) => state.bill?.assignments ?? EMPTY_ASSIGNMENTS,
  );
  const upsertAssignment = useBillStore((state) => state.upsertAssignment);
  const setAssignments = useBillStore((state) => state.setAssignments);

  /** i18n error key — translate in UI with `t(error, errorOptions)`. */
  const [error, setError] = useState<string | null>(null);
  const [errorOptions, setErrorOptions] = useState<
    Record<string, string | number> | undefined
  >(undefined);
  /** Local text drafts so typing decimals does not fight the store every keystroke. */
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const clearError = () => {
    setError(null);
    setErrorOptions(undefined);
  };

  const draftKey = (itemId: string, personId: string) => `${itemId}:${personId}`;

  const getQuantityDraft = (itemId: string, personId: string): string => {
    const key = draftKey(itemId, personId);
    if (key in drafts) {
      return drafts[key];
    }

    const existing = assignments.find(
      (assignment) => assignment.itemId === itemId && assignment.personId === personId,
    );

    return existing ? String(existing.quantity) : '';
  };

  const onChangeQuantityDraft = (itemId: string, personId: string, raw: string) => {
    setDrafts((current) => ({ ...current, [draftKey(itemId, personId)]: raw }));
    if (error) {
      clearError();
    }
  };

  /**
   * Commit one person qty to the store (on blur / submit).
   * Rejects the write if it would push the item over its quantity.
   */
  const commitQuantity = (item: BillItem, personId: string) => {
    const raw = getQuantityDraft(item.id, personId);
    const parsed = parseAssignmentQuantity(raw);

    if (!parsed.ok) {
      setError(parsed.errorKey);
      setErrorOptions(undefined);
      return;
    }

    const othersAssigned = assignments
      .filter(
        (assignment) =>
          assignment.itemId === item.id && assignment.personId !== personId,
      )
      .reduce((sum, assignment) => sum + assignment.quantity, 0);

    if (othersAssigned + parsed.quantity > item.quantity + 0.0001) {
      setError('errors.assignOverflow');
      setErrorOptions({
        qty: item.quantity,
        name: item.name,
        assigned: othersAssigned,
      });
      return;
    }

    upsertAssignment({
      itemId: item.id,
      personId,
      quantity: parsed.quantity,
    });

    setDrafts((current) => {
      const next = { ...current };
      delete next[draftKey(item.id, personId)];
      return next;
    });
    clearError();
  };

  const clearDraftsForItem = (itemId: string) => {
    setDrafts((current) => {
      const next = { ...current };
      for (const person of people) {
        delete next[draftKey(itemId, person.id)];
      }
      return next;
    });
  };

  const splitEqually = (item: BillItem) => {
    if (people.length === 0) {
      setError('errors.assignNeedPeople');
      setErrorOptions(undefined);
      return;
    }

    const quantities = buildEqualSplitQuantities(item.quantity, people.length);
    const nextForItem = people.map((person, index) => ({
      itemId: item.id,
      personId: person.id,
      quantity: quantities[index] ?? 0,
    }));

    setAssignments(replaceItemAssignments(assignments, item.id, nextForItem));
    clearDraftsForItem(item.id);
    clearError();
  };

  const assignAllTo = (item: BillItem, person: Person) => {
    const nextForItem = buildAssignAllToPerson(item, people, person.id);
    setAssignments(replaceItemAssignments(assignments, item.id, nextForItem));
    clearDraftsForItem(item.id);
    clearError();
  };

  const clearItem = (item: BillItem) => {
    setAssignments(replaceItemAssignments(assignments, item.id, []));
    clearDraftsForItem(item.id);
    clearError();
  };

  const itemStatuses = useMemo(
    () =>
      items.map((item) => ({
        item,
        status: getItemAssignmentStatus(item, assignments),
        remaining: getRemainingQuantity(item, assignments),
      })),
    [items, assignments],
  );

  const canContinue =
    items.length > 0 &&
    people.length > 0 &&
    itemStatuses.every((row) => row.status === 'complete');

  /** Food value already assigned vs full items subtotal (Stitch footer). */
  const assignedTotals = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const assigned = assignments.reduce((sum, row) => {
      const item = items.find((entry) => entry.id === row.itemId);
      if (!item) {
        return sum;
      }
      return sum + item.price * row.quantity;
    }, 0);
    return { assigned, total };
  }, [assignments, items]);

  const continueToCharges = () => {
    if (!canContinue) {
      setError('errors.assignIncomplete');
      setErrorOptions(undefined);
      return;
    }

    router.push('/bill/charges');
  };

  return {
    people,
    itemStatuses,
    assignedTotals,
    error,
    errorOptions,
    canContinue,
    getQuantityDraft,
    onChangeQuantityDraft,
    commitQuantity,
    splitEqually,
    assignAllTo,
    clearItem,
    continueToCharges,
  };
}
