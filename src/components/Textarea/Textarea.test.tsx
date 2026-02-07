import { fireEvent, render, screen } from '@testing-library/react';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('shows character count when maxLength is set', () => {
    render(
      <Textarea
        label="Comment"
        maxLength={10}
        defaultValue="abc"
        placeholder="Type"
      />
    );

    expect(screen.getByText('3/10')).toBeInTheDocument();

    const textarea = screen.getByRole('textbox', { name: 'Comment' });
    fireEvent.change(textarea, { target: { value: 'abcdef' } });
    expect(screen.getByText('6/10')).toBeInTheDocument();
  });

  it('updates count when value is controlled', () => {
    const { rerender } = render(
      <Textarea label="Controlled" maxLength={20} value="initial" readOnly />
    );

    expect(screen.getByText('7/20')).toBeInTheDocument();

    rerender(<Textarea label="Controlled" maxLength={20} value="updated value" readOnly />);
    expect(screen.getByText('13/20')).toBeInTheDocument();
  });

  it('applies validation state style contract', () => {
    render(
      <Textarea
        label="Summary"
        validationState="warning"
        validationMessage="Please remove internal terms"
      />
    );

    const textarea = screen.getByRole('textbox', { name: 'Summary' });
    expect(textarea).toHaveClass('itdo-textarea--warning');
    expect(screen.getByText('Please remove internal terms')).toBeInTheDocument();
  });
});
