import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fireEvent, within } from 'storybook/test';
import { DateRangePicker, DateTimeRangePicker } from './DateRangePicker';
import { DEFAULT_DATE_RANGE_PRESETS, DEFAULT_DATE_TIME_RANGE_PRESETS } from './DateRangePicker.presets';
import type { DateRangeValue } from './DateRangePicker.types';

const meta: Meta<typeof DateRangePicker> = {
  title: 'Patterns/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    docs: {
      description: {
        component:
          '期間入力を標準化する `DateRangePicker` / `DateTimeRangePicker`。preset、即時検証、readOnly/disabled 差分を提供します。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof DateRangePicker>;

export const DateRangeDefault: Story = {
  render: () => {
    const [value, setValue] = useState<DateRangeValue>({});
    return (
      <DateRangePicker
        label="Audit period"
        value={value}
        onChange={setValue}
        presets={DEFAULT_DATE_RANGE_PRESETS}
        hint="Use presets for recurring operations."
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    fireEvent.click(canvas.getByRole('button', { name: 'Today' }));
    await expect((canvas.getAllByDisplayValue(/\d{4}-\d{2}-\d{2}/)[0] as HTMLInputElement).value).toMatch(
      /\d{4}-\d{2}-\d{2}/
    );
  },
};

export const DateTimeRangeWithTimezone: Story = {
  render: () => {
    const [value, setValue] = useState<DateRangeValue>({
      from: '2026-02-10T09:00',
      to: '2026-02-10T18:00',
    });
    return (
      <DateTimeRangePicker
        label="Window"
        value={value}
        onChange={setValue}
        timezoneLabel="Timezone: UTC+09:00 (Asia/Tokyo)"
        presets={DEFAULT_DATE_TIME_RANGE_PRESETS}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Timezone: UTC+09:00 (Asia/Tokyo)')).toBeInTheDocument();
  },
};

export const ValidationAndStateDiff: Story = {
  render: () => {
    const [editableValue, setEditableValue] = useState<DateRangeValue>({
      from: '2026-02-15',
      to: '2026-02-01',
    });

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <DateRangePicker
          label="Validation (from > to)"
          value={editableValue}
          onChange={setEditableValue}
          allowEmptyFrom={false}
          allowEmptyTo={false}
        />
        <DateRangePicker
          label="Disabled"
          value={{ from: '2026-02-01', to: '2026-02-10' }}
          onChange={() => undefined}
          disabled
        />
        <DateRangePicker
          label="Read only"
          value={{ from: '2026-02-01', to: '2026-02-10' }}
          onChange={() => undefined}
          readOnly
        />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('From must be earlier than or equal to To.')).toBeInTheDocument();
    await expect(canvas.getAllByRole('group', { name: 'Preset ranges' }).length).toBeGreaterThan(0);
  },
};
