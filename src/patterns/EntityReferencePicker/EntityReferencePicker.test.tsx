import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { EntityReferencePicker } from './EntityReferencePicker';
import type { EntityReferenceCandidate, EntityReferenceItem } from './EntityReferencePicker.types';

describe('EntityReferencePicker', () => {
  it('fetches candidates for each kind with shared scope', async () => {
    const fetchCandidates = jest.fn(
      async (query: string, kind: string, scope: string): Promise<EntityReferenceCandidate[]> => {
        return [{ id: `${kind}-1`, kind, label: `${query}-${scope}` }];
      }
    );

    render(
      <EntityReferencePicker
        kinds={['project', 'vendor']}
        scope="project_tree"
        fetchCandidates={fetchCandidates}
        value={null}
        onChange={jest.fn()}
        searchDebounceMs={0}
      />
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Reference' }), {
      target: { value: 'erp' },
    });

    await waitFor(() => {
      expect(fetchCandidates).toHaveBeenCalledWith('erp', 'project', 'project_tree');
      expect(fetchCandidates).toHaveBeenCalledWith('erp', 'vendor', 'project_tree');
    });
  });

  it('returns single value with renderLabel and toDeepLink', async () => {
    const fetchCandidates = jest.fn(async (): Promise<EntityReferenceCandidate[]> => [
      { id: 'PJ-1001', kind: 'project', label: 'ERP Migration' },
    ]);
    const onChange = jest.fn();

    render(
      <EntityReferencePicker
        kinds={['project']}
        scope="global"
        fetchCandidates={fetchCandidates}
        value={null}
        onChange={onChange}
        renderLabel={(entity) => `#${entity.id} ${entity.label}`}
        toDeepLink={(entity) => `/projects/${entity.id}`}
        searchDebounceMs={0}
      />
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Reference' }), {
      target: { value: 'erp' },
    });

    fireEvent.click(await screen.findByRole('option', { name: /#PJ-1001 ERP Migration/i }));

    expect(onChange).toHaveBeenCalledWith({
      id: 'PJ-1001',
      kind: 'project',
      label: '#PJ-1001 ERP Migration',
      deepLink: '/projects/PJ-1001',
    });
  });

  it('disables additional selection when maxItems is reached', async () => {
    const fetchCandidates = jest.fn(async (): Promise<EntityReferenceCandidate[]> => [
      { id: 'DOC-1', kind: 'document', label: 'Policy' },
    ]);
    const selected: EntityReferenceItem[] = [
      { id: 'DOC-0', kind: 'document', label: 'Runbook', deepLink: '/docs/DOC-0' },
    ];

    render(
      <EntityReferencePicker
        kinds={['document']}
        scope="global"
        fetchCandidates={fetchCandidates}
        value={selected}
        onChange={jest.fn()}
        multiple
        maxItems={1}
        searchDebounceMs={0}
      />
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Reference' }), {
      target: { value: 'policy' },
    });

    const option = await screen.findByRole('option', { name: /Policy/i });
    expect(option).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Up to 1 items can be selected.')).toBeInTheDocument();
  });

  it('renders mixed kinds in candidates and supports remove action', async () => {
    const fetchCandidates = jest.fn(
      async (_query: string, kind: string): Promise<EntityReferenceCandidate[]> => {
        if (kind === 'project') {
          return [{ id: 'PJ-7', kind: 'project', label: 'Ops rollout' }];
        }
        return [{ id: 'MSG-7', kind: 'chat_message', label: 'handover memo' }];
      }
    );
    const onChange = jest.fn();

    render(
      <EntityReferencePicker
        kinds={['project', 'chat_message']}
        scope="global"
        fetchCandidates={fetchCandidates}
        value={[
          {
            id: 'PJ-1',
            kind: 'project',
            label: 'Current project',
            deepLink: '/projects/PJ-1',
          },
        ]}
        onChange={onChange}
        multiple
        searchDebounceMs={0}
      />
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Reference' }), {
      target: { value: 'o' },
    });

    expect(await screen.findByRole('option', { name: /Ops rollout/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /handover memo/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Remove Current project' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('supports keyboard navigation, selection, and escape close', async () => {
    const fetchCandidates = jest.fn(async (): Promise<EntityReferenceCandidate[]> => [
      { id: 'PJ-1001', kind: 'project', label: 'ERP Migration' },
      { id: 'PJ-2003', kind: 'project', label: 'Billing Revamp' },
    ]);
    const onChange = jest.fn();

    render(
      <EntityReferencePicker
        kinds={['project']}
        scope="global"
        fetchCandidates={fetchCandidates}
        value={null}
        onChange={onChange}
        searchDebounceMs={0}
      />
    );

    const input = screen.getByRole('combobox', { name: 'Reference' });
    fireEvent.change(input, { target: { value: 'p' } });

    await screen.findByRole('option', { name: /ERP Migration/i });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.getAttribute('aria-activedescendant')?.endsWith('-option-1')).toBe(true);

    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input.getAttribute('aria-activedescendant')?.endsWith('-option-0')).toBe(true);

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith({
      id: 'PJ-2003',
      kind: 'project',
      label: 'Billing Revamp',
      deepLink: undefined,
    });

    fireEvent.change(input, { target: { value: 'erp' } });
    await screen.findByRole('option', { name: /ERP Migration/i });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).toHaveValue('');
    expect(screen.queryByRole('option', { name: /ERP Migration/i })).not.toBeInTheDocument();
  });

  it('removes last selected item by backspace in multiple mode', () => {
    const onChange = jest.fn();

    render(
      <EntityReferencePicker
        kinds={['project']}
        scope="global"
        fetchCandidates={jest.fn()}
        value={[
          { id: 'PJ-1', kind: 'project', label: 'Current project' },
          { id: 'PJ-2', kind: 'project', label: 'Next project' },
        ]}
        onChange={onChange}
        multiple
        searchDebounceMs={0}
      />
    );

    const input = screen.getByRole('combobox', { name: 'Reference' });
    fireEvent.keyDown(input, { key: 'Backspace' });

    expect(onChange).toHaveBeenCalledWith([{ id: 'PJ-1', kind: 'project', label: 'Current project' }]);
  });

  it('clamps active option when visible candidate count decreases', async () => {
    const fetchCandidates = jest.fn(async (): Promise<EntityReferenceCandidate[]> => [
      { id: 'PJ-1001', kind: 'project', label: 'ERP Migration' },
      { id: 'PJ-2003', kind: 'project', label: 'Billing Revamp' },
      { id: 'PJ-3001', kind: 'project', label: 'Ops Revamp' },
    ]);
    const onChange = jest.fn();

    const kinds = ['project'];

    const { rerender } = render(
      <EntityReferencePicker
        kinds={kinds}
        scope="global"
        fetchCandidates={fetchCandidates}
        value={[]}
        onChange={onChange}
        multiple
        searchDebounceMs={0}
      />
    );

    const input = screen.getByRole('combobox', { name: 'Reference' });
    fireEvent.change(input, { target: { value: 'p' } });
    await screen.findByRole('option', { name: /Ops Revamp/i });

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input.getAttribute('aria-activedescendant')?.endsWith('-option-2')).toBe(true);

    rerender(
      <EntityReferencePicker
        kinds={kinds}
        scope="global"
        fetchCandidates={fetchCandidates}
        value={[{ id: 'PJ-3001', kind: 'project', label: 'Ops Revamp' }]}
        onChange={onChange}
        multiple
        searchDebounceMs={0}
      />
    );

    await waitFor(() => {
      expect(input.getAttribute('aria-activedescendant')?.endsWith('-option-1')).toBe(true);
    });
  });
});
