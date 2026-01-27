import React from 'react';
import clsx from 'clsx';
import { LinkProps } from './Link.types';
import './Link.css';

const isUnsafeLink = (href: string) => {
  const normalized = href.trim().toLowerCase();
  return normalized.startsWith('javascript:') || normalized.startsWith('data:');
};

const isExternalLink = (href: string) => {
  const normalized = href.trim().toLowerCase();
  return (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('//') ||
    normalized.startsWith('mailto:') ||
    normalized.startsWith('tel:') ||
    normalized.startsWith('sms:') ||
    normalized.startsWith('ftp:') ||
    normalized.startsWith('file:')
  );
};

export const Link: React.FC<LinkProps> = ({
  href,
  children,
  external,
  showExternalIcon = true,
  size = 'medium',
  variant = 'primary',
  className,
  rel,
  target,
  onClick,
  ...props
}) => {
  const unsafe = isUnsafeLink(href);
  const resolvedExternal = unsafe ? false : external ?? isExternalLink(href);
  const resolvedRel = resolvedExternal ? rel ?? 'noopener noreferrer' : rel;
  const resolvedTarget = resolvedExternal ? target ?? '_blank' : target;
  const resolvedHref = unsafe ? '#' : href;

  return (
    <a
      href={resolvedHref}
      className={clsx('itdo-link', `itdo-link--${size}`, `itdo-link--${variant}`, className)}
      rel={resolvedRel}
      target={resolvedTarget}
      aria-disabled={unsafe || undefined}
      onClick={(event) => {
        if (unsafe) {
          event.preventDefault();
          return;
        }
        onClick?.(event);
      }}
      {...props}
    >
      <span className="itdo-link__label">{children}</span>
      {resolvedExternal && showExternalIcon && (
        <span className="itdo-link__icon" aria-hidden="true">
          ↗
        </span>
      )}
    </a>
  );
};
