import { render, screen } from '@testing-library/react';
import { Button } from '../../components/Button';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title, description, meta, and actions', () => {
    render(
      <PageHeader
        title="Invoices"
        description="Review payment requests."
        primaryAction={<Button>Create invoice</Button>}
        secondaryActions={<Button variant="secondary">Export</Button>}
        meta={<span>Updated today</span>}
      />
    );

    expect(screen.getByRole('heading', { name: 'Invoices' })).toBeInTheDocument();
    expect(screen.getByText('Review payment requests.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create invoice' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
    expect(screen.getByText('Updated today')).toBeInTheDocument();
  });

  it('renders breadcrumb nav when breadcrumb list is provided', () => {
    render(
      <PageHeader
        title="Audit logs"
        breadcrumbs={[
          { label: 'Home', href: '#' },
          { label: 'Audit logs' },
        ]}
      />
    );

    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getAllByText('Audit logs')).toHaveLength(2);
  });

  it('applies sticky class and supports legacy action props', () => {
    const { container } = render(
      <PageHeader title="Legacy mode" sticky actions={<Button>Action</Button>} status={<span>Open</span>} />
    );

    expect(container.firstChild).toHaveClass('itdo-page-header--sticky');
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
