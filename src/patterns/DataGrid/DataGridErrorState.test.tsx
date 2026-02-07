import { fireEvent, render, screen } from '@testing-library/react';
import { Button } from '../../components/Button';
import { DataGridErrorState } from './DataGridErrorState';

describe('DataGridErrorState', () => {
  it('renders default error message', () => {
    render(<DataGridErrorState />);

    expect(screen.getByText('Failed to load')).toBeInTheDocument();
    expect(screen.getByText('Please refresh or try again later.')).toBeInTheDocument();
  });

  it('renders custom action', () => {
    const onRetry = jest.fn();

    render(
      <DataGridErrorState
        action={
          <Button size="small" onClick={onRetry}>
            Retry
          </Button>
        }
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
