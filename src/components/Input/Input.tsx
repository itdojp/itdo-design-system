import { forwardRef } from 'react';
import clsx from 'clsx';
import { InputProps } from './Input.types';
import { FormField } from '../FormField';
import { resolveValidationMessage, resolveValidationState } from '../FormField/validation';
import './Input.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      warning,
      helperText,
      helpText,
      hint,
      description,
      success,
      validationState,
      validationMessage,
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

    const inputClasses = clsx(
      'itdo-input',
      `itdo-input--${size}`,
      {
        'itdo-input--error': resolvedValidationState === 'error',
        'itdo-input--warning': resolvedValidationState === 'warning',
        'itdo-input--success': resolvedValidationState === 'success',
        'itdo-input--validating': resolvedValidationState === 'validating',
        'itdo-input--disabled': disabled,
        'itdo-input--full-width': fullWidth,
      },
      className
    );

    const resolvedHelpText = hint ?? description ?? helpText ?? helperText;

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
        <input ref={ref} className={inputClasses} disabled={disabled} {...props} />
      </FormField>
    );
  }
);

Input.displayName = 'Input';
