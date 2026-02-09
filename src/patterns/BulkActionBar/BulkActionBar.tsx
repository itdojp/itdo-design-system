import clsx from 'clsx';
import { Button } from '../../components/Button';
import { BulkActionBarProps } from './BulkActionBar.types';
import './BulkActionBar.css';

const defaultSelectedRowsLabel = (count: number) => `${count} rows selected`;

export const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedCount,
  selectedRowsLabel = defaultSelectedRowsLabel,
  actions,
  clearSelectionLabel = 'Clear',
  onClearSelection,
  className,
}) => {
  if (selectedCount <= 0) {
    return null;
  }

  return (
    <div className={clsx('itdo-bulk-action-bar', className)} role="status" aria-live="polite">
      <span className="itdo-bulk-action-bar__count">{selectedRowsLabel(selectedCount)}</span>
      <div className="itdo-bulk-action-bar__actions">
        {actions.map((action) => (
          <Button
            key={action.key}
            size="small"
            variant={action.tone === 'danger' ? 'danger' : 'secondary'}
            disabled={action.disabled}
            onClick={action.onSelect}
          >
            {action.label}
          </Button>
        ))}
      </div>
      {onClearSelection && (
        <button
          type="button"
          className="itdo-bulk-action-bar__clear"
          onClick={onClearSelection}
        >
          {clearSelectionLabel}
        </button>
      )}
    </div>
  );
};
