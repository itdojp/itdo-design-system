# Editable DataGrid Guidelines

This guide defines baseline rules for `EditableDataGrid` to keep inline editing behavior
consistent across ITDO business applications.

## UX Contract

- Enter edit mode per row and keep edit scope explicit.
- Show dirty state before save so users can see pending edits.
- Keep save and cancel actions visible in the same row context.
- Surface validation in two layers:
  - inline error near the field
  - row-level summary for quick scanning

## API Rules

- Define columns with `EditableDataGridColumnContract`.
- Use `editor.type` to choose cell editor (`text|number|date|select`).
- Use `validator` to return field-level messages.
- Use `onSaveRow` to persist and reconcile with backend state.

## Validation Rules

- Validation messages must be actionable and specific.
- Required and format violations should use different wording.
- Validation summary count should match inline errors.

## Do

- Validate before save and block invalid payload submission.
- Keep keyboard tab order stable while editing.
- Keep changed fields minimal and pass `changedKeys` to save callback.

## Don't

- Do not silently discard modified values.
- Do not hide save failure details from users.
- Do not mix row-level and page-level save semantics in one grid.
