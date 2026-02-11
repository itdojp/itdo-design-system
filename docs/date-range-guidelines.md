# Date Range Guidelines

This guide defines the baseline contract for `DateRangePicker` and `DateTimeRangePicker`.

## Preset Rules

- Keep preset labels stable across screens: `Today`, `Last 7 days`, `Last 30 days`, `This month`.
- Prefer presets for high-frequency filter operations to reduce manual input errors.
- If business logic requires fixed periods (for example fiscal terms), provide explicit custom presets.
- Preset application must update both `from` and `to` in one operation.

## Timezone Rules (`DateTimeRangePicker`)

- Always show timezone context using `timezoneLabel` when datetime precision matters.
- Use one canonical timezone per screen to avoid mixed-interpretation ranges.
- Keep backend query timezone conversion explicit and deterministic.
- Do not infer timezone from browser locale in compliance-sensitive workflows.

## Validation Rules

- Enforce immediate validation when `from > to`.
- For mandatory edges, set `allowEmptyFrom={false}` and/or `allowEmptyTo={false}`.
- Validate range bounds with `min` and `max` consistently at both UI and API layers.
- Keep error copy actionable and operation-oriented (what to change, not only what failed).

## Accessibility Rules

- Expose semantic grouping with fieldset/legend for screen readers.
- Keep labels explicit for both edges (`From`, `To` or domain-specific labels).
- Ensure all preset actions are keyboard reachable as standard buttons.
- Surface validation text through `aria-describedby` and `aria-invalid` when errors are active.
