import type { Meta, StoryObj } from '@storybook/react-vite';
import { Erp4TimesheetForm } from './Erp4TimesheetForm';

const meta: Meta<typeof Erp4TimesheetForm> = {
  title: 'Patterns/Erp4TimesheetForm',
  component: Erp4TimesheetForm,
  parameters: {
    docs: {
      description: {
        component:
          'ERP4で再利用可能な入力フォーム実例。`validationState` 契約、非同期候補検索、文字数カウンタを統合した構成。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Erp4TimesheetForm>;

export const Default: Story = {};
