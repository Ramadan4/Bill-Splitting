/**
 * Layout primitives aligned with the Stitch design system.
 */
import { Platform, type ViewStyle } from 'react-native';

/** Spacing from Stitch tokens (4px base). */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  /** Outer screen margin from Stitch (`container-padding`). */
  container: 16,
  /** Gap between bento cards. */
  bento: 10,
} as const;

/** Slightly softer corners than Material defaults — matches current iOS/Android app trends. */
export const Radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  pill: 999,
} as const;

export const TOUCH_TARGET = 44;

/** Primary CTA height — slim but still above the 44dp touch minimum. */
export const CTA_HEIGHT = 50;

export const PRESS_SCALE = 0.96;

export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;

/**
 * Soft floating elevation: cards lift on a diffuse warm shadow rather than
 * relying on borders (level 1 = resting card, level 2 = hero / floating bar).
 */
export function depth(level: 0 | 1 | 2, shadowColor: string): ViewStyle {
  if (level === 0) {
    return {};
  }

  const config =
    level === 1
      ? { opacity: 0.07, radius: 16, y: 6 }
      : { opacity: 0.16, radius: 24, y: 10 };

  return Platform.select<ViewStyle>({
    android: { elevation: level * 2 },
    default: {
      shadowColor,
      shadowOpacity: config.opacity,
      shadowRadius: config.radius,
      shadowOffset: { width: 0, height: config.y },
    },
  }) as ViewStyle;
}
