import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/Button';
import { PageHeader } from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Patterns/PageHeader',
  component: PageHeader,
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

const StatusPill = () => (
  <span
    style={{
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      background: 'var(--color-success-50)',
      color: 'var(--color-status-success-text)',
      fontSize: 'var(--font-size-xs)',
    }}
  >
    Active
  </span>
);

export const Default: Story = {
  args: {
    title: 'Project overview',
    description: 'Monitor progress, status, and recent activity.',
    breadcrumbs: [
      { label: 'Home', href: '#' },
      { label: 'Projects', href: '#' },
      { label: 'Project overview' },
    ],
    status: <StatusPill />,
    actions: (
      <>
        <Button variant="secondary">Export</Button>
        <Button>New entry</Button>
      </>
    ),
    meta: (
      <>
        <div>Updated: 2024-10-01</div>
        <div>Owner: Team A</div>
      </>
    ),
  },
};
