import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SavedViewBar } from './SavedViewBar';
import { useSavedViews } from '../../hooks/useSavedViews';

const meta: Meta<typeof SavedViewBar> = {
  title: 'Patterns/SavedViewBar',
  component: SavedViewBar,
};

export default meta;
type Story = StoryObj<typeof SavedViewBar>;

export const Default: Story = {
  render: () => {
    const [search, setSearch] = useState('');
    const savedViews = useSavedViews<{ search: string }>({
      initialViews: [
        {
          id: 'all',
          name: 'All records',
          payload: { search: '' },
          shared: false,
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: '2026-02-01T00:00:00.000Z',
        },
        {
          id: 'pending',
          name: 'Pending only',
          payload: { search: 'pending' },
          shared: true,
          createdAt: '2026-02-01T00:00:00.000Z',
          updatedAt: '2026-02-01T00:00:00.000Z',
        },
      ],
      initialActiveViewId: 'all',
      createId: () => `view-${Math.random().toString(36).slice(2, 6)}`,
      now: () => new Date().toISOString(),
      shareBasePath: '/erp/list?savedView=',
    });

    const activePayload = useMemo(() => savedViews.activeView?.payload, [savedViews.activeView]);

    return (
      <div style={{ padding: 'var(--space-12)', display: 'grid', gap: 'var(--space-8)' }}>
        <SavedViewBar
          views={savedViews.views}
          activeViewId={savedViews.activeViewId}
          onSelectView={(viewId) => {
            savedViews.selectView(viewId);
            const selected = savedViews.views.find((view) => view.id === viewId);
            setSearch(selected?.payload.search ?? '');
          }}
          onSaveAs={(name) => {
            savedViews.createView(name, { search });
          }}
          onUpdateView={(viewId) => {
            savedViews.updateView(viewId, { payload: { search } });
          }}
          onDuplicateView={(viewId) => {
            savedViews.duplicateView(viewId);
          }}
          onShareView={(viewId) => {
            savedViews.toggleShared(viewId, true);
          }}
          onDeleteView={(viewId) => {
            savedViews.deleteView(viewId);
          }}
        />

        <label style={{ display: 'grid', gap: 'var(--space-2)', maxWidth: '360px' }}>
          <span>Current search query</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{
              height: 'var(--control-height-sm)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '0 var(--space-6)',
            }}
          />
        </label>

        <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
          Active payload: {JSON.stringify(activePayload ?? {})}
        </div>
      </div>
    );
  },
};

export const JapaneseLabels: Story = {
  args: {
    views: [
      {
        id: 'all',
        name: '全件',
        payload: {},
        createdAt: '2026-02-01T00:00:00.000Z',
        updatedAt: '2026-02-01T00:00:00.000Z',
      },
      {
        id: 'mine',
        name: '担当分',
        payload: {},
        createdAt: '2026-02-01T00:00:00.000Z',
        updatedAt: '2026-02-01T00:00:00.000Z',
      },
    ],
    activeViewId: 'all',
    onSelectView: () => undefined,
    onSaveAs: () => undefined,
    onUpdateView: () => undefined,
    onDuplicateView: () => undefined,
    onShareView: () => undefined,
    onDeleteView: () => undefined,
    labels: {
      title: '保存ビュー',
      saveAsPlaceholder: 'ビュー名',
      saveAsButton: '保存',
      update: '更新',
      duplicate: '複製',
      share: '共有',
      delete: '削除',
      active: '選択中ビュー',
    },
  },
};
