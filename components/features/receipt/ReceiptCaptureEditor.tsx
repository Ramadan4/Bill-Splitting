import { Image } from 'expo-image';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { ErrorBanner } from '@/components/ui/ErrorBanner';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { SecondaryButton } from '@/components/ui/SecondaryButton';
import { CTA_HEIGHT, PRESS_SCALE, Radius, Spacing, depth } from '@/constants/layout';
import { useReceiptCapture } from '@/hooks/receipt/useReceiptCapture';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { trackingFor } from '@/utils/rtl';
import { useThemeColor } from '@/hooks/use-theme-color';

/**
 * Stitch Scan Receipt screen: frame guide, take/gallery cards, gated Continue.
 */
export function ReceiptCaptureEditor() {
  const {
    receiptImageUri,
    error,
    isBusy,
    extractedCount,
    takePhoto,
    chooseFromLibrary,
    clearPhoto,
    continueToItems,
  } = useReceiptCapture();

  const { t, isRtl } = useI18n();
  const { trigger } = useHaptics();
  const titleColor = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primary = useThemeColor({}, 'primary');
  const card = useThemeColor({}, 'card');
  const border = useThemeColor({}, 'border');
  const shadow = useThemeColor({}, 'shadow');
  const surfaceContainer = useThemeColor({}, 'surfaceContainer');
  const secondaryContainer = useThemeColor({}, 'secondaryContainer');
  const success = useThemeColor({}, 'success');
  const hasPhoto = Boolean(receiptImageUri);

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={[styles.title, { color: primary }]}>{t('receipt.title')}</Text>

        <View style={[styles.hintPill, { backgroundColor: surfaceContainer }]}>
          <MaterialIcons name="crop-free" size={16} color={primary} />
          <Text style={[styles.hintText, { color: muted, letterSpacing: trackingFor(isRtl, 0.4) }]} numberOfLines={1}>
            {t('receipt.positionHint')}
          </Text>
        </View>

        <View style={[styles.viewport, { backgroundColor: surfaceContainer, borderColor: border }]}>
          <View style={[styles.corner, styles.tl, { borderColor: primary }]} />
          <View style={[styles.corner, styles.tr, { borderColor: primary }]} />
          <View style={[styles.corner, styles.bl, { borderColor: primary }]} />
          <View style={[styles.corner, styles.br, { borderColor: primary }]} />

          {hasPhoto && receiptImageUri ? (
            <Image
              source={{ uri: receiptImageUri }}
              style={styles.preview}
              contentFit="contain"
              accessibilityLabel={t('receipt.previewA11y')}
            />
          ) : (
            <View style={[styles.overlayCard, { backgroundColor: card }, depth(1, shadow)]}>
              <View style={[styles.overlayIcon, { backgroundColor: secondaryContainer }]}>
                <MaterialIcons name="receipt" size={28} color={primary} />
              </View>
              <Text style={[styles.overlayTitle, { color: primary }]}>
                {t('receipt.captureTitle')}
              </Text>
              <Text style={[styles.overlayBody, { color: muted }]}>
                {t('receipt.captureBody')}
              </Text>
            </View>
          )}
        </View>

        {isBusy ? (
          <Text style={[styles.status, { color: muted }]}>{t('receipt.extracting')}</Text>
        ) : null}

        {extractedCount > 0 ? (
          <Text style={[styles.status, { color: success }]}>
            {t('receipt.extractedCount', { count: extractedCount })}
          </Text>
        ) : null}

        <ErrorBanner message={error ? t(error) : null} />

        <View style={styles.actionRow}>
          <CaptureChoice
            icon="photo-camera"
            label={isBusy ? t('common.opening') : t('receipt.takePhoto')}
            tint={secondaryContainer}
            iconColor={primary}
            cardColor={card}
            shadow={shadow}
            textColor={titleColor}
            disabled={isBusy}
            onPress={() => {
              trigger('light');
              takePhoto();
            }}
          />
          <CaptureChoice
            icon="image"
            label={t('receipt.chooseGallery')}
            tint={surfaceContainer}
            iconColor={muted}
            cardColor={card}
            shadow={shadow}
            textColor={titleColor}
            disabled={isBusy}
            onPress={() => {
              trigger('light');
              chooseFromLibrary();
            }}
          />
        </View>

        {hasPhoto ? (
          <SecondaryButton
            label={t('receipt.removePhoto')} icon="delete-outline"
            tone="danger"
            onPress={clearPhoto}
            disabled={isBusy}
          />
        ) : null}

        <View style={styles.footer}>
          <PrimaryButton
            label={t('receipt.continueItems')}
            onPress={continueToItems}
            disabled={isBusy || !hasPhoto}
          />
          {!hasPhoto ? (
            <SecondaryButton
              label={t('receipt.skipManual')}
              onPress={continueToItems}
              disabled={isBusy}
            />
          ) : null}
        </View>
      </ScrollView>
    </Screen>
  );
}

function CaptureChoice({
  icon,
  label,
  tint,
  iconColor,
  cardColor,
  shadow,
  textColor,
  disabled,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  tint: string;
  iconColor: string;
  cardColor: string;
  shadow: string;
  textColor: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        { backgroundColor: cardColor },
        depth(1, shadow),
        {
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed && !disabled ? PRESS_SCALE : 1 }],
        },
      ]}>
      <View style={[styles.choiceIcon, { backgroundColor: tint }]}>
        <MaterialIcons name={icon} size={22} color={iconColor} />
      </View>
      <Text style={[styles.choiceLabel, { color: textColor }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: Spacing.bento,
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  hintPill: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.pill,
  },
  hintText: {
    fontSize: 12,
    fontWeight: '600',
  },
  viewport: {
    height: 320,
    borderRadius: Radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  preview: {
    width: '100%',
    height: '100%',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    zIndex: 2,
  },
  tl: { top: 16, left: 16, borderTopWidth: 3, borderLeftWidth: 3 },
  tr: { top: 16, right: 16, borderTopWidth: 3, borderRightWidth: 3 },
  bl: { bottom: 16, left: 16, borderBottomWidth: 3, borderLeftWidth: 3 },
  br: { bottom: 16, right: 16, borderBottomWidth: 3, borderRightWidth: 3 },
  overlayCard: {
    width: '78%',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  overlayIcon: {
    width: 52,
    height: 52,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  overlayBody: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.bento,
  },
  choice: {
    flex: 1,
    minHeight: CTA_HEIGHT,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  choiceIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  choiceLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  footer: {
    marginTop: 'auto',
    gap: Spacing.sm,
  },
});
