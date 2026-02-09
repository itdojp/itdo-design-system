import { fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { FormWizard } from './FormWizard';

const NavigationHarness = () => {
  const [firstComplete, setFirstComplete] = useState(false);

  return (
    <FormWizard
      steps={[
        {
          id: 'step-1',
          title: 'Step 1',
          isComplete: firstComplete,
          content: (
            <button type="button" onClick={() => setFirstComplete(true)}>
              mark-step-1-complete
            </button>
          ),
        },
        {
          id: 'step-2',
          title: 'Step 2',
          isComplete: true,
          content: <div>step-2-content</div>,
        },
      ]}
    />
  );
};

describe('FormWizard', () => {
  it('blocks next until current step completion condition is satisfied', () => {
    render(<NavigationHarness />);

    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeDisabled();

    fireEvent.click(screen.getByText('mark-step-1-complete'));
    expect(nextButton).toBeEnabled();

    fireEvent.click(nextButton);
    expect(screen.getByText('step-2-content')).toBeInTheDocument();
  });

  it('submits on last step', () => {
    const onSubmit = jest.fn();

    render(
      <FormWizard
        defaultValue="review"
        onSubmit={onSubmit}
        steps={[
          {
            id: 'basic',
            title: 'Basic',
            isComplete: true,
            content: <div>basic</div>,
          },
          {
            id: 'review',
            title: 'Review',
            isComplete: true,
            content: <div>review</div>,
          },
        ]}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('registers beforeunload guard when dirty and protection is enabled', () => {
    render(
      <FormWizard
        isDirty
        protectUnsavedChanges
        steps={[
          {
            id: 'single',
            title: 'Single',
            isComplete: true,
            content: <div>single-content</div>,
          },
        ]}
      />
    );

    const beforeUnload = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(beforeUnload);
    expect(beforeUnload.defaultPrevented).toBe(true);
  });
});
