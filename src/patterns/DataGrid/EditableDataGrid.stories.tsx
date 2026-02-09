import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { expect, fireEvent, within } from 'storybook/test';
import type {
  EditableDataGridColumnContract,
  EditableGridRowRecord,
  EditableGridSavePayload,
} from '../../types';
import { EditableDataGrid } from './EditableDataGrid';

type TimesheetRow = EditableGridRowRecord & {
  member: string;
  project: string;
  workDate: string;
  hours: number;
  status: string;
};

const columns: EditableDataGridColumnContract<TimesheetRow>[] = [
  {
    key: 'member',
    header: 'Member',
    editor: { type: 'text', placeholder: 'Member name' },
    validator: (value) => (String(value ?? '').trim().length === 0 ? 'Member is required.' : null),
  },
  {
    key: 'project',
    header: 'Project',
    editor: {
      type: 'select',
      options: [
        { label: 'ERP4 Core', value: 'ERP4 Core' },
        { label: 'ERP4 Timesheet', value: 'ERP4 Timesheet' },
        { label: 'ERP4 Approval', value: 'ERP4 Approval' },
      ],
    },
    validator: (value) => (String(value ?? '').trim().length === 0 ? 'Project is required.' : null),
  },
  {
    key: 'workDate',
    header: 'Work Date',
    editor: { type: 'date' },
    validator: (value) => (String(value ?? '').trim().length === 0 ? 'Work date is required.' : null),
  },
  {
    key: 'hours',
    header: 'Hours',
    align: 'right',
    editor: { type: 'number', min: 0, max: 24, step: 0.5 },
    validator: (value) => {
      if (typeof value !== 'number') {
        return 'Hours must be numeric.';
      }
      if (value <= 0) {
        return 'Hours must be greater than 0.';
      }
      if (value > 24) {
        return 'Hours must be 24 or less.';
      }
      return null;
    },
    formatter: (value) => (typeof value === 'number' ? value.toFixed(1) : String(value ?? '')),
  },
  {
    key: 'status',
    header: 'Status',
    editor: {
      type: 'select',
      options: [
        { label: 'Open', value: 'Open' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Approved', value: 'Approved' },
      ],
    },
  },
];

const initialRows: TimesheetRow[] = [
  {
    id: 'TS-001',
    member: 'Sato',
    project: 'ERP4 Timesheet',
    workDate: '2026-02-08',
    hours: 7.5,
    status: 'Open',
  },
  {
    id: 'TS-002',
    member: 'Tanaka',
    project: 'ERP4 Core',
    workDate: '2026-02-08',
    hours: 8,
    status: 'Pending',
  },
];

const meta: Meta<typeof EditableDataGrid<TimesheetRow>> = {
  title: 'Patterns/DataGrid/EditableDataGrid',
  component: EditableDataGrid<TimesheetRow>,
};

export default meta;

type Story = StoryObj<typeof EditableDataGrid<TimesheetRow>>;

export const Default: Story = {
  render: () => {
    const [rows, setRows] = useState(initialRows);
    const [lastSave, setLastSave] = useState<string>('No save yet');

    const handleSave = async (payload: EditableGridSavePayload<TimesheetRow>) => {
      setRows((previous) =>
        previous.map((row) => (row.id === payload.rowId ? payload.nextRow : row))
      );
      setLastSave(`${payload.rowId}: ${payload.changedKeys.join(', ')}`);
    };

    return (
      <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
        <EditableDataGrid<TimesheetRow>
          caption="Timesheet entries"
          columns={columns}
          rows={rows}
          onSaveRow={handleSave}
        />
        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }} data-testid="editable-grid-last-save">
          {lastSave}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Sato')).toBeInTheDocument();
    fireEvent.click(canvas.getAllByRole('button', { name: 'Edit' })[0]);
    const hoursField = canvas.getByLabelText('Hours for row TS-001');
    fireEvent.change(hoursField, { target: { value: '8.5' } });
    fireEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(canvas.getByTestId('editable-grid-last-save')).toHaveTextContent('TS-001');
  },
};

export const ValidationError: Story = {
  render: () => {
    const [rows, setRows] = useState(initialRows);
    const validationColumns = useMemo(() => columns, []);

    return (
      <EditableDataGrid<TimesheetRow>
        caption="Timesheet entries"
        columns={validationColumns}
        rows={rows}
        onSaveRow={async (payload) => {
          setRows((previous) =>
            previous.map((row) => (row.id === payload.rowId ? payload.nextRow : row))
          );
        }}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getAllByRole('button', { name: 'Edit' })[0]);
    fireEvent.change(canvas.getByLabelText('Member for row TS-001'), {
      target: { value: '' },
    });
    fireEvent.click(canvas.getByRole('button', { name: 'Save' }));
    await expect(canvas.getAllByText('Member is required.')).toHaveLength(2);
  },
};
