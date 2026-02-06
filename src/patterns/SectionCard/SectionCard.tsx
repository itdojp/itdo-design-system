import clsx from 'clsx';
import { SectionCardProps } from './SectionCard.types';
import './SectionCard.css';

export const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  actions,
  children,
  footer,
  density = 'comfortable',
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
}) => {
  return (
    <section className={clsx('itdo-section-card', `itdo-section-card--${density}`, className)}>
      <header className={clsx('itdo-section-card__header', headerClassName)}>
        <div className="itdo-section-card__heading">
          <h3 className="itdo-section-card__title">{title}</h3>
          {description && <p className="itdo-section-card__description">{description}</p>}
        </div>
        {actions && <div className="itdo-section-card__actions">{actions}</div>}
      </header>
      <div className={clsx('itdo-section-card__body', bodyClassName)}>{children}</div>
      {footer && <footer className={clsx('itdo-section-card__footer', footerClassName)}>{footer}</footer>}
    </section>
  );
};
