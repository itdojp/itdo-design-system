import { fireEvent, render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders legacy action node', () => {
    render(
      <EmptyState
        title="No data"
        description="Try a different query"
        action={<button type="button">Create</button>}
      />
    );

    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('renders structured actions and triggers callbacks', () => {
    const onPrimary = jest.fn();
    const onSecondary = jest.fn();
    const onGhost = jest.fn();

    render(
      <EmptyState
        title="No data"
        primaryAction={{ label: 'Retry', onClick: onPrimary }}
        secondaryAction={{ label: 'Adjust filters', onClick: onSecondary }}
        ghostAction={{ label: 'Contact support', onClick: onGhost }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    fireEvent.click(screen.getByRole('button', { name: 'Adjust filters' }));
    fireEvent.click(screen.getByRole('button', { name: 'Contact support' }));

    expect(onPrimary).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
    expect(onGhost).toHaveBeenCalledTimes(1);
  });
});
