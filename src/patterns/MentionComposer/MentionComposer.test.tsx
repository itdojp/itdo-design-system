import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MentionComposer } from './MentionComposer';
import type { MentionComposerProps, MentionTarget } from './MentionComposer.types';

const sampleTargets: MentionTarget[] = [
  { id: 'u-1', kind: 'user', label: 'Ayaka Ota' },
  { id: 'g-ops', kind: 'group', label: 'Operations Team' },
  { id: 'r-manager', kind: 'role', label: 'Project Manager' },
];

const fetchCandidates: MentionComposerProps['fetchCandidates'] = async (query, kind) =>
  sampleTargets.filter((target) => {
    const sameKind = target.kind === kind;
    const hit = `${target.id} ${target.label}`.toLowerCase().includes(query.toLowerCase());
    return sameKind && hit;
  });

const ComposerHarness = ({
  initialBody = '',
  initialMentions = [],
  initialGroups = [],
  limits,
  onSubmit = jest.fn(),
}: {
  initialBody?: string;
  initialMentions?: MentionTarget[];
  initialGroups?: MentionTarget[];
  limits?: MentionComposerProps['limits'];
  onSubmit?: MentionComposerProps['onSubmit'];
}) => {
  const [body, setBody] = useState(initialBody);
  const [mentions, setMentions] = useState<MentionTarget[]>(initialMentions);
  const [groups, setGroups] = useState<MentionTarget[]>(initialGroups);

  return (
    <MentionComposer
      body={body}
      onBodyChange={setBody}
      mentions={mentions}
      onMentionsChange={setMentions}
      groups={groups}
      onGroupsChange={setGroups}
      fetchCandidates={fetchCandidates}
      limits={limits}
      onSubmit={onSubmit}
    />
  );
};

describe('MentionComposer', () => {
  it('submits on Enter and keeps Shift+Enter as newline input', () => {
    const onSubmit = jest.fn();
    render(<ComposerHarness initialBody="status update" onSubmit={onSubmit} />);

    const textarea = screen.getByLabelText('Message');
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(onSubmit).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: true });
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('adds mention candidate by keyboard Enter', async () => {
    render(<ComposerHarness initialBody="hello" />);

    const mentionInput = screen.getByRole('combobox', { name: 'Mentions' });
    fireEvent.change(mentionInput, { target: { value: 'ayaka' } });

    const option = await screen.findByRole('option', { name: /Ayaka Ota/i });
    expect(option).toBeInTheDocument();

    fireEvent.keyDown(mentionInput, { key: 'Enter' });
    expect(await screen.findByText('Ayaka Ota')).toBeInTheDocument();
  });

  it('prevents additional mention when maxMentions is reached', async () => {
    render(
      <ComposerHarness
        initialBody="hello"
        initialMentions={[{ id: 'u-1', kind: 'user', label: 'Ayaka Ota' }]}
        limits={{ maxMentions: 1 }}
      />
    );

    const mentionInput = screen.getByRole('combobox', { name: 'Mentions' });
    fireEvent.change(mentionInput, { target: { value: 'project' } });

    const option = await screen.findByRole('option', { name: /Project Manager/i });
    expect(option).toBeDisabled();
  });

  it('renders required targets and emits dueAt change', () => {
    const onDueAtChange = jest.fn();

    render(
      <MentionComposer
        body="ack message"
        onBodyChange={jest.fn()}
        mentions={[]}
        onMentionsChange={jest.fn()}
        groups={[]}
        onGroupsChange={jest.fn()}
        requiredUsers={[{ id: 'u-1', kind: 'user', label: 'Ayaka Ota' }]}
        requiredGroups={[{ id: 'g-ops', kind: 'group', label: 'Operations Team' }]}
        requiredRoles={[{ id: 'r-manager', kind: 'role', label: 'Project Manager' }]}
        dueAt="2026-02-12T10:00"
        onDueAtChange={onDueAtChange}
        fetchCandidates={fetchCandidates}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Required targets')).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Due at'), {
      target: { value: '2026-02-12T18:00' },
    });
    expect(onDueAtChange).toHaveBeenCalledWith('2026-02-12T18:00');
  });
});
