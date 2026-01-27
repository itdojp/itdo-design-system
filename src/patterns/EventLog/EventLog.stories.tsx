import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from '../../components/EmptyState';
import { EventLog } from './EventLog';
import type { EventLogItem } from './EventLog.types';

const meta: Meta<typeof EventLog> = {
  title: 'Patterns/EventLog',
  component: EventLog,
};

export default meta;

type Story = StoryObj<typeof EventLog>;

const items: EventLogItem[] = [
  {
    id: '1',
    title: 'Request submitted',
    description: 'User action recorded in the system.',
    timestamp: '2024-10-01 09:15',
    status: 'info',
    meta: 'Operator: Team A',
  },
  {
    id: '2',
    title: 'Validation completed',
    description: 'All required fields were validated successfully.',
    timestamp: '2024-10-01 09:16',
    status: 'success',
  },
  {
    id: '3',
    title: 'Retry required',
    description: 'Network timeout detected during processing.',
    timestamp: '2024-10-01 09:18',
    status: 'warning',
  },
  {
    id: '4',
    title: 'Manual override applied',
    description: 'Admin updated approval status.',
    timestamp: '2024-10-01 10:05',
    status: 'error',
    adminOverride: true,
    changes: [
      { field: 'status', before: 'Pending', after: 'Approved' },
      { field: 'approver', before: 'Auto', after: 'Admin' },
    ],
    meta: 'Operator: Admin user',
  },
];

export const Default: Story = {
  args: {
    items,
  },
};

export const Empty: Story = {
  args: {
    items: [],
    emptyState: (
      <EmptyState
        title="No activity"
        description="Activity will appear here once the process starts."
      />
    ),
  },
};
