import { useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../../components/Button';
import { Dialog } from '../../components/Dialog';
import { FormField } from '../../components/FormField';
import { Input } from '../../components/Input';
import { SectionCard } from '../../patterns/SectionCard';
import { DataTable } from '../../patterns/CrudList/DataTable';

const meta: Meta = {
  title: 'Examples/High Contrast Theme',
};

export default meta;
type Story = StoryObj;

const columns = [
  { key: 'id', header: 'ID', sortable: true, hideable: false },
  { key: 'requester', header: 'Requester', sortable: true },
  { key: 'status', header: 'Status', sortable: true },
];

const rows = [
  { id: 'AP-3001', requester: 'Sato', status: 'Open' },
  { id: 'AP-3002', requester: 'Tanaka', status: 'Approved' },
  { id: 'AP-3003', requester: 'Suzuki', status: 'Returned' },
];

const HighContrastSurface = () => {
  useEffect(() => {
    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-theme');
    root.setAttribute('data-theme', 'high-contrast');

    return () => {
      if (previousTheme) {
        root.setAttribute('data-theme', previousTheme);
      } else {
        root.removeAttribute('data-theme');
      }
    };
  }, []);

  return (
    <div
      style={{
        maxWidth: '960px',
        margin: '0 auto',
        padding: 'var(--space-12)',
        display: 'grid',
        gap: 'var(--space-8)',
      }}
      data-testid="high-contrast-surface"
    >
      <h2 style={{ margin: 0 }}>High Contrast Preview</h2>

      <SectionCard
        title="Input and actions"
        description="確認対象: Button / FormField / Input の境界線、フォーカスリング、テキスト可読性"
      >
        <div style={{ display: 'grid', gap: 'var(--space-4)', maxWidth: '360px' }}>
          <FormField
            label="Approval title"
            description="Apply semantic text and border tokens under high contrast mode."
            required
          >
            <Input placeholder="Enter approval title" />
          </FormField>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <Button type="button">Primary action</Button>
            <Button type="button" variant="secondary">
              Secondary action
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Data view"
        description="確認対象: 表ヘッダー/行境界/選択背景の視認性"
      >
        <DataTable columns={columns} rows={rows} pageSize={3} />
      </SectionCard>

      <SectionCard
        title="Dialog"
        description="確認対象: オーバーレイ、タイトル、説明文、アクションの視認性"
      >
        <Dialog
          open
          onClose={() => undefined}
          portal={false}
          title="Approval review"
          description="Confirm this request before final approval."
          confirmAction={<Button type="button">Approve</Button>}
          cancelAction={
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          }
        >
          <p style={{ margin: 0 }}>
            Review all supporting records and ensure policy compliance before submitting.
          </p>
        </Dialog>
      </SectionCard>
    </div>
  );
};

export const Default: Story = {
  render: () => <HighContrastSurface />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(document.documentElement).toHaveAttribute('data-theme', 'high-contrast');
    await expect(canvas.getByRole('heading', { name: 'High Contrast Preview' })).toBeInTheDocument();
    await expect(canvas.getByRole('cell', { name: 'AP-3001' })).toBeInTheDocument();
    await expect(canvas.getByRole('dialog', { name: 'Approval review' })).toBeInTheDocument();

    const borderStrong = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-border-strong')
      .trim();
    await expect(borderStrong).toBe('#000000');
  },
};
