import { fireEvent, render, screen } from '@testing-library/react';
import { useCommandActions } from './useCommandActions';
import type { CommandPaletteAction } from '../patterns/CommandPalette/CommandPalette.types';

const actions: CommandPaletteAction[] = [
  {
    id: 'create-invoice',
    label: 'Create invoice',
    group: 'Finance',
    description: 'Create invoice workflow',
    keywords: ['invoice', 'finance'],
  },
  {
    id: 'open-timesheet',
    label: 'Open timesheet',
    group: 'Projects',
    description: 'Open timesheet page',
    keywords: ['timesheet', 'project'],
  },
];

const Harness = () => {
  const { query, setQuery, results, markRecent, clearRecent } = useCommandActions({
    actions,
    maxResults: 10,
    recentLimit: 4,
    recentStorageKey: 'test-command-recent',
  });

  return (
    <div>
      <input
        aria-label="query"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="button" onClick={() => markRecent('open-timesheet')}>
        recent-timesheet
      </button>
      <button type="button" onClick={() => clearRecent()}>
        clear-recent
      </button>
      <ul>
        {results.map((action) => (
          <li key={action.id}>
            {action.id}:{action.isRecent ? 'recent' : 'normal'}
          </li>
        ))}
      </ul>
    </div>
  );
};

describe('useCommandActions', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('filters by query with label/keyword matching', () => {
    render(<Harness />);

    fireEvent.change(screen.getByLabelText('query'), { target: { value: 'invoice' } });
    expect(screen.getByText('create-invoice:normal')).toBeInTheDocument();
    expect(screen.queryByText('open-timesheet:normal')).not.toBeInTheDocument();
  });

  it('moves selected action to recent and restores from localStorage', () => {
    const { rerender } = render(<Harness />);

    fireEvent.click(screen.getByText('recent-timesheet'));
    expect(screen.getByText('open-timesheet:recent')).toBeInTheDocument();

    rerender(<Harness />);
    expect(screen.getByText('open-timesheet:recent')).toBeInTheDocument();
  });

  it('clears recent actions', () => {
    render(<Harness />);

    fireEvent.click(screen.getByText('recent-timesheet'));
    fireEvent.click(screen.getByText('clear-recent'));

    expect(screen.getByText('open-timesheet:normal')).toBeInTheDocument();
  });
});
