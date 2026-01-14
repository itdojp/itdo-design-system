import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  args: {
    title: 'No results',
    description: 'Try adjusting your filters or creating a new item.',
    action: <Button size="small">Create item</Button>,
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};
