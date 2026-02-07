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
- `docs/changelog-template.md`: release note template (Breaking/Non-breaking).
- `docs/wave-review-checklist.md`: wave completion review checklist.

## Design Principles

1. **Consistency**: Unified experience across all products
2. **Accessibility**: WCAG 2.1 AA compliant
3. **Efficiency**: Optimized workflows for business users
4. **Scalability**: Modular and extensible architecture
5. **Beauty**: Modern and visually appealing

## Token Structure

Tokens are organized into two layers.

- **Primitive**: Raw values such as `colors`, `spacing`, `typography`, `shadows`, `radius`
- **Semantic**: UI meaning such as `text`, `background`, `border`, `status`, `action`, `focus`

CSS variables follow the same naming scheme, for example `--color-primary-500` (primitive) and
`--color-text-primary` (semantic). Density can be adjusted via `data-density="compact|comfortable"`
on `:root`.

## Primary Color

The primary brand color is **Orange (#f97316)**, representing energy, creativity, and innovation.

## License

MIT
