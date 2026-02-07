import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Combobox } from '../../components/Combobox';
import { CopyButton } from '../../components/CopyButton';
import { Input } from '../../components/Input';
import { Link } from '../../components/Link';
import { MarkdownRenderer } from '../../components/MarkdownRenderer';
import { Popover } from '../../components/Popover';
import { Textarea } from '../../components/Textarea';
import { ToastViewport } from '../../components/Toast';
import { useToastQueue } from '../../hooks/useToastQueue';
import { AsyncStatePanel } from '../../patterns/AsyncStatePanel';
import { Breadcrumb } from '../../patterns/Breadcrumb';
import { CrudList } from '../../patterns/CrudList';
import { DataTable } from '../../patterns/CrudList/DataTable';
import { FilterBar } from '../../patterns/CrudList/FilterBar';
import { EventLog } from '../../patterns/EventLog';
import { PageHeader } from '../../patterns/PageHeader';
import { SectionCard } from '../../patterns/SectionCard';
import { Tabs } from '../../patterns/Tabs';
import type { ComboboxItem } from '../../components/Combobox/Combobox.types';
import type { EventLogItem } from '../../patterns/EventLog/EventLog.types';

const meta: Meta = {
  title: 'Examples/DesignBook',
};

export default meta;

type Story = StoryObj;

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <Card variant="outlined" padding="large">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div>
        <h3 style={{ margin: 0 }}>{title}</h3>
      </div>
      {children}
    </div>
  </Card>
);

const Wrapper = ({ children }: { children: ReactNode }) => (
  <div style={{ maxWidth: '960px', margin: '0 auto', padding: '1.5rem' }}>
    <div style={{ display: 'grid', gap: '1.5rem' }}>{children}</div>
  </div>
);

export const ReferencePicker: Story = {
  render: () => {
    const items: ComboboxItem[] = [
      {
        id: 'ref-1',
        label: 'ERP4 / Timesheet',
        description: 'Project activity list',
        badge: 'Project',
        meta: 'Scope: Team A',
      },
      {
        id: 'ref-2',
        label: 'ERP4 / Core',
        description: 'Core data module',
        badge: 'Team',
        meta: 'Scope: Shared',
      },
      {
        id: 'ref-3',
        label: 'ITDO Portal',
        description: 'User-facing portal',
        badge: 'Service',
        meta: 'Scope: Public',
      },
    ];

    const [selected, setSelected] = useState<ComboboxItem | null>(null);

    return (
      <Wrapper>
        <Section title="Reference Picker">
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={chipStyle}>Scope: Team A</span>
              <span style={chipStyle}>Partial match</span>
              <span style={chipStyle}>Type badges</span>
            </div>
            <Combobox
              label="Reference"
              placeholder="Search reference"
              items={items}
              onSelect={(item) => setSelected(item)}
            />
            <Combobox
              label="Empty state"
              placeholder="No matches"
              items={[]}
              emptyMessage="No references found"
            />
            {selected ? (
              <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                Selected: {selected.label} ({selected.badge})
              </div>
            ) : (
              <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                No reference selected
              </div>
            )}
          </div>
        </Section>
      </Wrapper>
    );
  },
};

export const DeepLinkAndCopy: Story = {
  render: () => {
    const url = 'https://example.com/projects/123';
    const markdown = `[Project 123](${url})`;

    return (
      <Wrapper>
        <Section title="Deep Link & Copy">
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link href={url} external>
                Project 123
              </Link>
              <CopyButton text={url} label="Copy URL" />
              <CopyButton text={markdown} label="Copy Markdown" />
            </div>
            <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
              Use canonical deep links and label them with concise titles. Provide both URL and Markdown copy.
            </div>
          </div>
        </Section>
      </Wrapper>
    );
  },
};

