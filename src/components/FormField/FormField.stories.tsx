import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormField } from './FormField';
import '../Input/Input.css';

const meta: Meta<typeof FormField> = {
  title: 'Components/FormField',
  component: FormField,
  parameters: {
    docs: {
      description: {
        component:
          '実装規約: `validationState` と `validationMessage` を優先し、`helpText` は補助情報として併記します。Do: 入力理由を短文で提示。Do not: エラー文のみで解決手順を欠く。',
      },
    },
  },
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
    validationState: 'success',
    validationMessage: 'Looks good',
  },
};

export const Warning: Story = {
  args: {
    validationState: 'warning',
    validationMessage: 'Review this value before saving',
  },
};

export const Validating: Story = {
  args: {
    validationState: 'validating',
    validationMessage: 'Validating...',
  },
};
