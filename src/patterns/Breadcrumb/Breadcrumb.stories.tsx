import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Patterns/Breadcrumb',
  component: Breadcrumb,
};

export default meta;

type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'master', label: 'Master data', href: '#' },
      { id: 'vendors', label: 'Vendors' },
    ],
  },
};

export const CustomSeparator: Story = {
  args: {
    separator: '>',
    items: [
      { id: 'home', label: 'Home', href: '#' },
      { id: 'sales', label: 'Sales', href: '#' },
      { id: 'orders', label: 'Orders' },
    ],
  },
};

export const Clickable: Story = {
  render: () => {
    const [message, setMessage] = useState('No action');

    return (
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <Breadcrumb
          items={[
            { id: 'home', label: 'Home', href: '#' },
            {
              id: 'projects',
              label: 'Projects',
              onClick: () => setMessage('Projects clicked'),
            },
            { id: 'detail', label: 'Project detail' },
          ]}
        />
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
          {message}
        </span>
      </div>
    );
  },
};