export const MemoMarkdown: Story = {
  render: () => {
    const [text, setText] = useState(
      `# Memo\n\n- Keep notes concise\n- Use links for references\n\n[Portal](https://example.com)`
    );

    return (
      <Wrapper>
        <Section title="Memo (Markdown)">
          <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <Textarea
              label="Input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={10}
            />
            <div>
              <div style={{ fontSize: 'var(--font-size-sm)', marginBottom: '0.5rem' }}>Preview</div>
              <div style={previewStyle}>
                <MarkdownRenderer
                  content={text}
                  linkComponent={(props) => (
                    <Link href={props.href ?? '#'} external={Boolean(props.href?.startsWith('http'))}>
                      {props.children ?? props.href ?? 'Link'}
                    </Link>
                  )}
                />
              </div>
            </div>
          </div>
        </Section>
      </Wrapper>
    );
  },
};

export const HistoryAudit: Story = {
  render: () => {
    const items: EventLogItem[] = [
      {
        id: '1',
        title: 'Request submitted',
        description: 'User action recorded in the system.',
        timestamp: '2024-10-01 09:15',
        status: 'info',
      },
      {
        id: '2',
        title: 'Validation completed',
        description: 'All required fields were validated successfully.',
        timestamp: '2024-10-01 09:16',
        status: 'success',
      },
      {
        id: '3',
        title: 'Manual override applied',
        description: 'Admin updated approval status.',
        timestamp: '2024-10-01 10:05',
        status: 'error',
        adminOverride: true,
        changes: [
          { field: 'status', before: 'Pending', after: 'Approved' },
          { field: 'approver', before: 'Auto', after: 'Admin' },
        ],
        meta: 'Operator: Admin user',
      },
    ];

    return (
      <Wrapper>
        <Section title="History / Audit">
          <EventLog items={items} labels={{ adminOverride: 'Admin override', changes: 'Changes' }} />
        </Section>
      </Wrapper>
    );
  },
};

export const PatternGallery: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState('');
    const anchorRef = useRef<HTMLSpanElement>(null);
    const items = useMemo<ComboboxItem[]>(
      () => [
        { id: '1', label: 'ERP4 / Timesheet', badge: 'Project' },
        { id: '2', label: 'ERP4 / Core', badge: 'Team' },
        { id: '3', label: 'ITDO Portal', badge: 'Service' },
      ],
      []
    );

    return (
      <Wrapper>
        <Section title="Pattern Gallery">
          <div style={{ display: 'grid', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <Input label="Quick Reference" placeholder="Search" fullWidth />
            <span ref={anchorRef} style={{ display: 'inline-flex' }}>
              <Button size="small" onClick={() => setOpen(true)}>Open tips</Button>
            </span>
          </div>
            <Popover
              open={open}
              onClose={() => setOpen(false)}
              anchorRef={anchorRef}
              autoFocus={false}
              role="dialog"
              ariaLabel="Reference tips"
            >
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                <div style={{ fontWeight: 600 }}>Tips</div>
                <div style={{ fontSize: 'var(--font-size-sm)' }}>
                  Use reference picker for scoped search and link copy for reuse.
                </div>
                <Button size="small" variant="secondary" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </div>
            </Popover>
            <Combobox
              label="Reference"
              placeholder="Search reference"
              items={items}
              value={selected}
              onChange={setSelected}
            />
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <Link href="https://example.com" external>
                Deep link
              </Link>
              <CopyButton text="https://example.com" label="Copy URL" />
            </div>
          </div>
        </Section>
      </Wrapper>
    );
  },
};

