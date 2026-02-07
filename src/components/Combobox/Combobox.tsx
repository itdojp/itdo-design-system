import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Input } from '../Input';
import { Popover } from '../Popover';
import { ComboboxItem, ComboboxProps } from './Combobox.types';
import type { ValidationState } from '../FormField/FormField.types';
import { resolveValidationMessage, resolveValidationState } from '../FormField/validation';
import './Combobox.css';

const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  const before = text.slice(0, index);
  const match = text.slice(index, index + query.length);
  const after = text.slice(index + query.length);
  return (
    <>
      {before}
      <mark className="itdo-combobox__highlight">{match}</mark>
      {after}
    </>
  );
};

export const Combobox: React.FC<ComboboxProps> = ({
  label,
  helpText,
  hint,
  description,
  placeholder,
  value,
  defaultValue,
  onChange,
  items,
  onSelect,
  loadOptions,
  debounceMs = 300,
  loading,
  emptyMessage = 'No results',
  errorMessage = 'Failed to load results',
  disabled = false,
  required = false,
  fullWidth = false,
  error,
  warning,
  success,
  validationState,
  validationMessage,
  size = 'medium',
  className,
  inputProps,
}) => {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? '');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [internalItems, setInternalItems] = useState<ComboboxItem[]>(items ?? []);
  const [internalLoading, setInternalLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [anchorWidth, setAnchorWidth] = useState<number | undefined>(undefined);

  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const query = isControlled ? value ?? '' : internalValue;

  const displayItems = items ?? internalItems;
  const isLoading = loading ?? internalLoading;
  const wasControlled = useRef(isControlled);
  const resolvedHelpText = hint ?? description ?? helpText;
  const explicitValidationState = resolveValidationState({
    validationState,
    error,
    warning,
    success,
  });
  const explicitValidationMessage = resolveValidationMessage(explicitValidationState, {
    validationMessage,
    error,
    warning,
    success,
  });
  const hasExplicitValidation =
    explicitValidationState !== 'none' || explicitValidationMessage !== undefined;

  let resolvedValidationState: ValidationState = explicitValidationState;
  let resolvedValidationMessage = explicitValidationMessage;

  if (!hasExplicitValidation) {
    if (open && loadError) {
      resolvedValidationState = 'error';
      resolvedValidationMessage = errorMessage;
    } else if (open && isLoading) {
      resolvedValidationState = 'validating';
      resolvedValidationMessage = 'Validating...';
    } else {
      resolvedValidationState = 'none';
      resolvedValidationMessage = undefined;
    }
  }

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' && wasControlled.current !== isControlled) {
      console.warn(
        'Combobox switched between controlled and uncontrolled mode. This is not recommended.'
      );
      wasControlled.current = isControlled;
    }
  }, [isControlled]);

  useEffect(() => {
    if (items) {
      setInternalItems(items);
      setActiveIndex(0);
    }
  }, [items]);

  useEffect(() => {
    if (displayItems.length === 0) {
      setActiveIndex(0);
    } else {
      setActiveIndex((prev) => Math.min(prev, displayItems.length - 1));
    }
  }, [displayItems.length]);

  useEffect(() => {
    if (!open) return;
    if (!inputRef.current) return;
    setAnchorWidth(inputRef.current.offsetWidth);
  }, [open]);

  useEffect(() => {
    if (!loadOptions) return;
    if (!open) return;

    let active = true;
    const handle = setTimeout(async () => {
      try {
        setInternalLoading(true);
        setLoadError(false);
        const result = await loadOptions(query);
        if (active) {
          setInternalItems(result);
          setActiveIndex(0);
        }
      } catch (error) {
        if (active) {
          setLoadError(true);
          if (process.env.NODE_ENV !== 'production') {
            const err = error as Error;
            console.error('Combobox loadOptions failed:', err?.message ?? err);
          }
        }
      } finally {
        if (active) {
          setInternalLoading(false);
        }
      }
    }, debounceMs);

    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [loadOptions, query, debounceMs, open]);

  const setValue = useCallback(
    (next: string) => {
      if (!isControlled) {
        setInternalValue(next);
      }
      onChange?.(next);
    },
    [isControlled, onChange]
  );

  const handleSelect = useCallback(
    (item: ComboboxItem) => {
      setValue(item.value ?? item.label);
      onSelect?.(item);
      setOpen(false);
    },
    [onSelect, setValue]
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }

    if (!open) return;

    if (displayItems.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, displayItems.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    if (event.key === 'Enter') {
      const item = displayItems[activeIndex];
      if (item) {
        event.preventDefault();
        handleSelect(item);
      }
    }

    if (event.key === 'Escape') {
      setOpen(false);
    }
  };

  const highlightedItems = useMemo(
    () =>
      displayItems.map((item) => ({
        item,
        highlightedLabel: highlightText(item.label, query),
      })),
    [displayItems, query]
  );

  const listContent = useMemo(() => {
    if (isLoading) {
      return <div className="itdo-combobox__status">Loading...</div>;
    }

    if (loadError) {
      return <div className="itdo-combobox__status itdo-combobox__status--error">{errorMessage}</div>;
    }

    if (displayItems.length === 0) {
      return <div className="itdo-combobox__status">{emptyMessage}</div>;
    }

    return (
      <div className="itdo-combobox__list" role="listbox" id={listId}>
        {highlightedItems.map(({ item, highlightedLabel }, index) => (
          <button
            key={item.id}
            id={`${listId}-option-${index}`}
            type="button"
            className={clsx('itdo-combobox__item', {
              'is-active': index === activeIndex,
            })}
            role="option"
            aria-selected={index === activeIndex}
            onMouseEnter={() => setActiveIndex(index)}
            onClick={() => handleSelect(item)}
          >
            <div className="itdo-combobox__item-main">
              <span className="itdo-combobox__label">{highlightedLabel}</span>
              {item.description && (
                <span className="itdo-combobox__description">{item.description}</span>
              )}
            </div>
            {item.badge && <span className="itdo-combobox__badge">{item.badge}</span>}
            {item.meta && <span className="itdo-combobox__meta">{item.meta}</span>}
          </button>
        ))}
      </div>
    );
  }, [
    activeIndex,
    displayItems.length,
    emptyMessage,
    errorMessage,
    highlightedItems,
    handleSelect,
    isLoading,
    listId,
    loadError,
  ]);

  const activeDescendant =
    open && displayItems[activeIndex] ? `${listId}-option-${activeIndex}` : undefined;

  return (
    <div className={clsx('itdo-combobox', className)}>
      <Input
        ref={inputRef}
        label={label}
        helpText={resolvedHelpText}
        placeholder={placeholder}
        value={query}
        onChange={(event) => {
          setValue(event.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        required={required}
        fullWidth={fullWidth}
        validationState={resolvedValidationState}
        validationMessage={resolvedValidationMessage}
        size={size}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open}
        aria-activedescendant={inputProps?.['aria-activedescendant'] ?? activeDescendant}
        role="combobox"
        {...inputProps}
      />
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={inputRef}
        placement="bottom-start"
        autoFocus={false}
        role="presentation"
      >
        <div style={{ minWidth: anchorWidth }}>{listContent}</div>
      </Popover>
    </div>
  );
};
