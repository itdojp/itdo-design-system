import type { DateRangePreset } from './DateRangePicker.types';

const formatDate = (value: Date) =>
  `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(
    value.getDate()
  ).padStart(2, '0')}`;

const formatDateTime = (value: Date) =>
  `${formatDate(value)}T${String(value.getHours()).padStart(2, '0')}:${String(
    value.getMinutes()
  ).padStart(2, '0')}`;

const toStartOfDay = (value: Date) =>
  new Date(value.getFullYear(), value.getMonth(), value.getDate(), 0, 0, 0, 0);

const addDays = (value: Date, amount: number) => {
  const next = new Date(value.getTime());
  next.setDate(next.getDate() + amount);
  return next;
};

export const DEFAULT_DATE_RANGE_PRESETS: DateRangePreset[] = [
  {
    id: 'today',
    label: 'Today',
    resolveValue: ({ now }) => {
      const current = formatDate(now);
      return { from: current, to: current };
    },
  },
  {
    id: 'last-7-days',
    label: 'Last 7 days',
    resolveValue: ({ now }) => ({
      from: formatDate(addDays(now, -6)),
      to: formatDate(now),
    }),
  },
  {
    id: 'last-30-days',
    label: 'Last 30 days',
    resolveValue: ({ now }) => ({
      from: formatDate(addDays(now, -29)),
      to: formatDate(now),
    }),
  },
  {
    id: 'this-month',
    label: 'This month',
    resolveValue: ({ now }) => ({
      from: formatDate(new Date(now.getFullYear(), now.getMonth(), 1)),
      to: formatDate(now),
    }),
  },
];

export const DEFAULT_DATE_TIME_RANGE_PRESETS: DateRangePreset[] = [
  {
    id: 'today',
    label: 'Today',
    resolveValue: ({ now }) => ({
      from: formatDateTime(toStartOfDay(now)),
      to: formatDateTime(now),
    }),
  },
  {
    id: 'last-7-days',
    label: 'Last 7 days',
    resolveValue: ({ now }) => ({
      from: formatDateTime(toStartOfDay(addDays(now, -6))),
      to: formatDateTime(now),
    }),
  },
  {
    id: 'last-30-days',
    label: 'Last 30 days',
    resolveValue: ({ now }) => ({
      from: formatDateTime(toStartOfDay(addDays(now, -29))),
      to: formatDateTime(now),
    }),
  },
  {
    id: 'this-month',
    label: 'This month',
    resolveValue: ({ now }) => ({
      from: formatDateTime(new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)),
      to: formatDateTime(now),
    }),
  },
];
