import type { Meta, StoryObj } from '@storybook/react';
import { MarkdownRenderer } from './MarkdownRenderer';

const meta: Meta<typeof MarkdownRenderer> = {
  title: 'Components/MarkdownRenderer',
  component: MarkdownRenderer,
};

export default meta;

type Story = StoryObj<typeof MarkdownRenderer>;

const sample = `# Notes\n\nThis is a sample memo with **bold** text, a link, and inline code.\n\n- Item one\n- Item two\n\n| Field | Value |\n| --- | --- |\n| Status | Open |\n| Owner | Team A |\n\n\`\`\`ts\nconst message = 'hello';\nconsole.log(message);\n\`\`\`\n\n[ITDO Portal](https://example.com)\n`;

export const Default: Story = {
  render: () => <MarkdownRenderer content={sample} />,
};

export const CustomLink: Story = {
  render: () => (
    <MarkdownRenderer
      content={sample}
      linkComponent={(props) => (
        <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: '#c2410c' }} />
      )}
    />
  ),
};