export const ErrorRecoveryFlow: Story = {
  render: () => {
    const { toasts, enqueue, dismiss } = useToastQueue({ maxVisible: 4 });
    const [state, setState] = useState<'loading' | 'error' | 'ready'>('loading');
    const [attempts, setAttempts] = useState(0);
    const timersRef = useRef<number[]>([]);

    useEffect(() => {
      return () => {
        timersRef.current.forEach((timerId) => window.clearTimeout(timerId));
        timersRef.current = [];
      };
    }, []);

    const schedule = (callback: () => void, delayMs: number) => {
      const timerId = window.setTimeout(() => {
        timersRef.current = timersRef.current.filter((id) => id !== timerId);
        callback();
      }, delayMs);
      timersRef.current.push(timerId);
    };

    const simulateFail = () => {
      setState('loading');
      schedule(() => {
        setState('error');
        setAttempts((prev) => prev + 1);
        enqueue({
          severity: 'warning',
          title: 'Load failed',
          description: 'Please retry or contact support.',
          dedupeKey: 'designbook-load-failed',
        });
      }, 300);
    };

    const simulateSuccess = () => {
      setState('loading');
      schedule(() => {
        setState('ready');
        enqueue({
          severity: 'success',
          title: 'Recovered',
          description: 'Records reloaded successfully.',
          dedupeKey: 'designbook-recovered',
        });
      }, 300);
    };

    return (
      <Wrapper>
        <Section title="Error Recovery Flow">
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Button size="small" variant="secondary" onClick={simulateFail}>
                Simulate failure
              </Button>
              <Button size="small" variant="secondary" onClick={simulateSuccess}>
                Simulate success
              </Button>
            </div>
            <AsyncStatePanel
              state={state}
              loadingText="Loading ERP4 records..."
              error={{
                title: `Failed to load records (attempt ${attempts})`,
                detail: 'API_TIMEOUT: request-id=erp4-2301',
                retryAction: {
                  label: 'Retry',
                  tone: 'primary',
                  onClick: simulateSuccess,
                },
                secondaryAction: {
                  label: 'Adjust filters',
                  onClick: () => undefined,
                },
                contactAction: {
                  label: 'Contact support',
                  tone: 'ghost',
                  onClick: () =>
                    enqueue({
                      severity: 'info',
                      title: 'Support contact',
                      description: 'Please attach request id: erp4-2301',
                      dedupeKey: 'support-contact',
                    }),
                },
                backAction: {
                  label: 'Back to list',
                  tone: 'ghost',
                  onClick: () => setState('ready'),
                },
              }}
            >
              <Card variant="outlined" padding="large">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <strong>Recovered dataset</strong>
                  <span>Invoices: 24</span>
                  <span>Pending approvals: 3</span>
                </div>
              </Card>
            </AsyncStatePanel>
            <ToastViewport toasts={toasts} onDismiss={dismiss} />
          </div>
        </Section>
      </Wrapper>
    );
  },
};

const designBookInvoiceRows = [
  {
    id: 'INV-3001',
    invoiceNo: 'INV-3001',
    vendor: 'Acme Co.',
    status: 'Pending',
    amount: '$4,500',
    updatedAt: '2026-02-06',
  },
  {
    id: 'INV-3002',
    invoiceNo: 'INV-3002',
    vendor: 'Beta Ltd.',
    status: 'Approved',
    amount: '$2,800',
    updatedAt: '2026-02-05',
  },
  {
    id: 'INV-3003',
    invoiceNo: 'INV-3003',
    vendor: 'Gamma Inc.',
    status: 'Pending',
    amount: '$12,300',
    updatedAt: '2026-02-04',
  },
  {
    id: 'INV-3004',
    invoiceNo: 'INV-3004',
    vendor: 'Delta KK',
    status: 'Draft',
    amount: '$980',
    updatedAt: '2026-02-03',
  },
];

