# ITDO Design System

Enterprise-Grade Design System for ITDO applications.

## Features

- 🎨 **Design Tokens**: Consistent colors, typography, spacing, and shadows
- 🧩 **Component Library**: Pre-built React components (Button, Card, Input, etc.)
- 📚 **Storybook**: Interactive component documentation
- 🎯 **TypeScript**: Full type safety and IntelliSense support
- 📱 **Responsive**: Mobile-first design approach
- ♿ **Accessible**: WCAG 2.1 AA compliant components

## Quick Start

### Installation

```bash
npm install
```

### Development

```bash
# Run demo application
npm run dev

# Run Storybook
npm run storybook
```

### Build

```bash
# Build library
npm run build:lib

# Build Storybook
npm run build-storybook
```

### Versioning

This repository uses Changesets for SemVer and CHANGELOG generation.

```bash
npm run changeset
npm run version-packages
```

### Release (npm publish)

Publishing is triggered by a GitHub Release (published) via Trusted Publishing (OIDC).

1. Run Changesets and push the version bump to `main`.
2. Create a GitHub Release with a `vX.Y.Z` tag.
3. The `Publish to npm (OIDC)` workflow runs `npm publish --provenance --access public`.

Prerequisite: configure the npm package as a Trusted Publisher for this repository and workflow.

### Styles

Base tokens and component styles are bundled into `dist/styles.css`. If your bundler does not
include CSS side effects automatically, import `@itdo/design-system/styles.css`.

## Project Structure

```
itdo-design-system/
├── src/
│   ├── components/     # React components
│   ├── tokens/         # Design tokens
│   ├── styles/         # Global styles
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── hooks/          # Custom React hooks
├── demo/               # Demo application
├── .storybook/         # Storybook configuration
└── docs/               # Documentation
```

## Component Guides

- `docs/priority-a-components-guide.md`: operational guidance for `PageHeader`, `SectionCard`, `StatusBadge`, `AsyncStatePanel`, `ConfirmActionDialog`, `FilterBar`, and `DataTable`.
- `docs/storybook-docs-template.md`: standard Storybook documentation template for new components.
- `docs/component-adoption-criteria.md`: criteria for reuse vs new component creation.
- `docs/deprecation-policy.md`: API deprecation lifecycle and npm operation policy.
- `docs/deprecation-dashboard.md`: static scan report format for deprecated API usage tracking.
- `docs/figma-variables-sync.md`: Figma Variables import/sync I/O and diff workflow.
- `docs/changelog-template.md`: release note template (Breaking/Non-breaking).
- `docs/wave-review-checklist.md`: wave completion review checklist.
- `docs/token-system-wave3.md`: token inventory, naming policy, and migration notes for Wave3.
- `docs/i18n-layout-guidelines.md`: text expansion/RTL implementation rules and regression checklist.
- `docs/high-contrast-guidelines.md`: high contrast theme activation and contrast verification rules.
- `docs/quality-gate-matrix.md`: minimum CI/local quality-gate matrix and triage flow.
- `docs/telemetry-events.md`: baseline telemetry event naming and payload contract.
- `docs/telemetry-hook-points.md`: recommended telemetry insertion points by component.
- `docs/bulk-action-guidelines.md`: multi-selection action contract and adapter usage.
- `docs/saved-view-guidelines.md`: saved view UX contract and persistence integration notes.
- `docs/command-palette-guidelines.md`: command palette UX contract and integration checklist.
- `docs/form-wizard-guidelines.md`: step navigation, autosave, and leave-guard rules for wizard flows.
- `docs/entity-reference-guidelines.md`: reference search/selection/deep-link contract for internal entities.
- `docs/date-range-guidelines.md`: preset/timezone/validation contract for date and datetime range inputs.
- `docs/editable-datagrid-guidelines.md`: inline editing/validation contract for editable data grids.
- `docs/attachment-ux-guidelines.md`: upload status, retry, and preview behavior rules.
- `docs/reliability-ux-guidelines.md`: undo notification and state preset recovery contracts.
- `docs/governance/review-gate.md`: merge blocking policy for required PR review + required status checks.

## Design Principles

1. **Consistency**: Unified experience across all products
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Efficiency**: Optimized workflows for business users
4. **Scalability**: Modular and extensible architecture
5. **Beauty**: Modern and visually appealing

## Token Structure

Tokens are organized into two layers plus density mode.

- **Primitive**: Raw values such as `colors`, `spacing`, `typography`, `shadows`, `radius`, `motion`
- **Semantic**: UI meaning such as `text`, `background`, `border`, `status`, `action`, `focus`
- **Density**: layout and control scale for `compact|comfortable`

CSS variables follow the same naming scheme. New status tokens use
`--color-status-{kind}-{bg|border|fg}` and keep legacy aliases for compatibility.
Density can be switched via `data-density="compact|comfortable"` on `:root`.

## Primary Color

The primary brand color is **Orange (#f97316)**, representing energy, creativity, and innovation.

## License

MIT
