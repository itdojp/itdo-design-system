# Bulk Action Guidelines

## Purpose
`BulkActionBar` standardizes multi-selection operations for both `DataTable` and `DataGrid` surfaces.

## UX Contract
- Show bar only when one or more rows are selected
- Always display selection count
- Provide primary operations in left-to-right order of frequency
- Keep `Clear` action available to recover from accidental multi-select

## Adapter Contract
- `createDataTableBulkActionBarProps`
  - Input: selected rows + `DataTableBulkAction[]`
  - Output: `BulkActionBarProps`
- `createDataGridBulkActionBarProps`
  - Input: selected items + custom grid actions
  - Output: `BulkActionBarProps`

## Action Design Rules
- Use concise labels (`Approve selected`, `Export CSV`)
- Mark destructive operations with `tone: 'danger'`
- Disable actions when backend preconditions are not met

## Accessibility Notes
- Bar container uses status live region to announce current selection count
- Action buttons must be reachable by keyboard in tab order
- Clear action should remain visible and named consistently

## Regression Checklist
- Selection count updates immediately when row selection changes
- DataTable bulk action receives current selected rows
- DataGrid adapter executes actions with selected items payload
- Clear action reliably resets selection state
