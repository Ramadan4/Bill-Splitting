import { type ReactNode } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { BillTotalsCard } from '@/components/features/summary/BillTotalsCard';
import { PersonSummaryCard } from '@/components/features/summary/PersonSummaryCard';
import { Screen } from '@/components/ui/Screen';
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

      <BillTotalsCard result={result} billName={title} />

      <View style={styles.sectionRow}>
        <Text style={[styles.section, { color: titleColor }]}>{t('summary.breakdown')}</Text>
        <Text style={[styles.count, { color: mutedColor }]}>
          {t('summary.peopleCount', { count: result.people.length })}
        </Text>
      </View>

      <FlatList
        data={result.people}
        keyExtractor={(person) => person.personId}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <PersonSummaryCard person={item} accentIndex={index} defaultExpanded={index === 0} />
        )}
      />

      {footer}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  section: {
    fontSize: 20,
    fontWeight: '600',
  },
  count: {
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.bento,
    paddingBottom: Spacing.sm,
  },
});
