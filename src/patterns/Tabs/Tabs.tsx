import React, { useEffect, useId, useMemo, useState } from 'react';
import clsx from 'clsx';
import { TabItem, TabsProps } from './Tabs.types';
import './Tabs.css';

const findNextEnabledIndex = (
  items: TabItem[],
  currentIndex: number,
  direction: 1 | -1
) => {
  const total = items.length;
  if (total === 0) return -1;

  for (let step = 1; step <= total; step += 1) {
    const nextIndex = (currentIndex + step * direction + total) % total;
    if (!items[nextIndex].disabled) {
      return nextIndex;
    }
  }

  return currentIndex;
};

export const Tabs: React.FC<TabsProps> = ({
  items,
  value,
  defaultValue,
  onValueChange,
  ariaLabel = 'Tabs',
  className,
  listClassName,
  panelClassName,
  variant = 'line',
  fullWidth = false,
  renderPanel,
}) => {
  const isControlled = value !== undefined;
  const tabSetId = useId();
  const enabledItems = useMemo(() => items.filter((item) => !item.disabled), [items]);

  const initialValue = useMemo(() => {
    if (defaultValue && enabledItems.some((item) => item.id === defaultValue)) {
      return defaultValue;
    }
    return enabledItems[0]?.id ?? null;
  }, [defaultValue, enabledItems]);

  const [internalValue, setInternalValue] = useState<string | null>(() => initialValue);
  const activeValue = isControlled ? value ?? null : internalValue;

  useEffect(() => {
    if (!activeValue) return;
    const exists = enabledItems.some((item) => item.id === activeValue);
    if (exists) return;

    const fallbackValue = enabledItems[0]?.id ?? null;
    if (!isControlled) {
      setInternalValue(fallbackValue);
    }
    if (fallbackValue !== null && fallbackValue !== activeValue) {
      onValueChange?.(fallbackValue);
    }
  }, [activeValue, enabledItems, isControlled, onValueChange]);

  const activeItem = useMemo(() => {
    if (enabledItems.length === 0) {
      return null;
    }

    const matched = enabledItems.find((item) => item.id === activeValue);
    return matched ?? enabledItems[0] ?? null;
  }, [activeValue, enabledItems]);

  const activeTabId = activeItem?.id ?? null;
  const hasRenderablePanel = activeItem !== null && (renderPanel !== undefined || activeItem.panel !== undefined);

  const selectTab = (nextValue: string) => {
    const target = items.find((item) => item.id === nextValue);
    if (!target || target.disabled) return;

    if (!isControlled) {
      setInternalValue(nextValue);
    }

    if (nextValue !== activeValue) {
      onValueChange?.(nextValue);
    }
  };

  const focusTabByIndex = (index: number) => {
    const nextItem = items[index];
    if (!nextItem) return;
    const nextTabId = `${tabSetId}-tab-${nextItem.id}`;
    const nextTab = document.getElementById(nextTabId);
    nextTab?.focus();
    selectTab(nextItem.id);
  };

  return (
    <div className={clsx('itdo-tabs', `itdo-tabs--${variant}`, className)}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={clsx('itdo-tabs__list', { 'itdo-tabs__list--full': fullWidth }, listClassName)}
      >
        {items.map((item, index) => {
          const isActive = item.id === activeTabId;
          const tabId = `${tabSetId}-tab-${item.id}`;
          const panelId = `${tabSetId}-panel-${item.id}`;

          return (
            <button
              key={item.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={isActive && hasRenderablePanel ? panelId : undefined}
              tabIndex={isActive ? 0 : -1}
              className={clsx('itdo-tabs__tab', { 'is-active': isActive })}
              disabled={item.disabled}
              onClick={() => selectTab(item.id)}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight') {
                  event.preventDefault();
                  const nextIndex = findNextEnabledIndex(items, index, 1);
                  focusTabByIndex(nextIndex);
                  return;
                }

                if (event.key === 'ArrowLeft') {
                  event.preventDefault();
                  const nextIndex = findNextEnabledIndex(items, index, -1);
                  focusTabByIndex(nextIndex);
                  return;
                }

                if (event.key === 'Home') {
                  event.preventDefault();
                  const nextIndex = items.findIndex((tabItem) => !tabItem.disabled);
                  if (nextIndex >= 0) {
                    focusTabByIndex(nextIndex);
                  }
                  return;
                }

                if (event.key === 'End') {
                  event.preventDefault();
                  const nextIndex = [...items].reverse().findIndex((tabItem) => !tabItem.disabled);
                  if (nextIndex >= 0) {
                    focusTabByIndex(items.length - 1 - nextIndex);
                  }
                }
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {activeItem && hasRenderablePanel && (
        <div
          id={`${tabSetId}-panel-${activeItem.id}`}
          role="tabpanel"
          aria-labelledby={`${tabSetId}-tab-${activeItem.id}`}
          className={clsx('itdo-tabs__panel', panelClassName)}
        >
          {renderPanel ? renderPanel(activeItem) : activeItem.panel}
        </div>
      )}
    </div>
  );
};
