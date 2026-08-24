/**
 * Unit tests for percentage parsing (Step 6).
 */
import { parsePercentage } from '@/utils/charges/parsePercentage';

describe('parsePercentage', () => {
  it('treats blank as 0', () => {
    expect(parsePercentage('', 'service')).toEqual({ ok: true, value: 0 });
  });

  it('parses valid percentages', () => {
    expect(parsePercentage('10', 'service')).toEqual({ ok: true, value: 10 });
    expect(parsePercentage('14,5', 'tax')).toEqual({ ok: true, value: 14.5 });
  });

  it('rejects values outside 0–100', () => {
    const low = parsePercentage('-1', 'service');
    expect(low.ok).toBe(false);
    if (!low.ok) {
      expect(low.errorKey).toBe('errors.servicePercentage');
    }

    const high = parsePercentage('101', 'tax');
    expect(high.ok).toBe(false);
    if (!high.ok) {
      expect(high.errorKey).toBe('errors.taxPercentage');
    }
  });
});
