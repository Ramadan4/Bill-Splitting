---
name: SplitEat
colors:
  surface: '#f6fafe'
  surface-dim: '#d6dade'
  surface-bright: '#f6fafe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f0f4f8'
  surface-container: '#eaeef2'
  surface-container-high: '#e4e9ed'
  surface-container-highest: '#dfe3e7'
  on-surface: '#171c1f'
  on-surface-variant: '#3f4850'
  inverse-surface: '#2c3134'
  inverse-on-surface: '#edf1f5'
  outline: '#707881'
  outline-variant: '#bfc7d2'
  surface-tint: '#006398'
  primary: '#006194'
  on-primary: '#ffffff'
  primary-container: '#007bb9'
  on-primary-container: '#fdfcff'
  inverse-primary: '#93ccff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#894d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#ac6200'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cce5ff'
  primary-fixed-dim: '#93ccff'
  on-primary-fixed: '#001d31'
  on-primary-fixed-variant: '#004b73'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdcc0'
  tertiary-fixed-dim: '#ffb875'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6b3b00'
  background: '#f6fafe'
  on-background: '#171c1f'
  surface-variant: '#dfe3e7'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  arabic-body:
    fontFamily: IBM Plex Sans Arabic
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  bento-gap: 12px
  container-padding: 20px
---

## Brand & Style
The design system for this product is built on the principles of **Modern Minimalism** with a **Bento-grid** structural logic. The brand personality is grounded, trustworthy, and social, aiming to reduce the friction of financial transactions during dining experiences. 

The visual language utilizes clean partitions, generous whitespace, and a high degree of legibility to evoke a sense of calm and fairness. The UI avoids decorative fluff, focusing instead on structural clarity and tactile feedback. It is designed to feel like a high-end utility—sophisticated yet approachable.

## Colors
The palette is centered around a "Slate & Sky" theme. 

- **Light Mode:** Uses a soft Slate (#F1F5F9) for the primary background to reduce eye strain. Cards use a crisp Off-white (#FAFAFA) to create a subtle layered effect against the background.
- **Dark Mode:** Transitions to a Midnight depth (#090D16). Surfaces use a slightly lighter Slate (#172033) to maintain depth without needing heavy shadows.
- **Accent:** A vibrant Sky Blue is used sparingly for primary actions, success states, and progress indicators. 
- **Borders:** In dark mode, 10% white borders are mandatory for surface definition, replacing traditional drop shadows.

## Typography
This design system employs a multi-font strategy to handle bilingual requirements and brand hierarchy. 

**Public Sans** is used for headlines to provide a sturdy, institutional feel that conveys reliability. **Inter** is the workhorse for all Latin body copy due to its exceptional legibility in data-heavy environments. **IBM Plex Sans Arabic** is integrated to ensure the RTL experience feels native and equally professional. 

For the Arabic script, line-height is increased by approximately 10-15% compared to Latin counterparts to accommodate the taller ascenders and descenders of the script.

## Layout & Spacing
The layout follows a **Fluid Bento-Grid** philosophy. On mobile, elements primarily stack vertically, but horizontal pairings of cards are used for secondary metrics (e.g., individual totals vs. tax).

- **Margins:** A consistent 20px outer margin is used for all mobile screens.
- **Gaps:** Bento-style cards are separated by a 12px gap.
- **RTL Support:** The layout must mirror perfectly for Arabic. This includes icon directionality (except for non-directional icons like search) and progress bar fills.
- **Safe Areas:** Bottom-sheet components must respect the device's home indicator area with a minimum of 32px bottom padding.

## Elevation & Depth
Depth is communicated through **Tonal Layering** rather than heavy shadows.

- **Level 0 (Background):** The base slate/midnight layer.
- **Level 1 (Cards):** Off-white or deep slate surfaces. In light mode, a very soft, diffused shadow (0px 4px 12px rgba(15, 23, 42, 0.04)) is used. In dark mode, elevation is strictly defined by the 10% white border.
- **Level 2 (Modals/Overlays):** Elevated surfaces use a more pronounced shadow or a darker backdrop dimming (40% opacity) to focus the user's attention.

## Shapes
The shape language is characterized by **Generous Rounding**. 

Standard cards and primary containers utilize a 18px-20px corner radius to reinforce the "friendly" and "modern" brand attributes. Smaller elements like buttons and input fields follow the `rounded-lg` (16px) or `rounded-xl` (24px) scale to maintain visual harmony with the larger bento containers.

## Components
- **Bento Cards:** The core container. These should have a padding of 20px. They are used to group logic—such as the list of diners, the itemized bill, or the payment summary.
- **Primary Buttons:** High-contrast Sky Blue fills with white or dark-slate text. Buttons are large (56px height) with rounded corners of 16px.
- **Action Chips:** Used for quick-splitting options (e.g., "Split Evenly", "By Percentage"). These use a secondary slate background with a subtle border.
- **Input Fields:** Minimalist design with a light-grey bottom border or a subtle inset fill. Focus states are indicated by a 2px Sky Blue stroke.
- **Progress Indicators:** Linear bars used to show how much of the bill has been "claimed" by diners.
- **Diner Avatars:** Circular containers with initials or soft-colored icons to distinguish between group members.
- **Amount Displays:** Currency values should use a slightly heavier weight than the surrounding text to ensure they are the primary focal point of the card.