import { act, fireEvent, render, screen } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('uses assertive live region for error severity', () => {
    render(<Toast severity="error" title="Failed to save" />);

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });

  it('uses polite live region for success severity', () => {
    render(<Toast severity="success" title="Saved" />);

    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  it('auto closes based on ttl', () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    render(<Toast severity="info" title="Processing" ttl={100} onClose={onClose} />);

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose from dismiss button', () => {
    const onClose = jest.fn();
    render(<Toast severity="warning" title="Warning" dismissible onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
