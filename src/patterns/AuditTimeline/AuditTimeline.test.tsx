import { fireEvent, render, screen } from '@testing-library/react';
import { AuditTimeline } from './AuditTimeline';
import { DiffViewer } from './DiffViewer';
import type { AuditEvent } from './AuditTimeline.types';

const events: AuditEvent[] = [
  {
    id: 'e-1',
    time: '2026-02-11T08:15:00Z',
    actor: 'system',
    action: 'Policy updated',
    target: 'approval',
    summary: 'Threshold changed.',
    tone: 'warning',
  },
  {
    id: 'e-2',
    time: '2026-02-11T09:00:00Z',
    actor: 'admin',
    action: 'Manual override',
    target: 'invoice',
    tone: 'critical',
  },
  {
    id: 'e-3',
    time: '2026-02-10T11:00:00Z',
    actor: 'system',
    action: 'Sync complete',
    tone: 'success',
  },
];

describe('AuditTimeline', () => {
  it('groups events by date and emits selected event', () => {
    const onSelectEvent = jest.fn();

    render(<AuditTimeline events={events} onSelectEvent={onSelectEvent} groupByDate />);

    expect(screen.getByRole('heading', { name: '2026-02-11' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '2026-02-10' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Manual override/i }));
    expect(onSelectEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'e-2',
      })
    );
  });

  it('renders empty state fallback', () => {
    render(<AuditTimeline events={[]} />);
    expect(screen.getByText('No audit events.')).toBeInTheDocument();
  });
});

describe('DiffViewer', () => {
  it('highlights add/remove lines for text diff', () => {
    render(
      <DiffViewer before={'status=pending\nroute=manager'} after={'status=approved\nroute=manager'} />
    );

    expect(screen.getByText('status=pending')).toBeInTheDocument();
    expect(screen.getByText('status=approved')).toBeInTheDocument();

    const removedLine = screen.getByText('status=pending').closest('.itdo-diff-viewer__line');
    const addedLine = screen.getByText('status=approved').closest('.itdo-diff-viewer__line');
    expect(removedLine).toHaveClass('itdo-diff-viewer__line--remove');
    expect(addedLine).toHaveClass('itdo-diff-viewer__line--add');
  });

  it('collapses long output and can expand', () => {
    const before = Array.from({ length: 30 }, (_, index) => `before-${index}`).join('\n');
    const after = Array.from({ length: 30 }, (_, index) => `after-${index}`).join('\n');

    render(<DiffViewer before={before} after={after} maxVisibleLines={10} />);

    expect(screen.getByRole('button', { name: /Show .* more lines/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Show .* more lines/i }));
    expect(screen.getByRole('button', { name: 'Show less' })).toBeInTheDocument();
  });

  it('supports json mode formatting', () => {
    render(
      <DiffViewer
        format="json"
        before={{ threshold: 10, enabled: false }}
        after={{ threshold: 20, enabled: true }}
      />
    );

    expect(screen.getByText('"threshold": 10,')).toBeInTheDocument();
    expect(screen.getByText('"threshold": 20,')).toBeInTheDocument();
  });
});
