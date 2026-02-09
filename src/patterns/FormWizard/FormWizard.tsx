import { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import { FormWizardProps } from './FormWizard.types';
import './FormWizard.css';

const isStepSatisfied = (isComplete: boolean | undefined, optional: boolean | undefined) =>
  Boolean(isComplete || optional);

const autosaveStatusLabel = (status: FormWizardProps['autosave'] extends undefined ? never : NonNullable<FormWizardProps['autosave']>['status']) => {
  switch (status) {
    case 'saving':
      return 'Saving draft';
    case 'saved':
      return 'Draft saved';
    case 'error':
      return 'Draft save failed';
    case 'conflict':
      return 'Draft conflict detected';
    default:
      return 'Autosave idle';
  }
};

export const FormWizard = ({
  steps,
  value,
  defaultValue,
  onValueChange,
  onSubmit,
  onCancel,
  canSubmit,
  isDirty = false,
  protectUnsavedChanges = false,
  autosave,
  labels,
  className,
}: FormWizardProps) => {
  const isControlled = value !== undefined;
  const firstStepId = steps[0]?.id;
  const [internalStepId, setInternalStepId] = useState(defaultValue ?? firstStepId);
  const activeStepId = isControlled ? value : internalStepId;

  const resolvedLabels = {
    back: labels?.back ?? 'Back',
    next: labels?.next ?? 'Next',
    submit: labels?.submit ?? 'Submit',
    cancel: labels?.cancel ?? 'Cancel',
    optional: labels?.optional ?? 'Optional',
    autosavePrefix: labels?.autosavePrefix ?? 'Draft',
  };

  const activeIndex = useMemo(
    () => Math.max(0, steps.findIndex((step) => step.id === activeStepId)),
    [activeStepId, steps]
  );
  const activeStep = steps[activeIndex];

  const canMoveToIndex = (targetIndex: number) => {
    if (targetIndex < 0 || targetIndex >= steps.length) {
      return false;
    }

    for (let index = 0; index < targetIndex; index += 1) {
      const step = steps[index];
      if (!isStepSatisfied(step.isComplete, step.optional)) {
        return false;
      }
    }
    return true;
  };

  const selectStep = useCallback(
    (stepId: string) => {
      if (!isControlled) {
        setInternalStepId(stepId);
      }
      onValueChange?.(stepId);
    },
    [isControlled, onValueChange]
  );

  useEffect(() => {
    if (!activeStep && firstStepId) {
      selectStep(firstStepId);
    }
  }, [activeStep, firstStepId, selectStep]);

  useEffect(() => {
    if (!protectUnsavedChanges || !isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty, protectUnsavedChanges]);

  if (!activeStep) {
    return null;
  }

  const canGoBack = activeIndex > 0;
  const canGoNext = activeIndex < steps.length - 1;
  const currentSatisfied = isStepSatisfied(activeStep.isComplete, activeStep.optional);
  const nextDisabled = canGoNext && !currentSatisfied;

  const allSatisfied = steps.every((step) => isStepSatisfied(step.isComplete, step.optional));
  const submitDisabled = !(canSubmit ?? allSatisfied);

  const statusText = autosave ? `${resolvedLabels.autosavePrefix}: ${autosaveStatusLabel(autosave.status)}` : null;

  return (
    <div className={clsx('itdo-form-wizard', className)}>
      <nav aria-label="Form steps">
        <ol className="itdo-form-wizard__steps">
          {steps.map((step, index) => {
            const unlocked = canMoveToIndex(index);
            const isCurrent = index === activeIndex;

            return (
              <li
                key={step.id}
                className={clsx('itdo-form-wizard__step', {
                  'is-current': isCurrent,
                  'is-complete': step.isComplete,
                  'is-error': step.hasError,
                })}
              >
                <button
                  type="button"
                  className="itdo-form-wizard__step-button"
                  onClick={() => selectStep(step.id)}
                  disabled={!unlocked}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span className="itdo-form-wizard__step-index">{index + 1}</span>
                  <span className="itdo-form-wizard__step-text">
                    <span>{step.title}</span>
                    {step.optional && <span className="itdo-form-wizard__step-optional">{resolvedLabels.optional}</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {autosave && (
        <div className={clsx('itdo-form-wizard__autosave', `is-${autosave.status}`)} role="status">
          <span>{statusText}</span>
          {autosave.lastSavedAt && <span>Last: {autosave.lastSavedAt}</span>}
          {autosave.message && <span>{autosave.message}</span>}
          {autosave.onRestoreDraft && (
            <Button size="small" variant="secondary" onClick={autosave.onRestoreDraft}>
              Restore draft
            </Button>
          )}
          {autosave.onRetrySave && (autosave.status === 'error' || autosave.status === 'conflict') && (
            <Button size="small" onClick={autosave.onRetrySave}>
              Retry save
            </Button>
          )}
        </div>
      )}

      <section className="itdo-form-wizard__panel" aria-labelledby={`itdo-form-wizard-step-${activeStep.id}`}>
        <header className="itdo-form-wizard__panel-header">
          <h2 id={`itdo-form-wizard-step-${activeStep.id}`}>{activeStep.title}</h2>
          {activeStep.description && <p>{activeStep.description}</p>}
        </header>
        <div className="itdo-form-wizard__panel-body">{activeStep.content}</div>
      </section>

      <footer className="itdo-form-wizard__actions">
        {onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            {resolvedLabels.cancel}
          </Button>
        )}
        <div className="itdo-form-wizard__actions-right">
          <Button
            variant="secondary"
            onClick={() => {
              if (!canGoBack) {
                return;
              }
              selectStep(steps[activeIndex - 1].id);
            }}
            disabled={!canGoBack}
          >
            {resolvedLabels.back}
          </Button>
          {canGoNext ? (
            <Button
              onClick={() => {
                if (nextDisabled) {
                  return;
                }
                selectStep(steps[activeIndex + 1].id);
              }}
              disabled={nextDisabled}
            >
              {resolvedLabels.next}
            </Button>
          ) : (
            <Button
              onClick={() => {
                void onSubmit?.();
              }}
              disabled={submitDisabled}
            >
              {resolvedLabels.submit}
            </Button>
          )}
        </div>
      </footer>
    </div>
  );
};
