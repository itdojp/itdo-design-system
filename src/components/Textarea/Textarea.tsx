import { forwardRef } from 'react';
import clsx from 'clsx';
import { TextareaProps } from './Textarea.types';
import { FormField } from '../FormField';
import './Textarea.css';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      className,
      containerClassName,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const textareaClasses = clsx(
      'itdo-textarea',
      `itdo-textarea--${size}`,
      {
        'itdo-textarea--error': error,
        'itdo-textarea--disabled': disabled,
        'itdo-textarea--full-width': fullWidth,
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
        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          rows={rows}
          {...props}
        />
      </FormField>
    );
  }
);

Textarea.displayName = 'Textarea';
