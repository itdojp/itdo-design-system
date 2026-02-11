import { fireEvent, render, screen } from '@testing-library/react';
import { DateRangePicker, DateTimeRangePicker } from './DateRangePicker';
import type { DateRangePreset } from './DateRangePicker.types';

describe('DateRangePicker', () => {
  it('calls onChange when from/to are updated', () => {
    const onChange = jest.fn();

    render(
      <DateRangePicker value={{ from: '2026-02-01', to: '2026-02-05' }} onChange={onChange} />
    );

    const fromInput = screen.getByLabelText('From') as HTMLInputElement;
    const toInput = screen.getByLabelText('To') as HTMLInputElement;

    fireEvent.change(fromInput, { target: { value: '2026-02-02' } });
    fireEvent.change(toInput, { target: { value: '2026-02-07' } });

    expect(onChange).toHaveBeenNthCalledWith(1, { from: '2026-02-02', to: '2026-02-05' });
    expect(onChange).toHaveBeenNthCalledWith(2, { from: '2026-02-01', to: '2026-02-07' });
  });

  it('shows immediate validation error when from is greater than to', () => {
    render(
      <DateRangePicker value={{ from: '2026-02-15', to: '2026-02-01' }} onChange={jest.fn()} />
    );

    expect(screen.getByText('From must be earlier than or equal to To.')).toBeInTheDocument();
    expect(screen.getByLabelText('From')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('To')).toHaveAttribute('aria-invalid', 'true');
  });

  it('supports presets and clear action', () => {
    const onChange = jest.fn();
    const presets: DateRangePreset[] = [
      {
        id: 'fixed',
        label: 'Fiscal period',
        resolveValue: () => ({
          from: '2026-01-01',
          to: '2026-03-31',
        }),
      },
    ];

    render(<DateRangePicker value={{}} onChange={onChange} presets={presets} />);

    fireEvent.click(screen.getByRole('button', { name: 'Fiscal period' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear' }));

    expect(onChange).toHaveBeenNthCalledWith(1, { from: '2026-01-01', to: '2026-03-31' });
    expect(onChange).toHaveBeenNthCalledWith(2, {});
  });

  it('validates empty edges when allowEmpty* is false', () => {
    const { rerender } = render(
      <DateRangePicker
        value={{}}
        onChange={jest.fn()}
        allowEmptyFrom={false}
        allowEmptyTo={false}
      />
    );

    expect(screen.getByText('From is required.')).toBeInTheDocument();

    rerender(
      <DateRangePicker
        value={{ from: '2026-02-01' }}
        onChange={jest.fn()}
        allowEmptyFrom={false}
        allowEmptyTo={false}
      />
    );

    expect(screen.getByText('To is required.')).toBeInTheDocument();
  });

  it('separates disabled and readOnly states', () => {
    const { rerender } = render(
      <DateRangePicker value={{ from: '2026-02-01', to: '2026-02-03' }} onChange={jest.fn()} disabled />
    );

    expect(screen.getByLabelText('From')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();

    rerender(
      <DateRangePicker value={{ from: '2026-02-01', to: '2026-02-03' }} onChange={jest.fn()} readOnly />
    );

    const fromInput = screen.getByLabelText('From') as HTMLInputElement;
    expect(fromInput).not.toBeDisabled();
    expect(fromInput.readOnly).toBe(true);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeDisabled();
  });
});

describe('DateTimeRangePicker', () => {
  it('renders timezone label and datetime-local inputs', () => {
    render(
      <DateTimeRangePicker
        value={{ from: '2026-02-10T09:00', to: '2026-02-10T18:00' }}
        onChange={jest.fn()}
        timezoneLabel="Timezone: UTC+09:00 (Asia/Tokyo)"
      />
    );

    expect(screen.getByText('Timezone: UTC+09:00 (Asia/Tokyo)')).toBeInTheDocument();
    expect(screen.getByLabelText('From')).toHaveAttribute('type', 'datetime-local');
    expect(screen.getByLabelText('To')).toHaveAttribute('type', 'datetime-local');
  });
});
