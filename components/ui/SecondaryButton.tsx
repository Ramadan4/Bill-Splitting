import { type ComponentProps } from 'react';

import { Button } from '@/components/ui/Button';

type SecondaryButtonProps = Omit<ComponentProps<typeof Button>, 'variant'> & {
  tone?: 'default' | 'danger';
};

/**
 * Outline CTA. `tone="danger"` maps to the destructive Button variant.
 */
export function SecondaryButton({ tone = 'default', ...rest }: SecondaryButtonProps) {
  return <Button variant={tone === 'danger' ? 'danger' : 'secondary'} {...rest} />;
}
