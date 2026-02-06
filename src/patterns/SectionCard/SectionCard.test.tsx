import { render, screen } from '@testing-library/react';
import { Button } from '../../components/Button';
import { SectionCard } from './SectionCard';
import { ListCard } from './ListCard';

describe('SectionCard', () => {
  it('renders heading, description, actions, and footer', () => {
    render(
      <SectionCard
        title="System settings"
        description="Configuration for system-wide behavior"
        actions={<Button size="small">Edit</Button>}
        footer="Footer note"
      >
        <div>Card body</div>
      </SectionCard>
    );

    expect(screen.getByRole('heading', { name: 'System settings' })).toBeInTheDocument();
    expect(screen.getByText('Configuration for system-wide behavior')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByText('Card body')).toBeInTheDocument();
    expect(screen.getByText('Footer note')).toBeInTheDocument();
  });

  it('applies compact density class', () => {
    const { container } = render(
      <SectionCard title="Compact" density="compact">
        <div>Body</div>
      </SectionCard>
    );

    expect(container.firstChild).toHaveClass('itdo-section-card--compact');
  });
});

describe('ListCard', () => {
  it('renders list items', () => {
    render(
      <ListCard
        header="List"
        items={[
          { id: '1', name: 'Alpha' },
          { id: '2', name: 'Beta' },
        ]}
        renderItem={(item) => <span>{item.name}</span>}
      />
    );

    expect(screen.getByText('List')).toBeInTheDocument();
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    expect(screen.getByText('Beta')).toBeInTheDocument();
  });

  it('renders empty content when no items are provided', () => {
    render(
      <ListCard header="Empty list" items={[]} empty={<span>No entries</span>} renderItem={() => null} />
    );

    expect(screen.getByText('No entries')).toBeInTheDocument();
  });
});
