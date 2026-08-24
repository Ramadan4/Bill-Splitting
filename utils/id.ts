/**
 * Lightweight unique ids for local entities (no backend yet).
 * Format: prefix + timestamp + random suffix to avoid collisions in one session.
 */
export function createId(prefix: string): string {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${random}`;
}
