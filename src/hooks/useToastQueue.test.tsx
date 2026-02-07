import { act, fireEvent, render, screen } from '@testing-library/react';
import { useToastQueue } from './useToastQueue';

const QueueHarness = () => {
  const { toasts, enqueue, dismiss, clear } = useToastQueue({ maxVisible: 3, dedupeWindowMs: 5000 });

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          enqueue({
            severity: 'info',
            title: 'Info',
            dedupeKey: 'same-info',
          })
        }
      >
        enqueue-info
      </button>
      <button
        type="button"
        onClick={() =>
          enqueue({
            severity: 'error',
            title: 'Error',
            dedupeKey: 'error-key',
          })
        }
      >
        enqueue-error
      </button>
      <button
        type="button"
        onClick={() =>
          enqueue({
            severity: 'success',
            title: 'Short ttl',
            dedupeKey: 'ttl-key',
            ttl: 100,
          })
        }
      >
        enqueue-short-ttl
      </button>
      <button type="button" onClick={() => clear()}>
        clear
      </button>
      <button
        type="button"
        onClick={() => {
          if (toasts[0]) {
            dismiss(toasts[0].id);
          }
        }}
      >
        dismiss-first
      </button>
      <ul>
        {toasts.map((toast) => (
          <li key={toast.id}>
            {toast.severity}:{toast.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('useToastQueue', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('deduplicates by dedupeKey in the dedupe window', () => {
    render(<QueueHarness />);

    fireEvent.click(screen.getByText('enqueue-info'));
    fireEvent.click(screen.getByText('enqueue-info'));

    expect(screen.getAllByText('info:Info')).toHaveLength(1);
  });

  it('orders toasts by severity priority', () => {
    render(<QueueHarness />);

    fireEvent.click(screen.getByText('enqueue-info'));
    fireEvent.click(screen.getByText('enqueue-error'));

    const rows = screen.getAllByRole('listitem');
    expect(rows[0]).toHaveTextContent('error:Error');
    expect(rows[1]).toHaveTextContent('info:Info');
  });

  it('auto dismisses toast by ttl', () => {
    jest.useFakeTimers();
    render(<QueueHarness />);

    fireEvent.click(screen.getByText('enqueue-short-ttl'));
    expect(screen.getByText('success:Short ttl')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.queryByText('success:Short ttl')).not.toBeInTheDocument();
  });
});
