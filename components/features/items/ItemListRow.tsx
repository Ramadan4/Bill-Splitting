import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { BillItem } from '@/types';
import { getItemTotal } from '@/utils/calculations';
import { formatMoney } from '@/utils/formatMoney';

type ItemListRowProps = {
  item: BillItem;
  onEdit: (item: BillItem) => void;
  onDelete: (itemId: string) => void;
};

/**
 * One row in the items list: name, qty × price, line total, edit/delete.
 */
export function ItemListRow({ item, onEdit, onDelete }: ItemListRowProps) {
  const { t, locale } = useI18n();
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const lineTotal = getItemTotal(item.price, item.quantity);

  return (
    <Card>
      <View style={styles.meta}>
        <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.detail, { color: mutedColor }]} numberOfLines={1}>
          {item.quantity} × {formatMoney(item.price, locale)}
        </Text>
        <Text style={[styles.total, { color: textColor }]} numberOfLines={1}>
          {formatMoney(lineTotal, locale)}
        </Text>
      </View>
      <View style={styles.actions}>
        <SecondaryButton
          label={t('common.edit')}
          onPress={() => onEdit(item)}
          style={styles.flex}
        />
        <SecondaryButton
          label={t('common.delete')}
          tone="danger"
          onPress={() => onDelete(item.id)}
          style={styles.flex}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  meta: {
    gap: Spacing.xs,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  detail: {
    fontSize: 14,
  },
  total: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
