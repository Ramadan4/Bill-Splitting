import { type ReactNode } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useResponsive } from '@/hooks/useResponsive';
import { useThemeColor } from '@/hooks/use-theme-color';

type ScreenProps = ViewProps & {
  children: ReactNode;
};

/**
 * Full-screen themed container (light/dark background).
 * Mirrors layout with the active locale so Arabic flips without a native reload.
 *
 * The outer view paints the background edge to edge while the inner view holds
 * padding and caps its width, which keeps content in a centered reading column
 * on tablets instead of stretching across the whole display.
 *
 * Safe-area padding is applied *after* the caller's `style` so a screen can
 * never accidentally override the notch / home-indicator inset.
 */
export function Screen({ children, style, ...rest }: ScreenProps) {
  const backgroundColor = useThemeColor({}, 'background');
  const { isRtl } = useI18n();
  const insets = useSafeAreaInsets();
  const { contentMaxWidth } = useResponsive();

  return (
    <View
      style={[styles.root, { backgroundColor, direction: isRtl ? 'rtl' : 'ltr' }]}
      {...rest}>
      <View
        style={[
          styles.content,
          style,
          {
            maxWidth: contentMaxWidth,
            // Keep content clear of the gesture bar and landscape notches.
            paddingBottom: insets.bottom + Spacing.lg,
            paddingLeft: Spacing.container + insets.left,
            paddingRight: Spacing.container + insets.right,
          },
        ]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    paddingTop: Spacing.lg,
    gap: Spacing.bento,
  },
});
