# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

# Architecture & code quality

Enforce `.cursor/rules/` always:
- Small files; separate **UI / hooks / logic**
- Feature components vs **ui** atoms (`components/ui`) and **features** (`components/features`)
- **JSDoc + explanatory comments** (why, not only what)
- Strict TypeScript, early returns, DRY

# SplitEat product requirements (always)

- **Languages:** English (`en`) and Arabic (`ar`) — all user-facing strings must be translatable; no hard-coded UI copy in screens long-term.
- **Direction:** Support **LTR** (English) and **RTL** (Arabic). Layout and navigation must flip correctly with locale (use Expo/RN I18nManager / `expo-localization` patterns per SDK 54 docs).
- **Themes:** Support **light** and **dark** themes. Prefer semantic colors (background/text/border/tint) over hard-coded light-only styles.
- Calculation/business logic stays locale-agnostic; only presentation (labels, number/currency formatting, layout direction) is localized.
- Build features step-by-step (foundation → calc engine → screens). Polish UI last, but **wire i18n + RTL + theme architecture early** so later screens do not need rewrites.
