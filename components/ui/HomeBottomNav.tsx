import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CTA_HEIGHT, PRESS_SCALE, Radius, Spacing } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

export type HomeTab = 'history' | 'split' | 'groups' | 'profile';

type HomeBottomNavProps = {
  active: HomeTab;
  onSelect: (tab: HomeTab) => void;
};

const TABS: { id: HomeTab; icon: keyof typeof MaterialIcons.glyphMap; labelKey: string }[] = [
  { id: 'history', icon: 'history', labelKey: 'nav.history' },
  { id: 'split', icon: 'receipt', labelKey: 'nav.split' },
  { id: 'groups', icon: 'group', labelKey: 'nav.groups' },
  { id: 'profile', icon: 'person', labelKey: 'nav.profile' },
];

/**
 * Stitch bottom nav — Split tab is the elevated primary chip.
 */
export function HomeBottomNav({ active, onSelect }: HomeBottomNavProps) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { trigger } = useHaptics();
  const muted = useThemeColor({}, 'muted');
  const surface = useThemeColor({}, 'surfaceContainer');
  const border = useThemeColor({}, 'border');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const onPrimaryContainer = useThemeColor({}, 'onPrimaryContainer');

  return (
    <View
      style={[
        styles.nav,
        {
          backgroundColor: surface,
          borderTopColor: border,
          paddingBottom: Math.max(insets.bottom, Spacing.sm),
        },
      ]}>
      {TABS.map((tab) => {
        const selected = tab.id === active;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => {
              trigger('light');
              onSelect(tab.id);
            }}
            style={({ pressed }) => [
              styles.item,
              selected && { backgroundColor: primaryContainer },
              { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
            ]}>
            <MaterialIcons
              name={tab.icon}
              size={22}
              color={selected ? onPrimaryContainer : muted}
            />
            <Text
              style={[
                styles.label,
                { color: selected ? onPrimaryContainer : muted },
              ]}
              numberOfLines={1}>
              {t(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: Radius.lg,
    borderTopRightRadius: Radius.lg,
  },
  item: {
    minHeight: CTA_HEIGHT - 8,
    minWidth: 72,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
});
