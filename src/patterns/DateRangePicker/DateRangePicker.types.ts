export interface DateRangeValue {
  from?: string;
  to?: string;
}

export interface DateRangePresetContext {
  now: Date;
  mode: 'date' | 'datetime';
}

export interface DateRangePreset {
  id: string;
  label: string;
  resolveValue: (context: DateRangePresetContext) => DateRangeValue;
}

export interface BaseRangePickerProps {
  id?: string;
  className?: string;
  label?: string;
  fromLabel?: string;
  toLabel?: string;
  clearLabel?: string;
  value: DateRangeValue;
  onChange: (next: DateRangeValue) => void;
  min?: string;
  max?: string;
  allowEmptyFrom?: boolean;
  allowEmptyTo?: boolean;
  presets?: DateRangePreset[];
  error?: string;
  warning?: string;
  hint?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
}

export interface DateRangePickerProps extends BaseRangePickerProps {}

export interface DateTimeRangePickerProps extends BaseRangePickerProps {
  timezoneLabel?: string;
}
