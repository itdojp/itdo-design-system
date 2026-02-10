# High Contrast Theme Guidelines

This guide defines `data-theme="high-contrast"` operation rules.

## Activation

- Apply `data-theme="high-contrast"` on `:root`.
- Keep density mode independent (`data-density` can be combined).
- Do not hardcode component-local colors that bypass semantic tokens.

## Contrast targets

- Text over surface/background: maintain at least 4.5:1.
- Large text (`>= 18pt` or bold `>= 14pt`): maintain at least 3:1.
- UI boundaries and icon strokes: maintain at least 3:1 against adjacent colors.
- Focus indicators must be clearly visible in both light and high-contrast themes.

## Token usage

- Prioritize semantic tokens (`--color-text-*`, `--color-bg-*`, `--color-border-*`).
- Status colors must preserve semantic meaning while keeping contrast requirements.
- Keep interactive states (`hover/active/focus`) distinguishable without relying on hue alone.

## Verification checklist

- Validate key workflows with Storybook a11y checks.
- Verify keyboard focus visibility on primary actions and form controls.
- Review table/header/border visibility in dense data layouts.
- Keep visual snapshots for high-contrast surfaces in `src/visual/__screenshots__/`.
- Recommended commands:
  - `npm run test-storybook:ci`
  - `npm run test:visual`
