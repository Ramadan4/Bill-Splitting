/**
 * SplitEat / Stitch design tokens (Slate & Sky).
 * Source of truth: screenshot/ + Image 13.markdown design system.
 */
export const Colors = {
  light: {
    text: '#171c1f',
    background: '#f6fafe',
    tint: '#006194',
    icon: '#3f4850',
    muted: '#3f4850',
    border: '#bfc7d2',
    card: '#ffffff',
    surface: '#ffffff',
    surfaceContainer: '#eaeef2',
    surfaceContainerLow: '#f0f4f8',
    surfaceContainerHigh: '#e4e9ed',
    primaryContainer: '#007bb9',
    onPrimaryContainer: '#fdfcff',
    secondaryContainer: '#dae2fd',
    onSecondaryContainer: '#5c647a',
    tertiary: '#894d00',
    tertiaryContainer: '#ac6200',
    onTertiaryContainer: '#fffbff',
    skeleton: '#dfe3e7',
    shadow: '#0f172a',
    overlay: 'rgba(23, 28, 31, 0.45)',
    primary: '#006194',
    onPrimary: '#ffffff',
    danger: '#ba1a1a',
    success: '#006194',
    tabIconDefault: '#3f4850',
    tabIconSelected: '#006194',
  },
  dark: {
    text: '#edf1f5',
    background: '#090d16',
    tint: '#93ccff',
    icon: '#bfc7d2',
    muted: '#bfc7d2',
    border: 'rgba(255, 255, 255, 0.10)',
    card: '#172033',
    surface: '#1e293b',
    surfaceContainer: '#1e293b',
    surfaceContainerLow: '#172033',
    surfaceContainerHigh: '#243044',
    primaryContainer: '#007bb9',
    onPrimaryContainer: '#fdfcff',
    secondaryContainer: '#3f465c',
    onSecondaryContainer: '#dae2fd',
    tertiary: '#ffb875',
    tertiaryContainer: '#ac6200',
    onTertiaryContainer: '#fffbff',
    skeleton: '#1e293b',
    shadow: '#090d16',
    overlay: 'rgba(9, 13, 22, 0.6)',
    primary: '#93ccff',
    onPrimary: '#001d31',
    danger: '#ffb4ab',
    success: '#93ccff',
    tabIconDefault: '#bfc7d2',
    tabIconSelected: '#93ccff',
  },
};

export type ThemeColorName = keyof typeof Colors.light;

/** Stitch logo from the HTML mock (hotlink allowed). */
export const SPLITEAT_LOGO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCwC3EE5Kef4anrdy3DAeLXfPyA2REiw79WqDglwM5jkI-nGWAeVgPNrzp7u7Fmj3gyt-v56prd5ORO7q83LN9gF8kiZ0sDTuVLNzoW8k_mtjjgM3tJSNIE0Ug4CNtL0-dMTG3CMoYRs7axhZ5_ofdtJqLS75liiLsdQ0ZHWlp53vEHX1epSIBFjyFyQIaw0Cf8OkIq8US1U3j8SaUuE3fy8UQvuHVue_a5fyNky-dTDmuiK_oOL1rZyA';
