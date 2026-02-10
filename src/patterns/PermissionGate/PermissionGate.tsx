import { Fragment, cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import clsx from 'clsx';
import type { PermissionGateProps } from './PermissionGate.types';
import './PermissionGate.css';

const withDisabledHints = (node: ReactNode, reason?: string): ReactNode => {
  if (!isValidElement(node) || node.type === Fragment) {
    return node;
  }

  const element = node as ReactElement<Record<string, unknown>>;
  const nextProps: Record<string, unknown> = {
    'aria-disabled': true,
  };

  const canSetNativeDisabled =
    typeof element.type === 'string' &&
    ['button', 'input', 'select', 'textarea', 'option', 'fieldset'].includes(element.type);
  const isCustomComponent = typeof element.type !== 'string';
  if (canSetNativeDisabled || isCustomComponent || 'disabled' in element.props) {
    nextProps.disabled = true;
  }

  if ('tabIndex' in element.props || 'onClick' in element.props) {
    nextProps.tabIndex = -1;
  }

  if (reason && !('title' in element.props)) {
    nextProps.title = reason;
  }

  return cloneElement(element, nextProps);
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
      <div className="itdo-permission-gate__blocked" aria-disabled="true">
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
