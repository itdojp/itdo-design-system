import clsx from 'clsx';
import { StatusBadgeProps } from './StatusBadge.types';
import { resolveStatusDictionaryEntry } from './statusDictionary';
import './StatusBadge.css';

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'soft',
  size = 'md',
  dictionary,
  className,
  hideIcon = false,
  ariaLabel,
}) => {
  const entry = resolveStatusDictionaryEntry(status, dictionary);

  return (
    <span
      className={clsx(
        'itdo-status-badge',
        `itdo-status-badge--${variant}`,
        `itdo-status-badge--${size}`,
        `itdo-status-badge--tone-${entry.tone}`,
        className
      )}
      role="status"
      aria-label={ariaLabel ?? `Status: ${entry.label}`}
      title={entry.label}
    >
      {!hideIcon && <span className="itdo-status-badge__icon" aria-hidden="true">{entry.icon}</span>}
      <span className="itdo-status-badge__label">{entry.label}</span>
    </span>
  );
};
