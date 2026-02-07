# Telemetry Events Specification

This document defines baseline telemetry events for design-system adoption tracking.

## Event Categories
- `view`: component or pattern view impression.
- `click`: explicit user interaction on actionable controls.
- `error`: UI-level recoverable error surfaced to users.

## Event Naming
- Prefix with `ds.` to indicate design-system emitted events.
- Use `<surface>.<component>.<action>` naming:
  - Example: `ds.designbook.datatable.open_detail.click`

## Minimum Payload
- `eventName`: string
- `category`: `view | click | error`
- `surface`: screen or story identifier
- `component`: component/pattern identifier
- `target`: action target identifier
- `status`: `success | error` (for click/error)
- `occurredAt`: ISO8601 timestamp
- `metadata`: optional object for domain attributes

## Baseline Event Set
- `ds.designbook.master_list.view`
- `ds.designbook.telemetry_panel.view`
- `ds.designbook.datatable.open_detail.click`
- `ds.designbook.telemetry.simulate_error.error`

## Operational Notes
- Events must not contain PII.
- Keep payload keys stable for dashboard compatibility.
- Add new events as additive changes in minor versions.
