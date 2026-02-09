import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from '../../components/Button';
import { CommandPalette } from './CommandPalette';
import type { CommandPaletteAction } from './CommandPalette.types';

const actions: CommandPaletteAction[] = [
  {
    id: 'create-invoice',
    label: 'Create invoice',
    group: 'Finance',
    description: 'Open the invoice creation workflow.',
    shortcut: 'G I',
    keywords: ['invoice', 'create', 'finance'],
  },
  {
    id: 'open-timesheet',
    label: 'Open timesheet',
    group: 'Projects',
    description: 'Navigate to weekly timesheet entry.',
    shortcut: 'G T',
    keywords: ['timesheet', 'hours', 'project'],
  },
  {
    id: 'pending-approvals',
    label: 'Pending approvals',
    group: 'Approvals',
    description: 'Review records waiting for approval.',
    shortcut: 'G A',
    keywords: ['approval', 'queue', 'review'],
  },
  {
    id: 'security-audit',
    label: 'Security audit log',
    group: 'Admin',
    description: 'Inspect security events and changes.',
    shortcut: 'G S',
    keywords: ['audit', 'security', 'events'],
  },
];

const meta: Meta<typeof CommandPalette> = {
  title: 'Patterns/CommandPalette',
  component: CommandPalette,
  args: {
    onActionRun: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof CommandPalette>;

export const OpenState: Story = {
  render: (args) => {
    const [open, setOpen] = useState(true);
    return <CommandPalette {...args} open={open} onOpenChange={setOpen} actions={actions} />;
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement.ownerDocument.body);
    const input = canvas.getByRole('combobox');
    await userEvent.clear(input);
    await userEvent.type(input, 'invoice');

    const createInvoice = canvas.getByRole('option', { name: /Create invoice/i });
    await expect(createInvoice).toBeInTheDocument();
    await userEvent.click(createInvoice);
    await expect(args.onActionRun).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'create-invoice',
      }),
      expect.objectContaining({
        actionId: 'create-invoice',
      })
    );
  },
};

export const TriggerButton: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 'var(--space-16)' }}>
        <Button onClick={() => setOpen(true)}>Open Command Palette</Button>
        <CommandPalette {...args} open={open} onOpenChange={setOpen} actions={actions} />
      </div>
    );
  },
};
