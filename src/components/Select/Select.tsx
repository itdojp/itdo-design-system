import { forwardRef } from 'react';
import clsx from 'clsx';
import { SelectProps } from './Select.types';
import { FormField } from '../FormField';
import { resolveValidationMessage, resolveValidationState } from '../FormField/validation';
import './Select.css';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helpText,
      hint,
      description,
      error,
      warning,
      success,
      validationState,
      validationMessage,
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
    const resolvedValidationState = resolveValidationState({
      validationState,
      error,
      warning,
      success,
    });
    const resolvedValidationMessage = resolveValidationMessage(resolvedValidationState, {
      validationMessage,
      error,
      warning,
      success,
    });
    const resolvedHelpText = hint ?? description ?? helpText;

    const selectClasses = clsx(
      'itdo-select',
      `itdo-select--${size}`,
      {
        'itdo-select--error': resolvedValidationState === 'error',
        'itdo-select--warning': resolvedValidationState === 'warning',
        'itdo-select--success': resolvedValidationState === 'success',
        'itdo-select--validating': resolvedValidationState === 'validating',
        'itdo-select--disabled': disabled,
        'itdo-select--full-width': fullWidth,
      },
      className
    );

    return (
      <FormField
        label={label}
        helpText={resolvedHelpText}
        validationState={resolvedValidationState}
        validationMessage={resolvedValidationMessage}
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
