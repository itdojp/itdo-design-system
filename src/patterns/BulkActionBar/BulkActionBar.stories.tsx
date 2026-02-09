import type { Meta, StoryObj } from '@storybook/react-vite';
import { BulkActionBar } from './BulkActionBar';
import { createDataGridBulkActionBarProps } from './BulkActionBar.adapters';

const meta: Meta<typeof BulkActionBar> = {
  title: 'Patterns/BulkActionBar',
  component: BulkActionBar,
};

export default meta;
type Story = StoryObj<typeof BulkActionBar>;

export const DataTableStyle: Story = {
  args: {
    selectedCount: 3,
    selectedRowsLabel: (count) => `${count} rows selected`,
    actions: [
      { key: 'approve', label: 'Approve', onSelect: () => undefined },
      { key: 'export', label: 'Export CSV', onSelect: () => undefined },
    ],
    onClearSelection: () => undefined,
  },
};

export const DataGridAdapter: Story = {
  render: () => {
    const props = createDataGridBulkActionBarProps({
      selectedItems: [
        { id: 'r1', member: 'Sato' },
        { id: 'r2', member: 'Tanaka' },
      ],
      actions: [
        {
          key: 'assign',
          label: 'Assign reviewer',
          onSelect: () => undefined,
        },
        {
          key: 'delete',
          label: 'Delete',
          tone: 'danger',
          onSelect: () => undefined,
        },
      ],
      selectedRowsLabel: (count) => `${count} selected`,
      clearSelectionLabel: 'Clear',
      onClearSelection: () => undefined,
    });

    return <BulkActionBar {...props} />;
  },
};
