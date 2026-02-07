import { fireEvent, render, screen, within } from '@testing-library/react';
import { DataTable } from './DataTable';
import { DataTableColumn, DataTableRow } from './CrudList.types';

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
});
