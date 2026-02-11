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
    expect(option).toBeDisabled();
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
});
