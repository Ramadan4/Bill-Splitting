import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { PRESS_SCALE, Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Bill } from '@/types';
import { calculateBill } from '@/utils/calculations';
import { formatBillDate } from '@/utils/formatBillDate';
import { formatMoney } from '@/utils/formatMoney';

type HistoryRowProps = {
  bill: Bill;
  onOpen: (billId: string) => void;
  onDelete: (billId: string) => void;
};

/**
 * One saved bill in history: name, date, total, open/delete.
 * The whole body is the open target so the tap area far exceeds 44dp.
 */
export function HistoryRow({ bill, onOpen, onDelete }: HistoryRowProps) {
  const { t, locale } = useI18n();
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const result = calculateBill(bill);
  const title = bill.name.trim() || t('history.untitled');

  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        onPress={() => onOpen(bill.id)}
        style={({ pressed }) => [
          styles.body,
          { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
        ]}>
        <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.meta, { color: mutedColor }]} numberOfLines={1}>
          {formatBillDate(bill.createdAt, locale)}
        </Text>
        <Text style={[styles.total, { color: textColor }]} numberOfLines={1}>
          {formatMoney(result.grandTotal, locale)}
        </Text>
      </Pressable>
      <View style={styles.actions}>
        <SecondaryButton
          label={t('common.delete')} icon="delete-outline"
          tone="danger"
          onPress={() => onDelete(bill.id)}
          style={styles.flex}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  body: {
    gap: Spacing.xs,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
  },
  meta: {
    fontSize: 13,
  },
  total: {
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
