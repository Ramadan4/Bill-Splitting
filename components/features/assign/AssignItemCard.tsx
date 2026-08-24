import { StyleSheet, Text, View } from 'react-native';

import { PersonQtyRow } from '@/components/features/assign/PersonQtyRow';
import { Badge, type BadgeTone } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Spacing } from '@/constants/layout';
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
  getQuantityDraft: (personId: string) => string;
  onChangeQuantityDraft: (personId: string, raw: string) => void;
  onCommitQuantity: (personId: string) => void;
  onSplitEqually: () => void;
  onAssignAllTo: (person: Person) => void;
  onClear: () => void;
};

/** Maps assignment completeness to a badge tone. */
const STATUS_TONES: Record<ItemAssignmentStatus, BadgeTone> = {
  complete: 'success',
  over: 'danger',
  under: 'neutral',
  empty: 'neutral',
};

/**
 * One item card: header + per-person qty rows + equal-split / clear actions.
 */
export function AssignItemCard({
  item,
  people,
  status,
  remaining,
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

  const statusLabel = (() => {
    switch (status) {
      case 'complete':
        return t('assign.statusComplete');
      case 'over':
        return t('assign.statusOver', { count: Math.abs(remaining) });
      case 'under':
        return t('assign.statusUnder', { count: remaining });
      default:
        return t('assign.statusNone');
    }
  })();

  return (
    <Card>
      <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={[styles.meta, { color: mutedColor }]} numberOfLines={1}>
        {item.quantity} × {formatMoney(item.price, locale)} ={' '}
        {formatMoney(getItemTotal(item.price, item.quantity), locale)}
      </Text>
      <Badge label={statusLabel} tone={STATUS_TONES[status]} />

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
    </Card>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    fontWeight: '700',
  },
  meta: {
    fontSize: 14,
  },
  people: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  flex: {
    flex: 1,
  },
});
