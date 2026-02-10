import { afterEach, beforeEach, describe, expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/Button';
import { Dialog } from '../components/Dialog';
import { FormField } from '../components/FormField';
import { Input } from '../components/Input';
import { SectionCard } from '../patterns/SectionCard';
import { DataTable } from '../patterns/CrudList/DataTable';

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

describe('visual regression: high contrast core components', () => {
  let previousTheme: string | null = null;

  beforeEach(() => {
    previousTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'high-contrast');
  });

  afterEach(() => {
    if (previousTheme) {
      document.documentElement.setAttribute('data-theme', previousTheme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  });

  test('core surface remains stable in high contrast', async () => {
    const browserExpect = expect as BrowserExpect;

    render(
      <div
        data-testid="high-contrast-core-surface"
        style={{
          width: '960px',
          padding: '16px',
          display: 'grid',
          gap: '16px',
          background: 'var(--color-bg-base)',
        }}
      >
        <SectionCard title="Controls">
          <div style={{ display: 'grid', gap: '12px', maxWidth: '360px' }}>
            <FormField
              label="Approval title"
              description="Focus ring and border should remain clear under high contrast."
            >
              <Input placeholder="Enter approval title" />
            </FormField>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button type="button">Primary</Button>
              <Button type="button" variant="secondary">
                Secondary
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="DataTable">
          <DataTable columns={columns} rows={rows} pageSize={3} />
        </SectionCard>

        <SectionCard title="Dialog">
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

    await browserExpect.element(screen.getByTestId('high-contrast-core-surface')).toMatchScreenshot(
      'high-contrast-core',
      {
        comparatorOptions: {
          allowedMismatchedPixelRatio: 0.01,
        },
      }
    );
  });
});
