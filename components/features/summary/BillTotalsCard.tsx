import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Card } from '@/components/ui/Card';
import { Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { trackingFor } from '@/utils/rtl';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { BillCalculationResult } from '@/types';
import { formatMoney } from '@/utils/formatMoney';

type BillTotalsCardProps = {
  result: BillCalculationResult;
  billName?: string;
};

/**
 * Stitch-style grand total hero card for the summary screen.
 */
export function BillTotalsCard({ result, billName }: BillTotalsCardProps) {
  const { t, locale, isRtl } = useI18n();
  const primary = useThemeColor({}, 'primary');
  const muted = useThemeColor({}, 'muted');

  return (
    <Card level={2} style={styles.hero}>
      <Text style={[styles.kicker, { color: muted, letterSpacing: trackingFor(isRtl, 1) }]}>{t('summary.grandTotal')}</Text>
      <Text style={[styles.amount, { color: primary }]} numberOfLines={1}>
        {formatMoney(result.grandTotal, locale)}
      </Text>
      <View style={styles.meta}>
        <MaterialIcons name="restaurant" size={16} color={muted} />
        <Text style={[styles.metaText, { color: muted }]} numberOfLines={1}>
          {billName?.trim() || t('home.brand')}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  kicker: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  amount: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaText: {
    fontSize: 14,
  },
});
