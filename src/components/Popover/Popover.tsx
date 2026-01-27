import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { PopoverProps, PopoverPlacement } from './Popover.types';
import './Popover.css';

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

const VIEWPORT_PADDING = 8;

const getPlacement = (
  anchorRect: DOMRect,
  popoverRect: DOMRect,
  placement: PopoverPlacement,
  offset: number
) => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const positions = {
    'bottom-start': {
      top: anchorRect.bottom + offset,
      left: anchorRect.left,
    },
    'bottom-end': {
      top: anchorRect.bottom + offset,
      left: anchorRect.right - popoverRect.width,
    },
    'top-start': {
      top: anchorRect.top - popoverRect.height - offset,
      left: anchorRect.left,
    },
    'top-end': {
      top: anchorRect.top - popoverRect.height - offset,
      left: anchorRect.right - popoverRect.width,
    },
    right: {
      top: anchorRect.top + (anchorRect.height - popoverRect.height) / 2,
      left: anchorRect.right + offset,
    },
    left: {
      top: anchorRect.top + (anchorRect.height - popoverRect.height) / 2,
      left: anchorRect.left - popoverRect.width - offset,
    },
  }[placement];

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
  const top = clamp(
    positions.top,
    VIEWPORT_PADDING,
    viewportHeight - popoverRect.height - VIEWPORT_PADDING
  );
  const left = clamp(
    positions.left,
    VIEWPORT_PADDING,
    viewportWidth - popoverRect.width - VIEWPORT_PADDING
  );

  return { top, left };
};

export const Popover: React.FC<PopoverProps> = ({
  open,
  onClose,
  anchorRef,
  children,
  placement = 'bottom-start',
  offset = 8,
  portal = true,
  role = 'dialog',
  ariaLabel,
  ariaLabelledby,
  ariaDescribedby,
  closeOnEsc = true,
  closeOnOutsideClick = true,
  autoFocus = true,
  trapFocus = false,
  initialFocusRef,
  className,
}) => {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const updatePosition = useMemo(
    () => () => {
      const anchorEl = anchorRef.current;
      const popoverEl = popoverRef.current;
      if (!anchorEl || !popoverEl) return;
      const anchorRect = anchorEl.getBoundingClientRect();
      const popoverRect = popoverEl.getBoundingClientRect();
      setPosition(getPlacement(anchorRect, popoverRect, placement, offset));
    },
    [anchorRef, placement, offset]
  );

  useLayoutEffect(() => {
    if (!open) return;
    setPosition(null);
    updatePosition();
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && closeOnEsc) {
        onClose();
      }

      if (event.key === 'Tab' && trapFocus) {
        const focusables = getFocusableElements(popoverRef.current);
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

    const handleClick = (event: MouseEvent) => {
      if (!closeOnOutsideClick) return;
      const target = event.target as Node;
      const anchorEl = anchorRef.current;
      const popoverEl = popoverRef.current;
      if (popoverEl && popoverEl.contains(target)) return;
      if (anchorEl && anchorEl.contains(target)) return;
      onClose();
    };

    let animationFrameId: number | null = null;
    const handleScrollOrResize = () => {
      if (animationFrameId !== null) return;
      animationFrameId = window.requestAnimationFrame(() => {
        animationFrameId = null;
        updatePosition();
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClick);
    window.addEventListener('resize', handleScrollOrResize);
    window.addEventListener('scroll', handleScrollOrResize, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClick);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    };
  }, [open, closeOnEsc, closeOnOutsideClick, onClose, anchorRef, updatePosition, trapFocus]);

  useEffect(() => {
    if (!open || !autoFocus) return;
    const focusTarget = initialFocusRef?.current || getFocusableElements(popoverRef.current)[0];
    if (focusTarget && document.contains(focusTarget)) {
      focusTarget.focus();
    }
  }, [open, autoFocus, initialFocusRef]);

  if (!open) return null;

  const content = (
    <div
      ref={popoverRef}
      className={clsx('itdo-popover', className)}
      role={role}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-describedby={ariaDescribedby}
      style={{
        top: position?.top ?? 0,
        left: position?.left ?? 0,
        visibility: position ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>
  );

  if (portal) {
    return createPortal(content, document.body);
  }

  return content;
};
