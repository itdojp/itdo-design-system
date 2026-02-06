import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Alert } from '../../components/Alert';
import {
  DataGridSurface,
  DataGridToolbar,
  DataGridPagination,
  DataGridEmptyState,
  DataGridLoadingState,
} from './';

const meta: Meta<typeof DataGridSurface> = {
  title: 'Patterns/DataGrid',
  component: DataGridSurface,
};

export default meta;

type Story = StoryObj<typeof DataGridSurface>;

const columns = [
  { key: 'member', header: 'Member' },
  { key: 'project', header: 'Project' },
  { key: 'hours', header: 'Hours', align: 'right' as const },
  { key: 'status', header: 'Status' },
];

const rows = [
  { id: '1', member: 'Sato', project: 'ERP4', hours: '7.5', status: 'Open' },
  { id: '2', member: 'Tanaka', project: 'ERP4', hours: '8.0', status: 'Submitted' },
  { id: '3', member: 'Suzuki', project: 'Core', hours: '6.0', status: 'Approved' },
  { id: '4', member: 'Kobayashi', project: 'Ops', hours: '5.5', status: 'Open' },
];

const DataGridTable = () => (
  <table className="itdo-datagrid__table" role="grid">
    <thead>
      <tr className="itdo-datagrid__header-row">
        {columns.map((column) => (
          <th
            key={column.key}
            className="itdo-datagrid__header-cell"
            style={{ textAlign: column.align ?? 'left' }}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, index) => (
        <tr
          key={row.id}
          className={index === 1 ? 'itdo-datagrid__row is-selected' : 'itdo-datagrid__row'}
        >
          {columns.map((column, colIndex) => (
            <td
              key={`${row.id}-${column.key}`}
              className="itdo-datagrid__cell"
              style={{ textAlign: column.align ?? 'left' }}
              tabIndex={index === 0 && colIndex === 0 ? 0 : -1}
            >
              {row[column.key as keyof typeof row]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

export const Default: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <DataGridToolbar
        actions={<Button size="small">Export</Button>}
      >
        <Input label="Search" placeholder="Search" />
        <Select label="Status" placeholder="All">
          <option value="open">Open</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
        </Select>
      </DataGridToolbar>

      <DataGridSurface className="itdo-datagrid--zebra">
        <DataGridTable />
      </DataGridSurface>

      <DataGridPagination>
        <Button variant="secondary" size="small">
          Prev
        </Button>
        <Button variant="secondary" size="small">
          Next
        </Button>
      </DataGridPagination>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <DataGridSurface>
      <DataGridLoadingState label="Loading entries..." />
    </DataGridSurface>
  ),
};

export const Empty: Story = {
  render: () => (
    <DataGridSurface>
      <DataGridEmptyState
        title="No entries"
        description="Try adjusting filters or import a CSV file."
        action={<Button size="small">Import</Button>}
      />
    </DataGridSurface>
  ),
};

export const Error: Story = {
  render: () => (
    <DataGridSurface>
      <div className="itdo-datagrid-state">
        <Alert variant="error" title="Failed to load">
          Please refresh or try again later.
        </Alert>
      </div>
    </DataGridSurface>
  ),
};
