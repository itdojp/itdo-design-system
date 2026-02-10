# Figma Variables Sync

This document defines I/O contracts for syncing Figma Variables into design tokens.

## Input JSON

CLI expects a JSON file with `variables[]` entries:

```json
{
  "variables": [
    {
      "name": "color.text.primary",
      "values": {
        "light": "#111111",
        "dark": "#f5f5f5"
      }
    },
    {
      "name": "space.4",
      "value": "0.25rem"
    }
  ]
}
```

- `name`: token path (`.` or `/` separators are normalized).
- `values`: mode-based values object (optional).
- `value`: single value when mode map is not required.

## Output files

- `--output`: generated design token JSON (default: `reports/figma/design-tokens.json`)
- `--report-json`: diff report JSON (default: `reports/figma/figma-sync-report.json`)
- `--report-md`: diff report Markdown (default: `reports/figma/figma-sync-report.md`)

## Diff behavior

- Compare generated token leaves with baseline (`--baseline`).
- Report:
  - `added`: path exists only in generated output
  - `removed`: path exists only in baseline
  - `changed`: path exists in both but values differ

## Commands

- Sync only:
  - `npm run figma:sync -- --input <figma-json> --baseline <baseline-json>`
- Fail when diff exists:
  - `npm run figma:sync:strict -- --input <figma-json> --baseline <baseline-json>`

## CI integration notes

- JSON/Markdown reports can be uploaded as artifacts.
- Use `--fail-on-diff` only when strict token freeze is required.
