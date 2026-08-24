/**
 * Layout primitives shared by every screen: spacing rhythm, corner radii,
 * accessibility minimums, and depth elevation.
 */
import { Platform, type ViewStyle } from 'react-native';

/** 4pt spacing rhythm — keeps generous, consistent padding across bento cards. */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

/**
 * WCAG / platform minimum tappable size in dp.
 * Every interactive element must reach this in both axes.
 */
export const TOUCH_TARGET = 44;

/** Subtle tactile squeeze on press (spec: active:scale-95). */
export const PRESS_SCALE = 0.96;

/** Hit slop that pads small icon/text buttons up to the 44dp minimum. */
export const HIT_SLOP = { top: 8, bottom: 8, left: 8, right: 8 } as const;

/**
 * Soft depth elevation. Android uses `elevation`; iOS/web use a diffuse shadow
 * so cards read as floating without a harsh drop line.
 */
export function depth(level: 0 | 1 | 2, shadowColor: string): ViewStyle {
  if (level === 0) {
    return {};
  }

  const config = level === 1 ? { opacity: 0.08, radius: 10, y: 3 } : { opacity: 0.14, radius: 20, y: 8 };

  return Platform.select<ViewStyle>({
    android: { elevation: level * 3 },
    default: {
      shadowColor,
      shadowOpacity: config.opacity,
      shadowRadius: config.radius,
      shadowOffset: { width: 0, height: config.y },
    },
  }) as ViewStyle;
}
