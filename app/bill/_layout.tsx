/** Nested stack for the create-bill flow screens. */
import { Stack } from 'expo-router';

import { useI18n } from '@/hooks/use-i18n';

export default function BillLayout() {
  const { t, locale } = useI18n();

  return (
    <Stack key={locale}>
      <Stack.Screen name="create" options={{ title: t('nav.create') }} />
      <Stack.Screen name="input-method" options={{ title: t('nav.inputMethod') }} />
      <Stack.Screen name="receipt" options={{ title: t('nav.receipt') }} />
      <Stack.Screen name="items" options={{ title: t('nav.items') }} />
      <Stack.Screen name="people" options={{ title: t('nav.people') }} />
      <Stack.Screen name="assign" options={{ title: t('nav.assign') }} />
      <Stack.Screen name="charges" options={{ title: t('nav.charges') }} />
      <Stack.Screen name="summary" options={{ title: t('nav.summary') }} />
    </Stack>
  );
}
