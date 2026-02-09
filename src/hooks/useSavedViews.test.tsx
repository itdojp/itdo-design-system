import { fireEvent, render, screen } from '@testing-library/react';
import { useSavedViews } from './useSavedViews';
import type { SavedViewsStorageAdapter } from '../types';

interface Payload {
  search: string;
}

const initialViews = [
  {
    id: 'all',
    name: 'All',
    payload: { search: '' },
    shared: false,
    createdAt: '2026-02-01T00:00:00.000Z',
    updatedAt: '2026-02-01T00:00:00.000Z',
  },
];

const createAdapter = (): SavedViewsStorageAdapter<Payload> => ({
  load: jest.fn(async () => initialViews),
  save: jest.fn(async () => undefined),
});

let idSequence = 0;

const Harness = ({ adapter }: { adapter: SavedViewsStorageAdapter<Payload> }) => {
  const {
    views,
    activeViewId,
    createView,
    duplicateView,
    toggleShared,
    deleteView,
    getShareLink,
    selectView,
  } = useSavedViews<Payload>({
    storageAdapter: adapter,
    createId: () => `generated-id-${++idSequence}`,
    now: () => '2026-02-09T12:00:00.000Z',
    shareBasePath: '/erp?view=',
  });

  return (
    <div>
      <button type="button" onClick={() => createView('Pending', { search: 'pending' })}>
        create
      </button>
      <button type="button" onClick={() => duplicateView('all')}>
        duplicate
      </button>
      <button type="button" onClick={() => toggleShared('all', true)}>
        share
      </button>
      <button type="button" onClick={() => deleteView('all')}>
        delete
      </button>
      <button type="button" onClick={() => selectView('all')}>
        select-all
      </button>
      <div data-testid="active">{activeViewId ?? ''}</div>
      <div data-testid="share-link">{getShareLink('all')}</div>
      <ul>
        {views.map((view) => (
          <li key={view.id}>
            {view.id}:{view.name}:{view.shared ? 'shared' : 'private'}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('useSavedViews', () => {
  beforeEach(() => {
    idSequence = 0;
  });

  it('loads from storage adapter and allows selection', async () => {
    const adapter = createAdapter();
    render(<Harness adapter={adapter} />);

    expect(await screen.findByText('all:All:private')).toBeInTheDocument();
    fireEvent.click(screen.getByText('select-all'));
    expect(screen.getByTestId('active')).toHaveTextContent('all');
  });

  it('creates and duplicates views', async () => {
    const adapter = createAdapter();
    render(<Harness adapter={adapter} />);

    await screen.findByText('all:All:private');
    fireEvent.click(screen.getByText('create'));
    expect(screen.getByText('generated-id-1:Pending:private')).toBeInTheDocument();

    fireEvent.click(screen.getByText('duplicate'));
    expect(screen.getByText('generated-id-2:All (copy):private')).toBeInTheDocument();
  });

  it('toggles shared and deletes a view', async () => {
    const adapter = createAdapter();
    render(<Harness adapter={adapter} />);

    await screen.findByText('all:All:private');
    fireEvent.click(screen.getByText('share'));
    expect(screen.getByText('all:All:shared')).toBeInTheDocument();

    fireEvent.click(screen.getByText('delete'));
    expect(screen.queryByText('all:All:shared')).not.toBeInTheDocument();
  });

  it('returns share link from configured base path', async () => {
    const adapter = createAdapter();
    render(<Harness adapter={adapter} />);

    await screen.findByText('all:All:private');
    expect(screen.getByTestId('share-link')).toHaveTextContent('/erp?view=all');
  });
});
