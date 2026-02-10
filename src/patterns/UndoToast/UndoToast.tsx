import { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Button } from '../../components/Button';
import { Toast } from '../../components/Toast';
import type { UndoToastProps } from './UndoToast.types';
import './UndoToast.css';

type UndoToastPhase = 'pending' | 'undone' | 'committed';

const MIN_DURATION_MS = 200;
const TICK_INTERVAL_MS = 250;

const toDuration = (value: number | undefined): number =>
  Math.max(MIN_DURATION_MS, value ?? 5000);

export const UndoToast = ({
  title,
  description,
  severity = 'success',
  durationMs,
  showCountdown = true,
  autoDismissOnCommit = true,
  autoDismissOnUndo = true,
  labels,
  onUndo,
  onCommit,
  onDismiss,
  className,
}: UndoToastProps) => {
  const [phase, setPhase] = useState<UndoToastPhase>('pending');
  const [remainingMs, setRemainingMs] = useState(toDuration(durationMs));
  const timeoutRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<number | undefined>(undefined);
  const startedAtRef = useRef<number | undefined>(undefined);
  const commitCalledRef = useRef(false);

  const resolvedLabels = {
    undo: labels?.undo ?? 'Undo',
    undoAriaLabel:
      labels?.undoAriaLabel ??
      ((seconds: number) => `Undo within ${seconds} second${seconds === 1 ? '' : 's'}`),
    countdownSuffix:
      labels?.countdownSuffix ?? ((seconds: number) => `(${seconds}s)`),
    committedState: labels?.committedState ?? 'Changes are now committed.',
    undoneState: labels?.undoneState ?? 'Changes have been reverted.',
  };

  const remainingSeconds = useMemo(() => Math.max(0, Math.ceil(remainingMs / 1000)), [remainingMs]);

  const clearTimers = () => {
    if (timeoutRef.current !== undefined) {
      window.clearTimeout(timeoutRef.current);
    }
    if (intervalRef.current !== undefined) {
      window.clearInterval(intervalRef.current);
    }
    timeoutRef.current = undefined;
    intervalRef.current = undefined;
  };

  useEffect(() => {
    if (phase !== 'pending') {
      clearTimers();
      return () => undefined;
    }

    const resolvedDuration = toDuration(durationMs);
    startedAtRef.current = Date.now();
    setRemainingMs(resolvedDuration);

    timeoutRef.current = window.setTimeout(() => {
      clearTimers();
      if (commitCalledRef.current) {
        return;
      }
      commitCalledRef.current = true;
      setPhase('committed');
      onCommit?.();
      if (autoDismissOnCommit) {
        onDismiss?.();
      }
    }, resolvedDuration);

    intervalRef.current = window.setInterval(() => {
      if (startedAtRef.current === undefined) {
        return;
      }
      const elapsedMs = Date.now() - startedAtRef.current;
      setRemainingMs(Math.max(0, resolvedDuration - elapsedMs));
    }, TICK_INTERVAL_MS);

    return () => {
      clearTimers();
    };
  }, [autoDismissOnCommit, durationMs, onCommit, onDismiss, phase]);

  const handleUndo = () => {
    if (phase !== 'pending') {
      return;
    }
    clearTimers();
    setPhase('undone');
    onUndo?.();
    if (autoDismissOnUndo) {
      onDismiss?.();
    }
  };

  const phaseStatusText =
    phase === 'committed'
      ? resolvedLabels.committedState
      : phase === 'undone'
        ? resolvedLabels.undoneState
        : undefined;

  const descriptionContent =
    description || phaseStatusText ? (
      <div className="itdo-undo-toast__description">
        {description && <div className="itdo-undo-toast__description-main">{description}</div>}
        {phaseStatusText && <p className="itdo-undo-toast__phase-state">{phaseStatusText}</p>}
      </div>
    ) : undefined;

  const action =
    phase === 'pending' ? (
      <Button
        type="button"
        size="small"
        variant="secondary"
        onClick={handleUndo}
        aria-label={resolvedLabels.undoAriaLabel(remainingSeconds)}
      >
        <span>{resolvedLabels.undo}</span>
        {showCountdown && (
          <span className="itdo-undo-toast__countdown">{resolvedLabels.countdownSuffix(remainingSeconds)}</span>
        )}
      </Button>
    ) : undefined;

  return (
    <div className={clsx('itdo-undo-toast', className)}>
      <Toast
        severity={severity}
        title={title}
        description={descriptionContent}
        action={action}
        dismissible
        ttl={phase === 'pending' ? toDuration(durationMs) : null}
        onClose={onDismiss}
      />
    </div>
  );
};
