import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TextField } from '@/components/ui/TextField';
import { PRESS_SCALE, Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Person } from '@/types';

type PersonQtyRowProps = {
  person: Person;
  quantityText: string;
  onChangeText: (raw: string) => void;
  onCommit: () => void;
  onAssignAll: () => void;
};

/**
 * One person row inside an item card: qty input + “all” shortcut.
 */
export function PersonQtyRow({
  person,
  quantityText,
  onChangeText,
  onCommit,
  onAssignAll,
}: PersonQtyRowProps) {
  const { t } = useI18n();
  const { trigger } = useHaptics();
  const tint = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({}, 'border');

  return (
    <View style={styles.row}>
      <View style={styles.field}>
        <TextField
          label={person.name}
          value={quantityText}
          onChangeText={onChangeText}
          onBlur={onCommit}
          onSubmitEditing={onCommit}
          placeholder="0"
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${t('common.all')} — ${person.name}`}
        onPress={() => {
          trigger('light');
          onAssignAll();
        }}
        style={({ pressed }) => [
          styles.allButton,
          { borderColor, transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
        ]}>
        <Text style={[styles.allLabel, { color: tint }]} numberOfLines={1}>
          {t('common.all')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  field: {
    flex: 1,
  },
  // Matches the adjacent input height so the row bottom-aligns cleanly.
  allButton: {
    minWidth: TOUCH_TARGET,
    minHeight: TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
  },
  allLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
});
