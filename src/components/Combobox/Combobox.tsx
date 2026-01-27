import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Input } from '../Input';
import { Popover } from '../Popover';
import { ComboboxItem, ComboboxProps } from './Combobox.types';
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

  useEffect(() => {
    if (items) setInternalItems(items);
  }, [items]);

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

  const displayItems = items ?? internalItems;
  const isLoading = loading ?? internalLoading;

  const setValue = (next: string) => {
    if (!isControlled) {
      setInternalValue(next);
    }
    onChange?.(next);
  };

  const handleSelect = (item: ComboboxItem) => {
    setValue(item.label);
    onSelect?.(item);
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      setOpen(true);
      return;
    }

    if (!open) return;

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
        {displayItems.map((item, index) => (
          <button
            key={item.id}
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
              <span className="itdo-combobox__label">{highlightText(item.label, query)}</span>
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
  }, [displayItems, activeIndex, emptyMessage, errorMessage, isLoading, loadError, listId, query]);

  return (
    <div className={clsx('itdo-combobox', className)}>
      <Input
        ref={inputRef}
        label={label}
        placeholder={placeholder}
        value={query}
        onChange={(event) => {
          setValue(event.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        size={size}
        aria-autocomplete="list"
        aria-controls={listId}
        aria-expanded={open}
        role="combobox"
        {...inputProps}
      />
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        anchorRef={inputRef}
        placement="bottom-start"
        autoFocus={false}
      >
        <div style={{ minWidth: anchorWidth }}>{listContent}</div>
      </Popover>
    </div>
  );
};
