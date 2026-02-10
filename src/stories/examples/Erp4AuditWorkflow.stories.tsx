import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SectionCard } from '../../patterns/SectionCard';
import { PermissionGate } from '../../patterns/PermissionGate';
import { AuditTimeline } from '../../patterns/AuditTimeline';
import type { AuditTimelineEntry } from '../../patterns/AuditTimeline';

const meta: Meta = {
  title: 'Examples/ERP4 Audit Workflow',
};

export default meta;
type Story = StoryObj;

const timelineEntries: AuditTimelineEntry[] = [
  {
    id: 'wf-1',
    type: 'created',
    title: 'Timesheet submitted',
    actor: 'Requester',
    occurredAt: '2026-02-02 08:55',
    description: 'Monthly timesheet was submitted for approval.',
  },
  {
    id: 'wf-2',
    type: 'updated',
    title: 'Hours adjusted',
    actor: 'Team Lead',
    occurredAt: '2026-02-02 09:40',
    changes: [{ field: 'totalHours', before: '158', after: '160' }],
  },
  {
    id: 'wf-3',
    type: 'approved',
    title: 'Finance approval completed',
    actor: 'Finance Manager',
    occurredAt: '2026-02-02 10:10',
    description: 'Moved to payroll export queue.',
  },
];

export const Default: Story = {
  render: () => {
    const [lastEvent, setLastEvent] = useState('No telemetry event yet');

    return (
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: 'var(--space-12)',
          display: 'grid',
          gap: 'var(--space-8)',
        }}
      >
        <h2 style={{ margin: 0 }} data-testid="erp4-audit-title">
          ERP4 Approval Audit Flow
        </h2>

        <SectionCard
          title="Audit timeline"
          description="Permission-aware audit tracking sample for ERP4 approval workflows."
        >
          <PermissionGate
            allowed
            mode="disable"
            reason="Requires approval:audit:read permission."
          >
            <AuditTimeline
              entries={timelineEntries}
              telemetrySurface="erp4-approval-audit-flow"
              onTelemetry={(event) => setLastEvent(event.event)}
            />
          </PermissionGate>
        </SectionCard>

        <p data-testid="erp4-audit-last-event" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
          Last telemetry: {lastEvent}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('erp4-audit-title')).toBeInTheDocument();
    await expect(canvas.getByText('Timesheet submitted')).toBeInTheDocument();
    await userEvent.selectOptions(canvas.getByLabelText('Event type'), 'updated');
    await userEvent.click(canvas.getByRole('button', { name: 'Show diff' }));
    await expect(canvas.getByTestId('audit-diff-wf-2')).toBeInTheDocument();
    await expect(canvas.getByTestId('erp4-audit-last-event')).toHaveTextContent(
      'ds.audit_timeline.entry.expand'
    );
  },
};
