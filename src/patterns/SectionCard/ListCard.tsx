import clsx from 'clsx';
import { ListCardProps } from './SectionCard.types';
import './SectionCard.css';

const fallbackItemKey = <T,>(item: T, index: number) => {
  if (typeof item === 'object' && item !== null && 'id' in item) {
    const candidateId = (item as { id?: unknown }).id;
    if (typeof candidateId === 'string' || typeof candidateId === 'number') {
      return String(candidateId);
    }
  }
  return String(index);
};

export const ListCard = <T,>({
  header,
  items,
  renderItem,
  empty,
  listLabel,
  density = 'comfortable',
  className,
  getItemKey,
}: ListCardProps<T>) => {
  return (
    <section className={clsx('itdo-list-card', `itdo-list-card--${density}`, className)}>
      <header className="itdo-list-card__header">{header}</header>
      {items.length === 0 ? (
        <div className="itdo-list-card__empty">{empty ?? <span aria-hidden="true">-</span>}</div>
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
