import clsx from 'clsx';
import { ListCardProps } from './SectionCard.types';
import './SectionCard.css';

const fallbackItemKey = <T,>(item: T, index: number) => {
  if (typeof item === 'object' && item !== null && 'id' in item) {
    const record = item as { id?: string | number };
    if (record.id !== undefined) {
      return String(record.id);
    }
  }
  return String(index);
};

export const ListCard = <T,>({
  header,
  items,
  renderItem,
  empty,
  listLabel = 'List card items',
  density = 'comfortable',
  className,
  getItemKey,
}: ListCardProps<T>) => {
  return (
    <section className={clsx('itdo-list-card', `itdo-list-card--${density}`, className)}>
      <header className="itdo-list-card__header">{header}</header>
      {items.length === 0 ? (
        <div className="itdo-list-card__empty">{empty ?? 'No items found.'}</div>
      ) : (
        <ul className="itdo-list-card__list" aria-label={listLabel}>
          {items.map((item, index) => (
            <li key={(getItemKey ?? fallbackItemKey)(item, index)} className="itdo-list-card__item">
              {renderItem(item, index)}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
