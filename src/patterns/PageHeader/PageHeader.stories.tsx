import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button';
import { PageHeader } from './PageHeader';

const meta: Meta<typeof PageHeader> = {
  title: 'Patterns/PageHeader',
  component: PageHeader,
};

export default meta;

type Story = StoryObj<typeof PageHeader>;

export const Default: Story = {
  args: {
    title: 'Vendor documents',
    description: 'Manage submission progress, approval status, and pending actions.',
    breadcrumbs: [
      { label: 'Home', href: '#' },
      { label: 'Operations', href: '#' },
      { label: 'Vendor documents' },
    ],
    secondaryActions: (
      <>
        <Button variant="secondary">Export CSV</Button>
        <Button variant="outline">Bulk approve</Button>
      </>
    ),
    primaryAction: <Button>Create request</Button>,
    meta: (
      <>
        <div>Updated: 2026-02-06</div>
        <div>Owner: Procurement team</div>
      </>
    ),
  },
};

export const LongText: Story = {
  args: {
    title: 'Contract compliance dashboard',
    description:
      'This dashboard consolidates vendor status, compliance checks, and payment timelines for internal governance and audit preparation.',
    breadcrumbs: [
      { label: 'Home', href: '#' },
      { label: 'Compliance', href: '#' },
      { label: 'Contract compliance dashboard' },
    ],
    secondaryActions: <Button variant="secondary">Download report</Button>,
    primaryAction: <Button>Start review</Button>,
    meta: (
      <>
        <div>Scope: FY2025-2026</div>
        <div>Last sync: 10 minutes ago</div>
      </>
    ),
  },
};

export const MobileEquivalent: Story = {
  args: {
    title: 'Approvals',
    description: 'Review open requests and complete approval actions.',
    sticky: true,
    secondaryActions: (
      <>
        <Button variant="secondary">Filter</Button>
        <Button variant="outline">Sort</Button>
      </>
    ),
    primaryAction: <Button>Approve selected</Button>,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
