import clsx from 'clsx';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import type { StatePresetAction, StatePresetProps } from './StatePreset.types';
import './StatePreset.css';

const toButtonVariant = (tone: StatePresetAction['tone']) => {
  if (tone === 'primary') {
    return 'primary';
  }
  if (tone === 'ghost') {
    return 'ghost';
  }
  return 'secondary';
};

const renderActions = (actions: StatePresetAction[]) => {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="itdo-state-preset__actions">
      {actions.map((action) => (
        <Button
          key={`${action.label}-${action.tone ?? 'secondary'}`}
          size="small"
          type="button"
          variant={toButtonVariant(action.tone)}
          onClick={action.onClick}
          disabled={action.disabled}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
};

export const StatePreset = ({
  mode,
  loading,
  empty,
  error,
  success,
  className,
}: StatePresetProps) => {
  if (mode === 'loading') {
    const loadingLabel = loading?.label ?? 'Loading...';
    return (
      <section className={clsx('itdo-state-preset', 'itdo-state-preset--loading', className)}>
        <Spinner label={loadingLabel} />
        <span className="itdo-state-preset__text">{loadingLabel}</span>
      </section>
    );
  }

  if (mode === 'empty') {
    return (
      <section className={clsx('itdo-state-preset', 'itdo-state-preset--empty', className)}>
        <EmptyState
          title={empty?.title ?? 'No data'}
          description={empty?.description}
          action={empty?.action}
          primaryAction={empty?.primaryAction}
          secondaryAction={empty?.secondaryAction}
          ghostAction={empty?.ghostAction}
        />
      </section>
    );
  }

  if (mode === 'error') {
    const actionOrder: StatePresetAction[] = [];
    if (error?.retry) {
      actionOrder.push({ ...error.retry, tone: error.retry.tone ?? 'primary' });
    }
    if (error?.contact) {
      actionOrder.push({ ...error.contact, tone: error.contact.tone ?? 'secondary' });
    }
    if (error?.fallback) {
      actionOrder.push({ ...error.fallback, tone: error.fallback.tone ?? 'ghost' });
    }

    return (
      <section className={clsx('itdo-state-preset', 'itdo-state-preset--error', className)}>
        <Alert variant="error" title={error?.title ?? 'Operation failed'}>
          <div className="itdo-state-preset__content">
            {error?.expandableDetail && error.detail ? (
              <details className="itdo-state-preset__detail">
                <summary>Details</summary>
                <pre>{error.detail}</pre>
              </details>
            ) : (
              error?.detail && <p className="itdo-state-preset__detail-text">{error.detail}</p>
            )}
            {renderActions(actionOrder)}
          </div>
        </Alert>
      </section>
    );
  }

  const successActions: StatePresetAction[] = [];
  if (success?.primaryAction) {
    successActions.push({ ...success.primaryAction, tone: success.primaryAction.tone ?? 'primary' });
  }
  if (success?.secondaryAction) {
    successActions.push({ ...success.secondaryAction, tone: success.secondaryAction.tone ?? 'secondary' });
  }

  return (
    <section className={clsx('itdo-state-preset', 'itdo-state-preset--success', className)}>
      <Alert variant="success" title={success?.title ?? 'Completed successfully'}>
        <div className="itdo-state-preset__content">
          {success?.description && <p className="itdo-state-preset__detail-text">{success.description}</p>}
          {renderActions(successActions)}
        </div>
      </Alert>
    </section>
  );
};
