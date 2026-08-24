import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { PersonBillBreakdown } from '@/types';
import { formatMoney } from '@/utils/formatMoney';

type PersonSummaryCardProps = {
  person: PersonBillBreakdown;
};

/**
 * Per-person summary: item lines + food/service/tax/delivery/total.
 */
export function PersonSummaryCard({ person }: PersonSummaryCardProps) {
  const { t, locale } = useI18n();
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const borderColor = useThemeColor({}, 'border');

  return (
    <Card>
      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {person.personName}
      </Text>

      {person.itemLines.length === 0 ? (
        <Text style={[styles.empty, { color: mutedColor }]}>
          {t('summary.noAssignedItems')}
        </Text>
      ) : (
        person.itemLines.map((line) => (
          <MetaRow
            key={`${person.personId}-${line.itemId}`}
            label={`${line.itemName} × ${line.assignedQuantity}`}
            value={formatMoney(line.amount, locale)}
            mutedColor={mutedColor}
            textColor={textColor}
          />
        ))
      )}

      <View style={[styles.divider, { backgroundColor: borderColor }]} />
      <MetaRow
        label={t('summary.food')}
        value={formatMoney(person.foodSubtotal, locale)}
        mutedColor={mutedColor}
        textColor={textColor}
      />
      <MetaRow
        label={t('summary.service')}
        value={formatMoney(person.serviceCharge, locale)}
        mutedColor={mutedColor}
        textColor={textColor}
      />
      <MetaRow
        label={t('summary.tax')}
        value={formatMoney(person.tax, locale)}
        mutedColor={mutedColor}
        textColor={textColor}
      />
      {person.deliveryCharge > 0 ? (
        <MetaRow
          label={t('summary.delivery')}
          value={formatMoney(person.deliveryCharge, locale)}
          mutedColor={mutedColor}
          textColor={textColor}
        />
      ) : null}
      <MetaRow
        label={t('summary.total')}
        value={formatMoney(person.total, locale)}
        mutedColor={mutedColor}
        textColor={textColor}
        bold
      />
    </Card>
  );
}

/** Label/value pair; long item names truncate rather than pushing the amount. */
function MetaRow({
  label,
  value,
  mutedColor,
  textColor,
  bold,
}: {
  label: string;
  value: string;
  mutedColor: string;
  textColor: string;
  bold?: boolean;
}) {
  return (
    <View style={styles.line}>
      <Text
        numberOfLines={1}
        style={[styles.lineLabel, { color: mutedColor, fontWeight: bold ? '700' : '500' }]}>
        {label}
      </Text>
      <Text
        numberOfLines={1}
        style={[styles.lineValue, { color: textColor, fontWeight: bold ? '800' : '600' }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: Spacing.xs,
  },
  empty: {
    fontSize: 13,
  },
  line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  lineLabel: {
    fontSize: 13,
    flex: 1,
  },
  lineValue: {
    fontSize: 13,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.xs,
  },
});
