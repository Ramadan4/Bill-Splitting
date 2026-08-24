import { createPersonGroup, uniqueTrimmedNames } from '@/utils/models';

describe('uniqueTrimmedNames', () => {
  it('trims, drops blanks, and de-dupes case-insensitively', () => {
    expect(uniqueTrimmedNames([' Mohamed ', '', 'mohamed', 'Ahmed'])).toEqual([
      'Mohamed',
      'Ahmed',
    ]);
  });
});

describe('createPersonGroup', () => {
  it('creates a group with unique members', () => {
    const group = createPersonGroup(' Flatmates ', ['Mohamed', 'Ahmed']);
    expect(group.name).toBe('Flatmates');
    expect(group.memberNames).toEqual(['Mohamed', 'Ahmed']);
    expect(group.id.startsWith('group_')).toBe(true);
  });

  it('rejects empty names', () => {
    expect(() => createPersonGroup('  ', ['Mohamed'])).toThrow(/name/i);
  });

  it('rejects groups with no members', () => {
    expect(() => createPersonGroup('Team', ['  '])).toThrow(/member/i);
  });
});
