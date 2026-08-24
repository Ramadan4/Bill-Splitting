/**
 * Eye-care color tokens for light + dark themes.
 * Prefer these semantic keys over hard-coded hex in screens.
 *
 * Dark mode uses Deep Slate / Midnight ambients; light mode uses soft zinc/slate
 * neutrals. No pure #000000 / #FFFFFF on primary surfaces.
 */
const tintLight = '#0284C7';
const tintDark = '#38BDF8';

export const Colors = {
  light: {
    text: '#0F172A',
    background: '#F1F5F9',
    tint: tintLight,
    icon: '#64748B',
    muted: '#64748B',
    border: '#E2E8F0',
    card: '#FAFAFA',
    /** Raised bento surface stacked above `card`. */
    surface: '#FFFFFF',
    /** Shimmer base for skeleton placeholders. */
    skeleton: '#E2E8F0',
    shadow: '#0F172A',
    overlay: 'rgba(15, 23, 42, 0.45)',
    primary: tintLight,
    onPrimary: '#FAFAFA',
    danger: '#DC2626',
    success: '#16A34A',
    tabIconDefault: '#64748B',
    tabIconSelected: tintLight,
  },
  dark: {
    text: '#E2E8F0',
    background: '#0F172A',
    tint: tintDark,
    icon: '#94A3B8',
    muted: '#94A3B8',
    // Soft dynamic border (border-white/10) instead of a hard grey line.
    border: 'rgba(255, 255, 255, 0.10)',
    card: '#172033',
    surface: '#1E293B',
    skeleton: '#1E293B',
    shadow: '#090D16',
    overlay: 'rgba(9, 13, 22, 0.6)',
    primary: tintDark,
    onPrimary: '#090D16',
    danger: '#F87171',
    success: '#4ADE80',
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintDark,
  },
};

export type ThemeColorName = keyof typeof Colors.light;
