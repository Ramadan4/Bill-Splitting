/**
 * SplitEat design tokens — "Warm Orange" palette.
 *
 * Why orange: it is the dominant color of the most-used food & delivery apps,
 * reads as appetite/energy, and pops on warm off-white canvases. Cards are
 * pure white on a cream background with soft shadows instead of heavy borders.
 *
 * Two orange roles:
 * - `brand`   — the vivid photo orange for big filled surfaces (CTA buttons,
 *               hero card, logo, nav indicator) where text on it is bold.
 * - `primary` — a deeper orange for orange TEXT/ICONS on light surfaces, so
 *               small labels still pass WCAG AA (≥ 4.5:1). In dark mode the
 *               bright orange passes on its own, so both roles share it.
 *
 * `success` is a real green (no longer aliased to primary) so "settled /
 * balanced" states never look like the brand color.
 */
export const Colors = {
  light: {
    text: '#1C1410',
    background: '#FBF8F6',
    tint: '#C2410C',
    icon: '#6F625A',
    muted: '#6F625A',
    border: '#EFE6DF',
    card: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceContainer: '#F3EDE8',
    surfaceContainerLow: '#F7F2EE',
    surfaceContainerHigh: '#EDE4DD',
    brand: '#F26B1D',
    onBrand: '#FFFFFF',
    primaryContainer: '#FFEADB',
    onPrimaryContainer: '#9A3412',
    secondaryContainer: '#F3EDE8',
    onSecondaryContainer: '#4A3F38',
    tertiary: '#0F766E',
    tertiaryContainer: '#D5F3EE',
    onTertiaryContainer: '#0F5F58',
    skeleton: '#EDE4DD',
    shadow: '#7A4A2A',
    overlay: 'rgba(28, 20, 16, 0.45)',
    /** Subtle wash behind images/previews (visible on both card + background). */
    scrim: 'rgba(28, 20, 16, 0.05)',
    primary: '#C2410C',
    onPrimary: '#FFFFFF',
    danger: '#C62828',
    /** Soft red fill for destructive buttons / error banners. */
    dangerContainer: '#FDECEA',
    success: '#15803D',
    tabIconDefault: '#6F625A',
    tabIconSelected: '#C2410C',
  },
  dark: {
    text: '#F7F3F0',
    background: '#110D0B',
    tint: '#FF7A2E',
    icon: '#ABA098',
    muted: '#ABA098',
    border: 'rgba(255, 255, 255, 0.07)',
    card: '#1B1714',
    surface: '#221D19',
    surfaceContainer: '#221D19',
    surfaceContainerLow: '#1B1714',
    surfaceContainerHigh: '#2B2521',
    brand: '#FF7A2E',
    onBrand: '#1F0B00',
    primaryContainer: '#4A1F08',
    onPrimaryContainer: '#FFD2B5',
    secondaryContainer: '#2B2521',
    onSecondaryContainer: '#E6DDD7',
    tertiary: '#5EEAD4',
    tertiaryContainer: '#0F3B37',
    onTertiaryContainer: '#B4F0E6',
    skeleton: '#221D19',
    shadow: '#000000',
    overlay: 'rgba(0, 0, 0, 0.6)',
    scrim: 'rgba(255, 255, 255, 0.04)',
    primary: '#FF7A2E',
    onPrimary: '#1F0B00',
    danger: '#FF8A80',
    dangerContainer: '#3A1715',
    success: '#4ADE80',
    tabIconDefault: '#ABA098',
    tabIconSelected: '#FF7A2E',
  },
};

export type ThemeColorName = keyof typeof Colors.light;
