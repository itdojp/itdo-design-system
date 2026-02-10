# Permission Gate Guidelines

This guide standardizes UI behavior when user permissions are insufficient.

## Modes

- `hide`
  - Do not render restricted content.
  - Optionally render `fallback` message.
- `disable`
  - Render content in disabled form.
  - Show reason text to explain required permission.

## Standard behavior

- Prefer `disable` for discoverability when user can request access.
- Prefer `hide` for security-sensitive controls.
- Always provide a human-readable reason in `disable` mode.
- Keep reason text short and actionable:
  - Example: `Requires finance:approve permission.`

## Accessibility notes

- Disabled mode sets `aria-disabled="true"` and blocks pointer interaction.
- If the child supports `disabled`, pass it to prevent keyboard activation.
- Reason text should be rendered as supplementary note content.
