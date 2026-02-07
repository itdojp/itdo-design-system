import React, { useId } from 'react';
import clsx from 'clsx';
import { FormFieldProps } from './FormField.types';
import { resolveValidationMessage, resolveValidationState } from './validation';
import './FormField.css';

export const FormField: React.FC<FormFieldProps> = ({
  label,
  helpText,
  hint,
  description,
  error,
  warning,
  success,
  validationState,
  validationMessage,
  required = false,
  size = 'medium',
  fullWidth = false,
  id,
  className,
  labelClassName,
  messageClassName,
  footer,
  children,
}) => {
  const generatedId = useId();
  const childId = React.isValidElement(children) ? children.props.id : undefined;
  const controlId = id ?? childId ?? generatedId;
  const resolvedHelpText = hint ?? description ?? helpText;
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
  const childDescribedBy = React.isValidElement(children)
    ? children.props['aria-describedby']
    : undefined;
  const hasFooter = footer !== null && footer !== undefined;
  const helpId = resolvedHelpText ? `${controlId}-help` : undefined;
  const messageId = resolvedValidationMessage ? `${controlId}-validation` : undefined;
  const footerId = hasFooter ? `${controlId}-footer` : undefined;

  const describedBy = [
    messageId,
    helpId,
    footerId,
    childDescribedBy,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const fieldClasses = clsx(
    'itdo-form-field',
    `itdo-form-field--${size}`,
    {
      [`itdo-form-field--${resolvedValidationState}`]:
        resolvedValidationState !== 'none',
      'itdo-form-field--error': resolvedValidationState === 'error',
      'itdo-form-field--success': resolvedValidationState === 'success',
      'itdo-form-field--full-width': fullWidth,
    },
    className
  );

  const control = React.isValidElement(children)
    ? React.cloneElement(children, {
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid':
          resolvedValidationState === 'error' ? true : children.props['aria-invalid'],
        'aria-busy':
          resolvedValidationState === 'validating'
            ? true
            : children.props['aria-busy'],
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
      {resolvedHelpText && (
        <p className="itdo-form-field__help" id={helpId}>
          {resolvedHelpText}
        </p>
      )}
      {resolvedValidationMessage && (
        <p
          className={clsx(
            'itdo-form-field__message',
            resolvedValidationState !== 'none' &&
              `itdo-form-field__message--${resolvedValidationState}`,
            messageClassName
          )}
          id={messageId}
        >
          {resolvedValidationMessage}
        </p>
      )}
      {hasFooter && (
        <div className="itdo-form-field__footer" id={footerId}>
          {footer}
        </div>
      )}
    </div>
  );
};
