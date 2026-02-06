import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/Button';
import { SectionCard } from '../SectionCard';
import { AsyncStatePanel } from './AsyncStatePanel';

const meta: Meta<typeof AsyncStatePanel> = {
  title: 'Patterns/AsyncStatePanel',
  component: AsyncStatePanel,
};

export default meta;

type Story = StoryObj<typeof AsyncStatePanel>;

export const Loading: Story = {
  args: {
    state: 'loading',
    loadingText: 'Loading records...',
  },
};

export const Empty: Story = {
  args: {
    state: 'empty',
    empty: {
      title: 'No records found',
      description: 'Adjust filters or create a new record.',
      action: <Button size="small">Create record</Button>,
    },
  },
};

export const Error: Story = {
  args: {
    state: 'error',
    error: {
      title: 'Failed to fetch records',
      detail: 'API_TIMEOUT: request-id=7cb2a9f2',
      onRetry: () => undefined,
      retryLabel: 'Retry fetch',
      expandableDetail: true,
    },
  },
};

export const Ready: Story = {
  args: {
    state: 'ready',
    children: (
      <SectionCard title="Loaded data">
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <div>Total records: 42</div>
          <div>Last synchronization: 2026-02-06 09:30 JST</div>
        </div>
      </SectionCard>
    ),
  },
};
