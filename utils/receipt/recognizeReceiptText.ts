/**
 * Cloud OCR for receipt images (works in Expo Go).
 * Uses OCR.space — set EXPO_PUBLIC_OCR_SPACE_API_KEY (free at ocr.space/ocrapi/freekey).
 */
import { EncodingType, readAsStringAsync } from 'expo-file-system/legacy';

export type RecognizeReceiptResult =
  | { ok: true; text: string }
  | { ok: false; errorKey: string };

const OCR_ENDPOINT = 'https://api.ocr.space/parse/image';

function getApiKey(): string | null {
  const key = process.env.EXPO_PUBLIC_OCR_SPACE_API_KEY?.trim();
  return key ? key : null;
}

function guessMimeType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith('.png')) {
    return 'image/png';
  }
  if (lower.endsWith('.webp')) {
    return 'image/webp';
  }
  return 'image/jpeg';
}

/**
 * Read a local image URI as base64 then ask OCR.space for plain text.
 * Language pack includes English + Arabic for Egyptian restaurant receipts.
 */
export async function recognizeReceiptText(imageUri: string): Promise<RecognizeReceiptResult> {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { ok: false, errorKey: 'errors.ocrApiKeyMissing' };
  }

  let base64: string;
  try {
    base64 = await readAsStringAsync(imageUri, { encoding: EncodingType.Base64 });
  } catch {
    return { ok: false, errorKey: 'errors.ocrReadFailed' };
  }

  const mime = guessMimeType(imageUri);
  const form = new FormData();
  form.append('base64Image', `data:${mime};base64,${base64}`);
  form.append('language', 'ara,eng');
  form.append('isOverlayRequired', 'false');
  form.append('OCREngine', '2');
  form.append('scale', 'true');
  form.append('detectOrientation', 'true');

  try {
    const response = await fetch(OCR_ENDPOINT, {
      method: 'POST',
      headers: { apikey: apiKey },
      body: form,
    });

    if (!response.ok) {
      return { ok: false, errorKey: 'errors.ocrFailed' };
    }

    const payload = (await response.json()) as {
      IsErroredOnProcessing?: boolean;
      ErrorMessage?: string | string[];
      ParsedResults?: { ParsedText?: string }[];
    };

    if (payload.IsErroredOnProcessing) {
      return { ok: false, errorKey: 'errors.ocrFailed' };
    }

    const text = (payload.ParsedResults ?? [])
      .map((entry) => entry.ParsedText ?? '')
      .join('\n')
      .trim();

    if (!text) {
      return { ok: false, errorKey: 'errors.ocrEmpty' };
    }

    return { ok: true, text };
  } catch {
    return { ok: false, errorKey: 'errors.ocrFailed' };
  }
}
