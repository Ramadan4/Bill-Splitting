/**
 * Typed JSON wrapper around AsyncStorage.
 * This is the only module that talks to the storage driver directly, so stores
 * stay pure state and swapping the driver touches one file.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { StorageKey } from '@/services/storage/keys';

/**
 * Reads and parses a stored JSON value.
 * Returns null when the key is unset or the payload is unreadable, so callers
 * fall back to their defaults instead of crashing on corrupt storage.
 */
export async function readJson<T>(key: StorageKey): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Serializes and stores a value.
 * Errors intentionally propagate: callers surface a save-failed message rather
 * than reporting success on data that never persisted.
 */
export async function writeJson(key: StorageKey, value: unknown): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
