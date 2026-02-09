import { fireEvent, render, screen } from '@testing-library/react';
import { SavedViewBar } from './SavedViewBar';
import type { SavedViewRecord } from '../../types';

const views: SavedViewRecord[] = [
  {
    id: 'all',
    name: 'All records',
    payload: { search: '' },
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
  {
    id: 'pending',
    name: 'Pending only',
    payload: { search: 'pending' },
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

describe('SavedViewBar', () => {
  it('selects active view by clicking a chip', () => {
    const onSelectView = jest.fn();
    render(<SavedViewBar views={views} activeViewId="all" onSelectView={onSelectView} onSaveAs={jest.fn()} />);

    fireEvent.click(screen.getByRole('radio', { name: 'Pending only' }));
    expect(onSelectView).toHaveBeenCalledWith('pending');
  });

  it('saves a new view from input and button', () => {
    const onSaveAs = jest.fn();
    render(<SavedViewBar views={views} activeViewId="all" onSelectView={jest.fn()} onSaveAs={onSaveAs} />);

    fireEvent.change(screen.getByLabelText('New view name'), {
      target: { value: 'High Priority' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Save as new' }));
    expect(onSaveAs).toHaveBeenCalledWith('High Priority');
  });

  it('triggers update/duplicate/share/delete actions for active view', () => {
    const onUpdateView = jest.fn();
    const onDuplicateView = jest.fn();
    const onShareView = jest.fn();
    const onDeleteView = jest.fn();

    render(
      <SavedViewBar
        views={views}
        activeViewId="all"
        onSelectView={jest.fn()}
        onSaveAs={jest.fn()}
        onUpdateView={onUpdateView}
        onDuplicateView={onDuplicateView}
        onShareView={onShareView}
        onDeleteView={onDeleteView}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Update' }));
    fireEvent.click(screen.getByRole('button', { name: 'Duplicate' }));
    fireEvent.click(screen.getByRole('button', { name: 'Share' }));
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));

    expect(onUpdateView).toHaveBeenCalledWith('all');
    expect(onDuplicateView).toHaveBeenCalledWith('all');
    expect(onShareView).toHaveBeenCalledWith('all');
    expect(onDeleteView).toHaveBeenCalledWith('all');
  });

  it('supports custom i18n labels', () => {
    render(
      <SavedViewBar
        views={views}
        activeViewId="all"
        onSelectView={jest.fn()}
        onSaveAs={jest.fn()}
        labels={{
          title: '保存ビュー',
          saveAsPlaceholder: 'ビュー名',
          saveAsButton: '保存',
          update: '更新',
          duplicate: '複製',
          share: '共有',
          delete: '削除',
          active: '選択中ビュー',
        }}
      />
    );

    expect(screen.getByRole('heading', { name: '保存ビュー' })).toBeInTheDocument();
    expect(screen.getByLabelText('ビュー名')).toBeInTheDocument();
    expect(screen.getByRole('radiogroup', { name: '選択中ビュー' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });
});
