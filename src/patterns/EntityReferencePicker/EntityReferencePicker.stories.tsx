import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, within } from 'storybook/test';
import { EntityReferencePicker } from './EntityReferencePicker';
import type { EntityReferenceCandidate, EntityReferenceValue } from './EntityReferencePicker.types';

const entities: EntityReferenceCandidate[] = [
  { id: 'PJ-1001', kind: 'project', label: 'ERP Migration', deepLink: '/projects/PJ-1001' },
  { id: 'PJ-2003', kind: 'project', label: 'Billing Revamp', deepLink: '/projects/PJ-2003' },
  { id: 'VN-042', kind: 'vendor', label: 'Shinano Systems', deepLink: '/vendors/VN-042' },
  { id: 'CU-314', kind: 'customer', label: 'Aozora Foods', deepLink: '/customers/CU-314' },
  { id: 'DOC-901', kind: 'document', label: 'Security Policy 2026', deepLink: '/docs/DOC-901' },
  { id: 'MSG-778', kind: 'chat_message', label: 'Ops handover memo', deepLink: '/chat/MSG-778' },
];

const filterByQuery = (query: string, kind: string) =>
  entities.filter((entity) => {
    if (entity.kind !== kind) {
      return false;
    }
    const normalized = `${entity.id} ${entity.label ?? ''}`.toLowerCase();
    return normalized.includes(query.toLowerCase());
  });

const fetchCandidates = async (query: string, kind: string) => {
  await new Promise((resolve) => window.setTimeout(resolve, 100));
  return filterByQuery(query, kind);
};

const meta: Meta<typeof EntityReferencePicker> = {
  title: 'Patterns/EntityReferencePicker',
  component: EntityReferencePicker,
  parameters: {
    docs: {
      description: {
        component:
          '内部参照（project/vendor/customer/document/chat_message）入力を共通化する picker。ID保持、ラベル表示、deepLink 連携を提供します。',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof EntityReferencePicker>;

export const SingleSelection: Story = {
  render: () => {
    const [value, setValue] = useState<EntityReferenceValue>(null);

    return (
      <EntityReferencePicker
        kinds={['project', 'customer']}
        scope="project_tree"
        fetchCandidates={fetchCandidates}
        value={value}
        onChange={setValue}
        label="Primary reference"
        placeholder="Search by ID or name"
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Primary reference' });
    fireEvent.change(input, { target: { value: 'erp' } });
    await expect(await canvas.findByRole('option', { name: /ERP Migration/i })).toBeInTheDocument();
  },
};

export const MultipleSelection: Story = {
  render: () => {
    const [value, setValue] = useState<EntityReferenceValue>([]);
    return (
      <EntityReferencePicker
        kinds={['project', 'vendor', 'document']}
        scope="global"
        fetchCandidates={fetchCandidates}
        value={value}
        onChange={setValue}
        multiple
        maxItems={3}
        label="Related references"
        hint="You can attach up to 3 references."
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Related references' });
    fireEvent.change(input, { target: { value: 'policy' } });
    await expect(await canvas.findByRole('option', { name: /Security Policy 2026/i })).toBeInTheDocument();
  },
};

export const MixedKinds: Story = {
  render: () => {
    const [value, setValue] = useState<EntityReferenceValue>([]);
    const placeholder = 'Try query: erp / shinano / policy / handover';

    return (
      <EntityReferencePicker
        kinds={['project', 'vendor', 'customer', 'document', 'chat_message']}
        scope="global"
        fetchCandidates={fetchCandidates}
        value={value}
        onChange={setValue}
        multiple
        maxItems={5}
        label="Cross-domain references"
        placeholder={placeholder}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole('combobox', { name: 'Cross-domain references' });
    fireEvent.change(input, { target: { value: 'o' } });
    await expect(await canvas.findByRole('option', { name: /Aozora Foods/i })).toBeInTheDocument();
    await expect(canvas.getByRole('option', { name: /Ops handover memo/i })).toBeInTheDocument();
  },
};
