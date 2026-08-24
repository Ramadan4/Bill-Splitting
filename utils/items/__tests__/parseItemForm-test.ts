/**
 * Unit tests for item form parsing (Step 3).
 */
import { parseItemFormValues } from '@/utils/items/parseItemForm';

describe('parseItemFormValues', () => {
  it('parses a valid item', () => {
    const result = parseItemFormValues({
      name: ' Pizza ',
      price: '300',
      quantity: '2',
    });

    expect(result).toEqual({
      ok: true,
      value: { name: 'Pizza', price: 300, quantity: 2 },
    });
  });

  it('accepts comma decimals', () => {
    const result = parseItemFormValues({
      name: 'Tea',
      price: '12,5',
      quantity: '1',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.price).toBe(12.5);
    }
  });

  it('rejects empty name', () => {
    const result = parseItemFormValues({
      name: '  ',
      price: '10',
      quantity: '1',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorKey).toBe('errors.itemNameRequired');
    }
  });

  it('rejects non-positive quantity', () => {
    const result = parseItemFormValues({
      name: 'Cola',
      price: '50',
      quantity: '0',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorKey).toBe('errors.itemQuantityInvalid');
    }
  });
});
