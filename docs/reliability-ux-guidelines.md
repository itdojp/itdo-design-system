# Reliability UX Guidelines

This guide defines the baseline contract for recovery-oriented UX in business flows.

## UndoToast contract

- Use `UndoToast` for destructive or irreversible actions that can be reverted for a short time.
- Required event handlers:
  - `onUndo`: called when the user cancels before timeout.
  - `onCommit`: called when timeout expires and change becomes final.
- Recommended duration:
  - 3 to 8 seconds (`durationMs`) depending on operation complexity.
- Behavior:
  - pending: show undo action and countdown.
  - undone: revert action and close notification.
  - committed: finalize action and close notification.

## StatePreset contract

`StatePreset` standardizes `loading|empty|error|success` rendering.

- `loading`
  - Show spinner + concise progress label.
- `empty`
  - Explain why data is absent and show primary recovery action.
- `error`
  - Keep action order fixed:
    1. `retry` (primary): retry the same operation.
    2. `contact` (secondary): contact support or owner.
    3. `fallback` (ghost): alternate path (back/list/dashboard).
  - Optional technical detail can be shown in expandable mode.
- `success`
  - Show next best action after completion.

## Operational notes

- Use stable action labels across screens to reduce cognitive load.
- Do not hide recovery actions behind menus in error mode.
- Add Storybook scenarios for timeout, retry failure, and fallback route.
