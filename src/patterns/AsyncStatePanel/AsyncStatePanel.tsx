import clsx from 'clsx';
import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Spinner } from '../../components/Spinner';
import { AsyncStatePanelProps } from './AsyncStatePanel.types';
import './AsyncStatePanel.css';

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
        />
      </section>
    );
  }

  if (state === 'error') {
    const retryLabel = error?.retryLabel ?? 'Retry';

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
            {error?.onRetry && (
              <Button size="small" variant="secondary" onClick={error.onRetry}>
                {retryLabel}
              </Button>
            )}
          </div>
        </Alert>
      </section>
    );
  }

  return <section className={clsx('itdo-async-state-panel itdo-async-state-panel--ready', className)}>{children}</section>;
};
