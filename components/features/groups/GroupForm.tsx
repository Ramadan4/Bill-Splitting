import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { TextField } from '@/components/ui/TextField';
import type { GroupFormValues } from '@/utils/groups/parseGroupForm';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

type GroupFormProps = {
  values: GroupFormValues;
  members: string[];
  error: string | null;
  submitLabel: string;
  onChange: (patch: Partial<GroupFormValues>) => void;
  onAddMember: () => void;
  onRemoveMember: (name: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
};

/**
 * Presentational group form: name + member chips + save.
 */
export function GroupForm({
  values,
  members,
  error,
  submitLabel,
  onChange,
  onAddMember,
  onRemoveMember,
  onSubmit,
  onCancel,
}: GroupFormProps) {
  const { t } = useI18n();
  const dangerColor = useThemeColor({}, 'danger');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');
  const borderColor = useThemeColor({}, 'border');
  const cardColor = useThemeColor({}, 'card');

  return (
    <View style={styles.form}>
      <TextField
        label={t('groups.nameLabel')}
        value={values.name}
        onChangeText={(name) => onChange({ name })}
        placeholder={t('groups.namePlaceholder')}
        autoCapitalize="words"
      />
      <View style={styles.memberRow}>
        <View style={styles.field}>
          <TextField
            label={t('groups.memberLabel')}
            value={values.memberDraft}
            onChangeText={(memberDraft) => onChange({ memberDraft })}
            placeholder={t('groups.memberPlaceholder')}
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={onAddMember}
          />
        </View>
        <SecondaryButton label={t('groups.addMember')} onPress={onAddMember} />
      </View>
      {members.length > 0 ? (
        <View style={styles.chips}>
          {members.map((member) => (
            <Pressable
              key={member}
              accessibilityRole="button"
              onPress={() => onRemoveMember(member)}
              style={[styles.chip, { borderColor, backgroundColor: cardColor }]}>
              <Text style={{ color: textColor }}>{member}</Text>
              <Text style={{ color: mutedColor }}> ×</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {error ? <Text style={[styles.error, { color: dangerColor }]}>{error}</Text> : null}
      <View style={styles.actions}>
        <PrimaryButton label={submitLabel} onPress={onSubmit} style={styles.flex} />
        {onCancel ? (
          <SecondaryButton label={t('common.cancel')} onPress={onCancel} style={styles.flex} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 12,
  },
  memberRow: {
    gap: 8,
  },
  field: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  error: {
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  flex: {
    flex: 1,
  },
});
