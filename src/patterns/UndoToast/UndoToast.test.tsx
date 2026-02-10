import { act, fireEvent, render, screen } from '@testing-library/react';
import { UndoToast } from './UndoToast';

describe('UndoToast', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders undo action with countdown by default', () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-02-10T00:00:00Z'));
    render(<UndoToast title="Row deleted" durationMs={5000} />);

    expect(screen.getByRole('button', { name: 'Undo within 5 seconds' })).toBeInTheDocument();
    expect(screen.getByText('(5s)')).toBeInTheDocument();
  });

  it('calls onUndo and prevents onCommit when undo is clicked', () => {
    jest.useFakeTimers();
    const onUndo = jest.fn();
    const onCommit = jest.fn();
    const onDismiss = jest.fn();
    render(
      <UndoToast
        title="Row deleted"
        durationMs={1000}
        onUndo={onUndo}
        onCommit={onCommit}
        onDismiss={onDismiss}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Undo within 1 second' }));
    act(() => {
      jest.advanceTimersByTime(1200);
    });

    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(onCommit).not.toHaveBeenCalled();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('calls onCommit and onDismiss when timer expires', () => {
    jest.useFakeTimers();
    const onCommit = jest.fn();
    const onDismiss = jest.fn();
    render(
      <UndoToast
        title="Row deleted"
        durationMs={1200}
        onCommit={onCommit}
        onDismiss={onDismiss}
      />
    );

    act(() => {
      jest.advanceTimersByTime(1200);
    });

    expect(onCommit).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('supports manual dismiss via close button', () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    const onCommit = jest.fn();
    render(<UndoToast title="Row deleted" onDismiss={onDismiss} onCommit={onCommit} durationMs={800} />);

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onCommit).not.toHaveBeenCalled();
  });

  it('does not reset timeout when callback identity changes across rerenders', () => {
    jest.useFakeTimers();
    const onCommitA = jest.fn();
    const onCommitB = jest.fn();
    const onDismiss = jest.fn();

    const { rerender } = render(
      <UndoToast title="Row deleted" durationMs={1000} onCommit={onCommitA} onDismiss={onDismiss} />
    );

    act(() => {
      jest.advanceTimersByTime(700);
    });

    rerender(
      <UndoToast
        title="Row deleted"
        durationMs={1000}
        onCommit={() => onCommitB()}
        onDismiss={onDismiss}
      />
    );

    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(onCommitB).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onCommitA).not.toHaveBeenCalled();
  });
});
