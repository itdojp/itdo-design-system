import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { CommandPalette } from '../patterns/CommandPalette';

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

const actions = [
  {
    id: 'create-invoice',
    label: 'Create invoice',
    group: 'Finance',
    description: 'Open invoice creation flow',
    shortcut: 'G I',
    keywords: ['invoice', 'finance'],
  },
  {
    id: 'open-timesheet',
    label: 'Open timesheet',
    group: 'Projects',
    description: 'Open weekly timesheet',
    shortcut: 'G T',
    keywords: ['timesheet', 'hours'],
  },
  {
    id: 'pending-approvals',
    label: 'Pending approvals',
    group: 'Approvals',
    description: 'Review pending approval queue',
    shortcut: 'G A',
    keywords: ['approval', 'queue'],
  },
];

describe('visual regression: command palette', () => {
  test('open state', async () => {
    const browserExpect = expect as BrowserExpect;

    render(
      <CommandPalette
        open
        hotkey={false}
        onOpenChange={() => undefined}
        actions={actions}
      />
    );

    await browserExpect.element(screen.getByRole('dialog')).toMatchScreenshot(
      'command-palette-open',
      {
        comparatorOptions: {
          allowedMismatchedPixelRatio: 0.01,
        },
      }
    );
  });

  test('filtered state', async () => {
    const browserExpect = expect as BrowserExpect;

    render(
      <CommandPalette
        open
        hotkey={false}
        onOpenChange={() => undefined}
        actions={actions}
      />
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'invoice' } });

    await browserExpect.element(screen.getByRole('dialog')).toMatchScreenshot(
      'command-palette-filtered',
      {
        comparatorOptions: {
          allowedMismatchedPixelRatio: 0.01,
        },
      }
    );
  });
});
