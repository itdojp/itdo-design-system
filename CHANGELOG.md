# Changelog

All notable changes to this project will be documented in this file.

## 1.1.0 - 2026-02-11

### Added
- `DateRangePicker` / `DateTimeRangePicker` patterns with presets, range validation, and timezone-aware datetime support.
- `EntityReferencePicker` pattern for reusable internal entity reference search/select flows.
- `MentionComposer` pattern for unified mention/ack/attachment-aware message composition.
- `Drawer` pattern for context-preserving detail and edit flows from list screens.
- `PolicyFormBuilder` pattern for declarative admin policy forms.
- `AuditTimeline` / `DiffViewer` patterns for investigation-oriented history and change inspection UX.
- New usage guidelines for `DateRangePicker`, `EntityReferencePicker`, `Drawer`, `PolicyFormBuilder`, and `AuditTimeline` under `docs/*-guidelines.md`.

## 1.0.3 - 2026-02-06

### Changed
- Switched npm package scope from `@itdojp/design-system` to `@itdo/design-system` to align with the npm organization.
- Hardened npm publish workflow for tokenless Trusted Publishing (OIDC) and explicit npm auth sanitization before publish.

## 1.0.2 - 2026-01-27

### Added
- Dialog component with focus management and Storybook examples.
- Popover component for reference pickers and contextual help.
- Combobox component with async search, keyboard navigation, and empty state support.
- useClipboard hook and CopyButton for URL/Markdown copy flows.
- Link component with external/internal defaults and safety handling.
- MarkdownRenderer with GFM support and configurable link rendering.
- EventLog extensions for admin override badge and change details.
- DesignBook Storybook examples for reference, link/copy, memo, and history/audit patterns.

### Changed
- Added tests for new components/hooks and updated build config to handle CommonJS dependencies.
