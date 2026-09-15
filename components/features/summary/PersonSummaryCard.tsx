import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { Card } from '@/components/ui/Card';
import { PRESS_SCALE, Radius, Spacing } from '@/constants/layout';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { PersonBillBreakdown } from '@/types';
import { formatMoney } from '@/utils/formatMoney';

type PersonSummaryCardProps = {
  person: PersonBillBreakdown;
  /** Rotates avatar tint across people in the list. */
  accentIndex?: number;
  defaultExpanded?: boolean;
};

/**
 * Stitch person breakdown card with avatar + expandable details.
 */
export function PersonSummaryCard({
  person,
  accentIndex = 0,
  defaultExpanded = false,
}: PersonSummaryCardProps) {
  const { t, locale } = useI18n();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const textColor = useThemeColor({}, 'text');
  const muted = useThemeColor({}, 'muted');
  const border = useThemeColor({}, 'border');
  const primary = useThemeColor({}, 'primary');
  const primaryContainer = useThemeColor({}, 'primaryContainer');
  const onPrimaryContainer = useThemeColor({}, 'onPrimaryContainer');
  const secondaryContainer = useThemeColor({}, 'secondaryContainer');
  const onSecondaryContainer = useThemeColor({}, 'onSecondaryContainer');
  const tertiaryContainer = useThemeColor({}, 'tertiaryContainer');
  const onTertiaryContainer = useThemeColor({}, 'onTertiaryContainer');

  const accents = [
    { bg: primaryContainer, fg: onPrimaryContainer },
    { bg: secondaryContainer, fg: onSecondaryContainer },
    { bg: tertiaryContainer, fg: onTertiaryContainer },
  ];
  const accent = accents[accentIndex % accents.length];
  const initial = person.personName.trim().charAt(0).toUpperCase() || '?';

  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        onPress={() => setExpanded((value) => !value)}
        style={({ pressed }) => [
          styles.header,
          { borderBottomColor: border, transform: [{ scale: pressed ? PRESS_SCALE : 1 }] },
        ]}>
        <View style={styles.identity}>
          <View style={[styles.avatar, { backgroundColor: accent.bg }]}>
            <Text style={[styles.initial, { color: accent.fg }]}>{initial}</Text>
          </View>
          <View style={styles.nameBlock}>
            <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
              {person.personName}
            </Text>
            <Text style={[styles.total, { color: primary }]} numberOfLines={1}>
              {formatMoney(person.total, locale)}
            </Text>
          </View>
        </View>
        <MaterialIcons
          name={expanded ? 'expand-more' : 'chevron-right'}
          size={24}
          color={muted}
        />
      </Pressable>

      {expanded ? (
        <View style={styles.grid}>
          <Meta label={t('summary.food')} value={formatMoney(person.foodSubtotal, locale)} muted={muted} text={textColor} />
          <Meta label={t('summary.service')} value={formatMoney(person.serviceCharge, locale)} muted={muted} text={textColor} />
          <Meta label={t('summary.tax')} value={formatMoney(person.tax, locale)} muted={muted} text={textColor} />
          {person.deliveryCharge > 0 ? (
            <Meta
              label={t('summary.delivery')}
              value={formatMoney(person.deliveryCharge, locale)}
              muted={muted}
              text={textColor}
            />
          ) : null}
        </View>
      ) : (
        <Text style={[styles.hint, { color: muted }]}>{t('summary.tapDetails')}</Text>
      )}
    </Card>
  );
}

function Meta({
  label,
  value,
  muted,
  text,
}: {
  label: string;
  value: string;
  muted: string;
  text: string;
}) {
  return (
    <View style={styles.metaRow}>
      <Text style={[styles.metaLabel, { color: muted }]} numberOfLines={1}>
        {label}
      </Text>
      <Text style={[styles.metaValue, { color: text }]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
    marginBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    fontSize: 18,
    fontWeight: '700',
  },
  nameBlock: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
  },
  total: {
    fontSize: 14,
    fontWeight: '700',
  },
  grid: {
    gap: Spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  metaLabel: {
    fontSize: 14,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  hint: {
    fontSize: 14,
  },
});
