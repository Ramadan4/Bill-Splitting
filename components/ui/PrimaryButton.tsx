import { type ComponentProps } from 'react';

import { Button } from '@/components/ui/Button';

/**
 * Primary filled CTA. Thin wrapper over `Button` so existing screens keep
 * a named import while the design-system atom lives in `Button.tsx`.
 */
export function PrimaryButton(props: Omit<ComponentProps<typeof Button>, 'variant'>) {
  return <Button variant="primary" {...props} />;
}
