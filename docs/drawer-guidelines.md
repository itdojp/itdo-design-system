# Drawer Guidelines

This guide defines the baseline usage contract for `Drawer`.

## Drawer vs Dialog

- Use `Drawer` for context-preserving side workflows:
  - list -> detail view
  - lightweight edits while keeping background state visible
  - cross-checking metadata without full context switch
- Use `Dialog` for short, blocking decisions:
  - destructive confirmation
  - single-step input request
  - critical acknowledgement

## Interaction Contract

- Support close actions via:
  - close button
  - `Escape` key (`closeOnEsc`)
  - overlay click (`closeOnOverlay`)
- Keep focus trapped inside the drawer while open.
- Restore focus to the previously active element on close.

## Layout Contract

- Use `placement`:
  - `right`: default for detail/edit workflows.
  - `left`: side context panels when right side is occupied.
- Use `size` based on content density:
  - `sm`: quick summary
  - `md`: default form/edit detail
  - `lg`: complex detail with multiple sections
  - `full`: immersive side workflow
- On mobile viewport, fallback to full-screen panel.

## Accessibility Contract

- Keep semantic dialog roles (`role="dialog"`, `aria-modal="true"`).
- Always provide meaningful `title`; include `description` when context is non-obvious.
- Keep all interactive footer actions keyboard reachable.
