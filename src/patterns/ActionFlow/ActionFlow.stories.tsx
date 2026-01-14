import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/Button';
import { ActionFlow } from './ActionFlow';

const meta: Meta<typeof ActionFlow> = {
  title: 'Patterns/ActionFlow',
  component: ActionFlow,
  args: {
    title: 'Submit request',
    description: 'Confirm details before executing the action.',
  },
};

export default meta;

type Story = StoryObj<typeof ActionFlow>;

export const Confirm: Story = {
  args: {
    state: 'confirm',
    cancelAction: <Button variant="secondary">Cancel</Button>,
    confirmAction: <Button>Confirm</Button>,
  },
};

export const Processing: Story = {
  args: {
    state: 'processing',
    processingMessage: 'Executing request...',
  },
};

export const Success: Story = {
  args: {
    state: 'success',
    resultTitle: 'Completed',
    resultMessage: 'The request has been processed successfully.',
    resultAction: <Button size="small">Close</Button>,
  },
};

export const Error: Story = {
  args: {
    state: 'error',
    resultTitle: 'Failed',
    resultMessage: 'Please review the details and retry.',
    retryAction: <Button size="small">Retry</Button>,
  },
};
