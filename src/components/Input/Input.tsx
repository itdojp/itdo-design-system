import React, { forwardRef } from 'react';
import clsx from 'clsx';
import { InputProps } from './Input.types';
import './Input.css';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
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

    const containerClasses = clsx('itdo-input-container', containerClassName);

    return (
      <div className={containerClasses}>
        {label && (
          <label className="itdo-input__label">
            {label}
            {required && <span className="itdo-input__required">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={inputClasses}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={helperText || error ? 'input-helper-text' : undefined}
          {...props}
        />
        {(helperText || error) && (
          <p
            id="input-helper-text"
            className={clsx('itdo-input__helper-text', {
              'itdo-input__helper-text--error': error,
            })}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';