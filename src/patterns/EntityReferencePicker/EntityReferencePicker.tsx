import { useEffect, useId, useMemo, useState } from 'react';
import clsx from 'clsx';
import type {
  EntityReferenceCandidate,
  EntityReferenceItem,
  EntityReferencePickerProps,
  EntityReferenceValue,
} from './EntityReferencePicker.types';
import './EntityReferencePicker.css';

const toItemKey = (value: Pick<EntityReferenceItem, 'id' | 'kind'>) => `${value.kind}:${value.id}`;

const normalizeSelection = (value: EntityReferenceValue, multiple: boolean): EntityReferenceItem[] => {
  if (Array.isArray(value)) {
    return multiple ? value : value.slice(0, 1);
  }
  if (value) {
    return [value];
  }
  return [];
};

const toValueShape = (items: EntityReferenceItem[], multiple: boolean): EntityReferenceValue =>
  multiple ? items : items[0] ?? null;

const defaultRenderLabel = (entity: EntityReferenceCandidate) => entity.label ?? entity.id;

const normalizeCandidateText = (entity: EntityReferenceCandidate, label: string) =>
  `${entity.id} ${label}`.toLowerCase();

export const EntityReferencePicker = ({
  kinds,
  scope,
  fetchCandidates,
  value,
  onChange,
  renderLabel = defaultRenderLabel,
  toDeepLink,
  multiple = false,
  maxItems,
  label = 'Reference',
  placeholder = 'Search references',
  noResultsText = 'No matching reference found.',
  loadingText = 'Loading references...',
  hint,
  error,
  disabled = false,
  readOnly = false,
  searchDebounceMs = 180,
  className,
}: EntityReferencePickerProps) => {
  const listId = useId();
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState<EntityReferenceCandidate[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | undefined>(undefined);

  const selectedItems = useMemo(() => normalizeSelection(value, multiple), [multiple, value]);
  const selectedKeys = useMemo(
    () => new Set(selectedItems.map((item) => toItemKey(item))),
    [selectedItems]
  );

  const maxReached = Boolean(multiple && maxItems !== undefined && selectedItems.length >= maxItems);

  useEffect(() => {
    const normalizedQuery = query.trim();
    if (normalizedQuery.length === 0 || disabled || readOnly) {
      setCandidates([]);
      setIsLoading(false);
      setFetchError(undefined);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setFetchError(undefined);

    const timer = window.setTimeout(async () => {
      try {
        const responses = await Promise.all(
          kinds.map(async (kind) => {
            const response = await fetchCandidates(normalizedQuery, kind, scope);
            return response;
          })
        );

        if (cancelled) {
          return;
        }

        const merged = responses.flat();
        const filtered = merged.filter((candidate) => {
          const labelText = renderLabel(candidate);
          return normalizeCandidateText(candidate, labelText).includes(normalizedQuery.toLowerCase());
        });

        setCandidates(filtered);
        setActiveIndex(0);
      } catch (unknownError) {
        if (cancelled) {
          return;
        }
        setCandidates([]);
        setFetchError('Failed to load candidates.');
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }, searchDebounceMs);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [disabled, fetchCandidates, kinds, query, readOnly, renderLabel, scope, searchDebounceMs]);

  const visibleCandidates = useMemo(
    () => candidates.filter((candidate) => !selectedKeys.has(toItemKey(candidate))),
    [candidates, selectedKeys]
  );
  const clampedActiveIndex =
    visibleCandidates.length > 0 ? Math.min(activeIndex, visibleCandidates.length - 1) : 0;

  useEffect(() => {
    setActiveIndex((previous) => {
      if (visibleCandidates.length === 0) {
        return 0;
      }
      return Math.min(previous, visibleCandidates.length - 1);
    });
  }, [visibleCandidates.length]);

  const resolvedError = error ?? fetchError;
  const helperMessage = resolvedError ?? (maxReached ? `Up to ${maxItems} items can be selected.` : hint);
  const canInteract = !(disabled || readOnly);
  const showList = canInteract && query.trim().length > 0;
  const showOptions = showList && !isLoading && visibleCandidates.length > 0;
  const showStatus = showList && (isLoading || visibleCandidates.length === 0);
  const activeOptionId =
    showOptions ? `${listId}-option-${clampedActiveIndex}` : undefined;

  const emitNextValue = (nextItems: EntityReferenceItem[]) => {
    onChange(toValueShape(nextItems, multiple));
  };

  const selectCandidate = (candidate: EntityReferenceCandidate) => {
    if (!canInteract || maxReached) {
      return;
    }

    const nextItem: EntityReferenceItem = {
      id: candidate.id,
      kind: candidate.kind,
      label: renderLabel(candidate),
      deepLink: toDeepLink?.(candidate) ?? candidate.deepLink,
    };

    if (multiple) {
      if (selectedKeys.has(toItemKey(nextItem))) {
        return;
      }
      emitNextValue([...selectedItems, nextItem]);
    } else {
      emitNextValue([nextItem]);
    }

    setQuery('');
    setCandidates([]);
    setActiveIndex(0);
  };

  const removeSelected = (item: EntityReferenceItem) => {
    if (!canInteract) {
      return;
    }
    const nextItems = selectedItems.filter((current) => toItemKey(current) !== toItemKey(item));
    emitNextValue(nextItems);
  };

  return (
    <section
      className={clsx(
        'itdo-entity-reference-picker',
        {
          'itdo-entity-reference-picker--disabled': disabled,
          'itdo-entity-reference-picker--readonly': !disabled && readOnly,
          'itdo-entity-reference-picker--error': Boolean(resolvedError),
        },
        className
      )}
    >
      <label className="itdo-entity-reference-picker__label" htmlFor={listId}>
        {label}
      </label>
      <input
        id={listId}
        type="text"
        role="combobox"
        className="itdo-entity-reference-picker__input"
        placeholder={placeholder}
        value={query}
        aria-expanded={showList}
        aria-controls={showOptions ? `${listId}-listbox` : undefined}
        aria-activedescendant={activeOptionId}
        aria-invalid={Boolean(resolvedError) || undefined}
        disabled={disabled}
        readOnly={readOnly}
        onChange={(event) => setQuery(event.currentTarget.value)}
        onKeyDown={(event) => {
          if (!showList || visibleCandidates.length === 0) {
            if (
              event.key === 'Backspace' &&
              multiple &&
              query.length === 0 &&
              selectedItems.length > 0 &&
              canInteract
            ) {
              removeSelected(selectedItems[selectedItems.length - 1]);
            }
            return;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setActiveIndex((previous) => (previous + 1) % visibleCandidates.length);
            return;
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setActiveIndex(
              (previous) => (previous - 1 + visibleCandidates.length) % visibleCandidates.length
            );
            return;
          }

          if (event.key === 'Enter') {
            event.preventDefault();
            const selectedCandidate = visibleCandidates[clampedActiveIndex];
            if (selectedCandidate) {
              selectCandidate(selectedCandidate);
            }
            return;
          }

          if (event.key === 'Escape') {
            event.preventDefault();
            setQuery('');
            setCandidates([]);
          }
        }}
      />

      {showOptions && (
        <ul
          id={`${listId}-listbox`}
          className="itdo-entity-reference-picker__listbox"
          role="listbox"
          aria-label={`${label} candidates`}
        >
          {visibleCandidates.map((candidate, index) => {
            const candidateLabel = renderLabel(candidate);
            const isActive = index === clampedActiveIndex;
            return (
              <li
                key={toItemKey(candidate)}
                id={`${listId}-option-${index}`}
                className={clsx(
                  'itdo-entity-reference-picker__option-item',
                  'itdo-entity-reference-picker__option',
                  { 'is-active': isActive }
                )}
                role="option"
                aria-selected={isActive}
                aria-disabled={maxReached || undefined}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectCandidate(candidate)}
              >
                <span className="itdo-entity-reference-picker__option-main">
                  <span className="itdo-entity-reference-picker__option-label">{candidateLabel}</span>
                  <span className="itdo-entity-reference-picker__option-id">{candidate.id}</span>
                </span>
                <span className="itdo-entity-reference-picker__kind">{candidate.kind}</span>
              </li>
            );
          })}
        </ul>
      )}
      {showStatus && (
        <div className="itdo-entity-reference-picker__status-surface">
          <p className="itdo-entity-reference-picker__status" role="status">
            {isLoading ? loadingText : noResultsText}
          </p>
        </div>
      )}

      {selectedItems.length > 0 && (
        <ul className="itdo-entity-reference-picker__selection" aria-label="Selected references">
          {selectedItems.map((item) => (
            <li key={toItemKey(item)} className="itdo-entity-reference-picker__pill">
              {item.deepLink ? (
                <a
                  className="itdo-entity-reference-picker__link"
                  href={item.deepLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <span className="itdo-entity-reference-picker__text">{item.label}</span>
              )}
              <span className="itdo-entity-reference-picker__kind">{item.kind}</span>
              <button
                type="button"
                className="itdo-entity-reference-picker__remove"
                aria-label={`Remove ${item.label}`}
                disabled={!canInteract}
                onClick={() => removeSelected(item)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {helperMessage && (
        <p
          className={clsx('itdo-entity-reference-picker__message', {
            'itdo-entity-reference-picker__message--error': Boolean(resolvedError),
          })}
          role={resolvedError ? 'alert' : undefined}
        >
          {helperMessage}
        </p>
      )}
    </section>
  );
};
