import { StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { PressableCard } from '@/components/ui/PressableCard';
import { Radius, Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

type QuickActionRowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle: string;
  /** Which container pair tints the icon tile. */
  tone: 'primary' | 'tertiary';
  onPress: () => void;
};

/**
 * List-style navigation tile: tinted icon, title + hint, trailing chevron.
 * Rows read faster than square tiles and scale to more entries later.
 */
export function QuickActionRow({ icon, title, subtitle, tone, onPress }: QuickActionRowProps) {
  const { isRtl } = useI18n();
  const textColor = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const primaryBg = useThemeColor({}, 'primaryContainer');
  const primaryFg = useThemeColor({}, 'onPrimaryContainer');
  const tertiaryBg = useThemeColor({}, 'tertiaryContainer');
  const tertiaryFg = useThemeColor({}, 'onTertiaryContainer');

  const tint = tone === 'primary' ? { bg: primaryBg, fg: primaryFg } : { bg: tertiaryBg, fg: tertiaryFg };

  return (
    <PressableCard onPress={onPress} accessibilityLabel={title} style={styles.card}>
      <View style={[styles.icon, { backgroundColor: tint.bg }]}>
        <MaterialIcons name={icon} size={24} color={tint.fg} />
      </View>
      <View style={styles.text}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
        <Text style={[styles.subtitle, { color: muted }]} numberOfLines={1}>
          {subtitle}
        </Text>
      </View>
      {/* Chevron points toward the reading end, so it flips for Arabic. */}
      <MaterialIcons name={isRtl ? 'chevron-left' : 'chevron-right'} size={24} color={muted} />
    </PressableCard>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 13,
  },
});
