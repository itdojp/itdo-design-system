import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import { createLocalStorageDraftAutosaveAdapter, useDraftAutosave } from './useDraftAutosave';
import type { DraftAutosaveAdapter, DraftSnapshot } from '../types';

interface DraftForm {
  name: string;
  amount: number;
}

const createMemoryAdapter = (initial: DraftSnapshot<DraftForm> | null = null) => {
  let snapshot = initial;

  const adapter: DraftAutosaveAdapter<DraftForm> = {
    load: jest.fn(async () => snapshot),
    save: jest.fn(async (next) => {
      snapshot = next;
    }),
    clear: jest.fn(async () => {
      snapshot = null;
    }),
  };

  return {
    adapter,
    setSnapshot: (next: DraftSnapshot<DraftForm> | null) => {
      snapshot = next;
    },
    getSnapshot: () => snapshot,
  };
};

const Harness = ({
  adapter,
  intervalMs = 5000,
}: {
  adapter: DraftAutosaveAdapter<DraftForm>;
  intervalMs?: number;
}) => {
  const [value, setValue] = useState<DraftForm>({ name: 'Initial', amount: 1 });
  const autosave = useDraftAutosave<DraftForm>({
    value,
    adapter,
    onRestore: setValue,
    intervalMs,
    now: () => '2026-02-09T00:00:00.000Z',
  });

  return (
    <div>
      <button type="button" onClick={() => setValue((previous) => ({ ...previous, name: 'Updated' }))}>
        change
      </button>
      <button type="button" onClick={() => void autosave.saveNow()}>
        save-now
      </button>
      <button type="button" onClick={autosave.restoreDraft} disabled={!autosave.hasRestorableDraft}>
        restore
      </button>
      <button type="button" onClick={() => void autosave.clearDraft()}>
        clear
      </button>
      <div data-testid="name">{value.name}</div>
      <div data-testid="status">{autosave.status}</div>
      <div data-testid="dirty">{autosave.isDirty ? 'dirty' : 'clean'}</div>
      <div data-testid="restorable">{autosave.hasRestorableDraft ? 'yes' : 'no'}</div>
      <div data-testid="conflict">{autosave.conflict ? 'yes' : 'no'}</div>
    </div>
  );
};

describe('useDraftAutosave', () => {
  const flushPromises = async () => {
    await act(async () => {
      await Promise.resolve();
    });
  };

  it('restores a previously saved draft when requested', async () => {
    const snapshot: DraftSnapshot<DraftForm> = {
      payload: { name: 'Recovered', amount: 2 },
      hash: JSON.stringify({ name: 'Recovered', amount: 2 }),
      revision: 1,
      savedAt: '2026-02-08T10:00:00.000Z',
    };
    const { adapter } = createMemoryAdapter(snapshot);

    render(<Harness adapter={adapter} />);
    await flushPromises();

    expect(await screen.findByTestId('restorable')).toHaveTextContent('yes');
    fireEvent.click(screen.getByText('restore'));

    expect(screen.getByTestId('name')).toHaveTextContent('Recovered');
    expect(screen.getByTestId('restorable')).toHaveTextContent('no');
  });

  it('autosaves draft when value changes and interval elapses', async () => {
    jest.useFakeTimers();
    const { adapter, getSnapshot } = createMemoryAdapter(null);

    render(<Harness adapter={adapter} intervalMs={1000} />);
    await flushPromises();
    fireEvent.click(screen.getByText('change'));

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(adapter.save).toHaveBeenCalledTimes(1);
    });
    expect(getSnapshot()).not.toBeNull();
    expect(screen.getByTestId('status')).toHaveTextContent('saved');

    jest.useRealTimers();
  });

  it('detects revision conflict during save', async () => {
    const initial: DraftSnapshot<DraftForm> = {
      payload: { name: 'Initial', amount: 1 },
      hash: JSON.stringify({ name: 'Initial', amount: 1 }),
      revision: 1,
      savedAt: '2026-02-08T10:00:00.000Z',
    };
    const memory = createMemoryAdapter(initial);

    render(<Harness adapter={memory.adapter} />);
    await flushPromises();

    fireEvent.click(screen.getByText('change'));
    memory.setSnapshot({
      payload: { name: 'Remote change', amount: 9 },
      hash: JSON.stringify({ name: 'Remote change', amount: 9 }),
      revision: 2,
      savedAt: '2026-02-09T01:00:00.000Z',
    });

    fireEvent.click(screen.getByText('save-now'));

    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('conflict');
    });
    expect(screen.getByTestId('conflict')).toHaveTextContent('yes');
  });

  it('pauses interval autosave while conflict status is active', async () => {
    jest.useFakeTimers();
    const initial: DraftSnapshot<DraftForm> = {
      payload: { name: 'Initial', amount: 1 },
      hash: JSON.stringify({ name: 'Initial', amount: 1 }),
      revision: 1,
      savedAt: '2026-02-08T10:00:00.000Z',
    };
    const memory = createMemoryAdapter(initial);

    render(<Harness adapter={memory.adapter} intervalMs={1000} />);
    await flushPromises();

    fireEvent.click(screen.getByText('change'));
    memory.setSnapshot({
      payload: { name: 'Remote change', amount: 9 },
      hash: JSON.stringify({ name: 'Remote change', amount: 9 }),
      revision: 2,
      savedAt: '2026-02-09T01:00:00.000Z',
    });

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    await waitFor(() => {
      expect(screen.getByTestId('status')).toHaveTextContent('conflict');
    });

    const loadCallsAtConflict = (memory.adapter.load as jest.Mock).mock.calls.length;

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    expect((memory.adapter.load as jest.Mock).mock.calls.length).toBe(loadCallsAtConflict);
    jest.useRealTimers();
  });

  it('returns null for corrupted local storage snapshot shape', async () => {
    window.localStorage.setItem(
      'itdo-draft-autosave-corrupted',
      JSON.stringify({ revision: 'invalid', savedAt: 123, hash: null })
    );
    const adapter = createLocalStorageDraftAutosaveAdapter('itdo-draft-autosave-corrupted');

    const loaded = await adapter.load();

    expect(loaded).toBeNull();
    window.localStorage.removeItem('itdo-draft-autosave-corrupted');
  });
});
