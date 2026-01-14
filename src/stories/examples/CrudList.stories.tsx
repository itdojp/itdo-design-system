import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { EmptyState } from '../../components/EmptyState';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';

const meta: Meta = {
  title: 'Examples/CrudList',
};

export default meta;

type Story = StoryObj;

const Container = ({ children }: { children: ReactNode }) => (
  <div style={{ padding: '1.5rem' }}>{children}</div>
);

const FilterBar = () => (
  <div
    style={{
      display: 'flex',
      gap: '0.75rem',
      alignItems: 'flex-end',
      flexWrap: 'wrap',
    }}
  >
    <Input label="Search" placeholder="Search" />
    <Select label="Status" placeholder="All">
      <option value="open">Open</option>
      <option value="closed">Closed</option>
    </Select>
    <div style={{ marginLeft: 'auto' }}>
      <Button>New item</Button>
    </div>
  </div>
);

const Table = () => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ textAlign: 'left' }}>
          <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-default)' }}>
            Name
          </th>
          <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-default)' }}>
            Owner
          </th>
          <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-default)' }}>
            Status
          </th>
          <th style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-default)' }}>
            Updated
          </th>
        </tr>
      </thead>
      <tbody>
        {['Alpha', 'Beta', 'Gamma'].map((name) => (
          <tr key={name}>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-default)' }}>
              {name}
            </td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-default)' }}>
              Team A
            </td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-default)' }}>
              Open
            </td>
            <td style={{ padding: '0.75rem', borderBottom: '1px solid var(--color-border-default)' }}>
              2024-10-01
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Pagination = () => (
  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
    <Button variant="secondary" size="small">
      Prev
    </Button>
    <Button variant="secondary" size="small">
      Next
    </Button>
  </div>
);

export const WithData: Story = {
  render: () => (
    <Container>
      <Card variant="outlined" padding="large">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FilterBar />
          <Table />
          <Pagination />
        </div>
      </Card>
    </Container>
  ),
};

export const Empty: Story = {
  render: () => (
    <Container>
      <Card variant="outlined" padding="large">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FilterBar />
          <EmptyState
            title="No items"
            description="Create a new item to get started."
            action={<Button size="small">New item</Button>}
          />
        </div>
      </Card>
    </Container>
  ),
};
