import { render, screen } from '@testing-library/react';
import { Select } from './Select';

describe('Select', () => {
  const options = (
    <>
      <option value="a">Option A</option>
      <option value="b">Option B</option>
    </>
  );

  it('applies warning class and validation message', () => {
    render(
      <Select
        label="Role"
        validationState="warning"
        validationMessage="Review the selected role"
      >
        {options}
      </Select>
    );

    const select = screen.getByRole('combobox', { name: 'Role' });
    expect(select).toHaveClass('itdo-select--warning');
    expect(screen.getByText('Review the selected role')).toBeInTheDocument();
  });

  it('applies success state from legacy success prop', () => {
    render(
      <Select label="Status" success="Selection is valid">
        {options}
      </Select>
    );

    const select = screen.getByRole('combobox', { name: 'Status' });
    expect(select).toHaveClass('itdo-select--success');
    expect(screen.getByText('Selection is valid')).toBeInTheDocument();
  });

  it('applies validating class', () => {
    render(
      <Select
        label="Dependency"
        validationState="validating"
        validationMessage="Checking dependency..."
      >
        {options}
      </Select>
    );

    const select = screen.getByRole('combobox', { name: 'Dependency' });
    expect(select).toHaveClass('itdo-select--validating');
    expect(screen.getByText('Checking dependency...')).toBeInTheDocument();
  });
});
