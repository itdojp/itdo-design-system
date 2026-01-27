import type { Meta, StoryObj } from '@storybook/react';
import { Link } from './Link';

const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
};

export default meta;

type Story = StoryObj<typeof Link>;

export const External: Story = {
  render: () => (
    <Link href="https://example.com" external>
      External link
    </Link>
  ),
};

export const Internal: Story = {
  render: () => (
    <Link href="/app/projects" onClick={(event) => event.preventDefault()}>
      Internal link
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