const designBookInvoiceColumns = [
  { key: 'invoiceNo', header: 'Invoice No', sortable: true, pinned: 'left' as const, hideable: false },
  { key: 'vendor', header: 'Vendor', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
  { key: 'amount', header: 'Amount', sortable: true, align: 'right' as const },
  { key: 'updatedAt', header: 'Updated', sortable: true },
];

const buildFilteredInvoices = (tab: string, search: string, statusFilter = '') => {
  const loweredSearch = search.trim().toLowerCase();
  return designBookInvoiceRows.filter((row) => {
    const tabMatch = tab === 'all' || row.status.toLowerCase() === tab;
    const statusMatch = statusFilter === '' || row.status.toLowerCase() === statusFilter;
    const searchMatch =
      loweredSearch.length === 0 ||
      row.invoiceNo.toLowerCase().includes(loweredSearch) ||
      row.vendor.toLowerCase().includes(loweredSearch);
    return tabMatch && statusMatch && searchMatch;
  });
};

export const MasterListWorkspace: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [queryUpdates, setQueryUpdates] = useState(0);
    const [panelRefresh, setPanelRefresh] = useState(0);

    const filteredRows = useMemo(
      () => buildFilteredInvoices(activeTab, search, statusFilter),
      [activeTab, search, statusFilter]
    );
    const query = useMemo(
      () => ({
        search,
        pagination: {
          page: 1,
          pageSize: 3,
        },
      }),
      [search]
    );
    const handleQueryChange = useCallback(() => {
      setQueryUpdates((previous) => previous + 1);
    }, []);

    return (
      <Wrapper>
        <Section title="Master List Workspace">
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <PageHeader
              title="Invoice Master"
              description="Operational list for approval workflow."
              breadcrumbs={[
                { id: 'home', label: 'Home', href: '#' },
                { id: 'finance', label: 'Finance', href: '#' },
                { id: 'invoice-master', label: 'Invoice Master' },
              ]}
              primaryAction={<Button size="small">Create invoice</Button>}
              secondaryActions={<Button variant="secondary" size="small">Export CSV</Button>}
            />

            <Tabs
              ariaLabel="Invoice status tabs"
              value={activeTab}
              onValueChange={setActiveTab}
              items={[
                { id: 'all', label: 'All' },
                { id: 'pending', label: 'Pending' },
                { id: 'approved', label: 'Approved' },
                { id: 'draft', label: 'Draft' },
              ]}
            />

            <div style={{ display: 'grid', gap: 'var(--space-6)', gridTemplateColumns: 'minmax(0, 2fr) minmax(240px, 1fr)' }}>
              <CrudList
                title="Invoices"
                description="Search and select invoices for review."
                filters={
                  <FilterBar
                    search={{
                      value: search,
                      onChange: setSearch,
                      ariaLabel: 'Invoice search',
                      placeholder: 'Search invoice/vendor',
                    }}
                    filters={[
                      {
                        key: 'status',
                        label: 'Status',
                        control: (
                          <select aria-label="Status filter" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                            <option value="">All</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="draft">Draft</option>
                          </select>
                        ),
                      },
                    ]}
                    chips={[
                      ...(search ? [{ key: 'search', label: `Search: ${search}` }] : []),
                      ...(statusFilter ? [{ key: 'status', label: `Status: ${statusFilter}` }] : []),
                    ]}
                    onClearAll={() => {
                      setSearch('');
                      setStatusFilter('');
                    }}
                  />
                }
                table={
                  <DataTable
                    columns={designBookInvoiceColumns}
                    rows={filteredRows}
                    selectable="single"
                    pageSize={3}
                    query={query}
                    onQueryChange={handleQueryChange}
                    rowActions={[
                      {
                        key: 'open',
                        label: 'Open detail',
                        onSelect: () => undefined,
                      },
                    ]}
                  />
                }
              />

              <SectionCard title="Performance Probe" density="compact">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                  <span data-testid="query-updates">Query updates: {queryUpdates}</span>
                  <span data-testid="panel-refresh">Panel refresh: {panelRefresh}</span>
                  <Button size="small" variant="secondary" onClick={() => setPanelRefresh((previous) => previous + 1)}>
                    Refresh side panel
                  </Button>
                </div>
              </SectionCard>
            </div>
          </div>
        </Section>
      </Wrapper>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('tab', { name: 'Pending' }));
    await waitFor(() => {
      expect(canvas.getByRole('tab', { name: 'Pending' })).toHaveAttribute('aria-selected', 'true');
    });

    const queryBeforeRefresh = canvas.getByTestId('query-updates').textContent;
    await userEvent.click(canvas.getByRole('button', { name: 'Refresh side panel' }));
    await waitFor(() => {
      expect(canvas.getByTestId('panel-refresh')).toHaveTextContent('Panel refresh: 1');
    });
    expect(canvas.getByTestId('query-updates').textContent).toBe(queryBeforeRefresh);

    await userEvent.click(canvas.getByLabelText('Invoice search'));
    await userEvent.tab();
    expect(canvas.getByLabelText('Status filter')).toHaveFocus();
  },
};

