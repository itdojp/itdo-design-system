import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { CopyButton } from './CopyButton';
import { Textarea } from '../Textarea';

const meta: Meta<typeof CopyButton> = {
  title: 'Components/CopyButton',
  component: CopyButton,
};

export default meta;

type Story = StoryObj<typeof CopyButton>;

export const Basic: Story = {
  render: () => (
    <CopyButton text="https://example.com/timesheet/123" label="Copy URL" />
  ),
};

export const MarkdownLink: Story = {
  render: () => {
    const [text, setText] = useState('[Timesheet](https://example.com/timesheet/123)');
    return (
      <div style={{ display: 'grid', gap: 'var(--space-6)', maxWidth: 420 }}>
        <Textarea
          label="Markdown"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
        />
        <CopyButton text={text} label="Copy Markdown" />
      </div>
    );
  },
};
