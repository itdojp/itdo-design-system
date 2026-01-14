import { forwardRef } from 'react';
import clsx from 'clsx';
import { SelectProps } from './Select.types';
import { FormField } from '../FormField';
import './Select.css';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helpText,
      error,
      success,
      size = 'medium',
      fullWidth = false,
      disabled = false,
      required = false,
      placeholder,
      className,
      containerClassName,
      children,
      ...props
    },
    ref
  ) => {
    const selectClasses = clsx(
      'itdo-select',
      `itdo-select--${size}`,
      {
        'itdo-select--error': error,
        'itdo-select--disabled': disabled,
        'itdo-select--full-width': fullWidth,
      },
      className
    );

    return (
      <FormField
        label={label}
        helpText={helpText}
        error={error}
        success={success}
        required={required}
        size={size}
        fullWidth={fullWidth}
        className={containerClassName}
      >
        <select ref={ref} className={selectClasses} disabled={disabled} {...props}>
          {placeholder && (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          )}
          {children}
        </select>
      </FormField>
    );
  }
);

Select.displayName = 'Select';
