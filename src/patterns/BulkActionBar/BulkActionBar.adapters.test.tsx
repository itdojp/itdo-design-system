import {
  createDataGridBulkActionBarProps,
  createDataTableBulkActionBarProps,
} from './BulkActionBar.adapters';

describe('BulkActionBar adapters', () => {
  it('maps DataTable bulk actions to BulkActionBar props', () => {
    const rows = [
      { id: '1', name: 'A' },
      { id: '2', name: 'B' },
    ];
    const onArchive = jest.fn();
    const onClearSelection = jest.fn();

    const props = createDataTableBulkActionBarProps({
      selectedRows: rows,
      bulkActions: [
        {
          key: 'archive',
          label: 'Archive',
          onSelect: onArchive,
        },
      ],
      selectedRowsLabel: (count) => `${count} selected`,
      clearSelectionLabel: 'Clear all',
      onClearSelection,
    });

    expect(props.selectedCount).toBe(2);
    expect(props.selectedRowsLabel?.(2)).toBe('2 selected');
    props.actions[0].onSelect();
    expect(onArchive).toHaveBeenCalledWith(rows);
    props.onClearSelection?.();
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  it('maps DataGrid actions to BulkActionBar props', () => {
    const selectedItems = [{ id: 'r1' }, { id: 'r2' }];
    const onDelete = jest.fn();

    const props = createDataGridBulkActionBarProps({
      selectedItems,
      actions: [
        {
          key: 'delete',
          label: 'Delete',
          tone: 'danger',
          onSelect: onDelete,
        },
      ],
      selectedRowsLabel: (count) => `${count} selected`,
      clearSelectionLabel: 'Reset',
      onClearSelection: () => undefined,
    });

    expect(props.selectedCount).toBe(2);
    expect(props.actions[0].tone).toBe('danger');
    props.actions[0].onSelect();
    expect(onDelete).toHaveBeenCalledWith(selectedItems);
  });
});
