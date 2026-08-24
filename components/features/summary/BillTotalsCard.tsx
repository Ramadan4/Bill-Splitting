import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { BillCalculationResult } from '@/types';
import { formatMoney } from '@/utils/formatMoney';

type BillTotalsCardProps = {
  result: BillCalculationResult;
};

/**
 * Top summary card: bill-level totals + balanced badge.
 * Rendered at depth 2 so it reads as the focal tile of the summary screen.
 */
export function BillTotalsCard({ result }: BillTotalsCardProps) {
  const { t, locale } = useI18n();
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const borderColor = useThemeColor({}, 'border');

  return (
    <Card level={2}>
      <Badge
        tone={result.isBalanced ? 'success' : 'danger'}
        label={
          result.isBalanced
            ? t('summary.balanced')
            : t('summary.notBalanced', {
                amount: formatMoney(result.balanceDifference, locale),
              })
        }
      />
      <Row
        label={t('summary.foodSubtotal')}
        value={formatMoney(result.subtotal, locale)}
        mutedColor={mutedColor}
        textColor={textColor}
      />
      <Row
        label={t('summary.service')}
        value={formatMoney(result.serviceCharge, locale)}
        mutedColor={mutedColor}
        textColor={textColor}
      />
      <Row
        label={t('summary.tax')}
        value={formatMoney(result.tax, locale)}
        mutedColor={mutedColor}
        textColor={textColor}
      />
      {result.delivery > 0 ? (
        <Row
          label={t('summary.delivery')}
          value={formatMoney(result.delivery, locale)}
          mutedColor={mutedColor}
          textColor={textColor}
        />
      ) : null}
      <View style={[styles.divider, { backgroundColor: borderColor }]} />
      <Row
        label={t('summary.grandTotal')}
        value={formatMoney(result.grandTotal, locale)}
        mutedColor={mutedColor}
        textColor={textColor}
        bold
      />
    </Card>
  );
}

/** Label/value pair; the label flexes and truncates so the amount never wraps. */
function Row({
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
    <View style={styles.row}>
      <Text
        numberOfLines={1}
        style={[styles.label, { color: mutedColor, fontWeight: bold ? '700' : '500' }]}>
        {label}
      </Text>
      <Text
        numberOfLines={1}
        style={[styles.value, { color: textColor, fontWeight: bold ? '800' : '600' }]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  label: {
    fontSize: 14,
    flexShrink: 1,
  },
  value: {
    fontSize: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginVertical: Spacing.xs,
  },
});