export const DetailTransitionWorkspace: Story = {
  render: () => {
    const [activeTab, setActiveTab] = useState('pending');
    const [search, setSearch] = useState('');
    const [selectedInvoiceId, setSelectedInvoiceId] = useState('INV-3001');

    const filteredRows = useMemo(
      () => buildFilteredInvoices(activeTab, search),
      [activeTab, search]
    );
    const selectedInvoice = useMemo(
      () => designBookInvoiceRows.find((row) => row.id === selectedInvoiceId),
      [selectedInvoiceId]
    );

    return (
      <Wrapper>
        <Section title="Detail Transition Workspace">
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <Breadcrumb
              items={[
                { id: 'home', label: 'Home', href: '#' },
                { id: 'finance', label: 'Finance', href: '#' },
                { id: 'invoices', label: 'Invoices', href: '#' },
                { id: 'detail', label: selectedInvoice?.invoiceNo ?? 'Not selected' },
              ]}
            />

            <Tabs
              ariaLabel="Invoice detail tabs"
              value={activeTab}
              onValueChange={setActiveTab}
              items={[
                { id: 'pending', label: 'Pending' },
                { id: 'approved', label: 'Approved' },
                { id: 'draft', label: 'Draft' },
              ]}
            />

            <CrudList
              title="Invoices"
              description="Move from master list to detail screen with keyboard."
              filters={
                <FilterBar
                  search={{
                    value: search,
                    onChange: setSearch,
                    ariaLabel: 'Invoice detail search',
                    placeholder: 'Filter invoices',
                  }}
                />
              }
              table={
                <DataTable
                  columns={designBookInvoiceColumns}
                  rows={filteredRows}
                  pageSize={3}
                  rowActions={[
                    {
                      key: 'open',
                      label: 'Open detail',
                      onSelect: (row) => setSelectedInvoiceId(row.id),
                    },
                  ]}
                />
              }
            />

            <SectionCard title="Selected Detail">
              <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                <strong data-testid="selected-invoice-id">Selected invoice: {selectedInvoice?.invoiceNo ?? 'None'}</strong>
                <span>Vendor: {selectedInvoice?.vendor ?? '-'}</span>
                <span>Amount: {selectedInvoice?.amount ?? '-'}</span>
                <span>Status: {selectedInvoice?.status ?? '-'}</span>
              </div>
            </SectionCard>
          </div>
        </Section>
      </Wrapper>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tableRows = canvas.getAllByRole('row');
    const firstBodyRow = tableRows[1];

    firstBodyRow.focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => {
      expect(tableRows[2]).toHaveFocus();
    });

    await userEvent.keyboard('{Enter}');
    await waitFor(() => {
      expect(canvas.getByTestId('selected-invoice-id')).toHaveTextContent('INV-3003');
    });
  },
};

const chipStyle: React.CSSProperties = {
  padding: '0.2rem 0.6rem',
  borderRadius: '999px',
  background: 'var(--color-bg-subtle)',
  fontSize: 'var(--font-size-xs)',
  color: 'var(--color-text-secondary)',
};

const previewStyle: React.CSSProperties = {
  border: '1px solid var(--color-border-default)',
  borderRadius: 'var(--radius-md)',
  padding: '1rem',
  minHeight: '240px',
  background: 'var(--color-bg-base)',
};
