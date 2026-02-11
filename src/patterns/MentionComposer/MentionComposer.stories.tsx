import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import type { AttachmentRecord } from '../../types';
import { MentionComposer } from './MentionComposer';
import type { MentionTarget } from './MentionComposer.types';

const mentionTargets: MentionTarget[] = [
  { id: 'u-1', kind: 'user', label: 'Ayaka Ota' },
  { id: 'u-2', kind: 'user', label: 'Ryo Sato' },
  { id: 'g-ops', kind: 'group', label: 'Operations Team' },
  { id: 'g-sec', kind: 'group', label: 'Security Team' },
  { id: 'r-manager', kind: 'role', label: 'Project Manager' },
];

const fetchCandidates = async (query: string, kind: MentionTarget['kind']) => {
  await new Promise((resolve) => window.setTimeout(resolve, 100));
  return mentionTargets.filter((target) => {
    const sameKind = target.kind === kind;
    const hit = `${target.id} ${target.label}`.toLowerCase().includes(query.toLowerCase());
    return sameKind && hit;
  });
};

const attachments: AttachmentRecord[] = [
  {
    id: 'att-1',
    name: 'handover-notes.pdf',
    size: 120_000,
    mimeType: 'application/pdf',
    kind: 'pdf',
    status: 'uploaded',
    previewUrl: 'data:application/pdf;base64,JVBERi0xLjQK',
  },
];

const meta: Meta<typeof MentionComposer> = {
  title: 'Patterns/MentionComposer',
  component: MentionComposer,
  args: {
    onSubmit: fn(),
    onCancel: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof MentionComposer>;

export const ChatPost: Story = {
  render: (args) => {
    const [body, setBody] = useState('');
    const [mentions, setMentions] = useState<MentionTarget[]>([]);
    const [groups, setGroups] = useState<MentionTarget[]>([]);

    return (
      <MentionComposer
        {...args}
        body={body}
        onBodyChange={setBody}
        mentions={mentions}
        onMentionsChange={setMentions}
        groups={groups}
        onGroupsChange={setGroups}
        fetchCandidates={fetchCandidates}
        attachments={attachments}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const message = canvas.getByLabelText('Message');
    await userEvent.type(message, 'Daily sync completed');
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await expect(args.onSubmit).toHaveBeenCalled();
  },
};

export const AckRequired: Story = {
  render: (args) => {
    const [body, setBody] = useState('Please confirm by due date.');
    const [mentions, setMentions] = useState<MentionTarget[]>([
      { id: 'u-1', kind: 'user', label: 'Ayaka Ota' },
    ]);
    const [groups, setGroups] = useState<MentionTarget[]>([
      { id: 'g-ops', kind: 'group', label: 'Operations Team' },
    ]);
    const [dueAt, setDueAt] = useState<string | undefined>('2026-02-12T10:00');

    return (
      <MentionComposer
        {...args}
        body={body}
        onBodyChange={setBody}
        mentions={mentions}
        onMentionsChange={setMentions}
        groups={groups}
        onGroupsChange={setGroups}
        requiredUsers={[{ id: 'u-2', kind: 'user', label: 'Ryo Sato' }]}
        requiredGroups={[{ id: 'g-sec', kind: 'group', label: 'Security Team' }]}
        requiredRoles={[{ id: 'r-manager', kind: 'role', label: 'Project Manager' }]}
        dueAt={dueAt}
        onDueAtChange={setDueAt}
        fetchCandidates={fetchCandidates}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Required targets')).toBeInTheDocument();
    await expect(canvas.getByLabelText('Due at')).toHaveValue('2026-02-12T10:00');
  },
};
