import type { Meta, StoryObj } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import { expect, fireEvent, within } from 'storybook/test';
import { Input } from '../../components/Input';
import { Textarea } from '../../components/Textarea';
import { createLocalStorageDraftAutosaveAdapter, useDraftAutosave } from '../../hooks/useDraftAutosave';
import { FormWizard } from './FormWizard';

interface ProjectDraft {
  client: string;
  budget: string;
  notes: string;
  confirmed: boolean;
}

const meta: Meta<typeof FormWizard> = {
  title: 'Patterns/FormWizard',
  component: FormWizard,
};

export default meta;

type Story = StoryObj<typeof FormWizard>;

const WizardHarness = () => {
  const [draft, setDraft] = useState<ProjectDraft>({
    client: '',
    budget: '',
    notes: '',
    confirmed: false,
  });
  const [submitMessage, setSubmitMessage] = useState('Not submitted');

  const adapter = useMemo(
    () => createLocalStorageDraftAutosaveAdapter<ProjectDraft>('storybook-form-wizard-draft'),
    []
  );

  const autosave = useDraftAutosave<ProjectDraft>({
    value: draft,
    adapter,
    onRestore: setDraft,
    intervalMs: 2000,
  });

  const steps = [
    {
      id: 'basic',
      title: 'Basic Info',
      description: 'Set customer and project baseline.',
      isComplete: draft.client.trim().length > 0,
      content: (
        <Input
          label="Client"
          placeholder="ITDO Corp"
          value={draft.client}
          onChange={(event) => setDraft((previous) => ({ ...previous, client: event.target.value }))}
        />
      ),
    },
    {
      id: 'budget',
      title: 'Budget',
      description: 'Register requested amount and notes.',
      isComplete: draft.budget.trim().length > 0,
      content: (
        <>
          <Input
            label="Budget"
            type="number"
            value={draft.budget}
            onChange={(event) => setDraft((previous) => ({ ...previous, budget: event.target.value }))}
          />
          <Textarea
            label="Notes"
            value={draft.notes}
            onChange={(event) => setDraft((previous) => ({ ...previous, notes: event.target.value }))}
          />
        </>
      ),
    },
    {
      id: 'review',
      title: 'Review',
      description: 'Confirm before final submission.',
      isComplete: draft.confirmed,
      content: (
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={draft.confirmed}
            onChange={(event) => setDraft((previous) => ({ ...previous, confirmed: event.target.checked }))}
          />
          I confirm this data is ready to submit.
        </label>
      ),
    },
  ];

  return (
    <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
      <FormWizard
        steps={steps}
        autosave={{
          status: autosave.status,
          lastSavedAt: autosave.lastSavedAt,
          message: autosave.errorMessage,
          onRestoreDraft: autosave.hasRestorableDraft ? autosave.restoreDraft : undefined,
          onRetrySave: () => {
            void autosave.saveNow();
          },
        }}
        isDirty={autosave.isDirty}
        protectUnsavedChanges
        onSubmit={() => setSubmitMessage('Submitted')}
      />
      <p data-testid="wizard-submit-message" style={{ margin: 0 }}>
        {submitMessage}
      </p>
    </div>
  );
};

export const Default: Story = {
  render: () => <WizardHarness />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Basic Info' })).toBeInTheDocument();
    const nextButton = canvas.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeDisabled();

    fireEvent.change(canvas.getByLabelText('Client'), { target: { value: 'ITDO' } });
    await expect(nextButton).toBeEnabled();
    fireEvent.click(nextButton);
    await expect(canvas.getByRole('heading', { name: 'Budget' })).toBeInTheDocument();
  },
};

export const WithLeaveGuard: Story = {
  render: () => <WizardHarness />,
};
