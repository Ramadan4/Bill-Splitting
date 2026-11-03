import { FlatList, StyleSheet, Text, View } from 'react-native';

import { GroupForm } from '@/components/features/groups/GroupForm';
import { GroupListRow } from '@/components/features/groups/GroupListRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { KEYBOARD_SCROLL_PROPS } from '@/components/ui/keyboardScroll';
import { KeyboardScreen } from '@/components/ui/KeyboardScreen';
import { SkeletonList } from '@/components/ui/Skeleton';
import { Spacing } from '@/constants/layout';
import { useGroupsEditor } from '@/hooks/groups/useGroupsEditor';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Manage reusable people groups.
 */
export function GroupsEditor() {
  const {
    groups,
    isLoading,
    values,
    members,
    error,
    isEditing,
    onChange,
    addMemberDraft,
    removeMember,
    submit,
    startEdit,
    cancelEdit,
    onDelete,
  } = useGroupsEditor();

  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <KeyboardScreen scroll={false}>
      <FlatList
        data={isLoading ? [] : groups}
        keyExtractor={(group) => group.id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        {...KEYBOARD_SCROLL_PROPS}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: titleColor }]}>{t('groups.title')}</Text>
            <Text style={[styles.description, { color: mutedColor }]}>
              {t('groups.description')}
            </Text>
            <GroupForm
              values={values}
              members={members}
              error={error ? t(error) : null}
              submitLabel={isEditing ? t('common.saveChanges') : t('groups.addGroup')}
              onChange={onChange}
              onAddMember={addMemberDraft}
              onRemoveMember={removeMember}
              onSubmit={() => {
                void submit();
              }}
              onCancel={isEditing ? cancelEdit : undefined}
            />
            <Text style={[styles.section, { color: titleColor }]}>
              {t('groups.listTitle', { count: groups.length })}
            </Text>
          </View>
        }
        ListEmptyComponent={
          isLoading ? <SkeletonList count={2} /> : <EmptyState title={t('groups.empty')} />
        }
        renderItem={({ item }) => (
          <GroupListRow
            group={item}
            onEdit={startEdit}
            onDelete={(id) => {
              void onDelete(id);
            }}
          />
        )}
      />
    </KeyboardScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: Spacing.md,
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
  section: {
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
