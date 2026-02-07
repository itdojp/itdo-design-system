import { render, screen } from '@testing-library/react';
import { FormField } from './FormField';

describe('FormField', () => {
  it('applies validation message and aria attributes', () => {
    render(
      <FormField
        label="Email"
        helpText="Use company email"
        validationState="error"
        validationMessage="Invalid email format"
      >
        <input />
      </FormField>
    );

    const control = screen.getByRole('textbox', { name: 'Email' });
    const message = screen.getByText('Invalid email format');
    const help = screen.getByText('Use company email');
    const describedBy = control.getAttribute('aria-describedby') ?? '';

    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(describedBy).toContain(message.id);
    expect(describedBy).toContain(help.id);
  });

  it('sets aria-busy while validating', () => {
    render(
      <FormField
        label="Project code"
        validationState="validating"
        validationMessage="Validating..."
      >
        <input />
      </FormField>
    );

    const control = screen.getByRole('textbox', { name: 'Project code' });
    expect(control).toHaveAttribute('aria-busy', 'true');
    expect(control).not.toHaveAttribute('aria-invalid', 'true');
  });

  it('prioritizes hint over helpText', () => {
    render(
      <FormField label="Notes" helpText="Legacy help" hint="Use 1-2 concise sentences">
        <textarea />
      </FormField>
    );

    expect(screen.getByText('Use 1-2 concise sentences')).toBeInTheDocument();
    expect(screen.queryByText('Legacy help')).not.toBeInTheDocument();
  });
});
