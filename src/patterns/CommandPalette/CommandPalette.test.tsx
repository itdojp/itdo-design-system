import { fireEvent, render, screen } from '@testing-library/react';
import { CommandPalette } from './CommandPalette';
import type { CommandPaletteAction } from './CommandPalette.types';

const actions: CommandPaletteAction[] = [
  {
    id: 'create',
    label: 'Create invoice',
    group: 'Finance',
    description: 'Create a new invoice.',
    shortcut: 'G I',
  },
  {
    id: 'approvals',
    label: 'Pending approvals',
    group: 'Approvals',
    description: 'Open approval queue.',
    shortcut: 'G A',
  },
  {
    id: 'timesheet',
    label: 'Open timesheet',
    group: 'Projects',
    description: 'Navigate to timesheet page.',
    shortcut: 'G T',
  },
];

describe('CommandPalette', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('opens from Ctrl+K and calls action callback on Enter', () => {
    const onOpenChange = jest.fn();
    const onActionRun = jest.fn();

    render(
      <CommandPalette
        open
        onOpenChange={onOpenChange}
        onActionRun={onActionRun}
        actions={actions}
      />
    );

    fireEvent.keyDown(document, {
      key: 'k',
      ctrlKey: true,
    });
    expect(onOpenChange).toHaveBeenCalledWith(true);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'invoice' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onActionRun).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'create',
      }),
      expect.objectContaining({
        actionId: 'create',
        query: 'invoice',
      })
    );
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('supports arrow navigation and updates aria-activedescendant', () => {
    render(<CommandPalette open onOpenChange={jest.fn()} actions={actions} />);

    const input = screen.getByRole('combobox');
    const firstOption = screen.getByRole('option', { name: /Create invoice/i });
    expect(input).toHaveAttribute('aria-activedescendant', firstOption.getAttribute('id'));

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    const secondOption = screen.getByRole('option', { name: /Pending approvals/i });
    expect(input).toHaveAttribute('aria-activedescendant', secondOption.getAttribute('id'));
  });

  it('shows grouped sections and recent group after selecting an action', () => {
    const { rerender } = render(<CommandPalette open onOpenChange={jest.fn()} actions={actions} />);

    expect(screen.getByRole('heading', { name: 'Finance' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Approvals' })).toBeInTheDocument();

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'invoice' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    rerender(<CommandPalette open onOpenChange={jest.fn()} actions={actions} />);
    expect(screen.getByRole('heading', { name: 'Recent' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Create invoice/i })).toBeInTheDocument();
  });
});
