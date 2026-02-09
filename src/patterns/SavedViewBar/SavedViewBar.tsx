import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import { SavedViewBarProps } from './SavedViewBar.types';
import './SavedViewBar.css';

export const SavedViewBar = <TPayload,>({
  views,
  activeViewId,
  onSelectView,
  onSaveAs,
  onUpdateView,
  onDuplicateView,
  onShareView,
  onDeleteView,
  disabled = false,
  labels,
  className,
}: SavedViewBarProps<TPayload>) => {
  const [name, setName] = useState('');

  const resolvedLabels = useMemo(
    () => ({
      title: labels?.title ?? 'Saved Views',
      saveAsPlaceholder: labels?.saveAsPlaceholder ?? 'New view name',
      saveAsButton: labels?.saveAsButton ?? 'Save as new',
      update: labels?.update ?? 'Update',
      duplicate: labels?.duplicate ?? 'Duplicate',
      share: labels?.share ?? 'Share',
      delete: labels?.delete ?? 'Delete',
      active: labels?.active ?? 'Active view',
    }),
    [labels]
  );

  const activeView = views.find((view) => view.id === activeViewId);
  const trimmedName = name.trim();

  return (
    <section className={clsx('itdo-saved-view-bar', className)} aria-label={resolvedLabels.title}>
      <div className="itdo-saved-view-bar__header">
        <h3 className="itdo-saved-view-bar__title">{resolvedLabels.title}</h3>
        <div className="itdo-saved-view-bar__save-as">
          <input
            type="text"
            value={name}
            disabled={disabled}
            placeholder={resolvedLabels.saveAsPlaceholder}
            aria-label={resolvedLabels.saveAsPlaceholder}
            className="itdo-saved-view-bar__input"
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter') {
                return;
              }

              if (!trimmedName || disabled) {
                return;
              }

              onSaveAs(trimmedName);
              setName('');
            }}
          />
          <Button
            size="small"
            disabled={disabled || !trimmedName}
            onClick={() => {
              if (!trimmedName) {
                return;
              }
              onSaveAs(trimmedName);
              setName('');
            }}
          >
            {resolvedLabels.saveAsButton}
          </Button>
        </div>
      </div>

      <div className="itdo-saved-view-bar__body">
        <div role="radiogroup" aria-label={resolvedLabels.active} className="itdo-saved-view-bar__chips">
          {views.map((view) => (
            <button
              key={view.id}
              type="button"
              role="radio"
              aria-checked={view.id === activeViewId}
              className={clsx('itdo-saved-view-bar__chip', {
                'is-active': view.id === activeViewId,
              })}
              disabled={disabled}
              onClick={() => onSelectView(view.id)}
            >
              {view.name}
            </button>
          ))}
        </div>

        <div className="itdo-saved-view-bar__actions">
          <Button
            size="small"
            variant="secondary"
            disabled={disabled || !activeView || !onUpdateView}
            onClick={() => activeView && onUpdateView?.(activeView.id)}
          >
            {resolvedLabels.update}
          </Button>
          <Button
            size="small"
            variant="secondary"
            disabled={disabled || !activeView || !onDuplicateView}
            onClick={() => activeView && onDuplicateView?.(activeView.id)}
          >
            {resolvedLabels.duplicate}
          </Button>
          <Button
            size="small"
            variant="secondary"
            disabled={disabled || !activeView || !onShareView}
            onClick={() => activeView && onShareView?.(activeView.id)}
          >
            {resolvedLabels.share}
          </Button>
          <Button
            size="small"
            variant="danger"
            disabled={disabled || !activeView || !onDeleteView}
            onClick={() => activeView && onDeleteView?.(activeView.id)}
          >
            {resolvedLabels.delete}
          </Button>
        </div>
      </div>
    </section>
  );
};
