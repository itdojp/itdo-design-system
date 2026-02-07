import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    docs: {
      description: {
        component:
          '長文入力規約: `maxLength` を指定した場合は文字数カウンタを表示し、超過前に利用者へ残数を提示します。',
      },
    },
  },
  args: {
    label: 'Label',
    helpText: 'Helper text',
    placeholder: 'Type here',
    fullWidth: true,
  },
};

export default meta;

type Story = StoryObj<typeof Textarea>;

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

export const Warning: Story = {
  args: {
    validationState: 'warning',
    validationMessage: 'Keep the response concise for approval workflow',
  },
};

export const Success: Story = {
  args: {
    validationState: 'success',
    validationMessage: 'Draft is ready',
  },
};

export const Validating: Story = {
  args: {
    validationState: 'validating',
    validationMessage: 'Running policy check...',
  },
};

export const WithCharacterCount: Story = {
  args: {
    maxLength: 120,
    defaultValue: 'Initial value for ERP4 note.',
  },
};
