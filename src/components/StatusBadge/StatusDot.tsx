import clsx from 'clsx';
import { StatusDotProps } from './StatusBadge.types';
import { resolveStatusDictionaryEntry } from './statusDictionary';
import './StatusBadge.css';

export const StatusDot: React.FC<StatusDotProps> = ({
  status,
  size = 'sm',
  dictionary,
  fallbackLabelFormatter,
  className,
  showLabel = false,
  ariaLabel,
}) => {
  const entry = resolveStatusDictionaryEntry(status, dictionary, fallbackLabelFormatter);

  return (
    <span
      className={clsx('itdo-status-dot', `itdo-status-dot--${size}`, `itdo-status-dot--tone-${entry.tone}`, className)}
      role="status"
      aria-label={ariaLabel ?? `Status: ${entry.label}`}
      title={entry.label}
    >
      <span className="itdo-status-dot__circle" aria-hidden="true" />
      {showLabel ? (
        <span className="itdo-status-dot__label">{entry.label}</span>
      ) : (
        <span className="itdo-status-dot__sr-only">{entry.label}</span>
      )}
    </span>
  );
};
