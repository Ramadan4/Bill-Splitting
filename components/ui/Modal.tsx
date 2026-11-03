import { Modal as RNModal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Radius, Spacing, TOUCH_TARGET } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

type ModalProps = {
  visible: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Destructive confirms (delete) use the danger variant. */
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
};

/**
 * Centered confirm dialog over a dim overlay.
 * Used for irreversible actions so a fat-finger delete cannot wipe a bill.
 */
export function Modal({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  tone = 'default',
  onConfirm,
  onCancel,
}: ModalProps) {
  const { isRtl } = useI18n();
  const overlay = useThemeColor({}, 'overlay');
  const cardColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={cancelLabel}
        onPress={onCancel}
        // RN Modal is a separate native window and ignores the root `direction`, so set it here.
        style={[styles.overlay, { backgroundColor: overlay, direction: isRtl ? 'rtl' : 'ltr' }]}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          style={[styles.sheet, { backgroundColor: cardColor, borderColor }]}>
          <Text style={[styles.title, { color: textColor }]}>{title}</Text>
          {message ? (
            <Text style={[styles.message, { color: mutedColor }]}>{message}</Text>
          ) : null}
          <View style={styles.actions}>
            <Button label={cancelLabel} variant="secondary" onPress={onCancel} style={styles.flex} />
            <Button
              label={confirmLabel}
              variant={tone === 'danger' ? 'danger' : 'primary'}
              onPress={onConfirm}
              style={styles.flex}
            />
          </View>
        </Pressable>
      </Pressable>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  sheet: {
    minHeight: TOUCH_TARGET,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  message: {
    fontSize: 15,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  flex: {
    flex: 1,
  },
});
