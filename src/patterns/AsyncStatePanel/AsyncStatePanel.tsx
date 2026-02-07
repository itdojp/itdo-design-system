import clsx from 'clsx';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { AsyncStatePanelProps } from './AsyncStatePanel.types';
import './AsyncStatePanel.css';

const getButtonVariant = (tone: 'primary' | 'secondary' | 'ghost' = 'secondary') => {
  if (tone === 'primary') {
    return 'primary';
  }
  if (tone === 'ghost') {
    return 'ghost';
  }
  return 'secondary';
};

export const AsyncStatePanel: React.FC<AsyncStatePanelProps> = ({
  state,
  loadingText = 'Loading...',
  empty,
  error,
  children,
  className,
}) => {
  if (state === 'loading') {
    return (
      <section className={clsx('itdo-async-state-panel itdo-async-state-panel--loading', className)}>
        <Spinner label={loadingText} />
        <span className="itdo-async-state-panel__text">{loadingText}</span>
      </section>
    );
  }

  if (state === 'empty') {
    return (
      <section className={clsx('itdo-async-state-panel itdo-async-state-panel--empty', className)}>
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

  if (state === 'error') {
    const retryAction = error?.retryAction ?? (
      error?.onRetry
        ? {
            label: error?.retryLabel ?? 'Retry',
            onClick: error.onRetry,
            tone: 'primary' as const,
          }
        : undefined
    );
    const actions = [
      retryAction,
      error?.secondaryAction,
      error?.contactAction,
      error?.backAction,
    ].filter((value): value is NonNullable<typeof value> => Boolean(value));

    return (
      <section className={clsx('itdo-async-state-panel itdo-async-state-panel--error', className)}>
        <Alert variant="error" title={error?.title ?? 'Failed to load'}>
          <div className="itdo-async-state-panel__error-content">
            {error?.expandableDetail && error.detail ? (
              <details className="itdo-async-state-panel__detail">
                <summary>Details</summary>
                <pre>{error.detail}</pre>
              </details>
            ) : (
              error?.detail && <p className="itdo-async-state-panel__error-detail">{error.detail}</p>
            )}
            {actions.length > 0 && (
              <div className="itdo-async-state-panel__actions">
                {actions.map((action, index) => {
                  return (
                    <Button
                      key={action.id ?? `${action.tone ?? 'secondary'}-${action.label}-${index}`}
                      size="small"
                      variant={getButtonVariant(action.tone)}
                      onClick={action.onClick}
                    >
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        </Alert>
      </section>
    );
  }

  return <section className={clsx('itdo-async-state-panel itdo-async-state-panel--ready', className)}>{children}</section>;
};
