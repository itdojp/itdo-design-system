import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Popover } from './Popover';

describe('Popover', () => {
  const createAnchor = () => {
    const anchor = document.createElement('button');
    document.body.appendChild(anchor);
    return anchor;
  };

  const cleanupAnchor = (anchor: HTMLElement) => {
    if (anchor.parentElement) {
      anchor.parentElement.removeChild(anchor);
    }
  };

  it('renders content and auto focuses first focusable element', async () => {
    const anchor = createAnchor();
    const onClose = jest.fn();

    render(
      <Popover open onClose={onClose} anchorRef={{ current: anchor }}>
        <button type="button">Action</button>
      </Popover>
    );

    expect(screen.getByText('Action')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Action' })).toHaveFocus();
    });

    cleanupAnchor(anchor);
  });

  it('closes on Escape', () => {
    const anchor = createAnchor();
    const onClose = jest.fn();

    render(
      <Popover open onClose={onClose} anchorRef={{ current: anchor }}>
        <div>Content</div>
      </Popover>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);

    cleanupAnchor(anchor);
  });

  it('closes on outside click', () => {
    const anchor = createAnchor();
    const onClose = jest.fn();

    render(
      <Popover open onClose={onClose} anchorRef={{ current: anchor }}>
        <div>Content</div>
      </Popover>
    );

    fireEvent.mouseDown(document.body);
    expect(onClose).toHaveBeenCalledTimes(1);

    cleanupAnchor(anchor);
  });
});
