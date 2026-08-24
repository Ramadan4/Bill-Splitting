import { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { HistoryRow } from '@/components/features/history/HistoryRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Screen } from '@/components/ui/Screen';
import { SkeletonList } from '@/components/ui/Skeleton';
import { Spacing } from '@/constants/layout';
import { useBillHistory } from '@/hooks/history/useBillHistory';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Saved-bills list (view + delete).
 * Shows row-shaped skeletons while the persisted history hydrates so the
 * layout does not shift once the real rows arrive.
 */
export function HistoryList() {
  const { bills, isLoading, deleteBill, openBill } = useBillHistory();
  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  return (
    <Screen>
      <Text style={[styles.title, { color: titleColor }]}>{t('history.title')}</Text>
      <Text style={[styles.description, { color: mutedColor }]}>
        {t('history.description')}
      </Text>

      {isLoading ? (
        <View style={styles.list}>
          <SkeletonList count={3} />
        </View>
      ) : (
        <FlatList
          data={bills}
          keyExtractor={(bill) => bill.id}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState title={t('history.empty')} />}
          renderItem={({ item }) => (
            <HistoryRow
              bill={item}
              onOpen={openBill}
              onDelete={setPendingDeleteId}
            />
          )}
        />
      )}

      <Modal
        visible={pendingDeleteId !== null}
        title={t('common.confirmTitle')}
        message={t('common.confirmDeleteBill')}
        confirmLabel={t('common.delete')}
        cancelLabel={t('common.cancel')}
        tone="danger"
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            void deleteBill(pendingDeleteId);
          }
          setPendingDeleteId(null);
        }}
      />
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
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
    flexGrow: 1,
  },
});
