import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { SPLITEAT_LOGO_URI } from '@/constants/colors';
import { PRESS_SCALE, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useThemeColor } from '@/hooks/use-theme-color';

type AppTopBarProps = {
  onPressBrand?: () => void;
  onPressTranslate?: () => void;
  title?: string;
};

/**
 * Stitch top app bar: restaurant icon, logo + SplitEat, translate.
 */
export function AppTopBar({ onPressBrand, onPressTranslate, title = 'SplitEat' }: AppTopBarProps) {
  const primary = useThemeColor({}, 'primary');
  const muted = useThemeColor({}, 'muted');
  const surfaceVariant = useThemeColor({}, 'surfaceContainerHigh');
  const { trigger } = useHaptics();

  return (
    <View style={styles.bar}>
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          trigger('light');
          onPressBrand?.();
        }}
        style={({ pressed }) => [
          styles.iconBtn,
          { backgroundColor: pressed ? surfaceVariant : 'transparent' },
          { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
        ]}>
        <MaterialIcons name="restaurant" size={24} color={primary} />
      </Pressable>

      <View style={styles.brand}>
        <Image source={{ uri: SPLITEAT_LOGO_URI }} style={styles.logo} accessibilityLabel="SplitEat" />
        <Text style={[styles.title, { color: primary }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          trigger('light');
          onPressTranslate?.();
        }}
        style={({ pressed }) => [
          styles.iconBtn,
          { backgroundColor: pressed ? surfaceVariant : 'transparent' },
          { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
        ]}>
        <MaterialIcons name="translate" size={24} color={muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.container,
    paddingVertical: Spacing.md,
  },
  iconBtn: {
    width: TOUCH_TARGET,
    height: TOUCH_TARGET,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: Radius.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
});
