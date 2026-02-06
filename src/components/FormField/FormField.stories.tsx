import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import '../Input/Input.css';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  args: {
    label: 'Label',
    helpText: 'Helper text',
    required: false,
    size: 'medium',
    fullWidth: true,
    children: <input className="itdo-input itdo-input--medium" placeholder="Type here" />,
  },
};

export default meta;

type Story = StoryObj<typeof FormField>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Error: Story = {
  args: {
    error: 'Required field',
  },
};

export const Success: Story = {
  args: {
    success: 'Looks good',
  },
};
