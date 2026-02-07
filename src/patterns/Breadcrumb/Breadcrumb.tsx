import React from 'react';
import clsx from 'clsx';
import { BreadcrumbProps } from './Breadcrumb.types';
import './Breadcrumb.css';

const resolveCurrentIndex = (items: BreadcrumbProps['items']) => {
  const explicitCurrentIndex = items.findIndex((item) => item.current);
  return explicitCurrentIndex >= 0 ? explicitCurrentIndex : items.length - 1;
};

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  ariaLabel = 'Breadcrumb',
  className,
}) => {
  if (items.length === 0) {
    return null;
  }

  const currentIndex = resolveCurrentIndex(items);

  return (
    <nav className={clsx('itdo-breadcrumb', className)} aria-label={ariaLabel}>
      <ol className="itdo-breadcrumb__list">
        {items.map((item, index) => {
          const isCurrent = index === currentIndex;
          const key = item.id ?? `${item.href ?? 'itdo-breadcrumb-item'}-${index}`;

          return (
            <li key={key} className="itdo-breadcrumb__item">
              {isCurrent ? (
                <span className="itdo-breadcrumb__current" aria-current="page">
                  {item.label}
                </span>
              ) : item.href ? (
                <a href={item.href} className="itdo-breadcrumb__link">
                  {item.label}
                </a>
              ) : item.onClick ? (
                <button type="button" className="itdo-breadcrumb__button" onClick={item.onClick}>
                  {item.label}
                </button>
              ) : (
                <span className="itdo-breadcrumb__text">{item.label}</span>
              )}

              {index < items.length - 1 && (
                <span className="itdo-breadcrumb__separator" aria-hidden="true">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
