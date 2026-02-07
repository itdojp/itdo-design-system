# Async Feedback Guidelines

## Scope
- `AsyncStatePanel`
- `EmptyState`
- `Spinner`
- `Skeleton`
- `Toast`
- `Dialog`
- `ConfirmActionDialog`

## State Transition Matrix
| From | To | Trigger | UI Contract |
| --- | --- | --- | --- |
| loading | ready | request success with data | Main content only |
| loading | empty | request success with no data | EmptyState + primary/secondary/ghost CTA |
| loading | error | request failure | Error alert + retry/secondary/contact/back actions |
| error | loading | retry action | Spinner + loading text |
| error | ready | retry success | Main content only |
| error | empty | retry success with no data | EmptyState |

## Recovery Action Priority
1. `retryAction` (primary)
2. `secondaryAction` (secondary)
3. `contactAction` (ghost)
4. `backAction` (ghost)

## Spinner vs Skeleton
- Use `Spinner` when completion timing is unknown or processing is blocking.
- Use `Skeleton` when shape/layout is known and content is loading progressively.
- Do not show `Spinner` and dense `Skeleton` together in the same region.

## Toast Rules
- Severity priority: `error > warning > success > info`
- Default TTL:
- `error`: stay (manual close)
- `warning`: 7000ms
- `info`: 5000ms
- `success`: 4000ms
- Deduplicate with `dedupeKey` for repeated events from same source.
- A11y:
- `error/warning`: `role="alert"`, `aria-live="assertive"`
- `info/success`: `role="status"`, `aria-live="polite"`

## Dialog / ConfirmActionDialog Rules
- Use `Dialog` only for high-priority decisions and focused tasks.
- Use `ConfirmActionDialog` for irreversible operations.
- Destructive operations must set:
- `tone="danger"`
- `requireReason={true}` when audit trace is needed
- Keep `confirmLabel` explicit (`Delete`, `Reject`, `Revoke`) and avoid generic labels.

## Keyboard and Focus Baseline
- `Escape` closes topmost dialog when enabled.
- Focus returns to previous trigger after dialog close.
- Confirmation flows must remain keyboard-operable end-to-end.
