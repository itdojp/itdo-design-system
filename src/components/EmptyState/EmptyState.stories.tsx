import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Components/EmptyState',
  component: EmptyState,
  parameters: {
    docs: {
      description: {
        component:
          'CTA規約: primary は主導線、secondary は代替導線、ghost は補助導線（問い合わせ等）に限定します。',
      },
    },
  },
  args: {
    title: 'No results',
    description: 'Try adjusting your filters or creating a new item.',
    action: <Button size="small">Create item</Button>,
  },
};

export default meta;

type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const StructuredActions: Story = {
  args: {
    title: 'No records found',
    description: 'Update filter settings or contact support.',
    action: undefined,
    primaryAction: {
      label: 'Retry',
      onClick: () => undefined,
    },
    secondaryAction: {
      label: 'Adjust filters',
      onClick: () => undefined,
    },
    ghostAction: {
      label: 'Contact support',
      onClick: () => undefined,
    },
  },
};
