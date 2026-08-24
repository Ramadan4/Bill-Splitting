import { FlatList, StyleSheet, Text, View } from 'react-native';

import { GroupPicker } from '@/components/features/people/GroupPicker';
import { PersonForm } from '@/components/features/people/PersonForm';
import { PersonListRow } from '@/components/features/people/PersonListRow';
import { ActionDock } from '@/components/ui/ActionDock';
import { EmptyState } from '@/components/ui/EmptyState';
import { KEYBOARD_SCROLL_PROPS } from '@/components/ui/keyboardScroll';
import { KeyboardScreen } from '@/components/ui/KeyboardScreen';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Spacing } from '@/constants/layout';
import { usePeopleEditor } from '@/hooks/people/usePeopleEditor';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * People feature UI: add/edit/delete diners, then continue to assign.
 * The list is the scroller so the form stays reachable while the keyboard is open.
 */
export function PeopleEditor() {
  const {
    people,
    groups,
    values,
    error,
    isEditing,
    canContinue,
    onChange,
    submit,
    startEdit,
    cancelEdit,
    onDelete,
    addGroupToBill,
    continueToAssign,
  } = usePeopleEditor();

  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <KeyboardScreen scroll={false}>
      <FlatList
        data={people}
        keyExtractor={(person) => person.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        {...KEYBOARD_SCROLL_PROPS}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: titleColor }]}>{t('people.title')}</Text>
            <Text style={[styles.description, { color: mutedColor }]}>
              {t('people.description')}
            </Text>

            <GroupPicker groups={groups} onSelect={addGroupToBill} />

            <PersonForm
              values={values}
              error={error ? t(error) : null}
              submitLabel={isEditing ? t('common.saveChanges') : t('people.addPerson')}
              onChange={onChange}
              onSubmit={submit}
              onCancel={isEditing ? cancelEdit : undefined}
            />

            <Text style={[styles.sectionTitle, { color: titleColor }]}>
              {t('people.listTitle', { count: people.length })}
            </Text>
          </View>
        }
        ListEmptyComponent={<EmptyState title={t('people.empty')} />}
        renderItem={({ item }) => (
          <PersonListRow person={item} onEdit={startEdit} onDelete={onDelete} />
        )}
      />

      <ActionDock>
        <PrimaryButton
          label={t('people.continueAssign')}
          onPress={continueToAssign}
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: Spacing.xs,
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
