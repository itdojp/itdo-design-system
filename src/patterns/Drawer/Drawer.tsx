import { Children, isValidElement, useEffect, useId, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import type { DrawerFooterProps, DrawerHeaderProps, DrawerProps } from './Drawer.types';
import './Drawer.css';

const drawerStack: string[] = [];
let bodyLockCount = 0;
let previousBodyOverflow = '';

const registerDrawer = (drawerId: string) => {
  if (!drawerStack.includes(drawerId)) {
    drawerStack.push(drawerId);
  }
};

const unregisterDrawer = (drawerId: string) => {
  const index = drawerStack.indexOf(drawerId);
  if (index >= 0) {
    drawerStack.splice(index, 1);
  }
};

const isTopmostDrawer = (drawerId: string) =>
  drawerStack.length > 0 && drawerStack[drawerStack.length - 1] === drawerId;

const lockBodyScroll = () => {
  if (bodyLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  bodyLockCount += 1;
};

const unlockBodyScroll = () => {
  bodyLockCount = Math.max(0, bodyLockCount - 1);
  if (bodyLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
};

const getFocusableElements = (element: HTMLElement | null) => {
  if (!element) return [] as HTMLElement[];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];
  return Array.from(element.querySelectorAll<HTMLElement>(selectors.join(','))).filter(
    (node) => !node.hasAttribute('disabled') && node.getAttribute('aria-hidden') !== 'true'
  );
};

export const DrawerHeader = ({ title, description, actions, className, children }: DrawerHeaderProps) => (
  <header className={clsx('itdo-drawer__header', className)}>
    <div className="itdo-drawer__heading">
      {title && <h2 className="itdo-drawer__title">{title}</h2>}
      {description && <p className="itdo-drawer__description">{description}</p>}
      {children}
    </div>
    {actions && <div className="itdo-drawer__header-actions">{actions}</div>}
  </header>
);

export const DrawerFooter = ({ align = 'end', className, children }: DrawerFooterProps) => (
  <footer
    className={clsx('itdo-drawer__footer', `itdo-drawer__footer--${align}`, className)}
  >
    {children}
  </footer>
);

export const Drawer = ({
  open,
  onClose,
  title,
  description,
  ariaLabel,
  ariaLabelledBy,
  footer,
  children,
  size = 'md',
  placement = 'right',
  closeOnOverlay = true,
  closeOnEsc = true,
  showCloseButton = true,
  portal = true,
  className,
  overlayClassName,
  initialFocusRef,
}: DrawerProps) => {
  const drawerId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const titleId = useMemo(
    () => (title ? `itdo-drawer-title-${drawerId}` : undefined),
    [drawerId, title]
  );
  const descriptionId = useMemo(
    () => (description ? `itdo-drawer-desc-${drawerId}` : undefined),
    [description, drawerId]
  );
  const parsedChildren = useMemo(() => {
    const items = Children.toArray(children);
    let customHeader: DrawerHeaderProps['children'] | null = null;
    let customFooter: DrawerFooterProps['children'] | null = null;
    const bodyItems: DrawerHeaderProps['children'][] = [];

    items.forEach((child) => {
      if (isValidElement(child) && child.type === DrawerHeader && customHeader === null) {
        customHeader = child;
        return;
      }
      if (isValidElement(child) && child.type === DrawerFooter && customFooter === null) {
        customFooter = child;
        return;
      }
      bodyItems.push(child);
    });

    return { customHeader, customFooter, bodyItems };
  }, [children]);

  useEffect(() => {
    if (!open) {
      return;
    }

    registerDrawer(drawerId);
    const previousActive = document.activeElement as HTMLElement | null;
    const panel = panelRef.current;

    const focusTarget = initialFocusRef?.current ?? getFocusableElements(panel)[0];
    if (focusTarget) {
      focusTarget.focus();
    } else {
      panel?.focus();
    }

    lockBodyScroll();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTopmostDrawer(drawerId)) {
        return;
      }

      if (event.key === 'Escape' && closeOnEsc) {
        event.preventDefault();
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusables = getFocusableElements(panel);
        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const current = document.activeElement as HTMLElement | null;
        const currentIndex = current ? focusables.indexOf(current) : -1;

        if (!current || !panel?.contains(current)) {
          event.preventDefault();
          first.focus();
          return;
        }

        if (currentIndex === -1) {
          event.preventDefault();
          if (event.shiftKey) {
            last.focus();
          } else {
            first.focus();
          }
          return;
        }

        if (event.shiftKey && current === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && current === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      unregisterDrawer(drawerId);
      unlockBodyScroll();
      if (previousActive && document.contains(previousActive)) {
        try {
          previousActive.focus();
        } catch {
          // ignore focus restore failure
        }
      }
    };
  }, [open, drawerId, closeOnEsc, onClose, initialFocusRef]);

  if (!open) {
    return null;
  }

  const content = (
    <div
      className={clsx('itdo-drawer-overlay', overlayClassName)}
      onClick={(event) => {
        if (closeOnOverlay && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <aside
        ref={panelRef}
        className={clsx(
          'itdo-drawer',
          `itdo-drawer--${size}`,
          `itdo-drawer--${placement}`,
          className
        )}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabel ? undefined : (ariaLabelledBy ?? titleId)}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        {parsedChildren.customHeader ?? ((title || description || showCloseButton) && (
          <header className="itdo-drawer__header">
            <div className="itdo-drawer__heading">
              {title && (
                <h2 id={titleId} className="itdo-drawer__title">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descriptionId} className="itdo-drawer__description">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                className="itdo-drawer__close"
                aria-label="Close drawer"
                onClick={onClose}
              >
                ×
              </button>
            )}
          </header>
        ))}

        <div className="itdo-drawer__body">{parsedChildren.bodyItems}</div>
        {footer
          ? (isValidElement(footer) && footer.type === DrawerFooter ? footer : <DrawerFooter>{footer}</DrawerFooter>)
          : parsedChildren.customFooter}
      </aside>
    </div>
  );

  if (portal) {
    return createPortal(content, document.body);
  }

  return content;
};
