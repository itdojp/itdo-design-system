import { fireEvent, render, screen } from '@testing-library/react';
import { PermissionGate } from './PermissionGate';

describe('PermissionGate', () => {
  it('renders children as-is when allowed', () => {
    const onClick = jest.fn();
    render(
      <PermissionGate allowed>
        <button type="button" onClick={onClick}>
          Delete row
        </button>
      </PermissionGate>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Delete row' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('hides content in hide mode and renders fallback', () => {
    render(
      <PermissionGate allowed={false} mode="hide" fallback={<span>No permission</span>}>
        <button type="button">Delete row</button>
      </PermissionGate>
    );

    expect(screen.queryByRole('button', { name: 'Delete row' })).not.toBeInTheDocument();
    expect(screen.getByText('No permission')).toBeInTheDocument();
  });

  it('disables button-like children and shows reason in disable mode', () => {
    render(
      <PermissionGate allowed={false} mode="disable" reason="Requires finance:write permission.">
        <button type="button">Delete row</button>
      </PermissionGate>
    );

    const button = screen.getByRole('button', { name: 'Delete row' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByRole('note')).toHaveTextContent('Requires finance:write permission.');
  });

  it('can suppress reason text', () => {
    render(
      <PermissionGate
        allowed={false}
        mode="disable"
        showReason={false}
        reason="Requires finance:write permission."
      >
        <button type="button">Delete row</button>
      </PermissionGate>
    );

    expect(screen.queryByRole('note')).not.toBeInTheDocument();
  });
});
