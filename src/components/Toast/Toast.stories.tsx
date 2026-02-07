import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo } from 'react';
import { Button } from '../Button';
import { useToastQueue } from '../../hooks/useToastQueue';
import { Toast } from './Toast';
import { ToastViewport } from './ToastViewport';

const meta: Meta<typeof Toast> = {
  title: 'Components/Toast',
  component: Toast,
  parameters: {
    docs: {
      description: {
        component:
          '通知規約: severity 優先度は `error > warning > success > info`。デフォルトTTLは `error=stay, warning=7000ms, info=5000ms, success=4000ms`。重複抑止は `dedupeKey` で制御します。',
      },
    },
  },
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

export const QueuePolicy: Story = {
  render: () => {
    const { toasts, enqueue, dismiss, clear } = useToastQueue({ maxVisible: 4 });
    const commands = useMemo(
      () => [
        {
          key: 'info',
          label: 'Push info',
          run: () =>
            enqueue({
              severity: 'info',
              title: 'Info',
              description: 'Background sync completed.',
              dedupeKey: 'sync-info',
            }),
        },
        {
          key: 'success',
          label: 'Push success',
          run: () =>
            enqueue({
              severity: 'success',
              title: 'Saved',
              description: 'Record was saved successfully.',
            }),
        },
        {
          key: 'warning',
          label: 'Push warning',
          run: () =>
            enqueue({
              severity: 'warning',
              title: 'Validation warning',
              description: 'Some fields need review.',
              dedupeKey: 'validation-warning',
            }),
        },
        {
          key: 'error',
          label: 'Push error',
          run: () =>
            enqueue({
              severity: 'error',
              title: 'Request failed',
              description: 'Please retry or contact support.',
              dedupeKey: 'request-error',
            }),
        },
      ],
      [enqueue]
    );

    return (
      <div style={{ minHeight: '260px', display: 'grid', gap: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          {commands.map((command) => (
            <Button key={command.key} size="small" variant="secondary" onClick={command.run}>
              {command.label}
            </Button>
          ))}
          <Button size="small" variant="ghost" onClick={clear}>
            Clear all
          </Button>
        </div>
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Duplicate events with the same dedupe key are merged in queue.
        </div>
        <ToastViewport toasts={toasts} onDismiss={dismiss} />
      </div>
    );
  },
};
