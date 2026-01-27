import React from 'react';
import clsx from 'clsx';
import { LinkProps } from './Link.types';
import './Link.css';

const isExternalLink = (href: string) => {
  return href.startsWith('http://') || href.startsWith('https://') || href.startsWith('//') || href.startsWith('mailto:');
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
  ...props
}) => {
  const resolvedExternal = external ?? isExternalLink(href);
  const resolvedRel = resolvedExternal ? rel ?? 'noopener noreferrer' : rel;
  const resolvedTarget = resolvedExternal ? target ?? '_blank' : target;

  return (
    <a
      href={href}
      className={clsx('itdo-link', `itdo-link--${size}`, `itdo-link--${variant}`, className)}
      rel={resolvedRel}
      target={resolvedTarget}
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
