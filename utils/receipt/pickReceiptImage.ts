/**
 * Receipt image picking helpers (camera / gallery).
 * No OCR here — URI is stored as a visual reference only (OCR-ready later).
 */
import * as ImagePicker from 'expo-image-picker';

export type ReceiptPickResult =
  | { ok: true; uri: string }
  | { ok: false; reason: 'denied' | 'cancelled' | 'unavailable' };

/**
 * Request camera permission then open the camera for a still photo.
 */
export async function captureReceiptPhoto(): Promise<ReceiptPickResult> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    return { ok: false, reason: 'denied' };
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return { ok: false, reason: 'cancelled' };
  }

  return { ok: true, uri: result.assets[0].uri };
}

/**
 * Request media-library permission then open the gallery picker.
 * Why request first (SDK 54+): avoids a second permission dialog after selection.
 */
export async function pickReceiptFromLibrary(): Promise<ReceiptPickResult> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return { ok: false, reason: 'denied' };
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: false,
    quality: 0.8,
  });

  if (result.canceled || !result.assets?.[0]?.uri) {
    return { ok: false, reason: 'cancelled' };
  }

  return { ok: true, uri: result.assets[0].uri };
}
