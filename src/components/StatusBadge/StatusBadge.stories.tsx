import type { Meta, StoryObj } from '@storybook/react';
import { StatusBadge } from './StatusBadge';
import { StatusDot } from './StatusDot';

const meta: Meta<typeof StatusBadge> = {
  title: 'Components/StatusBadge',
  component: StatusBadge,
};

export default meta;

type Story = StoryObj<typeof StatusBadge>;

export const Default: Story = {
  args: {
    status: 'approved',
    variant: 'soft',
  },
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-6)' }}>
      <StatusBadge status="draft" variant="soft" />
      <StatusBadge status="pending" variant="outline" />
      <StatusBadge status="approved" variant="solid" />
      <StatusBadge status="rejected" variant="soft" />
      <StatusBadge status="canceled" variant="outline" />
    </div>
  ),
};

export const DictionaryOverride: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
      <StatusBadge
        status="on_hold"
        dictionary={{
          on_hold: {
            label: 'On Hold',
            tone: 'warning',
            icon: 'H',
          },
        }}
      />
      <StatusDot
        status="escalated"
        showLabel
        dictionary={{
          escalated: {
            label: 'Escalated',
            tone: 'danger',
            icon: 'E',
          },
        }}
      />
    </div>
  ),
};
