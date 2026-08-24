import { Platform } from 'react-native';

/**
 * Shared ScrollView / FlatList props so the screen behind an open keyboard
 * can still scroll, and dragging dismisses the keyboard.
 */
export const KEYBOARD_SCROLL_PROPS = {
  keyboardShouldPersistTaps: 'handled' as const,
  keyboardDismissMode: Platform.OS === 'ios' ? ('interactive' as const) : ('on-drag' as const),
};
