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
  container: 20,
  /** Gap between bento cards. */
  bento: 12,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const TOUCH_TARGET = 44;

/** Primary CTA height from Stitch (h-14). */
export const CTA_HEIGHT = 56;

export const PRESS_SCALE = 0.96;

export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;

/**
 * Soft bento elevation (Stitch: 0px 4px 12px rgba(15,23,42,0.04)).
 */
export function depth(level: 0 | 1 | 2, shadowColor: string): ViewStyle {
  if (level === 0) {
    return {};
  }

  const config =
    level === 1
      ? { opacity: 0.04, radius: 12, y: 4 }
      : { opacity: 0.1, radius: 20, y: 8 };

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
