import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { CTA_HEIGHT, depth, PRESS_SCALE, Radius, Spacing } from '@/constants/layout';
import { useHaptics } from '@/hooks/useHaptics';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

type HeroCardProps = {
  onCreateBill: () => void;
};

/**
 * Brand-colored hero with the primary "create bill" action inside it.
 * Putting the CTA in the hero makes the single most common task the most
 * prominent thing on screen (instead of a detached button above the nav).
 */
export function HeroCard({ onCreateBill }: HeroCardProps) {
  const { t } = useI18n();
  const { trigger } = useHaptics();
  const primary = useThemeColor({}, 'brand');
  const onPrimary = useThemeColor({}, 'onBrand');
  // Darker orange for the CTA label so it stays readable on the white pill.
  const ctaText = useThemeColor({}, 'primary');
  const shadow = useThemeColor({}, 'shadow');

  return (
    <View style={[styles.card, { backgroundColor: primary }, depth(2, shadow)]}>
      {/* Decorative bubbles give the flat fill some depth without a gradient dependency. */}
      <View style={[styles.bubble, styles.bubbleLarge, { backgroundColor: onPrimary }]} />
      <View style={[styles.bubble, styles.bubbleSmall, { backgroundColor: onPrimary }]} />

      <View style={[styles.iconWrap, { backgroundColor: onPrimary }]}>
        <MaterialIcons name="receipt-long" size={22} color={primary} />
      </View>

      <Text style={[styles.title, { color: onPrimary }]}>{t('home.heroTitle')}</Text>
      <Text style={[styles.body, { color: onPrimary }]}>{t('home.heroBody')}</Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          trigger('light');
          onCreateBill();
        }}
        style={({ pressed }) => [
          styles.cta,
          { backgroundColor: onPrimary, transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
        ]}>
        <MaterialIcons name="add" size={22} color={ctaText} />
        <Text style={[styles.ctaLabel, { color: ctaText }]} numberOfLines={1}>
          {t('home.createBill')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.xl + 4,
    padding: Spacing.lg + 4,
    gap: Spacing.sm,
    overflow: 'hidden',
  },
  bubble: {
    position: 'absolute',
    borderRadius: Radius.pill,
    opacity: 0.08,
  },
  // `end`/`start` (not right/left) so the decoration mirrors in RTL.
  bubbleLarge: {
    width: 220,
    height: 220,
    top: -90,
    end: -70,
  },
  bubbleSmall: {
    width: 110,
    height: 110,
    bottom: -40,
    end: 60,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  cta: {
    marginTop: Spacing.md,
    height: CTA_HEIGHT,
    borderRadius: Radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ctaLabel: {
    fontSize: 17,
    fontWeight: '700',
  },
});
