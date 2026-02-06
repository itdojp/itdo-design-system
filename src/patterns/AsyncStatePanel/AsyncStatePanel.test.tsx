import { fireEvent, render, screen } from '@testing-library/react';
import { AsyncStatePanel } from './AsyncStatePanel';

describe('AsyncStatePanel', () => {
  it('renders loading state', () => {
    render(<AsyncStatePanel state="loading" loadingText="Loading list..." />);
    expect(screen.getByText('Loading list...')).toBeInTheDocument();
  });

  it('renders empty state', () => {
    render(
      <AsyncStatePanel
        state="empty"
        empty={{
          title: 'No entries',
          description: 'Try another filter',
        }}
      />
    );
    expect(screen.getByText('No entries')).toBeInTheDocument();
    expect(screen.getByText('Try another filter')).toBeInTheDocument();
  });

  it('renders error state and executes retry callback', () => {
    const onRetry = jest.fn();
    render(
      <AsyncStatePanel
        state="error"
        error={{
          title: 'Load failed',
          detail: 'Request timeout',
          onRetry,
          retryLabel: 'Retry now',
        }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry now' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders children in ready state', () => {
    render(
      <AsyncStatePanel state="ready">
        <div>Loaded content</div>
      </AsyncStatePanel>
    );
    expect(screen.getByText('Loaded content')).toBeInTheDocument();
  });
});
