/**
 * Persists the chosen input method, then routes to the right next step.
 */
import { useRouter } from 'expo-router';

import { useBillStore } from '@/store/billStore';
import type { InputMethod } from '@/types';

export function useSelectInputMethod() {
  const router = useRouter();
  const setInputMethod = useBillStore((state) => state.setInputMethod);

  const selectMethod = (method: InputMethod) => {
    setInputMethod(method);

    // Receipt path opens capture/preview first; manual skips straight to items.
    if (method === 'receipt') {
      router.push('/bill/receipt');
      return;
    }

    router.push('/bill/items');
  };

  return { selectMethod };
}
