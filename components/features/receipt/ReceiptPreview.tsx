import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

type ReceiptPreviewProps = {
  uri: string;
  /** Compact banner used on the items screen. */
  compact?: boolean;
};

/**
 * Visual receipt preview only — never feeds the calculation engine.
 * Later OCR can read the same URI without changing this component’s role.
 */
export function ReceiptPreview({ uri, compact = false }: ReceiptPreviewProps) {
  const { t } = useI18n();
  const borderColor = useThemeColor({}, 'border');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <View style={[styles.wrap, compact && styles.compactWrap, { borderColor }]}>
      <Image
        source={{ uri }}
        style={compact ? styles.compactImage : styles.image}
        contentFit="contain"
        accessibilityLabel={t('receipt.previewA11y')}
      />
      <Text style={[styles.caption, { color: mutedColor }]}>{t('items.hintReceipt')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    gap: 8,
    paddingBottom: 10,
  },
  compactWrap: {
    marginBottom: 4,
  },
  image: {
    width: '100%',
    height: 280,
    backgroundColor: '#00000010',
  },
  compactImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#00000010',
  },
  caption: {
    fontSize: 12,
    paddingHorizontal: 12,
  },
});
