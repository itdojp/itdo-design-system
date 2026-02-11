import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, within } from 'storybook/test';
import { AuditTimeline } from './AuditTimeline';
import { DiffViewer } from './DiffViewer';
import type { AuditEvent } from './AuditTimeline.types';

const events: AuditEvent[] = [
  {
    id: 'evt-1',
    time: '2026-02-11T08:15:00Z',
    actor: 'system.bot',
    action: 'Policy updated',
    target: 'approval-template',
    summary: 'Condition threshold changed from 50k to 100k.',
    tone: 'warning',
  },
  {
    id: 'evt-2',
    time: '2026-02-11T09:20:00Z',
    actor: 'k.ota',
    action: 'Manual override',
    target: 'invoice INV-2026-0012',
    summary: 'Escalated to director route.',
    tone: 'critical',
  },
  {
    id: 'evt-3',
    time: '2026-02-10T14:05:00Z',
    actor: 'workflow.engine',
    action: 'Sync completed',
    target: 'vendor policy cache',
    summary: 'No conflict detected.',
    tone: 'success',
  },
];

const diffMap: Record<string, { before: unknown; after: unknown }> = {
  'evt-1': {
    before: { minAmount: 50000, approverRole: 'manager', requireAck: false },
    after: { minAmount: 100000, approverRole: 'director', requireAck: true },
  },
  'evt-2': {
    before: 'status=pending\nroute=manager\nnote=none',
    after: 'status=overridden\nroute=director\nnote=manual escalation',
  },
  'evt-3': {
    before: { cacheVersion: 7, staleKeys: ['VN-42'] },
    after: { cacheVersion: 8, staleKeys: [] },
  },
};

const meta: Meta<typeof AuditTimeline> = {
  title: 'Patterns/AuditTimeline',
  component: AuditTimeline,
};

export default meta;
type Story = StoryObj<typeof AuditTimeline>;

export const TimelineWithLinkedDiff: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState(events[0].id);
    const selectedDiff = useMemo(() => diffMap[selectedId], [selectedId]);

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <AuditTimeline
          events={events}
          selectedEventId={selectedId}
          onSelectEvent={(event) => setSelectedId(event.id)}
          groupByDate
        />
        <DiffViewer
          format={selectedId === 'evt-2' ? 'text' : 'json'}
          before={selectedDiff.before}
          after={selectedDiff.after}
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getByRole('button', { name: /Manual override/i }));
    await expect(canvas.getByText(/route=director/i)).toBeInTheDocument();
  },
};

export const CompactMode: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <AuditTimeline events={events} compact selectedEventId="evt-1" groupByDate={false} />
      <DiffViewer
        compact
        format="text"
        before={'line1\nline2\nline3\nline4\nline5'}
        after={'line1\nline2-updated\nline3\nline4\nline5\nline6'}
      />
    </div>
  ),
};
