import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import { Card } from '../../components/Card';
import { CrudList } from './CrudList';
import { DataTable } from './DataTable';
import { FilterBar } from './FilterBar';
import { PaginationBar } from './PaginationBar';

const meta: Meta<typeof CrudList> = {
  title: 'Patterns/CrudList',
  component: CrudList,
};

export default meta;

type Story = StoryObj<typeof CrudList>;

const columns = [
  { key: 'name', header: 'Name' },
  { key: 'owner', header: 'Owner' },
  { key: 'status', header: 'Status' },
  { key: 'updated', header: 'Updated' },
];

const rows = [
  { id: '1', name: 'Alpha', owner: 'Team A', status: 'Open', updated: '2024-10-01' },
  { id: '2', name: 'Beta', owner: 'Team B', status: 'Closed', updated: '2024-09-28' },
  { id: '3', name: 'Gamma', owner: 'Team C', status: 'Open', updated: '2024-09-20' },
];

const Filters = () => (
  <FilterBar
    actions={
      <Button size="small">New item</Button>
    }
  >
    <Input label="Search" placeholder="Search" />
    <Select label="Status" placeholder="All">
      <option value="open">Open</option>
      <option value="closed">Closed</option>
    </Select>
  </FilterBar>
);

const Pager = () => (
  <PaginationBar>
    <Button variant="secondary" size="small">
      Prev
    </Button>
    <Button variant="secondary" size="small">
      Next
    </Button>
  </PaginationBar>
);

export const WithData: Story = {
  render: () => (
    <Card variant="outlined" padding="large">
      <CrudList
        title="Items"
        description="Manage records and apply filters."
        filters={<Filters />}
        table={<DataTable columns={columns} rows={rows} />}
        pagination={<Pager />}
      />
    </Card>
  ),
};

export const Empty: Story = {
  render: () => (
    <Card variant="outlined" padding="large">
      <CrudList
        title="Items"
        description="Manage records and apply filters."
        filters={<Filters />}
        emptyState={
          <EmptyState
            title="No items"
            description="Create a new item to get started."
            action={<Button size="small">New item</Button>}
          />
        }
        isEmpty
      />
    </Card>
  ),
};
