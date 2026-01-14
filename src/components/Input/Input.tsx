import { forwardRef } from 'react';
import clsx from 'clsx';
import { InputProps } from './Input.types';
import { FormField } from '../FormField';
import './Input.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      helpText,
      success,
      size = 'medium',
      fullWidth = false,
      disabled = false,
      required = false,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const inputClasses = clsx(
      'itdo-input',
      `itdo-input--${size}`,
      {
        'itdo-input--error': error,
        'itdo-input--disabled': disabled,
        'itdo-input--full-width': fullWidth,
      },
      className
    );

    const resolvedHelpText = helpText ?? helperText;

    return (
      <FormField
        label={label}
        helpText={resolvedHelpText}
        error={error}
        success={success}
        required={required}
        size={size}
        fullWidth={fullWidth}
        className={containerClassName}
      >
        <input ref={ref} className={inputClasses} disabled={disabled} {...props} />
      </FormField>
    );
  }
);

Input.displayName = 'Input';
