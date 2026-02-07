import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Dialog } from './Dialog';

const DialogHarness = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Dialog title"
        description="Dialog description"
        portal={false}
        confirmAction={<Button>Confirm</Button>}
        cancelAction={
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        }
      >
        Body
      </Dialog>
    </div>
  );
};

describe('Dialog', () => {
  it('returns focus to trigger after close', () => {
    render(<DialogHarness />);

    const openButton = screen.getByRole('button', { name: 'Open' });
    openButton.focus();
    fireEvent.click(openButton);

    const closeButton = screen.getByRole('button', { name: 'Close dialog' });
    expect(closeButton).toHaveFocus();

    fireEvent.click(closeButton);
    expect(openButton).toHaveFocus();
  });

  it('closes on Escape when enabled', () => {
    const onClose = jest.fn();
    render(
      <Dialog open onClose={onClose} title="Close check" portal={false}>
        Body
      </Dialog>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
