/**
 * Receipt capture: camera/gallery → OCR → fill items → continue to review.
 */
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { useBillStore } from '@/store/billStore';
import { createBillItem } from '@/utils/models';
import {
  captureReceiptPhoto,
  pickReceiptFromLibrary,
} from '@/utils/receipt/pickReceiptImage';
import { parseReceiptText } from '@/utils/receipt/parseReceiptText';
import { recognizeReceiptText } from '@/utils/receipt/recognizeReceiptText';

export function useReceiptCapture() {
  const router = useRouter();
  const receiptImageUri = useBillStore((state) => state.bill?.receiptImageUri ?? null);
  const setReceiptImageUri = useBillStore((state) => state.setReceiptImageUri);
  const setItems = useBillStore((state) => state.setItems);

  /** i18n error key — translate in UI with `t(error)`. */
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  /** How many lines OCR just added (0 = none / skip). */
  const [extractedCount, setExtractedCount] = useState(0);

  const extractAndStoreItems = async (uri: string) => {
    const recognized = await recognizeReceiptText(uri);
    if (!recognized.ok) {
      setError(recognized.errorKey);
      setExtractedCount(0);
      return;
    }

    const parsed = parseReceiptText(recognized.text);
    if (parsed.length === 0) {
      setError('errors.ocrNoItems');
      setExtractedCount(0);
      return;
    }

    // Read latest items from the store so we don't race with a stale render snapshot.
    const currentItems = useBillStore.getState().bill?.items ?? [];
    const next = [
      ...currentItems,
      ...parsed.map((input) => createBillItem(input)),
    ];
    setItems(next);
    setExtractedCount(parsed.length);
    setError(null);
  };

  const applyPickResult = async (
    picker: () => ReturnType<typeof captureReceiptPhoto>,
  ) => {
    setIsBusy(true);
    setError(null);
    setExtractedCount(0);

    try {
      const result = await picker();

      if (!result.ok) {
        if (result.reason === 'denied') {
          setError('errors.receiptPermission');
        }
        return;
      }

      setReceiptImageUri(result.uri);
      await extractAndStoreItems(result.uri);
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
    setExtractedCount(0);
  };

  /** Continue even without a photo — user can still enter items manually. */
  const continueToItems = () => {
    router.push('/bill/items');
  };

  return {
    receiptImageUri,
    error,
    isBusy,
    extractedCount,
    takePhoto,
    chooseFromLibrary,
    clearPhoto,
    continueToItems,
  };
}
