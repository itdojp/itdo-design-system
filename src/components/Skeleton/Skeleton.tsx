import React from 'react';
import clsx from 'clsx';
import { SkeletonProps } from './Skeleton.types';
import './Skeleton.css';

export const Skeleton: React.FC<SkeletonProps> = ({
  width,
  height,
  variant = 'rect',
  className,
}) => {
  const resolvedHeight =
    height ?? (variant === 'text' ? '1rem' : variant === 'circle' ? '2.5rem' : '2.5rem');
  const resolvedWidth = width ?? (variant === 'circle' ? '2.5rem' : '100%');
  const borderRadius = variant === 'circle' ? '9999px' : 'var(--radius-sm)';

  return (
    <div
      className={clsx('itdo-skeleton', className)}
      style={{ width: resolvedWidth, height: resolvedHeight, borderRadius }}
      aria-hidden="true"
    />
  );
};
