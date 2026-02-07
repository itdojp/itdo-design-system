# Deprecation Policy

`@itdo/design-system` must be treated as an append-only public package.
`unpublish` is not used in normal operations.

## Lifecycle
1. Announce: mark API as deprecated in docs and Storybook.
2. Warn: add runtime/dev warning where feasible.
3. Replace: provide explicit migration target and code example.
4. Remove: execute only in major release with migration guide.

## SemVer Rules
- Patch: bug fix, no API behavior change.
- Minor: additive API and deprecation announcements.
- Major: breaking removals only after at least one minor cycle with deprecation notice.

## npm Operation
- Use `npm deprecate` for problematic versions.
- Keep package installable; communicate replacement version in deprecate message.
- Never rely on `unpublish` for incident response.

## Required Documentation
- Changelog entry with `Breaking` or `Non-breaking`.
- Migration guide section with before/after snippet.
- PR description must include impact scope and rollback strategy.
