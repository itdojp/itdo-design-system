# Priority A Components Guide

This document defines Do/Don't guidance for key components introduced in Issue #27 to #33.

## PageHeader

### Do
- Keep title concise and stable across refreshes.
- Place the highest-frequency operation in `primaryAction`.
- Use `secondaryActions` for optional operations such as export and bulk filters.

### Don't
- Do not place more than two actions that compete for primary attention.
- Do not hide critical operations only inside breadcrumbs.

## SectionCard / ListCard

### Do
- Replace ad-hoc `div.card` wrappers with `SectionCard`.
- Replace custom list wrappers with `ListCard`.
- Use `density="compact"` only for dense operator views.

### Don't
- Do not mix multiple card density levels in a single list context.
- Do not place destructive actions in card headers without confirmation.

## StatusBadge / StatusDot

### Do
- Provide domain-specific mappings via `dictionary`.
- Use tone values in `neutral|info|success|warning|danger`.
- Keep labels business-readable and stable for exports/audit logs.

### Don't
- Do not encode domain semantics only by color.
- Do not use one tone for conflicting states (for example, both approved and rejected).

## AsyncStatePanel

### Do
- Keep transitions explicit: `loading -> ready|empty|error`.
- Provide recovery actions in priority order: retry -> secondary -> contact -> back.
- Keep empty/error descriptions task-oriented and short.

### Don't
- Do not render partial stale data without state annotation.
- Do not show a spinner for known empty states.

## ConfirmActionDialog

### Do
- Use `requireReason={true}` for reject/revoke/destructive operations.
- Persist `onConfirm({ reason })` into audit logs.
- Use `tone="danger"` for irreversible operations.

### Don't
- Do not skip confirmation for privilege-sensitive mutations.
- Do not truncate reason text before persistence.

## FilterBar / FilterChip

### Do
- Keep major filters between 3 and 5 controls.
- Represent active constraints with `chips`.
- Use `savedViews` for repetitive operator workflows.

### Don't
- Do not duplicate the same filter in both chip and form controls with different labels.
- Do not exceed one row of always-visible filters on narrow viewports.

## DataTable

### Do
- Use `DataTable` for 5+ columns or when sorting/row actions are required.
- Keep page size around 20 unless domain usage requires otherwise.
- Ensure keyboard flow for row focus and row action invocation.

### Don't
- Do not use table layout for card-like multiline mobile content.
- Do not trigger expensive query recalculation from selection-only interactions.

## Related Operational Guides
- `docs/async-feedback-guidelines.md`
- `docs/storybook-docs-template.md`
- `docs/component-adoption-criteria.md`
