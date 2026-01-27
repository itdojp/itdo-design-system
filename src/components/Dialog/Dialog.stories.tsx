import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Textarea } from '../Textarea';
import { Dialog } from './Dialog';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
};

export default meta;

type Story = StoryObj<typeof Dialog>;

export const ConfirmDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button size="small" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Delete item"
          description="This action cannot be undone."
          size="small"
          confirmAction={<Button onClick={() => setOpen(false)}>Delete</Button>}
          cancelAction={
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          }
        >
          Are you sure you want to delete this item?
        </Dialog>
      </>
    );
  },
};

export const FormDialog: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <>
        <Button size="small" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Update record"
          description="Review details before saving."
          confirmAction={<Button onClick={() => setOpen(false)}>Save</Button>}
          cancelAction={
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          }
        >
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <Input label="Title" placeholder="Title" />
            <Textarea label="Notes" placeholder="Details" rows={4} />
          </div>
        </Dialog>
      </>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const paragraphs = Array.from({ length: 10 }).map((_, index) => (
      <p key={index}>
        Long content sample {index + 1}. This dialog uses internal scrolling to keep the header
        and footer visible.
      </p>
    ));

    return (
      <>
        <Button size="small" onClick={() => setOpen(true)}>
          Open dialog
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Terms"
          description="Review the content before continuing."
          size="large"
          scrollBehavior="dialog"
          confirmAction={<Button onClick={() => setOpen(false)}>Accept</Button>}
          cancelAction={
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          }
        >
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>{paragraphs}</div>
        </Dialog>
      </>
    );
  },
};
