import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Patterns/Tabs',
  component: Tabs,
};

export default meta;

type Story = StoryObj<typeof Tabs>;

const baseItems = [
  { id: 'summary', label: 'Summary', panel: 'Summary content' },
  { id: 'activity', label: 'Activity', panel: 'Activity timeline' },
  { id: 'settings', label: 'Settings', panel: 'Configuration panel' },
];

export const Default: Story = {
  args: {
    items: baseItems,
  },
};

export const PillVariant: Story = {
  args: {
    items: baseItems,
    variant: 'pill',
  },
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('activity');

    return (
      <Tabs
        value={value}
        onValueChange={setValue}
        items={[
          { id: 'summary', label: 'Summary', panel: `Current value: ${value}` },
          { id: 'activity', label: 'Activity', panel: `Current value: ${value}` },
          { id: 'settings', label: 'Settings', panel: `Current value: ${value}` },
        ]}
      />
    );
  },
};

export const WithDisabledTab: Story = {
  args: {
    items: [
      { id: 'overview', label: 'Overview', panel: 'Overview panel' },
      { id: 'cost', label: 'Cost', panel: 'Cost panel', disabled: true },
      { id: 'security', label: 'Security', panel: 'Security panel' },
    ],
    fullWidth: true,
  },
};
