import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { StatePreset } from './StatePreset';

const meta: Meta<typeof StatePreset> = {
  title: 'Patterns/StatePreset',
  component: StatePreset,
  parameters: {
    docs: {
      description: {
        component:
          '標準化された状態表示プリセット。errorでは `retry -> contact -> fallback` の順序で復帰導線を提供します。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof StatePreset>;

export const Loading: Story = {
  args: {
    mode: 'loading',
    loading: {
      label: 'Loading billing summary...',
    },
  },
};

export const Empty: Story = {
  args: {
    mode: 'empty',
    empty: {
      title: 'No billing records',
      description: 'Create a billing record to start this workflow.',
      primaryAction: {
        label: 'Create record',
        onClick: () => undefined,
      },
      ghostAction: {
        label: 'Open onboarding guide',
        onClick: () => undefined,
      },
    },
  },
};

export const ErrorWithRecoveryActions: Story = {
  args: {
    mode: 'error',
    error: {
      title: 'Failed to load approval chain',
      detail: 'API_TIMEOUT: request-id=ff31f2',
      retry: {
        label: 'Retry load',
        onClick: () => undefined,
      },
      contact: {
        label: 'Contact support',
        onClick: () => undefined,
      },
      fallback: {
        label: 'Back to dashboard',
        onClick: () => undefined,
      },
    },
  },
};

export const Success: Story = {
  args: {
    mode: 'success',
    success: {
      title: 'Workflow completed',
      description: 'The approval package has been submitted.',
      primaryAction: {
        label: 'View audit trail',
        onClick: () => undefined,
      },
      secondaryAction: {
        label: 'Return to list',
        onClick: () => undefined,
      },
    },
  },
};

export const ErrorActionOrder: Story = {
  args: {
    mode: 'error',
    error: {
      title: 'Failed to save',
      retry: { label: 'Retry', onClick: () => undefined },
      contact: { label: 'Contact support', onClick: () => undefined },
      fallback: { label: 'Back to list', onClick: () => undefined },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const buttons = canvas.getAllByRole('button');
    await expect(buttons[0]).toHaveTextContent('Retry');
    await expect(buttons[1]).toHaveTextContent('Contact support');
    await expect(buttons[2]).toHaveTextContent('Back to list');
    await userEvent.click(buttons[0]);
  },
};
