import { fireEvent, render, screen } from '@testing-library/react';
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
  },
  {
    id: 'ap-1002',
    type: 'updated',
    title: 'Updated budget amount',
    actor: 'Finance Clerk',
    occurredAt: '2026-02-01 09:45',
    changes: [{ field: 'amount', before: '100,000', after: '120,000' }],
  },
  {
    id: 'ap-1003',
    type: 'approved',
    title: 'Approved by finance manager',
    actor: 'Finance Manager',
    occurredAt: '2026-02-01 10:20',
    description: 'Approval moved to payment queue.',
  },
];

describe('AuditTimeline', () => {
  it('renders entries and filters by event type', () => {
    render(<AuditTimeline entries={entries} />);

    expect(screen.getByText('Created by requester')).toBeInTheDocument();
    expect(screen.getByText('Approved by finance manager')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Event type'), { target: { value: 'approved' } });

    expect(screen.getByText('Approved by finance manager')).toBeInTheDocument();
    expect(screen.queryByText('Created by requester')).not.toBeInTheDocument();
    expect(screen.queryByText('Updated budget amount')).not.toBeInTheDocument();
  });

  it('filters by actor and search query', () => {
    render(<AuditTimeline entries={entries} />);

    fireEvent.change(screen.getByLabelText('Actor'), { target: { value: 'Finance Clerk' } });
    expect(screen.getByText('Updated budget amount')).toBeInTheDocument();
    expect(screen.queryByText('Approved by finance manager')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'amount' } });
    expect(screen.getByText('Updated budget amount')).toBeInTheDocument();
  });

  it('toggles diff and emits telemetry payloads', () => {
    const onTelemetry = jest.fn();
    render(
      <AuditTimeline
        entries={entries}
        telemetrySurface="unit-test"
        onTelemetry={onTelemetry}
      />
    );

    fireEvent.change(screen.getByLabelText('Event type'), { target: { value: 'updated' } });
    expect(onTelemetry).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'ds.audit_timeline.filter.change',
        action: 'filter_change',
        context: expect.objectContaining({
          surface: 'unit-test',
          typeFilter: 'updated',
          actorFilterState: 'all',
          hasQuery: false,
          queryLength: 0,
          visibleCount: 1,
        }),
      })
    );

    const piiLikeQuery = 'john.doe@example.com';
    fireEvent.change(screen.getByLabelText('Search'), { target: { value: piiLikeQuery } });
    const latestFilterEvent = onTelemetry.mock.calls.at(-1)?.[0];
    expect(latestFilterEvent.context).toMatchObject({
      actorFilterState: 'all',
      hasQuery: true,
      queryLength: piiLikeQuery.length,
    });
    expect(latestFilterEvent.context).not.toHaveProperty('query');
    expect(latestFilterEvent.context).not.toHaveProperty('actorFilter');

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: 'Show diff' }));
    expect(screen.getByTestId('audit-diff-ap-1002')).toBeInTheDocument();
    expect(onTelemetry).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'ds.audit_timeline.entry.expand',
        action: 'entry_expand',
        context: expect.objectContaining({
          entryId: 'ap-1002',
        }),
      })
    );

    fireEvent.click(screen.getByRole('button', { name: 'Hide diff' }));
    expect(onTelemetry).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'ds.audit_timeline.entry.collapse',
        action: 'entry_collapse',
        context: expect.objectContaining({
          entryId: 'ap-1002',
        }),
      })
    );
  });

  it('renders custom empty state when entries are empty', () => {
    render(<AuditTimeline entries={[]} emptyState={<p>No activity yet.</p>} />);

    expect(screen.getByText('No activity yet.')).toBeInTheDocument();
  });
});
