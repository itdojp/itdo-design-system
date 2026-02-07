import React from 'react';
import clsx from 'clsx';
import { FilterBarProps } from './CrudList.types';
import { FilterChip } from './FilterChip';
import './CrudList.css';

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  actions,
  className,
  labels,
  search,
  filters,
  chips,
  logic,
  onClearAll,
  savedViews,
}) => {
  const resolvedLabels = {
    search: labels?.search ?? 'Search',
    savedView: labels?.savedView ?? 'Saved view',
    savedViewPlaceholder: labels?.savedViewPlaceholder ?? 'Select view',
    saveView: labels?.saveView ?? 'Save',
    clearAll: labels?.clearAll ?? 'Clear all',
    logicLabel: labels?.logicLabel ?? 'Logic',
    logicAriaLabel: labels?.logicAriaLabel ?? 'Filter logic',
    logicAnd: labels?.logicAnd ?? 'AND',
    logicOr: labels?.logicOr ?? 'OR',
  };

  const hasStructuredFilters =
    !!search || !!savedViews || !!logic || (filters !== undefined && filters.length > 0);
  const hasTopBarContent = hasStructuredFilters || !!children || !!actions;
  const hasChips = chips !== undefined && chips.length > 0;

  return (
    <section className={clsx('itdo-filter-bar', className)} aria-label="Filters">
      {hasTopBarContent && (
        <div className="itdo-filter-bar__row">
          <div className="itdo-filter-bar__fields">
            {search && (
              <label className="itdo-filter-bar__search">
                <span className="itdo-filter-bar__label">{resolvedLabels.search}</span>
                <input
                  value={search.value}
                  onChange={(event) => search.onChange(event.target.value)}
                  placeholder={search.placeholder}
                  aria-label={search.ariaLabel ?? resolvedLabels.search}
                  className="itdo-filter-bar__search-input"
                />
              </label>
            )}

            {savedViews && (
              <label className="itdo-filter-bar__saved-view">
                <span className="itdo-filter-bar__label">{resolvedLabels.savedView}</span>
                <div className="itdo-filter-bar__saved-view-controls">
                  <select
                    value={savedViews.selectedId ?? ''}
                    onChange={(event) => savedViews.onSelect(event.target.value)}
                    aria-label={savedViews.ariaLabel ?? resolvedLabels.savedView}
                    className="itdo-filter-bar__saved-view-select"
                  >
                    <option value="">{resolvedLabels.savedViewPlaceholder}</option>
                    {savedViews.items.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {savedViews.onSave && (
                    <button type="button" onClick={savedViews.onSave} className="itdo-filter-bar__saved-view-save">
                      {resolvedLabels.saveView}
                    </button>
                  )}
                </div>
              </label>
            )}

            {logic && (
              <div
                className="itdo-filter-bar__logic"
                role="group"
                aria-label={logic.ariaLabel ?? resolvedLabels.logicAriaLabel}
              >
                <span className="itdo-filter-bar__label">{resolvedLabels.logicLabel}</span>
                <div className="itdo-filter-bar__logic-controls">
                  <button
                    type="button"
                    aria-pressed={logic.value === 'and'}
                    className={clsx('itdo-filter-bar__logic-button', {
                      'is-active': logic.value === 'and',
                    })}
                    onClick={() => logic.onChange('and')}
                  >
                    {resolvedLabels.logicAnd}
                  </button>
                  <button
                    type="button"
                    aria-pressed={logic.value === 'or'}
                    className={clsx('itdo-filter-bar__logic-button', {
                      'is-active': logic.value === 'or',
                    })}
                    onClick={() => logic.onChange('or')}
                  >
                    {resolvedLabels.logicOr}
                  </button>
                </div>
              </div>
            )}

            {filters?.map((filter) => (
              <div key={filter.key} className="itdo-filter-bar__control">
                <span className="itdo-filter-bar__label">{filter.label}</span>
                {filter.control}
              </div>
            ))}

            {children}
          </div>
          {actions && <div className="itdo-filter-bar__actions">{actions}</div>}
        </div>
      )}

      {(hasChips || onClearAll) && (
        <div className="itdo-filter-bar__chips-row">
          <div className="itdo-filter-bar__chips">
            {chips?.map((chip) => (
              <FilterChip key={chip.key} label={chip.label} onRemove={chip.onRemove} />
            ))}
          </div>
          {onClearAll && (
            <button type="button" className="itdo-filter-bar__clear-all" onClick={onClearAll}>
              {resolvedLabels.clearAll}
            </button>
          )}
        </div>
      )}
    </section>
  );
};
