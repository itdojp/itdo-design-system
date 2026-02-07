import { fireEvent, render, screen, within } from '@testing-library/react';
import { DataTable } from './DataTable';
import { DataTableColumn, DataTableRow } from './CrudList.types';
import * as dataTableUtils from './DataTable.utils';

const columns: DataTableColumn[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'status', header: 'Status' },
];

const rows: DataTableRow[] = [
  { id: '2', name: 'Beta', status: 'Pending' },
  { id: '1', name: 'Alpha', status: 'Approved' },
];

describe('DataTable', () => {
  it('renders loading state', () => {
    render(<DataTable columns={columns} rows={rows} loading loadingLabel="Loading table..." />);
    expect(screen.getByText('Loading table...')).toBeInTheDocument();
  });

  it('sorts rows when sortable header is clicked', () => {
    render(<DataTable columns={columns} rows={rows} pageSize={10} />);

    const sortButton = screen.getByRole('button', { name: /Name/ });
    fireEvent.click(sortButton);

    const tableRows = screen.getAllByRole('row');
    expect(within(tableRows[1]).getByText('Alpha')).toBeInTheDocument();
    expect(within(tableRows[2]).getByText('Beta')).toBeInTheDocument();
  });

  it('supports multi row selection and callback', () => {
    const onSelectionChange = jest.fn();
    render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable="multiple"
        pageSize={10}
        onSelectionChange={onSelectionChange}
      />
    );

    fireEvent.click(screen.getByLabelText('Select row 2'));
    fireEvent.click(screen.getByLabelText('Select row 1'));

    expect(onSelectionChange).toHaveBeenCalledWith(['2']);
    expect(onSelectionChange).toHaveBeenLastCalledWith(['2', '1']);
  });

  it('executes row action with keyboard Enter', () => {
    const onSelect = jest.fn();

    render(
      <DataTable
        columns={columns}
        rows={rows}
        rowActions={[
          {
            key: 'open',
            label: 'Open',
            onSelect,
          },
        ]}
      />
    );

    const firstBodyRow = screen.getAllByRole('row')[1];
    firstBodyRow.focus();
    fireEvent.keyDown(firstBodyRow, { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledWith(rows[0]);
  });

  it('supports bulk action after page-level select all', () => {
    const onBulkArchive = jest.fn();

    render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable="multiple"
        pageSize={10}
        bulkActions={[
          {
            key: 'archive',
            label: 'Archive',
            onSelect: onBulkArchive,
          },
        ]}
      />
    );

    fireEvent.click(screen.getByLabelText('Select all rows in page'));
    fireEvent.click(screen.getByRole('button', { name: 'Archive' }));

    expect(onBulkArchive).toHaveBeenCalledWith(rows);
  });

  it('toggles column visibility from settings menu', () => {
    render(
      <DataTable
        columns={columns}
        rows={rows}
        pageSize={10}
        enableColumnVisibilityControl
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Columns' }));
    fireEvent.click(screen.getByLabelText('Status'));

    expect(screen.queryByRole('columnheader', { name: 'Status' })).not.toBeInTheDocument();
  });

  it('emits query contract when sort is changed', () => {
    const onQueryChange = jest.fn();

    render(
      <DataTable
        columns={columns}
        rows={rows}
        pageSize={1}
        onQueryChange={onQueryChange}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Sort by Name/ }));

    expect(onQueryChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        sort: {
          key: 'name',
          direction: 'asc',
        },
        pagination: expect.objectContaining({
          page: 1,
          pageSize: 1,
          totalItems: 2,
        }),
      })
    );
  });

  it('keeps current sort direction when query sort direction is omitted', () => {
    const { rerender } = render(
      <DataTable
        columns={columns}
        rows={rows}
        pageSize={10}
        initialSort={{ key: 'name', direction: 'desc' }}
        query={{ sort: { key: 'name', direction: 'desc' } }}
      />
    );

    rerender(
      <DataTable
        columns={columns}
        rows={rows}
        pageSize={10}
        initialSort={{ key: 'name', direction: 'desc' }}
        query={{ sort: { key: 'name' } as never }}
      />
    );

    expect(screen.getByRole('button', { name: /Sort by Name, current: descending/i })).toBeInTheDocument();
  });

  it('always renders non-hideable columns even when visibleColumnKeys omits them', () => {
    const lockedColumns: DataTableColumn[] = [
      { key: 'name', header: 'Name', hideable: false },
      { key: 'status', header: 'Status', hideable: true },
    ];

    render(
      <DataTable
        columns={lockedColumns}
        rows={rows}
        pageSize={10}
        visibleColumnKeys={['status']}
      />
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument();
  });

  it('pins at most one column per side and does not pin actions when right pinned column exists', () => {
    const pinnedColumns: DataTableColumn[] = [
      { key: 'name', header: 'Name', pinned: 'left' },
      { key: 'status', header: 'Status', pinned: 'left' },
      { key: 'kind', header: 'Kind', pinned: 'right' },
    ];
    const pinnedRows: DataTableRow[] = [{ id: '1', name: 'Alpha', status: 'Open', kind: 'Master' }];

    render(
      <DataTable
        columns={pinnedColumns}
        rows={pinnedRows}
        rowActions={[{ key: 'open', label: 'Open', onSelect: () => undefined }]}
      />
    );

    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveClass('itdo-data-table__cell--pinned-left');
    expect(screen.getByRole('columnheader', { name: 'Status' })).not.toHaveClass('itdo-data-table__cell--pinned-left');
    expect(screen.getByRole('columnheader', { name: 'Kind' })).toHaveClass('itdo-data-table__cell--pinned-right');
    expect(screen.getByRole('columnheader', { name: 'Actions' })).not.toHaveClass('itdo-data-table__cell--pinned-right');
  });

  it('does not recompute sorted rows for selection-only updates', () => {
    const sortRowsSpy = jest.spyOn(dataTableUtils, 'sortRows');

    render(
      <DataTable
        columns={columns}
        rows={rows}
        selectable="multiple"
        pageSize={10}
      />
    );

    expect(sortRowsSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByLabelText('Select row 2'));
    fireEvent.click(screen.getByLabelText('Select row 1'));
    expect(sortRowsSpy).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /Sort by Name/ }));
    expect(sortRowsSpy).toHaveBeenCalledTimes(2);

    sortRowsSpy.mockRestore();
  });
});
