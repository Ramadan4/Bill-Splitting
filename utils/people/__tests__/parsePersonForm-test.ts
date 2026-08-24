/**
 * Unit tests for person form parsing (Step 4).
 */
import { parsePersonFormValues } from '@/utils/people/parsePersonForm';

describe('parsePersonFormValues', () => {
  it('trims a valid name', () => {
    expect(parsePersonFormValues({ name: '  Mohamed  ' })).toEqual({
      ok: true,
      name: 'Mohamed',
    });
  });

  it('rejects empty name', () => {
    const result = parsePersonFormValues({ name: '   ' });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errorKey).toBe('errors.personNameRequired');
    }
  });
});
