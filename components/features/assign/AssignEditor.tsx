import { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { AssignItemCard } from '@/components/features/assign/AssignItemCard';
import { ActionDock } from '@/components/ui/ActionDock';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { KEYBOARD_SCROLL_PROPS } from '@/components/ui/keyboardScroll';
import { KeyboardScreen } from '@/components/ui/KeyboardScreen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { PRESS_SCALE, Radius, Spacing } from '@/constants/layout';
import { useAssignEditor } from '@/hooks/assign/useAssignEditor';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatMoney } from '@/utils/formatMoney';

/**
 * Stitch Assign Items: diner chips, item cards, assigned-total footer + Continue.
 */
export function AssignEditor() {
  const {
    people,
    itemStatuses,
    assignedTotals,
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

  const { t, locale } = useI18n();
  const { trigger } = useHaptics();
  const [filterPersonId, setFilterPersonId] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const onPrimary = useThemeColor({}, 'onBrand');
  const brand = useThemeColor({}, 'brand');
  const border = useThemeColor({}, 'border');
  const secondaryContainer = useThemeColor({}, 'secondaryContainer');
  const onSecondaryContainer = useThemeColor({}, 'onSecondaryContainer');
  const tertiaryContainer = useThemeColor({}, 'tertiaryContainer');
  const onTertiaryContainer = useThemeColor({}, 'onTertiaryContainer');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const onPrimaryContainer = useThemeColor({}, 'onPrimaryContainer');

  const accentPairs = [
    { bg: primaryContainer, fg: onPrimaryContainer },
    { bg: secondaryContainer, fg: onSecondaryContainer },
    { bg: tertiaryContainer, fg: onTertiaryContainer },
  ];

  const visibleRows = useMemo(() => {
    if (!filterPersonId) {
      return itemStatuses;
    }
    return itemStatuses.filter((row) => {
      const draftPeople = people.filter((person) => {
        const qty = Number(getQuantityDraft(row.item.id, person.id));
        return person.id === filterPersonId && qty > 0;
      });
      return draftPeople.length > 0 || row.status === 'empty';
    });
  }, [filterPersonId, getQuantityDraft, itemStatuses, people]);

  return (
    <KeyboardScreen scroll={false}>
      <FlatList
        data={visibleRows}
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

            <View style={styles.diners}>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  trigger('light');
                  setFilterPersonId(null);
                }}
                style={({ pressed }) => [
                  styles.diner,
                  {
                    transform: [{ scale: pressed ? PRESS_SCALE : 1 }],
                  },
                ]}>
                <View
                  style={[
                    styles.avatar,
                    {
                      backgroundColor: brand,
                      borderColor: brand,
                      borderWidth: filterPersonId === null ? 3 : 0,
                    },
                  ]}>
                  <MaterialIcons name="groups" size={20} color={onPrimary} />
                </View>
                <Text style={[styles.dinerLabel, { color: mutedColor }]} numberOfLines={1}>
                  {t('assign.filterAll')}
                </Text>
              </Pressable>

              {people.map((person, index) => {
                const accent = accentPairs[index % accentPairs.length];
                const selected = filterPersonId === person.id;
                const initial = person.name.trim().charAt(0).toUpperCase() || '?';
                return (
                  <Pressable
                    key={person.id}
                    accessibilityRole="button"
                    onPress={() => {
                      trigger('light');
                      setFilterPersonId(person.id);
                    }}
                    style={({ pressed }) => [
                      styles.diner,
                      { transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
                    ]}>
                    <View
                      style={[
                        styles.avatar,
                        {
                          backgroundColor: accent.bg,
                          borderColor: primary,
                          borderWidth: selected ? 3 : 0,
                        },
                      ]}>
                      <Text style={[styles.initial, { color: accent.fg }]}>{initial}</Text>
                    </View>
                    <Text style={[styles.dinerLabel, { color: mutedColor }]} numberOfLines={1}>
                      {person.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

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
            expanded={expandedItemId === row.item.id}
            onToggleExpand={() =>
              setExpandedItemId((current) => (current === row.item.id ? null : row.item.id))
            }
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
        <View style={[styles.footerRow, { borderTopColor: border }]}>
          <View style={styles.footerMeta}>
            <Text style={[styles.footerLabel, { color: mutedColor }]}>
              {t('assign.totalAssigned')}
            </Text>
            <Text style={[styles.footerValue, { color: titleColor }]} numberOfLines={1}>
              {formatMoney(assignedTotals.assigned, locale)} /{' '}
              {formatMoney(assignedTotals.total, locale)}
            </Text>
          </View>
          <PrimaryButton
            label={t('assign.continueCharges')}
            onPress={continueToCharges}
            disabled={!canContinue}
            style={styles.continue}
          />
        </View>
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
    fontSize: 22,
    fontWeight: '700',
  },
  description: {
    fontSize: 15,
    lineHeight: 21,
  },
  diners: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  diner: {
    width: 56,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: 18,
    fontWeight: '700',
  },
  dinerLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.bento,
    paddingBottom: Spacing.sm,
    flexGrow: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: Spacing.md,
  },
  footerMeta: {
    flex: 1,
    gap: 2,
  },
  footerLabel: {
    fontSize: 12,
  },
  footerValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  continue: {
    flexShrink: 0,
    minWidth: 132,
    paddingHorizontal: Spacing.lg,
  },
});
