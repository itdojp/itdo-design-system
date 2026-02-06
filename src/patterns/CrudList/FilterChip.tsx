import clsx from 'clsx';
import { FilterChipProps } from './CrudList.types';
import './CrudList.css';

export const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove, className }) => {
  return (
    <span className={clsx('itdo-filter-chip', className)}>
      <span className="itdo-filter-chip__label">{label}</span>
      {onRemove && (
        <button
          type="button"
          className="itdo-filter-chip__remove"
          onClick={onRemove}
          aria-label={`Remove filter: ${label}`}
        >
          x
        </button>
      )}
    </span>
  );
};
