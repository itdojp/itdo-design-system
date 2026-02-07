import { forwardRef, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { TextareaProps } from './Textarea.types';
import { FormField } from '../FormField';
import { resolveValidationMessage, resolveValidationState } from '../FormField/validation';
import './Textarea.css';

const getTextLength = (value: unknown): number => {
  if (typeof value === 'string') {
    return value.length;
  }

  if (typeof value === 'number') {
    return String(value).length;
  }

  if (Array.isArray(value)) {
    return value.join('').length;
  }

  return 0;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
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
      showCharacterCount,
      className,
      containerClassName,
      rows = 4,
      value,
      defaultValue,
      maxLength,
      onChange,
      ...props
    },
    ref
  ) => {
    const [currentLength, setCurrentLength] = useState(() =>
      getTextLength(value ?? defaultValue)
    );

    useEffect(() => {
      if (value !== undefined) {
        setCurrentLength(getTextLength(value));
      }
    }, [value]);

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
    const shouldShowCharacterCount =
      typeof maxLength === 'number' && (showCharacterCount ?? true);
    const characterCount = useMemo(() => {
      if (!shouldShowCharacterCount || typeof maxLength !== 'number') {
        return undefined;
      }
      return `${currentLength}/${maxLength}`;
    }, [currentLength, maxLength, shouldShowCharacterCount]);

    const textareaClasses = clsx(
      'itdo-textarea',
      `itdo-textarea--${size}`,
      {
        'itdo-textarea--error': resolvedValidationState === 'error',
        'itdo-textarea--warning': resolvedValidationState === 'warning',
        'itdo-textarea--success': resolvedValidationState === 'success',
        'itdo-textarea--validating': resolvedValidationState === 'validating',
        'itdo-textarea--disabled': disabled,
        'itdo-textarea--full-width': fullWidth,
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
        footer={
          characterCount ? (
            <span className="itdo-textarea__character-count">{characterCount}</span>
          ) : undefined
        }
      >
        <textarea
          ref={ref}
          className={textareaClasses}
          disabled={disabled}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={(event) => {
            setCurrentLength(event.currentTarget.value.length);
            onChange?.(event);
          }}
          {...props}
        />
      </FormField>
    );
  }
);

Textarea.displayName = 'Textarea';
