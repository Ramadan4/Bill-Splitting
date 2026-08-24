import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { PersonGroup } from '@/types';

type GroupListRowProps = {
  group: PersonGroup;
  onEdit: (group: PersonGroup) => void;
  onDelete: (groupId: string) => void;
};

/**
 * One saved group: name, members, edit/delete.
 * Member list is capped at two lines so a large group cannot push the actions
 * off screen on small devices.
 */
export function GroupListRow({ group, onEdit, onDelete }: GroupListRowProps) {
  const { t } = useI18n();
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <Card>
      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {group.name}
      </Text>
      <Text style={[styles.members, { color: mutedColor }]} numberOfLines={2}>
        {group.memberNames.join(' · ')}
      </Text>
      <View style={styles.actions}>
        <SecondaryButton
          label={t('common.edit')}
          onPress={() => onEdit(group)}
          style={styles.flex}
        />
        <SecondaryButton
          label={t('common.delete')}
          tone="danger"
          onPress={() => onDelete(group.id)}
          style={styles.flex}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 17,
    fontWeight: '700',
  },
  members: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
