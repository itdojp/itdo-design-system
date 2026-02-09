# Saved View Guidelines

## Purpose
`SavedViewBar` standardizes the workflow for saving, selecting, sharing, and updating list filters.

## UX Contract
- Save current query/filters as a named view (`Save as new`)
- Switch active view from chip-like selector
- Update active view in-place after query edits
- Duplicate active view before risky changes
- Share active view with stable URL token (`savedView` id)

## Hook Contract
- `useSavedViews` manages in-memory state and persistence adapter integration
- Persistence abstraction: `SavedViewsStorageAdapter.load/save`
- Default persistence option: `createLocalStorageSavedViewsAdapter`

## Naming Rules
- Use task-oriented names (`Pending approvals`, `My overdue items`)
- Avoid ambiguous names (`Default`, `View 1`)
- Keep names under 30-40 characters for chip readability

## Accessibility Notes
- Active view selector uses `radiogroup` + `role="radio"`
- Save-as input is keyboard operable (`Enter` creates view)
- Action buttons must remain available with clear disabled states

## Regression Checklist
- Creating/updating/duplicating/deleting view keeps selection state consistent
- Persisted views reload correctly via adapter
- Shared link generation keeps URL-safe encoding
- i18n labels fit without overflow on small screens
