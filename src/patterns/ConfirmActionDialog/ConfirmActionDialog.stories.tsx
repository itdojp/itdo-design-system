import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { ConfirmActionDialog } from './ConfirmActionDialog';

const meta: Meta<typeof ConfirmActionDialog> = {
  title: 'Patterns/ConfirmActionDialog',
  component: ConfirmActionDialog,
};

export default meta;

type Story = StoryObj<typeof ConfirmActionDialog>;

const ControlledDialog = (args: React.ComponentProps<typeof ConfirmActionDialog>) => {
  const [open, setOpen] = useState(true);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <ConfirmActionDialog
        {...args}
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <ControlledDialog {...args} />,
  args: {
    open: true,
    title: 'Approve selected records?',
    description: 'Approved records cannot be reverted from this screen.',
    confirmLabel: 'Approve',
    cancelLabel: 'Cancel',
  },
};

export const Danger: Story = {
  render: (args) => <ControlledDialog {...args} />,
  args: {
    open: true,
    tone: 'danger',
    title: 'Delete vendor account?',
    description: 'This operation removes all pending requests for the vendor.',
    confirmLabel: 'Delete',
    cancelLabel: 'Keep',
  },
};

export const RequireReason: Story = {
  render: (args) => <ControlledDialog {...args} />,
  args: {
    open: true,
    tone: 'danger',
    title: 'Reject this invoice?',
    description: 'A reason is required for audit records.',
    requireReason: true,
    reasonLabel: 'Rejection reason',
    reasonPlaceholder: 'Enter a reason for rejection',
    confirmLabel: 'Reject',
  },
};
