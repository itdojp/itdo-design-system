import { useId } from 'react';
import clsx from 'clsx';
import type {
  BaseRangePickerProps,
  DateRangePickerProps,
  DateRangePresetContext,
  DateRangeValue,
  DateTimeRangePickerProps,
} from './DateRangePicker.types';
import { DEFAULT_DATE_RANGE_PRESETS, DEFAULT_DATE_TIME_RANGE_PRESETS } from './DateRangePicker.presets';
import './DateRangePicker.css';

type PickerMode = 'date' | 'datetime-local';

const normalizeRangeValue = (value: DateRangeValue): DateRangeValue => {
  const next: DateRangeValue = {};

  if (value.from) {
    next.from = value.from;
  }
  if (value.to) {
    next.to = value.to;
  }

  return next;
};

const pickEarlier = (left?: string, right?: string) => {
  if (!left) return right;
  if (!right) return left;
  return left <= right ? left : right;
};

const pickLater = (left?: string, right?: string) => {
  if (!left) return right;
  if (!right) return left;
  return left >= right ? left : right;
};

const resolveInternalError = (
  value: DateRangeValue,
  allowEmptyFrom: boolean,
  allowEmptyTo: boolean
) => {
  if (!allowEmptyFrom && !value.from) {
    return 'From is required.';
  }
  if (!allowEmptyTo && !value.to) {
    return 'To is required.';
  }
  if (value.from && value.to && value.from > value.to) {
    return 'From must be earlier than or equal to To.';
  }
  return undefined;
};

const applyPresetValue = (onChange: (next: DateRangeValue) => void, next: DateRangeValue) => {
  onChange(normalizeRangeValue(next));
};

const createPresetContext = (mode: PickerMode): DateRangePresetContext => ({
  now: new Date(),
  mode: mode === 'date' ? 'date' : 'datetime',
});

interface InternalRangePickerProps extends BaseRangePickerProps {
  mode: PickerMode;
  timezoneLabel?: string;
}

const InternalRangePicker = ({
  id,
  className,
  label,
  fromLabel = 'From',
  toLabel = 'To',
  clearLabel = 'Clear',
  value,
  onChange,
  min,
  max,
  allowEmptyFrom = true,
  allowEmptyTo = true,
  presets,
  error,
  warning,
  hint,
  disabled = false,
  readOnly = false,
  required = false,
  mode,
  timezoneLabel,
}: InternalRangePickerProps) => {
  const generatedId = useId();
  const baseId = id ?? `itdo-date-range-${generatedId}`;
  const fromId = `${baseId}-from`;
  const toId = `${baseId}-to`;
  const timezoneId = timezoneLabel ? `${baseId}-timezone` : undefined;
  const messageId = `${baseId}-message`;

  const internalError = resolveInternalError(value, allowEmptyFrom, allowEmptyTo);
  const resolvedError = internalError ?? error;
  const resolvedMessage = resolvedError ?? warning ?? hint;
  const messageTone = resolvedError ? 'error' : warning ? 'warning' : hint ? 'hint' : 'none';

  const describedBy = [timezoneId, resolvedMessage ? messageId : undefined].filter(Boolean).join(' ');
  const isError = Boolean(resolvedError);
  const isInteractionLocked = disabled || readOnly;

  const onInputChange = (field: keyof DateRangeValue, nextValue: string) => {
    const next: DateRangeValue = {
      ...value,
      [field]: nextValue || undefined,
    };
    onChange(normalizeRangeValue(next));
  };

  const resolvedPresets =
    presets ??
    (mode === 'date' ? DEFAULT_DATE_RANGE_PRESETS : DEFAULT_DATE_TIME_RANGE_PRESETS);

  const fromMax = pickEarlier(max, value.to);
  const toMin = pickLater(min, value.from);
  const resolvedLabel = label ?? (mode === 'date' ? 'Date range' : 'Date and time range');

  return (
    <section
      className={clsx(
        'itdo-date-range-picker',
        `itdo-date-range-picker--${mode}`,
        {
          'itdo-date-range-picker--error': isError,
          'itdo-date-range-picker--warning': !isError && Boolean(warning),
          'itdo-date-range-picker--disabled': disabled,
          'itdo-date-range-picker--readonly': !disabled && readOnly,
        },
        className
      )}
    >
      <fieldset
        className="itdo-date-range-picker__fieldset"
        disabled={disabled}
        aria-describedby={describedBy || undefined}
      >
        <legend className="itdo-date-range-picker__legend">
          {resolvedLabel}
          {required && <span aria-hidden="true"> *</span>}
        </legend>

        <div className="itdo-date-range-picker__inputs">
          <div className="itdo-date-range-picker__field">
            <label className="itdo-date-range-picker__label" htmlFor={fromId}>
              {fromLabel}
            </label>
            <input
              id={fromId}
              className="itdo-date-range-picker__input"
              type={mode}
              value={value.from ?? ''}
              min={min}
              max={fromMax}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={isError || undefined}
              required={required && !allowEmptyFrom}
              onChange={(event) => onInputChange('from', event.currentTarget.value)}
            />
          </div>
          <div className="itdo-date-range-picker__field">
            <label className="itdo-date-range-picker__label" htmlFor={toId}>
              {toLabel}
            </label>
            <input
              id={toId}
              className="itdo-date-range-picker__input"
              type={mode}
              value={value.to ?? ''}
              min={toMin}
              max={max}
              disabled={disabled}
              readOnly={readOnly}
              aria-invalid={isError || undefined}
              required={required && !allowEmptyTo}
              onChange={(event) => onInputChange('to', event.currentTarget.value)}
            />
          </div>
        </div>

        {timezoneLabel && (
          <p className="itdo-date-range-picker__timezone" id={timezoneId}>
            {timezoneLabel}
          </p>
        )}

        {resolvedPresets.length > 0 && (
          <div className="itdo-date-range-picker__presets" role="group" aria-label="Preset ranges">
            {resolvedPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="itdo-date-range-picker__preset"
                disabled={isInteractionLocked}
                onClick={() =>
                  applyPresetValue(onChange, preset.resolveValue(createPresetContext(mode)))
                }
              >
                {preset.label}
              </button>
            ))}
          </div>
        )}

        <div className="itdo-date-range-picker__actions">
          <button
            type="button"
            className="itdo-date-range-picker__clear"
            disabled={isInteractionLocked}
            onClick={() => applyPresetValue(onChange, {})}
          >
            {clearLabel}
          </button>
        </div>
      </fieldset>

      {resolvedMessage && (
        <p
          id={messageId}
          className={clsx(
            'itdo-date-range-picker__message',
            messageTone !== 'none' && `itdo-date-range-picker__message--${messageTone}`
          )}
          role={messageTone === 'error' ? 'alert' : undefined}
        >
          {resolvedMessage}
        </p>
      )}
    </section>
  );
};

export const DateRangePicker = (props: DateRangePickerProps) => (
  <InternalRangePicker {...props} mode="date" />
);

export const DateTimeRangePicker = (props: DateTimeRangePickerProps) => (
  <InternalRangePicker {...props} mode="datetime-local" />
);
