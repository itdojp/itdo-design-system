import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { BulkActionBar } from '../patterns/BulkActionBar';

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

describe('visual regression: bulk action bar', () => {
  test('selected rows with mixed actions', async () => {
    const browserExpect = expect as BrowserExpect;

    render(
      <div
        data-testid="bulk-action-surface"
        style={{
          width: '920px',
          padding: '16px',
          background: 'var(--color-bg-base)',
        }}
      >
        <BulkActionBar
          selectedCount={4}
          selectedRowsLabel={(count) => `${count} rows selected`}
          actions={[
            {
              key: 'approve',
              label: 'Approve selected',
              onSelect: () => undefined,
            },
            {
              key: 'assign',
              label: 'Assign reviewer',
              onSelect: () => undefined,
            },
            {
              key: 'delete',
              label: 'Delete selected',
              tone: 'danger',
              onSelect: () => undefined,
            },
          ]}
          clearSelectionLabel="Clear"
          onClearSelection={() => undefined}
        />
      </div>
    );

    await browserExpect.element(screen.getByTestId('bulk-action-surface')).toMatchScreenshot(
      'bulk-action-bar-default',
      {
        comparatorOptions: {
          allowedMismatchedPixelRatio: 0.01,
        },
      }
    );
  });
});
