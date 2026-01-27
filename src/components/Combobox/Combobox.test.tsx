import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Combobox } from './Combobox';
import type { ComboboxItem } from './Combobox.types';

const items: ComboboxItem[] = [
  { id: '1', label: 'Alpha', value: 'A1' },
  { id: '2', label: 'Beta', value: 'B2' },
  { id: '3', label: 'Gamma' },
];

describe('Combobox', () => {
  it('opens list and selects an item', () => {
    const onSelect = jest.fn();
    render(<Combobox label="Search" placeholder="Search" items={items} onSelect={onSelect} />);

    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'a' } });

    const listbox = screen.getByRole('listbox');
    expect(listbox).toBeInTheDocument();

    fireEvent.click(screen.getByRole('option', { name: 'Alpha' }));
    expect(onSelect).toHaveBeenCalledWith(items[0]);
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('updates aria-activedescendant on keyboard navigation', () => {
    render(<Combobox label="Search" placeholder="Search" items={items} />);
    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'a' } });

    const options = screen.getAllByRole('option');
    expect(input).toHaveAttribute('aria-activedescendant', options[0].id);

    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-activedescendant', options[1].id);
  });

  it('loads options with debounce and shows error on failure', async () => {
    jest.useFakeTimers();
    const loadOptions = jest.fn(async () => {
      throw new Error('load failed');
    });

    render(
      <Combobox label="Search" placeholder="Search" loadOptions={loadOptions} debounceMs={300} />
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'a' } });

    await act(async () => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(loadOptions).toHaveBeenCalledWith('a');
    });

    await waitFor(() => {
      expect(screen.getByText('Failed to load results')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });
});
