# Telemetry Hook Points

This document defines recommended telemetry insertion points for core components.

## Common schema

All component telemetry should emit the same payload shape:

- `event`: canonical event key (`ds.<surface>.<component>.<action>`)
- `action`: normalized action name
- `context`: object including surface/component/target state
- `result`: `success | error`
- `occurredAt`: ISO8601 datetime

## Component hook map

- `Button`
  - `click`
- `FormField`
  - `view`
  - `submit`
  - `error`
- `DataTable`
  - `view`
  - `filter_change`
  - `sort_change`
  - `page_change`
  - `selection_change`
  - `click`
- `Dialog`
  - `view`
  - `confirm`
  - `cancel`
  - `close`
- `CommandPalette`
  - `open`
  - `click`
  - `error`
- `UndoToast`
  - `view`
  - `click`
  - `error`
- `PermissionGate`
  - `view`
  - `click`
  - `error`

## Implementation notes

- Use `createTelemetryEvent` and `emitTelemetryEvent` from `src/utils/telemetry.ts`.
- Keep context values additive to avoid breaking dashboards.
- Do not include PII in telemetry payload fields.
