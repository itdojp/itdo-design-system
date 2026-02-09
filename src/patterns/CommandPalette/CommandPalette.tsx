import { useEffect, useId, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Dialog } from '../../components/Dialog';
import { useCommandActions } from '../../hooks/useCommandActions';
import { CommandActionEventPayload } from '../../types';
import {
  CommandPaletteAction,
  CommandPaletteProps,
  CommandPaletteResolvedAction,
} from './CommandPalette.types';
import './CommandPalette.css';

const DEFAULT_GROUP = 'General';
const RECENT_GROUP = 'Recent';

interface GroupedActions {
  label: string;
  items: Array<{
    index: number;
    action: CommandPaletteResolvedAction;
  }>;
}

const toGroupLabel = (action: CommandPaletteResolvedAction) => {
  if (action.isRecent) {
    return RECENT_GROUP;
  }

  const normalized = action.group?.trim();
  return normalized && normalized.length > 0 ? normalized : DEFAULT_GROUP;
};

const groupActions = (actions: CommandPaletteResolvedAction[]): GroupedActions[] => {
  const map = new Map<string, GroupedActions['items']>();

  actions.forEach((action, index) => {
    const key = toGroupLabel(action);
    const current = map.get(key) ?? [];
    current.push({ index, action });
    map.set(key, current);
  });

  return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
};

const executeAction = (
  action: CommandPaletteAction,
  query: string,
  onActionRun?: (action: CommandPaletteAction, payload: CommandActionEventPayload) => void
) => {
  const payload: CommandActionEventPayload = {
    actionId: action.id,
    label: action.label,
    group: action.group,
    query,
    triggeredAt: new Date().toISOString(),
  };

  action.onSelect?.(action);
  onActionRun?.(action, payload);
};

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onOpenChange,
  actions,
  title = 'Command Palette',
  placeholder = 'Type a command or keyword',
  emptyMessage = 'No commands found.',
  ariaLabel = 'Command list',
  className,
  maxResults = 20,
  hotkey = true,
  onActionRun,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();
  const [activeIndex, setActiveIndex] = useState(0);

  const { query, setQuery, results, markRecent } = useCommandActions({
    actions,
    maxResults,
  });

  const groupedActions = useMemo(() => groupActions(results), [results]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handle = window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 0);

    return () => {
      window.clearTimeout(handle);
    };
  }, [open]);

  useEffect(() => {
    setActiveIndex((previous) => {
      if (results.length === 0) {
        return 0;
      }
      return Math.min(previous, results.length - 1);
    });
  }, [results]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const selectedElement = document.querySelector<HTMLElement>(
      `[data-command-index='${activeIndex}']`
    );
    if (selectedElement && typeof selectedElement.scrollIntoView === 'function') {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, open]);

  useEffect(() => {
    if (!hotkey) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if ((event.metaKey || event.ctrlKey) && key === 'k') {
        event.preventDefault();
        onOpenChange(true);
        return;
      }

      if (open && event.key === 'Escape') {
        event.preventDefault();
        onOpenChange(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [hotkey, onOpenChange, open]);

  const runAction = (action: CommandPaletteResolvedAction) => {
    if (action.disabled) {
      return;
    }

    markRecent(action.id);
    executeAction(action, query, onActionRun);
    onOpenChange(false);
  };

  const activeDescendantId =
    results.length > 0 ? `${listboxId}-option-${Math.max(activeIndex, 0)}` : undefined;

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      title={title}
      size="medium"
      className={clsx('itdo-command-palette', className)}
      closeOnEsc={false}
    >
      <div className="itdo-command-palette__search">
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={listboxId}
          aria-activedescendant={activeDescendantId}
          className="itdo-command-palette__input"
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (results.length === 0) {
              if (event.key === 'Escape') {
                event.preventDefault();
                onOpenChange(false);
              }
              return;
            }

            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setActiveIndex((previous) => (previous + 1) % results.length);
              return;
            }

            if (event.key === 'ArrowUp') {
              event.preventDefault();
              setActiveIndex((previous) => (previous - 1 + results.length) % results.length);
              return;
            }

            if (event.key === 'Enter') {
              event.preventDefault();
              runAction(results[activeIndex]);
              return;
            }

            if (event.key === 'Escape') {
              event.preventDefault();
              onOpenChange(false);
            }
          }}
        />
      </div>

      <div className="itdo-command-palette__results" id={listboxId} role="listbox" aria-label={ariaLabel}>
        {groupedActions.length > 0 ? (
          groupedActions.map((group) => (
            <section key={group.label} className="itdo-command-palette__group" aria-label={group.label}>
              <h3 className="itdo-command-palette__group-title">{group.label}</h3>
              <ul className="itdo-command-palette__list">
                {group.items.map(({ action, index }) => {
                  const isActive = index === activeIndex;
                  const optionId = `${listboxId}-option-${index}`;

                  return (
                    <li key={action.id} className="itdo-command-palette__item">
                      <button
                        id={optionId}
                        data-command-index={index}
                        type="button"
                        role="option"
                        aria-selected={isActive}
                        disabled={action.disabled}
                        className={clsx('itdo-command-palette__action', {
                          'is-active': isActive,
                          'is-disabled': action.disabled,
                        })}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => runAction(action)}
                      >
                        <span className="itdo-command-palette__action-main">
                          {action.icon && <span className="itdo-command-palette__icon">{action.icon}</span>}
                          <span className="itdo-command-palette__text">
                            <span className="itdo-command-palette__label">{action.label}</span>
                            {action.description && (
                              <span className="itdo-command-palette__description">{action.description}</span>
                            )}
                          </span>
                        </span>
                        {action.shortcut && (
                          <kbd className="itdo-command-palette__shortcut">{action.shortcut}</kbd>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        ) : (
          <p className="itdo-command-palette__empty">{emptyMessage}</p>
        )}
      </div>
    </Dialog>
  );
};
