import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EditableDataGrid } from './EditableDataGrid';
import type { EditableDataGridColumnContract, EditableGridRowRecord } from '../../types';

type TestRow = EditableGridRowRecord & {
  member: string;
  hours: number;
  status: string;
};

const columns: EditableDataGridColumnContract<TestRow>[] = [
  {
    key: 'member',
    header: 'Member',
    editor: { type: 'text' },
    validator: (value) => (String(value ?? '').trim().length === 0 ? 'Member is required.' : null),
  },
  {
    key: 'hours',
    header: 'Hours',
    editor: { type: 'number', min: 0, max: 24, step: 0.5 },
    validator: (value) => (typeof value === 'number' && value > 0 ? null : 'Hours must be greater than 0.'),
  },
  {
    key: 'status',
    header: 'Status',
    editor: {
      type: 'select',
      options: [
        { label: 'Open', value: 'Open' },
        { label: 'Pending', value: 'Pending' },
      ],
    },
  },
];

const rows: TestRow[] = [
  { id: 'TS-001', member: 'Sato', hours: 7.5, status: 'Open' },
  { id: 'TS-002', member: 'Tanaka', hours: 8, status: 'Pending' },
];

describe('EditableDataGrid', () => {
  it('renders editors and saves dirty row', async () => {
    const onSaveRow = jest.fn().mockResolvedValue(undefined);

    render(<EditableDataGrid<TestRow> columns={columns} rows={rows} onSaveRow={onSaveRow} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    fireEvent.change(screen.getByLabelText('Hours for row TS-001'), { target: { value: '8.5' } });

    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(onSaveRow).toHaveBeenCalledWith(
        expect.objectContaining({
          rowId: 'TS-001',
          changedKeys: ['hours'],
        })
      );
    });
  });

  it('shows inline and summary errors when validation fails', async () => {
    const onSaveRow = jest.fn().mockResolvedValue(undefined);

    render(<EditableDataGrid<TestRow> columns={columns} rows={rows} onSaveRow={onSaveRow} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    fireEvent.change(screen.getByLabelText('Member for row TS-001'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getAllByText('Member is required.')).toHaveLength(2);
    expect(screen.getByText('1 validation error(s)')).toBeInTheDocument();
    expect(onSaveRow).not.toHaveBeenCalled();
  });

  it('cancels row edit and restores read mode', () => {
    render(<EditableDataGrid<TestRow> columns={columns} rows={rows} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Edit' })[0]);
    fireEvent.change(screen.getByLabelText('Member for row TS-001'), { target: { value: 'Updated' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByText('Sato')).toBeInTheDocument();
    expect(screen.queryByLabelText('Member for row TS-001')).not.toBeInTheDocument();
  });
});
