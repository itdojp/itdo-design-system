import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { DraftAutosaveAdapter, DraftConflictPayload, DraftSnapshot } from '../types';

export type DraftAutosaveStatus = 'idle' | 'saving' | 'saved' | 'error' | 'conflict';

export interface UseDraftAutosaveOptions<TData = Record<string, unknown>> {
  value: TData;
  adapter: DraftAutosaveAdapter<TData>;
  onRestore: (payload: TData) => void;
  enabled?: boolean;
  intervalMs?: number;
  now?: () => string;
  onConflict?: (payload: DraftConflictPayload<TData>) => void;
}

export interface UseDraftAutosaveResult<TData = Record<string, unknown>> {
  status: DraftAutosaveStatus;
  isDirty: boolean;
  hasRestorableDraft: boolean;
  restorableDraft?: DraftSnapshot<TData>;
  conflict?: DraftConflictPayload<TData>;
  lastSavedAt?: string;
  errorMessage?: string;
  saveNow: () => Promise<void>;
  restoreDraft: () => void;
  clearDraft: () => Promise<void>;
}

export const hashDraftValue = (value: unknown): string => {
  try {
    return JSON.stringify(value) ?? '';
  } catch {
    return String(value);
  }
};

const isDraftSnapshot = <TData,>(value: unknown): value is DraftSnapshot<TData> => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Partial<DraftSnapshot<TData>>;
  return (
    Number.isFinite(record.revision) &&
    typeof record.savedAt === 'string' &&
    typeof record.hash === 'string' &&
    Object.prototype.hasOwnProperty.call(record, 'payload')
  );
};

export const createLocalStorageDraftAutosaveAdapter = <TData = Record<string, unknown>>(
  storageKey = 'itdo-draft-autosave'
): DraftAutosaveAdapter<TData> => ({
  async load() {
    if (typeof window === 'undefined') {
      return null;
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!isDraftSnapshot<TData>(parsed)) {
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  },
  async save(snapshot) {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(snapshot));
    } catch {
      // Ignore write failures in restricted environments.
    }
  },
  async clear() {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore removal failures in restricted environments.
    }
  },
});

export const useDraftAutosave = <TData = Record<string, unknown>>({
  value,
  adapter,
  onRestore,
  enabled = true,
  intervalMs = 15000,
  now = () => new Date().toISOString(),
  onConflict,
}: UseDraftAutosaveOptions<TData>): UseDraftAutosaveResult<TData> => {
  const [status, setStatus] = useState<DraftAutosaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [restorableDraft, setRestorableDraft] = useState<DraftSnapshot<TData> | undefined>(undefined);
  const [conflict, setConflict] = useState<DraftConflictPayload<TData> | undefined>(undefined);
  const [isReady, setIsReady] = useState(false);

  const valueHash = useMemo(() => hashDraftValue(value), [value]);
  const valueRef = useRef(value);
  const revisionRef = useRef(0);
  const persistedHashRef = useRef(valueHash);

  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  useEffect(() => {
    let mounted = true;
    if (!enabled) {
      setIsReady(true);
      return () => {
        mounted = false;
      };
    }

    void adapter
      .load()
      .then((snapshot) => {
        if (!mounted) {
          return;
        }

        if (!snapshot) {
          persistedHashRef.current = hashDraftValue(valueRef.current);
          setIsReady(true);
          return;
        }

        revisionRef.current = snapshot.revision;
        if (snapshot.hash === hashDraftValue(valueRef.current)) {
          persistedHashRef.current = snapshot.hash;
          setLastSavedAt(snapshot.savedAt);
          setStatus('saved');
        } else {
          setRestorableDraft(snapshot);
          setStatus('idle');
        }
        setIsReady(true);
      })
      .catch((error) => {
        if (!mounted) {
          return;
        }
        setErrorMessage(error instanceof Error ? error.message : 'Failed to load draft.');
        setStatus('error');
        setIsReady(true);
      });

    return () => {
      mounted = false;
    };
  }, [adapter, enabled]);

  const saveNow = useCallback(async () => {
    if (!enabled || !isReady) {
      return;
    }

    const nextPayload = valueRef.current;
    const nextHash = hashDraftValue(nextPayload);

    setStatus('saving');
    setErrorMessage(undefined);

    try {
      const remote = await adapter.load();
      const remoteRevision = remote?.revision ?? 0;

      if (remote && remoteRevision > revisionRef.current && remote.hash !== nextHash) {
        const localSnapshot: DraftSnapshot<TData> = {
          payload: nextPayload,
          hash: nextHash,
          revision: revisionRef.current,
          savedAt: now(),
        };

        const payload: DraftConflictPayload<TData> = {
          local: localSnapshot,
          remote,
        };

        setConflict(payload);
        setStatus('conflict');
        onConflict?.(payload);
        return;
      }

      const savedAt = now();
      const nextRevision = Math.max(revisionRef.current, remoteRevision) + 1;
      const snapshot: DraftSnapshot<TData> = {
        payload: nextPayload,
        hash: nextHash,
        revision: nextRevision,
        savedAt,
      };

      await adapter.save(snapshot);
      revisionRef.current = nextRevision;
      persistedHashRef.current = nextHash;
      setLastSavedAt(savedAt);
      setConflict(undefined);
      setRestorableDraft(undefined);
      setStatus('saved');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save draft.');
      setStatus('error');
    }
  }, [adapter, enabled, isReady, now, onConflict]);

  useEffect(() => {
    if (!enabled || !isReady || status === 'conflict' || status === 'error') {
      return;
    }

    const timer = setInterval(() => {
      const nextHash = hashDraftValue(valueRef.current);
      if (nextHash === persistedHashRef.current) {
        return;
      }
      void saveNow();
    }, intervalMs);

    return () => {
      clearInterval(timer);
    };
  }, [enabled, intervalMs, isReady, saveNow, status]);

  const restoreDraft = useCallback(() => {
    if (!restorableDraft) {
      return;
    }

    onRestore(restorableDraft.payload);
    revisionRef.current = restorableDraft.revision;
    persistedHashRef.current = restorableDraft.hash;
    setLastSavedAt(restorableDraft.savedAt);
    setRestorableDraft(undefined);
    setStatus('saved');
  }, [onRestore, restorableDraft]);

  const clearDraft = useCallback(async () => {
    await adapter.clear();
    revisionRef.current = 0;
    persistedHashRef.current = hashDraftValue(valueRef.current);
    setLastSavedAt(undefined);
    setConflict(undefined);
    setRestorableDraft(undefined);
    setStatus('idle');
    setErrorMessage(undefined);
  }, [adapter]);

  return {
    status,
    isDirty: valueHash !== persistedHashRef.current,
    hasRestorableDraft: !!restorableDraft,
    restorableDraft,
    conflict,
    lastSavedAt,
    errorMessage,
    saveNow,
    restoreDraft,
    clearDraft,
  };
};
