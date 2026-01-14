import React from 'react';
import clsx from 'clsx';
import { ButtonProps } from './Button.types';
import './Button.css';

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  className,
  ...props
}) => {
  const buttonClasses = clsx(
    'itdo-button',
    `itdo-button--${variant}`,
    `itdo-button--${size}`,
    {
      'itdo-button--disabled': disabled || loading,
      'itdo-button--loading': loading,
      'itdo-button--full-width': fullWidth,
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <span className="itdo-button__spinner">
          <svg className="itdo-button__spinner-icon" viewBox="0 0 24 24">
            <circle
              className="itdo-button__spinner-circle"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="2"
            />
          </svg>
        </span>
      )}
      <span className="itdo-button__content">{children}</span>
    </button>
  );
};
