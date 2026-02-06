import React from 'react';
import clsx from 'clsx';
import { BreadcrumbItem, PageHeaderBreadcrumbs, PageHeaderProps } from './PageHeader.types';
import './PageHeader.css';

const isBreadcrumbList = (value: PageHeaderBreadcrumbs): value is BreadcrumbItem[] =>
  Array.isArray(value) &&
  value.every(
    (item) =>
      typeof item === 'object' &&
      item !== null &&
      'label' in item &&
      typeof item.label === 'string'
  );

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  primaryAction,
  secondaryActions,
  meta,
  sticky = false,
  className,
  status,
  actions,
}) => {
  const resolvedMeta = meta ?? status;
  const resolvedSecondaryActions = secondaryActions ?? actions;
  const hasActionArea = !!resolvedSecondaryActions || !!primaryAction;

  const renderBreadcrumbs = () => {
    if (!breadcrumbs) return null;

    if (isBreadcrumbList(breadcrumbs)) {
      if (breadcrumbs.length === 0) return null;

      return (
        <nav className="itdo-page-header__breadcrumbs" aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((item, index) => (
              <li key={item.id ?? item.href ?? item.label}>
                {item.href ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
                {index < breadcrumbs.length - 1 && (
                  <span className="itdo-page-header__breadcrumb-separator" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      );
    }

    return (
      <nav className="itdo-page-header__breadcrumbs" aria-label="Breadcrumb">
        {breadcrumbs}
      </nav>
    );
  };

  return (
    <header className={clsx('itdo-page-header', { 'itdo-page-header--sticky': sticky }, className)}>
      {renderBreadcrumbs()}
      <div className="itdo-page-header__row">
        <div className="itdo-page-header__main">
          <h1 className="itdo-page-header__title">{title}</h1>
          {description && <div className="itdo-page-header__description">{description}</div>}
          {resolvedMeta && <div className="itdo-page-header__meta">{resolvedMeta}</div>}
        </div>
        {hasActionArea && (
          <div className="itdo-page-header__side">
            {resolvedSecondaryActions && (
              <div className="itdo-page-header__actions itdo-page-header__actions--secondary">
                {resolvedSecondaryActions}
              </div>
            )}
            {primaryAction && (
              <div className="itdo-page-header__actions itdo-page-header__actions--primary">
                {primaryAction}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
