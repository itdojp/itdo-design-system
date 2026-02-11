# Audit Timeline Guidelines

This guide defines boundaries between `EventLog` and `AuditTimeline` / `DiffViewer`.

## EventLog vs AuditTimeline

- Use `EventLog` for compact activity summaries in transactional screens.
- Use `AuditTimeline` when operators need chronological investigation:
  - incident analysis
  - policy change tracing
  - multi-step override history

## DiffViewer Usage

- Pair `DiffViewer` with selected timeline events for before/after investigation.
- Use `format="json"` for structured policy/config diffs.
- Use `format="text"` for log snippets and plain configuration entries.

## Performance Contract

- For long outputs, keep initial render bounded via `maxVisibleLines`.
- Enable compact mode where vertical space is constrained.
- Default to collapsed view for large diffs and expand on demand.

## Tone and Priority

- Map event tone by operational severity:
  - `success`: expected completed operation
  - `warning`: unusual but recoverable
  - `error`/`critical`: requires immediate operator attention
- Keep tone mapping stable across products to reduce cognitive load.
