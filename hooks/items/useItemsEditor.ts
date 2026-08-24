/**
 * Items screen logic: form state + store CRUD + continue navigation.
 * Keeps `app/bill/items.tsx` presentational only.
 */
import { useState } from 'react';
import { useRouter } from 'expo-router';

import type { ItemFormValues } from '@/components/features/items/ItemForm';
import { EMPTY_ITEMS, useBillStore } from '@/store/billStore';
import type { BillItem } from '@/types';
import {
  createEmptyItemFormValues,
  parseItemFormValues,
} from '@/utils/items/parseItemForm';

export function useItemsEditor() {
  const router = useRouter();
  const items = useBillStore((state) => state.bill?.items ?? EMPTY_ITEMS);
  const inputMethod = useBillStore((state) => state.bill?.inputMethod ?? null);
  const receiptImageUri = useBillStore((state) => state.bill?.receiptImageUri ?? null);
  const addItem = useBillStore((state) => state.addItem);
  const updateItem = useBillStore((state) => state.updateItem);
  const removeItem = useBillStore((state) => state.removeItem);

  const [values, setValues] = useState<ItemFormValues>(createEmptyItemFormValues);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  /** i18n error key — translate in UI with `t(error)`. */
  const [error, setError] = useState<string | null>(null);

  const isEditing = editingItemId !== null;

  const onChange = (patch: Partial<ItemFormValues>) => {
    setValues((current) => ({ ...current, ...patch }));
    if (error) {
      setError(null);
    }
  };

  const resetForm = () => {
    setValues(createEmptyItemFormValues());
    setEditingItemId(null);
    setError(null);
  };

  const startEdit = (item: BillItem) => {
    setEditingItemId(item.id);
    setValues({
      name: item.name,
      price: String(item.price),
      quantity: String(item.quantity),
    });
    setError(null);
  };

  const submit = () => {
    const parsed = parseItemFormValues(values);

    if (!parsed.ok) {
      setError(parsed.errorKey);
      return;
    }

    try {
      if (editingItemId) {
        updateItem(editingItemId, parsed.value);
      } else {
        addItem(parsed.value);
      }
      resetForm();
    } catch {
      setError('errors.itemSaveFailed');
    }
  };

  const onDelete = (itemId: string) => {
    if (editingItemId === itemId) {
      resetForm();
    }
    removeItem(itemId);
  };

  const canContinue = items.length > 0;

  const continueToPeople = () => {
    if (!canContinue) {
      setError('errors.itemNeedOne');
      return;
    }

    router.push('/bill/people');
  };

  return {
    items,
    inputMethod,
    receiptImageUri,
    values,
    error,
    isEditing,
    canContinue,
    onChange,
    submit,
    startEdit,
    cancelEdit: resetForm,
    onDelete,
    continueToPeople,
  };
}
