import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useClipboard } from './useClipboard';

const TestComponent = ({ text, timeoutMs }: { text: string; timeoutMs: number }) => {
  const { status, copy, reset, isSupported } = useClipboard(timeoutMs);
  return (
    <div>
      <button type="button" onClick={() => copy(text)}>copy</button>
      <button type="button" onClick={() => reset()}>reset</button>
      <span data-testid="status">{status}</span>
      <span data-testid="supported">{String(isSupported)}</span>
    </div>
  );
};

describe('useClipboard', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'isSecureContext', {
      value: true,
      configurable: true,
    });
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: jest.fn() },
      configurable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('sets success and then timeout', async () => {
    jest.useFakeTimers();
    const clipboard = navigator.clipboard as unknown as { writeText: jest.Mock };
    clipboard.writeText.mockResolvedValueOnce(undefined);

    render(<TestComponent text="hello" timeoutMs={100} />);
    fireEvent.click(screen.getByText('copy'));

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('success');
    });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('status')).toHaveTextContent('timeout');
  });

  it('sets error on failure', async () => {
    const clipboard = navigator.clipboard as unknown as { writeText: jest.Mock };
    clipboard.writeText.mockRejectedValueOnce(new Error('fail'));

    render(<TestComponent text="hello" timeoutMs={100} />);
    fireEvent.click(screen.getByText('copy'));

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('error');
    });
  });

  it('reset clears pending timeout', async () => {
    jest.useFakeTimers();
    const clipboard = navigator.clipboard as unknown as { writeText: jest.Mock };
    clipboard.writeText.mockResolvedValueOnce(undefined);

    render(<TestComponent text="hello" timeoutMs={100} />);
    fireEvent.click(screen.getByText('copy'));

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('success');
    });

    fireEvent.click(screen.getByText('reset'));
    expect(screen.getByTestId('status')).toHaveTextContent('idle');

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(screen.getByTestId('status')).toHaveTextContent('idle');
  });
});
