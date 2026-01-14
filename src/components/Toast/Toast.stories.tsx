import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { Toast } from './Toast';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  args: {
    title: 'Notification',
    description: 'This is a toast message.',
  },
};

export default meta;

type Story = StoryObj<typeof Toast>;

export const Info: Story = {
  args: {
    variant: 'info',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
  },
};

export const WithAction: Story = {
  args: {
    action: <Button size="small">Undo</Button>,
  },
};
