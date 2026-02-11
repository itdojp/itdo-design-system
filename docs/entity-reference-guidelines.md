# Entity Reference Guidelines

This guide defines baseline rules for `EntityReferencePicker`.

## Selection Contract

- Keep both machine identity and operator-readable context:
  - `id` and `kind` for persistence/API payload.
  - `label` for display in UI and logs.
- Use `multiple` only when the workflow truly needs cross-reference sets.
- Apply `maxItems` to avoid over-linking and accidental noisy references.

## Candidate Search Contract

- Call `fetchCandidates(query, kind, scope)` per allowed kind.
- Keep partial match behavior consistent for `id` and label text.
- Filter out already selected entities from candidate list.
- Keep result ordering deterministic for keyboard users.

## DeepLink Contract

- Generate stable, canonical links with `toDeepLink(entity)`.
- Deep links should be copy-paste safe and avoid transient query params by default.
- Use the same route pattern per kind:
  - `project`: `/projects/{id}`
  - `vendor`: `/vendors/{id}`
  - `customer`: `/customers/{id}`
  - `document`: `/docs/{id}`
  - `chat_message`: `/chat/{id}`
- Keep authorization checks on destination pages; deep links are pointers, not permission grants.

## Accessibility Contract

- Use combobox/listbox semantics for keyboard and screen reader navigation.
- Keep option labels explicit (`label`, `id`, `kind`).
- Ensure remove actions are keyboard reachable and have explicit `aria-label`.
- Surface errors via `aria-invalid` and message text.
