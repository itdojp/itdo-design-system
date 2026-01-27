import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Combobox } from './Combobox';
import { ComboboxItem } from './Combobox.types';

const meta: Meta<typeof Combobox> = {
  title: 'Components/Combobox',
  component: Combobox,
};

export default meta;

type Story = StoryObj<typeof Combobox>;

const baseItems: ComboboxItem[] = [
  {
    id: '1',
    label: 'ERP4 / Timesheet',
    description: 'Timesheet entry list',
    badge: 'Project',
  },
  {
    id: '2',
    label: 'ERP4 / Core',
    description: 'Core data module',
    badge: 'Team',
  },
  {
    id: '3',
    label: 'ITDO Portal',
    description: 'User-facing portal',
    badge: 'Service',
  },
];

export const AsyncSearch: Story = {
  render: () => {
    const [selected, setSelected] = useState('');
    const loadOptions = async (query: string) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (!query) return baseItems;
      return baseItems.filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));
    };

    return (
      <Combobox
        label="Reference"
        placeholder="Search"
        value={selected}
        onChange={setSelected}
        loadOptions={loadOptions}
        onSelect={(item) => setSelected(item.label)}
      />
    );
  },
};

export const ManyItems: Story = {
  render: () => {
    const items = Array.from({ length: 20 }).map((_, index) => ({
      id: `item-${index}`,
      label: `Candidate ${index + 1}`,
      description: 'Large dataset sample',
      badge: index % 2 === 0 ? 'Type A' : 'Type B',
    }));

    return <Combobox label="Candidates" placeholder="Search" items={items} />;
  },
};

export const TypeVariants: Story = {
  render: () => (
    <Combobox
      label="Search"
      placeholder="Search"
      items={baseItems}
      onSelect={(item) => console.log(item.id)}
    />
  ),
};
