import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['elevated', 'outlined', 'filled'],
    },
    padding: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Elevated: Story = {
  args: {
    variant: 'elevated',
    children: (
      <div>
        <h3 style={{ marginTop: 0 }}>Elevated Card</h3>
        <p>This is an elevated card with a subtle shadow effect.</p>
      </div>
    ),
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    children: (
      <div>
        <h3 style={{ marginTop: 0 }}>Outlined Card</h3>
        <p>This is an outlined card with a border.</p>
      </div>
    ),
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    children: (
      <div>
        <h3 style={{ marginTop: 0 }}>Filled Card</h3>
        <p>This is a filled card with a background color.</p>
      </div>
    ),
  },
};

export const Clickable: Story = {
  args: {
    variant: 'elevated',
    onClick: () => alert('Card clicked!'),
    children: (
      <div>
        <h3 style={{ marginTop: 0 }}>Clickable Card</h3>
        <p>Click this card to trigger an action.</p>
      </div>
    ),
  },
};

export const NoPadding: Story = {
  args: {
    variant: 'outlined',
    padding: 'none',
    children: (
      <div>
        <div style={{ padding: '1rem', backgroundColor: '#f97316', color: 'white' }}>
          <h3 style={{ margin: 0 }}>Card Header</h3>
        </div>
        <div style={{ padding: '1rem' }}>
          <p>Card with no internal padding, custom content structure.</p>
        </div>
      </div>
    ),
  },
};

export const LargePadding: Story = {
  args: {
    variant: 'elevated',
    padding: 'large',
    children: (
      <div>
        <h3 style={{ marginTop: 0 }}>Large Padding Card</h3>
        <p>This card has large internal padding for spacious content.</p>
      </div>
    ),
  },
};