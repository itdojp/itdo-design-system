import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          '選択入力規約: 選択必須項目は `required` を付与し、検証結果は `validationState` で表現します。',
      },
    },
  },
  args: {
    label: 'Label',
    helpText: 'Helper text',
    fullWidth: true,
    placeholder: 'Select an option',
    children: [
      <option key="1" value="one">
        Option one
      </option>,
      <option key="2" value="two">
        Option two
      </option>,
      <option key="3" value="three">
        Option three
      </option>,
    ],
  },
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {};

export const Hover: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('combobox'));
  },
};

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('combobox'));
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
    validationMessage: 'Review selected role before apply',
  },
};

export const Success: Story = {
  args: {
    validationState: 'success',
    validationMessage: 'Selection is valid',
  },
};

export const Validating: Story = {
  args: {
    validationState: 'validating',
    validationMessage: 'Checking dependency...',
  },
};
