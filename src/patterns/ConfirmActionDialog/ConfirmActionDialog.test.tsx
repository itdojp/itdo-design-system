import { fireEvent, render, screen } from '@testing-library/react';
import { ConfirmActionDialog } from './ConfirmActionDialog';

describe('ConfirmActionDialog', () => {
  it('disables confirm when reason is required and empty', () => {
    render(
      <ConfirmActionDialog
        open
        title="Reject record?"
        requireReason
        onCancel={() => undefined}
        onConfirm={() => undefined}
      />
    );

    expect(screen.getByRole('button', { name: 'Confirm' })).toBeDisabled();
  });

  it('passes reason payload on confirm', () => {
    const onConfirm = jest.fn();

    render(
      <ConfirmActionDialog
        open
        title="Reject record?"
        requireReason
        confirmLabel="Reject"
        onCancel={() => undefined}
        onConfirm={onConfirm}
      />
    );

    fireEvent.change(screen.getByLabelText(/Reason/i), {
      target: { value: 'Missing attachment' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Reject' }));

    expect(onConfirm).toHaveBeenCalledWith({ reason: 'Missing attachment' });
  });

  it('calls onCancel when Escape is pressed', () => {
    const onCancel = jest.fn();

    render(
      <ConfirmActionDialog
        open
        title="Close?"
        onCancel={onCancel}
        onConfirm={() => undefined}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
