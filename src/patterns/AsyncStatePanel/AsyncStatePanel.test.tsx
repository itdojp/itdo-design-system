import { fireEvent, render, screen } from '@testing-library/react';
import { AsyncStatePanel } from './AsyncStatePanel';

describe('AsyncStatePanel', () => {
  it('renders loading state', () => {
    render(<AsyncStatePanel state="loading" loadingText="Loading list..." />);
    expect(screen.getByText('Loading list...')).toBeInTheDocument();
    const panel = document.querySelector('.itdo-async-state-panel--loading');
    expect(panel).toHaveAttribute('aria-live', 'polite');
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

  it('renders error state and executes recovery callbacks', () => {
    const onRetry = jest.fn();
    const onSecondary = jest.fn();
    const onContact = jest.fn();
    render(
      <AsyncStatePanel
        state="error"
        error={{
          title: 'Load failed',
          detail: 'Request timeout',
          retryAction: {
            label: 'Retry now',
            tone: 'primary',
            onClick: onRetry,
          },
          secondaryAction: {
            label: 'Adjust filter',
            onClick: onSecondary,
          },
          contactAction: {
            label: 'Contact support',
            tone: 'ghost',
            onClick: onContact,
          },
        }}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry now' }));
    fireEvent.click(screen.getByRole('button', { name: 'Adjust filter' }));
    fireEvent.click(screen.getByRole('button', { name: 'Contact support' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
    expect(onContact).toHaveBeenCalledTimes(1);
    const panel = document.querySelector('.itdo-async-state-panel--error');
    expect(panel).toHaveAttribute('aria-live', 'assertive');
  });

  it('renders children in ready state', () => {
    render(
      <AsyncStatePanel state="ready">
        <div>Loaded content</div>
      </AsyncStatePanel>
    );
    expect(screen.getByText('Loaded content')).toBeInTheDocument();
  });

  it('keeps backward compatibility with onRetry/retryLabel', () => {
    const onRetry = jest.fn();
    render(
      <AsyncStatePanel
        state="error"
        error={{
          onRetry,
          retryLabel: 'Retry legacy',
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Retry legacy' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
