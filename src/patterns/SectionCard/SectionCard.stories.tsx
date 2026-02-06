import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../components/Button';
import { SectionCard } from './SectionCard';
import { ListCard } from './ListCard';

const meta: Meta<typeof SectionCard> = {
  title: 'Patterns/SectionCard',
  component: SectionCard,
};

export default meta;

type Story = StoryObj<typeof SectionCard>;

export const SettingsCard: Story = {
  args: {
    title: 'Workspace settings',
    description: 'Manage workspace-level configuration and default permissions.',
    actions: (
      <>
        <Button variant="secondary" size="small">
          Reset
        </Button>
        <Button size="small">Save</Button>
      </>
    ),
    children: (
      <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
        <div>Default locale: ja-JP</div>
        <div>Fiscal year starts in April</div>
      </div>
    ),
    footer: 'Last updated: 2026-02-06',
  },
};

export const CompactCard: Story = {
  args: {
    title: 'Review queue',
    description: 'Pending records that require approval.',
    density: 'compact',
    actions: <Button size="small">Open queue</Button>,
    children: <div>12 requests pending.</div>,
  },
};

export const HistoryListCard: Story = {
  render: () => (
    <ListCard
      header="Recent updates"
      density="comfortable"
      items={[
        { id: '1', actor: 'Sato', action: 'approved invoice INV-2201' },
        { id: '2', actor: 'Tanaka', action: 're-opened approval APR-811' },
        { id: '3', actor: 'Suzuki', action: 'created project PRJ-991' },
      ]}
      renderItem={(item) => (
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <strong>{item.actor}</strong>
          <span>{item.action}</span>
        </div>
      )}
    />
  ),
};
