# i18n Layout Guidelines

This document defines implementation rules to keep layouts stable under multilingual text expansion.

## Scope
- Components: `PageHeader`, `FilterBar`, `DataTable`, `SectionCard`, `Tabs`, `Breadcrumb`
- Languages: Japanese, English, Arabic (RTL), Thai

## Rules for Text-Length Variance
- Keep critical action labels short and stable. Move long descriptions to helper text.
- Use wrapping-safe styles for long labels:
  - `overflow-wrap: anywhere`
  - `word-break: break-word` (fallback)
  - `white-space: pre-wrap` only when preserving intentional line breaks.
- Do not rely on fixed pixel widths for controls that render translated labels.
- For table-heavy screens, keep important identifier columns pinned and non-hideable.

## Rules for RTL
- Wrap screen root with `dir="rtl"` when RTL locale is active.
- Avoid left/right hardcoding in custom styles. Prefer logical properties when possible.
- Validate breadcrumb and tab readability under RTL with Storybook interaction tests.

## Rules for Form and Filter UI
- Search placeholder text must be shorter than 80 characters per locale.
- Filter labels should prefer nouns over verbose phrases.
- For labels that can exceed one line, allow container growth instead of clipping.

## Regression Strategy
- Add Storybook play tests for long-text and RTL scenarios.
- Add screenshot-based assertions for key example stories:
  - `Examples/I18n Resilience/LongTextMultibyte`
  - `Examples/I18n Resilience/RtlWorkspace`
- Keep mismatch threshold conservative (`allowedMismatchedPixelRatio <= 0.01`).

## Visual Baseline Management
- Keep baseline images under `src/visual/__screenshots__/`.
- Review screenshot diffs in PRs before updating baselines.
- Additive baseline updates are allowed only when UX intent is documented in PR summary.
- For RTL checks, maintain at least these snapshots:
  - `i18n-resilience-rtl`
  - `i18n-resilience-rtl-navigation`

## Release Checklist
- Storybook tests pass in CI (`npm run test-storybook:ci`).
- New locale labels do not overlap action buttons at `320px` width.
- RTL story remains keyboard-operable and readable.
