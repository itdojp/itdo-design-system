import React from 'react';
import clsx from 'clsx';
import { CardProps } from './Card.types';
import './Card.css';

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 'medium',
  className,
  onClick,
  ...props
}) => {
  const cardClasses = clsx(
    'itdo-card',
    `itdo-card--${variant}`,
    `itdo-card--padding-${padding}`,
    {
      'itdo-card--clickable': onClick,
    },
    className
  );

  return (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );
};