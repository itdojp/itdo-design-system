import React, { useId } from 'react';
import clsx from 'clsx';
import { FormFieldProps } from './FormField.types';
import './FormField.css';

export const FormField: React.FC<FormFieldProps> = ({
  label,
  helpText,
  error,
  success,
  required = false,
  size = 'medium',
  fullWidth = false,
  id,
  className,
  labelClassName,
  messageClassName,
  children,
}) => {
  const generatedId = useId();
  const childId = React.isValidElement(children) ? children.props.id : undefined;
  const controlId = id ?? childId ?? generatedId;
  const helpId = helpText ? `${controlId}-help` : undefined;
  const errorId = error ? `${controlId}-error` : undefined;
  const successId = success ? `${controlId}-success` : undefined;

  const describedBy = [
    React.isValidElement(children) ? children.props['aria-describedby'] : undefined,
    helpId,
    errorId,
    successId,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const fieldClasses = clsx(
    'itdo-form-field',
    `itdo-form-field--${size}`,
    {
      'itdo-form-field--error': !!error,
      'itdo-form-field--success': !!success,
      'itdo-form-field--full-width': fullWidth,
    },
    className
  );

  const control = React.isValidElement(children)
    ? React.cloneElement(children, {
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : children.props['aria-invalid'],
        required: required || children.props.required,
      })
    : children;

  return (
    <div className={fieldClasses}>
      {label && (
        <label className={clsx('itdo-form-field__label', labelClassName)} htmlFor={controlId}>
          {label}
          {required && <span className="itdo-form-field__required">*</span>}
        </label>
      )}
      {control}
      {helpText && <p className="itdo-form-field__help" id={helpId}>{helpText}</p>}
      {error && (
        <p className={clsx('itdo-form-field__message', 'itdo-form-field__message--error', messageClassName)} id={errorId}>
          {error}
        </p>
      )}
      {success && !error && (
        <p className={clsx('itdo-form-field__message', 'itdo-form-field__message--success', messageClassName)} id={successId}>
          {success}
        </p>
      )}
    </div>
  );
};
