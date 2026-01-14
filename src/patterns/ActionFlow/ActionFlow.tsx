import React from 'react';
import clsx from 'clsx';
import { Alert } from '../../components/Alert';
import { Spinner } from '../../components/Spinner';
import { ActionFlowProps } from './ActionFlow.types';
import './ActionFlow.css';

export const ActionFlow: React.FC<ActionFlowProps> = ({
  title,
  description,
  state,
  confirmAction,
  cancelAction,
  retryAction,
  resultAction,
  processingMessage = 'Processing...',
  resultTitle,
  resultMessage,
  className,
}) => {
  return (
    <section className={clsx('itdo-action-flow', className)}>
      <div className="itdo-action-flow__header">
        <h3 className="itdo-action-flow__title">{title}</h3>
        {description && <p className="itdo-action-flow__description">{description}</p>}
      </div>

      {state === 'confirm' && (
        <div className="itdo-action-flow__body">
          <div className="itdo-action-flow__actions">
            {cancelAction}
            {confirmAction}
          </div>
        </div>
      )}

      {state === 'processing' && (
        <div className="itdo-action-flow__body itdo-action-flow__processing">
          <Spinner size="small" label="Processing" />
          <span className="itdo-action-flow__processing-text">{processingMessage}</span>
        </div>
      )}

      {state === 'success' && (
        <div className="itdo-action-flow__body">
          <Alert variant="success" title={resultTitle ?? 'Completed'}>
            {resultMessage ?? 'The action finished successfully.'}
          </Alert>
          {resultAction && <div className="itdo-action-flow__actions">{resultAction}</div>}
        </div>
      )}

      {state === 'error' && (
        <div className="itdo-action-flow__body">
          <Alert variant="error" title={resultTitle ?? 'Failed'}>
            {resultMessage ?? 'An error occurred. Review details and retry.'}
          </Alert>
          {retryAction && <div className="itdo-action-flow__actions">{retryAction}</div>}
        </div>
      )}
    </section>
  );
};
