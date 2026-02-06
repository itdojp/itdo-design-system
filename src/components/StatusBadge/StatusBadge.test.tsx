import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';
import { StatusDot } from './StatusDot';

describe('StatusBadge', () => {
  it('renders label from default dictionary', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Status: Approved' })).toBeInTheDocument();
  });

  it('renders fallback label for undefined status', () => {
    render(<StatusBadge status="pending_review" />);
    expect(screen.getByText('Pending Review')).toBeInTheDocument();
  });

  it('uses custom dictionary entry when provided', () => {
    render(
      <StatusBadge
        status="hold"
        dictionary={{
          hold: { label: 'On Hold', tone: 'warning', icon: 'H' },
        }}
      />
    );

    expect(screen.getByText('On Hold')).toBeInTheDocument();
  });
});

describe('StatusDot', () => {
  it('provides an accessible label even when text is hidden', () => {
    render(<StatusDot status="rejected" />);
    expect(screen.getByRole('status', { name: 'Status: Rejected' })).toBeInTheDocument();
  });

  it('can display visible label', () => {
    render(<StatusDot status="paid" showLabel />);
    expect(screen.getByText('Paid')).toBeInTheDocument();
  });
});
