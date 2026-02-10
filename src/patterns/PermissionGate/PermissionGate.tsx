import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type SyntheticEvent,
  type KeyboardEvent,
} from 'react';
import clsx from 'clsx';
import type { PermissionGateProps } from './PermissionGate.types';
import './PermissionGate.css';

const NATIVE_DISABLE_TAGS = new Set(['button', 'input', 'select', 'textarea', 'option', 'fieldset']);
const FOCUSABLE_TAGS = new Set(['a', 'button', 'input', 'select', 'textarea', 'option']);
const INTERACTIVE_ROLES = new Set([
  'button',
  'link',
  'menuitem',
  'menuitembutton',
  'checkbox',
  'switch',
  'tab',
]);

const stopActivation = (event: SyntheticEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

const stopActivationOnEnterOrSpace = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.stopPropagation();
  }
};

const withDisabledHints = (node: ReactNode, reason?: string): ReactNode => {
  const applyHints = (child: ReactNode): ReactNode => {
    if (!isValidElement(child)) {
      return child;
    }

    if (child.type === Fragment) {
      const fragment = child as ReactElement<{ children?: ReactNode }>;
      const mappedChildren = Children.map(fragment.props.children, applyHints);
      return cloneElement(fragment, undefined, mappedChildren);
    }

    const element = child as ReactElement<Record<string, unknown>>;
    const nextProps: Record<string, unknown> = {
      'aria-disabled': true,
    };

    const isStringType = typeof element.type === 'string';
    const tagName = isStringType ? (element.type as string) : '';
    const isAnchor = tagName === 'a';
    const canSetNativeDisabled = isStringType && NATIVE_DISABLE_TAGS.has(tagName);
    const isCustomComponent = !isStringType;
    const role = typeof element.props.role === 'string' ? element.props.role : '';
    const hasInteractiveRole = INTERACTIVE_ROLES.has(role);
    const hasFocusableTag = FOCUSABLE_TAGS.has(tagName);

    if (canSetNativeDisabled || isCustomComponent || 'disabled' in element.props) {
      nextProps.disabled = true;
    }

    if (
      hasFocusableTag ||
      hasInteractiveRole ||
      'tabIndex' in element.props ||
      'onClick' in element.props
    ) {
      nextProps.tabIndex = -1;
    }

    if (isAnchor && 'href' in element.props) {
      nextProps.href = undefined;
    }

    nextProps.onClick = stopActivation;
    nextProps.onPointerDown = stopActivation;
    nextProps.onKeyDown = stopActivationOnEnterOrSpace;

    if (reason && !('title' in element.props)) {
      nextProps.title = reason;
    }

    return cloneElement(element, nextProps);
  };

  return Children.map(node, applyHints) as ReactNode;
};

export const PermissionGate = ({
  allowed,
  mode = 'disable',
  reason = 'You do not have permission to perform this action.',
  showReason = true,
  fallback = null,
  children,
  className,
}: PermissionGateProps) => {
  if (allowed) {
    return <>{children}</>;
  }

  if (mode === 'hide') {
    return <>{fallback}</>;
  }

  return (
    <div className={clsx('itdo-permission-gate', className)} data-state="blocked">
      <div
        className="itdo-permission-gate__blocked"
        aria-disabled="true"
        title={reason}
        onClickCapture={stopActivation}
        onPointerDownCapture={stopActivation}
        onKeyDownCapture={stopActivationOnEnterOrSpace}
      >
        {withDisabledHints(children, reason)}
      </div>
      {showReason && reason && (
        <p className="itdo-permission-gate__reason" role="note">
          {reason}
        </p>
      )}
    </div>
  );
};
