import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { EmptyState } from '../../components/EmptyState';
import { AuditTimeline } from './AuditTimeline';
import type { AuditTimelineEntry } from './AuditTimeline.types';

const entries: AuditTimelineEntry[] = [
  {
    id: 'ap-1001',
    type: 'created',
    title: 'Created by requester',
    actor: 'Requester',
    occurredAt: '2026-02-01 09:10',
    description: 'Approval package submitted.',
    metadata: 'Ticket: AP-1001',
  },
  {
    id: 'ap-1002',
    type: 'updated',
    title: 'Updated budget amount',
    actor: 'Finance Clerk',
    occurredAt: '2026-02-01 09:45',
    changes: [{ field: 'amount', before: '100,000', after: '120,000' }],
    metadata: 'Reason: exchange-rate correction',
  },
  {
    id: 'ap-1003',
    type: 'approved',
    title: 'Approved by finance manager',
    actor: 'Finance Manager',
    occurredAt: '2026-02-01 10:20',
    description: 'Approval moved to payment queue.',
    metadata: 'Approver: user-finance-manager',
  },
  {
    id: 'ap-1004',
    type: 'returned',
    title: 'Returned for revision',
    actor: 'Controller',
    occurredAt: '2026-02-01 10:32',
    description: 'Missing supporting invoice attachment.',
    changes: [{ field: 'status', before: 'Approved', after: 'Returned' }],
    metadata: 'Comment: attach source invoice PDF',
  },
];

const meta: Meta<typeof AuditTimeline> = {
  title: 'Patterns/AuditTimeline',
  component: AuditTimeline,
  parameters: {
    docs: {
      description: {
        component:
          '監査履歴を時系列表示し、event type/actor/query フィルタと before/after 差分表示を提供します。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuditTimeline>;

export const Default: Story = {
  args: {
    entries,
    telemetrySurface: 'storybook-audit-timeline',
  },
};

export const FilterAndDiff: Story = {
  args: {
    entries,
    telemetrySurface: 'storybook-audit-timeline',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.selectOptions(canvas.getByLabelText('Event type'), 'updated');
    await expect(canvas.getByText('Updated budget amount')).toBeInTheDocument();
    await expect(canvas.queryByText('Approved by finance manager')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Show diff' }));
    await expect(canvas.getByTestId('audit-diff-ap-1002')).toBeInTheDocument();
  },
};

export const Empty: Story = {
  args: {
    entries: [],
    emptyState: (
      <EmptyState
        title="No audit activity"
        description="Events will appear when approval workflow starts."
      />
    ),
  },
};
