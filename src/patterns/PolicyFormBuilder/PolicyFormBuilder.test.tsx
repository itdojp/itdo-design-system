import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { PolicyFormBuilder } from './PolicyFormBuilder';
import type { PolicyFormSchema, PolicyFormValue } from './PolicyFormBuilder.types';

const baseSchema: PolicyFormSchema = {
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    {
      name: 'mode',
      label: 'Mode',
      type: 'select',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Advanced', value: 'advanced' },
      ],
      required: true,
    },
    { name: 'enabled', label: 'Enabled', type: 'checkbox' },
    {
      name: 'advancedComment',
      label: 'Advanced comment',
      type: 'textarea',
      visibleWhen: (value) => value.mode === 'advanced',
    },
    { name: 'ruleJson', label: 'Rule JSON', type: 'json' },
  ],
};

const FormHarness = ({
  initialValue,
  onSubmit,
}: {
  initialValue: PolicyFormValue;
  onSubmit: (next: PolicyFormValue) => void;
}) => {
  const [value, setValue] = useState<PolicyFormValue>(initialValue);
  return (
    <PolicyFormBuilder schema={baseSchema} value={value} onChange={setValue} onSubmit={onSubmit} />
  );
};

describe('PolicyFormBuilder', () => {
  it('renders supported field controls', () => {
    render(
      <PolicyFormBuilder
        schema={baseSchema}
        value={{ name: 'Policy A', mode: 'standard', enabled: false }}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByRole('textbox', { name: /Name/ })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Mode/ })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Enabled' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Rule JSON' })).toBeInTheDocument();
  });

  it('applies visibility condition for fields', () => {
    const { rerender } = render(
      <PolicyFormBuilder
        schema={baseSchema}
        value={{ name: 'Policy A', mode: 'standard' }}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.queryByRole('textbox', { name: 'Advanced comment' })).not.toBeInTheDocument();

    rerender(
      <PolicyFormBuilder
        schema={baseSchema}
        value={{ name: 'Policy A', mode: 'advanced' }}
        onChange={jest.fn()}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByRole('textbox', { name: 'Advanced comment' })).toBeInTheDocument();
  });

  it('shows aggregate validation errors and blocks submit', () => {
    const onSubmit = jest.fn();
    render(
      <PolicyFormBuilder
        schema={baseSchema}
        value={{ name: '', mode: '', ruleJson: '{invalid}' }}
        onChange={jest.fn()}
        onSubmit={onSubmit}
      />
    );

    const alert = screen.getByRole('alert');
    expect(within(alert).getByText('Validation errors')).toBeInTheDocument();
    expect(within(alert).getByText('Name is required.')).toBeInTheDocument();
    expect(within(alert).getByText('Mode is required.')).toBeInTheDocument();
    expect(within(alert).getByText('Rule JSON must be valid JSON.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save policy' })).toBeDisabled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('normalizes json fields on submit', () => {
    const onSubmit = jest.fn();
    render(
      <FormHarness
        initialValue={{
          name: 'Policy A',
          mode: 'standard',
          ruleJson: '{"retry":3,"escalate":true}',
        }}
        onSubmit={onSubmit}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save policy' }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Policy A',
        mode: 'standard',
        ruleJson: { retry: 3, escalate: true },
      })
    );
  });

  it('preserves numeric value type for select fields', () => {
    const onChange = jest.fn();
    const schema: PolicyFormSchema = {
      fields: [
        {
          name: 'level',
          label: 'Level',
          type: 'select',
          options: [
            { label: 'One', value: 1 },
            { label: 'Two', value: 2 },
          ],
        },
      ],
    };

    render(
      <PolicyFormBuilder
        schema={schema}
        value={{ level: 1 }}
        onChange={onChange}
        onSubmit={jest.fn()}
      />
    );

    fireEvent.change(screen.getByRole('combobox', { name: 'Level' }), {
      target: { value: '2' },
    });

    expect(onChange).toHaveBeenCalledWith({ level: 2 });
  });

  it('keeps text fields readable in readOnly mode and disables actions', () => {
    const onReset = jest.fn();
    const onSubmit = jest.fn();

    const { container } = render(
      <PolicyFormBuilder
        schema={baseSchema}
        value={{ name: 'Policy A', mode: 'standard', enabled: true, ruleJson: '{"ok":true}' }}
        onChange={jest.fn()}
        onSubmit={onSubmit}
        onReset={onReset}
        readOnly
      />
    );

    expect(screen.getByRole('textbox', { name: /Name/ })).toHaveAttribute('readonly');
    expect(screen.getByRole('textbox', { name: 'Rule JSON' })).toHaveAttribute('readonly');
    expect(screen.getByRole('combobox', { name: /Mode/ })).toBeDisabled();
    expect(screen.getByRole('checkbox', { name: 'Enabled' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Save policy' })).toBeDisabled();

    fireEvent.submit(container.querySelector('form') as HTMLFormElement);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(onReset).not.toHaveBeenCalled();
  });
});
