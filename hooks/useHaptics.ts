/**
 * Tactile feedback for pressable UI.
 * Haptics are unsupported on web and non-critical everywhere, so failures are
 * swallowed rather than surfaced to the user.
 */
import { useCallback } from 'react';
import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

export type HapticTone = 'light' | 'success' | 'warning';

export function useHaptics() {
  const trigger = useCallback((tone: HapticTone = 'light') => {
    if (Platform.OS === 'web') {
      return;
    }

    try {
      if (tone === 'light') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      }

      const style =
        tone === 'success'
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning;
      void Haptics.notificationAsync(style);
    } catch {
      // Device without a taptic engine — ignore.
    }
  }, []);

  return { trigger };
}
