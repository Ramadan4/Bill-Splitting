import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { depth, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

export type HomeTab = 'history' | 'split' | 'groups' | 'settings';

type HomeBottomNavProps = {
  active: HomeTab;
  onSelect: (tab: HomeTab) => void;
};

const TABS: { id: HomeTab; icon: keyof typeof MaterialIcons.glyphMap; labelKey: string }[] = [
  { id: 'split', icon: 'receipt-long', labelKey: 'nav.split' },
  { id: 'history', icon: 'history', labelKey: 'nav.history' },
  { id: 'groups', icon: 'group', labelKey: 'nav.groups' },
  { id: 'settings', icon: 'settings', labelKey: 'nav.settings' },
];

/**
 * Floating pill nav (2026 style): a rounded bar hovering above the content,
 * with a tinted pill behind the active tab's icon.
 * Labels are sentence-case with no tracking — uppercase/letter-spacing has no
 * meaning in Arabic and breaks its cursive letter joins.
 */
export function HomeBottomNav({ active, onSelect }: HomeBottomNavProps) {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const { trigger } = useHaptics();
  const muted = useThemeColor({}, 'muted');
  const textColor = useThemeColor({}, 'text');
  const surface = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const shadow = useThemeColor({}, 'shadow');
  const indicator = useThemeColor({}, 'primaryContainer');
  const onIndicator = useThemeColor({}, 'onPrimaryContainer');

  return (
    // Outer view reserves the home-indicator inset; inner bar floats above it.
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, Spacing.md) }]}>
      <View
        style={[styles.nav, { backgroundColor: surface, borderColor: border }, depth(2, shadow)]}>
        {TABS.map((tab) => {
          const selected = tab.id === active;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={t(tab.labelKey)}
              onPress={() => {
                trigger('light');
                onSelect(tab.id);
              }}
              style={styles.item}>
              {({ pressed }) => (
                <>
                  <View
                    style={[
                      styles.indicator,
                      selected && { backgroundColor: indicator },
                      { transform: [{ scale: pressed ? 0.92 : 1 }] },
                    ]}>
                    <MaterialIcons
                      name={tab.icon}
                      size={22}
                      color={selected ? onIndicator : muted}
                    />
                  </View>
                  <Text
                    style={[
                      styles.label,
                      { color: selected ? textColor : muted, fontWeight: selected ? '700' : '500' },
                    ]}
                    numberOfLines={1}>
                    {t(tab.labelKey)}
                  </Text>
                </>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: Spacing.container,
    paddingTop: Spacing.xs,
  },
  nav: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    borderRadius: Radius.xl + 4,
    borderWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flex: 1,
    minHeight: TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  indicator: {
    width: 56,
    height: 30,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
  },
});
