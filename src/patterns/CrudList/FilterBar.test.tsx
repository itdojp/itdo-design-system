import { fireEvent, render, screen } from '@testing-library/react';
import { FilterBar } from './FilterBar';

describe('FilterBar', () => {
  it('updates search value through callback', () => {
    const onChange = jest.fn();

    render(
      <FilterBar
        search={{
          value: '',
          onChange,
          placeholder: 'Search',
        }}
      />
    );

    fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'invoice' } });
    expect(onChange).toHaveBeenCalledWith('invoice');
  });

  it('invokes chip remove and clear all handlers', () => {
    const onRemove = jest.fn();
    const onClearAll = jest.fn();

    render(
      <FilterBar
        chips={[{ key: 'status', label: 'Status: Pending', onRemove }]}
        onClearAll={onClearAll}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove filter: Status: Pending' }));
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
    expect(onClearAll).toHaveBeenCalledTimes(1);
  });

  it('handles saved view selection and save action', () => {
    const onSelect = jest.fn();
    const onSave = jest.fn();

    render(
      <FilterBar
        savedViews={{
          items: [
            { id: 'all', name: 'All' },
            { id: 'pending', name: 'Pending' },
          ],
          selectedId: 'all',
          onSelect,
          onSave,
        }}
      />
    );

    fireEvent.change(screen.getByLabelText('Saved view'), { target: { value: 'pending' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSelect).toHaveBeenCalledWith('pending');
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  it('switches logical operator in structured filters', () => {
    const onChange = jest.fn();

    render(
      <FilterBar
        logic={{
          value: 'and',
          onChange,
        }}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'OR' }));
    expect(onChange).toHaveBeenCalledWith('or');
  });

  it('supports custom logic labels for i18n', () => {
    render(
      <FilterBar
        labels={{
          logicLabel: '条件結合',
          logicAriaLabel: '絞り込み条件結合',
          logicAnd: 'かつ',
          logicOr: 'または',
        }}
        logic={{
          value: 'and',
          onChange: () => undefined,
        }}
      />
    );

    expect(screen.getByText('条件結合')).toBeInTheDocument();
    expect(screen.getByRole('group', { name: '絞り込み条件結合' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'かつ' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'または' })).toBeInTheDocument();
  });
});
