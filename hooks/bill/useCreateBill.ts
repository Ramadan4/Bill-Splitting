/**
 * Create-step logic: require a bill name before choosing input method.
 */
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useBillStore } from '@/store/billStore';

export function useCreateBill() {
  const router = useRouter();
  const storedName = useBillStore((state) => state.bill?.name ?? '');
  const setBillName = useBillStore((state) => state.setBillName);

  const [name, setName] = useState(storedName);
  const [error, setError] = useState<string | null>(null);

  const onChangeName = (value: string) => {
    setName(value);
    if (error) {
      setError(null);
    }
  };

  const continueToInputMethod = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('errors.billNameRequired');
      return;
    }

    setBillName(trimmed);
    router.push('/bill/input-method');
  };

  return {
    name,
    error,
    onChangeName,
    continueToInputMethod,
  };
}
