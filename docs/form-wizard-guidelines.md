# Form Wizard Guidelines

This guide describes baseline behavior for `FormWizard` and `useDraftAutosave`.

## Step Rules

- Use one task-focused unit per step.
- Define `isComplete` for each step explicitly.
- Lock forward navigation when the current step is incomplete.
- Mark optional steps with `optional: true`.

## Draft Autosave Rules

- Run interval autosave for multi-step forms.
- Expose save status (`idle/saving/saved/error/conflict`) in UI.
- Provide restore and retry actions when needed.
- Keep draft payload and form payload shape identical.

## Exit Protection

- Enable `protectUnsavedChanges` when draft can be lost.
- Use `isDirty` from `useDraftAutosave` as the source of truth.

## Error Handling

- Conflict status must block silent overwrite.
- Save failures must surface an actionable retry.
- Do not hide autosave failures from operators.
