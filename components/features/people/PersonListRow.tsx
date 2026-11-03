import { StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { Person } from '@/types';

type PersonListRowProps = {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (personId: string) => void;
};

/**
 * One row in the people list: name + edit/delete actions.
 */
export function PersonListRow({ person, onEdit, onDelete }: PersonListRowProps) {
  const { t } = useI18n();
  const textColor = useThemeColor({}, 'text');

  return (
    <Card>
      <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
        {person.name}
      </Text>
      <View style={styles.actions}>
        <SecondaryButton
          label={t('common.edit')} icon="edit"
          onPress={() => onEdit(person)}
          style={styles.flex}
        />
        <SecondaryButton
          label={t('common.delete')} icon="delete-outline"
          tone="danger"
          onPress={() => onDelete(person.id)}
          style={styles.flex}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 17,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
