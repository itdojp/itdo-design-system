import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge } from '../../components/StatusBadge';
import { DataTable } from './DataTable';

const meta: Meta<typeof DataTable> = {
  title: 'Patterns/DataTable',
  component: DataTable,
};

export default meta;

type Story = StoryObj<typeof DataTable>;

const invoiceColumns = [
  { key: 'invoiceNo', header: 'Invoice No', sortable: true, pinned: 'left' as const, hideable: false },
  { key: 'vendor', header: 'Vendor', sortable: true },
  { key: 'amount', header: 'Amount', sortable: true, align: 'right' as const },
  { key: 'status', header: 'Status' },
];

const invoiceRows = [
  {
    id: 'INV-1001',
    invoiceNo: 'INV-1001',
    vendor: 'Acme',
    amount: '$1,200',
    status: <StatusBadge status="pending" size="sm" />,
  },
  {
    id: 'INV-1002',
    invoiceNo: 'INV-1002',
    vendor: 'Beta',
    amount: '$9,880',
    status: <StatusBadge status="approved" size="sm" />,
  },
  {
    id: 'INV-1003',
    invoiceNo: 'INV-1003',
    vendor: 'Gamma',
    amount: '$4,200',
    status: <StatusBadge status="rejected" size="sm" />,
  },
];

const auditColumns = [
  { key: 'timestamp', header: 'Timestamp', sortable: true },
  { key: 'actor', header: 'Actor', sortable: true },
  { key: 'action', header: 'Action' },
  { key: 'status', header: 'Status' },
];

const auditRows = [
  {
    id: 'LOG-01',
    timestamp: '2026-02-06 10:21',
    actor: 'sato@itdo.jp',
    action: 'approved INV-1001',
    status: <StatusBadge status="approved" size="sm" />,
  },
  {
    id: 'LOG-02',
    timestamp: '2026-02-06 09:44',
    actor: 'tanaka@itdo.jp',
    action: 'requested update for INV-1003',
    status: <StatusBadge status="pending" size="sm" />,
  },
  {
    id: 'LOG-03',
    timestamp: '2026-02-06 09:12',
    actor: 'suzuki@itdo.jp',
    action: 'rejected INV-0932',
    status: <StatusBadge status="rejected" size="sm" />,
  },
];

export const InvoiceList: Story = {
  name: '請求一覧',
  args: {
    columns: invoiceColumns,
    rows: invoiceRows,
    selectable: 'multiple',
    pageSize: 2,
    enableColumnVisibilityControl: true,
    rowActions: [
      { key: 'approve', label: 'Approve', onSelect: () => undefined },
      { key: 'reject', label: 'Reject', onSelect: () => undefined },
    ],
    bulkActions: [
      { key: 'bulk-approve', label: 'Bulk approve', onSelect: () => undefined },
      { key: 'bulk-export', label: 'Bulk export', onSelect: () => undefined },
    ],
  },
};

export const AuditLogList: Story = {
  name: '監査ログ一覧',
  args: {
    columns: auditColumns,
    rows: auditRows,
    selectable: 'single',
    pageSize: 2,
    rowActionSlot: (row) => <a href={`#${row.id}`}>Detail</a>,
  },
};
