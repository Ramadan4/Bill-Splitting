import { parseMoneyAmount } from '@/utils/charges/parseMoney';

describe('parseMoneyAmount', () => {
  it('treats blank as 0', () => {
    expect(parseMoneyAmount('', 'errors.deliveryCostInvalid')).toEqual({
      ok: true,
      value: 0,
    });
  });

  it('accepts decimals with a comma', () => {
    expect(parseMoneyAmount('12,5', 'errors.deliveryCostInvalid')).toEqual({
      ok: true,
      value: 12.5,
    });
  });

  it('rejects negatives', () => {
    expect(parseMoneyAmount('-1', 'errors.deliveryCostInvalid')).toEqual({
      ok: false,
      errorKey: 'errors.deliveryCostInvalid',
    });
  });
});
