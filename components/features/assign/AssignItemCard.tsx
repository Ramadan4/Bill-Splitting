import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { PersonQtyRow } from '@/components/features/assign/PersonQtyRow';
import { Card } from '@/components/ui/Card';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { PRESS_SCALE, Radius, Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { BillItem, Person } from '@/types';
import type { ItemAssignmentStatus } from '@/utils/assign/assignmentMath';
import { formatMoney } from '@/utils/formatMoney';
import { getItemTotal } from '@/utils/calculations';

type AssignItemCardProps = {
  item: BillItem;
  people: Person[];
  status: ItemAssignmentStatus;
  remaining: number;
  expanded: boolean;
  onToggleExpand: () => void;
  getQuantityDraft: (personId: string) => string;
  onChangeQuantityDraft: (personId: string, raw: string) => void;
  onCommitQuantity: (personId: string) => void;
  onSplitEqually: () => void;
  onAssignAllTo: (person: Person) => void;
  onClear: () => void;
};

/**
 * Stitch-style item row: price, assignment status, expand for qty editing.
 */
export function AssignItemCard({
  item,
  people,
  status,
  remaining,
  expanded,
  onToggleExpand,
  getQuantityDraft,
  onChangeQuantityDraft,
  onCommitQuantity,
  onSplitEqually,
  onAssignAllTo,
  onClear,
}: AssignItemCardProps) {
  const { t, locale } = useI18n();
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onPrimary');
  const danger = useThemeColor({}, 'danger');
  const surfaceContainer = useThemeColor({}, 'surfaceContainer');
  const border = useThemeColor({}, 'border');
  const secondaryContainer = useThemeColor({}, 'secondaryContainer');
  const onSecondaryContainer = useThemeColor({}, 'onSecondaryContainer');

  const assignedPeople = people.filter((person) => {
    const qty = Number(getQuantityDraft(person.id));
    return Number.isFinite(qty) && qty > 0;
  });

  const statusLabel = (() => {
    switch (status) {
      case 'complete':
        return assignedPeople.length === people.length && people.length > 1
          ? t('assign.splitEqually') + ` (${people.length})`
          : t('assign.statusComplete');
      case 'over':
        return t('assign.statusOver', { count: Math.abs(remaining) });
      case 'under':
        return t('assign.statusUnder', { count: remaining });
      default:
        return t('assign.statusNone');
    }
  })();

  const statusColor =
    status === 'empty' || status === 'under'
      ? danger
      : status === 'over'
        ? danger
        : mutedColor;

  return (
    <Card
      style={
        expanded
          ? { borderColor: primary, borderWidth: 1.5 }
          : undefined
      }>
      <Pressable
        accessibilityRole="button"
        onPress={onToggleExpand}
        style={({ pressed }) => [
          styles.header,
          { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
        ]}>
        <View style={styles.copy}>
          <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={[styles.price, { color: primary }]} numberOfLines={1}>
            {formatMoney(getItemTotal(item.price, item.quantity), locale)}
          </Text>

          {assignedPeople.length > 0 && status !== 'empty' ? (
            <View style={styles.assignees}>
              {assignedPeople.slice(0, 3).map((person, index) => (
                <View
                  key={person.id}
                  style={[
                    styles.miniAvatar,
                    {
                      backgroundColor: secondaryContainer,
                      marginStart: index === 0 ? 0 : -8,
                    },
                  ]}>
                  <Text style={[styles.miniInitial, { color: onSecondaryContainer }]}>
                    {person.name.trim().charAt(0).toUpperCase() || '?'}
                  </Text>
                </View>
              ))}
              <Text style={[styles.assigneeNames, { color: mutedColor }]} numberOfLines={1}>
                {assignedPeople.map((person) => person.name).join(', ')}
              </Text>
            </View>
          ) : (
            <View style={styles.statusRow}>
              {status === 'empty' ? (
                <MaterialIcons name="error" size={14} color={danger} />
              ) : (
                <MaterialIcons name="pie-chart" size={14} color={statusColor} />
              )}
              <Text style={[styles.status, { color: statusColor }]} numberOfLines={1}>
                {statusLabel}
              </Text>
            </View>
          )}
        </View>

        <View
          style={[
            styles.actionOrb,
            {
              backgroundColor: status === 'complete' ? primary : surfaceContainer,
              borderColor: border,
            },
          ]}>
          <MaterialIcons
            name={status === 'complete' ? 'check' : 'add'}
            size={22}
            color={status === 'complete' ? onPrimary : mutedColor}
          />
        </View>
      </Pressable>

      {expanded ? (
        <View style={styles.editor}>
          <View style={styles.people}>
            {people.map((person) => (
              <PersonQtyRow
                key={person.id}
                person={person}
                quantityText={getQuantityDraft(person.id)}
                onChangeText={(raw) => onChangeQuantityDraft(person.id, raw)}
                onCommit={() => onCommitQuantity(person.id)}
                onAssignAll={() => onAssignAllTo(person)}
              />
            ))}
          </View>
          <View style={styles.actions}>
            <SecondaryButton
              label={t('assign.splitEqually')}
              onPress={onSplitEqually}
              style={styles.flex}
            />
            <SecondaryButton label={t('common.clear')} onPress={onClear} style={styles.flex} />
          </View>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  copy: {
    flex: 1,
    gap: Spacing.xs,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
  assignees: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniInitial: {
    fontSize: 11,
    fontWeight: '700',
  },
  assigneeNames: {
    flex: 1,
    fontSize: 13,
  },
  actionOrb: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  editor: {
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  people: {
    gap: Spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
