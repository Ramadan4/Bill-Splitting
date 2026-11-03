import { Pressable, StyleSheet, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter, type NativeStackHeaderProps } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { depth, HIT_SLOP, PRESS_SCALE, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * JS stack header: a round back button on the leading edge, nothing else
 * (each screen renders its own page title).
 *
 * Why not the native header:
 * - The first screen of a nested stack (bill/create, history) got no back
 *   button natively; `router.canGoBack()` checks the whole navigation tree.
 * - The native bar only mirrors for Arabic after a cold restart; this view
 *   lives under the root `direction` style, so it flips instantly.
 * - iOS 26 wraps native bar buttons in glass and can overlap content.
 */
export function AppHeader(_props: NativeStackHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { t, isRtl } = useI18n();
  const { trigger } = useHaptics();
  const background = useThemeColor({}, 'background');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const shadow = useThemeColor({}, 'shadow');

  const canGoBack = router.canGoBack();

  return (
    <View style={[styles.bar, { backgroundColor: background, paddingTop: insets.top + Spacing.xs }]}>
      {canGoBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
          hitSlop={HIT_SLOP}
          onPress={() => {
            trigger('light');
            router.back();
          }}
          style={({ pressed }) => [
            styles.back,
            { backgroundColor: card, borderColor: border },
            depth(1, shadow),
            { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
          ]}>
          {/* Arrow points toward the start edge, so it mirrors for Arabic. */}
          <MaterialIcons
            name={isRtl ? 'arrow-forward-ios' : 'arrow-back-ios-new'}
            size={18}
            color={textColor}
          />
        </Pressable>
      ) : (
        // Keep header height stable on root screens with nothing to go back to.
        <View style={styles.back} />
      )}
    </View>
  );
}

/** `header` render prop for stack `screenOptions`. */
export function renderAppHeader(props: NativeStackHeaderProps) {
  return <AppHeader {...props} />;
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.container,
    paddingBottom: Spacing.xs,
  },
  back: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: Radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
