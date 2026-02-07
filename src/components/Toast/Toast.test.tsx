import { fireEvent, render, screen } from '@testing-library/react';
import { Toast } from './Toast';

describe('Toast', () => {
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

  it('does not auto close by itself even when ttl is provided', () => {
    const onClose = jest.fn();

    render(<Toast severity="info" title="Processing" ttl={100} onClose={onClose} />);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose from dismiss button', () => {
    const onClose = jest.fn();
    render(<Toast severity="warning" title="Warning" dismissible onClose={onClose} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
