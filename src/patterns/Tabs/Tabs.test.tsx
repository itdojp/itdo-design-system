import { fireEvent, render, screen } from '@testing-library/react';
import { Tabs } from './Tabs';
import { TabItem } from './Tabs.types';

const items: TabItem[] = [
  { id: 'summary', label: 'Summary', panel: 'Summary panel' },
  { id: 'activity', label: 'Activity', panel: 'Activity panel' },
  { id: 'settings', label: 'Settings', panel: 'Settings panel' },
];

describe('Tabs', () => {
  it('renders first tab as active by default', () => {
    render(<Tabs items={items} />);

    expect(screen.getByRole('tab', { name: 'Summary' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Summary panel');
  });

  it('changes active tab and calls callback on click', () => {
    const onValueChange = jest.fn();

    render(<Tabs items={items} onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Settings' }));

    expect(onValueChange).toHaveBeenCalledWith('settings');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Settings panel');
  });

  it('moves focus and selection by ArrowRight and skips disabled tabs', () => {
    const disabledItems: TabItem[] = [
      { id: 'summary', label: 'Summary', panel: 'Summary panel' },
      { id: 'activity', label: 'Activity', panel: 'Activity panel', disabled: true },
      { id: 'settings', label: 'Settings', panel: 'Settings panel' },
    ];

    render(<Tabs items={disabledItems} />);

    const summaryTab = screen.getByRole('tab', { name: 'Summary' });
    summaryTab.focus();
    fireEvent.keyDown(summaryTab, { key: 'ArrowRight' });

    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveAttribute('aria-selected', 'true');
  });

  it('keeps controlled value and only emits onValueChange', () => {
    const onValueChange = jest.fn();

    render(<Tabs items={items} value="activity" onValueChange={onValueChange} />);

    fireEvent.click(screen.getByRole('tab', { name: 'Summary' }));

    expect(onValueChange).toHaveBeenCalledWith('summary');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity panel');
  });
});
