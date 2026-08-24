/** Nested stack for saved bills. */
import { Stack } from 'expo-router';

import { useI18n } from '@/hooks/use-i18n';

export default function HistoryLayout() {
  const { t, locale } = useI18n();

  return (
    <Stack key={locale}>
      <Stack.Screen name="index" options={{ title: t('nav.history') }} />
      <Stack.Screen name="[id]" options={{ title: t('nav.history') }} />
    </Stack>
  );
}
