import { fireEvent, render, screen } from '@testing-library/react';
import { CopyButton } from './CopyButton';

const mockUseClipboard = jest.fn();

jest.mock('../../hooks', () => ({
  useClipboard: (timeoutMs: number) => mockUseClipboard(timeoutMs),
}));

describe('CopyButton', () => {
  beforeEach(() => {
    mockUseClipboard.mockReset();
  });

  it('shows success status text', () => {
    mockUseClipboard.mockReturnValue({
      status: 'success',
      copy: jest.fn(),
      isSupported: true,
    });

    render(<CopyButton text="hello" />);

    expect(screen.getByText('Copied')).toBeInTheDocument();
  });

  it('disables button when unsupported', () => {
    mockUseClipboard.mockReturnValue({
      status: 'idle',
      copy: jest.fn(),
      isSupported: false,
    });

    render(<CopyButton text="hello" />);

    expect(screen.getByRole('button', { name: 'Copy' })).toBeDisabled();
  });

  it('invokes copy when supported', () => {
    const copy = jest.fn();
    mockUseClipboard.mockReturnValue({
      status: 'idle',
      copy,
      isSupported: true,
    });

    render(<CopyButton text="hello" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(copy).toHaveBeenCalledWith('hello');
  });
});
