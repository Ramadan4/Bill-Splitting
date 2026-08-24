/**
 * Parse item form strings into validated numeric input for the store.
 * Returns i18n error keys (not user-facing English) so UI can translate.
 */
import type { ItemFormValues } from '@/components/features/items/ItemForm';
import type { NewBillItemInput } from '@/utils/models';

export type ParsedItemForm =
  | { ok: true; value: NewBillItemInput }
  | { ok: false; errorKey: string };

/**
 * Convert UI form strings → store-ready item payload.
 * Why here: screens must not embed validation/business rules.
 */
export function parseItemFormValues(values: ItemFormValues): ParsedItemForm {
  const name = values.name.trim();
  const price = Number(values.price.replace(',', '.'));
  const quantity = Number(values.quantity.replace(',', '.'));

  if (!name) {
    return { ok: false, errorKey: 'errors.itemNameRequired' };
  }

  if (!Number.isFinite(price) || price < 0) {
    return { ok: false, errorKey: 'errors.itemPriceInvalid' };
  }

  if (!Number.isFinite(quantity) || quantity <= 0) {
    return { ok: false, errorKey: 'errors.itemQuantityInvalid' };
  }

  return {
    ok: true,
    value: { name, price, quantity },
  };
}

/** Empty form defaults for “add item” mode. */
export function createEmptyItemFormValues(): ItemFormValues {
  return {
    name: '',
    price: '',
    quantity: '1',
  };
}
