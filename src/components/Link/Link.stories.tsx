import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  args: {
    children: 'Link',
    href: 'https://example.com',
    variant: 'primary',
    size: 'medium',
  },
};

export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('link'));
  },
};

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    canvas.getByRole('link').focus();
  },
};

export const External: Story = {
  args: {
    children: 'External link',
    external: true,
  },
};

export const Internal: Story = {
  args: {
    children: 'Internal link',
    href: '/app/projects',
  },
  render: (args) => (
    <Link {...args} onClick={(event) => event.preventDefault()}>
      {args.children}
    </Link>
  ),
};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-6)', alignItems: 'center' }}>
      <Link href="https://example.com" variant="primary">Primary</Link>
      <Link href="https://example.com" variant="secondary">Secondary</Link>
      <Link href="https://example.com" variant="muted">Muted</Link>
    </div>
  ),
};
