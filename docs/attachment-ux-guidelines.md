# Attachment UX Guidelines

This guide defines attachment handling behavior for upload-heavy business forms.

## State Rules

- Use explicit statuses: `queued`, `uploading`, `virus_scanning`, `uploaded`, `failed`.
- Display progress while `uploading`.
- Display retry action and reason while `failed`.
- Block preview until status is `uploaded`.

## Preview Rules

- Image: render direct image preview.
- PDF: render embedded preview frame.
- Generic file: render metadata summary card.
- Keep selected preview state controllable from parent.

## Validation Rules

- Warn when file size exceeds UI-defined threshold.
- Keep system scan state visible (`virus_scanning`) and do not mark as uploaded before completion.

## Operational Rules

- Retry must be row-local and idempotent.
- Remove action must always be available.
- Keep list and preview panes responsive on small screens.
