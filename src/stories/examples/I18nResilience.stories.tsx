import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Breadcrumb } from '../../patterns/Breadcrumb';
import { Tabs } from '../../patterns/Tabs';
import { PageHeader } from '../../patterns/PageHeader';
import { SectionCard } from '../../patterns/SectionCard';
import { FilterBar } from '../../patterns/CrudList/FilterBar';
import { DataTable } from '../../patterns/CrudList/DataTable';

const meta: Meta = {
  title: 'Examples/I18n Resilience',
};

export default meta;
type Story = StoryObj;

const wrapperStyle: CSSProperties = {
  maxWidth: '960px',
  margin: '0 auto',
  padding: 'var(--space-12)',
  display: 'grid',
  gap: 'var(--space-8)',
};

const localeColumns = [
  { key: 'id', header: 'ID', sortable: true, hideable: false },
  { key: 'vendor', header: '取引先 / Vendor / مورد', sortable: true },
  { key: 'description', header: '説明 / Description', sortable: true },
  { key: 'status', header: 'ステータス / الحالة', sortable: true },
];

const localeRows = [
  {
    id: 'INV-9001',
    vendor: '株式会社インターナショナル・ビジネス・ソリューションズ',
    description: '請求連携\n第二承認待ち',
    status: 'Pending',
  },
  {
    id: 'INV-9002',
    vendor: 'شركة النظم المؤسسية المتكاملة',
    description: 'ترحيل قيود الموردين - أسبوعي',
    status: 'Approved',
  },
  {
    id: 'INV-9003',
    vendor: 'บริษัท โซลูชัน ดิจิทัล เอ็นเตอร์ไพรส์ จำกัด',
    description: 'รายการค่าใช้จ่ายข้ามหน่วยงาน',
    status: 'Draft',
  },
];

const toScreenshotIfSupported = async (target: HTMLElement, name: string) => {
  const browserExpect = expect as unknown as {
    element?: (node: HTMLElement) => {
      toMatchScreenshot: (
        screenshotName: string,
        options?: {
          comparatorOptions?: {
            allowedMismatchedPixelRatio?: number;
          };
        }
      ) => Promise<void>;
    };
  };

  if (typeof browserExpect.element === 'function') {
    await browserExpect.element(target).toMatchScreenshot(name, {
      comparatorOptions: {
        allowedMismatchedPixelRatio: 0.01,
      },
    });
  }
};

export const LongTextMultibyte: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('all');

    const rows = useMemo(() => {
      const normalized = search.trim().toLowerCase();
      return localeRows.filter((row) => {
        const tabMatch = tab === 'all' || row.status.toLowerCase() === tab;
        const searchMatch =
          normalized.length === 0 ||
          row.vendor.toLowerCase().includes(normalized) ||
          row.description.toLowerCase().includes(normalized) ||
          row.id.toLowerCase().includes(normalized);
        return tabMatch && searchMatch;
      });
    }, [search, tab]);

    return (
      <div style={wrapperStyle} data-testid="i18n-ltr-surface">
        <PageHeader
          title="多言語請求ワークスペース / Multilingual Invoice Workspace / مساحة الفواتير متعددة اللغات"
          description="長文・多バイト・改行混在の表示崩れと操作性を確認するための検証サンプル。"
          breadcrumbs={[
            { id: 'home', label: 'Home', href: '#' },
            { id: 'finance', label: '財務会計 / Finance', href: '#' },
            { id: 'i18n', label: 'I18n Resilience' },
          ]}
        />

        <Tabs
          ariaLabel="Status tabs"
          value={tab}
          onValueChange={setTab}
          items={[
            { id: 'all', label: 'すべて / All' },
            { id: 'pending', label: '承認待ち / Pending' },
            { id: 'approved', label: '承認済み / Approved' },
            { id: 'draft', label: '下書き / Draft' },
          ]}
        />

        <h2 style={{ margin: 0, fontSize: 'var(--font-size-lg)' }}>
          Data View
        </h2>

        <SectionCard title="Filter + Table" description="入力欄の長文プレースホルダと表の折返し耐性を検証します。">
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <FilterBar
              search={{
                value: search,
                onChange: setSearch,
                ariaLabel: 'Search multilingual records',
                placeholder:
                  '例: 株式会社 / شركة / บริษัท / multilingual vendor or description',
              }}
              chips={search ? [{ key: 'search', label: `検索条件: ${search}` }] : []}
              onClearAll={() => setSearch('')}
            />

            <DataTable columns={localeColumns} rows={rows} pageSize={3} />

            <p data-testid="mixed-newline-text" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
              {'注記: 改行を含む文言でも可読性を維持する。\nNote: multiline labels must remain readable.'}
            </p>
          </div>
        </SectionCard>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('heading', {
        name: /Multilingual Invoice Workspace/i,
      })
    ).toBeInTheDocument();
    await expect(canvas.getByText(/شركة النظم المؤسسية المتكاملة/)).toBeInTheDocument();
    await expect(canvas.getByTestId('mixed-newline-text')).toHaveTextContent(
      'Note: multiline labels must remain readable.'
    );
    await toScreenshotIfSupported(
      canvas.getByTestId('i18n-ltr-surface'),
      'i18n-resilience-ltr'
    );
  },
};

export const RtlWorkspace: Story = {
  render: () => {
    return (
      <div style={wrapperStyle} dir="rtl" data-testid="i18n-rtl-surface">
        <Breadcrumb
          items={[
            { id: 'home', label: 'الرئيسية', href: '#' },
            { id: 'finance', label: 'المالية', href: '#' },
            { id: 'invoices', label: 'الفواتير متعددة اللغات' },
          ]}
        />

        <SectionCard
          title="تخطيط من اليمين إلى اليسار"
          description="التحقق من محاذاة العناوين والنصوص والجدول في وضع RTL."
        >
          <DataTable columns={localeColumns} rows={localeRows} pageSize={3} />
        </SectionCard>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const rtlSurface = canvas.getByTestId('i18n-rtl-surface');

    await expect(rtlSurface).toHaveAttribute('dir', 'rtl');
    await expect(canvas.getByText('الرئيسية')).toBeInTheDocument();
    await expect(canvas.getByText(/شركة النظم المؤسسية المتكاملة/)).toBeInTheDocument();
    await toScreenshotIfSupported(rtlSurface, 'i18n-resilience-rtl');
  },
};
