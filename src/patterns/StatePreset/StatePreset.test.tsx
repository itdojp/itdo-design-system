import { fireEvent, render, screen } from '@testing-library/react';
import { StatePreset } from './StatePreset';

describe('StatePreset', () => {
  it('renders loading mode', () => {
    render(<StatePreset mode="loading" loading={{ label: 'Loading account data...' }} />);

    expect(screen.getByText('Loading account data...')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Loading account data...' })).toBeInTheDocument();
  });

  it('renders empty mode', () => {
    render(
      <StatePreset
        mode="empty"
        empty={{
          title: 'No invoices',
          description: 'Create a new invoice to continue.',
        }}
      />
    );

    expect(screen.getByText('No invoices')).toBeInTheDocument();
    expect(screen.getByText('Create a new invoice to continue.')).toBeInTheDocument();
  });

  it('renders error actions in retry-contact-fallback order and executes callbacks', () => {
    const onRetry = jest.fn();
    const onContact = jest.fn();
    const onFallback = jest.fn();
    render(
      <StatePreset
        mode="error"
        error={{
          title: 'Save failed',
          detail: 'HTTP 503',
          retry: { label: 'Retry', onClick: onRetry },
          contact: { label: 'Contact support', onClick: onContact },
          fallback: { label: 'Back to list', onClick: onFallback },
        }}
      />
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons[0]).toHaveTextContent('Retry');
    expect(buttons[1]).toHaveTextContent('Contact support');
    expect(buttons[2]).toHaveTextContent('Back to list');

    fireEvent.click(buttons[0]);
    fireEvent.click(buttons[1]);
    fireEvent.click(buttons[2]);

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(onContact).toHaveBeenCalledTimes(1);
    expect(onFallback).toHaveBeenCalledTimes(1);
  });

  it('renders success mode with actions', () => {
    const onView = jest.fn();
    render(
      <StatePreset
        mode="success"
        success={{
          title: 'Invoice approved',
          description: 'The invoice is now available for export.',
          primaryAction: { label: 'View invoice', onClick: onView },
        }}
      />
    );

    expect(screen.getByText('Invoice approved')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'View invoice' }));
    expect(onView).toHaveBeenCalledTimes(1);
  });
});
