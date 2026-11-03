import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LocaleThemeControls } from '@/components/features/settings/LocaleThemeControls';
import { Button } from '@/components/ui/Button';
import { Radius, Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import { nativeDirectionMismatch } from '@/utils/rtl';

type SettingsSheetProps = {
  visible: boolean;
  onClose: () => void;
};

/**
 * Bottom sheet holding language + theme preferences.
 *
 * RN `Modal` renders in its own native window, so it does NOT inherit the root
 * `direction` style — we set it here or Arabic would lay out LTR inside the sheet.
 */
export function SettingsSheet({ visible, onClose }: SettingsSheetProps) {
  const { t, locale, isRtl } = useI18n();
  const insets = useSafeAreaInsets();
  const overlay = useThemeColor({}, 'overlay');
  const surface = useThemeColor({}, 'surface');
  const border = useThemeColor({}, 'border');
  const handle = useThemeColor({}, 'surfaceContainerHigh');
  const textColor = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.root, { direction: isRtl ? 'rtl' : 'ltr' }]}>
        {/* Tap outside to dismiss — standard sheet affordance. */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('settings.done')}
          onPress={onClose}
          style={[StyleSheet.absoluteFill, { backgroundColor: overlay }]}
        />
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: surface,
              borderColor: border,
              paddingBottom: insets.bottom + Spacing.lg,
            },
          ]}>
          <View style={[styles.handle, { backgroundColor: handle }]} />
          <Text style={[styles.title, { color: textColor }]}>{t('settings.title')}</Text>

          <LocaleThemeControls />

          {nativeDirectionMismatch(locale) ? (
            <Text style={[styles.hint, { color: muted }]}>{t('settings.rtlReloadHint')}</Text>
          ) : null}

          <Button label={t('settings.done')} onPress={onClose} style={styles.done} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: Spacing.container,
    paddingTop: Spacing.sm,
    gap: Spacing.sm,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: Radius.pill,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  hint: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: Spacing.xs,
  },
  done: {
    marginTop: Spacing.lg,
  },
});
