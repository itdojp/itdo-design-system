import { fireEvent, render, screen } from '@testing-library/react';
import { BulkActionBar } from './BulkActionBar';

describe('BulkActionBar', () => {
  it('renders selected row count and actions', () => {
    render(
      <BulkActionBar
        selectedCount={3}
        actions={[
          {
            key: 'approve',
            label: 'Approve',
            onSelect: () => undefined,
          },
        ]}
      />
    );

    expect(screen.getByText('3 rows selected')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Approve' })).toBeInTheDocument();
  });

  it('fires action and clear callbacks', () => {
    const onApprove = jest.fn();
    const onClearSelection = jest.fn();

    render(
      <BulkActionBar
        selectedCount={2}
        actions={[
          {
            key: 'approve',
            label: 'Approve',
            onSelect: onApprove,
          },
        ]}
        onClearSelection={onClearSelection}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Approve' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onApprove).toHaveBeenCalledTimes(1);
    expect(onClearSelection).toHaveBeenCalledTimes(1);
  });

  it('does not render when selected count is zero', () => {
    const { container } = render(
      <BulkActionBar
        selectedCount={0}
        actions={[
          {
            key: 'approve',
            label: 'Approve',
            onSelect: () => undefined,
          },
        ]}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });
});
