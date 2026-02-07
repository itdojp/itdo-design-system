import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { userEvent, waitFor, within, expect } from 'storybook/test';
import { Button } from '../../components/Button';
import { SectionCard } from '../SectionCard';
import { AsyncStatePanel } from './AsyncStatePanel';

const meta: Meta<typeof AsyncStatePanel> = {
  title: 'Patterns/AsyncStatePanel',
  component: AsyncStatePanel,
  parameters: {
    docs: {
      description: {
        component:
          '状態契約: `loading -> ready|empty|error` を明示し、error では `retry/secondary/contact/back` action slot で復帰導線を提供します。',
      },
    },
  },
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
      primaryAction: {
        label: 'Create record',
        onClick: () => undefined,
      },
      ghostAction: {
        label: 'Contact support',
        onClick: () => undefined,
      },
    },
  },
};

export const Error: Story = {
  args: {
    state: 'error',
    error: {
      title: 'Failed to fetch records',
      detail: 'API_TIMEOUT: request-id=7cb2a9f2',
      retryAction: {
        label: 'Retry fetch',
        tone: 'primary',
        onClick: () => undefined,
      },
      secondaryAction: {
        label: 'Open filter settings',
        onClick: () => undefined,
      },
      contactAction: {
        label: 'Contact support',
        tone: 'ghost',
        onClick: () => undefined,
      },
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

export const TransitionScenario: Story = {
  render: () => {
    const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');

    return (
      <div style={{ display: 'grid', gap: 'var(--space-8)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Button size="small" variant="secondary" onClick={() => setState('loading')}>
            To loading
          </Button>
          <Button size="small" variant="secondary" onClick={() => setState('error')}>
            To error
          </Button>
          <Button size="small" variant="secondary" onClick={() => setState('ready')}>
            To ready
          </Button>
        </div>
        <AsyncStatePanel
          state={state}
          loadingText="Loading records..."
          error={{
            title: 'Failed to fetch records',
            detail: 'API_TIMEOUT: request-id=7cb2a9f2',
            retryAction: {
              label: 'Retry fetch',
              tone: 'primary',
              onClick: () => setState('ready'),
            },
            secondaryAction: {
              label: 'Open filter settings',
              onClick: () => undefined,
            },
            contactAction: {
              label: 'Contact support',
              tone: 'ghost',
              onClick: () => undefined,
            },
          }}
          children={
            <SectionCard title="Loaded data">
              <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                <div>Total records: 42</div>
                <div>Last synchronization: 2026-02-06 09:30 JST</div>
              </div>
            </SectionCard>
          }
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'To error' }));
    await waitFor(() => {
      expect(canvas.getByText('Failed to fetch records')).toBeInTheDocument();
    });

    await userEvent.click(canvas.getByRole('button', { name: 'Retry fetch' }));
    await waitFor(() => {
      expect(canvas.getByText('Total records: 42')).toBeInTheDocument();
    });
  },
};
