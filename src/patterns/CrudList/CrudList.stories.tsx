import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { StatusBadge } from '../../components/StatusBadge';
import { Card } from '../../components/Card';
import { CrudList } from './CrudList';
import { DataTable } from './DataTable';
import { FilterBar } from './FilterBar';

const meta: Meta<typeof CrudList> = {
  title: 'Patterns/CrudList',
  component: CrudList,
};

export default meta;

type Story = StoryObj<typeof CrudList>;

const projectColumns = [
  { key: 'project', header: 'Project', sortable: true },
  { key: 'owner', header: 'Owner', sortable: true },
  { key: 'status', header: 'Status' },
  { key: 'updatedAt', header: 'Updated', sortable: true, align: 'right' as const },
];

const projectRows = [
  {
    id: 'PRJ-001',
    project: 'Vendor onboarding',
    owner: 'Team A',
    status: <StatusBadge status="pending" size="sm" />,
    updatedAt: '2026-02-05',
  },
  {
    id: 'PRJ-002',
    project: 'Invoice sync',
    owner: 'Team B',
    status: <StatusBadge status="approved" size="sm" />,
    updatedAt: '2026-02-04',
  },
  {
    id: 'PRJ-003',
    project: 'Contract review',
    owner: 'Team C',
    status: <StatusBadge status="draft" size="sm" />,
    updatedAt: '2026-02-03',
  },
];

const invoiceColumns = [
  { key: 'invoiceNo', header: 'Invoice No', sortable: true },
  { key: 'vendor', header: 'Vendor', sortable: true },
  { key: 'amount', header: 'Amount', sortable: true, align: 'right' as const },
  { key: 'status', header: 'Status' },
  { key: 'dueDate', header: 'Due date', sortable: true },
];

const invoiceRows = [
  {
    id: 'INV-1201',
    invoiceNo: 'INV-1201',
    vendor: 'Acme Co.',
    amount: '$4,500',
    status: <StatusBadge status="pending" size="sm" />,
    dueDate: '2026-02-15',
  },
  {
    id: 'INV-1202',
    invoiceNo: 'INV-1202',
    vendor: 'Beta Ltd.',
    amount: '$2,100',
    status: <StatusBadge status="approved" size="sm" />,
    dueDate: '2026-02-18',
  },
  {
    id: 'INV-1203',
    invoiceNo: 'INV-1203',
    vendor: 'Gamma Inc.',
    amount: '$8,950',
    status: <StatusBadge status="rejected" size="sm" />,
    dueDate: '2026-02-20',
  },
];

const ProjectFilters = () => {
  const [search, setSearch] = useState('');

  return (
    <FilterBar
      search={{
        value: search,
        onChange: setSearch,
        placeholder: 'Search project name',
      }}
      filters={[
        {
          key: 'status',
          label: 'Status',
          control: (
            <select aria-label="Project status filter">
              <option value="">All</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          ),
        },
      ]}
      chips={[
        { key: 'team-a', label: 'Owner: Team A' },
        { key: 'pending', label: 'Status: Pending' },
      ]}
      onClearAll={() => undefined}
      actions={<Button size="small">Create project</Button>}
    />
  );
};

const InvoiceFilters = () => {
  const [search, setSearch] = useState('');

  return (
    <FilterBar
      search={{
        value: search,
        onChange: setSearch,
        placeholder: 'Search invoice no.',
      }}
      savedViews={{
        items: [
          { id: 'all', name: 'All invoices' },
          { id: 'pending', name: 'Pending payment' },
        ],
        selectedId: 'all',
        onSelect: () => undefined,
        onSave: () => undefined,
      }}
      filters={[
        {
          key: 'dueDate',
          label: 'Due date',
          control: <input type="date" aria-label="Due date filter" />,
        },
      ]}
      chips={[
        { key: 'month', label: 'Due: this month' },
        { key: 'amount', label: 'Amount: > $1,000' },
      ]}
      onClearAll={() => undefined}
      actions={
        <>
          <Button variant="secondary" size="small">
            Export
          </Button>
          <Button size="small">New invoice</Button>
        </>
      }
    />
  );
};

export const ProjectListScenario: Story = {
  name: '案件一覧想定',
  render: () => (
    <Card variant="outlined" padding="large">
      <CrudList
        title="Projects"
        description="Track active initiatives and owner assignments."
        filters={<ProjectFilters />}
        table={
          <DataTable
            columns={projectColumns}
            rows={projectRows}
            selectable="multiple"
            pageSize={2}
            rowActions={[
              {
                key: 'open',
                label: 'Open',
                onSelect: () => undefined,
              },
            ]}
          />
        }
      />
    </Card>
  ),
};

export const InvoiceListScenario: Story = {
  name: '請求一覧想定',
  render: () => (
    <Card variant="outlined" padding="large">
      <CrudList
        title="Invoices"
        description="Review payable invoices and approval status."
        filters={<InvoiceFilters />}
        table={
          <DataTable
            columns={invoiceColumns}
            rows={invoiceRows}
            selectable="single"
            pageSize={2}
            rowActions={[
              {
                key: 'approve',
                label: 'Approve',
                onSelect: () => undefined,
              },
              {
                key: 'reject',
                label: 'Reject',
                onSelect: () => undefined,
              },
            ]}
          />
        }
      />
    </Card>
  ),
};

export const Empty: Story = {
  render: () => (
    <Card variant="outlined" padding="large">
      <CrudList
        title="Invoices"
        description="Review payable invoices and approval status."
        filters={<InvoiceFilters />}
        emptyState={
          <EmptyState
            title="No invoices found"
            description="Adjust filters or create a new invoice."
            action={<Button size="small">Create invoice</Button>}
          />
        }
        isEmpty
      />
    </Card>
  ),
};
