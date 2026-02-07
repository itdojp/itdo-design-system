import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          '入力規約: `validationState`/`validationMessage` を第一優先で使い、`helpText` は入力ヒントに限定します。',
      },
    },
  },
  args: {
    label: 'Label',
    placeholder: 'Type here',
    helpText: 'Helper text',
    fullWidth: true,
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('textbox'));
  },
};

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('textbox'));
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Error: Story = {
  args: {
    error: 'Required field',
  },
};

export const Success: Story = {
  args: {
    validationState: 'success',
    validationMessage: 'Looks good',
  },
};

export const Warning: Story = {
  args: {
    validationState: 'warning',
    validationMessage: 'Check the format before submit',
  },
};

export const Validating: Story = {
  args: {
    validationState: 'validating',
    validationMessage: 'Validating...',
  },
};
