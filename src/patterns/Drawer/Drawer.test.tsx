import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { Drawer } from './Drawer';

const DrawerHarness = () => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open drawer
      </button>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Drawer title"
        description="Drawer description"
        portal={false}
      >
        <button type="button">Primary action</button>
        <button type="button">Secondary action</button>
      </Drawer>
    </div>
  );
};

describe('Drawer', () => {
  it('returns focus to trigger after close', () => {
    render(<DrawerHarness />);

    const openButton = screen.getByRole('button', { name: 'Open drawer' });
    openButton.focus();
    fireEvent.click(openButton);

    const closeButton = screen.getByRole('button', { name: 'Close drawer' });
    expect(closeButton).toHaveFocus();

    fireEvent.click(closeButton);
    expect(openButton).toHaveFocus();
  });

  it('closes on overlay click and Escape key', () => {
    const onClose = jest.fn();
    const { container } = render(
      <Drawer open onClose={onClose} title="Drawer title" portal={false}>
        Body
      </Drawer>
    );

    fireEvent.click(container.querySelector('.itdo-drawer-overlay') as HTMLElement);
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('applies size and placement class and provides dialog semantics', () => {
    const { container } = render(
      <Drawer
        open
        onClose={jest.fn()}
        title="Drawer title"
        size="lg"
        placement="left"
        portal={false}
      >
        Content
      </Drawer>
    );

    const dialog = screen.getByRole('dialog', { name: 'Drawer title' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(container.querySelector('.itdo-drawer')).toHaveClass('itdo-drawer--lg');
    expect(container.querySelector('.itdo-drawer')).toHaveClass('itdo-drawer--left');
  });

  it('traps focus with Tab navigation inside drawer', () => {
    render(
      <Drawer open onClose={jest.fn()} title="Focus trap" portal={false}>
        <button type="button">First</button>
        <button type="button">Last</button>
      </Drawer>
    );

    const close = screen.getByRole('button', { name: 'Close drawer' });
    const last = screen.getByRole('button', { name: 'Last' });
    close.focus();

    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();

    fireEvent.keyDown(document, { key: 'Tab' });
    expect(close).toHaveFocus();
  });
});
