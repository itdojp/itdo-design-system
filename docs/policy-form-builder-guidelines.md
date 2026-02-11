# Policy Form Builder Guidelines

This guide defines schema rules for `PolicyFormBuilder`.

## Schema Contract

- Use `schema.fields[]` as the single source of truth for field rendering.
- Required field keys:
  - `name`: stable key used in `value`.
  - `label`: operator-facing label.
  - `type`: one of `text|number|select|checkbox|textarea|date|datetime|json`.
- Optional behavior keys:
  - `required`
  - `validator(fieldValue, formValue)`
  - `visibleWhen(formValue)`
  - `disabled` (boolean or function)
  - `sectionId` for sectioned layouts.

## Value Contract

- `value` is a plain object map (`Record<string, unknown>`).
- For `json` fields:
  - edit as text in the form.
  - submit path parses valid JSON into objects.
  - invalid JSON blocks submit with aggregate validation.

## Layout Contract

- `single`: one-column standard forms.
- `two-column`: compact management panels.
- `sectioned`: explicit grouped forms using `schema.sections`.
- Use `columnSpan: 2` for long text/JSON in two-column layouts.

## Validation Contract

- Field-level rules are shown inline using existing `Input/Select/Textarea/FormField` patterns.
- Aggregate errors are shown at the top of the form.
- Submit is disabled while validation errors exist.

## Compatibility Notes

- Reuse existing primitives (`Input`, `Select`, `Textarea`, `FormField`) to keep style and a11y consistent.
- Keep option labels and validation copy stable across admin screens.
