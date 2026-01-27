import React from 'react';
import clsx from 'clsx';
import { Button } from '../Button';
import { useClipboard } from '../../hooks';
import { CopyButtonProps } from './CopyButton.types';
import './CopyButton.css';

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label = 'Copy',
  successLabel = 'Copied',
  errorLabel = 'Copy failed',
  timeoutMs = 2000,
  size = 'small',
  variant = 'secondary',
  className,
  showStatus = true,
  disabled,
  ...buttonProps
}) => {
  const { status, copy, isSupported } = useClipboard(timeoutMs);

  const statusText =
    status === 'success'
      ? successLabel
      : status === 'error'
        ? errorLabel
        : status === 'timeout'
          ? ''
          : '';

  return (
    <div className={clsx('itdo-copy-button', className)}>
      <Button
        size={size}
        variant={variant}
        onClick={() => {
          if (!isSupported) return;
          copy(text);
        }}
        type="button"
        disabled={disabled || !isSupported}
        {...buttonProps}
      >
        {label}
      </Button>
      {showStatus && statusText && (
        <span className="itdo-copy-button__status" role="status" aria-live="polite">
          {statusText}
        </span>
      )}
    </div>
  );
};
