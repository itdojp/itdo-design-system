import { fireEvent, render, screen } from '@testing-library/react';
import { Link } from './Link';

describe('Link', () => {
  it('applies external defaults', () => {
    render(<Link href="https://example.com">External</Link>);
    const link = screen.getByRole('link', { name: 'External' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not apply external defaults for internal links', () => {
    render(<Link href="/app/projects">Internal</Link>);
    const link = screen.getByRole('link', { name: 'Internal' });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('treats tel links as external', () => {
    render(<Link href="tel:+123456789">Call</Link>);
    const link = screen.getByRole('link', { name: 'Call' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('blocks unsafe javascript links', () => {
    const onClick = jest.fn();
    render(
      <Link href="javascript:alert(1)" onClick={onClick}>
        Unsafe
      </Link>
    );

    const link = screen.getByRole('link', { name: 'Unsafe' });
    expect(link).toHaveAttribute('href', '#');
    expect(link).toHaveAttribute('aria-disabled', 'true');

    fireEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });
});
