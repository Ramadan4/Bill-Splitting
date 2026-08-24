/**
 * Local storage keys.
 * Keys are versioned (`.v1`) so a future schema change can migrate instead of
 * silently misreading an older payload.
 */
export const StorageKeys = {
  history: 'spliteat.history.v1',
  groups: 'spliteat.groups.v1',
  preferences: 'spliteat.preferences.v1',
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];
