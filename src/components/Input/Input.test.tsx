import { render, screen } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  it('applies error class and message from legacy error prop', () => {
    render(<Input label="Email" error="Invalid email" />);

    const input = screen.getByRole('textbox', { name: 'Email' });
    expect(input).toHaveClass('itdo-input--error');
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('uses validationState and validationMessage when provided', () => {
    render(
      <Input
        label="Code"
        error="Legacy error"
        validationState="warning"
        validationMessage="Check this code before submit"
      />
    );

    const input = screen.getByRole('textbox', { name: 'Code' });
    expect(input).toHaveClass('itdo-input--warning');
    expect(screen.getByText('Check this code before submit')).toBeInTheDocument();
    expect(screen.queryByText('Legacy error')).not.toBeInTheDocument();
  });

  it('keeps helper text fallback compatibility', () => {
    render(<Input label="Legacy" helperText="Legacy helper text" />);
    expect(screen.getByText('Legacy helper text')).toBeInTheDocument();
  });
});
