/**
 * Screen-size awareness for adaptive layouts.
 * Reads live window dimensions, so values update on rotation and on foldables
 * without a remount.
 */
import { useWindowDimensions } from 'react-native';

/** Width thresholds in dp. */
export const Breakpoints = {
  /** Small phones (iPhone SE, older Androids) below this width. */
  compact: 360,
  /** Tablets and large foldables at or above this width. */
  tablet: 768,
} as const;

/**
 * Caps how wide content may grow. Cards and text lines stretched across a full
 * tablet become hard to scan, so content stays in a centered reading column.
 */
const TABLET_CONTENT_WIDTH = 640;

export type Responsive = {
  width: number;
  height: number;
  isCompact: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  /** Max content width, or undefined to fill the screen. */
  contentMaxWidth: number | undefined;
};

export function useResponsive(): Responsive {
  const { width, height } = useWindowDimensions();
  const isTablet = width >= Breakpoints.tablet;

  return {
    width,
    height,
    isCompact: width < Breakpoints.compact,
    isTablet,
    isLandscape: width > height,
    contentMaxWidth: isTablet ? TABLET_CONTENT_WIDTH : undefined,
  };
}
