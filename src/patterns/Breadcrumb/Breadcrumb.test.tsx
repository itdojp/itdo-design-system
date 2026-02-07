import { fireEvent, render, screen } from '@testing-library/react';
import { Breadcrumb } from './Breadcrumb';

describe('Breadcrumb', () => {
  it('renders breadcrumb navigation and marks the last item as current by default', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Settings', href: '#' },
          { label: 'Profile' },
        ]}
      />
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Profile')).toHaveAttribute('aria-current', 'page');
  });

  it('supports explicit current item', () => {
    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Projects', current: true },
          { label: 'Project detail' },
        ]}
      />
    );

    expect(screen.getByText('Projects')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Project detail')).not.toHaveAttribute('aria-current', 'page');
  });

  it('renders button item and invokes click handler', () => {
    const onClick = jest.fn();

    render(
      <Breadcrumb
        items={[
          { label: 'Home', href: '#' },
          { label: 'Projects', onClick },
          { label: 'Current' },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Projects' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('returns null when no items are provided', () => {
    const { container } = render(<Breadcrumb items={[]} />);
    expect(container.firstChild).toBeNull();
  });
});
