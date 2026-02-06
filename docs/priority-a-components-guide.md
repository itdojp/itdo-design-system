# Priority A Components Guide

This document covers the implementation and usage guidance for Issue #27 to #33.

## PageHeader

### Do
- Keep title concise and stable across refreshes.
- Place high-frequency action in `primaryAction`.
- Use `secondaryActions` for non-critical actions such as export or filter.

### Don't
- Do not place more than 2 primary actions.
- Do not hide critical actions only in breadcrumbs.

## SectionCard / ListCard

### Replacement guide
- Replace custom `div.card` wrappers with `SectionCard`.
- Replace ad-hoc `ul` list blocks with `ListCard`.
- Set `density="compact"` only for high-density admin views.

## StatusBadge / StatusDot

### Dictionary extension
1. Provide domain statuses via `dictionary` prop.
2. Keep tone set to one of `neutral|info|success|warning|danger`.
3. Keep label business-readable and stable for audit exports.

## AsyncStatePanel

### State transition pattern
- `loading` -> `ready` when data is available.
- `loading` -> `empty` when request succeeds but dataset is empty.
- `loading` -> `error` when request fails.
- `error` -> `loading` on retry.

## ConfirmActionDialog

### Audit log integration pattern
- Set `requireReason={true}` for reject, revoke, or destructive operations.
- Use `onConfirm({ reason })` payload to persist reason in application audit log.
- Use `tone="danger"` for irreversible actions.

## FilterBar / FilterChip

### Operational recommendation
- Keep major filters between 3 and 5 controls.
- Represent active constraints with `chips`.
- Use `savedViews` for recurring operator workflows.

## DataTable

### Adoption criteria
- Use `DataTable` for 5 or more columns, or when row action and sorting are needed.
- Switch to card layout for very narrow viewports when rows include rich multi-line content.
- Keep page size near 20 for balanced scan speed and payload.
