import { type ReactNode } from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';

import { Screen } from '@/components/ui/Screen';
import { BillTotalsCard } from '@/components/features/summary/BillTotalsCard';
import { PersonSummaryCard } from '@/components/features/summary/PersonSummaryCard';
import { Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { BillCalculationResult } from '@/types';

type SummaryBodyProps = {
  title: string;
  description: string;
  result: BillCalculationResult;
  footer: ReactNode;
};

/**
 * Shared totals + per-person list used by live summary and history detail.
 */
export function SummaryBody({ title, description, result, footer }: SummaryBodyProps) {
  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <Screen>
      <Text style={[styles.title, { color: titleColor }]} numberOfLines={2}>
        {title}
      </Text>
      <Text style={[styles.description, { color: mutedColor }]}>{description}</Text>

      <BillTotalsCard result={result} />

      <Text style={[styles.section, { color: titleColor }]}>
        {t('summary.perPerson', { count: result.people.length })}
      </Text>

      <FlatList
        data={result.people}
        keyExtractor={(person) => person.personId}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PersonSummaryCard person={item} />}
      />

      {footer}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: Spacing.xs,
  },
  section: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
  },
});
