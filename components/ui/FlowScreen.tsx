import { type ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';
import { type Href, useRouter } from 'expo-router';

import { ActionDock } from '@/components/ui/ActionDock';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { Screen } from '@/components/ui/Screen';
import { useI18n } from '@/hooks/use-i18n';
import { useThemeColor } from '@/hooks/use-theme-color';

type FlowScreenProps = {
  title: string;
  description: string;
  nextHref?: Href;
  nextLabel?: string;
  children?: ReactNode;
};

/**
 * Shared shell for bill-flow screens.
 * Why: route files stay thin (UI only) and navigation stays consistent.
 */
export function FlowScreen({
  title,
  description,
  nextHref,
  nextLabel,
  children,
}: FlowScreenProps) {
  const router = useRouter();
  const { t } = useI18n();
  const titleColor = useThemeColor({}, 'text');
  const mutedColor = useThemeColor({}, 'muted');

  return (
    <Screen>
      <Text style={[styles.title, { color: titleColor }]}>{title}</Text>
      <Text style={[styles.description, { color: mutedColor }]}>{description}</Text>
      {children}
      {nextHref ? (
        <ActionDock>
          <PrimaryButton
            label={nextLabel ?? t('common.next')}
            onPress={() => router.push(nextHref)}
          />
        </ActionDock>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
});
