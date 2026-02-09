import { useCallback, useEffect, useMemo, useState } from 'react';
import { SavedViewRecord, SavedViewsStorageAdapter } from '../types';

export interface UseSavedViewsOptions<TPayload = Record<string, unknown>> {
  initialViews?: SavedViewRecord<TPayload>[];
  initialActiveViewId?: string;
  storageAdapter?: SavedViewsStorageAdapter<TPayload>;
  createId?: () => string;
  now?: () => string;
  shareBasePath?: string;
}

export interface UseSavedViewsResult<TPayload = Record<string, unknown>> {
  views: SavedViewRecord<TPayload>[];
  activeViewId?: string;
  activeView?: SavedViewRecord<TPayload>;
  selectView: (viewId?: string) => void;
  createView: (name: string, payload: TPayload) => SavedViewRecord<TPayload>;
  updateView: (viewId: string, next: Partial<Pick<SavedViewRecord<TPayload>, 'name' | 'payload'>>) => void;
  duplicateView: (viewId: string, nextName?: string) => SavedViewRecord<TPayload> | undefined;
  deleteView: (viewId: string) => void;
  toggleShared: (viewId: string, shared?: boolean) => void;
  getShareLink: (viewId: string) => string;
}

const defaultCreateId = () => `saved-view-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const defaultNow = () => new Date().toISOString();

const normalizeName = (name: string) => name.trim();

export const createLocalStorageSavedViewsAdapter = <TPayload = Record<string, unknown>>(
  storageKey = 'itdo-saved-views'
): SavedViewsStorageAdapter<TPayload> => ({
  async load() {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return [];
      }

      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) {
        return [];
      }

      return parsed as SavedViewRecord<TPayload>[];
    } catch {
      return [];
    }
  },
  async save(views) {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(views));
    } catch {
      // Ignore write errors in restricted environments.
    }
  },
});

export const useSavedViews = <TPayload = Record<string, unknown>>({
  initialViews = [],
  initialActiveViewId,
  storageAdapter,
  createId = defaultCreateId,
  now = defaultNow,
  shareBasePath = '/?savedView=',
}: UseSavedViewsOptions<TPayload> = {}): UseSavedViewsResult<TPayload> => {
  const [views, setViews] = useState<SavedViewRecord<TPayload>[]>(initialViews);
  const [activeViewId, setActiveViewId] = useState<string | undefined>(initialActiveViewId);

  const persist = useCallback(
    (nextViews: SavedViewRecord<TPayload>[]) => {
      if (!storageAdapter) {
        return;
      }
      void storageAdapter.save(nextViews);
    },
    [storageAdapter]
  );

  useEffect(() => {
    if (!storageAdapter) {
      return;
    }

    let mounted = true;
    void storageAdapter.load().then((loadedViews) => {
      if (!mounted || loadedViews.length === 0) {
        return;
      }

      setViews(loadedViews);
      setActiveViewId((previous) => previous ?? loadedViews[0]?.id);
    });

    return () => {
      mounted = false;
    };
  }, [storageAdapter]);

  const selectView = useCallback((viewId?: string) => {
    setActiveViewId(viewId);
  }, []);

  const createView = useCallback(
    (name: string, payload: TPayload) => {
      const normalizedName = normalizeName(name);
      if (!normalizedName) {
        throw new Error('Saved view name is required.');
      }

      const timestamp = now();
      const nextView: SavedViewRecord<TPayload> = {
        id: createId(),
        name: normalizedName,
        payload,
        shared: false,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      setViews((previous) => {
        const next = [...previous, nextView];
        persist(next);
        return next;
      });
      setActiveViewId(nextView.id);
      return nextView;
    },
    [createId, now, persist]
  );

  const updateView = useCallback(
    (viewId: string, next: Partial<Pick<SavedViewRecord<TPayload>, 'name' | 'payload'>>) => {
      setViews((previous) => {
        const updated = previous.map((view) => {
          if (view.id !== viewId) {
            return view;
          }

          const resolvedName = next.name !== undefined ? normalizeName(next.name) : view.name;
          return {
            ...view,
            name: resolvedName || view.name,
            payload: next.payload ?? view.payload,
            updatedAt: now(),
          };
        });
        persist(updated);
        return updated;
      });
    },
    [now, persist]
  );

  const duplicateView = useCallback(
    (viewId: string, nextName?: string) => {
      const source = views.find((view) => view.id === viewId);
      if (!source) {
        return undefined;
      }

      const fallbackName = `${source.name} (copy)`;
      return createView(nextName ?? fallbackName, source.payload);
    },
    [createView, views]
  );

  const deleteView = useCallback(
    (viewId: string) => {
      setViews((previous) => {
        const next = previous.filter((view) => view.id !== viewId);
        persist(next);
        return next;
      });

      setActiveViewId((previous) => (previous === viewId ? undefined : previous));
    },
    [persist]
  );

  const toggleShared = useCallback(
    (viewId: string, shared?: boolean) => {
      setViews((previous) => {
        const next = previous.map((view) => {
          if (view.id !== viewId) {
            return view;
          }

          const nextShared = shared ?? !view.shared;
          return {
            ...view,
            shared: nextShared,
            updatedAt: now(),
          };
        });

        persist(next);
        return next;
      });
    },
    [now, persist]
  );

  const activeView = useMemo(
    () => views.find((view) => view.id === activeViewId),
    [activeViewId, views]
  );

  const getShareLink = useCallback(
    (viewId: string) => `${shareBasePath}${encodeURIComponent(viewId)}`,
    [shareBasePath]
  );

  return {
    views,
    activeViewId,
    activeView,
    selectView,
    createView,
    updateView,
    duplicateView,
    deleteView,
    toggleShared,
    getShareLink,
  };
};
