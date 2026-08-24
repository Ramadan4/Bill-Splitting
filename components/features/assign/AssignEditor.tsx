import { FlatList, StyleSheet, Text, View } from 'react-native';

import { AssignItemCard } from '@/components/features/assign/AssignItemCard';
import { ActionDock } from '@/components/ui/ActionDock';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { KEYBOARD_SCROLL_PROPS } from '@/components/ui/keyboardScroll';
import { KeyboardScreen } from '@/components/ui/KeyboardScreen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Spacing } from '@/constants/layout';
import { useAssignEditor } from '@/hooks/assign/useAssignEditor';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Assign feature UI: set who owes which item quantities, then continue.
 */
export function AssignEditor() {
  const {
    people,
    itemStatuses,
    error,
    errorOptions,
    canContinue,
    getQuantityDraft,
    onChangeQuantityDraft,
    commitQuantity,
    splitEqually,
    assignAllTo,
    clearItem,
    continueToCharges,
  } = useAssignEditor();

  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <KeyboardScreen scroll={false}>
      <FlatList
        data={itemStatuses}
        keyExtractor={(row) => row.item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        {...KEYBOARD_SCROLL_PROPS}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: titleColor }]}>{t('assign.title')}</Text>
            <Text style={[styles.description, { color: mutedColor }]}>
              {t('assign.description')}
            </Text>
            <ErrorBanner message={error ? t(error, errorOptions) : null} />
          </View>
        }
        ListEmptyComponent={<EmptyState title={t('assign.empty')} />}
        renderItem={({ item: row }) => (
          <AssignItemCard
            item={row.item}
            people={people}
            status={row.status}
            remaining={row.remaining}
            getQuantityDraft={(personId) => getQuantityDraft(row.item.id, personId)}
            onChangeQuantityDraft={(personId, raw) =>
              onChangeQuantityDraft(row.item.id, personId, raw)
            }
            onCommitQuantity={(personId) => commitQuantity(row.item, personId)}
            onSplitEqually={() => splitEqually(row.item)}
            onAssignAllTo={(person) => assignAllTo(row.item, person)}
            onClear={() => clearItem(row.item)}
          />
        )}
      />

      <ActionDock>
        <PrimaryButton
          label={t('assign.continueCharges')}
          onPress={continueToCharges}
          disabled={!canContinue}
        />
      </ActionDock>
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.sm,
    paddingBottom: Spacing.sm,
  },
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
