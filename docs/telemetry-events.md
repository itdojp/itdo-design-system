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

## Minimum Payload (Current)
- `event`: canonical event key (`ds.<surface>.<component>.<action>`)
- `action`: normalized action key
- `context`: object with surface/component/target metadata
- `result`: `success | error`
- `occurredAt`: ISO8601 timestamp
- `metadata`: optional object

## Legacy Payload (Deprecated)
- `eventName`: string
- `category`: `view | click | error`
- `surface`: screen or story identifier
- `component`: component/pattern identifier
- `target`: action target identifier
- `status`: `success | error` (for click/error)
- `occurredAt`: ISO8601 timestamp
- `metadata`: optional object for domain attributes

## Utility API
- `createTelemetryEvent(input)`: normalize payload and apply defaults.
- `validateTelemetryEvent(payload)`: validate required attributes and types.
- `emitTelemetryEvent(input, { transport, onError })`: validate and send payload safely.
- `telemetryHookPoints`: component hook-point map for instrumentation planning.

## Baseline Event Set
- `ds.designbook.master_list.view`
- `ds.designbook.telemetry_panel.view`
- `ds.designbook.datatable.open_detail.click`
- `ds.designbook.telemetry.simulate_error.error`

## Operational Notes
- Events must not contain PII.
- Keep payload keys stable for dashboard compatibility.
- Add new events as additive changes in minor versions.
- Keep hook-point definitions in `docs/telemetry-hook-points.md`.
