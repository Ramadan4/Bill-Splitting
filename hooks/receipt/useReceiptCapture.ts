/**
 * Receipt capture screen logic: camera/gallery → store URI → continue to items.
 * OCR is intentionally out of scope; calc engine stays unchanged.
 */
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useBillStore } from '@/store/billStore';
import {
  captureReceiptPhoto,
  pickReceiptFromLibrary,
} from '@/utils/receipt/pickReceiptImage';

export function useReceiptCapture() {
  const router = useRouter();
  const receiptImageUri = useBillStore((state) => state.bill?.receiptImageUri ?? null);
  const setReceiptImageUri = useBillStore((state) => state.setReceiptImageUri);

  /** i18n error key — translate in UI with `t(error)`. */
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  const applyPickResult = async (
    picker: () => ReturnType<typeof captureReceiptPhoto>,
  ) => {
    setIsBusy(true);
    setError(null);

    try {
      const result = await picker();

      if (result.ok) {
        setReceiptImageUri(result.uri);
        return;
      }

      if (result.reason === 'denied') {
        setError('errors.receiptPermission');
      }
      // cancelled → stay silent; user backed out on purpose
    } catch {
      setError('errors.receiptOpenFailed');
    } finally {
      setIsBusy(false);
    }
  };

  const takePhoto = () => applyPickResult(captureReceiptPhoto);
  const chooseFromLibrary = () => applyPickResult(pickReceiptFromLibrary);

  const clearPhoto = () => {
    setReceiptImageUri(null);
    setError(null);
  };

  /** Continue even without a photo — receipt is optional reference only. */
  const continueToItems = () => {
    router.push('/bill/items');
  };

  return {
    receiptImageUri,
    error,
    isBusy,
    takePhoto,
    chooseFromLibrary,
    clearPhoto,
    continueToItems,
  };
}
