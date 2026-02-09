# Command Palette Guidelines

## Purpose
`CommandPalette` standardizes cross-screen quick actions for keyboard-first workflows.

## UX Contract
- Trigger: `Ctrl+K` (Windows/Linux) or `Cmd+K` (macOS)
- Search target: `label`, `keywords`, `description`, `group`
- Navigation: `ArrowUp`/`ArrowDown` to move, `Enter` to run, `Esc` to close
- Grouping: show by `group`; recently executed actions are surfaced as `Recent`

## Action Design Rules
- Keep `label` short and verb-first. Example: `Create invoice`
- Use `description` for context, not duplicate labels
- Define `shortcut` only for high-frequency commands
- Mark unavailable actions with `disabled` and provide non-palette fallback in UI

## Accessibility Notes
- Input uses `role="combobox"` and list uses `role="listbox"`
- Active item is communicated by `aria-activedescendant`
- Provide localized `ariaLabel` where language context differs

## Recommended Integration
- Place one palette instance near app shell/root layout
- Feed `actions` from permission-aware providers
- Use `onActionRun` for telemetry events (`view/click/error`) without coupling to UI

## Regression Checklist
- Keyboard-only execution completes a target action
- `Recent` ordering is stable after reload
- No focus trap break when opened from modal-heavy pages
- Empty-result state remains readable in compact width
