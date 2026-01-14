import React from 'react';
import clsx from 'clsx';
import { PageHeaderProps } from './PageHeader.types';
import './PageHeader.css';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  status,
  actions,
  meta,
  className,
}) => {
  return (
    <header className={clsx('itdo-page-header', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="itdo-page-header__breadcrumbs" aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((item, index) => (
              <li key={`${item.label}-${index}`}>
                {item.href ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <span>{item.label}</span>
                )}
                {index < breadcrumbs.length - 1 && (
                  <span className="itdo-page-header__breadcrumb-separator" aria-hidden="true">
                    /
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="itdo-page-header__row">
        <div className="itdo-page-header__main">
          <div className="itdo-page-header__title-row">
            <h1 className="itdo-page-header__title">{title}</h1>
            {status && <div className="itdo-page-header__status">{status}</div>}
          </div>
          {description && <p className="itdo-page-header__description">{description}</p>}
        </div>
        {(actions || meta) && (
          <div className="itdo-page-header__side">
            {actions && <div className="itdo-page-header__actions">{actions}</div>}
            {meta && <div className="itdo-page-header__meta">{meta}</div>}
          </div>
        )}
      </div>
    </header>
  );
};
