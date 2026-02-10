import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../components/Button';
import { PermissionGate } from './PermissionGate';

const meta: Meta<typeof PermissionGate> = {
  title: 'Patterns/PermissionGate',
  component: PermissionGate,
  parameters: {
    docs: {
      description: {
        component:
          '権限制約時のUI挙動を標準化します。`hide` では非表示、`disable` では操作不可 + 理由表示を提供します。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof PermissionGate>;

export const Allowed: Story = {
  args: {
    allowed: true,
    children: <Button type="button">Approve payment</Button>,
  },
};

export const Hidden: Story = {
  args: {
    allowed: false,
    mode: 'hide',
    fallback: <p>You do not have permission to approve this payment.</p>,
    children: <Button type="button">Approve payment</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button', { name: 'Approve payment' })).not.toBeInTheDocument();
  },
};

export const DisabledWithReason: Story = {
  args: {
    allowed: false,
    mode: 'disable',
    reason: 'Requires finance:approve permission.',
    children: <Button type="button">Approve payment</Button>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button', { name: 'Approve payment' });
    await expect(button).toBeDisabled();
    await expect(canvas.getByRole('note')).toHaveTextContent('Requires finance:approve permission.');
  },
};

export const PermissionSwitch: Story = {
  render: () => {
    const [allowed, setAllowed] = useState(false);

    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '420px' }}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setAllowed((previous) => !previous)}
        >
          {allowed ? 'Revoke permission' : 'Grant permission'}
        </Button>

        <PermissionGate
          allowed={allowed}
          mode="disable"
          reason="Requires finance:approve permission."
        >
          <Button type="button">Approve payment</Button>
        </PermissionGate>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Approve payment' })).toBeDisabled();
    await userEvent.click(canvas.getByRole('button', { name: 'Grant permission' }));
    await expect(canvas.getByRole('button', { name: 'Approve payment' })).not.toBeDisabled();
  },
};
