import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { SavedViewBar } from '../../patterns/SavedViewBar';
import { useSavedViews } from '../../hooks/useSavedViews';
import { FilterBar } from '../../patterns/CrudList/FilterBar';
import { DataTable } from '../../patterns/CrudList/DataTable';
import { SectionCard } from '../../patterns/SectionCard';

const meta: Meta = {
  title: 'Examples/ERP4 List Workspace',
};

export default meta;
type Story = StoryObj;

const columns = [
  { key: 'id', header: 'ID', sortable: true, hideable: false },
  { key: 'member', header: 'Member', sortable: true },
  { key: 'project', header: 'Project', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
];

const allRows = [
  { id: 'TS-24001', member: 'Sato', project: 'ERP4 / Timesheet', status: 'Open' },
  { id: 'TS-24002', member: 'Tanaka', project: 'ERP4 / Core', status: 'Pending' },
  { id: 'TS-24003', member: 'Suzuki', project: 'ERP4 / Approvals', status: 'Open' },
  { id: 'TS-24004', member: 'Kobayashi', project: 'ERP4 / Timesheet', status: 'Closed' },
];

export const Default: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'pending' | 'closed'>('all');
    const [lastBulkMessage, setLastBulkMessage] = useState('No bulk action executed');

    const savedViews = useSavedViews<{ search: string; status: 'all' | 'open' | 'pending' | 'closed' }>({
      initialViews: [
        {
          id: 'all',
          name: 'All records',
          payload: { search: '', status: 'all' },
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: '2026-02-01T00:00:00.000Z',
        },
        {
          id: 'pending',
          name: 'Pending approvals',
          payload: { search: '', status: 'pending' },
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: '2026-02-01T00:00:00.000Z',
        },
      ],
      initialActiveViewId: 'all',
      createId: () => `view-${Math.random().toString(36).slice(2, 8)}`,
    });

    const rows = useMemo(() => {
      const normalizedSearch = search.trim().toLowerCase();
      return allRows.filter((row) => {
        const statusMatch = statusFilter === 'all' || row.status.toLowerCase() === statusFilter;
        const searchMatch =
          normalizedSearch.length === 0 ||
          row.id.toLowerCase().includes(normalizedSearch) ||
          row.member.toLowerCase().includes(normalizedSearch) ||
          row.project.toLowerCase().includes(normalizedSearch);
        return statusMatch && searchMatch;
      });
    }, [search, statusFilter]);

    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--space-12)', display: 'grid', gap: 'var(--space-8)' }}>
        <h2 style={{ margin: 0 }} data-testid="erp4-workspace-title">
          ERP4 Timesheet Workspace
        </h2>

        <SavedViewBar
          views={savedViews.views}
          activeViewId={savedViews.activeViewId}
          onSelectView={(viewId) => {
            savedViews.selectView(viewId);
            const selected = savedViews.views.find((view) => view.id === viewId);
            if (selected) {
              setSearch(selected.payload.search);
              setStatusFilter(selected.payload.status);
            }
          }}
          onSaveAs={(name) => {
            savedViews.createView(name, { search, status: statusFilter });
          }}
          onUpdateView={(viewId) => {
            savedViews.updateView(viewId, { payload: { search, status: statusFilter } });
          }}
          onDuplicateView={(viewId) => {
            savedViews.duplicateView(viewId);
          }}
          onShareView={(viewId) => {
            savedViews.toggleShared(viewId, true);
          }}
          onDeleteView={(viewId) => {
            savedViews.deleteView(viewId);
          }}
        />

        <SectionCard title="Timesheet records" description="Saved views + filter + bulk actions sample">
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <FilterBar
              search={{
                value: search,
                onChange: setSearch,
                placeholder: 'Search by id/member/project',
                ariaLabel: 'Search ERP4 timesheet records',
              }}
              filters={[
                {
                  key: 'status',
                  label: 'Status',
                  control: (
                    <select
                      aria-label="Filter by status"
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value as 'all' | 'open' | 'pending' | 'closed')
                      }
                    >
                      <option value="all">All</option>
                      <option value="open">Open</option>
                      <option value="pending">Pending</option>
                      <option value="closed">Closed</option>
                    </select>
                  ),
                },
              ]}
            />

            <DataTable
              columns={columns}
              rows={rows}
              selectable="multiple"
              pageSize={4}
              bulkActions={[
                {
                  key: 'approve',
                  label: 'Approve selected',
                  onSelect: (selectedRows) =>
                    setLastBulkMessage(`Approved ${selectedRows.length} records`),
                },
                {
                  key: 'export',
                  label: 'Export CSV',
                  onSelect: (selectedRows) =>
                    setLastBulkMessage(`Exported ${selectedRows.length} records`),
                },
              ]}
            />

            <p data-testid="erp4-bulk-message" style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
              {lastBulkMessage}
            </p>
          </div>
        </SectionCard>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByTestId('erp4-workspace-title')).toBeInTheDocument();
    await expect(canvas.getByText('Timesheet records')).toBeInTheDocument();
    await expect(canvas.getByTestId('erp4-bulk-message')).toHaveTextContent('No bulk action executed');
  },
};
