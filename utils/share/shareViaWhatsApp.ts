/**
 * Open WhatsApp with a pre-filled bill message.
 * Falls back to the system share sheet when WhatsApp cannot be opened.
 */
import { Linking, Platform, Share } from 'react-native';

/**
 * Prefer the WhatsApp app scheme, then the universal link, then Share.
 * Why: Expo Go / iOS may block canOpenURL unless queries schemes are declared.
 */
export async function shareViaWhatsApp(message: string): Promise<'whatsapp' | 'sheet'> {
  const encoded = encodeURIComponent(message);
  const candidates =
    Platform.OS === 'web'
      ? [`https://wa.me/?text=${encoded}`]
      : [
          `whatsapp://send?text=${encoded}`,
          `https://api.whatsapp.com/send?text=${encoded}`,
        ];

  for (const url of candidates) {
    try {
      await Linking.openURL(url);
      return 'whatsapp';
    } catch {
      // Try the next candidate.
    }
  }

  await Share.share({ message });
  return 'sheet';
}
