import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../components/Button';
import { Drawer, DrawerFooter, DrawerHeader } from './Drawer';

const meta: Meta<typeof Drawer> = {
  title: 'Patterns/Drawer',
  component: Drawer,
  args: {
    onClose: () => undefined,
  },
  parameters: {
    docs: {
      description: {
        component:
          '一覧コンテキストを保持したまま詳細編集を行う側面パネル。desktopはside panel、mobileはfull-screenにフォールバックします。',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const DesktopRight: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ padding: 16 }}>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Invoice detail"
          description="Edit and review metadata without leaving the list."
          size="md"
          placement="right"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Save</Button>
            </>
          }
        >
          <p>Invoice ID: INV-2026-0012</p>
          <p>Status: Pending approval</p>
          <p>Owner: Finance Team</p>
        </Drawer>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Open drawer' }));
    await expect(within(document.body).getByRole('dialog', { name: 'Invoice detail' })).toBeInTheDocument();
  },
};

export const LeftWithCustomSections: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="left"
        size="lg"
        closeOnOverlay={false}
        showCloseButton={false}
      >
        <DrawerHeader
          title="Customer profile"
          description="Cross-check profile and contract links."
          actions={<Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>}
        />
        <p>Customer: Aozora Foods</p>
        <p>Tier: Enterprise</p>
        <DrawerFooter align="between">
          <span>Last synced: 2026-02-11 09:20</span>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </DrawerFooter>
      </Drawer>
    );
  },
};

export const MobileFallback: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Mobile review"
        description="Drawer should occupy the full viewport on mobile."
        size="sm"
      >
        <p>Tap outside or use the close button.</p>
      </Drawer>
    );
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
