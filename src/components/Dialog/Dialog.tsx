import React, { useEffect, useId, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { DialogProps } from './Dialog.types';
import './Dialog.css';

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

export const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  confirmAction,
  cancelAction,
  size = 'medium',
  scrollBehavior = 'dialog',
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showCloseButton = true,
  portal = true,
  className,
  overlayClassName,
  initialFocusRef,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const titleId = useMemo(() => (title ? `itdo-dialog-title-${id}` : undefined), [id, title]);
  const descriptionId = useMemo(
    () => (description ? `itdo-dialog-desc-${id}` : undefined),
    [id, description]
  );

  useEffect(() => {
    if (!open) return;

    const previousActive = document.activeElement as HTMLElement | null;
    const dialogElement = dialogRef.current;

    const focusTarget = initialFocusRef?.current || getFocusableElements(dialogElement)[0];
    if (focusTarget) {
      focusTarget.focus();
    } else {
      dialogElement?.focus();
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusables = getFocusableElements(dialogElement);
        if (focusables.length === 0) {
          event.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const current = document.activeElement as HTMLElement | null;
        const currentIndex = current ? focusables.indexOf(current) : -1;
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

    let previousOverflow: string | null = null;
    if (scrollBehavior === 'body') {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (scrollBehavior === 'body') {
        document.body.style.overflow = previousOverflow ?? '';
      }
      if (previousActive && document.contains(previousActive)) {
        try {
          previousActive.focus();
        } catch {
          // ignore
        }
      }
    };
  }, [open, closeOnEsc, onClose, scrollBehavior, initialFocusRef]);

  if (!open) return null;

  const content = (
    <div
      className={clsx(
        'itdo-dialog-overlay',
        {
          'itdo-dialog-overlay--scroll': scrollBehavior === 'body',
        },
        overlayClassName
      )}
      onClick={(event) => {
        if (closeOnOverlayClick && event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={clsx('itdo-dialog', `itdo-dialog--${size}`, className, {
          'itdo-dialog--scrollable': scrollBehavior === 'dialog',
          'itdo-dialog--body-scroll': scrollBehavior === 'body',
        })}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        ref={dialogRef}
        tabIndex={-1}
      >
        {(title || description || showCloseButton) && (
          <div className="itdo-dialog__header">
            <div className="itdo-dialog__heading">
              {title && (
                <h2 id={titleId} className="itdo-dialog__title">
                  {title}
                </h2>
              )}
              {description && (
                <p id={descriptionId} className="itdo-dialog__description">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button type="button" className="itdo-dialog__close" onClick={onClose} aria-label="Close dialog">
                ×
              </button>
            )}
          </div>
        )}

        <div className="itdo-dialog__body">{children}</div>

        {(footer || confirmAction || cancelAction) && (
          <div className="itdo-dialog__footer">
            {footer ?? (
              <div className="itdo-dialog__actions">
                {cancelAction}
                {confirmAction}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  if (portal) {
    return createPortal(content, document.body);
  }

  return content;
};
