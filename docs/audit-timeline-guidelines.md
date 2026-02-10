# Audit Timeline Guidelines

This guide defines implementation rules for audit tracking UI.

## Event coverage

- Include at least `created`, `updated`, `approved`, and `returned`.
- Show actor and timestamp for each event.
- Keep event title action-oriented and concise.

## Diff behavior

- Show `before/after` values when an update changes state.
- Collapse diff by default and reveal it by explicit user action.
- Redact confidential fields before rendering diffs.

## Filter behavior

- Provide filters for event type, actor, and free-text query.
- Keep filter state stable when list updates.
- Render an explicit empty state when no event matches filters.

## Telemetry contract

- Emit `ds.audit_timeline.filter.change` on filter updates.
- Emit `ds.audit_timeline.entry.expand` and `ds.audit_timeline.entry.collapse` for diff toggles.
- Payload fields:
  - `event`, `action`, `context`, `result`, `occurredAt`
  - `context.surface`, `context.component`, `context.typeFilter`, `context.actorFilterState`
  - `context.hasQuery`, `context.queryLength`, `context.visibleCount`, `context.entryId` (for entry actions)
  - Never send raw actor names or free-text query strings to telemetry payloads.

## ERP4 usage notes

- Use `disable` mode in `PermissionGate` when users can request access to audit data.
- Use `hide` mode for admin-only events that should not be disclosed.
- Align actor naming with ERP4 user identifiers for support traceability.
