import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { UndoToast } from './UndoToast';

const meta: Meta<typeof UndoToast> = {
  title: 'Patterns/UndoToast',
  component: UndoToast,
  parameters: {
    docs: {
      description: {
        component:
          'Undo可能な通知。期限内は取り消し操作を提示し、期限到達時にコミットイベントを通知します。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof UndoToast>;

export const Default: Story = {
  args: {
    title: 'Timesheet row removed',
    description: 'The row will be permanently removed when the timer expires.',
    durationMs: 5000,
  },
};

export const InteractiveUndoFlow: Story = {
  render: () => {
    const [message, setMessage] = useState('pending');

    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '640px' }}>
        <UndoToast
          title="Timesheet row removed"
          description="Undo within the deadline to restore the row."
          durationMs={3000}
          onUndo={() => setMessage('undone')}
          onCommit={() => setMessage('committed')}
          autoDismissOnUndo={false}
          autoDismissOnCommit={false}
        />
        <p data-testid="undo-toast-message" style={{ margin: 0 }}>
          {message}
        </p>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Undo within 3 seconds' }));
    await expect(canvas.getByTestId('undo-toast-message')).toHaveTextContent('undone');
  },
};
