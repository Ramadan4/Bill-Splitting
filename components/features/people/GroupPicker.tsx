import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PRESS_SCALE, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { PersonGroup } from '@/types';

type GroupPickerProps = {
  groups: PersonGroup[];
  onSelect: (group: PersonGroup) => void;
};

/**
 * One-tap add of a saved group onto the current bill.
 * Chips wrap onto new lines so many groups never overflow a narrow screen.
 */
export function GroupPicker({ groups, onSelect }: GroupPickerProps) {
  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const borderColor = useThemeColor({}, 'border');
  const cardColor = useThemeColor({}, 'card');
  const primary = useThemeColor({}, 'primary');
  const { trigger } = useHaptics();

  if (groups.length === 0) {
    return null;
  }

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: titleColor }]}>{t('people.addFromGroup')}</Text>
      <View style={styles.row}>
        {groups.map((group) => (
          <Pressable
            key={group.id}
            accessibilityRole="button"
            accessibilityLabel={group.name}
            onPress={() => {
              trigger('light');
              onSelect(group);
            }}
            style={({ pressed }) => [
              styles.chip,
              {
                borderColor,
                backgroundColor: cardColor,
                transform: [{ scale: pressed ? PRESS_SCALE : 1 }],
              },
            ]}>
            <Text style={[styles.chipLabel, { color: primary }]} numberOfLines={1}>
              {group.name}
            </Text>
            <Text style={[styles.count, { color: mutedColor }]} numberOfLines={1}>
              {t('people.groupCount', { count: group.memberNames.length })}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  chip: {
    minHeight: TOUCH_TARGET,
    maxWidth: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: 2,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  count: {
    fontSize: 12,
  },
});
