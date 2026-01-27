import { useCallback, useEffect, useRef, useState } from 'react';

export type ClipboardStatus = 'idle' | 'success' | 'error' | 'timeout';

export interface ClipboardState {
  status: ClipboardStatus;
  error?: Error;
  isSupported: boolean;
  copy: (text: string) => Promise<boolean>;
  reset: () => void;
}

const fallbackCopy = async (text: string) => {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return success;
};

export const useClipboard = (timeoutMs = 2000): ClipboardState => {
  const [status, setStatus] = useState<ClipboardStatus>('idle');
  const [error, setError] = useState<Error | undefined>(undefined);
  const timeoutRef = useRef<number | null>(null);

  const isSupported = typeof navigator !== 'undefined' &&
    (!!navigator.clipboard || document.queryCommandSupported?.('copy'));

  const reset = useCallback(() => {
    setStatus('idle');
    setError(undefined);
  }, []);

  useEffect(() => () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  const copy = useCallback(async (text: string) => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    try {
      let success = false;
      if (navigator?.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        success = true;
      } else {
        success = await fallbackCopy(text);
      }

      if (!success) {
        throw new Error('Copy failed');
      }

      setStatus('success');
      setError(undefined);

      if (timeoutMs > 0) {
        timeoutRef.current = window.setTimeout(() => {
          setStatus('timeout');
        }, timeoutMs);
      }

      return true;
    } catch (err) {
      const errorValue = err instanceof Error ? err : new Error('Copy failed');
      setStatus('error');
      setError(errorValue);
      return false;
    }
  }, [timeoutMs]);

  return {
    status,
    error,
    isSupported,
    copy,
    reset,
  };
};
