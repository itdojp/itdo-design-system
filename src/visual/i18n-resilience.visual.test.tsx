import { describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageHeader } from '../patterns/PageHeader';
import { SectionCard } from '../patterns/SectionCard';
import { DataTable } from '../patterns/CrudList/DataTable';
import { Breadcrumb } from '../patterns/Breadcrumb';

const columns = [
  { key: 'id', header: 'ID', sortable: true, hideable: false },
  { key: 'vendor', header: '取引先 / Vendor / مورد', sortable: true },
  { key: 'description', header: '説明 / Description', sortable: true },
  { key: 'status', header: 'ステータス / الحالة', sortable: true },
];

const rows = [
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
];

type BrowserExpect = typeof expect & {
  element: (node: HTMLElement) => {
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

describe('visual regression: i18n resilience', () => {
  test('ltr long-text surface', async () => {
    const browserExpect = expect as BrowserExpect;

    render(
      <div
        data-testid="ltr-surface"
        style={{
          width: '920px',
          padding: '16px',
          display: 'grid',
          gap: '16px',
          background: 'var(--color-bg-base)',
        }}
      >
        <PageHeader
          title="多言語請求ワークスペース / Multilingual Invoice Workspace / مساحة الفواتير متعددة اللغات"
          description="長文・多バイト・改行混在の表示崩れ検証。"
          breadcrumbs={[
            { id: 'home', label: 'Home', href: '#' },
            { id: 'finance', label: 'Finance', href: '#' },
            { id: 'i18n', label: 'I18n' },
          ]}
        />
        <SectionCard title="Long Text Table">
          <DataTable columns={columns} rows={rows} pageSize={2} />
        </SectionCard>
      </div>
    );

    await browserExpect.element(screen.getByTestId('ltr-surface')).toMatchScreenshot(
      'i18n-resilience-ltr',
      {
        comparatorOptions: {
          allowedMismatchedPixelRatio: 0.01,
        },
      }
    );
  });

  test('rtl surface', async () => {
    const browserExpect = expect as BrowserExpect;

    render(
      <div
        dir="rtl"
        data-testid="rtl-surface"
        style={{
          width: '920px',
          padding: '16px',
          display: 'grid',
          gap: '16px',
          background: 'var(--color-bg-base)',
        }}
      >
        <Breadcrumb
          items={[
            { id: 'home', label: 'الرئيسية', href: '#' },
            { id: 'finance', label: 'المالية', href: '#' },
            { id: 'i18n', label: 'الفواتير متعددة اللغات' },
          ]}
        />
        <SectionCard title="تخطيط من اليمين إلى اليسار">
          <DataTable columns={columns} rows={rows} pageSize={2} />
        </SectionCard>
      </div>
    );

    await browserExpect.element(screen.getByTestId('rtl-surface')).toMatchScreenshot(
      'i18n-resilience-rtl',
      {
        comparatorOptions: {
          allowedMismatchedPixelRatio: 0.01,
        },
      }
    );
  });
});
