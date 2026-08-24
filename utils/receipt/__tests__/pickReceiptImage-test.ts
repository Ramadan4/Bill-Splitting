/**
 * Lightweight tests for receipt pick result typing (no native picker in Jest).
 * The picker wrappers are thin; integration is verified on device/simulator.
 */
import type { ReceiptPickResult } from '@/utils/receipt/pickReceiptImage';

describe('ReceiptPickResult contract', () => {
  it('accepts a successful uri payload', () => {
    const result: ReceiptPickResult = { ok: true, uri: 'file:///tmp/receipt.jpg' };
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.uri).toContain('receipt');
    }
  });

  it('accepts denied / cancelled failures', () => {
    const denied: ReceiptPickResult = { ok: false, reason: 'denied' };
    const cancelled: ReceiptPickResult = { ok: false, reason: 'cancelled' };
    expect(denied.ok).toBe(false);
    expect(cancelled.ok).toBe(false);
  });
});
