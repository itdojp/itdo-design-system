import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  args: {
    width: '100%',
  },
};

export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: {
    variant: 'text',
  },
};

export const Rectangle: Story = {
  args: {
    variant: 'rect',
    height: '3rem',
  },
};

export const Circle: Story = {
  args: {
    variant: 'circle',
    width: '3rem',
    height: '3rem',
  },
};
