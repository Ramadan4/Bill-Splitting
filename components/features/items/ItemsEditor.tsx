import { FlatList, StyleSheet, Text, View } from 'react-native';

import { ItemForm } from '@/components/features/items/ItemForm';
import { ItemListRow } from '@/components/features/items/ItemListRow';
import { ReceiptPreview } from '@/components/features/receipt/ReceiptPreview';
import { ActionDock } from '@/components/ui/ActionDock';
import { EmptyState } from '@/components/ui/EmptyState';
import { KEYBOARD_SCROLL_PROPS } from '@/components/ui/keyboardScroll';
import { KeyboardScreen } from '@/components/ui/KeyboardScreen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Spacing } from '@/constants/layout';
import { useItemsEditor } from '@/hooks/items/useItemsEditor';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import { getItemTotal } from '@/utils/calculations';
import { formatMoney } from '@/utils/formatMoney';

/**
 * Items feature UI: add/edit/delete bill lines, then continue to people.
 * The list is the scroller so the form stays reachable while the keyboard is open.
 */
export function ItemsEditor() {
  const {
    items,
    inputMethod,
    receiptImageUri,
    values,
    error,
    isEditing,
    canContinue,
    onChange,
    submit,
    startEdit,
    cancelEdit,
    onDelete,
    continueToPeople,
  } = useItemsEditor();

  const { t, locale } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  const subtotal = items.reduce(
    (sum, item) => sum + getItemTotal(item.price, item.quantity),
    0,
  );

  const methodHint =
    inputMethod === 'receipt' ? t('items.hintReceipt') : t('items.hintManual');

  return (
    <KeyboardScreen scroll={false}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        {...KEYBOARD_SCROLL_PROPS}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: titleColor }]}>{t('items.title')}</Text>
            <Text style={[styles.description, { color: mutedColor }]}>{methodHint}</Text>

            {receiptImageUri ? <ReceiptPreview uri={receiptImageUri} compact /> : null}

            <ItemForm
              values={values}
              error={error ? t(error) : null}
              submitLabel={isEditing ? t('common.saveChanges') : t('items.addItem')}
              onChange={onChange}
              onSubmit={submit}
              onCancel={isEditing ? cancelEdit : undefined}
            />

            <View style={styles.listHeader}>
              <Text style={[styles.sectionTitle, { color: titleColor }]}>
                {t('items.listTitle', { count: items.length })}
              </Text>
              {items.length > 0 ? (
                <Text style={[styles.subtotal, { color: mutedColor }]}>
                  {t('items.subtotal', { amount: formatMoney(subtotal, locale) })}
                </Text>
              ) : null}
            </View>
          </View>
        }
        ListEmptyComponent={<EmptyState title={t('items.empty')} />}
        renderItem={({ item }) => (
          <ItemListRow item={item} onEdit={startEdit} onDelete={onDelete} />
        )}
      />

      <ActionDock>
        <PrimaryButton
          label={t('items.continuePeople')}
          onPress={continueToPeople}
          disabled={!canContinue}
        />
      </ActionDock>
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.md,
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
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtotal: {
    fontSize: 14,
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
