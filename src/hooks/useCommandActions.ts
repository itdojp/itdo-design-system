import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CommandPaletteAction,
  CommandPaletteResolvedAction,
} from '../patterns/CommandPalette/CommandPalette.types';

export interface UseCommandActionsOptions {
  actions: CommandPaletteAction[];
  maxResults?: number;
  recentLimit?: number;
  recentStorageKey?: string;
}

export interface UseCommandActionsResult {
  query: string;
  setQuery: (query: string) => void;
  results: CommandPaletteResolvedAction[];
  markRecent: (actionId: string) => void;
  clearRecent: () => void;
}

const DEFAULT_RECENT_STORAGE_KEY = 'itdo-command-palette-recent';

const loadRecentIds = (storageKey: string): string[] => {
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

    return parsed.filter((value): value is string => typeof value === 'string');
  } catch {
    return [];
  }
};

const persistRecentIds = (storageKey: string, ids: string[]) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify(ids));
  } catch {
    // Ignore storage write failures in private mode / restricted environments.
  }
};

const scoreAction = (action: CommandPaletteAction, normalizedQuery: string): number => {
  if (!normalizedQuery) {
    return 1;
  }

  const label = action.label.toLowerCase();
  const description = action.description?.toLowerCase() ?? '';
  const group = action.group?.toLowerCase() ?? '';
  const keywords = action.keywords?.join(' ').toLowerCase() ?? '';

  if (label.startsWith(normalizedQuery)) {
    return 100;
  }

  if (label.includes(normalizedQuery)) {
    return 70;
  }

  if (keywords.includes(normalizedQuery)) {
    return 45;
  }

  if (description.includes(normalizedQuery) || group.includes(normalizedQuery)) {
    return 30;
  }

  return 0;
};

export const useCommandActions = ({
  actions,
  maxResults = 20,
  recentLimit = 8,
  recentStorageKey = DEFAULT_RECENT_STORAGE_KEY,
}: UseCommandActionsOptions): UseCommandActionsResult => {
  const [query, setQuery] = useState('');
  const [recentIds, setRecentIds] = useState<string[]>(() => loadRecentIds(recentStorageKey));

  useEffect(() => {
    setRecentIds(loadRecentIds(recentStorageKey));
  }, [recentStorageKey]);

  const markRecent = useCallback(
    (actionId: string) => {
      setRecentIds((previous) => {
        const next = [actionId, ...previous.filter((id) => id !== actionId)].slice(0, recentLimit);
        persistRecentIds(recentStorageKey, next);
        return next;
      });
    },
    [recentLimit, recentStorageKey]
  );

  const clearRecent = useCallback(() => {
    setRecentIds([]);
    persistRecentIds(recentStorageKey, []);
  }, [recentStorageKey]);

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const actionMap = new Map(actions.map((action) => [action.id, action]));
    const recentSet = new Set(recentIds);

    if (!normalizedQuery) {
      const recentActions = recentIds
        .map((id) => actionMap.get(id))
        .filter((action): action is CommandPaletteAction => action !== undefined)
        .map((action) => ({ ...action, isRecent: true }));

      const remainingActions = actions
        .filter((action) => !recentSet.has(action.id))
        .map((action) => ({ ...action, isRecent: false }));

      return [...recentActions, ...remainingActions].slice(0, maxResults);
    }

    return actions
      .map((action) => ({
        action,
        score: scoreAction(action, normalizedQuery),
      }))
      .filter(({ score }) => score > 0)
      .sort((left, right) => {
        if (left.score !== right.score) {
          return right.score - left.score;
        }

        return left.action.label.localeCompare(right.action.label);
      })
      .slice(0, maxResults)
      .map(({ action }) => ({
        ...action,
        isRecent: recentSet.has(action.id),
      }));
  }, [actions, maxResults, query, recentIds]);

  return {
    query,
    setQuery,
    results,
    markRecent,
    clearRecent,
  };
};
